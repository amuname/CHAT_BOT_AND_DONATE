'use strict'
const express = require('express')
const donateUrlConstructor = require('./donateUrl.js')
const bd = require('./../bd/mongo.js')
const app = express()

app.get('/d/',(req,res,next)=>{
	console.dir(req.url)
	const url = new URL(req.url)
	res.send(url)
})



app.listen(3000)
