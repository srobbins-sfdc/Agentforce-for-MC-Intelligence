class ChatWidget {
    constructor() {
        this.api = null;
        this.messageHistory = [];
        this.isTyping = false;
        this.isMinimized = false;
        
        this.elements = {
            widget: document.getElementById('chat-widget'),
            messages: document.getElementById('chat-messages'),
            welcomeScreen: document.getElementById('welcome-screen'),
            chatConversation: document.getElementById('chat-conversation'),
            connectionStatus: document.getElementById('connection-status'),
            input: document.getElementById('message-input'),
            sendBtn: document.getElementById('send-btn'),
            typingIndicator: document.getElementById('typing-indicator'),
            minimizeBtn: document.getElementById('minimize-btn'),
            errorModal: document.getElementById('error-modal'),
            errorMessage: document.getElementById('error-message'),
            errorClose: document.getElementById('error-close')
        };
        
        this.init();
    }
    
    async init() {
        try {
            // Wait for configuration to load
            await this.waitForConfig();
            
            // Validate configuration
            if (!AgentforceConfig.validate()) {
                this.showError('Configuration Error', 'Please check your Agentforce configuration settings.');
                return;
            }
            
            // Initialize API
            this.api = new AgentforceAPI(AgentforceConfig);
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Auto-resize textarea
            this.setupAutoResize();
            
            // Handle window unload
            this.setupCleanup();
            
            // Apply theme
            this.applyTheme();
            
            // Initialize authentication status
            await this.initializeAuthentication();
            
            this.log('Chat widget initialized successfully');
            
        } catch (error) {
            this.showError('Initialization Error', error.message);
            console.error('Chat widget initialization failed:', error);
        }
    }
    
    async waitForConfig() {
        // Wait for config to be loaded from server
        let attempts = 0;
        while ((!AgentforceConfig.instanceUrl || !AgentforceConfig.clientId) && attempts < 10) {
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
        }
        
        if (!AgentforceConfig.instanceUrl || !AgentforceConfig.clientId) {
            throw new Error('Failed to load configuration from server');
        }
    }
    
    async initializeAuthentication() {
        try {
            this.updateConnectionStatus('Authenticating...', 'connecting');
            
            // Wait for API authentication to complete
            await this.api.authenticate();
            
            this.updateConnectionStatus('Creating session...', 'connecting');
            
            // Automatically create chat session after authentication
            await this.startChatSession();
            
        } catch (error) {
            this.updateConnectionStatus('Connection failed', 'error');
            this.log('Authentication or session creation failed:', error);
        }
    }
    
    updateConnectionStatus(text, status) {
        const statusElement = this.elements.connectionStatus;
        const statusText = statusElement.querySelector('.status-text');
        const spinner = statusElement.querySelector('.status-spinner');
        
        statusText.textContent = text;
        statusElement.className = `connection-status ${status}`;
        
        if (status === 'connecting') {
            spinner.style.display = 'block';
        } else {
            spinner.style.display = 'none';
        }
    }
    
    setupEventListeners() {
        // Send message on button click
        this.elements.sendBtn.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Send message on Enter (but not Shift+Enter)
        this.elements.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Enable/disable send button based on input
        this.elements.input.addEventListener('input', () => {
            const hasContent = this.elements.input.value.trim().length > 0;
            this.elements.sendBtn.disabled = !hasContent || this.isTyping;
        });
        
        // Minimize functionality
        if (AgentforceConfig.features.enableMinimize) {
            this.elements.minimizeBtn.addEventListener('click', () => {
                this.toggleMinimize();
            });
        } else {
            this.elements.minimizeBtn.style.display = 'none';
        }
        
        // Error modal close
        this.elements.errorClose.addEventListener('click', () => {
            this.hideError();
        });
        
        // Close error modal on backdrop click
        this.elements.errorModal.addEventListener('click', (e) => {
            if (e.target === this.elements.errorModal) {
                this.hideError();
            }
        });
        
        // Listen for messages from parent frame (MCI dashboard)
        window.addEventListener('message', (event) => {
            this.handleParentMessage(event);
        });
        
        // Handle visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handleVisibilityHidden();
            } else {
                this.handleVisibilityVisible();
            }
        });
    }
    
    setupAutoResize() {
        const input = this.elements.input;
        
        input.addEventListener('input', () => {
            // Reset height to calculate new height
            input.style.height = 'auto';
            
            // Set new height based on scroll height
            const newHeight = Math.min(input.scrollHeight, 80); // Max 80px
            input.style.height = newHeight + 'px';
        });
    }
    
    setupCleanup() {
        window.addEventListener('beforeunload', () => {
            if (this.api) {
                this.api.cleanup();
            }
        });
    }
    
    applyTheme() {
        const theme = AgentforceConfig.theme;
        
        if (theme.primaryColor) {
            document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
        }
        
        if (theme.headerTitle) {
            const agentName = document.querySelector('.agent-name');
            if (agentName) {
                agentName.textContent = theme.headerTitle;
            }
        }
        
        if (theme.welcomeMessage) {
            // Store for later use
            this.welcomeMessage = theme.welcomeMessage;
        }
    }
    
    async startChatSession() {
        try {
            // Hide welcome screen and show chat
            this.elements.welcomeScreen.style.display = 'none';
            this.elements.chatConversation.style.display = 'flex';
            
            // Show connecting message
            this.addMessage('Connecting...', 'bot');
            
            // Create Agentforce session
            const sessionResponse = await this.api.startSession();
            
            // Remove connecting message
            this.elements.chatConversation.innerHTML = '';
            
            // If session creation returned an initial message, display it
            if (sessionResponse && sessionResponse.messages && sessionResponse.messages.length > 0) {
                const initialMessage = sessionResponse.messages[sessionResponse.messages.length - 1];
                if (initialMessage && initialMessage.message) {
                    this.addMessage(initialMessage.message, 'bot');
                } else {
                    this.addMessage(this.welcomeMessage || AgentforceConfig.theme.welcomeMessage, 'bot');
                }
            } else {
                this.addMessage(this.welcomeMessage || AgentforceConfig.theme.welcomeMessage, 'bot');
            }
            
            // Focus on input
            this.elements.input.focus();
            
        } catch (error) {
            this.elements.welcomeScreen.style.display = 'flex';
            this.elements.chatConversation.style.display = 'none';
            this.handleError('Failed to start chat session', error);
        }
    }
    
    async sendMessage() {
        const messageText = this.elements.input.value.trim();
        
        if (!messageText || this.isTyping) return;
        
        try {
            // Disable input while sending
            this.setInputDisabled(true);
            
            // Add user message to UI
            this.addMessage(messageText, 'user');
            
            // Clear input
            this.elements.input.value = '';
            this.elements.input.style.height = 'auto';
            
            // Show typing indicator
            this.showTypingIndicator();
            
            // Send message via API
            const response = await this.api.sendMessage(messageText);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Process and display response
            await this.handleAgentResponse(response);
            
        } catch (error) {
            this.hideTypingIndicator();
            this.handleError('Failed to send message', error);
        } finally {
            this.setInputDisabled(false);
            this.elements.input.focus();
        }
    }
    
    async handleAgentResponse(response) {
        // Simulate typing delay if configured
        if (AgentforceConfig.typingDelay > 0) {
            await new Promise(resolve => setTimeout(resolve, AgentforceConfig.typingDelay));
        }
        
        this.log('Processing agent response:', response);
        
        // Extract message content from Einstein AI Agent API response
        let messageContent = '';
        
        if (response.messages && response.messages.length > 0) {
            const latestMessage = response.messages[response.messages.length - 1];
            if (latestMessage && latestMessage.message) {
                messageContent = latestMessage.message;
            } else if (latestMessage && latestMessage.content) {
                messageContent = latestMessage.content;
            }
        }
        
        // Fallback to other possible response formats
        if (!messageContent && response.content) {
            messageContent = response.content;
        } else if (!messageContent && response.message) {
            messageContent = response.message;
        }
        
        // Final fallback
        if (!messageContent) {
            messageContent = 'I received your message but could not generate a response. Please try again.';
            this.log('No message content found in response, using fallback');
        }
        
        this.log('Extracted message content:', messageContent);
        
        // Add agent message to UI
        this.addMessage(messageContent, 'bot');
    }
    
    addMessage(text, sender, timestamp = null) {
        const message = {
            text: text,
            sender: sender,
            timestamp: timestamp || new Date()
        };
        
        this.messageHistory.push(message);
        
        const messageElement = this.createMessageElement(message);
        this.elements.chatConversation.appendChild(messageElement);
        
        // Scroll to bottom
        this.scrollToBottom();
        
        // Limit message history to prevent memory issues
        if (this.messageHistory.length > 100) {
            this.messageHistory.shift();
            const firstMessage = this.elements.chatConversation.firstElementChild;
            if (firstMessage) {
                firstMessage.remove();
            }
        }
    }
    
    createMessageElement(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sender}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        
        // Render rich text for bot messages, plain text for user messages
        if (message.sender === 'bot') {
            textDiv.innerHTML = this.renderRichText(message.text);
        } else {
            textDiv.textContent = message.text;
        }
        
        contentDiv.appendChild(textDiv);
        
        if (AgentforceConfig.features.enableMessageTimestamps) {
            const timeDiv = document.createElement('div');
            timeDiv.className = 'message-time';
            timeDiv.textContent = this.formatTime(message.timestamp);
            contentDiv.appendChild(timeDiv);
        }
        
        messageDiv.appendChild(contentDiv);
        
        return messageDiv;
    }
    
    renderRichText(text) {
        if (!text) return '';
        
        try {
            // Pre-process the text to handle metric formatting
            let processedText = this.preprocessMetrics(text);
            
            // Configure marked.js for safe HTML rendering
            if (typeof marked !== 'undefined') {
                marked.setOptions({
                    breaks: true,
                    gfm: true,
                    sanitize: false,
                    smartLists: true,
                    smartypants: false,
                    xhtml: true
                });
                
                const renderer = new marked.Renderer();
                
                // Custom link renderer for security
                renderer.link = function(href, title, text) {
                    const titleAttr = title ? ` title="${title}"` : '';
                    return `<a href="${href}" target="_blank" rel="noopener noreferrer"${titleAttr}>${text}</a>`;
                };
                
                // Custom code renderer for better styling
                renderer.code = function(code, language) {
                    const langClass = language ? ` class="language-${language}"` : '';
                    return `<pre><code${langClass}>${code}</code></pre>`;
                };
                
                // Convert markdown to HTML
                let html = marked.parse(processedText, { renderer: renderer });
                
                // Basic XSS protection
                html = this.sanitizeHtml(html);
                
                return html;
            } else {
                // Fallback to basic markdown conversion
                return this.basicMarkdownToHtml(processedText);
            }
        } catch (error) {
            this.log('Error rendering markdown:', error);
            return this.basicMarkdownToHtml(text);
        }
    }
    
    preprocessMetrics(text) {
        if (!text) return '';
        
        // Process line by line to preserve markdown headers
        const lines = text.split('\n');
        const processedLines = lines.map(line => {
            const trimmedLine = line.trim();
            
            // Check for markdown headers
            const headerMatch = trimmedLine.match(/^(#{1,6})\s*(.+)$/);
            
            if (headerMatch) {
                // This is a header line - preserve it
                const hashes = headerMatch[1];
                const headerText = headerMatch[2];
                const leadingWhitespace = line.match(/^(\s*)/)[1];
                return `${leadingWhitespace}${hashes} ${headerText}`;
            } else {
                // For non-header lines, apply metric formatting
                return line
                    .replace(/CPE of _(\d+(?:\.\d+)?)_/gi, 'CPE of **$$$1**')
                    .replace(/CPL of _(\d+(?:\.\d+)?)_/gi, 'CPL of **$$$1**')
                    .replace(/CPC of _(\d+(?:\.\d+)?)_/gi, 'CPC of **$$$1**')
                    .replace(/CPM of _(\d+(?:\.\d+)?)_/gi, 'CPM of **$$$1**')
                    .replace(/CPA of _(\d+(?:\.\d+)?)_/gi, 'CPA of **$$$1**')
                    .replace(/Conversion Rate of _(\d+(?:\.\d+)?)_/gi, (match, rate) => {
                        const percentage = (parseFloat(rate) * 100).toFixed(1);
                        return `Conversion Rate of **${percentage}%**`;
                    })
                    .replace(/CTR of _(\d+(?:\.\d+)?)_/gi, (match, rate) => {
                        const percentage = (parseFloat(rate) * 100).toFixed(2);
                        return `CTR of **${percentage}%**`;
                    })
                    .replace(/(\w+\s+Rate) of _(\d+(?:\.\d+)?)_/gi, (match, rateType, rate) => {
                        const percentage = (parseFloat(rate) * 100).toFixed(1);
                        return `${rateType} of **${percentage}%**`;
                    })
                    .replace(/_(\d+(?:\.\d+)?)_/g, '**$1**')
                    .replace(/_\$(\d+(?:\.\d+)?)_/g, '**$$$1**')
                    .replace(/_(\d+(?:\.\d+)?)%_/g, '**$1%**');
            }
        });
        
        return processedLines.join('\n');
    }
    
    sanitizeHtml(html) {
        return html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
            .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
            .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
            .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
            .replace(/javascript:/gi, '');
    }
    
    basicMarkdownToHtml(text) {
        let html = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/`(.+?)`/g, '<code>$1</code>')
            .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
        
        return html;
    }
    
    formatTime(timestamp) {
        const now = new Date();
        const messageTime = new Date(timestamp);
        const diffMinutes = Math.floor((now - messageTime) / 60000);
        
        if (diffMinutes < 1) {
            return 'Just now';
        } else if (diffMinutes < 60) {
            return `${diffMinutes}m ago`;
        } else if (diffMinutes < 1440) {
            const hours = Math.floor(diffMinutes / 60);
            return `${hours}h ago`;
        } else {
            return messageTime.toLocaleDateString();
        }
    }
    
    showTypingIndicator() {
        if (!AgentforceConfig.features.enableTypingIndicator) return;
        
        this.isTyping = true;
        this.elements.typingIndicator.style.display = 'flex';
        this.elements.sendBtn.disabled = true;
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.isTyping = false;
        this.elements.typingIndicator.style.display = 'none';
        
        const hasContent = this.elements.input.value.trim().length > 0;
        this.elements.sendBtn.disabled = !hasContent;
    }
    
    setInputDisabled(disabled) {
        this.elements.input.disabled = disabled;
        if (!disabled) {
            const hasContent = this.elements.input.value.trim().length > 0;
            this.elements.sendBtn.disabled = !hasContent || this.isTyping;
        } else {
            this.elements.sendBtn.disabled = true;
        }
    }
    
    scrollToBottom() {
        this.elements.chatConversation.scrollTop = this.elements.chatConversation.scrollHeight;
    }
    
    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        
        if (this.isMinimized) {
            this.elements.widget.classList.add('minimized');
        } else {
            this.elements.widget.classList.remove('minimized');
        }
        
        // Notify parent frame of state change
        this.notifyParent('WIDGET_STATE_CHANGED', {
            minimized: this.isMinimized
        });
    }
    
    showError(title, message) {
        this.elements.errorMessage.textContent = message;
        this.elements.errorModal.style.display = 'flex';
        console.error(`${title}: ${message}`);
    }
    
    hideError() {
        this.elements.errorModal.style.display = 'none';
    }
    
    handleError(context, error) {
        const errorMessage = error?.message || error || 'An unexpected error occurred';
        this.showError('Error', `${context}: ${errorMessage}`);
        
        if (context.includes('send') || context.includes('response')) {
            this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }
    }
    
    handleParentMessage(event) {
        if (event.data.type === 'MCI_CONFIG_UPDATE') {
            this.handleConfigUpdate(event.data.config);
        } else if (event.data.type === 'MCI_THEME_CHANGE') {
            this.handleThemeChange(event.data.theme);
        }
    }
    
    handleConfigUpdate(newConfig) {
        Object.assign(AgentforceConfig, newConfig);
        this.applyTheme();
    }
    
    handleThemeChange(theme) {
        Object.assign(AgentforceConfig.theme, theme);
        this.applyTheme();
    }
    
    handleVisibilityHidden() {
        if (this.isTyping) {
            this.hideTypingIndicator();
        }
    }
    
    handleVisibilityVisible() {
        if (!this.isMinimized && !document.hidden) {
            this.elements.input.focus();
        }
    }
    
    notifyParent(type, data = {}) {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                type: type,
                source: 'agentforce-chat-widget',
                data: data
            }, '*');
        }
    }
    
    log(...args) {
        if (AgentforceConfig.debug) {
            console.log('[ChatWidget]', ...args);
        }
    }
}

// Initialize chat widget when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.chatWidget = new ChatWidget();
});

