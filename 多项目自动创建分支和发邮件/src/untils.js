const Promise = require('bluebird')
const fs = require('fs')
const path = require('path');
const saveFile = path.join(__dirname, './version.txt');

//create release branch number
function branchTimeNumber(sysmbol= "") {
    let timestamp = new Date(Date.now());
    return formDate(timestamp, sysmbol);
}

function toNum (num) {
    return num <= 9 ? '0' + num: num;
}

function formDate(timestamp, sysmbol) {
    return timestamp.getFullYear() + sysmbol +(toNum(timestamp.getMonth() + 1)) + sysmbol +(toNum(timestamp.getDate())) + sysmbol;
}

function confirmTime(sendWeek, sendHour) {

    let currentDate = Date.now();
    let date = new Date(currentDate);
    let newDate = new Date(currentDate);
    let startDate;
    let endDate;
    if(sendWeek.includes(date.getDay())) {
        newDate.setHours(0);
        newDate.setMinutes(0);
        newDate.setSeconds(0);
        startDate = newDate.getTime() + sendWeek[0]*3600000;
        endDate = newDate.getTime() + sendHour[1]*3600000;
        return ((startDate < currentDate) && (currentDate< endDate)) ? true : false;  
    } else {
        return false;
    }
}

function readFileAsync(fpath, encoding) {
    
    return new Promise(function(resolve, reject) {
        fs.readFile(fpath, encoding,function(err, content) {
            if(err) reject(err)
            else resolve(content)
        })
    })
}

function writeFileAsync(fpath, content) {

    return new Promise(function(resolve, reject) {
        fs.writeFile(fpath, content,function(err, content) {
            if(err) reject(err)
            else resolve()
        })
    })
}

function isExist() {

    return readFileAsync(saveFile).then(function(data, getFileData = null) {
        try {
                getFileData = JSON.parse(data);
            } catch(e) {
                getFileData = {}
        }
        return Promise.resolve(getFileData)
    }).then(function(getFileData, res, branchTime) {

        branchTime = branchTimeNumber();
        for(var proName in getFileData) {
            if(getFileData[proName]=== branchTime) res = false;
            else res = true;
        }
        if(res) {
            getFileData['release/'+ branchTime] = branchTime;
            let saveReleasesFile = JSON.stringify(getFileData);
            writeFileAsync( saveFile, saveReleasesFile );
        }
        if(res == undefined) res = true;
        return Promise.resolve(res);
    })
}

module.exports = {
	branchTimeNumber,
	confirmTime,
    isExist
}

