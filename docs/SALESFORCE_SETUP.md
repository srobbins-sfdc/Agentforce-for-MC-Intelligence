# Salesforce Setup Guide

Complete guide to configuring Salesforce for the Agentforce Chat Widget.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Step 1: Create Connected App](#step-1-create-connected-app)
- [Step 2: Enable Client Credentials Flow](#step-2-enable-client-credentials-flow)
- [Step 3: Configure OAuth Policies](#step-3-configure-oauth-policies)
- [Step 4: Set Up Agentforce Agent](#step-4-set-up-agentforce-agent)
- [Step 5: Configure CORS](#step-5-configure-cors)
- [Step 6: Set Up Permissions](#step-6-set-up-permissions)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Salesforce org with Agentforce enabled
- System Administrator or equivalent permissions
- Agentforce agent created and configured

## Step 1: Create Connected App

### 1.1 Navigate to App Manager

1. Log into Salesforce
2. Click the gear icon (Setup)
3. In Quick Find, search for "App Manager"
4. Click **App Manager**

### 1.2 Create New Connected App

1. Click **New Connected App** (top right)
2. Fill in Basic Information:

   **Basic Information**
   - **Connected App Name**: `Agentforce Chat Widget`
   - **API Name**: `Agentforce_Chat_Widget` (auto-populated)
   - **Contact Email**: Your email address
   - **Description**: `Embeddable chat widget for MCI dashboards`

### 1.3 Configure OAuth Settings

3. Enable OAuth Settings:

   **API (Enable OAuth Settings)**
   - ✅ Check **Enable OAuth Settings**
   - **Callback URL**: 
     ```
     https://your-app-name.herokuapp.com/oauth-callback.html
     ```
     *Note: You can update this later after deploying to Heroku*

   - **Use digital signatures**: Leave unchecked
   
   **Selected OAuth Scopes** (move from Available to Selected):
   - ✅ **Access and manage your data (api)**
   - ✅ **Perform requests on your behalf at any time (refresh_token, offline_access)**

4. Click **Save**
5. Click **Continue**

### 1.4 Retrieve Client Credentials

6. On the Connected App detail page:
   - Copy the **Consumer Key** → This is your `SALESFORCE_CLIENT_ID`
   - Click **Click to reveal** next to Consumer Secret
   - Copy the **Consumer Secret** → This is your `SALESFORCE_CLIENT_SECRET`

⚠️ **IMPORTANT**: Save these credentials securely. You'll need them for deployment.

## Step 2: Enable Client Credentials Flow

### 2.1 Edit Connected App Policies

1. From the Connected App detail page, click **Manage**
2. Click **Edit Policies**

### 2.2 Enable Client Credentials

3. Scroll to **Client Credentials Flow**:
   - ✅ Check **Enable Client Credentials Flow**
   - **Run As**: Select the user who will execute the API calls
     - Recommended: Create a dedicated integration user
     - This user needs permissions to access the Agentforce agent

4. Click **Save**

### 2.3 Configure Permitted Users (Optional but Recommended)

5. Back on Manage page, under **OAuth Policies**:
   - **Permitted Users**: Select **Admin approved users are pre-authorized**
   - **IP Relaxation**: Select **Relax IP restrictions**
   - **Refresh Token Policy**: Select **Refresh token is valid until revoked**

6. Click **Save**

### 2.4 Create Profile or Permission Set (Recommended)

Create a dedicated profile or permission set for the Connected App:

1. Go to **Setup** → **Permission Sets**
2. Click **New**
3. Name it: `Agentforce Chat Widget Access`
4. Assign these permissions:
   - **System Permissions**:
     - ✅ API Enabled
     - ✅ Access Einstein Agent APIs
   - **Apex Class Access**:
     - Add any custom classes your agent uses
   - **Object Permissions**:
     - Add objects your agent queries/modifies

5. Click **Save**

## Step 3: Configure OAuth Policies

### 3.1 Update Connected App OAuth Policies

1. Go to **Setup** → **App Manager**
2. Find your Connected App → Click dropdown → **Manage**
3. Click **Edit Policies**

### 3.2 Configure Session Policies

**Session Policies**
- **Session timeout**: 2 hours (recommended)
- **Refresh token expiration**: 30 days (or "Expire token after use")

**OAuth Policies**
- **Permitted Users**: Admin approved users are pre-authorized
- **IP Relaxation**: Relax IP restrictions
- **Refresh Token Policy**: Refresh token is valid until revoked

4. Click **Save**

## Step 4: Set Up Agentforce Agent

### 4.1 Locate Your Agent

1. Go to **Setup** → **Einstein** → **Agents**
2. Find your agent in the list
3. Click on it to open

### 4.2 Get Agent ID

4. Look at the URL in your browser:
   ```
   https://yourorg.lightning.force.com/lightning/setup/AgentBuilder/page?address=/0XxHs000000r72tKAA
   ```
5. Copy the ID that starts with `0Xx` → This is your `SALESFORCE_AGENT_ID`

### 4.3 Verify Agent Configuration

6. Ensure your agent:
   - ✅ Is published (Status: Active)
   - ✅ Has a valid configuration
   - ✅ Has at least one topic/skill configured
   - ✅ Is accessible by the "Run As" user from the Connected App

### 4.4 Test Agent (Optional)

7. Test your agent in Salesforce:
   - Use the built-in chat interface
   - Verify it responds correctly
   - Test with sample questions

## Step 5: Configure CORS

### 5.1 Add CORS Whitelist Entry

1. Go to **Setup** → **Security** → **CORS**
2. Click **New** under CORS Allowed Origins
3. Add your Heroku app URL:
   ```
   https://your-app-name.herokuapp.com
   ```
4. Click **Save**

### 5.2 Add Additional Origins (Optional)

If you'll test locally or have multiple environments:

- Local development: `http://localhost:3000`
- Staging environment: `https://staging-app.herokuapp.com`
- Production environment: `https://prod-app.herokuapp.com`

## Step 6: Set Up Permissions

### 6.1 Assign Permission Set to Integration User

1. Go to **Setup** → **Users** → **Users**
2. Find the integration user (the "Run As" user)
3. Click on the user
4. Scroll to **Permission Set Assignments**
5. Click **Edit Assignments**
6. Add **Agentforce Chat Widget Access** permission set
7. Click **Save**

### 6.2 Verify User Permissions

8. While on the user page, verify:
   - ✅ User is active
   - ✅ User has API Enabled permission
   - ✅ User can access the Agentforce agent
   - ✅ User has necessary object permissions

### 6.3 Configure Object-Level Security (If Needed)

If your agent accesses custom objects:

1. Go to **Setup** → **Object Manager**
2. For each object:
   - Click **Fields & Relationships**
   - Verify field-level security for the integration user
   - Ensure Read/Write access as needed

## Verification

### Verify Connected App

```bash
# Test authentication
curl -X POST https://your-org.my.salesforce.com/services/oauth2/token \
  -d "grant_type=client_credentials" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET"
```

Expected response:
```json
{
  "access_token": "00D...",
  "instance_url": "https://your-org.my.salesforce.com",
  "id": "https://login.salesforce.com/id/00D.../005...",
  "token_type": "Bearer",
  "issued_at": "1234567890123"
}
```

### Verify Agent Access

Once you have an access token, test agent API access:

```bash
curl -X POST https://api.salesforce.com/einstein/ai-agent/v1/agents/YOUR_AGENT_ID/sessions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "externalSessionKey": "test-session-123",
    "instanceConfig": {
      "endpoint": "https://your-org.my.salesforce.com"
    }
  }'
```

Expected response:
```json
{
  "sessionId": "abc123...",
  "externalSessionKey": "test-session-123"
}
```

## Troubleshooting

### Issue: "invalid_client_id" Error

**Cause**: Client ID is incorrect or app is not approved

**Solution**:
1. Verify Client ID from Connected App
2. Ensure Connected App is approved
3. Wait 2-10 minutes for Salesforce to propagate changes

### Issue: "invalid_client" Error

**Cause**: Client credentials flow is not enabled

**Solution**:
1. Go to Connected App → Manage → Edit Policies
2. Enable "Enable Client Credentials Flow"
3. Select a valid "Run As" user
4. Save and wait 5 minutes

### Issue: "insufficient_access" Error

**Cause**: User doesn't have required permissions

**Solution**:
1. Verify "Run As" user has:
   - API Enabled permission
   - Access to Agentforce Agent APIs
   - Necessary object permissions
2. Assign appropriate permission set
3. Verify user is active

### Issue: "Agent not found" Error

**Cause**: Agent ID is incorrect or agent is not published

**Solution**:
1. Verify Agent ID from the URL
2. Check agent status (must be Active/Published)
3. Verify "Run As" user can access the agent

### Issue: CORS Errors in Browser

**Cause**: CORS not configured properly

**Solution**:
1. Add Heroku app URL to CORS whitelist
2. Ensure URL is exact (no trailing slash)
3. Wait 5 minutes for changes to propagate

## Best Practices

### Security

✅ **DO**:
- Use a dedicated integration user
- Create a specific permission set
- Rotate client secrets periodically
- Use IP restrictions when possible
- Monitor API usage

❌ **DON'T**:
- Use a personal user account
- Give excessive permissions
- Share client credentials
- Hardcode credentials in code

### Performance

✅ **DO**:
- Set appropriate session timeouts
- Use refresh tokens
- Monitor API limits
- Cache responses when appropriate

### Maintenance

✅ **DO**:
- Document configuration changes
- Keep credentials in secure vault
- Monitor Connected App usage
- Regular security audits

## Additional Resources

- [Salesforce Connected Apps](https://help.salesforce.com/s/articleView?id=sf.connected_app_overview.htm)
- [OAuth 2.0 Client Credentials Flow](https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_client_credentials_flow.htm)
- [Agentforce Documentation](https://help.salesforce.com/s/articleView?id=sf.c360_a_agentforce.htm)
- [Einstein API Reference](https://developer.salesforce.com/docs/einstein/genai/overview)

## Need Help?

- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
- Review Heroku logs: `heroku logs --tail`
- Contact your Salesforce administrator
- Open an issue on GitHub

---

**Next Steps**: After completing Salesforce setup, proceed to [HEROKU_DEPLOYMENT.md](./HEROKU_DEPLOYMENT.md)

