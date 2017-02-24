const Promise = require('bluebird')
const fs = require('fs')
const path = require('path')
const saveFile = path.join(__dirname, './mail.txt')

//create release branch number
function branchTimeNumber(sysmbol= "") {
    
    let timestamp = new Date(Date.now())
    return formDate(timestamp, sysmbol)
}

function toNum (num) {

    return num <= 9 ? '0' + num: num
}

function formDate(timestamp, sysmbol) {

    return timestamp.getFullYear() + sysmbol +(toNum(timestamp.getMonth() + 1)) + sysmbol +(toNum(timestamp.getDate())) + sysmbol
}

function confirmTime(sendWeek, sendHour) {

    let date = Date.now()
    if(sendWeek.includes(date.getDay())) {
        if(sendHour.length === 2) {
            return (date.getHours() >= sendHour[0] && date.getHours() <= sendHour[1]) ? true : false  
        } else {
            return (date.getHours() >= sendHour[0]) ? true : false 
        }
    } else {
        return false
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

function isExist(confirm) {

    return readFileAsync(saveFile).then(function(data, getFileData = null) {
        try {
                getFileData = JSON.parse(data)
            } catch(e) {
                getFileData = {}
        }
        return Promise.resolve(getFileData)
    }).then(function(getFileData, res, branchTime) {

        branchTime = branchTimeNumber()
        for(var proName in getFileData) {
            if(getFileData[proName]=== branchTime) res = false
            else res = true
        }
        if(res && confirm) {
            getFileData['release/'+ branchTime] = branchTime
            let saveReleasesFile = JSON.stringify(getFileData)
            writeFileAsync( saveFile, saveReleasesFile )
        }
        if(res == undefined && confirm) res = true
        else res = false

        return Promise.resolve(res)
    })
}

module.exports = {
	branchTimeNumber,
	confirmTime,
    isExist
}

