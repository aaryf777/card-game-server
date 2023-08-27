const mongoose = require('mongoose')
// mongoose.Users = require('../../config/db');
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../../constants/vars');

const userSchema = new mongoose.Schema({
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
    socketID: {
        type: String,
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
    active: {
        type: Boolean,
    },
    coins: {
        type: Number
    },
    contestHistory : [
        {
            rank: {
                type: Number,
                default: 0
            },
            contestID: {
                type: String,
            }
        }
    ],
    contests: {
        played: {
            type: Number,
            default:0
        },
        won: {
            type: Number,
            default: 0
        },
        lost: {
            type: Number,
            default: 0
        },
    },
    tokens : [
        {
            token : {
                type : String,
                required : true
            }
        }
    ],
    created_at: {
        type: Number,
        default: function () {
          return new Date().getTime(); /* timestamp in miliseconds */
        }
    }
})

userSchema.methods.generateAuthToken = async function() {
    let token = jwt.sign({userID: this.userID} , jwtSecret);
    this.tokens = this.tokens.concat({token});
    await this.save();
    return token;
}


 module.exports = {
    UserModel: mongoose.model("users", userSchema)
 }