import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import { sequelize } from './models';
import apiRoutes from './routes/api';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/validation';
import cacheHandler from './utils/cache';
import Logger from './utils/logger';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration (if needed)
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

// Request logging
app.use(requestLogger);

// Basic health check route
app.get('/health', (_req: Request, res: Response) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'GetEmpStatus API'
    });
});

// API Routes
app.use('/api', apiRoutes);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Test database connection
const testDatabaseConnection = async () => {
    try {
        await sequelize.authenticate();
        Logger.info('✅ Database connection established successfully.');
    } catch (error) {
        Logger.error('❌ Unable to connect to the database', { error });
        process.exit(1);
    }
};

// Initialize cache connection
// Initialize cache connection
const initializeCache = async () => {
    try {
        await cacheHandler.connect();
        if (cacheHandler.isAvailable()) {
            Logger.info('✅ Cache connection initialized');
        } else {
            Logger.warn('⚠️  Cache not available - running in fallback mode');
        }
    } catch (error) {
        Logger.warn('⚠️  Cache connection failed - running without cache', { error });
        // Don't exit - app can run without cache
    }
};

// Start server
const startServer = async () => {
    try {
        // Test database connection
        await testDatabaseConnection();

        // Initialize cache
        await initializeCache();

        // Start listening
        app.listen(PORT, () => {
            Logger.info(`🚀 Server is running on port ${PORT}`);
            Logger.info(`📍 Health check: http://localhost:${PORT}/health`);
            Logger.info(`📡 API Endpoint: POST http://localhost:${PORT}/api/GetEmpStatus`);
            Logger.info(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
    Logger.info('SIGTERM signal received: closing HTTP server');
    await cacheHandler.disconnect();
    await sequelize.close();
    process.exit(0);
});

process.on('SIGINT', async () => {
    Logger.info('SIGINT signal received: closing HTTP server');
    await cacheHandler.disconnect();
    await sequelize.close();
    process.exit(0);
});

// Start the application
startServer();

export default app;
