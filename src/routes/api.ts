import { Router } from 'express';
import employeeController from '../controllers/EmployeeController';
import { asyncHandler } from '../middlewares/errorHandler';
import { validateJsonContentType, validateRequestBody } from '../middlewares/validation';

const router = Router();

/**
 * POST /api/GetEmpStatus
 * Get employee status by national number
 * 
 * Request body:
 * {
 *   "NationalNumber": "NAT1001"
 * }
 * 
 * Success Response (200):
 * {
 *   "ID": "uuid",
 *   "Username": "string",
 *   "NationalNumber": "string",
 *   "Email": "string",
 *   "Phone": "string",
 *   "IsActive": boolean,
 *   "Salaries": [...],
 *   "TotalSalary": number,
 *   "AverageSalary": number,
 *   "HighestSalary": number,
 *   "TaxAmount": number,
 *   "Status": "GREEN" | "ORANGE" | "RED",
 *   "LastUpdated": "ISO timestamp"
 * }
 * 
 * Error Responses:
 * - 400: Invalid request body or national number format
 * - 404: User not found
 * - 406: User is not active
 * - 422: Insufficient salary data (less than 3 records)
 * - 500: Internal server error
 */
router.post(
    '/GetEmpStatus',
    validateJsonContentType,
    validateRequestBody,
    asyncHandler(employeeController.getEmpStatus.bind(employeeController))
);

export default router;
