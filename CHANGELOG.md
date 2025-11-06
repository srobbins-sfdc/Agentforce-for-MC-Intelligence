# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-01

### Added
- Initial release of MCI Agentforce Chat Widget
- OAuth 2.0 authentication with client credentials flow
- Real-time chat interface with Salesforce Agentforce
- Markdown rendering for agent responses
- Environment-based configuration system
- Responsive design for mobile, tablet, and desktop
- Heroku deployment support with one-click deploy
- Comprehensive documentation:
  - README.md with project overview
  - QUICKSTART.md for rapid deployment
  - SALESFORCE_SETUP.md for Salesforce configuration
  - HEROKU_DEPLOYMENT.md for deployment guide
- Security features:
  - Helmet.js security headers
  - CORS configuration for iframe embedding
  - XSS protection
  - Environment-based secrets management
- UI customization via environment variables:
  - Primary color theming
  - Header title customization
  - Welcome message customization
- Analytics event tracking for MCI integration
- Health check endpoint for monitoring
- Error handling with user-friendly error messages
- Typing indicators and message timestamps
- Auto-resizing message input
- Session management with automatic cleanup

### Features
- **Chat Interface**: Full-featured chat UI with message history
- **Agentforce Integration**: Direct connection to Salesforce Agent API
- **OAuth Security**: Secure authentication flow with token management
- **Markdown Support**: Rich text formatting in agent responses
- **Theme Customization**: Configurable colors and branding
- **Mobile Responsive**: Optimized for all screen sizes
- **MCI Embeddable**: Designed for iframe embedding in dashboards
- **Real-time Updates**: Live message exchange with typing indicators
- **Error Recovery**: Graceful error handling with retry mechanisms
- **Debug Mode**: Optional debug logging for troubleshooting

### Documentation
- Complete setup guides for Salesforce and Heroku
- Quick start guide for 15-minute deployment
- Environment variable reference
- Troubleshooting guide
- Contributing guidelines
- MIT License

### Technical
- Node.js 18.x+ support
- Express.js server
- Compression and caching
- Static file serving
- Health check endpoint
- CORS middleware
- Security headers via Helmet.js
- Environment validation on startup

## [Unreleased]

### Planned Features
- [ ] File attachment support
- [ ] Conversation history persistence
- [ ] Multi-language support
- [ ] Admin dashboard
- [ ] Analytics dashboard
- [ ] Automated testing suite
- [ ] Docker support
- [ ] Custom domain SSL automation

### Known Issues
- None at this time

---

## Version History

- **1.0.0** - Initial release

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this changelog.

## Format

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security vulnerability fixes

