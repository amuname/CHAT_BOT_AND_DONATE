'use strict'
function addDateToNow(days_to_add = 0){
	const data_to_set = new Date().getDate()+days_to_add
	const date_to_date = new Date().setDate(data_to_set)
	return new Date(date_to_date).toLocaleString().match(/.*\d{4}/)[0]
}
module.exports = addDateToNow


