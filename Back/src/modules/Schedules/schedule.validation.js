const { z, DateTime, id, active, time } = require('../../utils/validation');
const schema = z.object({ doctorId: id, date: z.string().refine(v => /^\d{4}-\d{2}-\d{2}$/.test(v) && DateTime.fromISO(v).isValid), startTime: time, endTime: time, slotMinutes: z.number().int().min(5).max(120), isActive: active }).strict();
module.exports = { schema };
