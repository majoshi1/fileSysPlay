#! /usr/bin/env node

const fs = require('fs');
const build = require('../index.js').build;
const makePaths = require('../index.js').makePaths;
const root = process.argv[2] || '.';

fs.readFile('./files.js', 'utf8', (e,  data) => {
	var paths = makePaths(eval(data), root);
	build(paths);
});
