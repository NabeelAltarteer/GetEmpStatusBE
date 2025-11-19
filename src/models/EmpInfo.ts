/**
 * EmpInfo - Employee Information Model
 * Represents the complete employee information including salary data and status
 */
export interface SalaryInfo {
    amount: number;
    month: number;
    year: number;
}

export class EmpInfo {
    // Basic employee information
    public id: string;
    public username: string;
    public nationalNumber: string;
    public email: string;
    public phone: string;
    public isActive: boolean;

    // Salary information
    public salaries: SalaryInfo[];
    public adjustedSalaries: SalaryInfo[];
    public totalSalary: number;
    public averageSalary: number;
    public highestSalary: number;
    public taxAmount: number;

    // Status information
    public status: 'GREEN' | 'ORANGE' | 'RED' | null;
    public lastUpdated: string;

    constructor(
        id: string,
        username: string,
        nationalNumber: string,
        email: string,
        phone: string,
        isActive: boolean
    ) {
        this.id = id;
        this.username = username;
        this.nationalNumber = nationalNumber;
        this.email = email;
        this.phone = phone;
        this.isActive = isActive;

        this.salaries = [];
        this.adjustedSalaries = [];
        this.totalSalary = 0;
        this.averageSalary = 0;
        this.highestSalary = 0;
        this.taxAmount = 0;
        this.status = null;
        this.lastUpdated = new Date().toISOString();
    }

    /**
     * Set salary data for the employee
     */
    setSalaries(salaries: SalaryInfo[]): void {
        this.salaries = salaries;
    }

    /**
     * Set adjusted salaries after applying business rules
     */
    setAdjustedSalaries(adjustedSalaries: SalaryInfo[]): void {
        this.adjustedSalaries = adjustedSalaries;
    }

    /**
     * Calculate and set total salary
     */
    setTotalSalary(total: number): void {
        this.totalSalary = total;
    }

    /**
     * Calculate and set average salary
     */
    setAverageSalary(average: number): void {
        this.averageSalary = average;
    }

    /**
     * Set highest salary
     */
    setHighestSalary(highest: number): void {
        this.highestSalary = highest;
    }

    /**
     * Set tax amount
     */
    setTaxAmount(tax: number): void {
        this.taxAmount = tax;
    }

    /**
     * Set employee status based on average salary
     */
    setStatus(status: 'GREEN' | 'ORANGE' | 'RED'): void {
        this.status = status;
    }

    /**
     * Update the last updated timestamp
     */
    updateTimestamp(): void {
        this.lastUpdated = new Date().toISOString();
    }

    /**
     * Convert to API response format
     */
    toResponse(): any {
        return {
            ID: this.id,
            Username: this.username,
            NationalNumber: this.nationalNumber,
            Email: this.email,
            Phone: this.phone,
            IsActive: this.isActive,
            Salaries: this.adjustedSalaries.map(s => ({
                Amount: s.amount,
                Month: s.month,
                Year: s.year
            })),
            TotalSalary: this.totalSalary,
            AverageSalary: this.averageSalary,
            HighestSalary: this.highestSalary,
            TaxAmount: this.taxAmount,
            Status: this.status,
            LastUpdated: this.lastUpdated
        };
    }
}
