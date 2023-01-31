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
  iframe.style.overflow = "hidden";
  const iroot = document.createElement("div");
  iroot.style.lineHeight = "0px";
  iroot.style.overflow = "hidden";

  const heightContainer = document.createElement("div");
  //heightContainer.style.height = sizeArray[1];
  heightContainer.style.overflow = "hidden";
  heightContainer.style.display = "flex";
  heightContainer.style.lineHeight = "0px";
  heightContainer.style.flexDirection = "column";

  const p5container = document.createElement("div");
  p5container.id = "p5container";
  //p5container.style.position = "absolute";
  //p5container.innerText = "CONTAINER";
  heightContainer.appendChild(p5container);

  const logElement = document.createElement("code");
  logElement.id = "p5log";
  logElement.style.marginTop = "1em";
  logElement.style.padding = "0.4em";
  logElement.style.height = "calc(100px - 2em)";
  logElement.style.overflow = "auto";
  logElement.style.backgroundColor = "#1C2127";
  logElement.style.color = "#ADBAC7";
  logElement.style.lineHeight = "1.2em";
  heightContainer.appendChild(logElement);

  const precode = `
  function addLog(msg, type) {
    if (typeof(msg) === "string" && msg.indexOf('You just changed the value of "createCanvas", which was a p5 function.') === 0) {
      return;
    }
    const logElement = document.getElementById("p5log");
    if (logElement) {
      if (typeof(msg) === "string" && msg.indexOf('\\n🌸 p5.js says:') === 0) {
        const info = msg.substring(msg.indexOf("["), msg.indexOf("]") + 2);
        msg = msg.replace(info, "");
      }
      logElement.innerHTML += msg + "<br>";
      logElement.scrollTop = logElement.scrollHeight;
    }
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
  `;
  const script = document.createElement("script");
  script.innerHTML = `${precode}\n\n${value}\n\n${p5string}\n\n${postcode}`;
  script.style.margin = "0px";
  script.style.lineHeight = "0px";
  script.defer = true;
  heightContainer.appendChild(script);

  iroot.appendChild(heightContainer);
  iframe.srcdoc = iroot.innerHTML;
  container.appendChild(iframe);
}

if (module.hot) {
  module.hot.addDisposeHandler(() => {
    // In development, this will be called before the renderer is reloaded. You
    // can use this to clean up or stash any state.
  });
}
