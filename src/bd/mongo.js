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
}

async function main(method,filter) {
	// Use connect method to connect to the server
	await client.connect()
	console.log('Connected successfully to server')
	const db = client.db(dbName)
	const collection = db.collection(collections.bot_companies)
	// the following code examples can be pasted here...
	method(filter,collection)

	return 'done.'
}

async function bdGet(filter){
	let result,error

	main(bdGetOne,filter)
	  .then( cursor => result = cursor)
	  .catch( bdEerror => error = bdError)
	  .finally(() => client.close())

	return error || result
}

async function bdGetOne(filter,collection){
	return collection.findOne(filter)
}

module.exports = {
	// bdAdd,
	// bdUpdate,
	bdGet,
}

