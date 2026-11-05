const Clinic = require('./clinic.model');
const User = require('../Auth/user.model');
const bcrypt = require('bcryptjs'); 

const createClinicWithAdmin = async (data) => {
  const { name, slug, phoneNumbers, address, location, logo, adminData } = data;

  const existingClinic = await Clinic.findOne({ slug });
  if (existingClinic) {
    throw new Error('Clinic slug already exists');
  }

  const clinic = await Clinic.create({
    name,
    slug,
    phoneNumbers,
    address,
    location,
    logo,
  });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(adminData.password, salt);

  const adminUser = await User.create({
    name: adminData.name,
    email: adminData.email,
    nationalId: adminData.nationalId,
    password: hashedPassword,
    phone: adminData.phone,
    role: 'clinicadmin',
    clinicId: clinic._id,
  });

  adminUser.password = undefined;

  return { clinic, admin: adminUser };
};

const getAllClinics = async () => {
  return await Clinic.find();
};

const getClinicBySlug = async (slug) => {
  const clinic = await Clinic.findOne({ slug, isActive: true });
  if (!clinic) {
    throw new Error('Clinic not found or inactive');
  }
  return clinic;
};

module.exports = {
  createClinicWithAdmin,
  getAllClinics,
  getClinicBySlug,
};