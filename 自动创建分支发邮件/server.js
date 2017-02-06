const http = require('http');
const exec = require('exec');
const requester = require('request');
const Promise = require('bluebird');
const path = require('path');
const until = require('./until');
const request = Promise.promisify(require('request'));
const saveFile = path.join(__dirname, './releaseVersion.txt');


let deployServer = http.createServer(function(request, response) {
  //let branchNames = [];
  let i = 0;
  let res;
  setInterval(trrigerRelease, 5000);

  trrigerRelease()

  function trrigerRelease() {

    let confirmSendEmailTime = confirmTime('3', [18]);
    let createBranchTime = confirmTime('4', [9]);

    // 计算系统当前系统时间与设置时间是否相同
    function confirmTime(sendWeek, sendHour) {
      let date = new Date(Date.now());
      return sendWeek.includes(date.getDay()) && sendHour.includes(date.getHours());
    }

    let createBranch = true && (function unique(timer) {

      //取得分支编号
      timer = true && (function(sysmbol= "") {
          let timestamp = new Date(Date.now());
          function toNum (num) {
            return num < 9 ? '0' + num: num;
          }
          let date = (timestamp.getFullYear()) + sysmbol +
                (toNum(timestamp.getMonth() + 4)) + sysmbol +
                (toNum(timestamp.getDate()+(++i))) + sysmbol;
                console.log(date)
                return date;
      }());

      until.readFileAsync(saveFile).then(function(data, getFileData = null) {
        try {
            getFileData = JSON.parse(data);
            console.log(data,'data')
          } catch(e) {
            getFileData = {}
        }
        return Promise.resolve(getFileData, timer)
      }).then(function(getFileData){
        for(var attr in getFileData) {
          if(getFileData[attr] == timer) {
            res = true;
          } else {
            res = false;
          }
        }
        getFileData['release/'+ timer] = timer;
        timer = JSON.stringify(getFileData);
        until.writeFileAsync(saveFile, timer);
        return Promise.resolve(res)
      }).then(function(res) {

        //创建分支编号命令，并且推送
        let command = (function(command) {
          command = [
            'git checkout -b release/' + timer,
            'git stash',
            'git push origin release/' + timer + ':release/' + timer,
            'git checkout master',
            'git branch -d release/' + timer
          ].join(' && ')

          //console.log(command)

          return res && exec(command, function(err, out, code) {
              if (err instanceof Error) {
                throw err
              }
              console.log('分支：' + 'release/' + timer + '  already create')
              //process.stderr.write(err)
              //process.stdout.write(out)
            })
        }())

      })
    }())

    //发送邮件
    let sendEmail = false && requester(config, function(err, body) {
      console.log(body)
    });

    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end('yes');

  }
})

deployServer.listen(9999)