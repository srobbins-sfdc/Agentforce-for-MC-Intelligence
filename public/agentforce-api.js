class AgentforceAPI {
    constructor(config) {
        this.config = config;
        this.accessToken = null;
        this.sessionId = null;
        this.isAuthenticated = false;
        this.baseUrl = `${config.instanceUrl}/services/data/${config.apiVersion}`;
        this.retryCount = 0;
    }
    
    async authenticate() {
        try {
            this.log('Starting OAuth authentication...');
            
            // Check for existing token in session storage
            const storedToken = sessionStorage.getItem('sf_access_token');
            const tokenExpiry = sessionStorage.getItem('sf_token_expiry');
            
            if (storedToken && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
                this.accessToken = storedToken;
                this.isAuthenticated = true;
                this.log('Using stored access token');
                return;
            }
            
            // Use client credentials flow for automatic authentication
            await this.performClientCredentialsFlow();
            
        } catch (error) {
            this.handleError('Authentication failed', error);
            throw error;
        }
    }
    
    async performClientCredentialsFlow() {
        try {
            this.log('Using client credentials flow for automatic authentication');
            
            // Call the server endpoint to get token (keeps client secret secure)
            const response = await fetch('/api/oauth/client-credentials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            const tokenData = await response.json();
            this.handleTokenSuccess(tokenData);
            
        } catch (error) {
            this.log('Client credentials flow failed, falling back to user OAuth flow');
            // Fallback to interactive OAuth if client credentials fails
            await this.performOAuthFlow();
        }
    }
    
    async performOAuthFlow() {
        return new Promise((resolve, reject) => {
            const state = this.generateState();
            const authUrl = this.buildAuthUrl(state);
            
            // Store state for validation
            sessionStorage.setItem('oauth_state', state);
            
            // Open popup for OAuth
            const popup = window.open(
                authUrl,
                'sf-oauth',
                'width=500,height=600,scrollbars=yes,resizable=yes'
            );
            
            // Listen for OAuth callback
            const messageHandler = (event) => {
                if (event.origin !== window.location.origin) return;
                
                if (event.data.type === 'OAUTH_SUCCESS') {
                    window.removeEventListener('message', messageHandler);
                    popup.close();
                    
                    this.handleTokenSuccess(event.data);
                    resolve();
                } else if (event.data.type === 'OAUTH_ERROR') {
                    window.removeEventListener('message', messageHandler);
                    popup.close();
                    reject(new Error(event.data.error));
                }
            };
            
            window.addEventListener('message', messageHandler);
            
            // Handle popup closed manually
            const checkClosed = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkClosed);
                    window.removeEventListener('message', messageHandler);
                    reject(new Error('Authentication cancelled'));
                }
            }, 1000);
        });
    }
    
    buildAuthUrl(state) {
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: this.config.clientId,
            redirect_uri: this.config.redirectUri,
            state: state,
            scope: 'api refresh_token'
        });
        
        return `${this.config.instanceUrl}/services/oauth2/authorize?${params}`;
    }
    
    generateState() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }
    
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    handleTokenSuccess(data) {
        this.accessToken = data.access_token;
        this.isAuthenticated = true;
        
        // Store token with expiry (default 2 hours)
        const expiry = Date.now() + (2 * 60 * 60 * 1000);
        sessionStorage.setItem('sf_access_token', this.accessToken);
        sessionStorage.setItem('sf_token_expiry', expiry.toString());
        
        this.log('Authentication successful');
    }
    
    async startSession() {
        if (!this.isAuthenticated) {
            await this.authenticate();
        }
        
        try {
            // Generate external session key (UUID)
            const externalSessionKey = this.generateUUID();
            
            // Use the correct Agentforce session creation endpoint
            const sessionUrl = `https://api.salesforce.com/einstein/ai-agent/v1/agents/${this.config.agentId}/sessions`;
            
            const sessionData = {
                externalSessionKey: externalSessionKey,
                instanceConfig: {
                    endpoint: this.config.instanceUrl
                },
                streamingCapabilities: {
                    chunkTypes: ["Text"]
                },
                bypassUser: true
            };
            
            this.log('Creating Agentforce session with data:', sessionData);
            
            const response = await fetch(sessionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(sessionData)
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(`Session creation failed: ${response.status} ${response.statusText}${errorData ? ': ' + JSON.stringify(errorData) : ''}`);
            }
            
            const sessionResponse = await response.json();
            this.sessionId = sessionResponse.sessionId || sessionResponse.id;
            this.externalSessionKey = externalSessionKey;
            
            this.log('Agentforce session created successfully:', this.sessionId);
            
            // Track session start
            this.trackEvent('sessionStart', { 
                sessionId: this.sessionId,
                externalSessionKey: this.externalSessionKey 
            });
            
            return sessionResponse;
        } catch (error) {
            this.handleError('Failed to start Agentforce session', error);
            throw error;
        }
    }
    
    async sendMessage(message, sessionId = null) {
        if (!sessionId && !this.sessionId) {
            await this.startSession();
        }
        
        const currentSessionId = sessionId || this.sessionId;
        
        try {
            this.log('Sending message to Agentforce:', message);
            
            // Use the correct Einstein AI Agent API endpoint
            const messageUrl = `https://api.salesforce.com/einstein/ai-agent/v1/sessions/${currentSessionId}/messages`;
            
            const messageData = {
                message: {
                    sequenceId: Date.now(),
                    type: "Text",
                    text: message
                },
                variables: []
            };
            
            const response = await fetch(messageUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(messageData)
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(`Message send failed: ${response.status} ${response.statusText}${errorData ? ': ' + JSON.stringify(errorData) : ''}`);
            }
            
            const responseData = await response.json();
            
            // Track message sent
            this.trackEvent('messagesSent', {
                sessionId: currentSessionId,
                messageLength: message.length
            });
            
            this.log('Message sent successfully to Agentforce:', responseData);
            return responseData;
            
        } catch (error) {
            this.handleError('Failed to send message to Agentforce', error);
            throw error;
        }
    }
    
    async endSession(sessionId = null) {
        const currentSessionId = sessionId || this.sessionId;
        
        if (!currentSessionId) return;
        
        try {
            const sessionUrl = `https://api.salesforce.com/einstein/ai-agent/v1/sessions/${currentSessionId}`;
            
            const response = await fetch(sessionUrl, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok && response.status !== 204) {
                const errorData = await response.json().catch(() => null);
                throw new Error(`Failed to end session: ${response.status} ${response.statusText}`);
            }
            
            if (currentSessionId === this.sessionId) {
                this.sessionId = null;
            }
            
            // Track session end
            this.trackEvent('sessionEnd', { sessionId: currentSessionId });
            
            this.log('Agentforce session ended:', currentSessionId);
        } catch (error) {
            this.handleError('Failed to end session', error);
        }
    }
    
    trackEvent(eventName, data = {}) {
        if (!this.config.analytics.enableTracking) return;
        
        const eventData = {
            event: this.config.analytics.events[eventName] || eventName,
            timestamp: new Date().toISOString(),
            trackingId: this.config.analytics.trackingId,
            ...data
        };
        
        // Send to MCI analytics
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                type: 'AGENTFORCE_ANALYTICS',
                data: eventData
            }, '*');
        }
        
        this.log('Event tracked:', eventName, eventData);
    }
    
    handleError(message, error) {
        const errorData = {
            message: message,
            error: error?.message || error,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId
        };
        
        this.log('Error:', errorData);
        
        // Track error
        this.trackEvent('errors', errorData);
        
        // Notify parent frame if embedded
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                type: 'AGENTFORCE_ERROR',
                data: errorData
            }, '*');
        }
    }
    
    log(...args) {
        if (this.config.debug) {
            console.log('[AgentforceAPI]', ...args);
        }
    }
    
    // Cleanup method
    cleanup() {
        if (this.sessionId) {
            this.endSession();
        }
        
        // Clear stored tokens
        sessionStorage.removeItem('sf_access_token');
        sessionStorage.removeItem('sf_token_expiry');
        sessionStorage.removeItem('oauth_state');
        
        this.isAuthenticated = false;
        this.accessToken = null;
        this.sessionId = null;
    }
}

