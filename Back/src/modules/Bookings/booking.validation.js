const { z, text, id, active, time } = require('../../utils/validation');
const schema = z.object({ scheduleId: id, startTime: time, patientName: text, phone: z.string().regex(/^\+?[\d ()-]{8,20}$/), isActive: active }).strict();
module.exports = { schema, publicBooking: schema.omit({ isActive: true }) };
