const {inlineButtonsKeyBoard,start_buttons} = require('./buttons.js')
const mLogic = require('./../bd/mongo.js') // '..' - backward directory


async function onMessagePromiseOptions(text,chat_id,ctx,res,rej){
	
	const start_regexp = /\/start .\d+/,
	start = /\/start/

	switch (true){
				case start.test(text) : 
					const buttons = start_buttons

					const what = await mLogic.bdGet({id:213})

					console.log(what)

					const keyboard = await inlineButtonsKeyBoard(buttons)

					// await bd.write message?)) or smth
					// await this.telegram.callApi('sendMessage', { chat_id, text:'asa'})
					console.log('\r\ndvsdvsvw\r\n')

					res(await this.telegram.sendMessage(chat_id,'hello there',keyboard))
					//
					break
				case start_regexp.test(text) : 
					//
					//
					break
				case /a/.test(text) : 
					//
					res(this.telegram.sendMessage(chat_id,'wowowow'))
					//
					break
				default :
					return
					// console.log('this is default condition')
			}

}





module.exports = onMessagePromiseOptions
