import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.createTable('logs', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            level: {
                type: DataTypes.STRING(20),
                allowNull: false,
                comment: 'Log level: error, warn, info, http, debug'
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            meta: {
                type: DataTypes.JSONB,
                allowNull: true,
                comment: 'Additional metadata in JSON format'
            },
            timestamp: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
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

        // Add indexes for better query performance
        await queryInterface.addIndex('logs', ['level']);
        await queryInterface.addIndex('logs', ['timestamp']);
    },

    async down(queryInterface: QueryInterface): Promise<void> {
        await queryInterface.dropTable('logs');
    }
};
