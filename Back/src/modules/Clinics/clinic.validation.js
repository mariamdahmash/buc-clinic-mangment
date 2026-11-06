const { z, text, url, password } = require('../../utils/validation');
const clinic = z.object({ name: text, slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80).refine(v => !['login','clinic-admin','super-admin','api'].includes(v)), address: text, phoneNumbers: z.array(z.string().regex(/^\+?[\d ()-]{8,20}$/)).max(5), logo: url,
  adminData: z.object({ name: text, email: z.email(), nationalId: z.string().regex(/^\d{14}$/), password, phone: z.string().max(20).default('') }).strict(),
}).strict();
module.exports = { clinic };
