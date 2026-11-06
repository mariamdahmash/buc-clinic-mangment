const { z, text, optional, id, url, active } = require('../../utils/validation');
const schema = z.object({ name: text, title: text, email: z.email().max(254), specialtyId: id, bio: optional, image: url, isActive: active }).strict();
module.exports = { schema };
