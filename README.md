## Scaffold Any App
Create new applications from a single scaffold file and vice versa.

## Why?
### Scenario 1

An application can have large number of smaller-files and folders. This is especially applicable in the case of frameworks and micro-architectures, as they contain a large number of boiler-plate files. Even with modern editors like VS Code, it can be tedious to open each file to view or modify. 

On the other hand, with powerful source control systems, like Git, it is easier to track changes in large files. Additionally, searching for a specific text within a larger file is easily done using editors. Thus, it makes more sense to store such applications in a single large file.

### Scenario 2
There are framework-provided application generators e.g.
- CRA - Create-React-App
- Spring Initializr - start.spring.io
- etc.

Each generator creates a bare-minimum application, e.g. V1 of app1. But, it is not directly usable, without making additional changes, kind V2 of the app1. These same changes may have to be done again and again for every new future applications e.g. app2, app3 etc. Enhancing generators to create the version V2 _directly_, is either not possible or not very easy. This results in repeated work of applying boiler-plate changes, for every new application. Also, by that time, app1 may already have non-reusable, business-specific changes as part of say version V3. So, copying the app1 folder as app2 is also not feasible. 

### Solution
The `scaffold-any-app` utility tries to fill-in this gap, by storing entire application in a tree-like structure inside a single file. This utility can be used to bootstrap new applications easily in the future. Moreover, a single file can be more easily kept up-to-date, as needed.

This is achieved by using the following approach:
- Create tree-like structure (in a single-file) from the application folder. 
- Scaffold (write) new application folder using the same single file.

## Installation
- `npm install --save-dev scaffold-any-app`

## Usage
`scaffold-any-app <mode> <folder>`

## Create Mode
Creates single file from application folder.
### Steps:
- Create a new application folder, say app, with all the files and sub-folders.
- Run `scaffold-any-app create ./app > files.js`.
- This will create the trre-like structure in a single file `files.js`.

## Write Mode
Creates application folder from single scaffold file.
### Steps:
- Create a `files.js` file to represent file-structure of an application. Alternately, use the file created in Create Mode above.
- Run `scaffold-any-app write ./app2`.
- This will make a new app2 folder from the tree-like structure in the input file.

The utility will look for `.gitignore` file for ignoring any files/folders. If not available, it will ignore `.git, target, node_modules, classes, build`, by default.

