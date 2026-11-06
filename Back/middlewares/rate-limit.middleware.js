const { rateLimit } = require('express-rate-limit');
const limit = max => rateLimit({ windowMs: 900000, limit: max, standardHeaders: 'draft-8', legacyHeaders: false, message: { message: 'محاولات كثيرة. حاول بعد قليل.' } });
module.exports = { limit };
