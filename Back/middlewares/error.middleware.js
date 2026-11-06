const notFound = (req, res) => res.status(404).json({ message: 'المسار غير موجود' });
const errorHandler = (err, req, res, next) => {
  if (err.name === 'ZodError') return res.status(400).json({ message: 'راجع البيانات المطلوبة وصيغة الحقول', details: err.issues.map(i => ({ field: i.path.join('.'), message: i.message })) });
  if (err.code === 11000) return res.status(409).json({ message: 'البيانات مسجلة بالفعل أو تم حجز الموعد. اختر موعدًا آخر.' });
  if (err.name === 'ValidationError' || err.name === 'CastError' || err.type === 'entity.parse.failed') return res.status(400).json({ message: 'بيانات غير صحيحة' });
  res.status(err.status || 500).json({ message: err.status ? err.message : 'تعذر إتمام العملية. حاول مرة أخرى.' });
};

module.exports = { notFound, errorHandler };
