import { EmpInfo } from '../models/EmpInfo';
import dataAccess from '../repositories/DataAccess';
import processStatusService from '../services/ProcessStatus';
import Validator from '../validators/Validator';
import { NotFoundError, BadRequestError } from '../utils/errors';
import cacheHandler, { CacheHandler } from '../utils/cache';
import RetryHandler from '../utils/retry';
import Logger from '../utils/logger';

/**
 * EmployeeService - Main service orchestrator
 * Coordinates data access, validation, and business logic processing
 * Includes caching, retry logic, and comprehensive logging
 */
export class EmployeeService {
    /**
     * Get employee status by national number
     * Orchestrates the complete flow:
     * 1. Validate input
     * 2. Check cache
     * 3. Fetch user and salary data (with retry)
     * 4. Process business logic
     * 5. Cache result
     * 6. Return formatted response
     * 
     * @param nationalNumber - Employee's national number
     * @returns Processed employee information with status
     * @throws NotFoundError (404) - User not found
     * @throws NotAcceptableError (406) - User is inactive
     * @throws UnprocessableEntityError (422) - Insufficient salary data
     * @throws BadRequestError (400) - Invalid input
     */
    async getEmployeeStatus(nationalNumber: string): Promise<any> {
        const startTime = Date.now();
        Logger.info(`Processing employee status request`, { nationalNumber });

        // Validate national number format
        if (!Validator.validateNationalNumber(nationalNumber)) {
            Logger.warn('Invalid national number format', { nationalNumber });
            throw new BadRequestError('Invalid NationalNumber format. Expected format: NAT1001');
        }

        // Check cache first
        const cacheKey = CacheHandler.getEmployeeKey(nationalNumber);
        const cachedData = await cacheHandler.get<any>(cacheKey);

        if (cachedData) {
            const duration = Date.now() - startTime;
            Logger.info('Employee data retrieved from cache', {
                nationalNumber,
                duration: `${duration}ms`
            });
            return cachedData;
        }

        // Fetch user and salary data from database with retry logic
        const data = await RetryHandler.wrapDatabaseQuery(
            () => dataAccess.getUserWithSalaries(nationalNumber),
            `getUserWithSalaries(${nationalNumber})`
        );

        // Check if user exists - throw 404 if not found
        if (!data || !data.user) {
            Logger.warn('User not found', { nationalNumber });
            throw new NotFoundError(`User with NationalNumber '${nationalNumber}' not found`);
        }

        const { user, salaries } = data;
        Logger.debug('User data fetched successfully', {
            nationalNumber,
            salaryCount: salaries.length
        });

        // Create EmpInfo object
        const empInfo = new EmpInfo(
            user.id,
            user.username,
            user.nationalNumber || user.national_number,
            user.email,
            user.phone,
            // Handle potential casing differences and ensure boolean type
            !!(user.isActive !== undefined ? user.isActive : user.is_active)
        );

        // Set salary data
        empInfo.setSalaries(salaries);

        // Process employee status (applies business rules, calculates status)
        // This will throw NotAcceptableError (406) if user is inactive
        // This will throw UnprocessableEntityError (422) if insufficient data
        const processedEmpInfo = processStatusService.processEmployeeStatus(empInfo);
        Logger.debug('Employee status processed', {
            nationalNumber,
            status: processedEmpInfo.status
        });

        // Get formatted response
        const response = processedEmpInfo.toResponse();

        // Cache the result (TTL: 1 hour)
        await cacheHandler.set(cacheKey, response, 3600);

        const duration = Date.now() - startTime;
        Logger.info('Employee status request completed', {
            nationalNumber,
            status: processedEmpInfo.status,
            duration: `${duration}ms`
        });

        // Return formatted response
        return response;
    }

    /**
     * Invalidate cache for a specific employee
     * @param nationalNumber - Employee's national number
     */
    async invalidateCache(nationalNumber: string): Promise<void> {
        const cacheKey = CacheHandler.getEmployeeKey(nationalNumber);
        await cacheHandler.delete(cacheKey);
        Logger.info('Cache invalidated', { nationalNumber });
    }

    /**
     * Invalidate all employee caches
     */
    async invalidateAllCaches(): Promise<void> {
        await cacheHandler.deletePattern('employee:*');
        Logger.info('All employee caches invalidated');
    }
}

export default new EmployeeService();
