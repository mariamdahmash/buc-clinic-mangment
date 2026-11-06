const { z, text, optional, active } = require('../../utils/validation');
const schema = z.object({ name: text, description: optional, icon: z.string().max(20).default(''), isActive: active }).strict();
module.exports = { schema };
