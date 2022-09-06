import * as vscode from "vscode";

export class Controller {
  readonly controllerId = "p5js-notebook-controller";
  readonly notebookType = "p5notebook";
  readonly label = "p5.js Notebook";
  readonly supportedLanguages = ["javascript"];

  private readonly _controller: vscode.NotebookController;
  private _executionOrder = 0;

  constructor() {
    this._controller = vscode.notebooks.createNotebookController(
      this.controllerId,
      this.notebookType,
      this.label
    );

    this._controller.supportedLanguages = this.supportedLanguages;
    this._controller.supportsExecutionOrder = true;
    this._controller.executeHandler = this._execute.bind(this);
  }

  private _execute(
    cells: vscode.NotebookCell[],
    _notebook: vscode.NotebookDocument,
    _controller: vscode.NotebookController
  ): void {
    console.log("EXECUTE", cells.length);
    for (let cell of cells) {
      this._doExecution(cell);
    }
  }

  private _doExecution(cell: vscode.NotebookCell) {
    const execution = this._controller.createNotebookCellExecution(cell);
    execution.executionOrder = ++this._executionOrder;
    execution.start(Date.now());

    // const output = eval(cell.document.getText());
    const text = cell.document.getText();
    console.log(text);
    console.log(this._executionOrder);

    execution.replaceOutput([
      new vscode.NotebookCellOutput([
        vscode.NotebookCellOutputItem.text(text, "text/p5js"),
        vscode.NotebookCellOutputItem.text(
          `<html><body><div></div><script>${text}</script></body></html>`,
          "text/html"
        ),
        vscode.NotebookCellOutputItem.text(text, "text/plain"),
      ]),
    ]);
    execution.end(true, Date.now());
  }

  dispose() {}
}
