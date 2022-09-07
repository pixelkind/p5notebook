import * as vscode from "vscode";

export class Controller {
  readonly controllerId = "p5js-notebook-controller";
  readonly notebookType = "p5notebook";
  readonly label = "p5.js Notebook";
  readonly supportedLanguages = ["javascript"];

  private readonly _controller: vscode.NotebookController;

  constructor() {
    this._controller = vscode.notebooks.createNotebookController(
      this.controllerId,
      this.notebookType,
      this.label
    );

    this._controller.supportedLanguages = this.supportedLanguages;
    this._controller.supportsExecutionOrder = false;
    this._controller.executeHandler = this._execute.bind(this);
  }

  private _execute(
    cells: vscode.NotebookCell[],
    _notebook: vscode.NotebookDocument,
    _controller: vscode.NotebookController
  ): void {
    const allCells = _notebook.getCells();
    let code = "";
    for (let cell of allCells) {
      if (cell.kind === 2) {
        code += cell.document.getText() + "\n";
      }
      if (
        cells.find((element) => {
          return element === cell;
        })
      ) {
        this._doExecution(cell, code);
      }
    }
  }

  private _doExecution(cell: vscode.NotebookCell, code: string) {
    const execution = this._controller.createNotebookCellExecution(cell);
    execution.start(Date.now());

    //use ESLint before executing, otherwise show error message

    execution.replaceOutput([
      new vscode.NotebookCellOutput([
        vscode.NotebookCellOutputItem.text(code, "text/p5js"),
      ]),
    ]);
    execution.end(true, Date.now());
  }

  dispose() {}
}
