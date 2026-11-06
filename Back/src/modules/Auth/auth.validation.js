const { z, password } = require('../../utils/validation');
const login = z.object({ nationalId: z.string().regex(/^\d{14}$/), password: z.string().min(1).max(72) }).strict();
module.exports = { login, password };
