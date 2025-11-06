# Project Overview: MCI Agentforce Chat Widget

## Executive Summary

The MCI Agentforce Chat Widget is a production-ready, embeddable chat interface that connects to Salesforce Agentforce agents. It's designed to be easily deployed to Heroku and embedded in Marketing Cloud Intelligence (MCI) dashboards, enabling AI-powered conversations within analytics environments.

## Purpose

This project provides a repeatable solution for deploying Agentforce chat widgets that can be:

1. **Quickly deployed** to Heroku (15 minutes or less)
2. **Easily configured** using environment variables
3. **Safely embedded** in MCI dashboards via iframe
4. **Simply customized** with brand colors and messaging
5. **Securely authenticated** using OAuth 2.0 client credentials

## Key Features

### 🔐 Security
- OAuth 2.0 client credentials flow
- Environment-based secrets management
- Helmet.js security headers
- CORS configuration for iframe embedding
- XSS protection in markdown rendering
- HTTPS required for production

### 🎨 Customization
- Theme colors via environment variables
- Custom header titles and welcome messages
- Responsive design for all screen sizes
- Markdown support for rich text responses

### 🚀 Deployment
- One-click Heroku deployment
- Manual deployment option
- GitHub integration for CI/CD
- Environment validation on startup
- Automatic SSL configuration

### 💬 Chat Features
- Real-time messaging with Agentforce
- Typing indicators
- Message timestamps
- Auto-resizing input
- Session management
- Error handling with retry logic

## Architecture

### Frontend (Client-Side)
- **HTML/CSS/JavaScript**: No build step required
- **Marked.js**: Markdown rendering for rich text
- **Dynamic Configuration**: Loads settings from server

### Backend (Server-Side)
- **Node.js + Express**: Lightweight web server
- **Compression**: Gzip compression for responses
- **Static Serving**: Efficient file delivery
- **API Proxy**: Secure OAuth token management

### Salesforce Integration
- **Agent API**: Direct connection to Agentforce
- **OAuth 2.0**: Client credentials flow
- **Session Management**: Create, manage, and end sessions
- **Message Exchange**: Real-time conversation

### Deployment Platform
- **Heroku**: PaaS hosting with automatic scaling
- **Eco Dynos**: Cost-effective for most use cases
- **Environment Variables**: Secure configuration
- **Health Checks**: Monitoring and uptime

## Project Structure

```
MCI_Agent/
│
├── Core Application Files
│   ├── server.js                  # Express server (main entry point)
│   ├── package.json               # Dependencies and scripts
│   ├── Procfile                   # Heroku process definition
│   └── app.json                   # Heroku deployment manifest
│
├── Frontend (Public Files)
│   └── public/
│       ├── index.html             # Main widget page
│       ├── oauth-callback.html    # OAuth callback handler
│       ├── styles.css             # Widget styling
│       ├── config.js              # Dynamic configuration loader
│       ├── agentforce-api.js      # Salesforce API client
│       └── chat-widget.js         # Widget functionality
│
├── Documentation
│   ├── README.md                  # Main project documentation
│   ├── SETUP_SUMMARY.md           # Quick reference guide
│   ├── DEPLOYMENT_CHECKLIST.md    # Pre-deployment checklist
│   ├── CHANGELOG.md               # Version history
│   ├── CONTRIBUTING.md            # Contribution guidelines
│   └── docs/
│       ├── QUICKSTART.md          # 15-minute setup guide
│       ├── SALESFORCE_SETUP.md    # Salesforce configuration
│       └── HEROKU_DEPLOYMENT.md   # Deployment guide
│
├── Configuration
│   ├── .gitignore                 # Git ignore rules
│   ├── ENV_TEMPLATE.txt           # Environment variable template
│   └── LICENSE                    # MIT License
│
└── CI/CD
    └── .github/
        └── workflows/
            └── validate.yml       # GitHub Actions validation
```

## Technology Stack

