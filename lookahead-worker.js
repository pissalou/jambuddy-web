let timerId = null;

self.onmessage = function(e) {
  if (e.data?.cmd === 'start') {
    let checkInterval = e.data.interval;
    console.log(`Lookahead worker started with interval ${checkInterval.toFixed(3)}ms`);
    timerId = setInterval(() => self.postMessage('tick'), checkInterval);
  } else if (e.data === 'stop') {
    console.log('Lookahead worker stopping');
    clearInterval(timerId);
    timerId = null;
  }
};