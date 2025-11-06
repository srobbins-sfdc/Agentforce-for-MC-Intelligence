const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Validate required environment variables
const requiredEnvVars = [
    'SALESFORCE_INSTANCE_URL',
    'SALESFORCE_CLIENT_ID',
    'SALESFORCE_CLIENT_SECRET',
    'SALESFORCE_AGENT_ID'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingEnvVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('\nPlease set these environment variables before starting the server.');
    console.error('See .env.example for reference.\n');
    process.exit(1);
}

// Security middleware - Allow embedding from any site
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://*.salesforce.com", "https://*.force.com", "https://cdn.jsdelivr.net"],
            connectSrc: ["'self'", "https://*.salesforce.com", "https://*.force.com", "https://api.salesforce.com"],
            frameSrc: ["'self'", "https://*.salesforce.com", "https://*.force.com"],
            frameAncestors: ["*"], // Allow embedding from any site
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https:", "data:"]
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    frameguard: false // Disable X-Frame-Options to allow iframe embedding
}));

// Enable compression
app.use(compression());

// Parse JSON bodies
app.use(express.json());

// CORS middleware for iframe embedding
app.use((req, res, next) => {
    res.header('X-Frame-Options', 'ALLOWALL');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Serve static files with proper cache control
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
        // Force reload for JavaScript files to avoid caching issues
        if (filePath.endsWith('.js') || filePath.endsWith('.css')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
        }
    }
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Configuration endpoint (for dynamic config loading)
app.get('/api/config', (req, res) => {
    const config = {
        instanceUrl: process.env.SALESFORCE_INSTANCE_URL,
        clientId: process.env.SALESFORCE_CLIENT_ID,
        agentId: process.env.SALESFORCE_AGENT_ID,
        apiVersion: process.env.SALESFORCE_API_VERSION || 'v61.0',
        debug: process.env.DEBUG_MODE === 'true' || process.env.NODE_ENV !== 'production',
        theme: {
            primaryColor: process.env.CHAT_PRIMARY_COLOR || 'rgb(5, 19, 75)',
            headerTitle: process.env.CHAT_HEADER_TITLE || 'Insights Powered by',
            welcomeMessage: process.env.CHAT_WELCOME_MESSAGE || "Hello! I'm your Agentforce assistant. How can I help you today?"
        }
    };
    
    res.json(config);
});

// Client credentials flow endpoint (automatic authentication)
app.post('/api/oauth/client-credentials', async (req, res) => {
    try {
        const instanceUrl = process.env.SALESFORCE_INSTANCE_URL;
        const clientId = process.env.SALESFORCE_CLIENT_ID;
        const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
        
        if (!clientId || !clientSecret) {
            return res.status(500).json({ 
                error: 'Server configuration error', 
                message: 'Missing client credentials' 
            });
        }
        
        const tokenUrl = `${instanceUrl}/services/oauth2/token`;
        const params = new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret
        });
        
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: params
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error_description || 'Client credentials authentication failed');
        }
        
        const tokenData = await response.json();
        
        // Don't send client_secret back to client
        const { client_secret, ...safeTokenData } = tokenData;
        
        res.json(safeTokenData);
        
    } catch (error) {
        console.error('Client credentials flow error:', error);
        res.status(500).json({ 
            error: 'Authentication failed', 
            message: error.message 
        });
    }
});

// OAuth token exchange endpoint (more secure than client-side)
app.post('/api/oauth/token', async (req, res) => {
    try {
        const { code } = req.body;
        
        if (!code) {
            return res.status(400).json({ error: 'Authorization code required' });
        }
        
        const instanceUrl = process.env.SALESFORCE_INSTANCE_URL;
        const clientId = process.env.SALESFORCE_CLIENT_ID;
        const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
        const redirectUri = `${req.protocol}://${req.get('host')}/oauth-callback.html`;
        
        const tokenUrl = `${instanceUrl}/services/oauth2/token`;
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri
        });
        
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: params
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error_description || 'Token exchange failed');
        }
        
        const tokenData = await response.json();
        
        // Don't send client_secret back to client
        const { client_secret, ...safeTokenData } = tokenData;
        
        res.json(safeTokenData);
        
    } catch (error) {
        console.error('OAuth token exchange error:', error);
        res.status(500).json({ 
            error: 'Token exchange failed', 
            message: error.message 
        });
    }
});

// Catch-all handler: send back index.html for any non-API routes
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        res.status(404).json({ error: 'API endpoint not found' });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 Agentforce Chat Widget server started');
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✅ Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 Instance URL: ${process.env.SALESFORCE_INSTANCE_URL}`);
});

