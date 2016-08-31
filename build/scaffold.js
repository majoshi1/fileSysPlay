var fs = require('fs');

function check(p) {
  return new Promise((resolve, reject) => {
    fs.exists(p, function(exists) {
      return exists ? resolve() : reject();
    });
  });
}

function writePath(p) {
  return new Promise((resolve, reject) => {
    if (p.lastIndexOf('.') > 0) {
      fs.writeFile(p, '', function(e) {
        if (e) reject('failed to make ' + p);
        resolve();
      });
    } else {
      fs.mkdir(p, function(e) {
        if (e) reject('failed to make ' + p + ' directory');
        resolve();
      });
    }
  })
}

function build(fileStructure) {
  if (!fileStructure.length) return;
  const path = fileStructure.shift();
  check(path)
  .then(build.bind(this,fileStructure))
  .catch(writePath.bind(this, path))
  .then(build.bind(this, fileStructure))
}

function makePaths(structure, root = '.', store = []) {
  if (root.indexOf('.') !== 0) {
    throw new Error('Supplied root must begin with ./');
  }
  if (root.lastIndexOf('/') === root.length -1) {
    root = root.slice(0, root.length-1);
  }
  return store.concat(structure.map(path => {
    if ( typeof path === 'string') {
      return root + '/' + path;
    }
    return Object.keys(path).map(key => {
      store.push(root + '/' + key);
      return makePaths(path[key], root + '/' + key)
    })
  }).reduce((a,b)=>{return a.concat(b)},[]))
  .reduce((a,b)=>{return a.concat(b)},[]);
}

module.exports = {makePaths, build};
