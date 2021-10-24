'use strict'
const domain = require('./../bot/serverURL.js')
module.exports = function(price,success_URL){
	// console.log('SERVER_URL',domain)
	// console.log('PRICE',price)
	// const domain = ''
	const url = /*'http'+'s'+'://'*/domain
	success_URL = url+success_URL
	const receiver = 4100116759492012
	const target = /*На развитие канала*/ '%D0%9D%D0%B0%20%D1%80%D0%B0%D0%B7%D0%B2%D0%B8%D1%82%D0%B8%D0%B5%20%D0%BA%D0%B0%D0%BD%D0%B0%D0%BB%D0%B0'
	// const successURL = url+'success'+user+time+'-'+price
	// const base64 =  Buffer.from(new String(`https://yoomoney.ru/quickpay/confirm.xml?receiver=${receiver}&successURL=${success_URL}&label=&quickpay-form=donate&is-inner-form=true&targets=${target}&comment=%09&sum=${price}&paymentType=AC`)).toString('base64')
	return 'url => ',`https://yoomoney.ru/quickpay/confirm.xml?receiver=${receiver}&successURL=${success_URL}&label=&quickpay-form=donate&is-inner-form=true&targets=${target}&comment=%09&sum=${price}&paymentType=AC`
} 