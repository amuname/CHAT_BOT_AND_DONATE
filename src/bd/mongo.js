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

async function bdGet(new_item){
		
		let response,error

		await client.connect()
		
		const db = client.db(dbName)

	try{

        let collection = db.collection(collections.bot_users)

        let query = { name: 'Volkswagen' }

        let res = await collection.findOne(query)

        response = res

    } catch (err) {

        error = err
    } finally {

        client.close()

        return response || error
    }
}

module.exports = {
	// bdAdd,
	// bdUpdate,
	bdGet,
}

