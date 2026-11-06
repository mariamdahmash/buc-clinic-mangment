const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
process.env.JWT_SECRET = 'test-only-secret-'.repeat(4);
process.env.MONGOMS_DOWNLOAD_DIR = path.resolve(__dirname, '../.cache/mongodb');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const M = require('../config/models');
const app = require('../src/app');
let db, a, b, ta, tb, superToken, special, doctor, schedule;
const auth = t => ({ Authorization: 'Bearer '+t });
const post = (url, body, token=ta) => request(app).post('/api/v1'+url).set(auth(token)).send(body);
before(async()=>{
 fs.mkdirSync(path.resolve(__dirname,'../.cache'),{recursive:true});
 const dbPath=fs.mkdtempSync(path.resolve(__dirname,'../.cache/test-db-'));
 db=await MongoMemoryReplSet.create({replSet:{count:1},instanceOpts:[{launchTimeout:60000,dbPath}]});
 await mongoose.connect(db.getUri());
 await Promise.all(Object.values(M).map(m=>m.init()));
 a=await M.Clinic.create({name:'A',slug:'clinic-a',address:'Cairo'});
 b=await M.Clinic.create({name:'B',slug:'clinic-b',address:'Cairo'});
 for(const [clinic,key] of [[a,'a'],[b,'b'],[null,'s']]){
  const u=await M.User.create({name:key,email:key+'@example.com',nationalId:key,password:'unused-hash',role:clinic?'clinicadmin':'superadmin',clinicId:clinic?.id});
  const token=jwt.sign({id:u.id},process.env.JWT_SECRET);if(key==='a')ta=token;else if(key==='b')tb=token;else superToken=token;
 }
 special=(await post('/specialties',{name:'General'})).body.data;
 doctor=(await post('/doctors',{name:'Doctor',title:'Consultant',email:'doc@example.com',specialtyId:special._id})).body.data;
 schedule=(await post('/schedules',{doctorId:doctor._id,date:'2099-05-20',startTime:'10:00',endTime:'12:00',slotMinutes:30})).body.data;
 assert.ok(schedule?._id);
});
after(async()=>{await mongoose.disconnect();await db?.stop();});
test('public registration cannot elevate role',async()=>{assert.equal((await post('/auth/register',{role:'superadmin'})).status,403);});
test('authentication and live role required',async()=>{
 assert.equal((await request(app).get('/api/v1/doctors')).status,401);
 assert.equal((await post('/clinics',{},ta)).status,403);
 const fake=jwt.sign({id:'111111111111111111111111',role:'superadmin'},process.env.JWT_SECRET);
 assert.equal((await request(app).get('/api/v1/clinics').set(auth(fake))).status,401);
});
test('tenant list and updates are isolated',async()=>{
 assert.deepEqual((await request(app).get('/api/v1/doctors').set(auth(tb))).body.data,[]);
 assert.equal((await request(app).patch('/api/v1/doctors/'+doctor._id+'/status').set(auth(tb)).send({isActive:false})).status,404);
 assert.equal((await request(app).delete('/api/v1/doctors/'+doctor._id).set(auth(tb))).status,404);
});
test('cross-clinic references and injected fields rejected',async()=>{
 assert.equal((await post('/doctors',{name:'X',title:'X',email:'x@example.com',specialtyId:special._id},tb)).status,400);
 assert.equal((await post('/specialties',{name:'X',clinicId:b.id})).status,400);
 assert.equal((await post('/auth/login',{nationalId:{$ne:null},password:'x'})).status,400);
});
test('overlapping and invalid schedules rejected',async()=>{
 assert.equal((await post('/schedules',{doctorId:doctor._id,date:'2099-05-20',startTime:'11:00',endTime:'13:00',slotMinutes:30})).status,409);
 assert.equal((await post('/schedules',{doctorId:doctor._id,date:'2099-05-20',startTime:'13:00',endTime:'12:00',slotMinutes:30})).status,400);
});
test('concurrent booking cannot double-book; public output has no patient data',async()=>{
 const payload={scheduleId:schedule._id,startTime:'10:00',patientName:'Test Patient',phone:'01012345678'};
 const results=await Promise.all([1,2].map(()=>request(app).post('/api/v1/public/clinics/clinic-a/bookings').send(payload)));
 assert.deepEqual(results.map(r=>r.status).sort(),[201,409]);
 const slots=await request(app).get('/api/v1/public/clinics/clinic-a/slots/'+schedule._id);
 assert.ok(!slots.body.data.includes('10:00'));
 const page=await request(app).get('/api/v1/public/clinics/clinic-a');
 assert.equal(page.status,200);assert.ok(!JSON.stringify(page.body).includes('Test Patient'));assert.equal(page.body.data.doctors[0].email,undefined);
 const booking=await M.bookings.findOne({scheduleId:schedule._id});
 assert.equal((await request(app).patch('/api/v1/schedules/'+schedule._id+'/status').set(auth(ta)).send({isActive:false})).status,409);
 assert.equal((await request(app).patch('/api/v1/bookings/'+booking.id+'/status').set(auth(ta)).send({isActive:false})).status,200);
 assert.ok((await request(app).get('/api/v1/public/clinics/clinic-a/slots/'+schedule._id)).body.data.includes('10:00'));
});
test('public booking rejects foreign schedule and arbitrary times',async()=>{
 const body={scheduleId:schedule._id,startTime:'10:15',patientName:'P',phone:'01012345678'};
 assert.equal((await request(app).post('/api/v1/public/clinics/clinic-a/bookings').send(body)).status,400);
 assert.equal((await request(app).post('/api/v1/public/clinics/clinic-b/bookings').send({...body,startTime:'11:00'})).status,400);
});
test('linked deletes protected and inactive specialty hidden',async()=>{
 assert.equal((await request(app).delete('/api/v1/specialties/'+special._id).set(auth(ta))).status,409);
 assert.equal((await request(app).patch('/api/v1/specialties/'+special._id+'/status').set(auth(ta)).send({isActive:false})).status,200);
 const page=(await request(app).get('/api/v1/public/clinics/clinic-a')).body.data;
 assert.equal(page.doctors.length,0);assert.equal(page.schedules.length,0);
});
test('failed clinic account creation rolls back clinic',async()=>{
 const body={name:'Rollback',slug:'rollback',address:'Cairo',phoneNumbers:[],adminData:{name:'Admin',email:'a@example.com',nationalId:'12345678901234',password:'Long-password-123'}};
 assert.equal((await post('/clinics',body,superToken)).status,409);
 assert.equal(await M.Clinic.countDocuments({slug:'rollback'}),0);
});
test('CRUD services and no tenant transfer',async()=>{
 let r=await post('/services',{title:'Checkup',price:20});assert.equal(r.status,201);const id=r.body.data._id;
 r=await request(app).put('/api/v1/services/'+id).set(auth(ta)).send({title:'Updated',price:30,isActive:false});assert.equal(r.status,200);
 assert.equal((await request(app).delete('/api/v1/services/'+id).set(auth(ta))).status,200);
});
test('clinic disable revokes existing admin access',async()=>{
 assert.equal((await request(app).patch('/api/v1/clinics/'+b.id+'/status').set(auth(superToken)).send({isActive:false})).status,200);
 assert.equal((await request(app).get('/api/v1/doctors').set(auth(tb))).status,403);
 assert.equal((await request(app).get('/api/v1/public/clinics/clinic-b')).status,404);
});


