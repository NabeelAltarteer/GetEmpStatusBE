import { Request, Response, NextFunction } from 'express';
import employeeService from '../services/EmployeeService';
import Validator from '../validators/Validator';
import { BadRequestError } from '../utils/errors';

/**
 * EmployeeController - Handles HTTP requests for employee operations
 */
export class EmployeeController {
    /**
     * GET /api/GetEmpStatus
     * Retrieves employee status information based on national number
     * 
     * @param req - Express request object
     * @param res - Express response object
     * @param next - Express next function
     */
    async getEmpStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate request body structure
            const validation = Validator.validateRequestBody(req.body);
            if (!validation.isValid) {
                throw new BadRequestError(validation.error);
            }

            // Extract national number (support both formats)
            const nationalNumber = req.body.NationalNumber || req.body.nationalNumber;

            // Call service to get employee status
            const result = await employeeService.getEmployeeStatus(nationalNumber);

            // Return success response with 200 status
            res.status(200).json(result);
        } catch (error) {
            // Pass error to error handling middleware
            next(error);
        }
    }
}

export default new EmployeeController();
