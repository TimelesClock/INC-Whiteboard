const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const port = 5000; // HTTPS port

app.use(bodyParser.json()); // For parsing application/json

// Read the SSL certificate and private key
const privateKey = fs.readFileSync('server.key', 'utf8');
const certificate = fs.readFileSync('server.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Endpoint to receive webhooks from GitHub
app.post('/deploy', (req, res) => {
    // Optional: Verify payload with your secret token for security

    console.log('Deployment started...');

    // Send the response immediately
    res.status(200).send('Deployment started!');

    // Spawn a new process for deployment
    const deployScript = spawn('sh', ['./deploy_script.sh']);

    deployScript.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    deployScript.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    deployScript.on('close', (code) => {
        console.log(`Deployment script exited with code ${code}`);
    });
});

// Create HTTPS server
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
    console.log(`HTTPS Server is listening on port ${port}`);
});

// Don't forget to create the deploy_script.sh as described previously
