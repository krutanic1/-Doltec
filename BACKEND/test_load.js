const files = ["./utils/AppError.js","./utils/asyncHandler.js","./utils/logger.js","./middleware/adminAuth.js","./middleware/auth.js","./middleware/authenticate.js","./middleware/authorizeRole.js","./middleware/cloudinary.js","./middleware/errorHandler.js","./middleware/notFound.js","./middleware/razorpaysetup.js","./middleware/requestContext.js","./middleware/validateRequest.js","./middleware/verifyToken.js","./models/Adminlogin.js","./models/Application.js","./models/AuditLog.js","./models/Campaign.js","./models/Chat.js","./models/CommunityUser.js","./models/CompanyPostedJob.js","./models/CompanyUser.js","./models/ContactUs.js","./models/Createhr.js","./models/CreditTransaction.js","./models/FeaturedBooking.js","./models/Invoice.js","./models/Lead.js","./models/Notification.js","./models/Organization.js","./models/Payment.js","./models/Permission.js","./models/Property.js","./models/PropertyPackage.js","./models/RealEstate.js","./models/RefreshToken.js","./models/Resume.js","./models/Role.js","./models/SavedItem.js","./models/SavedProperty.js","./models/Subscription.js","./models/TeamMember.js","./models/Thoughts.js","./models/UpgradeHistory.js","./models/User.js","./scripts/create_indexes.js"];
let failed = false;

try {
    const mongoose = require('mongoose');
    mongoose.connect = () => {
        console.log('Mongoose connect call intercepted');
        return Promise.resolve();
    };
    mongoose.connection = {
        on: () => {},
        once: () => {},
        readyState: 1
    };
    mongoose.createConnection = () => {
        console.log('Mongoose createConnection call intercepted');
        return { on: () => {}, once: () => {}, model: mongoose.model.bind(mongoose), readyState: 1 };
    };
} catch (e) {
    console.log('Mongoose not found, skipping mock');
}

// Override process.exit to catch side-effect failures
const originalExit = process.exit;
process.exit = (code) => {
    if (code !== 0) {
        console.error('Process exited with code ' + code);
        throw new Error('Process exited with code ' + code);
    }
    originalExit(code);
};

files.forEach(file => {
    try {
        console.log('Loading: ' + file);
        require(file);
    } catch (err) {
        console.error('Failed to load ' + file + ': ' + err.message);
        failed = true;
        // Don't call originalExit here to allow output to be captured
        throw err;
    }
});

if (!failed) {
    console.log('All files loaded successfully.');
}