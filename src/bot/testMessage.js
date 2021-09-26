const {Telegraf} = require('telegraf')

const Bot = new Telegraf('1049537673:AAHQXK5cSSYsZhACGr6kCDFzzh0kSfldEGY')

Bot.on(['sticker'],
	(ctx)=>{
		// console.log(ctx.update.message)
		// const ch_id = ctx.update.message.from.id
		// Bot.telegram.sendSticker(ch_id,'CAACAgIAAxkBAAIDJ2E8VJKudqY6l4YfZtvRxQQ1SBcPAAKWAANXTxUI0EvyRYszA4AgBA')
		ctx.reply('file',{
			'reply_markup': {
			    'inline_keyboard': [
					    [{  // if url_or_callback == true
					        text: 'donate for VIP status',
					        callback_data: 'test'
					    }],
					] 
			    }
			}
		)
	}
)

Bot.on('photo',
	(ctx)=>{
		console.log(ctx.update.message)
		const photo = ctx.update.message.photo
		const photo_l = ctx.update.message.photo[photo.length-1].file_id
		const ch_id = ctx.update.message.from.id
		Bot.telegram.sendPhoto(ch_id,photo_l)
		// (ctx)=>ctx.reply('text')
	}
)

Bot.on('callback_query',
	(ctx)=>{
		const message_object = ctx.update.callback_query
		const query_data = message_object.data
		const sender_id = message_object.from.id
		console.log(message_object)
		console.log(query_data)
		console.log(sender_id)
		ctx.reply('text')
	}
)

Bot.on('message',
	(ctx)=>ctx.reply('text')
)

Bot.launch()


// callback_query: {
//     id: '4638220095128766183',
//     from: {
//       id: 1079919770,
//       is_bot: false,
//       first_name: 'alex',
//       language_code: 'ru'
//     },
//     message: {
//       message_id: 1781,
//       from: [Object],
//       chat: [Object],
//       date: 1632653143,
//       text: 'file',
//       reply_markup: [Object]
//     },
//     chat_instance: '-1970029530548321910',
//     data: 'test'
//   }