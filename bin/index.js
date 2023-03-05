#! /usr/bin/env node

const fs = require('fs');
const createFst = require('../index.js').createFst;
const writeFst = require('../index.js').writeFst;

const mode = process.argv[2] || 'create';
const folder = process.argv[3] || './';

async function createTree() {
    await createFst(folder);
}

async function writeTree() {
	fs.readFile('./files.js', 'utf8', (e,  data) => {
		writeFst(eval(data), folder);
	});
}

if(mode === 'create'){	
	createTree();
} else {
	writeTree();
}
