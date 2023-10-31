
const { UserModel } = require("../models/User");
const otpService = require('../services/otpService');
const mailService = require('../services/mailService')
const { contesDetail,sendOtpStatus } = require("../../constants/staticData");
const { ContestModel } = require("../models/Contest");

exports.login = async(req,res,next) => {
    try {
        const {email} = req.body;
        const user = await UserModel.findOne({email});
        if(!user) {
            return res.status(500).json({
                status: 'failed',
                errorFlag: true,
                errorMessage: "Email does not exists"
            })
        }
        let otp = otpService.generateOTP();
        res.status(200).json({
            status: 'success',
            errorFlag: false,
            message: sendOtpStatus,
        })
        const emailStatus = await mailService.sendMail(email,otp)
        UserModel.updateOne({email}, 
            {$set : {emailOtp:otp}},{new:true}, function (err, docs) {
            if (err){
                console.log(err)
            }
            else{
                console.log("Updated Docs : ", docs);
            }
        });
       
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            errorFlag: true,
            errorMessage: "Unable to generate otp"
        })
    }
}

exports.signup = async(req,res,next) => {
    try {
        const {email, userName} = req.body;
        if(!email || !userName) {
            return res.status(500).json({
                status: 'failed',
                errorFlag: true,
                errorMessage: "Invalid payload"
            })
        }
        const userExists = await UserModel.findOne({email});
        if(userExists) {
            return res.status(500).json({
                status: 'failed',
                errorFlag: true,
                errorMessage: "Email already exists"
            })
        }  
        let otp = otpService.generateOTP();
        try {
            console.log('creating user')
            const userData = {
                userName: req.body.userName,
                email: req.body.email,
                
            }
            const user = await UserModel.create({...req.body, coins: 1000});
            console.log('created user - ',user)
             res.status(201).json({
                status: 'success',
                errorFlag: false,
                data: sendOtpStatus
            })
            const emailStatus = await mailService.sendMail(email,otp);
            UserModel.updateOne({email}, 
                {$set : {emailOtp:otp}},{new:true}, function (err, docs) {
                if (err){
                    console.log(err)
                }
                else{
                    console.log("Updated Docs : ", docs);
                }
            });
            
        } catch (error) {
            console.log('err in signup - ',error);
            return res.status(500).json({
                status: 'failed',
                errorFlag: true,
                errorMessage: "Unable to generate otp"
            })
            
        }
       
    } catch (error) {
        console.log('why invalid pylosaad - ',error);
        return res.status(500).json({
            status: 'failed',
            errorFlag: true,
            errorMessage: "Invalid payload"
        })
    }
}

exports.verifyOtp = async(req,res,next) => {
    try {
        console.log('req bodyy - ',req.body)
        const {email, emailOtp} = req.body;
        if(!email || !emailOtp) {
            throw new Error('Invalid payload')
        }
        console.log('emai otp - ',email, ' -- ',emailOtp);
        const isValidUser = await UserModel.findOne({email});
        
        if(!isValidUser || emailOtp !== isValidUser.emailOtp) {
            return res.status(500).json({
                status: 'failed',
                errorFlag: true,
                errorMessage: "Invalid Otp"
            })
        }
        console.log('isValidUser - ', isValidUser);
       
        const token = await isValidUser.generateAuthToken();
        console.log('token --- ',token);
      
        res.status(200).json({
            status: 'success',
            userName: isValidUser.userName,
            userID: isValidUser.userID,
            accessToken: token
        })
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            errorFlag: true,
            errorMessage: "Invalid payload"
        })
    }
}
exports.addCoins = async(req,res,next) => {
    try {
        const {userID, coin} = req.body;
        if(!userID || !coin) {
            throw new Error('Invalid payload')
        }
        UserModel.updateOne({userID}, {$inc : {coins: coin}},{new:true}, function (err, docs) {
            if (err){
                console.log(err);
                return res.status(500).json({
                    status: 'failed',
                    errorFlag: true,
                    errorMessage: "Unable to update coins"
                })
            }
            else {
                console.log("Updated Docs : ", docs);
                res.status(200).json({
                    status: 'success',
                    data: docs
                })
            }
        })
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            errorFlag: true,
            errorMessage: "Invalid payload"
        })
    }
    
}

exports.getContestTypes = async (req, res, next) => {
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
exports.getProfile = async (req,res,next) => {
    try {
        const {userID, email} = req.body;
        console.log("req.body in getprofile - ",req.body);
        if(userID) {
            const user = await UserModel.findOne({userID});
            const {userName, email, coins, contests, contestHistory, created_at, contact} = user;
            let resData = {userName, email, coins, contests, created_at,contact}
            let contestList = await ContestModel.find({},{'_id':0}).where('contestID').in(contestHistory.map(ele => ele.contestID))
            let newCL = [];
            for(let ch of contestHistory) {
                let temp = contestList.find(ele => ele.contestID === ch.contestID)
                newCL.push(temp)
            }
            contestList = newCL.reverse();
            
            let clist = [];
            for(let c of contestList) {
                let userList = c.users;
                const user1 = await UserModel.findOne({userID:userList[0]?.userID},{userName:1,email:1,_id:0})
                const user2 = await UserModel.findOne({userID:userList[1]?.userID},{userName:1,email:1,_id:0})
                console.log("user1 - ", user1, " user2 - ", user2);
                let temp = {contestName:c.constestName,betamount:c.betamount,winningamount:c.winningamount,contestID:c.contestID,created_at:c.created_at,users:[{userName:user1?.userName, email:user1?.email, rank:userList[0]?.rank},{userName:user2?.userName, email:user2?.email,rank:userList[1]?.rank}]}
                clist.push(temp)
            }
            contestList = clist;
            resData = {...resData,contestHistory:contestList}
            
            // console.log('contestList - ',contestList);
            res.status(200).json({
                status: 'success',
                errorFlag: false,
                data: resData,
            })
        } else {
            const user = await UserModel.findOne({email});
            const {userName, email, contests, contestHistory, created_at, contact} = user;
            const resData = {userName, email, contests, contestHistory, created_at, contact}
            res.status(200).json({
                status: 'success',
                errorFlag: false,
                data: resData,
            })
        }
    } catch (error) {
        console.log('errror - ',error);
        res.status(500).json({
            status: 'failed',
            errorFlag: true,
            message: 'server error',
        })
    }
}
exports.updateProfile = async (req,res,next) => {
    try {
        const {userID, email, contact} = req.body;
        if(!userID) throw new Error('Invalid user')
        let updatedUser;
        console.log('body - ',req.body);
        if(email && contact) {
            updatedUser = await UserModel.findOneAndUpdate({userID},{
                $set: {
                    email: email,
                    contact: contact
                }
            },{ returnDocument: "after" })
        } else if(email) {
            updatedUser = await UserModel.findOneAndUpdate({userID},{
                $set: {
                    email: email,
                }
            },{ returnDocument: "after" })
        } else if(contact) {
            updatedUser = await UserModel.findOneAndUpdate({userID},{
                $set: {
                    contact: contact,
                }
            },{ returnDocument: "after" })
        } else {
            throw new Error('Invalid payload')
        }
        res.status(200).json({
            status: 'success',
            errorFlag: false,
            data: updatedUser,
        })
    } catch (error) {
        console.log('error - ',error);
        res.status(500).json({
            status: 'failed',
            errorFlag: true,
            message: error,
        })
    }
}
