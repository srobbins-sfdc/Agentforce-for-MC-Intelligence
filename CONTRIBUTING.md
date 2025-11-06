# Contributing to MCI Agentforce Chat Widget

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git
- Salesforce org with Agentforce (for testing)
- Heroku account (for deployment testing)

### Local Development Setup

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/your-username/mci-agentforce-chat-widget.git
   cd mci-agentforce-chat-widget
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp ENV_TEMPLATE.txt .env
   # Edit .env with your Salesforce credentials
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Test your changes**:
   ```bash
   npm test  # When tests are available
   ```

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior**
- **Actual behavior**
- **Screenshots** if applicable
- **Environment details**:
  - Node.js version
  - Browser and version
  - Salesforce org type
  - Heroku dyno type

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** and motivation
- **Proposed solution** or implementation approach
- **Alternatives considered**

### Pull Requests

1. **Create a branch**:
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make your changes**:
   - Follow the [coding standards](#coding-standards)
   - Update documentation as needed
   - Add tests if applicable

3. **Commit your changes**:
   ```bash
   git commit -m "Add feature: my new feature"
   ```
   Follow [commit message guidelines](#commit-messages)

4. **Push to your fork**:
   ```bash
   git push origin feature/my-new-feature
   ```

5. **Open a Pull Request**:
   - Use a clear title and description
   - Reference related issues
   - Include screenshots for UI changes
   - Ensure CI checks pass

## Coding Standards

### JavaScript Style

- Use ES6+ features
- Use `const` and `let`, avoid `var`
- Use arrow functions where appropriate
- Use template literals for string interpolation
- Add JSDoc comments for functions

Example:
```javascript
/**
 * Sends a message to the Agentforce agent
 * @param {string} message - The message text
 * @param {string} sessionId - Optional session ID
 * @returns {Promise<Object>} The agent response
 */
async sendMessage(message, sessionId = null) {
    // Implementation
}
```

### CSS Style

- Use CSS variables for theming
- Mobile-first responsive design
- Semantic class names
- Group related properties

### HTML

- Semantic HTML5 elements
- Accessible markup (ARIA labels)
- Proper indentation

## Commit Messages

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```
feat(chat): add markdown support for messages

Added marked.js library to render markdown in agent responses.
Includes support for tables, code blocks, and links.

Closes #123
```

```
fix(auth): resolve OAuth token expiration issue

Tokens were not being refreshed properly, causing auth failures
after 2 hours. Now properly handles token refresh.

Fixes #456
```

## Project Structure

Understanding the project structure:

```
mci-agentforce-chat-widget/
├── server.js              # Express server
├── package.json           # Dependencies
├── public/                # Frontend files
│   ├── index.html        # Main page
│   ├── styles.css        # Styles
│   ├── config.js         # Configuration
│   ├── agentforce-api.js # API client
│   └── chat-widget.js    # Widget logic
├── docs/                  # Documentation
└── README.md             # Main readme
```

## Testing Guidelines

### Manual Testing

Before submitting a PR, test:

1. **Authentication flow**:
   - Initial authentication
   - Token refresh
   - Error handling

2. **Chat functionality**:
   - Sending messages
   - Receiving responses
   - Error states

3. **UI/UX**:
   - Responsive design
   - Theme customization
   - Accessibility

4. **Browser compatibility**:
   - Chrome
   - Firefox
   - Safari
   - Edge

### Test Checklist

- [ ] Local development works
- [ ] Heroku deployment works
- [ ] OAuth authentication succeeds
- [ ] Chat messages send and receive
- [ ] Markdown rendering works
- [ ] Responsive design on mobile
- [ ] No console errors
- [ ] Environment variables load correctly

## Documentation

### When to Update Documentation

Update documentation when:

- Adding new features
- Changing configuration options
- Modifying deployment process
- Fixing bugs that affect usage

### Documentation Files

- `README.md`: Main project overview
- `docs/QUICKSTART.md`: Getting started guide
- `docs/SALESFORCE_SETUP.md`: Salesforce configuration
- `docs/HEROKU_DEPLOYMENT.md`: Deployment guide
- Code comments: Inline documentation

## Code Review Process

### For Contributors

1. Ensure your PR:
   - Addresses one concern
   - Includes tests (when applicable)
   - Updates documentation
   - Follows coding standards

2. Respond to review feedback promptly
3. Keep PRs focused and small

### For Reviewers

1. Review for:
   - Code quality
   - Test coverage
   - Documentation
   - Security implications
   - Performance impact

2. Provide constructive feedback
3. Approve when ready

## Security

### Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities.

Instead, email: security@your-org.com

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Security Best Practices

- Never commit credentials
- Use environment variables for secrets
- Validate all user input
- Keep dependencies updated
- Follow OAuth best practices

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes

### Release Checklist

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Test thoroughly
4. Create Git tag
5. Deploy to Heroku
6. Announce release

## Community

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **Pull Requests**: Code contributions
- **Email**: Direct communication

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Assume positive intent

## Recognition

Contributors are recognized in:
- `CONTRIBUTORS.md` file
- Release notes
- Project README

## Questions?

If you have questions:

1. Check existing documentation
2. Search closed issues
3. Open a new issue
4. Email the maintainers

---

Thank you for contributing to MCI Agentforce Chat Widget! 🎉

