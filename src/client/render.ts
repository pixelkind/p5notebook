// We've set up this sample using CSS modules, which lets you import class
// names into JavaScript: https://github.com/css-modules/css-modules
// You can configure or change this in the webpack.config.js file.
import * as style from "./style.css";
import type { RendererContext } from "vscode-notebook-renderer";
import * as p5string from "./p5.txt";

interface IRenderInfo {
  container: HTMLElement;
  mime: string;
  value: any;
  containerId: string;
  context: RendererContext<unknown>;
}

// This function is called to render your contents.
export function render({ container, mime, value, containerId }: IRenderInfo) {
  // Format the JSON and insert it as <pre><code>{ ... }</code></pre>
  // Replace this with your custom code!
  // document.location.reload();

  const iframe = document.createElement("iframe");
  iframe.width = "100%";
  iframe.height = "300px";
  iframe.style.border = "none";
  iframe.style.margin = "0px";
  iframe.style.padding = "0px";
  const iroot = document.createElement("div");

  const p5container = document.createElement("div");
  p5container.id = "p5container";
  p5container.innerText = "placeholder";
  iroot.appendChild(p5container);

  // const canvas = document.createElement("canvas");
  // canvas.id = "canvas";
  // canvas.setAttribute("style", "width: 200px; height: 200px;");
  // iroot.appendChild(canvas);

  console.log(containerId);
  const precode = `
  const containerId = "${containerId}";
  // const p5document = document.getElementById("${containerId}").shadowRoot;
  // document = p5document;
  const p5document = document;
  `; //\nlet superDocument = document;\console.log("HELLO!!!!");\ndocument = document.getElementById("${containerId}").shadowRoot;`;
  const precodeP5 = `
  const createCanvasSuper = createCanvas;
  function createCanvas(w, h, renderer) {
    console.log("SPONGEBOB");
    const canvas = createCanvasSuper(w, h, renderer);
    p5document.appendChild(canvas.elt);
    canvas.show();
  }
  `;
  const script = document.createElement("script");
  // script.type = "module";
  // script.type = "text/javascript";
  script.innerHTML = `${precode}\n\n${value}\n\n${p5string}\n${precodeP5}`;
  iroot.appendChild(script);

  // const script = document.createElement("script");
  // // script.type = "module";
  // // script.type = "text/javascript";
  // script.innerHTML = `${value}`;
  // container.appendChild(script);

  iframe.srcdoc = iroot.innerHTML;
  container.appendChild(iframe);

  const pre = document.createElement("pre");
  pre.classList.add(style.json);
  const code = document.createElement("code");
  code.textContent = `mime type: ${mime}\n\n${JSON.stringify(value, null, 2)}`;
  pre.appendChild(code);
  container.appendChild(pre);
}

if (module.hot) {
  module.hot.addDisposeHandler(() => {
    // In development, this will be called before the renderer is reloaded. You
    // can use this to clean up or stash any state.
  });
}
