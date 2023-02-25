### Scaffold Any App
Creates the application structure from single input file. Input can be application folders, files and their contents in a single file. Will not overwrite files if they already exist, but will write new files/folders, if they are absent. 

### Why?
An application can have large number of smaller-files and folders.

e.g. Framework-provided generators like:
- CRA - Create-React-App
- Spring Initializr - start.spring.io

This applies to any kind of micro-architectures. This utility can be useful to maintain boiler-plate project in single file. So even after scaffold, changes can be made to scaffold file and can be used for future similar projects.

#### Installation
- `npm install --save-dev scaffold-any-app`

#### Use
- Create a `files.js` file in the root of your project
- Populate it with your desired file structure
- Run `scaffold-any-app optional/output/path`
- Path to desired file structure will default to `.` (the current working directory)

#### How to write your file sturcture
- Directories are denoted with objects. The object's key is the name of the directory. An object's values MUST be arrays.
- Directory contents are denoted with an array. The root of your object must be an array.
- Files can be denoted with strings. Include the file name and its extension. Blank files will be created in this case.
- Files can also be denoted with arrays. The array must have single object with file name as key and contents in the value. Include the file name and its extension. Contents can be multi-line.

#### Example file structure
```js
[{
  "app": [
    [{"index.html": `
First line
Second line`}],
    "404.html", {
	    "styles": [
	      [{"main.scss": `
First line
Second line
Third line`}]
	    ],
	    "scripts": [
	      "entry.js"
	    ],
	    "assets": [{
	      "fonts": [],
	      "images": []
	    }]
		}
	]
}]
```
Creates the following files/directories, with contents:
- `./app/`
- `./app/styles/`
- `./app/scripts/`
- `./app/assets/`
- `./app/index.html`
- `./app/404.html`
- `./app/styles/main.scss`
- `./app/scripts/entry.js`
- `./app/assets/fonts/`
- `./app/assets/images/`
