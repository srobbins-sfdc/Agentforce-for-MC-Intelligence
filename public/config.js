// Configuration loaded from server
window.AgentforceConfig = {
    // Core configuration - loaded dynamically from server
    instanceUrl: '',
    clientId: '',
    agentId: '',
    apiVersion: 'v61.0',
    redirectUri: window.location.origin + '/oauth-callback.html',
    
    // Chat Configuration
    maxMessageLength: 2000,
    typingDelay: 1000,
    retryAttempts: 3,
    retryDelay: 2000,
    
    // UI Configuration - will be overridden by server config
    theme: {
        primaryColor: 'rgb(5, 19, 75)',
        headerTitle: 'Insights Powered by',
        welcomeMessage: "Hello! I'm your Agentforce assistant. How can I help you today?"
    },
    
    // Feature Flags
    features: {
        enableTypingIndicator: true,
        enableMessageTimestamps: true,
        enableErrorRetry: true,
        enableMinimize: false,
        enableFileUpload: false
    },
    
    // Security Configuration
    security: {
        enableCSRFProtection: true,
        sessionTimeout: 3600000, // 1 hour in milliseconds
        maxConcurrentSessions: 1
    },
    
    // Analytics Configuration (for MCI integration)
    analytics: {
        enableTracking: true,
        trackingId: '',
        events: {
            sessionStart: 'agentforce_session_start',
            messagesSent: 'agentforce_message_sent',
            messagesReceived: 'agentforce_message_received',
            sessionEnd: 'agentforce_session_end',
            errors: 'agentforce_error'
        }
    },
    
    // Development Configuration
    debug: false,
    
    // Validate configuration
    validate: function() {
        const required = ['instanceUrl', 'clientId', 'agentId'];
        const missing = required.filter(key => !this[key] || this[key] === '');
        
        if (missing.length > 0) {
            console.warn('Agentforce Config Warning: Missing values for:', missing);
            return false;
        }
        return true;
    },
    
    // Load configuration from server
    loadFromServer: async function() {
        try {
            const response = await fetch('/api/config');
            if (!response.ok) {
                throw new Error('Failed to load configuration');
            }
            const serverConfig = await response.json();
            
            // Merge server config
            this.instanceUrl = serverConfig.instanceUrl;
            this.clientId = serverConfig.clientId;
            this.agentId = serverConfig.agentId;
            this.apiVersion = serverConfig.apiVersion || this.apiVersion;
            this.debug = serverConfig.debug || false;
            
            // Merge theme configuration
            if (serverConfig.theme) {
                Object.assign(this.theme, serverConfig.theme);
            }
            
            console.log('Configuration loaded successfully');
            return true;
        } catch (error) {
            console.error('Failed to load configuration from server:', error);
            return false;
        }
    }
};

// Auto-load configuration when script loads
(async function() {
    await window.AgentforceConfig.loadFromServer();
})();

