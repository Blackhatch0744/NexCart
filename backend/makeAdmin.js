const mongoose = require("mongoose");
const User = require("./Models/User");
require("dotenv").config();

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        const email = "testuser_5678@example.com";
        const user = await User.findOne({ email });

        if (!user) {
            console.log("User not found");
            process.exit(1);
        }

        user.role = "admin";
        await user.save();

        console.log(`User ${email} is now an Admin`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

makeAdmin();
