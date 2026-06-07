const url = "https://www.verovio.org/javascript/6.2.0/verovio-toolkit-wasm.js";

const tkReady = new Promise((resolve, reject) => {
  import(url)
    .then((_) => {
      verovio.module.onRuntimeInitialized = () => {
        const tk = new verovio.toolkit();
        console.log(`Loading Verovio Toolkit from: ${url}`);
        resolve(tk);
      };
    })
    .catch(reject);
});

const defaultOptions = {
  scale: 99,
  expandAlways: true,
  transpose: '+0',
  landscape: true,
  adjustPageHeight: false,
  adjustPageWidth: false,
  pageHeight: 640,
  pageWidth: 280,
  evenNoteSpacing: false,
  spacingLinear: 0.25,
  spacingNonLinear: 0.6,
  footer: 'none'
};

self.onmessage = async function (e) {
  if (e.data?.cmd === 'render') {
    try {
      const tk = await tkReady;
      console.log(`Received render command with URL: ${e.data.url}`);
      const response = await fetch(e.data.url);
      const mei = await response.text();
      tk.setOptions({ ...defaultOptions, ...e.data.options });
      tk.loadData(mei);
      let svg = tk.renderToSVG();
      let timemap = tk.renderToTimemap();
      //console.log(svg)
      self.postMessage({ cmd: 'svg', data: svg, metadata: timemap });
    } catch (error) {
      console.error("Error in render:", error);
    }
  }
};
