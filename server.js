const express = require('express');
const bodyParser = require('body-parser');
const shell = require('shelljs');
const https = require('https');
const fs = require('fs');

const app = express();
const port = 5000; // HTTPS port

app.use(bodyParser.json()); // For parsing application/json

// Read the SSL certificate and private key
const privateKey = fs.readFileSync('server.key', 'utf8');
const certificate = fs.readFileSync('server.crt', 'utf8');

const credentials = { key: privateKey, cert: certificate };

// Endpoint to receive webhooks from GitHub
app.post('/deploy', (req, res) => {
    const payload = req.body;

    // Optional: Verify payload with your secret token for security

    // The deployment script
    try {
        console.log('Deployment started...');
        shell.exec("cd /home/ubuntu/INC-TLDraw-Socket/backend")
        shell.exec('git pull origin main');
        shell.exec('sudo docker build -t inc-whiteboard-socket .');
        shell.exec('sudo docker run -d -p 3001:3001 inc-tldraw-socket');
        console.log('Deployment successful!');
        res.status(200).send('Deployment successful!');
    } catch (error) {
        console.error('Deployment failed:', error);
        res.status(500).send('Deployment failed');
    }
});

// Create HTTPS server
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
    console.log(`HTTPS Server is listening on port ${port}`);
});

