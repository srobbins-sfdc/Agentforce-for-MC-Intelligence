# Setup Summary

**Quick reference guide for setting up the MCI Agentforce Chat Widget**

## 🎯 What You Need

### From Salesforce (5 minutes to gather)

1. **Instance URL**: `https://your-org.my.salesforce.com`
   - Find: Look at your Salesforce URL when logged in

2. **Client ID**: `3MVG9HB6vm3GZZR...`
   - Find: Setup → App Manager → Your Connected App → View → Consumer Key

3. **Client Secret**: `98AE11D8A49E61...`
   - Find: Setup → App Manager → Your Connected App → View → Click to reveal

4. **Agent ID**: `0XxHs000000r72tKAA`
   - Find: Setup → Einstein → Agents → Your Agent → Copy ID from URL

### Accounts You Need

- ✅ Salesforce org with Agentforce enabled
- ✅ Heroku account (free tier works)

## 🚀 Fastest Path to Deployment

### 5-Minute Deploy

1. **Click this button**:
   
   [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

2. **Fill in the 4 required fields** (from "What You Need" above)

3. **Click "Deploy app"**

4. **Wait 2-3 minutes**

5. **Click "View"** to see your widget

6. **Update Salesforce callback URL**:
   - Go to Setup → App Manager → Your Connected App → Manage
   - Update callback URL to: `https://your-app-name.herokuapp.com/oauth-callback.html`

### Done! 🎉

Your widget is now live at: `https://your-app-name.herokuapp.com`

## 📱 Embed in MCI

Copy this HTML into your MCI dashboard:

```html
<iframe 
    src="https://your-app-name.herokuapp.com"
    width="400"
    height="600"
    frameborder="0"
    title="Agentforce Chat Assistant">
</iframe>
```

## 🎨 Customize Colors

```bash
heroku config:set CHAT_PRIMARY_COLOR="rgb(0, 112, 210)"
heroku config:set CHAT_HEADER_TITLE="Your Custom Title"
heroku config:set CHAT_WELCOME_MESSAGE="Your custom welcome message"
```

## 🔧 Common Commands

```bash
# View logs
heroku logs --tail

# Restart app
heroku restart

# Update environment variable
heroku config:set VARIABLE_NAME=value

# Open app
heroku open

# Check status
heroku ps
```

## 📚 Full Documentation

For detailed information, see:

- **Quick Start**: [docs/QUICKSTART.md](docs/QUICKSTART.md)
- **Salesforce Setup**: [docs/SALESFORCE_SETUP.md](docs/SALESFORCE_SETUP.md)
- **Heroku Deployment**: [docs/HEROKU_DEPLOYMENT.md](docs/HEROKU_DEPLOYMENT.md)
- **Main README**: [README.md](README.md)

## 🆘 Troubleshooting

### Widget won't load?

```bash
# Check logs for errors
heroku logs --tail

# Verify all environment variables are set
heroku config
```

### Authentication fails?

1. Wait 5-10 minutes for Salesforce to propagate changes
2. Verify Client ID and Secret are correct
3. Check that Client Credentials Flow is enabled in Connected App

### Agent not responding?

1. Verify Agent ID is correct
2. Check that agent is published/active in Salesforce
3. Ensure "Run As" user has permissions

## 📊 Project Structure

```
MCI_Agent/
├── README.md                      # Main documentation
├── SETUP_SUMMARY.md              # This file (quick reference)
├── QUICKSTART.md                 # 15-minute setup guide
├── DEPLOYMENT_CHECKLIST.md       # Pre-deployment checklist
├── CONTRIBUTING.md               # Contribution guidelines
├── CHANGELOG.md                  # Version history
├── LICENSE                       # MIT License
├── ENV_TEMPLATE.txt              # Environment variable template
├── package.json                  # Node.js dependencies
├── server.js                     # Express server
├── Procfile                      # Heroku config
├── app.json                      # Heroku deployment manifest
├── .gitignore                    # Git ignore rules
├── docs/                         # Detailed documentation
│   ├── QUICKSTART.md
│   ├── SALESFORCE_SETUP.md
│   └── HEROKU_DEPLOYMENT.md
├── public/                       # Frontend files
│   ├── index.html               # Main widget page
│   ├── oauth-callback.html      # OAuth handler
│   ├── styles.css               # Widget styles
│   ├── config.js                # Dynamic configuration
│   ├── agentforce-api.js        # Salesforce API client
│   └── chat-widget.js           # Widget logic
└── .github/
    └── workflows/
        └── validate.yml         # CI/CD validation
```

## ✅ Verification

After deployment, verify:

- [ ] Widget loads at Heroku URL
- [ ] Authentication succeeds
- [ ] Chat messages send and receive
- [ ] Agent responds correctly
- [ ] Widget works in MCI iframe
- [ ] No console errors

## 🎓 Next Steps

1. **Test thoroughly** with sample questions
2. **Customize the theme** to match your brand
3. **Embed in MCI dashboard**
4. **Share with your team**
5. **Monitor usage** via Heroku logs

## 💡 Pro Tips

- **Use Eco dynos** ($5/month) for production - they're perfect for this use case
- **Set up monitoring** with free Papertrail add-on
- **Document your setup** for future team members
- **Test changes locally** before deploying

## 🔐 Security Reminders

- ✅ Never commit `.env` to Git
- ✅ Never share your Client Secret
- ✅ Rotate credentials regularly
- ✅ Use HTTPS in production (automatic on Heroku)
- ✅ Review access logs periodically

## 📞 Support

- 📖 Check documentation first
- 🐛 [Open an issue](https://github.com/your-org/mci-agentforce-chat-widget/issues)
- 💬 Contact your Salesforce admin
- 📧 Email: support@your-org.com

---

**Deployment Time**: ~15 minutes total
**Maintenance**: Minimal (monthly credential rotation recommended)
**Cost**: $5-7/month on Heroku Eco/Basic dynos

---

Made with ❤️ for Marketing Cloud Intelligence

