'use strict'
const { MongoClient } = require('mongodb')
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)

// Database Name
const dbName = 'myProject'

const collections = {
	bot_companies : 'bot_companies',
	bot_curiers : 'bot_curiers',
	bot_admins : 'bot_admins', //??? optional
	bot_users : 'bot_users',
	bot_donation : 'bot_donation',
	bot_config : 'bot_config',
}

module.exports = {


	// START of bdGetUser

	async bdGetUser(user_id){
		let response,error
		await client.connect()
		const db = client.db(dbName)
		try{
	        const collection = db.collection(collections.bot_users)
	        const res = await collection.findOne({'user.id':user_id})
	        // console.log(res.user.conversations_with.bot)
	        response = res
	    } catch (err) {
	        error = err
	    } finally {
	        await client.close()
	        return response
	    }
	},

	// END of bdGetUser


	// START of bdAddUser

	async bdAddUser(user_object){
		const user = await this.bdGetUser(user_object.user.id)
		if (!user) {
			let response,error
			await client.connect()
			const db = client.db(dbName)
			try{
		        const collection = db.collection(collections.bot_users)
		        const res = await collection.insertOne(user_object)
		        response = res ? 'OK' : false
		    } catch (err) {
		        error = err
		    } finally {
		        await client.close()
		        return response
		    }
		}
		return 'registred'
	},

	// END of bdAddUser


	// START of bdOnlyUpdateMessage

	async bdOnlyUpdateMessage(user_id,message_to_add){
		let response,error
		await client.connect()
		const db = client.db(dbName)
		try{
	        const collection = db.collection(collections.bot_users)

			const user_object = await collection.findOne({'user.id':user_id})
			const user_messages_with = user_object.user.chat_status
			message_to_add.to = message_to_add.to !=='' ? message_to_add.to :  user_messages_with
			// user_messages.push(message_to_add)
			console.log('AFTER PUSH()! below =>\r\n',user_messages_with)

	        const res = await collection.updateOne(
	        	{'user.id':user_id},
	        	{ 
	        		$push: { 'user.messages_sended' : message_to_add}, 
	        		$set: { 'user.chat_status' : message_to_add.to}
	        	}
	        )
		    // await collection.updateOne(
		    //    	{'user.id':user_id},
		    //    	{ $set: { 'user.chat_status' : message_to_add.to} }
		    // )
	        response = res ? 'OK' : false
	    } catch (err) {
	        console.log(err)
	        error = err
	    } finally {
	        await client.close()
	        return response
	    }
	},

	// END of bdOnlyUpdateMessage


	// START of userStatus

	async userStatus(user_id){
		let response,error

		try{
			await client.connect()
			const db = client.db(dbName)
			const collection = db.collection(collections.bot_users)
	        const cursor = await collection.find({'user.id':user_id})
	        const res = await cursor.toArray()

	        // console.log(res.length)
	        if (res.length==0) response = undefined
	        else {
	        	response = res[0].user.chat_status
	        }

	    } catch (err) {

	        error = err
	        console.log(err)
	    } finally {

	        await client.close()

	        return response
	    }
	},

	// END of userStatus


	// START of userPhoto

	async userPhoto(user_id){
		let response,error
		const user_object = await this.bdGetUser(user_id)

		try{

	        response = user_object.user.vip

	    } catch (err) {

	        error = err
	    } finally {

	        // await client.close()

	        return response
	    }
	},

	// END of userPhoto


	// START of twoUsersToChat

	async twoUsersToChat(){
		let response,error
		await client.connect()
		const db = client.db(dbName)
		try{
	        const collection = db.collection(collections.bot_users)
	        const first_user_cursor = await collection.find({'user.chat_status':'in_queue'})
	        const array_of_users_in_queue = await first_user_cursor.toArray()
	        function randomUser(user_array){
	        	const min = 0
	        	const max = user_array.length-1
	        	const index = Math.round(min + Math.random() * (max - min))
	        	return user_array[index].user.id
	        }
	        const first_user = randomUser(array_of_users_in_queue)
	        // console.log(first_user)
	        //
	        //
	        // ВОТ ТУТ ПИЗДА
	        //
	        //
	        const second_user_cursor = await collection.find({'user.id': {$not: {$eq: first_user} } ,'user.chat_status':'in_queue'})
			const arr_of_filtred_users = await second_user_cursor.toArray()
			const second_user = randomUser(arr_of_filtred_users)
	        console.log(second_user)

	        const res1 = await collection.updateOne(
		        	{'user.id':first_user},
		        	{ $set: { 'user.chat_status' : second_user.toString()} }
		        )

	        const res2 = await collection.updateOne(
		        	{'user.id':second_user},
		        	{ $set: { 'user.chat_status' : first_user.toString()} }
		        )
	        
	        response = res1 && res2 ? {first_user,second_user} : false

	    } catch (err) {

	        // console.log(err)
	    } finally {

	        await client.close()

	        return response
	    }
	},

	// END of twoUsersToChat


	// START of writeDonationUrl

	async writeDonationUrl(user_id,url,donation_status,amount,currency){
		let response,error
		const user_object = {
			'user_id' : user_id,
			'url' : url,
			'donation_status' : donation_status,
			'amount' : amount,
			'currency' : currency,
		}
		await client.connect()
		const db = client.db(dbName)

		try{
			const collection = db.collection(collections.bot_donation)
		    const res = await collection.insertOne({'donation':user_object})

	    } catch (err) {

	        error = err
	    } finally {

	        await client.close()

	        return response
	    }
	},

	// END of writeDonationUrl


	// START of successUrl

	async successUrl(url){
		let response,error
		await client.connect()
		const db = client.db(dbName)

		try{
			const collection = db.collection(collections.bot_donation)
		    const res = await collection.findOne({'donation.url':url})
		    if (res){
		    	
		    }
	    } catch (err) {

	        error = err
	    } finally {

	        await client.close()

	        return response
	    }
	},

	// END of successUrl

	
	// START of configCheck

	async configCheck(){
			
		const donator_config = {
			config:{
				rub: {
					one_day : 59,
					five_days : 199,
					two_weeks : 499,
					mounth : 899,
					always : 3999,
				},
				bucks: {
					one_day : 2,
					five_days : 6,
					two_weeks : 8,
					mounth : 14,
					always : 59,
				}	
			}
			
		}

		await client.connect()
		const db = client.db(dbName)

		try{
			const collection = db.collection(collections.bot_config)

		    const cursor = await collection.find({'config':Object})
		    const res = await cursor.toArray()

		    if (res.length==0){
		    	await collection.insertOne(donator_config)
		    }
		    console.log(res)
	    } catch (err) {
		    console.log(err,"HANDLED ERROORR")

	    } finally {

	        await client.close()

	        return 
	    }
	},

	// END of configCheck


	// START of configFind

	async configFind(currency){
		let query 
		await client.connect()
		const db = client.db(dbName)

		try{
			const collection = db.collection(collections.bot_config)
		    const res = await collection.findOne({'config':Object})
		    query = res.config[currency]
	    } catch (err) {
		    console.log(err,"HANDLED ERROORR")

	    } finally {

	        await client.close()

	        return query 
	    }
	},

	// END of configFind


}


