const { ContestModel } = require("../models/Contest");
const { UserModel } = require("../models/User");
const { contesDetail } = require("../../constants/staticData");
require('../socket/index')





exports.getContests = async (req, res) => {
    console.log('getcontest called');
    try {
        res.status(200).json({
            status: 'success',
            errorFlag: false,
            data: contesDetail,
        })
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            errorFlag: true,
            message: 'server error',
        })
    }
}



exports.getContestUsers = async (req, res) => {
    try {
        const { contestID } = req.query;
        const contest = await ContestModel.findOne({ contestID });
        let userIds = contest.users.map(ele => ele.userID)
        const userList = await UserModel.find({ userID: { $in: userIds } })
        // const users = await ContestModel.aggregate([{$lookup:{from:"users", localField:"users.userID", foreignField:"userID", as:"user_details"}}])
        res.status(200).json({
            status: 'success',
            errorFlag: false,
            data: userList,
        })
    } catch (error) {
        console.log('err - ', error);
        res.status(500).json({
            status: 'failed',
            errorFlag: true,
            data: 'cant fetch',
        })
    }
}

