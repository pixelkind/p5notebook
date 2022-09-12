import * as vscode from "vscode";
import { JSHINT } from "jshint";

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

    let options = {
      esversion: 6,
    };
    JSHINT(code, options);
    let errors = JSHINT.errors;
    if (errors.length === 0) {
      execution.replaceOutput([
        new vscode.NotebookCellOutput([
          vscode.NotebookCellOutputItem.text(code, "text/p5js"),
        ]),
      ]);
    } else {
      let message = "Errors:\n";
      errors.forEach((element: any) => {
        message += `Line ${element.line}, col ${element.character}: ${element.reason}\n`;
      });
      execution.replaceOutput([
        new vscode.NotebookCellOutput([
          vscode.NotebookCellOutputItem.text(message),
        ]),
      ]);
    }

    execution.end(true, Date.now());
  }

  dispose() {}
}