### Backend
- **Runtime**: Node.js 18.x+
- **Framework**: Express.js 4.x
- **Security**: Helmet.js 7.x
- **Compression**: compression 1.x

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS variables
- **ES6+ JavaScript**: Modern JavaScript features
- **Marked.js 9.x**: Markdown rendering

### APIs
- **Salesforce OAuth 2.0**: Authentication
- **Einstein AI Agent API**: Chat functionality
- **Salesforce REST API**: Data access

### Platform
- **Heroku**: Deployment platform
- **Git**: Version control
- **GitHub Actions**: CI/CD validation

## Configuration

### Required Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `SALESFORCE_INSTANCE_URL` | Salesforce org URL | `https://yourorg.my.salesforce.com` |
| `SALESFORCE_CLIENT_ID` | Connected App Client ID | `3MVG9HB6vm3GZZR...` |
| `SALESFORCE_CLIENT_SECRET` | Connected App Client Secret | `98AE11D8A49E61...` |
| `SALESFORCE_AGENT_ID` | Agentforce Agent ID | `0XxHs000000r72tKAA` |

### Optional Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `SALESFORCE_API_VERSION` | API version | `v61.0` |
| `NODE_ENV` | Environment mode | `production` |
| `CHAT_PRIMARY_COLOR` | Widget color theme | `rgb(5, 19, 75)` |
| `CHAT_HEADER_TITLE` | Header text | `Insights Powered by` |
| `CHAT_WELCOME_MESSAGE` | Welcome message | Custom message |
| `DEBUG_MODE` | Debug logging | `false` |

## Deployment Methods

### 1. One-Click Deploy (Easiest)
- Click the "Deploy to Heroku" button
- Fill in environment variables
- Wait 2-3 minutes
- Widget is live!

**Time**: ~5 minutes
**Skill Level**: Beginner

### 2. Manual Heroku Deploy
- Clone repository
- Install Heroku CLI
- Create Heroku app
- Set environment variables
- Push code to Heroku

**Time**: ~15 minutes
**Skill Level**: Intermediate

### 3. GitHub Integration (CI/CD)
- Connect GitHub repository
- Enable automatic deploys
- Every push to main deploys automatically

**Time**: ~20 minutes (initial setup)
**Skill Level**: Advanced

## Integration with MCI

### Embedding Code

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

### Analytics Events

The widget fires these events to the parent frame (MCI):

- `agentforce_session_start`: When chat session begins
- `agentforce_message_sent`: When user sends message
- `agentforce_message_received`: When agent responds
- `agentforce_session_end`: When session ends
- `agentforce_error`: When errors occur

## Security Considerations

### What's Protected
✅ Client secrets stored in environment variables
✅ OAuth tokens in session storage (not localStorage)
✅ HTTPS enforced in production
✅ Security headers via Helmet.js
✅ XSS protection in markdown rendering
✅ CORS configured for safe embedding

### What to Avoid
❌ Never commit credentials to Git
❌ Never expose client secret in frontend
❌ Never disable HTTPS in production
❌ Never use weak Salesforce passwords
❌ Never share OAuth tokens

## Monitoring & Maintenance

### Health Checks
- **Endpoint**: `GET /health`
- **Response**: JSON with status, uptime, timestamp

### Logging
```bash
# View real-time logs
heroku logs --tail

# View recent logs
heroku logs -n 1500
```

### Metrics
```bash
# View app status
heroku ps

# View app info
heroku info
```

### Updates
- Keep dependencies updated: `npm update`
- Check for security vulnerabilities: `npm audit`
- Rotate credentials regularly (quarterly recommended)

## Cost Breakdown

### Heroku Hosting

| Dyno Type | Cost | RAM | Best For |
|-----------|------|-----|----------|
| Eco | $5/mo | 512MB | Development/Testing |
| Basic | $7/mo | 512MB | Low traffic production |
| Standard-1X | $25/mo | 512MB | Medium traffic |
| Standard-2X | $50/mo | 1GB | High traffic |

