const User = require('./user.model');
const Clinic = require('../Clinics/clinic.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { fail } = require('../../utils/errors');
async function login(data) {
  const user = await User.findOne({ nationalId: data.nationalId }).select('+password');
  if (!user || !await bcrypt.compare(data.password, user.password)) fail('بيانات الدخول غير صحيحة', 401);
  if (user.role === 'clinicadmin' && !await Clinic.exists({ _id: user.clinicId, isActive: true })) fail('العيادة غير متاحة', 403);
  if (!['clinicadmin', 'superadmin'].includes(user.role)) fail('غير مصرح بالدخول', 403);
  return { token: jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '8h', algorithm: 'HS256' }), user: { _id: user.id, name: user.name, role: user.role, clinicId: user.clinicId } };
}
module.exports = { login };
