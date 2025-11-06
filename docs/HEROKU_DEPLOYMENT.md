# Heroku Deployment Guide

Comprehensive guide to deploying the Agentforce Chat Widget on Heroku.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Deployment Methods](#deployment-methods)
- [One-Click Deploy](#one-click-deploy)
- [Manual Deployment](#manual-deployment)
- [GitHub Integration](#github-integration)
- [Environment Configuration](#environment-configuration)
- [Domain Setup](#domain-setup)
- [SSL Configuration](#ssl-configuration)
- [Monitoring & Logs](#monitoring--logs)
- [Scaling](#scaling)
- [Cost Optimization](#cost-optimization)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required

- [x] Heroku account (free or paid)
- [x] Salesforce Connected App configured
- [x] Agentforce Agent ID
- [x] Git installed locally

### For Manual Deployment

- [x] [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
- [x] Repository cloned locally

## Deployment Methods

Choose the method that best fits your workflow:

| Method | Best For | Time | Skill Level |
|--------|----------|------|-------------|
| One-Click Deploy | Quick testing | 5 min | Beginner |
| Manual Deploy | Full control | 10 min | Intermediate |
| GitHub Integration | CI/CD workflow | 15 min | Advanced |

## One-Click Deploy

### Step 1: Click the Deploy Button

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Step 2: Configure App

1. **App name**: Choose a unique name (e.g., `my-agentforce-chat`)
   - This will be your URL: `https://my-agentforce-chat.herokuapp.com`
   - Must be unique across all of Heroku
   - Use lowercase, numbers, and hyphens only

2. **Choose a region**: Select closest to your users
   - United States
   - Europe

3. **Config Variables**: Fill in your Salesforce details

   ```
   SALESFORCE_INSTANCE_URL=https://your-org.my.salesforce.com
   SALESFORCE_CLIENT_ID=3MVG9HB6vm3GZZR...
   SALESFORCE_CLIENT_SECRET=98AE11D8A49E61...
   SALESFORCE_AGENT_ID=0XxHs000000r72tKAA
   ```

### Step 3: Deploy

4. Click **Deploy app**
5. Wait 2-3 minutes for build to complete
6. Click **View** to see your deployed widget

### Step 4: Update Salesforce Callback

7. Update your Connected App callback URL to:
   ```
   https://your-app-name.herokuapp.com/oauth-callback.html
   ```

## Manual Deployment

### Step 1: Install Heroku CLI

```bash
# macOS (using Homebrew)
brew tap heroku/brew && brew install heroku

# Windows (using installer)
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Ubuntu
curl https://cli-assets.heroku.com/install-ubuntu.sh | sh
```

Verify installation:
```bash
heroku --version
```

### Step 2: Login to Heroku

```bash
heroku login
```

This opens a browser for authentication.

### Step 3: Clone Repository

```bash
git clone https://github.com/your-org/mci-agentforce-chat-widget.git
cd mci-agentforce-chat-widget
```

### Step 4: Create Heroku App

```bash
# Create app
heroku create your-app-name

# Or let Heroku generate a name
heroku create

# Specify region (optional)
heroku create your-app-name --region eu
```

### Step 5: Set Environment Variables

```bash
# Set required variables
heroku config:set SALESFORCE_INSTANCE_URL=https://your-org.my.salesforce.com
heroku config:set SALESFORCE_CLIENT_ID=your_client_id
heroku config:set SALESFORCE_CLIENT_SECRET=your_client_secret
heroku config:set SALESFORCE_AGENT_ID=your_agent_id

# Set optional variables
heroku config:set NODE_ENV=production
heroku config:set SALESFORCE_API_VERSION=v61.0
heroku config:set CHAT_PRIMARY_COLOR="rgb(5, 19, 75)"
heroku config:set CHAT_HEADER_TITLE="Insights Powered by"
heroku config:set CHAT_WELCOME_MESSAGE="Hello! How can I help you today?"
```

### Step 6: Deploy Application

```bash
# Deploy to Heroku
git push heroku main

# Or if you're on a different branch
git push heroku your-branch:main
```

### Step 7: Scale Dynos

```bash
# Ensure at least one web dyno is running
heroku ps:scale web=1
```

### Step 8: Open Application

```bash
# Open in browser
heroku open

# Or visit manually
open https://your-app-name.herokuapp.com
```

## GitHub Integration

### Step 1: Connect GitHub Repository

1. Go to [Heroku Dashboard](https://dashboard.heroku.com/)
2. Click your app
3. Go to **Deploy** tab
4. Under **Deployment method**, click **GitHub**
5. Click **Connect to GitHub**
6. Search for your repository
7. Click **Connect**

### Step 2: Enable Automatic Deploys

1. Scroll to **Automatic deploys**
2. Select branch: `main`
3. ☑️ Check **Wait for CI to pass** (if you have CI configured)
4. Click **Enable Automatic Deploys**

### Step 3: Manual Deploy (Optional)

You can also manually deploy from GitHub:

1. Scroll to **Manual deploy**
2. Select branch
3. Click **Deploy Branch**

### Step 4: Configure Deploy Hooks (Optional)

```bash
# Add webhook for notifications
heroku addons:create deployhooks:http --url=https://your-webhook-url.com
```

## Environment Configuration

### View Current Configuration

```bash
# View all config variables
heroku config

# View specific variable
heroku config:get SALESFORCE_INSTANCE_URL
```

### Update Configuration

```bash
# Set single variable
heroku config:set VARIABLE_NAME=value

# Set multiple variables
heroku config:set VAR1=value1 VAR2=value2

# Set from file (create .env first)
heroku config:push

# Remove variable
heroku config:unset VARIABLE_NAME
```

### Required Variables

```bash
SALESFORCE_INSTANCE_URL    # Your Salesforce org URL
SALESFORCE_CLIENT_ID       # Connected App Client ID
SALESFORCE_CLIENT_SECRET   # Connected App Client Secret
SALESFORCE_AGENT_ID        # Agentforce Agent ID
```

### Optional Variables

```bash
SALESFORCE_API_VERSION     # Default: v61.0
NODE_ENV                   # Default: production
CHAT_PRIMARY_COLOR         # Widget color theme
CHAT_HEADER_TITLE          # Header text
CHAT_WELCOME_MESSAGE       # Welcome message
DEBUG_MODE                 # Enable/disable debug logs
```

## Domain Setup

### Step 1: Add Custom Domain

```bash
# Add domain
heroku domains:add chat.yourdomain.com

# Get DNS target
heroku domains
```

Output will show:
```
=== your-app-name Heroku Domain
your-app-name.herokuapp.com

=== your-app-name Custom Domains
Domain Name              DNS Target
chat.yourdomain.com     abc123.herokudns.com
```

### Step 2: Configure DNS

In your DNS provider (e.g., GoDaddy, Cloudflare):

1. Create CNAME record:
   - **Name**: `chat`
   - **Value**: `abc123.herokudns.com` (from above)
   - **TTL**: 3600

2. Save and wait for DNS propagation (5-30 minutes)

### Step 3: Verify Domain

```bash
# Check domain status
heroku domains:wait chat.yourdomain.com
```

### Step 4: Update Salesforce

Update your Connected App callback URL:
```
https://chat.yourdomain.com/oauth-callback.html
```

## SSL Configuration

Heroku provides automatic SSL for all apps.

### Verify SSL

```bash
# Check SSL certificate
heroku certs

# For automatic SSL
heroku certs:auto
```

### Enable Automatic SSL (Default)

```bash
heroku certs:auto:enable
```

### Custom SSL Certificate (Optional)

For custom certificates:

```bash
# Add custom cert
heroku certs:add server.crt server.key

# Update cert
heroku certs:update server.crt server.key

# View cert info
heroku certs:info
```

## Monitoring & Logs

### View Logs

```bash
# Tail logs (live)
heroku logs --tail

# View recent logs
heroku logs -n 1500

# Filter by source
heroku logs --source app

# Filter by dyno
heroku logs --dyno web.1
```

### Application Metrics

```bash
# View running dynos
heroku ps

# View detailed app info
heroku info

# Check app status
heroku status
```

### Health Check

```bash
# Test health endpoint
curl https://your-app-name.herokuapp.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 1234.56,
  "environment": "production"
}
```

### Add-ons for Monitoring

```bash
# Papertrail (log management)
heroku addons:create papertrail:choklad

# New Relic (APM)
heroku addons:create newrelic:wayne

# Sentry (error tracking)
heroku addons:create sentry:f1
```

## Scaling

### View Current Dynos

```bash
heroku ps
```

### Scale Dynos

```bash
# Scale web dynos
heroku ps:scale web=1

# Scale multiple dynos
heroku ps:scale web=2 worker=1
```

### Change Dyno Type

```bash
# Upgrade to standard
heroku ps:type web=standard-1x

# Use eco (cheapest)
heroku ps:type web=eco

# Available types: eco, basic, standard-1x, standard-2x, performance-m, performance-l
```

### Restart Application

```bash
# Restart all dynos
heroku restart

# Restart specific dyno type
heroku restart web

# Restart specific dyno
heroku restart web.1
```

## Cost Optimization

### Dyno Types & Pricing

| Type | Price | RAM | Best For |
|------|-------|-----|----------|
| Eco | $5/mo | 512MB | Development, low traffic |
| Basic | $7/mo | 512MB | Production, low traffic |
| Standard-1X | $25/mo | 512MB | Production, medium traffic |
| Standard-2X | $50/mo | 1GB | Production, high traffic |

### Optimization Tips

1. **Use Eco Dynos** for development:
   ```bash
   heroku ps:type web=eco
   ```

2. **Scale down when not in use**:
   ```bash
   heroku ps:scale web=0  # Stop
   heroku ps:scale web=1  # Start
   ```

3. **Use free add-ons** when possible:
   - Papertrail: Free up to 50MB/month
   - Sentry: Free up to 5,000 events/month

4. **Monitor API usage** to avoid Salesforce limits

### View Current Costs

Check your [Heroku billing page](https://dashboard.heroku.com/account/billing)

## Troubleshooting

### Application Crashes on Startup

**Check logs**:
```bash
heroku logs --tail
```

**Common causes**:
- Missing environment variables
- Invalid Salesforce credentials
- Node.js version mismatch

**Solution**:
```bash
# Verify all config vars are set
heroku config

# Check Node.js version
heroku run node --version

# Restart app
heroku restart
```

### OAuth Authentication Fails

**Check**:
1. Callback URL matches Heroku URL exactly
2. Connected App is approved
3. Client credentials are correct

**Solution**:
```bash
# Verify config
heroku config:get SALESFORCE_CLIENT_ID
heroku config:get SALESFORCE_CLIENT_SECRET

# Update callback URL in Salesforce
# Update config if needed
heroku config:set SALESFORCE_CLIENT_ID=new_value
```

### App is Slow

**Check dyno metrics**:
```bash
heroku ps
heroku logs --tail
```

**Solutions**:
- Upgrade dyno type
- Enable compression (already included)
- Scale to multiple dynos

### Database/Add-on Issues

```bash
# Check add-on status
heroku addons

# View add-on info
heroku addons:info addon-name

# Restart add-on
heroku addons:restart addon-name
```

### DNS/Domain Issues

```bash
# Check domain configuration
heroku domains

# Wait for domain
heroku domains:wait your-domain.com

# Remove and re-add domain
heroku domains:remove your-domain.com
heroku domains:add your-domain.com
```

## Best Practices

### Security

✅ **DO**:
- Use environment variables for secrets
- Enable automatic SSL
- Review access logs regularly
- Keep dependencies updated

❌ **DON'T**:
- Commit secrets to Git
- Disable SSL
- Use weak Salesforce passwords
- Expose debug mode in production

### Performance

✅ **DO**:
- Use appropriate dyno size
- Monitor response times
- Enable compression
- Cache static assets

### Deployment

✅ **DO**:
- Use Git tags for releases
- Test in staging before production
- Keep deployment logs
- Document configuration changes

## Additional Commands

### Backup & Recovery

```bash
# Create backup (manual snapshot)
heroku ps:stop
# (No built-in backup for Heroku apps, use Git)

# Restore from Git
git push heroku main --force
```

### Shell Access

```bash
# Open bash shell
heroku run bash

# Run one-off commands
heroku run node --version
heroku run npm list

# Check environment
heroku run printenv
```

### Database Management (if using Postgres)

```bash
# Access database
heroku pg:psql

# View database info
heroku pg:info

# Run migrations
heroku run npm run migrate
```

## Resources

- [Heroku Documentation](https://devcenter.heroku.com/)
- [Node.js on Heroku](https://devcenter.heroku.com/articles/nodejs-support)
- [Heroku CLI Reference](https://devcenter.heroku.com/articles/heroku-cli-commands)
- [Heroku Status](https://status.heroku.com/)

## Support

- 📖 Main README: [README.md](../README.md)
- 🔧 Salesforce Setup: [SALESFORCE_SETUP.md](./SALESFORCE_SETUP.md)
- 🐛 Troubleshooting: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- 💬 GitHub Issues: [Open an issue](https://github.com/your-org/mci-agentforce-chat-widget/issues)

---

**Next Steps**: After deployment, see [MCI_EMBEDDING.md](./MCI_EMBEDDING.md) to embed in your dashboard.

