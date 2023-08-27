const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    playerID: {
        type: String,
        unique: true,
        required: true,
    },
    profile: {
        type: String,
        unique: true,
        required: true
    },
    match: {
        type: Number,
        required: true
    },
    inning: {
        type: Number,
        required: true
    },
    runs: {
        type: Number,
        required: true
    },
    hs: {
        type: Number,
        required: true
    },
    no: {
        type: Number,
        required: true
    },
    hundred: {
        type: Number,
        required: true
    },
    fifty: {
        type: Number,
        required: true
    },
    fours: {
        type: Number,
        required: true
    },
    sixes: {
        type: Number,
        required: true
    },
    binning: {
        type: Number,
        required: true
    },
    balls: {
        type: Number,
        required: true
    },
    wicket: {
        type: Number,
        required: true
    },
    created_at: {
        type: Number,
        default: function () {
          return new Date().getTime(); /* timestamp in miliseconds */
        }
    }
})

 module.exports = {
    CardModel: mongoose.model("cards", cardSchema)
 }