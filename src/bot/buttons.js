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
	start_buttons : [
					    [{  // if url_or_callback == true
					        text: 'ya ya and what',
					        callback_data: 'test'
					    }]
					]



}

module.exports = buttonBuilder
