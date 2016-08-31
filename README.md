### FS Play
Playing around with file system. Maybe one day use this project to create a node based build tool.

Currently, the `scaffold.js` file contains a couple of functions:
  - `makePaths` takes an array and parses it into another array of file paths based on the following (I think I just made this up) convention:
    - an array denotes a directory.
    - a string within an array denotes a file in that directory.
    - an object within an array denotes sub-directories
    - keys within that object denote the names of the sub-directories
    - those keys must have an array as their value (this array is a directory, as indicated above)
  - `build` takes an array of file paths (as returned from `makePaths`) and writes the file structure it describes.

Combined, these two functions form the basis for a scaffolding tool that allows one to describe their file structures in JSON. See the example in [the example file](/example/example.js)
