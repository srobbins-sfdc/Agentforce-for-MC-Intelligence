# MCI Agentforce Chat Widget

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

An embeddable chat interface for Salesforce Agentforce agents, designed specifically for Marketing Cloud Intelligence (MCI) dashboards.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Embedding in MCI](#embedding-in-mci)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This project provides a production-ready, embeddable chat widget that connects to Salesforce Agentforce via the Agent API. It's designed to be easily deployed to Heroku and embedded in Marketing Cloud Intelligence dashboards, enabling AI-powered conversations within your analytics environment.

## ✨ Features

- **🔐 Secure Authentication**: OAuth 2.0 client credentials flow with automatic token management
- **🤖 Agentforce Integration**: Direct connection to Salesforce Agentforce Agent API
- **🎨 Customizable UI**: Theme colors, messages, and branding via environment variables
- **📱 Responsive Design**: Works across desktop, tablet, and mobile devices
- **🚀 Easy Deployment**: One-click Heroku deployment with environment-based configuration
- **🔄 Real-time Chat**: Live messaging with typing indicators and markdown support
- **📊 Analytics Ready**: Built-in event tracking for MCI analytics
- **🛡️ Security First**: Helmet.js security headers, CORS configuration, XSS protection
- **♿ Accessible**: WCAG compliant with keyboard navigation and screen reader support
- **🎯 Iframe Embeddable**: Optimized for embedding in MCI dashboards

## 📦 Prerequisites

Before deploying this application, you need:

### Salesforce Setup

1. **Salesforce Org** with Agentforce enabled
2. **Connected App** configured with:
   - OAuth enabled
   - Client credentials flow enabled
   - API access
   - Callback URL configured
3. **Agentforce Agent** created and published
4. **Agent ID** from your Agentforce configuration

### Development Environment

- Node.js 18.x or higher
- npm 9.x or higher
- Git
- Heroku CLI (for deployment)

### Heroku Account

- Free or paid Heroku account
- Credit card on file (even for Eco dynos)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/srobbins-sfdc/Agentforce-for-MC-Intelligence.git
cd Agentforce-for-MC-Intelligence
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Salesforce Configuration
SALESFORCE_INSTANCE_URL=https://your-org.my.salesforce.com
SALESFORCE_CLIENT_ID=your_client_id_here
SALESFORCE_CLIENT_SECRET=your_client_secret_here
SALESFORCE_AGENT_ID=your_agent_id_here

# Application Configuration
NODE_ENV=development
PORT=3000

# Optional Customization
CHAT_PRIMARY_COLOR=rgb(5, 19, 75)
CHAT_HEADER_TITLE=Insights Powered by
CHAT_WELCOME_MESSAGE=Hello! I'm your Agentforce assistant. How can I help you today?
DEBUG_MODE=true
```

### 4. Run Locally

```bash
npm start
```

Visit `http://localhost:3000` to see the chat widget.

### 5. Deploy to Heroku

See [HEROKU_DEPLOYMENT.md](./docs/HEROKU_DEPLOYMENT.md) for detailed deployment instructions.

Quick deploy:

```bash
heroku create your-app-name
heroku config:set SALESFORCE_INSTANCE_URL=https://your-org.my.salesforce.com
heroku config:set SALESFORCE_CLIENT_ID=your_client_id
heroku config:set SALESFORCE_CLIENT_SECRET=your_client_secret
heroku config:set SALESFORCE_AGENT_ID=your_agent_id
git push heroku main
```

## 📚 Documentation

Comprehensive guides are available in the `docs` folder:

- **[QUICKSTART.md](./docs/QUICKSTART.md)** - Get up and running in 15 minutes
- **[SALESFORCE_SETUP.md](./docs/SALESFORCE_SETUP.md)** - Complete Salesforce configuration guide
- **[HEROKU_DEPLOYMENT.md](./docs/HEROKU_DEPLOYMENT.md)** - Detailed Heroku deployment instructions
- **[CUSTOMIZATION.md](./docs/CUSTOMIZATION.md)** - Customize colors, themes, and behavior
- **[MCI_EMBEDDING.md](./docs/MCI_EMBEDDING.md)** - Embed the widget in MCI dashboards
- **[TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)** - Common issues and solutions

## ⚙️ Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SALESFORCE_INSTANCE_URL` | Your Salesforce org URL | `https://yourorg.my.salesforce.com` |
| `SALESFORCE_CLIENT_ID` | Connected App Client ID | `3MVG9HB6vm3GZZR...` |
| `SALESFORCE_CLIENT_SECRET` | Connected App Client Secret | `98AE11D8A49E61...` |
| `SALESFORCE_AGENT_ID` | Agentforce Agent ID | `0XxHs000000r72tKAA` |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SALESFORCE_API_VERSION` | Salesforce API version | `v61.0` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3000` |
| `CHAT_PRIMARY_COLOR` | Widget primary color | `rgb(5, 19, 75)` |
| `CHAT_HEADER_TITLE` | Header title text | `Insights Powered by` |
| `CHAT_WELCOME_MESSAGE` | Welcome message | `Hello! I'm your...` |
| `DEBUG_MODE` | Enable debug logging | `false` |

## 🚀 Deployment

### Deploy to Heroku (Recommended)

#### One-Click Deploy

Click the button below to deploy directly to Heroku:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

#### Manual Heroku Deployment

```bash
# Login to Heroku
heroku login

# Create new Heroku app
heroku create your-agentforce-chat

# Set environment variables
heroku config:set SALESFORCE_INSTANCE_URL=https://your-org.my.salesforce.com
heroku config:set SALESFORCE_CLIENT_ID=your_client_id
heroku config:set SALESFORCE_CLIENT_SECRET=your_client_secret
heroku config:set SALESFORCE_AGENT_ID=your_agent_id

# Deploy
git push heroku main

# Open app
heroku open
```

### Deploy to Other Platforms

This application can run on any platform that supports Node.js:

- **AWS Elastic Beanstalk**
- **Google Cloud Run**
- **Azure App Service**
- **DigitalOcean App Platform**
- **Railway**
- **Render**

Set the environment variables according to your platform's documentation.

## 📊 Embedding in MCI

To embed the chat widget in your Marketing Cloud Intelligence dashboard:

```html
<iframe 
    src="https://your-app-name.herokuapp.com"
    width="400"
    height="600"
    frameborder="0"
    style="border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.15);"
    title="Agentforce Chat Assistant">
</iframe>
```

For detailed embedding instructions, see [MCI_EMBEDDING.md](./docs/MCI_EMBEDDING.md).

## 🎨 Customization

### Theme Colors

Customize the widget's appearance using environment variables:

```bash
heroku config:set CHAT_PRIMARY_COLOR="rgb(0, 112, 210)"
heroku config:set CHAT_HEADER_TITLE="Analytics Assistant"
heroku config:set CHAT_WELCOME_MESSAGE="Welcome! How can I help with your analytics today?"
```

### Advanced Customization

For more advanced customization options, see [CUSTOMIZATION.md](./docs/CUSTOMIZATION.md).

## 🔧 Troubleshooting

### Common Issues

**Authentication Fails**
- Verify your Connected App credentials
- Check that client credentials flow is enabled
- Ensure the Connected App is approved

**Agent Not Responding**
- Verify Agent ID is correct
- Check that the agent is published and active
- Review Salesforce API limits

**Widget Not Loading in MCI**
- Check CORS configuration
- Verify iframe embedding is allowed
- Inspect browser console for errors

For more troubleshooting help, see [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md).

## 🏗️ Project Structure

```
mci-agentforce-chat-widget/
├── server.js                 # Express server
├── package.json              # Dependencies and scripts
├── Procfile                  # Heroku configuration
├── app.json                  # Heroku app manifest
├── .gitignore               # Git ignore rules
├── public/                   # Static files
│   ├── index.html           # Main widget HTML
│   ├── oauth-callback.html  # OAuth callback handler
│   ├── styles.css           # Widget styles
│   ├── config.js            # Dynamic configuration
│   ├── agentforce-api.js    # Salesforce API client
│   └── chat-widget.js       # Chat widget logic
├── docs/                     # Documentation
│   ├── QUICKSTART.md
│   ├── SALESFORCE_SETUP.md
│   ├── HEROKU_DEPLOYMENT.md
│   ├── CUSTOMIZATION.md
│   ├── MCI_EMBEDDING.md
│   └── TROUBLESHOOTING.md
└── README.md                 # This file
```

## 🔒 Security

This application implements several security measures:

- **OAuth 2.0** with client credentials flow
- **Helmet.js** for security headers
- **CORS** configured for iframe embedding
- **XSS protection** in markdown rendering
- **Environment-based secrets** (never in code)
- **Session storage** for tokens (not localStorage)
- **HTTPS required** for production

## 🧪 Testing

Run the application locally for testing:

```bash
# Start development server
npm run dev

# Access the widget
open http://localhost:3000

# Check health endpoint
curl http://localhost:3000/health
```

## 📈 Monitoring

### Health Check

The application exposes a health check endpoint:

```bash
GET /health
```

Returns:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 1234.56,
  "environment": "production"
}
```

### Heroku Logs

View application logs:

```bash
heroku logs --tail
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Express.js](https://expressjs.com/)
- Styled with [Salesforce Lightning Design System](https://www.lightningdesignsystem.com/)
- Markdown rendering by [Marked.js](https://marked.js.org/)
- Security by [Helmet.js](https://helmetjs.github.io/)

## 📞 Support

For issues and questions:

- 📖 Check the [documentation](./docs/)
- 🐛 [Open an issue](https://github.com/your-org/mci-agentforce-chat-widget/issues)
- 💬 Contact your Salesforce administrator
- 📧 Email: support@your-org.com

## 🗺️ Roadmap

- [ ] Add support for file attachments
- [ ] Implement conversation history
- [ ] Add multi-language support
- [ ] Create admin dashboard
- [ ] Add analytics dashboard

---

**Made with ❤️ for Marketing Cloud Intelligence**

