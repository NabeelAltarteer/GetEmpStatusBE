/**
 * Validator - Input validation and business rule validation
 */
export class Validator {
    /**
     * Validate national number format
     * @param nationalNumber - The national number to validate
     * @returns true if valid, false otherwise
     */
    static validateNationalNumber(nationalNumber: string): boolean {
        if (!nationalNumber || typeof nationalNumber !== 'string') {
            return false;
        }

        // Remove whitespace
        const trimmed = nationalNumber.trim();

        // Check if empty after trimming
        if (trimmed.length === 0) {
            return false;
        }

        // Check for valid format (alphanumeric, typically 7-20 characters)
        const nationalNumberRegex = /^[A-Z]{3}\d{4}$/i; // Format: NAT1001
        return nationalNumberRegex.test(trimmed);
    }

    /**
     * Validate request body structure
     * @param body - The request body to validate
     * @returns Object with isValid flag and error message
     */
    static validateRequestBody(body: any): { isValid: boolean; error?: string } {
        if (!body) {
            return { isValid: false, error: 'Request body is required' };
        }

        if (typeof body !== 'object') {
            return { isValid: false, error: 'Request body must be a JSON object' };
        }

        if (!body.NationalNumber && !body.nationalNumber) {
            return { isValid: false, error: 'NationalNumber field is required' };
        }

        const nationalNumber = body.NationalNumber || body.nationalNumber;

        if (!this.validateNationalNumber(nationalNumber)) {
            return { isValid: false, error: 'Invalid NationalNumber format' };
        }

        return { isValid: true };
    }

    /**
     * Check if user has sufficient salary data (minimum 3 records)
     * @param salaryCount - Number of salary records
     * @returns true if sufficient, false otherwise
     */
    static hasSufficientData(salaryCount: number): boolean {
        return salaryCount >= 3;
    }

    /**
     * Validate user is active
     * @param isActive - User's active status
     * @returns true if active, false otherwise
     */
    static isUserActive(isActive: boolean): boolean {
        return isActive === true;
    }

    /**
     * Validate salary data
     * @param salaries - Array of salary records
     * @returns Object with isValid flag and error message
     */
    static validateSalaryData(salaries: any[]): { isValid: boolean; error?: string } {
        if (!Array.isArray(salaries)) {
            return { isValid: false, error: 'Salaries must be an array' };
        }

        for (const salary of salaries) {
            if (typeof salary.amount !== 'number' || salary.amount < 0) {
                return { isValid: false, error: 'Invalid salary amount' };
            }

            if (typeof salary.month !== 'number' || salary.month < 1 || salary.month > 12) {
                return { isValid: false, error: 'Invalid month value' };
            }

            if (typeof salary.year !== 'number' || salary.year < 2000) {
                return { isValid: false, error: 'Invalid year value' };
            }
        }

        return { isValid: true };
    }
}

export default Validator;
