### Scaffold Any App
Create new applications from a scaffold file.

### Why?
An application can have large number of smaller-files and folders. With `scaffold-any-app`, all of these can be converted into a structure inside single file. The same file can then be used to scaffold new application.

This can also be useful for enhancing files generated by framework-provided application generators
- CRA - Create-React-App
- Spring Initializr - start.spring.io

This applies to any kind of micro-architectures. This utility can be useful to maintain boiler-plate project in single file. So even after scaffold, changes can be made to scaffold file and can be used to scaffold future similar projects.

#### Installation
- `npm install --save-dev scaffold-any-app`

#### Usage
`scaffold-any-app <mode> <folder> [foler]`
##### Create Mode
- Create scaffold application folder.
- Run `scaffold-any-app create ./app`
- This will output the structure.
##### Write Mode
- Create a `files.js` file in the root of your project
- Run `scaffold-any-app write ./app2`
- This will create the file and folder as per input file.
##### Create & Write Mode
- Create scaffold application folder.
- Run `scaffold-any-app create-write ./app ./app3`
- This will create the new app3 folder from app folder.

#### Example file structure
```js
[{
    // This is a directory - provide its name as a key
    src: {
      // Because it's a directory, add the "directory" key
      directory: {
        // This is a file - provide its path as a key:
        'main.js': {
          // Because it's a file, add the "file" key
          file: {
            contents: `
console.log('Hello from WebContainers!')
            `,
          },
        },
        // This is another file inside the same folder
        'main.css': {
          // Because it's a file, add the "file" key
          file: {
            contents: `
body {
    margin: 0;
}
            `,
          },
        },
      },
    },
    'package.json': {
      file: {
        contents: `
          {
            "name": "vite-starter",
            "private": true,
            "version": "0.0.0",
            "type": "module",
            "scripts": {
              "dev": "vite",
              "build": "vite build",
              "preview": "vite preview"
            },
            "devDependencies": {
              "vite": "^4.0.4"
            }
          }`,
      },
    },
    'index.html': {
      file: {
        contents: `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <link rel="icon" type="image/svg+xml" href="/vite.svg" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Vite App</title>
            </head>
            <body>
              <div id="app"></div>
              <script type="module" src="/src/main.js"></script>
            </body>
          </html>`,
      },
    },
  }]
```