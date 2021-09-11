'use strict'
const botFuncs = require('./bot/bot.js')
const {Telegraf} = require('telegraf')
const token = require('./bot/token.js')
const bd = require('./bd/mongo.js')


const Bot = new Telegraf(token)

// BOT.getUpdates().then(e=>console.log(e))

Bot.on('message',
	(ctx)=>botFuncs.onMessage(ctx,Bot)
)
Bot.on('callback_query',function(){
	
})

Bot.launch()

setInterval(botFuncs.intervalQuery.bind(Bot), 2000)