## Example scripts section of package.json
```json
"scripts": {
  "create": "scaffold-any-app create ./app > files.js",
  "write": "scaffold-any-app write ./app2"
}
```
Full example is [here](https://github.com/majoshi1/fileSysPlay/tree/master/example).

## Typical Workflow
- Create an application folder manually or using any framework-provided generators e.g. `npx create-react-app app`
- Convert the application folder into a single file e.g. `scaffold-any-app create ./app > files.js`
- Store the single file in your source control system.
- Modify the file as needed OR
- Modify folders / files, inside the original application folder, as needed, and then either
	- Create scaffold file again e.g. `scaffold-any-app create ./app > files.js` OR
	- Manually change the scaffold file for changes in the original application folder.
- Finally, use the scaffold file to generate new applications e.g. `scaffold-any-app write ./app2`

## Scaffold file guidelines
Escape special characters e.g. newlines, string literals, variables etc.

### Newlines
Escape newlines. So, use `\\n`, instead of \n
### String literals \ Backticks
Escape these as well. So use 
```
\`
``` 
instead of 
```
`
```
### Variables
Escape variables e.g. Use `$\{port}` instead of `${port}`

### Application files / folders
#### Generic names
Try to keep file and folder names and content generic, so that they can be re-used. 
#### Ignore names
Add any non-generica / non-reusable names in .gitignore file, so that they are skipped in both Create and Write modes.

### Heap Memory
For a large file, allocate more heap space, as needed.

`export NODE_OPTIONS=--max_old_space_size=4096`

### Binary files
In Create mode, the binary files base64-encoded and then stored in single file.

## Example file structure
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
console.log('Hello from Scaffold-Any-App!')
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
        // This is a binary file
        "twitter.2.ico": {
          file: {
            contents: {
              base64: "eyIwIjoxMzcsIjEiOjgwLCIyIjo3OCwiMyI6NzEsIjQiOjEzLCI1IjoxMCwiNiI6MjYsIjciOjEwLCI4IjowLCI5IjowLCIxMCI6MCwiMTEiOjEzLCIxMiI6NzMsIjEzIjo3MiwiMTQiOjY4LCIxNSI6ODIsIjE2IjowLCIxNyI6MCwiMTgiOjAsIjE5IjozMiwiMjAiOjAsIjIxIjowLCIyMiI6MCwiMjMiOjMyLCIyNCI6OCwiMjUiOjYsIjI2IjowLCIyNyI6MCwiMjgiOjAsIjI5IjoxMTUsIjMwIjoxMjIsIjMxIjoxMjIsIjMyIjoyNDQsIjMzIjowLCIzNCI6MCwiMzUiOjAsIjM2Ijo5LCIzNyI6MTEyLCIzOCI6NzIsIjM5Ijo4OSwiNDAiOjExNSwiNDEiOjAsIjQyIjowLCI0MyI6MTEsIjQ0IjoxOSwiNDUiOjAsIjQ2IjowLCI0NyI6MTEsIjQ4IjoxOSwiNDkiOjEsIjUwIjowLCI1MSI6MTU0LCI1MiI6MTU2LCI1MyI6MjQsIjU0IjowLCI1NSI6MCwiNTYiOjAsIjU3IjoxLCI1OCI6MTE1LCI1OSI6ODIsIjYwIjo3MSwiNjEiOjY2LCI2MiI6MCwiNjMiOjE3NCwiNjQiOjIwNiwiNjUiOjI4LCI2NiI6MjMzLCI2NyI6MCwiNjgiOjAsIjY5IjowLCI3MCI6NCwiNzEiOjEwMywiNzIiOjY1LCI3MyI6NzcsIjc0Ijo2NSwiNzUiOjAsIjc2IjowLCI3NyI6MTc3LCI3OCI6MTQzLCI3OSI6MTEsIjgwIjoyNTIsIjgxIjo5NywiODIiOjUsIjgzIjowLCI4NCI6MCwiODUiOjIsIjg2IjoxMDAsIjg3Ijo3MywiODgiOjY4LCI4OSI6NjUsIjkwIjo4NCwiOTEiOjEyMCwiOTIiOjEsIjkzIjoyMzcsIjk0Ijo4NiwiOTUiOjY1LCI5NiI6MTEwLCI5NyI6MjE4LCI5OCI6ODAsIjk5IjoxNiwiMTAwIjoxMjUsIjEwMSI6MjQzLCIxMDIiOjMzLCIxMDMiOjEwOSwiMTA0IjoyMiwiMTA1Ijo4NSwiMTA2IjoxMzksIjEwNyI6MTUxLCIxMDgiOjg1LCIxMDkiOjE2MSwiMTEwIjoyNDgsIjExMSI6NiwiMTEyIjoyMDUsIjExMyI6MTMsIjExNCI6NzQsIjExNSI6NzgsIjExNiI6MCwiMTE3Ijo1NywiMTE4Ijo2NSwiMTE5Ijo5NywiMTIwIjoxNywiMTIxIjoxNzAsIjEyMiI6MjM2LCIxMjMiOjE0NiwiMTI0IjoxOSwiMTI1IjozNiwiMTI2IjoxNTYsIjEyNyI6MTI4LCIxMjgiOjIzNiwiMTI5IjoxNzAsIjEzMCI6NjYsIjEzMSI6MTY1LCIxMzIiOjExMiwiMTMzIjoxMzIsIjEzNCI6MjQ0LCIxMzUiOjQsIjEzNiI6MjA4LCIxMzciOjE5LCIxMzgiOjIxMiwiMTM5Ijo2MSwiMTQwIjo2NSwiMTQxIjoyMjEsIjE0MiI6MTQ2LCIxNDMiOjc0LCIxNDQiOjIyMSwiMTQ1IjoyMTcsIjE0NiI6MTQ5LCIxNDciOjE4NiwiMTQ4Ijo0MiwiMTQ5IjoyNDAsIjE1MCI6MTY3LCIxNTEiOjI0MywiMTUyIjozMywiMTUzIjo4NiwiMTU0IjoxMDgsIjE1NSI6MTkyLCIxNTYiOjE5OCwiMTU3IjozOCwiMTU4IjoxNjAsIjE1OSI6NDAsIjE2MCI6MTgsIjE2MSI6MTExLCIxNjIiOjI0NywiMTYzIjoyMzEsIjE2NCI6MTQzLCIxNjUiOjEwMywiMTY2IjoyMjIsIjE2NyI6MjA0LCIxNjgiOjI1MiwiMTY5IjoxNTMsIjE3MCI6NDksIjE3MSI6MTc2LCIxNzIiOjE5NSwiMTczIjoxNCwiMTc0IjoxNSwiMTc1IjoxMiwiMTc2IjoxOTQsIjE3NyI6MTM0LCIxNzgiOjgwLCIxNzkiOjI1MiwiMTgwIjoyMjQsIjE4MSI6ODUsIjE4MiI6MTQ0LCIxODMiOjE2NywiMTg0IjoxMTUsIjE4NSI6NDksIjE4NiI6MTIwLCIxODciOjMyLCIxODgiOjE5OSwiMTg5IjoyLCIxOTAiOjI0LCIxOTEiOjE3NCwiMTkyIjoxNTIsIjE5MyI6MzEsIjE5NCI6MTQwLCIxOTUiOjM4LCIxOTYiOjE4NiwiMTk3IjoyNDUsIjE5OCI6MjUxLCIxOTkiOjE5NiwiMjAwIjoxMTQsIjIwMSI6MTk1LCIyMDIiOjEyMiwiMjAzIjoxMjcsIjIwNCI6MjQ3LCIyMDUiOjIyNSwiMjA2IjoyNDgsIjIwNyI6MTMsIjIwOCI6MjAzLCIyMDkiOjk1LCIyMTAiOjMyLCIyMTEiOjI0MCwiMjEyIjoxNzAsIjIxMyI6MjI3LCIyMTQiOjIxMywiMjE1IjoyMjksIjIxNiI6MTk1LCIyMTciOjE5NCwiMjE4IjoxNzUsIjIxOSI6MjQ3LCIyMjAiOjIxNCwiMjIxIjozNywiMjIyIjo1MCwiMjIzIjoyMjQsIjIyNCI6MTE3LCIyMjUiOjI0NywiMjI2IjoyMDcsIjIyNyI6NTcsIjIyOCI6MTMxLCIyMjkiOjQ3LCIyMzAiOjIyNiwiMjMxIjoyMzgsIjIzMiI6ODksIjIzMyI6MTE1LCIyMzQiOjEzOSwiMjM1IjoxLCIyMzYiOjE1OSwiMjM3IjoyMCwiMjM4Ijo4NSwiMjM5IjoxMzcsIjI0MCI6MjAxLCIyNDEiOjI5LCIyNDIiOjU0LCIyNDMiOjk1LCIyNDQiOjUyLCIyNDUiOjEzMCwiMjQ2IjoxODcsIjI0NyI6OCwiMjQ4IjoxMjksIjI0OSI6ODIsIjI1MCI6MTk5LCIyNTEiOjE4NywiMjUyIjo2LCIyNTMiOjgxLCIyNTQiOjg1LCIyNTUiOjEwNywiMjU2Ijo2MiwiMjU3Ijo3NSwiMjU4Ijo3NSwiMjU5IjoxOTQsIjI2MCI6MTQ0LCIyNjEiOjg2LCIyNjIiOjY4LCIyNjMiOjg3LCIyNjQiOjEwNSwiMjY1IjoxMTYsIjI2NiI6NzMsIjI2NyI6MTc4LCIyNjgiOjE2MiwiMjY5IjozOCwiMjcwIjoxMjQsIjI3MSI6NTYsIjI3MiI6MjAyLCIyNzMiOjczLCIyNzQiOjE0NCwiMjc1Ijo3NywiMjc2IjoyMDMsIjI3NyI6NDksIjI3OCI6NTAsIjI3OSI6MjEsIjI4MCI6OTcsIjI4MSI6NzQsIjI4MiI6ODQsIjI4MyI6MTU4LCIyODQiOjEwLCIyODUiOjIxLCIyODYiOjE4MSwiMjg3IjoxMzksIjI4OCI6MTgsIjI4OSI6ODUsIjI5MCI6MjYsIjI5MSI6MTYzLCIyOTIiOjE2MiwiMjkzIjoxNTUsIjI5NCI6NzQsIjI5NSI6NzksIjI5NiI6MzQsIjI5NyI6MjQ1LCIyOTgiOjUzLCIyOTkiOjIyNCwiMzAwIjo3NiwiMzAxIjoyNDYsIjMwMiI6MTY4LCIzMDMiOjE3NSwiMzA0IjoyMCwiMzA1IjoyMzYsIjMwNiI6MTQ0LCIzMDciOjI1MiwiMzA4IjoxNCwiMzA5IjoxOTcsIjMxMCI6MTc0LCIzMTEiOjI1NSwiMzEyIjoyNDUsIjMxMyI6MTgyLCIzMTQiOjEzNCwiMzE1IjoxODMsIjMxNiI6MTQwLCIzMTciOjIyNCwiMzE4IjoyNDIsIjMxOSI6MTMyLCIzMjAiOjI3LCIzMjEiOjU1LCIzMjIiOjM5LCIzMjMiOjIxNCwiMzI0Ijo5NiwiMzI1IjoxNTMsIjMyNiI6ODEsIjMyNyI6ODMsIjMyOCI6NzksIjMyOSI6MjAyLCIzMzAiOjgzLCIzMzEiOjMxLCIzMzIiOjg5LCIzMzMiOjE5MiwiMzM0IjoyMjAsIjMzNSI6MjQsIjMzNiI6NTQsIjMzNyI6MTczLCIzMzgiOjk0LCIzMzkiOjExMiwiMzQwIjo4NCwiMzQxIjoxMTUsIjM0MiI6MTUxLCIzNDMiOjk1LCIzNDQiOjE2LCIzNDUiOjE2NSwiMzQ2IjoxMDksIjM0NyI6MjcsIjM0OCI6NywiMzQ5Ijo2NiwiMzUwIjoxNzIsIjM1MSI6MjU1LCIzNTIiOjI0MiwiMzUzIjoxNjMsIjM1NCI6ODcsIjM1NSI6OTEsIjM1NiI6MTc2LCIzNTciOjE0OSwiMzU4IjoxODcsIjM1OSI6MTM5LCIzNjAiOjM2LCIzNjEiOjEzLCIzNjIiOjE5OCwiMzYzIjoxOTYsIjM2NCI6NzEsIjM2NSI6OTcsIjM2NiI6MjMxLCIzNjciOjYsIjM2OCI6MjQ5LCIzNjkiOjIwMCwiMzcwIjo5NywiMzcxIjoxNSwiMzcyIjoxNTEsIjM3MyI6MTIyLCIzNzQiOjE0MCwiMzc1IjoxMTksIjM3NiI6MTA4LCIzNzciOjk0LCIzNzgiOjExMywiMzc5IjoxMzIsIjM4MCI6NywiMzgxIjo0MiwiMzgyIjoxMjEsIjM4MyI6NjksIjM4NCI6MTQ5LCIzODUiOjgyLCIzODYiOjIxNSwiMzg3IjoyNDcsIjM4OCI6MTUzLCIzODkiOjQ5LCIzOTAiOjk2LCIzOTEiOjMzLCIzOTIiOjc0LCIzOTMiOjI2LCIzOTQiOjE0LCIzOTUiOjcyLCIzOTYiOjE0OSwiMzk3Ijo3NywiMzk4IjoxNTQsIjM5OSI6MjEwLCI0MDAiOjIyNiwiNDAxIjoyMzMsIjQwMiI6OCwiNDAzIjoyMDYsIjQwNCI6MTg4LCI0MDUiOjQ0LCI0MDYiOjY2LCI0MDciOjY0LCI0MDgiOjI1MCwiNDA5IjoxOTQsIjQxMCI6MTI3LCI0MTEiOjE0LCI0MTIiOjExMCwiNDEzIjoxMzcsIjQxNCI6MjAzLCI0MTUiOjExOCwiNDE2IjoxNDAsIjQxNyI6MTQxLCI0MTgiOjIsIjQxOSI6MTcsIjQyMCI6MTA2LCI0MjEiOjY4LCI0MjIiOjg0LCI0MjMiOjE1NSwiNDI0IjoyMjksIjQyNSI6NDYsIjQyNiI6MTg5LCI0MjciOjI0MywiNDI4IjoxNjksIjQyOSI6MjUzLCI0MzAiOjEyNSwiNDMxIjoyNDgsIjQzMiI6MTM3LCI0MzMiOjQsIjQzNCI6MTU4LCI0MzUiOjE0MSwiNDM2IjoyMjUsIjQzNyI6MTA0LCI0MzgiOjIwOCwiNDM5IjoxMTksIjQ0MCI6MTEzLCI0NDEiOjIyNiwiNDQyIjoxMzgsIjQ0MyI6MTA5LCI0NDQiOjI3LCI0NDUiOjE1NSwiNDQ2IjoxMzMsIjQ0NyI6MzEsIjQ0OCI6MjQ0LCI0NDkiOjEyNiwiNDUwIjoyNCwiNDUxIjoxMTUsIjQ1MiI6MTExLCI0NTMiOjAsIjQ1NCI6MjE1LCI0NTUiOjM4LCI0NTYiOjIyMSwiNDU3Ijo5MSwiNDU4IjoxMTIsIjQ1OSI6NDYsIjQ2MCI6MjA3LCI0NjEiOjEzOSwiNDYyIjoxOTEsIjQ2MyI6NDUsIjQ2NCI6MTQ3LCI0NjUiOjcxLCI0NjYiOjgsIjQ2NyI6NzIsIjQ2OCI6NTgsIjQ2OSI6MTIyLCI0NzAiOjIxNiwiNDcxIjozMCwiNDcyIjoyOCwiNDczIjoxNzIsIjQ3NCI6MzQsIjQ3NSI6MjI0LCI0NzYiOjIwMiwiNDc3IjoxMTIsIjQ3OCI6MzIsIjQ3OSI6MjQwLCI0ODAiOjI1LCI0ODEiOjE4MiwiNDgyIjowLCI0ODMiOjE0MiwiNDg0Ijo5LCI0ODUiOjc4LCI0ODYiOjIwNSwiNDg3IjoxMSwiNDg4IjoxMjYsIjQ4OSI6MzAsIjQ5MCI6MjAzLCI0OTEiOjQsIjQ5MiI6MTQ4LCI0OTMiOjk0LCI0OTQiOjE1NywiNDk1IjoxOTAsIjQ5NiI6MTMxLCI0OTciOjc3LCI0OTgiOjU3LCI0OTkiOjE1MSwiNTAwIjoxNzQsIjUwMSI6OSwiNTAyIjozOCwiNTAzIjoyMjMsIjUwNCI6NzQsIjUwNSI6MiwiNTA2Ijo2LCI1MDciOjUwLCI1MDgiOjUwLCI1MDkiOjExLCI1MTAiOjUwLCI1MTEiOjE0MiwiNTEyIjo2MywiNTEzIjoxOSwiNTE0IjoyMiwiNTE1Ijo5NSwiNTE2IjoyMzcsIjUxNyI6NTgsIjUxOCI6MTYwLCI1MTkiOjEzMiwiNTIwIjoyMTAsIjUyMSI6MjMwLCI1MjIiOjE1MSwiNTIzIjo5LCI1MjQiOjE4MSwiNTI1IjoxMzAsIjUyNiI6MTQ4LCI1MjciOjEzMCwiNTI4IjoyMTgsIjUyOSI6MjE3LCI1MzAiOjE1NCwiNTMxIjo0NCwiNTMyIjo2LCI1MzMiOjc2LCI1MzQiOjE4OSwiNTM1Ijo5NywiNTM2IjoxNzksIjUzNyI6MjA4LCI1MzgiOjEzOSwiNTM5IjoxODcsIjU0MCI6OTQsIjU0MSI6MTU0LCI1NDIiOjEyOSwiNTQzIjoxNTUsIjU0NCI6OTksIjU0NSI6MTA3LCI1NDYiOjY0LCI1NDciOjIxMSwiNTQ4IjoxMjEsIjU0OSI6MTEyLCI1NTAiOjYzLCI1NTEiOjE1MiwiNTUyIjoyMjksIjU1MyI6MTQ3LCI1NTQiOjE0NywiNTU1IjoxMTcsIjU1NiI6MTU2LCI1NTciOjE2OCwiNTU4IjoxNDcsIjU1OSI6MTE2LCI1NjAiOjg5LCI1NjEiOjUwLCI1NjIiOjIzNSwiNTYzIjoyNSwiNTY0Ijo1NiwiNTY1IjoxNDksIjU2NiI6MTMsIjU2NyI6MjQ5LCI1NjgiOjYsIjU2OSI6MTA3LCI1NzAiOjY0LCI1NzEiOjg2LCI1NzIiOjI0NCwiNTczIjoxNjEsIjU3NCI6OSwiNTc1Ijo2LCI1NzYiOjIzNSwiNTc3IjoxOCwiNTc4Ijo4LCI1NzkiOjk2LCI1ODAiOjExOSwiNTgxIjoxODgsIjU4MiI6MywiNTgzIjo3NywiNTg0IjoyMTIsIjU4NSI6MTU5LCI1ODYiOjMxLCI1ODciOjIwOSwiNTg4IjoyMDEsIjU4OSI6MjIyLCI1OTAiOjE2MywiNTkxIjo3NSwiNTkyIjoxMDMsIjU5MyI6NDUsIjU5NCI6MiwiNTk1IjoxOTgsIjU5NiI6MjQxLCI1OTciOjE1MiwiNTk4Ijo4NCwiNTk5Ijo4NSwiNjAwIjoyMDIsIjYwMSI6MTEzLCI2MDIiOjEzOCwiNjAzIjoxNDgsIjYwNCI6MjA2LCI2MDUiOjEwMywiNjA2IjoxMDcsIjYwNyI6MTUxLCI2MDgiOjE0MywiNjA5Ijo4NiwiNjEwIjo2OSwiNjExIjozMCwiNjEyIjoyMTAsIjYxMyI6MTU5LCI2MTQiOjE2MSwiNjE1IjoyNDQsIjYxNiI6MjAxLCI2MTciOjE3MSwiNjE4IjoxMDUsIjYxOSI6NDUsIjYyMCI6MTc5LCI2MjEiOjk0LCI2MjIiOjE2NiwiNjIzIjozMiwiNjI0IjoxNTMsIjYyNSI6MzcsIjYyNiI6MTYzLCI2MjciOjU2LCI2MjgiOjI1MSwiNjI5Ijo2OCwiNjMwIjoxNDgsIjYzMSI6MTE4LCI2MzIiOjIwMywiNjMzIjo3NywiNjM0Ijo4MCwiNjM1IjoxMTksIjYzNiI6NjcsIjYzNyI6MTkxLCI2MzgiOjk2LCI2MzkiOjE2OSwiNjQwIjo5LCI2NDEiOjc2LCI2NDIiOjczLCI2NDMiOjIwNCwiNjQ0IjoxMDYsIjY0NSI6OTQsIjY0NiI6MTUxLCI2NDciOjE1NCwiNjQ4IjoxOTEsIjY0OSI6NjksIjY1MCI6MjIsIjY1MSI6MTM2LCI2NTIiOjk5LCI2NTMiOjM4LCI2NTQiOjkyLCI2NTUiOjE2NCwiNjU2IjoxNDEsIjY1NyI6NTgsIjY1OCI6MTUwLCI2NTkiOjY0LCI2NjAiOjAsIjY2MSI6MjUxLCI2NjIiOjIwMiwiNjYzIjoxNzksIjY2NCI6MjQ1LCI2NjUiOjYzLCI2NjYiOjIxMiwiNjY3IjoxOTYsIjY2OCI6MTA0LCI2NjkiOjE5NywiNjcwIjoyOCwiNjcxIjoxMDEsIjY3MiI6MjUxLCI2NzMiOjE0OSwiNjc0IjoxMzEsIjY3NSI6MjUwLCI2NzYiOjE1NSwiNjc3IjoyMCwiNjc4IjoyMDMsIjY3OSI6OTYsIjY4MCI6MjQ5LCI2ODEiOjMzLCI2ODIiOjIxNywiNjgzIjoxNDUsIjY4NCI6ODYsIjY4NSI6MTMzLCI2ODYiOjE2MywiNjg3IjoxNTgsIjY4OCI6MTYwLCI2ODkiOjIzMSwiNjkwIjo0NiwiNjkxIjo4OSwiNjkyIjo1MCwiNjkzIjo1OSwiNjk0IjoyMzYsIjY5NSI6MjQwLCI2OTYiOjEwNCwiNjk3IjoyNDAsIjY5OCI6MzEsIjY5OSI6MjE1LCI3MDAiOjUzLCI3MDEiOjI0MCwiNzAyIjoxMDAsIjcwMyI6MTkwLCI3MDQiOjI0OSwiNzA1IjoyMTIsIjcwNiI6MjQ1LCI3MDciOjAsIjcwOCI6MCwiNzA5IjowLCI3MTAiOjAsIjcxMSI6NzMsIjcxMiI6NjksIjcxMyI6NzgsIjcxNCI6NjgsIjcxNSI6MTc0LCI3MTYiOjY2LCI3MTciOjk2LCI3MTgiOjEzMH0="
            }
          }
        }
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