const Test = require('../models/test');
const debug = require('debug')('app:');

let insert = new Test({
	test: 'this is test',
	int: 123,
	isTrue: false
});

let promise = insert.save();

promise
	.then((data) => debug.extend('data')(data))
	.catch((err) => debug.extend('error')(err));