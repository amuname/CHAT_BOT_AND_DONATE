const {Telegraf} = require('telegraf')
const buttons = require('./buttons.js')
const serverUrl = require('./serverUrl.js')

console.log(Telegraf)

class Bot extends Telegraf {
	constructor(token){
		super(token)
	}

	createDonationUrl(msg_info){
		// using normal buttons, like text, not inline
		const msg_id = msg_info.message_id,		sender_id = msg_info.from.id,
		is_bot = msg_info.from.is_bot,			f_name = msg_info.from.first_name,
		chat_id = msg_info.chat.id,				chat_f_name = msg_info.chat.first_name,
		chat_type = msg_info.chat.type,			date = msg_info.date,
		text = msg_info.text, 					lang_code = msg_info.from.language_code

		const sID = serverUrl + '/donation?' + 'sender_id=' + sender_id,
		lCode = sID + '&' + 'lang_code=' + lang_code,
		amount = lCode + '&' + 'amount=' + text,
		ch_id = amount + '&' + 'chat_id=' + chat_id,
		url = /*new URL(*/ch_id/*)*/

		return url
	}




}


module.exports = Bot
