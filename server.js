const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log('\x1b[36m%s\x1b[0m', '╔══════════════════════════════════════╗');
    console.log('\x1b[36m%s\x1b[0m', '║    Breaking Sod Website Server       ║');
    console.log('\x1b[36m%s\x1b[0m', '╠══════════════════════════════════════╣');
    console.log('\x1b[32m%s\x1b[0m', `║    http://localhost:${port}             ║`);
    console.log('\x1b[36m%s\x1b[0m', '╚══════════════════════════════════════╝');
    console.log('\nPress Ctrl+C to stop\n');
});