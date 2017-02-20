const fs = require('fs');
const co = require('co');
const Promise = require('bluebird');
const exec = require('child_process').exec;
const projects = require('./../config/projects');
const untils = require('./untils');
let branchTime = untils.branchTimeNumber();

function getRequestPros(requestCloneProjects=[]) {
    for(let proName in projects) {
            let obj = {};
            obj[proName] = projects[proName];
            requestCloneProjects.push(obj);
    }
    return requestCloneProjects;
}

function exeProjectSync(project, method) {

    return new Promise(function(resolve, reject){
        if(method) {
            exeProject(project, resolve, method)
        } else { 
            validateIsExistCurrentBranch(project).then(function(data) {
                if(data) exeProject(project, resolve, method);
                else resolve();
            })
        }
    })
}

function exeProjects(method) {

    let newProjects = getRequestPros();
    return new Promise(function(resolve, reject) {
        co(function*(){
            while(newProjects.length > 0){
                let project = newProjects.shift();
                yield exeProjectSync(project, method);
            }
            resolve();
        })
    })
}

function exeProject(project, cb, method){

    for(let proName in project) {
        if(method === 'clone') {
            commands = [
                'git clone '+ project[proName]
            ];
        } else if(method === 'delete') {
            commands = [
                'rm -rf '+ proName
            ];
        } else {
            commands = [
                'git branch release/' + branchTime,
                'git checkout release/' + branchTime,
                'git push origin release/' + branchTime + ':release/' + branchTime
            ];
        }

        co(function*() {
            while(commands.length > 0) {
                let command = commands.shift();
                yield syncCommand(command, method, proName);
            }
            cb();
        })
    }
}

function validateIsExistCurrentBranch(project) {

    return new Promise(function(resolve, reject) {
        for(let proName in project) {
            exec('git branch -a', {cwd: __dirname + '/' + proName+'/'}, function(error, out, code) {
                let values = [];
                let originReleases = out.split('remotes/origin');
                originReleases.forEach(function(item) {
                    if(item.indexOf('release') > -1) {
                        let v = /\d+/.exec(item);
                        values.push(v[0]);
                    }
                })
                values = Array.from(new Set(values));
                if(values.indexOf(branchTime) > -1) { console.log('release/' + branchTime +' on the ' + proName + ' already exsits !!'); resolve(false);}
                else { resolve(true) };
            })
        }
    })
}

function syncCommand(command, method, proName) {
    return new Promise(function(resolve, reject) {
        execCommand(command, method, proName, resolve);
    })
}

function execCommand(command, method, proName, cb) {
    let currentPath = __dirname;
    currentPath = currentPath.search(/\/$/) > -1 ? currentPath : currentPath + '/';
    
    if(method !== 'clone' && method !== 'delete') {
        currentPath = __dirname + '/' + proName+'/';
    }
    exec(command, {cwd: currentPath}, function(error, out, code) {
        cb();
        if (error instanceof Error)  throw error ;
        if(method === 'clone') {
            console.log('project ' + proName + ' clone over !!')
        } else if(method === 'delete') {
            console.log('project ' + proName + ' delete over !!')
        } else {
            console.log(command +' on the ' + proName);
        }
    })
}

module.exports = exeProjects;
