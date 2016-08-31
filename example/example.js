const scaffold = require('../build/scaffold.js')

const fileStructure = [{
  "app": [
    "index.html",
    "404.html", {
    "styles": [
      "main.scss"
    ],
    "scripts": [
      "entry.js"
    ],
    "assets": [{
      "fonts": [],
      "images": []
    }]
  }]
}]

const paths = scaffold.makePaths(fileStructure);
scaffold.build(paths);
