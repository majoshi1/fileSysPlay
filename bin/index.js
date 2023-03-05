#! /usr/bin/env node

const fs = require('fs');
const createFst = require('../index.js').createFst;
const writeFst = require('../index.js').writeFst;

const mode = process.argv[2] || 'create';
const folder = process.argv[3] || './';

async function createTree() {
    await createFst(folder);
}

function getIgnoreArr() {
	let data = '';
	try{
		data = fs.readFileSync('.gitignore');
		data = data.toString().split("\n");
	}catch(e){}
	const array = data;
	const ignoreArr = [];
	for(i in array) {
		if(!array[i].startsWith("#")){
			ignoreArr.push(array[i]);
		}
	}
	return data;	
}

async function writeTree() {
	const ignoreArr = getIgnoreArr();
	fs.readFile('./files.js', 'utf8', (e,  data) => {
		const str = data.replace(/[^\x00-\x7F]/g, "");
		writeFst(eval(str), folder, ignoreArr);
	});
}

if(mode === 'create'){	
	createTree();
} else {
	writeTree();
}
