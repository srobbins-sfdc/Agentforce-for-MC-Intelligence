# Deployment Checklist

Use this checklist to ensure a successful deployment of the MCI Agentforce Chat Widget.

## Pre-Deployment

### Salesforce Configuration

- [ ] Salesforce org has Agentforce enabled
- [ ] Agentforce agent is created and configured
- [ ] Agentforce agent is published and active
- [ ] Agent ID obtained (starts with 0Xx)
- [ ] Connected App created in Salesforce
- [ ] Connected App has OAuth settings enabled
- [ ] Connected App has Client Credentials Flow enabled
- [ ] "Run As" user selected for Client Credentials Flow
- [ ] Integration user has necessary permissions
- [ ] Client ID (Consumer Key) saved securely
- [ ] Client Secret (Consumer Secret) saved securely
- [ ] CORS configured with deployment URL
- [ ] Callback URL configured (or placeholder added)

### Local Environment

- [ ] Repository cloned locally
- [ ] Node.js 18.x+ installed
- [ ] npm 9.x+ installed
- [ ] Git configured
- [ ] Heroku CLI installed (for manual deployment)
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created from ENV_TEMPLATE.txt
- [ ] Environment variables populated in `.env`
- [ ] Local server tested (`npm start`)
- [ ] Chat widget loads successfully
- [ ] Authentication works locally
- [ ] Agent responds to messages locally

## Deployment

### Heroku Setup

- [ ] Heroku account created
- [ ] Heroku CLI authenticated (`heroku login`)
- [ ] Heroku app name chosen (unique)
- [ ] Heroku region selected
- [ ] Heroku app created

### Environment Variables

Set on Heroku:

- [ ] `SALESFORCE_INSTANCE_URL` configured
- [ ] `SALESFORCE_CLIENT_ID` configured
- [ ] `SALESFORCE_CLIENT_SECRET` configured
- [ ] `SALESFORCE_AGENT_ID` configured
- [ ] `NODE_ENV=production` set
- [ ] `SALESFORCE_API_VERSION` set (optional)
- [ ] `CHAT_PRIMARY_COLOR` set (optional)
- [ ] `CHAT_HEADER_TITLE` set (optional)
- [ ] `CHAT_WELCOME_MESSAGE` set (optional)

Verify with:
```bash
heroku config
```

### Deploy Application

- [ ] Code pushed to Heroku (`git push heroku main`)
- [ ] Build completed successfully
- [ ] Web dyno running (`heroku ps`)
- [ ] Application accessible via Heroku URL

## Post-Deployment

### Salesforce Updates

- [ ] Connected App callback URL updated with Heroku URL
- [ ] CORS whitelist updated with Heroku URL
- [ ] Changes saved in Salesforce
- [ ] Waited 5-10 minutes for Salesforce propagation

### Application Testing

- [ ] Heroku app URL opens successfully
- [ ] Widget loads in browser
- [ ] Authentication succeeds
- [ ] Chat session creates successfully
- [ ] Welcome message displays
- [ ] Can send messages
- [ ] Agent responds to messages
- [ ] Markdown renders correctly
- [ ] Typing indicators work
- [ ] No console errors
- [ ] Mobile view works
- [ ] Tablet view works
- [ ] Desktop view works

### Health Checks

- [ ] Health endpoint responds: `/health`
- [ ] Status returns "healthy"
- [ ] Uptime is reasonable
- [ ] No errors in Heroku logs (`heroku logs --tail`)

### Performance

- [ ] Page load time acceptable (< 3 seconds)
- [ ] Message response time reasonable (< 2 seconds)
- [ ] No memory leaks visible
- [ ] Dyno not crashing

## MCI Integration

### Embedding

- [ ] MCI dashboard access confirmed
- [ ] Iframe code prepared
- [ ] Widget embedded in dashboard
- [ ] Widget loads in iframe
- [ ] Chat functionality works in iframe
- [ ] No CORS errors
- [ ] No security warnings
- [ ] Responsive within iframe

### Analytics

- [ ] Analytics events firing
- [ ] MCI receiving events
- [ ] Event data correct
- [ ] Tracking ID configured (if applicable)

## Security

### Credentials

- [ ] No credentials committed to Git
- [ ] `.env` in `.gitignore`
- [ ] Heroku config vars set correctly
- [ ] Client secret not exposed
- [ ] Debug mode disabled in production

### Access

- [ ] HTTPS enabled (automatic on Heroku)
- [ ] SSL certificate valid
- [ ] CORS configured correctly
- [ ] X-Frame-Options allows embedding
- [ ] Security headers present

## Monitoring

### Setup

- [ ] Heroku logs accessible
- [ ] Health check automated (optional)
- [ ] Uptime monitoring configured (optional)
- [ ] Error tracking configured (optional)
- [ ] Analytics dashboard setup (optional)

### Alerts

- [ ] Dyno crash alerts configured
- [ ] Error rate alerts configured
- [ ] Uptime alerts configured

## Documentation

### Team

- [ ] Team notified of deployment
- [ ] Documentation shared
- [ ] Widget URL shared
- [ ] Embedding instructions provided
- [ ] Support contact shared

### Internal

- [ ] Deployment documented
- [ ] Configuration documented
- [ ] Credentials stored in vault
- [ ] Runbook updated
- [ ] Incident response plan updated

## Optional Enhancements

### Custom Domain

- [ ] Custom domain purchased
- [ ] DNS configured
- [ ] Domain added to Heroku
- [ ] SSL certificate configured
- [ ] Salesforce updated with new domain
- [ ] CORS updated with new domain

### Scaling

- [ ] Dyno type selected based on traffic
- [ ] Scaling policy defined
- [ ] Auto-scaling configured (optional)

### Backup

- [ ] Code in version control (Git)
- [ ] Configuration documented
- [ ] Credentials backed up securely
- [ ] Deployment process documented

## Rollback Plan

In case of issues:

- [ ] Previous version tagged in Git
- [ ] Rollback procedure documented
- [ ] Team knows how to rollback
- [ ] Database backup (if applicable)

Rollback command:
```bash
git push heroku previous-tag:main --force
# Or
heroku releases:rollback
```

## Verification Command Reference

```bash
# Check app status
heroku ps

# View logs
heroku logs --tail

# Check environment
heroku config

# Test health endpoint
curl https://your-app.herokuapp.com/health

# Restart app
heroku restart

# Open app
heroku open
```

## Troubleshooting

If issues occur:

1. Check Heroku logs: `heroku logs --tail`
2. Verify environment variables: `heroku config`
3. Test health endpoint: `curl .../health`
4. Review [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
5. Check Salesforce configuration
6. Verify CORS settings
7. Test OAuth flow manually

## Sign-Off

### Deployer

- [ ] All checklist items completed
- [ ] Application tested thoroughly
- [ ] Documentation updated
- [ ] Team notified

**Name**: ________________  
**Date**: ________________  
**Version**: ________________  

### Reviewer

- [ ] Deployment verified
- [ ] Testing confirmed
- [ ] Production ready

**Name**: ________________  
**Date**: ________________  

---

## Notes

Add any deployment-specific notes here:

---

**Deployment Status**: [ ] Not Started | [ ] In Progress | [ ] Completed | [ ] Rolled Back

