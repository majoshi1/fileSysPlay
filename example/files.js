[{
  "package.json": {
    "file": {
      "contents": `{
    "name": "example-app",
    "type": "module",
    "dependencies": {
      "express": "latest",
      "nodemon": "latest"
    },
    "scripts": {
      "start": "nodemon src/index.js"
    }
  }
  `
    }
  },
  "src": {
    "directory": {
      "assets": {
        "directory": {
          "style.css": {
            "file": {
              "contents": `/* Some Styles */`
            }
          }
        }
      },
      "index.js": {
        "file": {
          "contents": `import express from 'express';
const app = express();
const port = 3111;

app.get('/', (req, res) => {
  res.send('Welcome to a Example app! 🥳');
});

app.listen(port, () => {
  console.log(\`App is live at http://localhost:$\{port}\`);
});
`
        }
      }
    }
  }
}]
