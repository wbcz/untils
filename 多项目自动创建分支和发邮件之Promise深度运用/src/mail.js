const config = require('./../config/mail');
const request = require('request');
const untils = require('./untils');
const saveMailFile = path.join(__dirname, './mail.txt');

function sendMail(subject, html) {
    untils.isExist(confirm, saveMailFile)
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
    }).catch(function(e) {
        throw Error
    })
}

module.exports = sendEmail;
