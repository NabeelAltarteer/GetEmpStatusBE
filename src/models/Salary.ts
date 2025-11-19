import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

// Salary attributes interface
export interface SalaryAttributes {
    id: string;
    userId: string;
    amount: number;
    month: number;
    year: number;
    createdAt?: Date;
    updatedAt?: Date;
}

// Optional fields for creation
interface SalaryCreationAttributes extends Optional<SalaryAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

// Salary model class
class Salary extends Model<SalaryAttributes, SalaryCreationAttributes> implements SalaryAttributes {
    public id!: string;
    public userId!: string;
    public amount!: number;
    public month!: number;
    public year!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Salary.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'user_id',
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        month: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 12
            }
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 2000,
                max: 2100
            }
        }
    },
    {
        sequelize,
        tableName: 'salaries',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                fields: ['user_id']
            },
            {
                fields: ['month', 'year']
            }
        ]
    }
);

export default Salary;
