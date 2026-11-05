const User = require('../src/modules/Auth/user.model');
const bcrypt = require('bcryptjs');

const seedSuperAdmin = async () => {
  try {
    const superAdminData = {
      name: 'Super Admin',
      email: 'superadmin@system.com',
      nationalId: '10000000000000',
      password: 'AdminPassword123', 
      role: 'superadmin',
      phone: '01000000000',
    };

    const existingSuperAdmin = await User.findOne({
      $or: [{ role: 'superadmin' }, { email: superAdminData.email }],
    });

    if (!existingSuperAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(superAdminData.password, salt);

      await User.create({
        ...superAdminData,
        password: hashedPassword,
      });

      console.log(' SuperAdmin created successfully!');
    } else {
      console.log(' SuperAdmin already exists.');
    }
  } catch (error) {
    console.error(' Error seeding SuperAdmin:', error.message);
  }
};

module.exports = seedSuperAdmin;