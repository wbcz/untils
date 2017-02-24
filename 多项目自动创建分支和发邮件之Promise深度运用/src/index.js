const createBranches = require('./branch');
const sendEmail = require('./mail');

(function start() {
    console.log('start ...');
    createBranches();
    sendMail('test send mail', '<p>Hello world!</p>');
})()

//如果你要直接放到服务器上运行，加个定时器去轮询就可以了，如果没有创建分支和发送邮件，就创建发送，否则忽略即可