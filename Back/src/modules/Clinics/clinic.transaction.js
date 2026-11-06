const mongoose = require('mongoose');
const Clinic = require('./clinic.model');
const { fail } = require('../../utils/errors');
// Lock the clinic within each transaction to serialize related writes.
async function write(clinicId, fn) {
  return mongoose.connection.transaction(async session => {
    if (!await Clinic.findOneAndUpdate({ _id: clinicId, isActive: true }, { $inc: { mutationVersion: 1 } }, { session })) fail('العيادة غير متاحة', 404);
    return fn(session);
  });
}
module.exports = { write };
