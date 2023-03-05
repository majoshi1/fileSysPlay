const createFst = require('../index.js').createFst;
const writeFst = require('../index.js').writeFst;

async function createFiles() {
    const fst = await createFst('./app');
    return fst;
}

async function writeFiles() {
    const tree = await createFiles();
    writeFst(tree, './app2');
}

writeFiles();
