const http = require('http');
const fs = require('fs');
const url = require('url');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === '/') {
        let userMessage;
        if (parsedUrl.query.action === 'reply') {

            fs.readFile('index.html', 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error reading HTML file');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                }
            });
            userMessage = parsedUrl.query.message;
            if (userMessage) {
                // Append the message to chat.txt
                fs.appendFile('chat.txt', userMessage + '\n', (err) => {
                    if (err) {
                        console.error('Error writing to chat.txt:', err);
                    }
                });
            }
        } else if (parsedUrl.query.action === 'seeChat') {
    fs.readFile('chat.txt', 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error reading chat.txt');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
                <html>
                <head>
                    <meta http-equiv="refresh" content="3">
                    <title>Chat Messages</title>
                </head>
                <body>
                    <pre>${data}</pre>
                    <p>Refreshing every 3 seconds...</p>
                </body>
                </html>
            `);
        }
    });
        } else {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(
                'enter ?action=reply at the end of current address to send message\n' +
                'enter ?action=seeChat at the end of current address to see message'
            );
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});