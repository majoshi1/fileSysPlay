#! /usr/bin/env node

const fs = require('fs');
const createFst = require('../index.js').createFst;
const writeFst = require('../index.js').writeFst;

const mode = process.argv[2] || 'create';
const folder = process.argv[3] || './';

async function createTree() {
	const ignoreArr = getIgnoreArr();
    await createFst(folder, true, ignoreArr);
}

async function writeTree() {
	const ignoreArr = getIgnoreArr();
	fs.readFile('./files.js', 'utf8', (e,  data) => {
		const str = data.replace(/[^\x00-\x7F]/g, "");
		writeFst(eval(str), folder, ignoreArr);
	});
}

function getIgnoreArr() {
	let data = '';
	try{
		data = fs.readFileSync('.gitignore');
		data = data.toString();
		data = data.replace(/\r\n/g, '\n');
		data = data.split("\n");
	}catch(e){}
	const array = data;
	const ignoreArr = [];
	for(i in array) {
		let text = array[i].trim();
		if(!text.startsWith("#")){		
			ignoreArr.push(text);
		}
	}
	return data;	
}

if(mode === 'create'){	
	createTree();
} else {
	writeTree();
}
