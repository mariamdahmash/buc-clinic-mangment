const jwt = require('jsonwebtoken');

// 1.(Authentication)
const protect = async (req, res, next) => {
  try {
    let token;

    //Authorization Header (Bearer <token>)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'You are not logged in. Please log in to get access.',
      });
    }
    //verify
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret_key'
    );

    //(id, role, clinicId) بالـ Request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Access denied.',
    });
  }
};

// 2.Roles (Authorization)
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action.',
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};