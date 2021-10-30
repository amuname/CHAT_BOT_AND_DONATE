'use strict'
const express = require('express')
const donateUrlConstructor = require('./donateUrl.js')
const {Telegram} = require('telegraf')
const token = require('./../bot/token.js')
const date = require('./../bot/date.js')
const bd = require('./../bd/mongo.js')
const app = express()

app.get(/r\/.+/,async(req,res,next)=>{
	console.dir(req.url )
	const donation = await bd.getDonationUrl(req.url) 
	console.dir(donation)

	// const user = donation.user_id
	const currency = donation.currency
	const succses_url = donation.succses_url
	const redirect = await donateUrlConstructor(currency,succses_url)
	res.redirect(301, redirect)
	// console.dir(redirect)

	// res.send('thanks')

})

app.get(/s\/.+s/,async(req,res,next)=>{
	const r = await bd.getSuccessUrl(req.url)
	console.dir(r.amount)
	const bot = new Telegram(token)
	let a;
	if (r.amount.includes('one') ) a = await bd.bdUpdateUserPhotoStatus(r.user_id,date(1) )
	if (r.amount.includes('five') ) a = await bd.bdUpdateUserPhotoStatus(r.user_id,date(5) )
	if (r.amount.includes('two_w') ) a = await bd.bdUpdateUserPhotoStatus(r.user_id,date(14) )
	if (r.amount.includes('mounth') ) a = await bd.bdUpdateUserPhotoStatus(r.user_id,date(30) )
	if (r.amount.includes('always') ) a = await bd.bdUpdateUserPhotoStatus(r.user_id,date(300) )
	console.log(a)
	if(a) await bot.sendMessage(r.user_id,'thank for donation!') 
	// console.log(r)
	// res.redirect(301, redirect)
	res.send('thanks')
})

app.get(/.+/,(req,res,next)=>{
	console.dir(req.url)
	// await findUrlAndUpdate 
	// req.url
	res.send('fuck u')
})


app.listen(3000)
