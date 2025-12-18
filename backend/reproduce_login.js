const dbHelpers = require('./utils/dbHelpers');
const bcrypt = require('bcryptjs');

async function testLogin() {
    console.log('--- Database Connection Test ---');

    try {
        // 1. Check if admin exists (the one user tried)
        console.log('\nChecking user: madheehabanum67@gmail.com');
        const user1 = await dbHelpers.findUserByEmail('madheehabanum67@gmail.com');
        if (user1) {
            console.log('User found:', user1.email, user1.role);
        } else {
            console.log('User NOT found.');
        }

        // 2. Check if default admin exists
        console.log('\nChecking user: admin@oncode.com');
        const user2 = await dbHelpers.findUserByEmail('admin@oncode.com');
        if (user2) {
            console.log('User found:', user2.email, user2.role);

            // Verify password
            console.log('Verifying password "admin123"...');
            const isValid = await bcrypt.compare('admin123', user2.password);
            console.log('Password valid:', isValid);
        } else {
            console.log('User NOT found.');
        }

        // 3. User check
        console.log('\nChecking user: student@oncode.com');
        const user3 = await dbHelpers.findUserByEmail('student@oncode.com');
        if (user3) {
            console.log('User found:', user3.email, user3.role);
        } else {
            console.log('User NOT found.');
        }

    } catch (error) {
        console.error('Test failed with error:', error);
    }
}

testLogin();
