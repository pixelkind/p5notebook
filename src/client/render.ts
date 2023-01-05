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
  } else {
    sizeArray[1] = `${parseInt(sizeArray[1]) + 100}px`;
  }

  const iframe = document.createElement("iframe");
  iframe.width = "100%";
  // iframe.height = "300px";
  //iframe.width = sizeArray[0];
  iframe.height = sizeArray[1];
  //iframe.style.height = sizeArray[1];
  iframe.style.border = "none";
  iframe.style.margin = "0px";
  iframe.style.padding = "0px";
  const iroot = document.createElement("div");
  iroot.style.lineHeight = "0px";

  const heightContainer = document.createElement("div");
  //heightContainer.style.height = sizeArray[1];
  heightContainer.style.overflow = "hidden";
  heightContainer.style.display = "flex";
  heightContainer.style.flexDirection = "column";

  const postcode = `
  function p5setup() {
    const createCanvasSuper = window.createCanvas;
    window.createCanvas = (w, h, renderer) => {
      document.getElementById("p5container").innerHTML = "";
      const p5canvas = createCanvasSuper(w, h, renderer);
      p5canvas.parent("p5container");
      return p5canvas;
    };

    window.customSetup();
  }

  window.customSetup = window.setup;
  window.setup = p5setup;

  window.addEventListener("load", () => {
    document.querySelector("body").style.margin = "0px auto";
    //document.querySelector("body").style.lineHeight = "0px";
  });

  function sendLog(message, type) {
    const logElement = document.getElementById("p5log");
    logElement.innerHTML += message + "<br>";
    logElement.scrollTop = logElement.scrollHeight;
  }
  
  function addLog(msg, type) {
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
  `;
  const script = document.createElement("script");
  script.innerHTML = `${value}\n\n${p5string}\n\n${postcode}`;
  script.style.margin = "0px";
  heightContainer.appendChild(script);

  const p5container = document.createElement("div");
  p5container.id = "p5container";
  //p5container.style.position = "absolute";
  //p5container.innerText = "CONTAINER";
  heightContainer.appendChild(p5container);

  const logElement = document.createElement("code");
  logElement.id = "p5log";
  logElement.style.height = "100px";
  logElement.style.overflow = "auto";
  heightContainer.appendChild(logElement);

  iroot.appendChild(heightContainer);
  iframe.srcdoc = iroot.innerHTML;
  container.appendChild(iframe);

  const log = document.createElement("code");
  log.id = "p5log";
  log.className = "log";
  container.appendChild(log);

  const logScript = document.createElement("script");
  logScript.innerHTML = `
  window.addEventListener("message", (event) => {
    const data = event.data;
    if (data.type === "p5log") {
      console.log(event.data.message);
    }
  });
  `;
  logScript.style.margin = "0px";
  container.appendChild(logScript);
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
