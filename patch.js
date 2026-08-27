const fs = require('fs');
const p = './src/index.js';
let c = fs.readFileSync(p, 'utf8');
if (!c.includes('window.onerror')) {
  c = "window.onerror = function(msg, src, lineno, colno, error) { console.error('GLOBAL_ERROR:', error ? error.stack : msg); fs = require('fs'); };\n" + c;
  fs.writeFileSync(p, c);
}
