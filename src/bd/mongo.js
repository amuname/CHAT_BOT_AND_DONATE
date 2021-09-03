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

	        const query = { user_id : user_id }

	        const res = await collection.findOne(query)

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


		const user = await this.bdGet(user_object.id)

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

	},

	// END of bdAddUser



}


