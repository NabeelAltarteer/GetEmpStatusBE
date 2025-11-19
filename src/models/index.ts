import sequelize from '../config/database';
import User from './User';
import Salary from './Salary';

// Define associations
User.hasMany(Salary, {
    foreignKey: 'userId',
    as: 'salaries'
});

Salary.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// Export models and sequelize instance
export {
    sequelize,
    User,
    Salary
};

// Export default for convenience
export default {
    sequelize,
    User,
    Salary
};
