import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

// User attributes interface
export interface UserAttributes {
    id: string;
    username: string;
    nationalNumber: string;
    email: string;
    phone: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// Optional fields for creation
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

// User model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: string;
    public username!: string;
    public nationalNumber!: string;
    public email!: string;
    public phone!: string;
    public isActive!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
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
        nationalNumber: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
            field: 'national_number'
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: 'is_active'
        }
    },
    {
        sequelize,
        tableName: 'users',
        timestamps: true,
        underscored: true
    }
);

export default User;
