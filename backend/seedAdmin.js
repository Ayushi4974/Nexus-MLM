require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB Connected for seeding');

        // Check if admin already exists
        const existingAdmin = await User.findOne({
            username: 'admin',
        });

        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit(0);
        }

        await User.create({
            username: 'admin',
            name: 'System Admin',
            email: 'admin@gmail.com',
            mobile: '9999999999',
            password: '123456',
            isAdmin: true,
            status: 'active',
            position: 'root',
        });

        console.log('✅ Admin created successfully');
        console.log('Username: admin');
        console.log('Password: 123456');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        process.exit(1);
    }
};

createAdmin();