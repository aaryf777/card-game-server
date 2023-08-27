const nodemailer = require('nodemailer');

module.exports.sendMail = (mailId, data) => {
    return  new Promise((res,rej) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'cardgameapp000@gmail.com',
              pass: 'skomxjzyxcohrdch'
            }
        });
          
        const mailOptions = {
            from: 'cardgameapp000@gmail.com',
            to: mailId,
            subject: 'One time password for Card Game login',
            text: `Your one time login password for card game is ${data}. Kindly do not share it to anyone.`
        };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log('error occuring is: ',error);
              rej('Could not send the Otp')
            } else {
              console.log('Email sent: ' + info.response);
              res('Otp has been send to your registered email')
            }
          });
    })
}

