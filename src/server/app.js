'use strict'
const express = require('express')
const donateUrlConstructor = require('./donateUrl.js')
const bd = require('./../bd/mongo.js')
const app = express()

app.get(/d\/.+/,async(req,res,next)=>{
	console.dir(req.url)
	const donation = await getDonationUrl(req.url) 
	const user = donation.user_id
	const amount = donation.amount
	const succses_url = donation.succses_url
	const redirect = await bd.donateUrlConstructor(amount,succses_url)
	res.redirect(301, redirect)
})

app.get(/s\/.+s/,(req,res,next)=>{
	console.dir(req.url)
	await bd.getSuccessUr(req.url) 
	
	res.send('thanks')
})

app.get(/.+/,(req,res,next)=>{
	console.dir(req.url)
	// await findUrlAndUpdate 
	// req.url
	res.send('fuck u')
})


app.listen(3000)
