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

const user = 1079919770 //1079919770
	// START of bdGetUser
	// bdGetUser(user)

	// allInQueue()

	// notId(1079919770)
					// bdAddUser({
					// 			user:{
					// 				id:user,
					// 				lang:'ru',
					// 				chat_status:'bot',
					// 				messages_sended: [
					// 	            	{
					// 	            		to:'bot',
					// 	            		usr_msg:'/start',
					// 	            		time:123,
					// 	            	},
					// 	            ]

					// 			}
					// 		})

	async function bdGetUser(user_id){
		
		let response,error

		await client.connect()
		
		const db = client.db(dbName)

		try{

	        const collection = db.collection(collections.bot_users)

	        const query = { 
	        	user:{
	        		id:user_id
	        	}  
	        }

	        const res = await collection.findOne({'user.id':user_id})

	        // console.log(res.user)
	        console.log('\r\nuser',res.user)

	        response = res

	    } catch (err) {

	        error = err
	    } finally {

	        await client.close()

	        return response
	    }
	}

	async function bdAddUser(user_object){


		// const user = await this.bdGetUser(user_object.id)

		// if (!user) {

			let response,error

			await client.connect()
		
			const db = client.db(dbName)

			try{

		        const collection = db.collection(collections.bot_users)

		        const res = await collection.insertOne(user_object)

		        console.log(res)

		        response = res ? 'OK' : false

		    } catch (err) {

		        error = err
		        console.error(err)
		    } finally {

		        await client.close()

		        return response
		    }

		}
	// 	return 'registred'

	// }

	async function allInQueue(){
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
	        	return user_array[index]
	        }
	        const first_user = randomUser(array_of_users_in_queue)
	        console.log(first_user)
	        response = 'OK'

	    } catch (err) {

	        error = err
	    } finally {

	        await client.close()

	        return response
	    }
	}



	async function notId(id) {
		await client.connect()
		const db = client.db(dbName)
		const collection = db.collection(collections.bot_users)
		const first_user_cursor = await collection.find({'user.id': {$not: {$eq: id} } ,'user.chat_status':'in_queue'})
		const arr = await first_user_cursor.toArray()
		await client.close()
		return console.log(arr)	
	}