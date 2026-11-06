const jwt = require('jsonwebtoken');
const User = require('../src/modules/Auth/user.model');
const Clinic = require('../src/modules/Clinics/clinic.model');
const { fail } = require('../src/utils/errors');
async function protect(req, res, next) {
  try {
    const match = /^Bearer (\S+)$/.exec(req.headers.authorization || '');
    if (!match) fail('سجل الدخول أولًا', 401);
    const decoded = jwt.verify(match[1], process.env.JWT_SECRET, { algorithms: ['HS256'] });
    const user = await User.findById(decoded.id);
    if (!user) fail('الجلسة غير صالحة', 401);
    if (user.role === 'clinicadmin' && !await Clinic.exists({ _id: user.clinicId, isActive: true })) fail('العيادة غير متاحة', 403);
    req.user = user; next();
  } catch (e) { next(e.status ? e : Object.assign(new Error('انتهت الجلسة. سجل الدخول مرة أخرى'), { status: 401 })); }
}
const authorize = value => (req, res, next) => req.user.role === value ? next() : next(Object.assign(new Error('غير مصرح بهذه العملية'), { status: 403 }));
module.exports = { protect, authorize };
