const statList = require('../../constants/playerList');
const { CardModel } = require('../models/Crad');
exports.initializeCards = async (req,res,next) => {
    try {
        const insertedList = await CardModel.insertMany(statList);
        console.log('insertedData - ',insertedList);
        res.status(201).json({
            status: 'success',
            errorFlag: false,
            data: 'created successfully',
        })
    } catch (error) {
        console.log('error is - ',error);
        res.status(500).json({
            status: 'failed',
            errorFlag: true,
            data: 'cant create',
        })
    }
   
}

exports.addCard = async (req,res,next) => {
    try {
        const card = await CardModel.create(req.body);
        console.log('insertedData - ',insertedList);
        res.status(201).json({
            status: 'success',
            errorFlag: false,
            data: 'added card successfully',
        })
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            errorFlag: true,
            data: 'cant add the card',
        })
    }
   
}
exports.getCards = async (req,res,next) => {
    try {
        const cards = await CardModel.find();
        res.status(200).json({
            status: 'success',
            errorFlag: false,
            data: cards,
        })
    } catch (error) {
        console.log('error in fetching card - ',error);
        res.status(500).json({
            status: 'failed',
            errorFlag: true,
            data: 'cant fetch cards',
        })
    }
}

exports.updateCard = async (req,res,next) => {
    try {
        const {playerId} = req.body;
        const cards = await CardModel.findOneAndUpdate({playerId},{
            $set: {
                ...req.body
            }
        });
        console.log('updated card - ',cards);
        res.status(200).json({
            status: 'success',
            errorFlag: false,
            data: {message: 'updated successfully', data:cards},
        })
    } catch (error) {
        console.log('error in update card - ',error);
        res.status(500).json({
            status: 'failed',
            errorFlag: true,
            data: 'cant update card',
        })
    }
}

exports.delteCard = async (req,res,next) => {
    try {
        const {playerId} = req.body;
        const cards = await CardModel.findOneAndDelete({playerId});
        console.log('deleted card - ',cards);
        res.status(200).json({
            status: 'success',
            errorFlag: false,
            data: 'deleted successfully',
        })
    } catch (error) {
        console.log('error in update card - ',error);
        res.status(500).json({
            status: 'failed',
            errorFlag: true,
            data: 'cant delete card',
        })
    }
}

