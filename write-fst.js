var fs = require('fs/promises');

async function writeFst(tree, folder, ignoreArr = [ '.git', 'target', 'node_modules', 'classes', 'build' ]) {
  const newTree = await buildTree(tree[0]);
  let appName = '';
  if(folder) {
      await fs.mkdir(folder);
      appName = folder + '/';
  }
  writeFiles(appName, newTree, ignoreArr);    
}

async function writeFiles(folder, o, ignoreArr) {
  for (var key in o) {
      if ( typeof o[key] === 'object' && o[key] !== null) {
          if ( ignoreArr.indexOf( key ) < 0 ) {
            if(key !== 'd' && key !== 'f' && !o[key].hasOwnProperty('f')){
                // console.log('folder created : ' + (folder + key))
                await fs.mkdir(folder + key);
            }
            if (Object.keys(o[key]).length) {
                const name = key === 'd' || key === 'f' ? '' : key + '/';
                writeFiles(folder + name, o[key], ignoreArr);
            }
          }
      } else if(key !== 'f' && ignoreArr.indexOf( key ) < 0) {
          //console.log('file created : ' + (folder + '.' + typeof o[key]))
          //console.log({folder: folder, o: o});
          if(typeof o[key] === 'boolean'){
            // Skip
          } else if(!o.b){
            await fs.writeFile(folder, o[key]);
          } else {
            await fs.writeFile(folder, o[key], "binary");
          }
      }
  }
}

async function buildTree(tree) {
  const newTree = { d: {} };
  for (const name of Object.keys(tree)) {
    const entry = tree[name];
    if ("file" in entry) {
      const contents = entry.file.contents;
      const stringContents = typeof contents === "string" ? contents : binaryString(atob(contents.base64));
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

function binaryString(contents) {
  const bytes = [];
  contents = eval("("+contents+")");
  for (let key in contents) {
    bytes.push(contents[key]);
  }
  let result = "";
  for (const byte of bytes) {
    result += String.fromCharCode(byte);
  }
  return result;
}
  
module.exports = {writeFst};