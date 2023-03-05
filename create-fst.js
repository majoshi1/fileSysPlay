var fs = require('fs/promises');
var _path = require('path');
var typeUtils = require('util/types');
var isText = require('istextorbinary').isText;

async function createFst(path, childrenOnly = true) {
  const name = _path.basename(path)

  let stats
  try {
    stats = await fs.stat(path)
  } catch (e) {
    console.log('Failed to stat', e);
    return {}
  }

  if (stats.isFile()) {
    const contents = await readFile(path)
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
        ...(await createFst(_path.join(path, child), false))
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
    return fileData.toString("utf-8")    
  } else {
    return new Uint8Array(fileData)
  }
}

module.exports = {createFst};