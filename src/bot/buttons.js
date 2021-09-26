'use strict'
const buttonBuilder = {

	inlineButtonsKeyBoard(array_of_keyboard_buttons){

		if (!Array.isArray(array_of_keyboard_buttons)) throw new TypeError('keyboard is not array')

		return new Promise((res,rej)=>{

			// this array_of_keyboard_buttons
			//
			// how 2 horizontal buttons look like
			// [
			//     [{  // if url_or_callback == true
			//         text: 'donate me pls',
			//         url: 'https://t.me/Chat_Admin_Message_Sender_BOT?start='+msg.chat.id
			//     },
			//     {   // if url_or_callback == false
			//         text: 'Пустой шаблон №2',
			//         callback_data: 'COMMAND_TEMPLATE2'
			//     }]
			// ]
			
			res({
			'reply_markup': {
			    'inline_keyboard': array_of_keyboard_buttons 
			    }
			})

		})	
	},
	buttonsKeyBoard(array_of_keyboard_buttons){
		if (!Array.isArray(array_of_keyboard_buttons)) throw new TypeError('keyboard is not array')
		return new Promise((res,rej)=>{
			res({
			'reply_markup': {
			    'keyboard': array_of_keyboard_buttons 
			    }
			})

		})	
	},
	start_buttons : [
					    [{  // if url_or_callback == true
					        text: 'find member to chat',
					        // callback_data: 'test'
					    }],
					    [{  // if url_or_callback == true
					        text: 'read rules',
					        // callback_data: 'test'
					    },
					    {  // if url_or_callback == true
					        text: 'donate for VIP status',
					        // callback_data: 'test'
					    }],
					    // [{  // if url_or_callback == true
					    //     text: 'donate for VIP status',
					    //     // callback_data: 'test'
					    // }]
					],
	leave_buttons: [
					    [{  // if url_or_callback == true
					        text: 'Return to bot menu',
					        // callback_data: 'test'
					    }],
					],
	lang_buttons: [
					    [{  // if url_or_callback == true
					        text: 'ru',
					        // callback_data: 'test'
					    }],
					    [{  // if url_or_callback == true
					        text: 'en',
					        // callback_data: 'test'
					    }],
					],
	donateButtons(currency,object_values){
		let length = Object.entries(object_values).length
		let array_of_buttons = new Array(length)
		for (let i = 0; i < length; i++ ){ //Object.values(obj)[1]
			const phrase = Object.keys(object_values)[i].replace(/_/,' ') 
			array_of_buttons[i] = {
				text : phrase,
				callback_data :`${Object.values(object_values)[i]}  ${currency}`,
			}
		}
		return [array_of_buttons]
	},



}

module.exports = buttonBuilder

// buttonBuilder.donate_buttons('rub',{one_day:59,
// five_days:199,
// two_weeks:499,
// mounth:899,
// always:3999,})

