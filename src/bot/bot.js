'use strict'
// const onMessagePromiseOptions = require('./onMessageOptions.js')
const serverUrl = require('./serverUrl.js')
const fs = require('fs')
const imGt = require('../server/imageGet.js')
const dateToAdd = require('./date.js') // argument in (days) return value '321321321321321'
const {inlineButtonsKeyBoard,buttonsKeyBoard,start_buttons,leave_buttons,donate_buttons} = require('./buttons.js')
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
			text : telegram_response.text||telegram_response.caption||null,
			lang_code : telegram_response.from.language_code,
			// u need  {
  			//	 file_id: 'AgACAgIAAxkBAAICfmE4_IaoMFLiQBb5FgTepvbdhYAcAAIetDEbvxzIST3toFg0cb4rAQADAgADeQADIAQ',
			// }
			// then get url like:
			// https://api.telegram.org/file/bot<token>/<file_path>
			// photo: [
			// {
			//     file_id: 'AgACAgIAAxkBAAIDI2E8UIGWbm5mHpp9bkttBrcVqHplAAK8tDEb_orRSbRJ346YcTECAQADAgADcwADIAQ',
			//     file_unique_id: 'AQADvLQxG_6K0Ul4',
			//     file_size: 1311,
			//     width: 51,
			//     height: 90
			// },
			// {
			//     file_id: 'AgACAgIAAxkBAAIDI2E8UIGWbm5mHpp9bkttBrcVqHplAAK8tDEb_orRSbRJ346YcTECAQADAgADbQADIAQ',
			//     file_unique_id: 'AQADvLQxG_6K0Uly',
			//     file_size: 13887,
			//     width: 180,
			//     height: 320
			// },
			// {
			//     file_id: 'AgACAgIAAxkBAAIDI2E8UIGWbm5mHpp9bkttBrcVqHplAAK8tDEb_orRSbRJ346YcTECAQADAgADeAADIAQ',
			//     file_unique_id: 'AQADvLQxG_6K0Ul9',
			//     file_size: 30783,
			//     width: 339,
			//     height: 604
			// }
			// ]
			photo : telegram_response.photo || null,
			//video: {
			//     duration: 1,
			//     width: 720,
			//     height: 1280,
			//     mime_type: 'video/mp4',
			//     thumb: {
			//     	file_id: 'AAMCAgADGQEAAgMlYTxQ4FW00NIpOyhfyHlwpV2RTJ4AAqoSAAKZgeBJTEEUio7nUtkBAAdtAAMgBA',
			//     	file_unique_id: 'AQADqhIAApmB4Ely',
			//     	file_size: 3310,
			//     	width: 180,
			//     	height: 320
			//     },
			//     file_id: 'BAACAgIAAxkBAAIDJWE8UOBVtNDSKTsoX8h5cKVdkUyeAAKqEgACmYHgSUxBFIqO51LZIAQ',
			//     file_unique_id: 'AgADqhIAApmB4Ek',
			//     file_size: 224931
			// }
			video : telegram_response.video || null,
			//voice: {
			//   duration: 0,
			//   mime_type: 'audio/ogg',
			//   file_id: 'AwACAgIAAxkBAAIDIWE8T_5r3Dic9PkkFls5D-cQoQ0MAAKpEgACmYHgSStSMfVGx4mTIAQ',
			//   file_unique_id: 'AgADqRIAApmB4Ek',
			//   file_size: 4167
			// }
			voice: telegram_response.voice || null,
			// sticker: {
			//     	width: 512,
			// 		height: 512,
			// 		emoji: '👌',
			// 		set_name: 'Kabanch',
			//    	is_animated: false,
			// 		thumb: {
			//    		file_id: 'AAMCAgADGQEAAgMnYTxUkq52pjqXhh9m29HFBDVIFw8AApYAA1dPFQjQS_JFizMDgAEAB20AAyAE',
			//	 	    file_unique_id: 'AQADlgADV08VCHI',
			// 		    file_size: 4000,
			// 	    	width: 128,
			// 	    	height: 128
			//    	},
			//    	file_id: 'CAACAgIAAxkBAAIDJ2E8VJKudqY6l4YfZtvRxQQ1SBcPAAKWAANXTxUI0EvyRYszA4AgBA',
			//    	file_unique_id: 'AgADlgADV08VCA',
			//    	file_size: 20814
  			//}
  			sticker: telegram_response.sticker || null,
  			// only if photo has caption
  			caption:telegram_response.caption || null
		}
	},

	async createDonationUrl(msg_info){
		// use inline buttons
		const base64_url = Buffer.from(new String(msg_info.sender_id+msg_info.amount)).toString('base64') 

		const bd_url = serverUrl + '?donation_id=' + base64_url
		return bd_url
	},


	// callback methods

	onText(ctx,bot){
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
			const start_keyboard = await buttonsKeyBoard(start_buttons)
			const leave_butt = await buttonsKeyBoard(leave_buttons)
			const start_regexp = /\/start .\d+/,
			start = /\/start/

			const user_status = await mLogic.userStatus(sender_id)
			// console.log(user_status)

			switch (true){
				case start.test(text) : 

					if(user_status =='in_queue'){
						return res(await bot.telegram.sendMessage(sender_id,'use buttons to leave queue or chat',leave_butt))
					}
					if(!user_status){
						const dbStartResponse =await mLogic.bdAddUser({
							user:{
								id:sender_id,
								lang:lang_code,
								chat_status:'bot',
					            messages_sended: [
					            	{
					            		to:'bot',
					            		usr_msg:text,
					            		time:date,
					            		photo:null
					            	},
					            ],
					            vip: dateToAdd(-1),
					            lang:''
							}
						})	

						if(dbStartResponse=='OK'){

							// console.log('mongo func\r\n','shood be "OK"\r\n'+dbStartResponse+'\r\n')

							res(await bot.telegram.sendMessage(sender_id,'hello there',start_keyboard))

						}
						if(dbStartResponse=='registred'){
							res(await bot.telegram.sendMessage(sender_id,'Use buttons or /help command',start_keyboard))
						}
					}
					 
							
					break
				case start_regexp.test(text) && user_status =='bot' : 
							//
							//
					break
				case /find member to chat/.test(text) && user_status =='bot' : 

					await ctx.deleteMessage(msg_id)

					const updadte_queue_status = await mLogic.bdOnlyUpdateMessage(sender_id,{
				            		to:'in_queue',
				            		usr_msg:text,
				            		time:date,
				            	})

					if (updadte_queue_status){
						res(await ctx.reply('Looking for HOT MILFS',leave_butt))
						// function connectUsers started every 1-2 seconds=>
						//=> from setInterval in index & connect users directly
					}
					else res(await ctx.reply('smth went wrong'))

					break
				case /Return to bot menu/.test(text) && user_status!=='bot' :
					// только когда пользователь в чате или в поиске
					// возварщает к меню бота
					// console.log('Return to bot menu CONDITION')
					if (/^\d+$/.test(user_status)) {
						// console.log('Return to bot menu \r\nIF \r\nIF \r\nCONDITION')
						await mLogic.bdOnlyUpdateMessage(parseInt(user_status),{
				            		to:'bot',
				            		usr_msg:'Opponent leave dialog',
				            		time:date,
				            	})

						await bot.telegram.sendMessage(user_status,'Opponent leave dialog',)
						await bot.telegram.sendMessage(user_status,'You`re in the bot menu now',start_keyboard)

					}
					// console.log('\r\nAFTER \r\nIF \r\nCONDITION')

					await mLogic.bdOnlyUpdateMessage(sender_id,{
				            		to:'bot',
				            		usr_msg:text,
				            		time:date,
				            	})

					res(await bot.telegram.sendMessage(sender_id,'You`re in the bot menu now',start_keyboard))
					break
				case /.*/.test(text) && /in_queue/.test(user_status) :
					// только когда пользователь в поиске
					res(await bot.telegram.sendMessage(sender_id,`You already in queue...
						Use buttons or /help command`,leave_butt))

					break
				case /.*/.test(text) && /^\d+$/.test(user_status) :
					// только когда пользователь в чате с пользователем
					await mLogic.bdOnlyUpdateMessage(sender_id,{
				            		to:user_status,
				            		usr_msg:text,
				            		time:date,
				            	})
					const msg_to_delete = await ctx.reply('sending...')
					await bot.telegram.sendMessage(user_status,text)
					await ctx.deleteMessage(msg_to_delete.message_id)
					res()

					break
				default :

				console.log('\r\nUSER MSG\n',message_object)
				// await bot.telegram.sendPhoto(sender_id,'https://docs.mongodb.com/images/mongodb-logo.png')

				/*const m =*/ await bot.telegram.sendMessage(sender_id,'Use buttons or /help command',start_keyboard)
				// console.log('here!!!!!!!!!!!!!!!!!!!!!!!!\r\n',m)
				// m = {
				//   message_id: 617,
				//   from: {
				//     id: 1049537673,
				//     is_bot: true,
				//     first_name: 'anywayineedit',
				//     username: 'awini_bot'
				//   },
				//   chat: { id: 1079919770, first_name: 'alex', type: 'private' },
				//   date: 1630955801,
				//   text: 'Use buttons or /help command',
				//   entities: [ { offset: 15, length: 5, type: 'bot_command' } ]
				// }
				//
				//
					res()
					console.log('this is default condition')
			}
		})

	},


	onPhoto(ctx,bot){
		return new Promise(async (res,rej)=> {
		const message_object = ctx.update.message
		
		//!!!!!!!!!!!!!!!!
		//
		//here bot buttons AYAYAYAYA!! check SWITCH 
		//
		//!!!!!!!!!!!!!!!!
		const {msg_id,sender_id,is_bot,f_name,chat_id,
			chat_f_name,chat_type,date,text,lang_code,photo,caption} = this.responseToReadableMessage(message_object)
		

			const d_buttons = await buttonsKeyBoard(donate_buttons)
			console.log('for photos AYAYAYA',sender_id)
			const user_object = await mLogic.bdGetUser(sender_id)
			if(!user_object){
				setTimeout(this.onPhoto.bind(this,ctx,bot), 3000)
				return
			}
			console.log('user photo sender object',user_object)
			const vip_status = user_object.user.vip
			const user_status = user_object.user.chat_status
			// console.log('vip_status => %s\r\nuser_status => %s\r\nuser %s',vip_status,user_status,user)
			switch (true){
				case new Date(vip_status) <= new Date() && /^\d+$/.test(user_status) : 	//gona be >= not <=
					console.log('VIP STATUS')
					// photo with caption/text need to send text to another user
					// like message or msg with photo
					const hi_res_photo = photo[photo.length-1].file_id
					const photo_system_addres = await imGt(hi_res_photo)
					const msg_to_delete = await ctx.reply('sending...')
					await mLogic.bdOnlyUpdateMessage(sender_id,{
				            		to:user_status,
				            		usr_msg:text,
				            		photo:photo_system_addres,
				            		time:date,
				            		caption:caption
				            	})
					await bot.telegram.sendPhoto(user_status, hi_res_photo)// for dending data use { source: './img/'+photo_system_addres}
					await ctx.deleteMessage(msg_to_delete.message_id)
					res()
					return
					break
				default :
				await bot.telegram.sendMessage(sender_id,'You can`t send photo\n to another user or bot,\
				\nuse /help command to understand\
				\nuse /vip to donate ',inlineButtonsKeyBoard)
				res()  
				// return
			}
		})

	},


	async onSticker(ctx,bot){
		const message_object = ctx.update.message
		
		//!!!!!!!!!!!!!!!!
		//
		//here bot buttons AYAYAYAYA!! check SWITCH 
		//
		//!!!!!!!!!!!!!!!!

		const {msg_id,sender_id,is_bot,f_name,chat_id,
			chat_f_name,chat_type,date,text,lang_code,sticker} = this.responseToReadableMessage(message_object)
	
		const user_object = await mLogic.bdGetUser(sender_id)
		const user_status = user_object.user.chat_status	
		const msg_to_delete = await ctx.reply('sending...')
		await mLogic.bdOnlyUpdateMessage(sender_id,{
				            		to:user_status,
				            		usr_msg:text,
				            		sticker:sticker.file_id,
				            		time:date,
				            		caption:caption
				            	})
		await bot.telegram.sendSticker(user_status,sticker.file_id)
		await ctx.deleteMessage(msg_to_delete.message_id)
	},


	//!!!!
	//
	//dont forget declare onQuery method below
	//				||
	//				\/
	//!!!!
	async onQuery(ctx,bot){
		const message_object = ctx.update.callback_query
		const query_data = message_object.data
		const sender_id = message_object.from.id
		if(true){ // check if it amount callback query

			const currency = query_data.replace(/\D+/gm,'')
			const amount = query_data.replace(/\d+/gm,'')
			const url = await this.createDonationUrl({sender_id,query_data})
			const donate_board = await buttonsKeyBoard([
					[{
						text:'url to you',
						url:url,
					}]
				])
			if(rub_or_bucks =='rub'){
				await mLogic.writeDonationUrl(sender_id,url,'new',amount,currency) //user_id,url,donation_status,amount,currency
			}
			
			ctx.reply('donate here pls <3',donate_board)
		}

		return
	}



	//  /\ onQuery method  /\
	//  || above		   ||



	async intervalQuery(){
		// женит двух пользователей 
		const users_update = await mLogic.twoUsersToChat()
		if (users_update instanceof Object) {
			const {first_user,second_user} = users_update
			const text = 'You`re in dialog now'
			await this.telegram.sendMessage(first_user,text)
			await this.telegram.sendMessage(second_user,text)
		}
		return
	},	

	denyMsg(ctx,bot){
		return new Promise( async (res,rej)=>{
			const start_keyboard = await buttonsKeyBoard(start_buttons)
			res(await bot.telegram.sendMessage(sender_id,'Use buttons or /help command',start_keyboard))
		})
	},


}



