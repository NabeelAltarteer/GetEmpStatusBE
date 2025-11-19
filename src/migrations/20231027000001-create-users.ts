import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.createTable('users', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            username: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            national_number: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: true
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            phone: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        });

        // Add index on national_number for faster lookups
        await queryInterface.addIndex('users', ['national_number'], {
            name: 'users_national_number_idx',
            unique: true
        });
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.dropTable('users');
    }
};
