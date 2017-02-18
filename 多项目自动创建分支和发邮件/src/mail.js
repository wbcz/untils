const config = require('./../config/mail');
const request = require('request');
const untils = require('./untils');

function sendMail(subject, html) {
    untils.isExist()
    .then(function(data) {
        if(data) {
            console.log('mail is sending ...')
            let smtpTransport = nodemailer.createTransport(config.mail.from);
            let mailOptions = {
              from: config.mail.from.auth.user,
              to: config.mail.to,
              subject: subject,
              html: html
            };
            smtpTransport.sendMail(config.mailOptions, function(error, response){
                if(err) throw err;
                else console.log('Message sent: ' + response);
                smtpTransport.close();
            });
        }
    })
}

module.exports = sendEmail;
