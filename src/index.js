'use strict'
const botFuncs = require('./bot/bot.js')
const {Telegraf} = require('telegraf')
const token = require('./bot/token.js')
const bd = require('./bd/mongo.js')

bd.configCheck()

const Bot = new Telegraf(token)

// BOT.getUpdates().then(e=>console.log(e))

Bot.on('text',
	(ctx)=>botFuncs.onText(ctx,Bot)
)
Bot.on(['photo'],
	(ctx)=>setTimeout(botFuncs.onPhoto.bind(botFuncs,ctx,Bot),3000)
)
Bot.on('sticker',
	(ctx)=>botFuncs.onSticker(ctx,Bot)
)
Bot.on('callback_query',
	(ctx)=>botFuncs.onQuery(ctx,Bot)
)

Bot.on('message',
	(ctx)=>botFuncs.denyMsg(ctx,Bot)
)

Bot.launch()

setInterval(botFuncs.intervalQuery.bind(Bot), 2000)
