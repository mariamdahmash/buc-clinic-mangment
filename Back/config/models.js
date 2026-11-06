module.exports = {
  Clinic: require('../src/modules/Clinics/clinic.model'),
  User: require('../src/modules/Auth/user.model'),
  specialties: require('../src/modules/Specialties/specialty.model'),
  doctors: require('../src/modules/Doctors/doctor.model'),
  services: require('../src/modules/Services/service.model'),
  schedules: require('../src/modules/Schedules/schedule.model'),
  bookings: require('../src/modules/Bookings/booking.model'),
};
