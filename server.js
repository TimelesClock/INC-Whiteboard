const express = require('express');
const bodyParser = require('body-parser');
const shell = require('shelljs');

const app = express();
const port = 5000; // You can choose any port that is free on your system

app.use(bodyParser.json()); // For parsing application/json

// Endpoint to receive webhooks from GitHub
app.post('/deploy', (req, res) => {
    const payload = req.body;

    // Optional: Verify payload with your secret token for security

    // The deployment script
    try {
        console.log('Deployment started...');
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

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
