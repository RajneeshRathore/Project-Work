const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

// Load firewall rules
let firewallRules = {
    blockedIPs: [],
    rateLimits: {
        windowMs: 60000,
        maxRequests: 100
    },
    whitelistPaths: [],
    blacklistPaths: []
};

// Middleware for IP Blocking
const ipBlockingMiddleware = (req, res, next) => {
    const clientIP = req.ip;
    if (firewallRules.blockedIPs.includes(clientIP)) {
        res.status(403).send('Access Denied');
    } else {
        next();
    }
};

app.use(ipBlockingMiddleware);

// Middleware for Path Whitelisting and Blacklisting
const pathFilterMiddleware = (req, res, next) => {
    const requestPath = req.path;
    if (firewallRules.blacklistPaths.includes(requestPath)) {
        res.status(403).send('Access Denied');
    } else if (firewallRules.whitelistPaths.includes(requestPath)) {
        next();
    } else {
        next();
    }
};

app.use(pathFilterMiddleware);

// Middleware for Rate Limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: firewallRules.rateLimits.windowMs, // 1 minute
    max: firewallRules.rateLimits.maxRequests, // limit each IP to max requests per windowMs
    message: 'Too many requests, please try again later.'
});

app.use(limiter);

// Middleware for Logging Blocked Requests
const loggingMiddleware = (req, res, next) => {
    if (res.statusCode === 403) {
        const logEntry = `Blocked Request: ${req.ip} - ${req.path} - ${new Date().toISOString()}\n`;
        fs.appendFileSync('blocked-requests.log', logEntry);
    }
    next();
};

app.use(loggingMiddleware);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/save-config', (req, res) => {
    firewallRules = req.body;
    console.log('Configuration received:', firewallRules);
    res.json({ message: 'Configuration saved successfully!' });
});

// Handle specific paths
app.get('/safe-path', (req, res) => {
    res.send('This is a safe path!');
});

app.get('/blocked-path', (req, res) => {
    res.status(403).send('Access Denied');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
