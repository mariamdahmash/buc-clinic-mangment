const { z, text, optional, id, active } = require('../../utils/validation');
const schema = z.object({ title: text, description: optional, price: z.number().min(0).max(1000000), specialtyId: id.nullable().default(null), isActive: active }).strict();
module.exports = { schema };
