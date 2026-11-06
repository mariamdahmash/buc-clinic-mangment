require('dotenv').config();
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must contain at least 32 random characters');
const app = require('./src/app');
const connectDB = require('./config/db');
const seedSuperAdmin = require('./config/seed');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    
    await connectDB();
    await Promise.all(Object.values(require("./src/platform/models")).map(model => model.init()));
    await seedSuperAdmin();

    console.log('Database connected successfully...');

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
    process.on('unhandledRejection', (err) => {
      console.error('UNHANDLED REJECTION! 💥 Shutting down...', err);
      server.close(() => {
        process.exit(1);
      });
    });

  } catch (error) {
    console.error('Failed to connect to DB or start server:', error);
    process.exit(1);
  }
};

startServer();
