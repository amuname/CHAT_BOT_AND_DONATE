const {Telegraf} = require('telegraf')

const Bot = new Telegraf('1049537673:AAHQXK5cSSYsZhACGr6kCDFzzh0kSfldEGY')

Bot.on(['photo','sticker'],
	(ctx)=>{
		console.log(ctx.update.message)
		ctx.reply('file')
	}
)

Bot.on('message',
	(ctx)=>ctx.reply('text')
)

Bot.launch()