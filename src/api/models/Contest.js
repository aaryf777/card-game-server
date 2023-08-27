const mongoose = require('mongoose')
// mongoose.Contests = require('../../config/db');
const { v4: uuidv4 } = require('uuid')
// const db  = require('../../config/db');
// db.connect()



const contestSchema = new mongoose.Schema({
    constestName: {
        type: String,
    },
    contestID: {
        type: String,
        unique: true,
        required: true,
        default: () => uuidv4()
    },
    size: {
        type: Number
    },
    betamount: {
        type: Number
    },
    winningamount: {
        type: Number
    },
    status: {
        type: String,
        default: 'open'
    },
    users : [
        {
            rank: {
                type: Number,
                default: 0
            },
            userID: {
                type: String,
               
            },
        }
    ],
    created_at: {
        type: Number,
        default: function () {
          return new Date().getTime(); /* timestamp in miliseconds */
        }
    }
})




 module.exports = {
    ContestModel: mongoose.model("contests", contestSchema)
 }