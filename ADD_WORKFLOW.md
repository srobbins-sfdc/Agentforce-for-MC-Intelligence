# Adding GitHub Actions Workflow

The GitHub Actions workflow file couldn't be pushed automatically due to OAuth token permissions.

## Option 1: Add via GitHub Web Interface (Easiest)

1. Go to https://github.com/srobbins-sfdc/Agentforce-for-MC-Intelligence
2. Click "Add file" → "Create new file"
3. Name it: `.github/workflows/validate.yml`
4. Copy content from the local `.github/workflows/validate.yml` file
5. Commit directly to main branch

## Option 2: Update GitHub CLI Token

```bash
gh auth refresh -h github.com -s workflow
git push origin main
```

## Option 3: Skip the Workflow

The workflow is optional - it validates the project structure on each commit.
The project works perfectly without it.

---

Once added, the workflow will automatically validate:
- File structure
- Package.json validity
- Environment template
- Required dependencies
- Server startup (mock)
