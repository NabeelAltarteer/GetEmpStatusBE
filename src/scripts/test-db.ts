import { sequelize, User, Salary } from '../models';

async function testDatabase() {
    try {
        console.log('🔍 Testing database connection...\n');

        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection successful!\n');

        // Count users
        const userCount = await User.count();
        console.log(`📊 Total users in database: ${userCount}`);

        // Count salaries
        const salaryCount = await Salary.count();
        console.log(`📊 Total salary records: ${salaryCount}\n`);

        // Get a sample user with salaries
        const sampleUser = await User.findOne({
            where: { nationalNumber: 'NAT1001' },
            include: [{
                model: Salary,
                as: 'salaries'
            }]
        });

        if (sampleUser) {
            console.log('👤 Sample User (NAT1001):');
            console.log(`   - Username: ${sampleUser.username}`);
            console.log(`   - Email: ${sampleUser.email}`);
            console.log(`   - Active: ${sampleUser.isActive}`);
            console.log(`   - Salary Records: ${(sampleUser as any).salaries?.length || 0}\n`);
        }

        // List all users with their salary counts
        const allUsers = await User.findAll({
            include: [{
                model: Salary,
                as: 'salaries',
                attributes: []
            }],
            attributes: [
                'nationalNumber',
                'username',
                'isActive',
                [sequelize.fn('COUNT', sequelize.col('salaries.id')), 'salaryCount']
            ],
            group: ['User.id'],
            raw: true
        });

        console.log('📋 All Users Summary:');
        console.log('─'.repeat(70));
        console.log('National Number | Username          | Active | Salary Count');
        console.log('─'.repeat(70));
        allUsers.forEach((user: any) => {
            console.log(
                `${user.nationalNumber.padEnd(15)} | ${user.username.padEnd(17)} | ${user.isActive ? 'Yes' : 'No '}    | ${user.salaryCount}`
            );
        });
        console.log('─'.repeat(70));

        console.log('\n✅ Database test completed successfully!');

    } catch (error) {
        console.error('❌ Database test failed:', error);
    } finally {
        await sequelize.close();
    }
}

testDatabase();
