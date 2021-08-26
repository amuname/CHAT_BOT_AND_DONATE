const Bot = require('./bot/bot.js')
const token = require('./bot/token.js')
const bd = require('./bd/mongo.js')


const BOT = new Bot(token)

console.log(BOT)

BOT.on('message',function(ctx){
	console.log(ctx.update.message)
})
BOT.on('callback_query',function(){
	
})

BOT.launch()