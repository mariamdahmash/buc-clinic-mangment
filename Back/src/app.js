const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: (origin, done) => {
  const allowed = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',').map(s => s.trim());
  done(null, !origin || allowed.includes(origin));
} }));
app.use(express.json({ limit: '32kb' }));
app.use(rateLimit({ windowMs: 60000, limit: 200, standardHeaders: 'draft-8', legacyHeaders: false }));
app.use('/api/v1', require('./platform/routes'));
app.use((req, res) => res.status(404).json({ message: 'المسار غير موجود' }));
app.use((err, req, res, next) => {
  if (err.name === 'ZodError') return res.status(400).json({ message: 'راجع البيانات المطلوبة وصيغة الحقول', details: err.issues.map(i => ({ field: i.path.join('.'), message: i.message })) });
  if (err.code === 11000) return res.status(409).json({ message: 'البيانات مسجلة بالفعل أو تم حجز الموعد. اختر موعدًا آخر.' });
  if (err.name === 'ValidationError' || err.name === 'CastError' || err.type === 'entity.parse.failed') return res.status(400).json({ message: 'بيانات غير صحيحة' });
  res.status(err.status || 500).json({ message: err.status ? err.message : 'تعذر إتمام العملية. حاول مرة أخرى.' });
});
module.exports = app;
