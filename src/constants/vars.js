const dotenv = require('dotenv');
dotenv.config({path : 'config.env'});

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    authorizeKey: process.env.AUTHORIZE_KEY,
    mongo: {
        uri: process.env.MONGO_URI
    },
    jwtSecret: process.env.JWT_SECRET,
    jwtAdminKey: process.env.JWT_ADMIN,
    OTP_LENGTH: 4,
    OTP_CONFIG: {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    }
}