import { QueryInterface, QueryTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        // First, get the user IDs from the database
        const users: any = await queryInterface.sequelize.query(
            'SELECT id, national_number FROM users ORDER BY national_number',
            { type: QueryTypes.SELECT }
        );

        const salaries = [];
        const currentYear = 2024;
        const previousYear = 2023;

        // Helper function to generate salary records
        const generateSalaries = (userId: string, baseAmount: number, monthCount: number) => {
            const records = [];
            for (let i = 0; i < monthCount; i++) {
                const month = (i % 12) + 1;
                const year = i < 12 ? previousYear : currentYear;
                const variation = (Math.random() - 0.5) * 500; // Random variation ±250

                records.push({
                    id: uuidv4(),
                    user_id: userId,
                    amount: (baseAmount + variation).toFixed(2),
                    month,
                    year,
                    created_at: new Date(),
                    updated_at: new Date()
                });
            }
            return records;
        };

        // NAT1001 - Active user with good salary history (12 months)
        if (users[0]) {
            salaries.push(...generateSalaries(users[0].id, 5000, 12));
        }

        // NAT1002 - Active user with excellent salary (10 months)
        if (users[1]) {
            salaries.push(...generateSalaries(users[1].id, 7500, 10));
        }

        // NAT1003 - Inactive user (8 months)
        if (users[2]) {
            salaries.push(...generateSalaries(users[2].id, 4500, 8));
        }

        // NAT1004 - Active user with high salary (15 months)
        if (users[3]) {
            salaries.push(...generateSalaries(users[3].id, 8000, 15));
        }

        // NAT1005 - Active user with insufficient data (2 months only - should return 422)
        if (users[4]) {
            salaries.push(...generateSalaries(users[4].id, 3000, 2));
        }

        // NAT1006 - Active user with moderate salary (6 months)
        if (users[5]) {
            salaries.push(...generateSalaries(users[5].id, 4000, 6));
        }

        // NAT1007 - Active user with varying salary (18 months)
        if (users[6]) {
            salaries.push(...generateSalaries(users[6].id, 6000, 18));
        }

        // NAT1008 - Inactive user (5 months)
        if (users[7]) {
            salaries.push(...generateSalaries(users[7].id, 3500, 5));
        }

        // NAT1009 - Active user with low salary (4 months)
        if (users[8]) {
            salaries.push(...generateSalaries(users[8].id, 2500, 4));
        }

        // NAT1010 - Active user with high salary (20 months)
        if (users[9]) {
            salaries.push(...generateSalaries(users[9].id, 9000, 20));
        }

        // NAT1011 - Active user with moderate salary (7 months)
        if (users[10]) {
            salaries.push(...generateSalaries(users[10].id, 5500, 7));
        }

        // NAT1012 - Active user with good salary (11 months)
        if (users[11]) {
            salaries.push(...generateSalaries(users[11].id, 6500, 11));
        }

        await queryInterface.bulkInsert('salaries', salaries);
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.bulkDelete('salaries', {}, {});
    }
};
