const service = require('./auth.service');
const validation = require('./auth.validation');
const login = async (req, res) => {
  const data = validation.login.parse(req.body);
  res.json({ success: true, data: await service.login(data) });
};
const register = (req, res) => res.status(403).json({ message: 'إنشاء الحسابات متاح لمدير النظام فقط' });
module.exports = { login, register };
