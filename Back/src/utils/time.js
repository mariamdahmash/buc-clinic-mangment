const { DateTime } = require('luxon');
const minutes = t => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
const clock = n => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
const future = (date, time) => DateTime.fromISO(`${date}T${time}`, { zone: 'Africa/Cairo' }).toMillis() > Date.now();
module.exports = { minutes, clock, future };