test('provisioned clinic admin can log in and only sees their clinic', async () => {
 const password = 'New-clinic-password-123';
 const nationalId = '98765432101234';
 const created = await post('/clinics', {
  name: 'New Clinic', slug: 'new-clinic', address: 'Cairo', phoneNumbers: [],
  adminData: { name: 'New Admin', email: 'new@example.com', nationalId, password },
 }, superToken);
 assert.equal(created.status, 201);
 const login = await post('/auth/login', { nationalId, password });
 assert.equal(login.status, 200);
 assert.equal(login.body.data.user.role, 'clinicadmin');
 assert.equal(login.body.data.user.password, undefined);
 const token = login.body.data.token;
 const own = await request(app).get('/api/v1/clinic/me').set(auth(token));
 assert.equal(own.status, 200);
 assert.equal(own.body.data.slug, 'new-clinic');
 assert.deepEqual((await request(app).get('/api/v1/doctors').set(auth(token))).body.data, []);
 assert.equal((await post('/auth/login', { nationalId, password: 'incorrect-password' })).status, 401);
 assert.equal((await request(app).patch('/api/v1/clinics/' + own.body.data._id + '/status').set(auth(superToken)).send({ isActive: false })).status, 200);
 assert.equal((await post('/auth/login', { nationalId, password })).status, 403);
});
