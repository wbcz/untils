const http = require('http');
const untils = require('./untils');
const branch = require('./branch');
const sendEmail = require('./mail');

function start() {
    console.log('start ...')
    if(untils.isExist()) {
        branch('clone')
        .then(function() {
            console.log('----------- all projects clone over -----------');
            console.log('...')
            branch()
            .then(function(){
                console.log('----------- all projects branches create over -----------')
                console.log('...')
                branch('delete')
                .then(function() {
                    console.log('----------- all projects  delete over -----------')
                    console.log('... the task of branch end ')
                });
            })
        })
    }
    sendMail('test send mail', '<p>Hello world!</p>');
}