### Salesforce
- Included with Agentforce license
- Monitor API call limits
- Typical usage: ~100-1000 calls/day

### Total Monthly Cost
- **Minimum**: $5/month (Eco dyno)
- **Recommended**: $7/month (Basic dyno for production)

## Performance

### Expected Metrics
- **Page Load**: < 2 seconds
- **Authentication**: < 1 second
- **Message Response**: 1-3 seconds (depends on agent)
- **Concurrent Users**: 10-50 on Basic dyno

### Optimization
- Compression enabled (Gzip)
- Static file caching
- Efficient session management
- Minimal dependencies

## Team Roles

### Who Does What

**Salesforce Admin**
- Creates Connected App
- Configures Agentforce agent
- Manages permissions
- Reviews API usage

**Developer**
- Deploys to Heroku
- Configures environment variables
- Customizes theme
- Monitors logs

**MCI Dashboard Admin**
- Embeds widget in dashboard
- Configures iframe
- Tests user experience
- Collects feedback

**End Users**
- Interact with chat widget
- Ask questions
- Receive AI-powered insights

## Common Use Cases

1. **Marketing Analytics Support**
   - Users ask questions about dashboard data
   - Agent provides insights and explanations

2. **Campaign Performance Queries**
   - "What's my best performing campaign?"
   - Agent analyzes data and responds

3. **Data Dictionary Assistant**
   - "What does this metric mean?"
   - Agent explains terminology

4. **Troubleshooting Helper**
   - "Why is my data not updating?"
   - Agent guides through common issues

## Success Criteria

### Deployment Success
- [ ] Widget loads without errors
- [ ] Authentication succeeds
- [ ] Agent responds to messages
- [ ] Works in MCI iframe
- [ ] No security warnings

### User Experience Success
- [ ] Response time < 3 seconds
- [ ] No crashes during normal use
- [ ] Clear error messages
- [ ] Mobile-friendly
- [ ] Intuitive interface

### Business Success
- [ ] Reduces support tickets
- [ ] Increases user satisfaction
- [ ] Provides instant answers
- [ ] Scales with user growth

## Future Enhancements

### Planned Features
- File attachment support
- Conversation history persistence
- Multi-language support
- Admin dashboard
- Analytics dashboard
- Automated testing suite

### Potential Integrations
- Slack notifications
- Email summaries
- CRM data sync
- Custom knowledge bases

## Support & Resources

### Documentation
- **Main README**: Complete overview
- **Quick Start**: 15-minute setup
- **Salesforce Setup**: Detailed SF configuration
- **Heroku Deployment**: Deployment guide
- **Setup Summary**: Quick reference

### Getting Help
1. Check documentation first
2. Review troubleshooting guide
3. Search closed GitHub issues
4. Open new issue with details
5. Contact project maintainers

### External Resources
- [Salesforce Agentforce Docs](https://help.salesforce.com/s/articleView?id=sf.c360_a_agentforce.htm)
- [Heroku Documentation](https://devcenter.heroku.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

## Version Information

**Current Version**: 1.0.0
**Release Date**: 2024-01-01
**License**: MIT
**Node.js**: 18.x+
**Heroku Stack**: heroku-22

## Contributors

This project is maintained by your organization's team. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on contributing.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Quick Reference Commands

```bash
# Local Development
npm install              # Install dependencies
npm start               # Start server
npm run dev             # Start with auto-reload

# Heroku Deployment
heroku create app-name   # Create app
heroku config:set VAR=value  # Set env var
git push heroku main     # Deploy
heroku open             # Open in browser
heroku logs --tail      # View logs

# Monitoring
heroku ps               # Check status
heroku restart          # Restart app
curl .../health         # Health check

# Updates
npm update              # Update dependencies
npm audit               # Check security
git pull                # Get latest code
```

---

**Last Updated**: 2024-01-01
**Maintained By**: Your Organization
**Contact**: support@your-org.com

