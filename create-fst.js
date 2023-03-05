var fs = require('fs/promises');
var _path = require('path');
var typeUtils = require('util/types');
var isText = require('istextorbinary').isText;

async function createFst(path, childrenOnly = true, ignoreArr = [ 'target', 'node_modules', 'classes', 'build' ]) {
    const fst = await createFstRec(path, childrenOnly, ignoreArr);
    let output = JSON.stringify(fst, null, 2);
    output = output.replace(/\"`/g, '`');
    output = output.replace(/`\"/g, '`');    
    output = output.replaceAll("\\\\", "\\");
    output = output.replaceAll("\\n", "\n");
    output = output.replaceAll("\\\"", "\"");
    output = '['+output+']';
    console.log(output);
}
async function createFstRec(path, childrenOnly, ignoreArr) {
  const name = _path.basename(path)

  let stats
  try {
    stats = await fs.stat(path)
  } catch (e) {
    console.log('Failed to stat', e);
    return {}
  }
  const isNix = path.indexOf("/") > 0;
  const lastIndex = isNix ? path.lastIndexOf("/") : path.lastIndexOf("\\");
  const key = path.substr(lastIndex+1, path.length);
  const ignoreItem = ignoreArr.indexOf(key) >= 0;
  if (stats.isFile() && !ignoreItem) {
    const contents = await readFile(path)
    return {
      [name]: {
        file: {
          contents
        }      
    }
    }
  } else if (stats.isDirectory() && !ignoreItem) {
    const dirContents = await readDir(path)
    const children = await dirContents.reduce(
      async (acc, child) => ({
        ...(await acc),
        ...(await createFstRec(_path.join(path, child), false, ignoreArr))
      }),
      Promise.resolve({})
    )
    return childrenOnly
      ? children
      : {
          [name]: {
            directory: children
          }
        }
  } else {
    // TODO: Handle symlinks
    return {}
  }
}

function isNodeError(error) {
  return typeUtils.isNativeError(error)
}

async function readDir(path) {
  try {
    return await fs.readdir(path)
  } catch (err) {
    if (isNodeError(err) && (err.code == "EACCES" || err.code == "EPERM")) {
      return []
    } else {
      throw err
    }
  }
}

async function readFile(path) {
  const fileData = await fs.readFile(path)
  if (isText(path, fileData)) {
    let text = fileData.toString("utf-8")
    text = text.replace(/\r\n/g, '\n');
    text = text.replace(/\r/g, '\n');
    text = text.replace(/`/g, '\\`');
    text = text.replace(/\$/g, '\\\$');    
    text = '`'+`${text}`+'`' 
    return text;
  } else {
    const binary = new Uint8Array(fileData);
    // console.log({type:typeof binary, binary: binary});
    const b64 = btoa(JSON.stringify(binary));
    return {base64: b64};
  }
}

module.exports = {createFst};