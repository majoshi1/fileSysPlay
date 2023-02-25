var fs = require('fs');
const contents = {};

function check(p) {
  return new Promise((resolve, reject) => {
    fs.exists(p, function(exists) {
      return exists ? resolve() : reject();
    });
  });
}

function writePath(p) {
  return new Promise((resolve, reject) => {
    const lastSlashIndex = p.lastIndexOf('/');
    if (p.substr(lastSlashIndex).lastIndexOf('.') > 0) {
      const content = contents[p];
      // console.log(content);
      // console.log('Creating file: '+p);
      fs.writeFile(p, content, function(e) {
        if (e) reject('failed to make ' + p + ', ' + e);
        resolve();
      });
    } else {
      // console.log('Creating dir: '+p);
      fs.mkdir(p, function(e) {
        if (e) reject('failed to make ' + p + ' directory');
        resolve();
      });
    }
  })
}

function build(fileStructure) {
  // console.log(fileStructure);
  if (!fileStructure.length) return;
  const path = fileStructure.shift();
  check(path)
  .then(build.bind(this,fileStructure))
  .catch(writePath.bind(this, path))
  .then(build.bind(this, fileStructure))
}

function makePaths(structure, root, store) {
	if (! root) {root = '.';}
	if (!Array.isArray(store)) {store = [];}
	if (!Array.isArray(structure)) {
		throw new Error('The contents of your directories must be described as an array. See the contents of your `files.js` file');
	}
	while (root.lastIndexOf('/') === root.length -1) {
    root = root.slice(0, root.length-1);
  }
  if (root.indexOf('.') !== 0) {
		root = './' + root;
  }
  return store.concat(structure.map(path => {
		if (path === null || (typeof path !== 'string' && typeof path !== 'object')) {
			throw new Error('your directories must contain either strings (for files) or objects (for sub-directories). See the contents of your `files.js` file');
		}
    if ( typeof path === 'string') {
      const filePath = root + '/' + path;
      contents[filePath] = '';
      return filePath;
    } else if ( Array.isArray(path)) {
      const object = path[0];
      let key = '';
      let content = '';
      for (const property in object) {
        content = object[property];
        key = property;
      }
      const filePath = root + '/' + key;
      contents[filePath] = content.trim();
      return filePath;
    }
    return Object.keys(path).map(key => {
      store.push(root + '/' + key);
      return makePaths(path[key], root + '/' + key)
    })
  }).reduce((a,b)=>{return a.concat(b)},[]))
  .reduce((a,b)=>{return a.concat(b)},[]);
}

module.exports = {makePaths, build};