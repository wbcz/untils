'use strict'

let Promise = require('bluebird')
let fs = require('fs')

exports.readFileAsync = function(fpath, encoding) {
	return new Promise(function(resolve, reject) {
		fs.readFile(fpath, encoding,function(err, content) {
			if(err) reject(err)
			else resolve(content)
		})
	})
}

exports.writeFileAsync = function(fpath, content) {
	return new Promise(function(resolve, reject) {
		fs.writeFile(fpath, content,function(err, content) {
			if(err) reject(err)
			else resolve()
		})
	})
}