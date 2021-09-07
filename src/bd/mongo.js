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

	async bdOnlyUpdateMessage(user_id,message_to_add,new_status = ''){

		const user_object = await this.bdGetUser(user_id)

		const user_messages_with = user_object.user.chat_status
		message_to_add.to = message_to_add.to !=='' ? message_to_add.to :  user_messages_with
		// user_messages.push(message_to_add)
		console.log('AFTER PUSH()! below =>\r\n',user_messages_with)

		// if (!user_object) {

			let response,error

			await client.connect()
		
			const db = client.db(dbName)

			try{
		        const collection = db.collection(collections.bot_users)
		        const res = await collection.updateOne(
		        	{'user.id':user_id},
		        	{ $push: { 'user.messages_sended' : message_to_add} }
		        )

		        if (new_status!=='') {
			        await collection.updateOne(
			        	{'user.id':user_id},
			        	{ $set: { 'user.chat_status' : new_status} }
			        )
		        }
		        response = res ? 'OK' : false

		    } catch (err) {
		        console.log(err)

		        error = err
		    } finally {

		        await client.close()

		        return response
		    }

		// }
		// return 'bad'

	},

	// END of bdOnlyUpdateMessage


	// START of userStatus

	async userStatus(user_id){
		let response,error
		const user_object = await this.bdGetUser(user_id)

		try{

	        response = user_object.user.chat_status

	    } catch (err) {

	        error = err
	    } finally {

	        await client.close()

	        return response
	    }
	},

	// END of userStatus



}


