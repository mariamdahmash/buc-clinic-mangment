require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./config/db');
const seedSuperAdmin = require('./config/seed');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    
    await connectDB();
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