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
  const iframe = document.createElement("iframe");
  iframe.width = "100%";
  iframe.height = "300px";
  iframe.style.border = "none";
  iframe.style.margin = "0px";
  iframe.style.padding = "0px";
  const iroot = document.createElement("div");

  const precode = `
  window.addEventListener("load", () => {
    document.querySelector("body").style.margin = "0px auto";
  });
  `;
  const script = document.createElement("script");
  // script.type = "module";
  script.innerHTML = `${precode}\n\n${value}\n\n${p5string}`;
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
