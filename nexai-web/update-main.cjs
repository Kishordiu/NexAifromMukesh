const fs = require('fs');
let c = fs.readFileSync('src/main.jsx', 'utf8');
const str = `
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

ReactDOM.createRoot`;
c = c.replace('ReactDOM.createRoot', str);
fs.writeFileSync('src/main.jsx', c);
