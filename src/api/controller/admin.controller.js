
const { AdminModel } = require("../models/Admin");
const { authorizeKey:authKey} = require("../../constants/vars");
const otpService = require('../services/otpService');
const mailService = require('../services/mailService');
const { sendOtpStatus } = require("../../constants/staticData");
exports.signup = async(req,res,next) => {
    try {
        const {email,userName,authorizeKey} = req.body;
        if(!email || !userName || !authorizeKey) {
            return res.status(500).json({
                status: 'failed',
                errorFlag: true,
                errorMessage: "Invalid payload"
            })
        }
        if(authorizeKey !== authKey) {
            return res.status(401).json({
                status: 'failed',
                errorFlag: true,
                errorMessage: "Invalid Admin"
            })
        }
        const userExists = await AdminModel.findOne({email});
        if(userExists) {
            return res.status(500).json({
                status: 'failed',
                errorFlag: true,
                errorMessage: "Email already exists"
            })
        }  
        let otp = otpService.generateOTP();
        try {
            const user = await AdminModel.create({...req.body});
            console.log('created user - ',user)
             res.status(201).json({
                status: 'success',
                errorFlag: false,
                data: sendOtpStatus
            })
            const emailStatus = await mailService.sendMail(email,otp);
            AdminModel.updateOne({email}, 
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
        return res.status(500).json({
            status: 'failed',
            errorFlag: true,
            errorMessage: "Invalid payload"
        })
    }
}
exports.login = async(req,res,next) => {
    try {
        const {email} = req.body;
        const user = await AdminModel.findOne({email});
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
        AdminModel.updateOne({email}, 
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

exports.verifyOtp = async(req,res,next) => {
    try {
        console.log('req bodyy - ',req.body)
        const {email, emailOtp} = req.body;
        if(!email || !emailOtp) {
            throw new Error('Invalid payload')
        }
        console.log('emai otp - ',email, ' -- ',emailOtp);
        const isValidUser = await AdminModel.findOne({email});
        
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