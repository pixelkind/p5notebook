// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Controller } from "./controller";
import { Serializer } from "./serializer";

// This method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.workspace.registerNotebookSerializer("p5notebook", new Serializer()),
    new Controller()
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("p5notebook.new", async () => {
      const newNotebook = await vscode.workspace.openNotebookDocument(
        "p5notebook",
        new vscode.NotebookData([
          new vscode.NotebookCellData(
            vscode.NotebookCellKind.Markup,
            "# Welcome to your p5.js Notebook",
            "markdown"
          ),
          new vscode.NotebookCellData(
            vscode.NotebookCellKind.Code,
            "function setup() {\n  window.createCanvas(200, 200);\n}",
            "javascript"
          ),
        ])
      );
      await vscode.window.showNotebookDocument(newNotebook);
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
