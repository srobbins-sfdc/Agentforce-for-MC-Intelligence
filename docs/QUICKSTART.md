# Quick Start Guide

Get your Agentforce Chat Widget up and running in 15 minutes.

## Overview

This guide walks you through the fastest path to deploying your chat widget. For detailed explanations, see the full documentation.

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] Salesforce org with Agentforce enabled
- [ ] Heroku account (free tier works)
- [ ] Git installed locally
- [ ] 15 minutes of time

## Step 1: Salesforce Setup (5 minutes)

### 1.1 Create Connected App

1. Log into Salesforce
2. Go to **Setup** → **App Manager**
3. Click **New Connected App**
4. Fill in:
   - **Connected App Name**: `Agentforce Chat Widget`
   - **API Name**: `Agentforce_Chat_Widget`
   - **Contact Email**: Your email
5. Enable OAuth Settings:
   - ✅ **Enable OAuth Settings**
   - **Callback URL**: `https://your-app-name.herokuapp.com/oauth-callback.html`
   - **Selected OAuth Scopes**:
     - ✅ Access and manage your data (api)
     - ✅ Perform requests on your behalf at any time (refresh_token, offline_access)
6. Enable Client Credentials Flow:
   - ✅ **Enable Client Credentials Flow**
   - **Run As**: Select a user (usually yourself)
7. Click **Save**
8. Click **Continue**
9. **Save these values** (you'll need them later):
   - **Consumer Key** (this is your Client ID)
   - **Consumer Secret** (click to reveal)

### 1.2 Get Your Agent ID

1. Go to **Setup** → **Einstein** → **Agents**
2. Click on your agent
3. Copy the **Agent ID** from the URL:
   - URL format: `.../lightning/setup/AgentBuilder/page?address=/0Xx...`
   - Agent ID starts with `0Xx`

## Step 2: Deploy to Heroku (5 minutes)

### Option A: One-Click Deploy (Easiest)

1. Click this button:

   [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

2. Fill in the form:
   - **App Name**: Choose a unique name (e.g., `my-agentforce-chat`)
   - **SALESFORCE_INSTANCE_URL**: Your Salesforce URL (e.g., `https://yourorg.my.salesforce.com`)
   - **SALESFORCE_CLIENT_ID**: Paste Consumer Key from Step 1.1
   - **SALESFORCE_CLIENT_SECRET**: Paste Consumer Secret from Step 1.1
   - **SALESFORCE_AGENT_ID**: Paste Agent ID from Step 1.2

3. Click **Deploy app**

4. Wait 2-3 minutes for deployment

5. Click **View** to see your widget

### Option B: Manual Deploy

```bash
# 1. Clone the repo
git clone https://github.com/your-org/mci-agentforce-chat-widget.git
cd mci-agentforce-chat-widget

# 2. Login to Heroku
heroku login

# 3. Create app
heroku create your-app-name

# 4. Set environment variables
heroku config:set SALESFORCE_INSTANCE_URL=https://your-org.my.salesforce.com
heroku config:set SALESFORCE_CLIENT_ID=your_consumer_key
heroku config:set SALESFORCE_CLIENT_SECRET=your_consumer_secret
heroku config:set SALESFORCE_AGENT_ID=your_agent_id

# 5. Deploy
git push heroku main

# 6. Open
heroku open
```

## Step 3: Update Salesforce Callback URL (2 minutes)

Now that you know your Heroku app URL, update the Connected App:

1. Go back to **Setup** → **App Manager**
2. Find your Connected App → **Manage**
3. Click **Edit Policies**
4. Update **Callback URL** to: `https://your-app-name.herokuapp.com/oauth-callback.html`
5. Click **Save**

## Step 4: Test the Widget (2 minutes)

1. Visit your Heroku app URL: `https://your-app-name.herokuapp.com`
2. You should see:
   - ✅ "Authenticating..." message
   - ✅ Then "Creating session..."
   - ✅ Then the welcome message
3. Type a message and press Enter
4. You should receive a response from your Agentforce agent

### Troubleshooting Quick Checks

If something doesn't work:

**Problem: "Authentication failed"**
- ✅ Check Connected App credentials are correct
- ✅ Verify client credentials flow is enabled
- ✅ Wait 2-10 minutes for Salesforce to propagate changes

**Problem: "Session creation failed"**
- ✅ Check Agent ID is correct
- ✅ Verify agent is published and active
- ✅ Check agent permissions

**Problem: Widget doesn't load**
- ✅ Check Heroku logs: `heroku logs --tail`
- ✅ Verify all environment variables are set
- ✅ Check browser console for errors

## Step 5: Embed in MCI Dashboard (1 minute)

Once the widget is working, embed it in your MCI dashboard:

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

## Next Steps

Now that your widget is running:

1. **Customize the appearance**: See [CUSTOMIZATION.md](./CUSTOMIZATION.md)
2. **Configure advanced settings**: See [Salesforce Setup](./SALESFORCE_SETUP.md)
3. **Set up monitoring**: See [HEROKU_DEPLOYMENT.md](./HEROKU_DEPLOYMENT.md)
4. **Share with your team**: See [MCI_EMBEDDING.md](./MCI_EMBEDDING.md)

## Quick Reference

### Environment Variables

```bash
# Required
SALESFORCE_INSTANCE_URL=https://yourorg.my.salesforce.com
SALESFORCE_CLIENT_ID=3MVG9HB6vm3GZZR...
SALESFORCE_CLIENT_SECRET=98AE11D8A49E61...
SALESFORCE_AGENT_ID=0XxHs000000r72tKAA

# Optional
CHAT_PRIMARY_COLOR=rgb(5, 19, 75)
CHAT_HEADER_TITLE=Insights Powered by
CHAT_WELCOME_MESSAGE=Hello! How can I help?
```

### Heroku Commands

```bash
# View logs
heroku logs --tail

# Restart app
heroku restart

# Check status
heroku ps

# Update config
heroku config:set VARIABLE_NAME=value

# Open app
heroku open

# View all config
heroku config
```

### Health Check

```bash
# Check if app is running
curl https://your-app-name.herokuapp.com/health
```

## Support

- 📖 Full documentation: [README.md](../README.md)
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/mci-agentforce-chat-widget/issues)
- 💬 Questions: Contact your Salesforce admin

---

**🎉 Congratulations!** You now have a working Agentforce chat widget deployed and ready to use.

