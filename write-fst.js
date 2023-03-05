var fs = require('fs/promises');

async function writeFst(tree, folder) {
    const newTree = await buildTree(tree[0]);
    let appName = '';
    if(folder) {
        await fs.mkdir(folder);
        appName = folder + '/';
    }
    writeFiles(appName, newTree);    
}

async function writeFiles(folder, o) {
    for (var key in o) {
        if ( typeof o[key] === 'object' && o[key] !== null) {
            if(key !== 'd' && key !== 'f' && key.indexOf('.') < 0){
                // console.log('folder created : ' + (folder + key))
                await fs.mkdir(folder + key);
            }
            if (Object.keys(o[key]).length) {
                const name = key === 'd' || key === 'f' ? '' : key + '/';
                writeFiles(folder + name, o[key]);
            }
        } else if(key !== 'f') {
            //console.log('file created : ' + (folder + '.' + typeof o[key]))
            await fs.writeFile(folder, o[key]);
        }
    }
}

async function buildTree(tree) {
    const newTree = { d: {} };
    for (const name of Object.keys(tree)) {
      const entry = tree[name];
      if ("file" in entry) {
        const contents = entry.file.contents;
        const stringContents = typeof contents === "string" ? contents : binaryString(contents);
        const binary = typeof contents === "string" ? {} : { b: true };
        //console.log({name: name, entry: entry});
        newTree.d[name] = { f: { c: stringContents, ...binary } };
        continue;
      }
      //console.log({name: name, entry: entry});
      const newEntry = await buildTree(entry.directory);
      newTree.d[name] = newEntry;
    }
    return newTree;
  }
  

  function binaryString(bytes) {
    let result = "";
    for (const byte of bytes) {
      result += String.fromCharCode(byte);
    }
    return result;
  }
  
  module.exports = {writeFst};