const { z } = require('zod');
const { DateTime } = require('luxon');
const text = z.string().trim().min(1).max(200);
const optional = z.string().trim().max(2000).default('');
const id = z.string().regex(/^[a-f\d]{24}$/i, 'معرّف غير صحيح');
const url = z.union([z.literal(''), z.url().refine(v => /^https?:\/\//.test(v))]).default('');
const active = z.boolean().default(true);
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const password = z.string().min(12, 'كلمة المرور يجب أن تكون 12 حرفًا على الأقل').max(72).refine(v => Buffer.byteLength(v) <= 72);
const schemas = {
  specialties: z.object({ name: text, description: optional, icon: z.string().max(20).default(''), isActive: active }).strict(),
  doctors: z.object({ name: text, title: text, email: z.email().max(254), specialtyId: id, bio: optional, image: url, isActive: active }).strict(),
  services: z.object({ title: text, description: optional, price: z.number().min(0).max(1000000), specialtyId: id.nullable().default(null), isActive: active }).strict(),
  schedules: z.object({ doctorId: id, date: z.string().refine(v => /^\d{4}-\d{2}-\d{2}$/.test(v) && DateTime.fromISO(v).isValid), startTime: time, endTime: time, slotMinutes: z.number().int().min(5).max(120), isActive: active }).strict(),
  bookings: z.object({ scheduleId: id, startTime: time, patientName: text, phone: z.string().regex(/^\+?[\d ()-]{8,20}$/), isActive: active }).strict(),
};
const clinic = z.object({ name: text, slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80).refine(v => !['login','clinic-admin','super-admin','api'].includes(v)), address: text, phoneNumbers: z.array(z.string().regex(/^\+?[\d ()-]{8,20}$/)).max(5), logo: url,
  adminData: z.object({ name: text, email: z.email(), nationalId: z.string().regex(/^\d{14}$/), password, phone: z.string().max(20).default('') }).strict(),
}).strict();
module.exports = { schemas, clinic, id, password, login: z.object({ nationalId: z.string().regex(/^\d{14}$/), password: z.string().min(1).max(72) }).strict() };
