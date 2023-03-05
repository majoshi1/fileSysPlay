const createFst = require('../index.js').createFst;

async function createFiles() {
    const fst = await createFst('./app');
    console.log(JSON.stringify(fst, null, 2));
}

createFiles();