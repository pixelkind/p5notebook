# p5.js Notebook

With the p5.js Notebook extension for Visual Studio Code you can create notebooks in Visual Studio Code that run p5.js code.

After installing the extension you can create a new file with the file-ending `.p5js` and start working in your notebook.

## How does it work?

A notebook documents works like JavaScript code that is executed in a single HTML file. That means, you cannot redefine variables in the file and you can override functions and variables in code cells later on.

If you execute a specific cell, all cells upon to this cell will be executed but not further. That means it works differently compared to regular Jupyter notebooks where you can run cells in any order and execute a single cell only.

## Getting started

To get started you can open the command palette and call **New p5.js Notebook** to get a simple example p5.js Notebook. It will contain one _markdown_ cell and one JavaScript cell with some example starter code.

Alternatively you can create a new file and use the file-ending _.p5js_. Visual Studio Code will recognize and render it if you have this extension installed.

## Release notes

### Version 0.1.0

- Initial release
- You can run JavaScript code in cells that use the p5.js library

## License

This Library is licensed under the MIT License. Please refer to the LICENSE.txt for more information.
