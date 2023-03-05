#! /usr/bin/env node

const fs = require('fs');
const createFst = require('../index.js').createFst;
const writeFst = require('../index.js').writeFst;

const mode = process.argv[2] || 'create';
const inFolder = process.argv[3] || './';
const outFolder = process.argv[4] || './';

async function createTree(folder) {
    const fst = await createFst(folder);
    console.log('['+JSON.stringify(fst, null, 2)+']');
}

async function writeTree(folder) {
	fs.readFile('./files.js', 'utf8', (e,  data) => {
		writeFst(eval(data), folder);
	});
}

async function createAndWriteTree() {
	const fst = await createFst(inFolder);
	await writeFst(fst, outFolder);
}

if(mode === 'create-write'){
	createAndWriteTree();
} else if(mode === 'create'){	
	createTree(inFolder);
} else {
	writeTree(inFolder);
}
