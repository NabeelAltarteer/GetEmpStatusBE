import { QueryInterface } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        const users = [
            {
                id: uuidv4(),
                username: 'john_doe',
                national_number: 'NAT1001',
                email: 'john.doe@example.com',
                phone: '+1234567890',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                username: 'jane_smith',
                national_number: 'NAT1002',
                email: 'jane.smith@example.com',
                phone: '+1234567891',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                username: 'bob_johnson',
                national_number: 'NAT1003',
                email: 'bob.johnson@example.com',
                phone: '+1234567892',
                is_active: false,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                username: 'alice_williams',
                national_number: 'NAT1004',
                email: 'alice.williams@example.com',
                phone: '+1234567893',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                username: 'charlie_brown',
                national_number: 'NAT1005',
                email: 'charlie.brown@example.com',
                phone: '+1234567894',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                username: 'diana_prince',
                national_number: 'NAT1006',
                email: 'diana.prince@example.com',
                phone: '+1234567895',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                username: 'edward_stark',
                national_number: 'NAT1007',
                email: 'edward.stark@example.com',
                phone: '+1234567896',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                username: 'fiona_gallagher',
                national_number: 'NAT1008',
                email: 'fiona.gallagher@example.com',
                phone: '+1234567897',
                is_active: false,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                username: 'george_martin',
                national_number: 'NAT1009',
                email: 'george.martin@example.com',
                phone: '+1234567898',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                username: 'hannah_montana',
                national_number: 'NAT1010',
                email: 'hannah.montana@example.com',
                phone: '+1234567899',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                username: 'ian_malcolm',
                national_number: 'NAT1011',
                email: 'ian.malcolm@example.com',
                phone: '+1234567800',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                username: 'julia_roberts',
                national_number: 'NAT1012',
                email: 'julia.roberts@example.com',
                phone: '+1234567801',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        await queryInterface.bulkInsert('users', users);
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.bulkDelete('users', {}, {});
    }
};
