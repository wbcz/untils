let mail = {
  from: {
      host: 'smtp.163.com',
      //port: 25,
      secureConnection: true,
      auth: {
          user: 'xxxx@163.com',
          pass: 'xxx'
      }
  },
  to: ['wbcz@xxx.com']
}
let mailOptions = {
  from: config.mail.from.auth.user,
  to: config.mail.to,
  subject: subject,
  html: html
};

module.exports = {
  mail,
  mailOptions
}