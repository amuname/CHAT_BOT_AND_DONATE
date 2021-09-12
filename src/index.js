'use strict'
const botFuncs = require('./bot/bot.js')
const {Telegraf} = require('telegraf')
const token = require('./bot/token.js')
const bd = require('./bd/mongo.js')


const Bot = new Telegraf(token)

// BOT.getUpdates().then(e=>console.log(e))

Bot.on('text',
	(ctx)=>botFuncs.onText(ctx,Bot)
)
Bot.on(['photo','sticker'],
	(ctx)=>botFuncs.onPhoto(ctx,Bot)
)
// Bot.on('sticker',
// 	(ctx)=>botFuncs.onSticker(ctx,Bot)
// )
Bot.on('callback_query',function(){
	
})

Bot.launch()

setInterval(botFuncs.intervalQuery.bind(Bot), 2000)
