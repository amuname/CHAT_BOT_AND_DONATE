'use strict'
// const onMessagePromiseOptions = require('./onMessageOptions.js')
const serverUrl = require('./serverUrl.js')
const {inlineButtonsKeyBoard,start_buttons} = require('./buttons.js')
const mLogic = require('./../bd/mongo.js') // '..' - backward directory

// console.log(Telegraf)

module.exports  = {

	// tech methods

	responseToReadableMessage(telegram_response){
		// console.log('\r\n tel_resp: \r\n',telegram_response)
		return {
			msg_id : telegram_response.message_id,		sender_id : telegram_response.from.id,
			is_bot : telegram_response.from.is_bot,		f_name : telegram_response.from.first_name,
			chat_id : telegram_response.chat.id,		chat_f_name : telegram_response.chat.first_name,
			chat_type : telegram_response.chat.type,	date : telegram_response.date,
			text : telegram_response.text, 				lang_code : telegram_response.from.language_code,
		}
	},

	createDonationUrl(msg_info){
		// using normal buttons, like text, not inline
		const {msg_id,sender_id,is_bot,f_name,chat_id,
			chat_f_name,chat_type,date,text,lang_code} = this.responseToReadableMessage(msg_info)

		const sID = serverUrl + '/donation?' + 'sender_id=' + sender_id,
		lCode = sID + '&' + 'lang_code=' + lang_code,
		amount = lCode + '&' + 'amount=' + text,
		ch_id = amount + '&' + 'chat_id=' + chat_id,
		url = /*new URL(*/ch_id/*)*/	

		return url
	},


	// callback methods

	onMessage(ctx,bot){
		const message_object = ctx.update.message
		
		//!!!!!!!!!!!!!!!!
		//
		//here bot buttons AYAYAYAYA!! check SWITCH 
		//
		//!!!!!!!!!!!!!!!!

		const {msg_id,sender_id,is_bot,f_name,chat_id,
			chat_f_name,chat_type,date,text,lang_code} = this.responseToReadableMessage(message_object)

		// this method send message and can be usefull in server callbacks
		// 
		// console.log('\r\nOnmessage',text)
		return new Promise(async (res,rej)=> {
			const start_regexp = /\/start .\d+/,
			start = /\/start/

			switch (true){
				case start.test(text) : 
					const buttons = start_buttons

					const dbStartResponse =await mLogic.bdAddUser({
						user:{
							id:sender_id,
							lang:lang_code,
							chat_status:'bot',
						    conversations_with: {
						        ['bot']: {
						            messages_sended: [
						            	{
						            		usr_msg:text,
						            		time:date,
						            	},
						            ]
						        },
							},
						}
					})
					if(dbStartResponse=='OK'){

						const keyboard = await inlineButtonsKeyBoard(buttons)

						// console.log('mongo func\r\n','shood be "OK"\r\n'+dbStartResponse+'\r\n')

						res(await bot.telegram.sendMessage(sender_id,'hello there',keyboard))

					} 
					if(dbStartResponse=='registred'){
						res(await bot.telegram.sendMessage(sender_id,'Use buttons or /help command'))
					}
							
					break
				case start_regexp.test(text) : 
							//
							//
					break
				case /find member to chat/.test(text) : 

					await ctx.deleteMessage(msg_id)

					const dbStartSearch = await mLogic.bdOnlyUpdateMessage(sender_id,{
						            		usr_msg:text,
						            		time:date,
						            	})

					if (dbStartSearch){
						res(await ctx.reply('Looking for HOT MILFS'))
					}
					else res(await ctx.reply('smth went wrong'))
					// const keyboard = await inlineButtonsKeyBoard(start_buttons)
					// const response = await mLogic.bdGetUser(sender_id)
					// res(bot.telegram.sendMessage(chat_id,`u: ${response}`,keyboard))
							//
					break
				default :
					res(await bot.telegram.sendMessage(sender_id,'Use buttons or /help command'))
					// console.log('this is default condition')
			}
		})

	},


	//!!!!
	//
	//dont forget declare onQuery method below
	//				||
	//				\/
	//!!!!




	//  /\ onQuery method  /\
	//  || above		   ||


	// SEND message methods

	deleteMsg(chat_id,msg_id){
		if(typeof chat_id !== 'string' && typeof msg_id !== 'string') throw new TypeError('all must be strings')
		this.bot.deleteMessage(chat_id,msg_id)
	},

	editTextMessage(new_text,chat_id,msg_id,inline_obj = {}){
		inline_obj = inline_obj.reply_markup ? inline_obj : {}

		if(typeof new_text !== 'string' && typeof chat_id !== 'string' && typeof msg_id !== 'string' && typeof inline_obj !== 'object') throw new TypeError('one argument or more incorrect')
		
		this.bot.editMessageText(new_text,{chat_id,msg_id,inline_obj})
	},

	sendMsg(chat_id,msg_or_sticker_url,inline_obj = {}){
		inline_obj = inline_obj.reply_markup ? inline_obj : {}
		// console.log('what')
		return new Promise(async (res,rej)=>{
			try{
				new URL(msg_or_sticker_url)
				const message = await this.sendSticker(chat_id,msg_or_sticker_url,inline_obj)
				res(message)
			}

			catch(err){
				if (err instanceof TypeError) {
					const message = await this.sendMessage(chat_id,msg_or_sticker_url,inline_obj)
					res(message)
				}
				else throw new Error('wrong msg type')
			}
		})
	},




}



