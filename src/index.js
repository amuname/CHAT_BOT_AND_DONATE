'use strict'
const Bot = require('./bot/bot.js')
const token = require('./bot/token.js')
const bd = require('./bd/mongo.js')


const BOT = new Bot(token)


// BOT.getUpdates().then(e=>console.log(e))

BOT.on('message',
	(ctx)=>BOT.onMessage(ctx)
)
BOT.on('callback_query',function(){
	
})

BOT.launch()

