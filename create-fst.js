var fs = require('fs/promises');
var _path = require('path');
var typeUtils = require('util/types');
var isText = require('istextorbinary').isText;

async function createFst(path, childrenOnly = true) {
    const fst = await createFstRec(path, childrenOnly);
    let output = JSON.stringify(fst, null, 2);
    output = output.replace(/\"`/g, '`');
    output = output.replace(/`\"/g, '`');    
    output = output.replaceAll("\\\\", "\\");
    output = output.replaceAll("\\n", "\n");
    output = output.replaceAll("\\\"", "\"");
    output = '['+output+']';
    console.log(output);
}
async function createFstRec(path, childrenOnly = true) {
  const name = _path.basename(path)

  let stats
  try {
    stats = await fs.stat(path)
  } catch (e) {
    console.log('Failed to stat', e);
    return {}
  }

  if (stats.isFile()) {
    let contents = await readFile(path)
    contents = '`'+`${contents}`+'`' 
    return {
      [name]: {
        file: {
          contents
        }      
    }
    }
  } else if (stats.isDirectory()) {
    const dirContents = await readDir(path)
    const children = await dirContents.reduce(
      async (acc, child) => ({
        ...(await acc),
        ...(await createFstRec(_path.join(path, child), false))
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
    return text    
  } else {
    return new Uint8Array(fileData)
  }
}

module.exports = {createFst};