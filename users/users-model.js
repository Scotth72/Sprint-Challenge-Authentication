const db = require('../database/dbConfig');

module.exports = {
	get,
	getBy,
	insert
};

function get() {
	return db('users');
}

function getBy(filter) {
	return db('users').where(filter);
}

async function insert(user) {
	const [ id ] = await db('users').insert(user, 'id');
	return findById(id);
}

function findById(id) {
	return db('users').where({ id }).first();
}
