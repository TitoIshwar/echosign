const lr = require('./node_modules/lucide-react');
const keys = Object.keys(lr);
console.log('Code related:', keys.filter(k => k.toLowerCase().includes('code')));
console.log('Terminal:', keys.filter(k => k.toLowerCase().includes('terminal')));
console.log('Globe:', keys.filter(k => k.toLowerCase().includes('globe')));
console.log('At:', keys.filter(k => k.toLowerCase().includes('at-sign')));
