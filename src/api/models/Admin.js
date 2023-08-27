const mongoose = require('mongoose')
// mongoose.Users = require('../../config/db');
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken');
const {jwtAdminKey} = require('../../constants/vars');

const adminSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique : true,
    },
    userID: {
        type: String,
        unique: true,
        required: true,
        default: () => uuidv4()
    },
    email: {
        type: String,
        unique: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
        required: [true, "Email required"]
    },
    emailOtp: {
        type: Number
    },
    contact: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
    },
    ImgUrl: {
        type: String,
    },
    authorizeKey: {
        type: String,
    },
    tokens : [
        {
            token : {
                type : String,
                required : true
            }
        }
    ],
})

adminSchema.methods.generateAuthToken = async function() {
    let token = jwt.sign({userID: this.userID} , jwtAdminKey);
    this.tokens = this.tokens.concat({token});
    await this.save();
    return token;
}


 module.exports = {
    AdminModel: mongoose.model("admins", adminSchema)
 }