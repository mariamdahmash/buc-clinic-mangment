const User = require('../src/modules/Auth/user.model');
const bcrypt = require('bcryptjs');
const { password } = require('../src/platform/validation');
module.exports = async function seedSuperAdmin() {
  if (await User.exists({ role: 'superadmin' })) return;
  const secret = process.env.SUPERADMIN_PASSWORD;
  if (!secret) throw new Error('Set SUPERADMIN_PASSWORD, SUPERADMIN_EMAIL and SUPERADMIN_NATIONAL_ID for first setup');
  password.parse(secret);
  if (!/^\d{14}$/.test(process.env.SUPERADMIN_NATIONAL_ID || '') || !/^[^@]+@[^@]+\.[^@]+$/.test(process.env.SUPERADMIN_EMAIL || '')) throw new Error('Invalid super admin setup');
  await User.create({ name: 'مدير النظام', email: process.env.SUPERADMIN_EMAIL, nationalId: process.env.SUPERADMIN_NATIONAL_ID, password: await bcrypt.hash(secret, 12), role: 'superadmin' });
};
