const User = require('./user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (userData) => {
  const { name, email, nationalId, password, phone, role } = userData;


  const existingUser = await User.findOne({
    $or: [{ email }, { nationalId }],
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error('Email is already registered');
    }
    if (existingUser.nationalId === nationalId) {
      throw new Error('National ID is already registered');
    }
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    nationalId,
    password: hashedPassword,
    phone,
    role,
  });

  const token = jwt.sign(
    { id: newUser._id, role: newUser.role },
    process.env.JWT_SECRET || 'secret_key',
    { expiresIn: '7d' }
  );

  newUser.password = undefined;

  return { user: newUser, token };
};

const login = async (loginData) => {
  const {nationalId, password } = loginData;

  const user = await User.findOne(
    { nationalId: nationalId || '' })
    .select('+password');

  if (!user) {
    throw new Error('Invalid national ID or password');
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error('Invalid email/national ID or password');
  }

  const token = jwt.sign(
    { 
      id: user._id,
      role: user.role, 
      clinicId: user.clinicId 
    },
    process.env.JWT_SECRET || 'secret_key',
    { expiresIn: process.env.EXPIRESIN || '7d' }
  );

  user.password = undefined;

  return { user, token };
};

module.exports = {
  register,
  login,
};