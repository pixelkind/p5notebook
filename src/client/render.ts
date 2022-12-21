// We've set up this sample using CSS modules, which lets you import class
// names into JavaScript: https://github.com/css-modules/css-modules
// You can configure or change this in the webpack.config.js file.
import type { RendererContext } from "vscode-notebook-renderer";
import * as p5string from "./p5.txt";

interface IRenderInfo {
  container: HTMLElement;
  mime: string;
  value: any;
  context: RendererContext<unknown>;
}

// This function is called to render your contents.
export function render({ container, mime, value }: IRenderInfo) {
  const startCreateCanvasIndex = value.search("createCanvas") + 13; // + function name and bracket
  const endCreateCanvasIndex = value.indexOf(")", startCreateCanvasIndex);
  const sizeString = value.substr(
    startCreateCanvasIndex,
    endCreateCanvasIndex - startCreateCanvasIndex
  );
  let sizeArray = sizeString.split(",");
  if (sizeArray[0] === "innerWidth" || sizeArray[0] === "outerWidth") {
    sizeArray[0] = "100%";
  }
  if (sizeArray[1] === "innerHeight" || sizeArray[1] === "outerHeight") {
    sizeArray[1] = "300px";
  }

  const iframe = document.createElement("iframe");
  // iframe.width = "100%";
  // iframe.height = "300px";
  iframe.width = sizeArray[0];
  iframe.height = sizeArray[1];
  iframe.style.border = "none";
  iframe.style.margin = "0px";
  iframe.style.padding = "0px";
  const iroot = document.createElement("div");

  const postcode = `
  window.addEventListener("load", () => {
    document.querySelector("body").style.margin = "0px auto";
    document.querySelector("body").style.lineHeight = "0px";
  });
  `;
  const script = document.createElement("script");
  // script.type = "module";
  script.innerHTML = `${value}\n\n${p5string}\n\n${postcode}`;
  script.style.margin = "0px";
  iroot.appendChild(script);

  iframe.srcdoc = iroot.innerHTML;
  container.appendChild(iframe);
}

if (module.hot) {
  module.hot.addDisposeHandler(() => {
    // In development, this will be called before the renderer is reloaded. You
    // can use this to clean up or stash any state.
  });
}

/*
function sendLog(message: string, type: string) {
  api.postMessage({ command: "log", message: message, type: type });
}

function addLog(msg: any, type: string) {
  if (typeof msg === "object") {
    msg = JSON.stringify(msg, null, 4);
  }

  sendLog(msg, type);
}

window.console.log = (msg) => {
  addLog(msg, "log");
};
window.console.debug = (msg) => {
  addLog(msg, "debug");
};
window.console.error = (msg) => {
  addLog(msg, "error");
};
window.console.info = (msg) => {
  addLog(msg, "info");
};
window.console.trace = (msg) => {
  addLog(msg, "trace");
};
window.console.warn = (msg) => {
  addLog(msg, "warn");
};
*/
