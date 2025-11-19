import User from '../models/User';
import Salary from '../models/Salary';
import { SalaryInfo } from '../models/EmpInfo';
import { InternalServerError } from '../utils/errors';

/**
 * DataAccess - Repository layer for database operations
 * Handles all database queries and data retrieval
 */
export class DataAccess {
    /**
     * Get user by national number
     * @param nationalNumber - The national number to search for
     * @returns User object or null if not found
     */
    async getUserByNationalNumber(nationalNumber: string): Promise<any | null> {
        try {
            const user = await User.findOne({
                where: { nationalNumber },
                raw: true
            });

            return user;
        } catch (error) {
            console.error('Error fetching user by national number:', error);
            throw new InternalServerError('Database error while fetching user');
        }
    }

    /**
     * Get all salaries for a specific user
     * @param userId - The user ID to fetch salaries for
     * @returns Array of salary records
     */
    async getSalariesByUserId(userId: string): Promise<SalaryInfo[]> {
        try {
            const salaries = await Salary.findAll({
                where: { userId },
                order: [['year', 'DESC'], ['month', 'DESC']],
                raw: true
            });

            return salaries.map(s => ({
                amount: parseFloat(s.amount.toString()),
                month: s.month,
                year: s.year
            }));
        } catch (error) {
            console.error('Error fetching salaries for user:', error);
            throw new InternalServerError('Database error while fetching salaries');
        }
    }

    /**
     * Get user with their salaries in a single query
     * @param nationalNumber - The national number to search for
     * @returns User with salaries or null
     */
    async getUserWithSalaries(nationalNumber: string): Promise<{ user: any, salaries: SalaryInfo[] } | null> {
        try {
            const user = await this.getUserByNationalNumber(nationalNumber);

            if (!user) {
                return null;
            }

            const salaries = await this.getSalariesByUserId(user.id);

            return { user, salaries };
        } catch (error) {
            console.error('Error fetching user with salaries:', error);
            throw error;
        }
    }
}

export default new DataAccess();
