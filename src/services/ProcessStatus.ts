import { EmpInfo, SalaryInfo } from '../models/EmpInfo';
import Validator from '../validators/Validator';
import { NotAcceptableError, UnprocessableEntityError, BadRequestError } from '../utils/errors';

/**
 * ProcessStatus - Business logic service for employee status processing
 * Handles salary adjustments, tax calculations, and status determination
 */
export class ProcessStatus {
    /**
     * Apply December bonus (+10%) to salaries
     * @param salaries - Array of salary records
     * @returns Adjusted salaries
     */
    private applyDecemberBonus(salaries: SalaryInfo[]): SalaryInfo[] {
        return salaries.map(salary => {
            if (salary.month === 12) {
                return {
                    ...salary,
                    amount: salary.amount * 1.10 // +10% bonus
                };
            }
            return salary;
        });
    }

    /**
     * Apply summer deduction (-5%) to salaries for months 6, 7, 8
     * @param salaries - Array of salary records
     * @returns Adjusted salaries
     */
    private applySummerDeduction(salaries: SalaryInfo[]): SalaryInfo[] {
        return salaries.map(salary => {
            if (salary.month >= 6 && salary.month <= 8) {
                return {
                    ...salary,
                    amount: salary.amount * 0.95 // -5% deduction
                };
            }
            return salary;
        });
    }

    /**
     * Apply all salary adjustments (December bonus and summer deduction)
     * @param salaries - Original salary records
     * @returns Adjusted salary records
     */
    applySalaryAdjustments(salaries: SalaryInfo[]): SalaryInfo[] {
        // First apply December bonus
        let adjusted = this.applyDecemberBonus(salaries);

        // Then apply summer deduction
        adjusted = this.applySummerDeduction(adjusted);

        return adjusted;
    }

    /**
     * Calculate total salary from adjusted salaries
     * @param salaries - Adjusted salary records
     * @returns Total salary amount
     */
    calculateTotalSalary(salaries: SalaryInfo[]): number {
        return salaries.reduce((sum, salary) => sum + salary.amount, 0);
    }

    /**
     * Calculate tax (7% if total > 10,000)
     * @param totalSalary - Total salary amount
     * @returns Tax amount
     */
    calculateTax(totalSalary: number): number {
        if (totalSalary > 10000) {
            return totalSalary * 0.07; // 7% tax
        }
        return 0;
    }

    /**
     * Calculate average salary after tax deduction
     * @param totalSalary - Total salary amount
     * @param taxAmount - Tax amount
     * @param salaryCount - Number of salary records
     * @returns Average salary
     */
    calculateAverageSalary(totalSalary: number, taxAmount: number, salaryCount: number): number {
        if (salaryCount === 0) return 0;

        const afterTax = totalSalary - taxAmount;
        return afterTax / salaryCount;
    }

    /**
     * Find highest salary from adjusted salaries
     * @param salaries - Adjusted salary records
     * @returns Highest salary amount
     */
    findHighestSalary(salaries: SalaryInfo[]): number {
        if (salaries.length === 0) return 0;

        return Math.max(...salaries.map(s => s.amount));
    }

    /**
     * Determine employee status based on average salary
     * GREEN: average >= 5000
     * ORANGE: 3000 <= average < 5000
     * RED: average < 3000
     * @param averageSalary - Average salary amount
     * @returns Status (GREEN, ORANGE, or RED)
     */
    determineStatus(averageSalary: number): 'GREEN' | 'ORANGE' | 'RED' {
        if (averageSalary >= 5000) {
            return 'GREEN';
        } else if (averageSalary >= 3000) {
            return 'ORANGE';
        } else {
            return 'RED';
        }
    }

    /**
     * Process employee information and calculate status
     * @param empInfo - Employee information object
     * @returns Processed employee information with calculated status
     */
    processEmployeeStatus(empInfo: EmpInfo): EmpInfo {
        // Validate user is active - throw 406 if not active
        if (!Validator.isUserActive(empInfo.isActive)) {
            throw new NotAcceptableError('User is not active');
        }

        // Validate sufficient salary data - throw 422 if insufficient
        if (!Validator.hasSufficientData(empInfo.salaries.length)) {
            throw new UnprocessableEntityError('Insufficient salary data (minimum 3 records required)');
        }

        // Validate salary data - throw 400 if invalid
        const salaryValidation = Validator.validateSalaryData(empInfo.salaries);
        if (!salaryValidation.isValid) {
            throw new BadRequestError(salaryValidation.error || 'Invalid salary data');
        }

        // Apply salary adjustments
        const adjustedSalaries = this.applySalaryAdjustments(empInfo.salaries);
        empInfo.setAdjustedSalaries(adjustedSalaries);

        // Calculate total salary
        const totalSalary = this.calculateTotalSalary(adjustedSalaries);
        empInfo.setTotalSalary(totalSalary);

        // Calculate tax
        const taxAmount = this.calculateTax(totalSalary);
        empInfo.setTaxAmount(taxAmount);

        // Calculate average salary
        const averageSalary = this.calculateAverageSalary(
            totalSalary,
            taxAmount,
            adjustedSalaries.length
        );
        empInfo.setAverageSalary(averageSalary);

        // Find highest salary
        const highestSalary = this.findHighestSalary(adjustedSalaries);
        empInfo.setHighestSalary(highestSalary);

        // Determine status
        const status = this.determineStatus(averageSalary);
        empInfo.setStatus(status);

        // Update timestamp
        empInfo.updateTimestamp();

        return empInfo;
    }
}

export default new ProcessStatus();
