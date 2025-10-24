# CodeRabbit AI Code Review Guide

## What is CodeRabbit? 🤖

CodeRabbit is an AI-powered code review assistant that automatically reviews your pull requests and provides:
- 🐛 Bug detection
- 🔒 Security issue identification
- ⚡ Performance optimization suggestions
- 📚 Best practice recommendations
- 💡 Code improvement ideas
- ✅ Approval for simple, safe changes

## How It Works

1. **You create a Pull Request** → CodeRabbit automatically starts reviewing
2. **CodeRabbit analyzes your code** → Checks quality, security, performance
3. **You get feedback** → Comments on specific lines with suggestions
4. **You respond** → Accept, reject, or discuss suggestions
5. **CodeRabbit learns** → Gets better at understanding your preferences

## Configuration

We've configured CodeRabbit with the `coderabbit.yaml` file in this repo:

### Review Settings
- **Level**: Detailed reviews with thorough analysis
- **Tone**: Professional but helpful
- **Auto-review**: Enabled for all PRs

### What Gets Reviewed
✅ JavaScript files (`*.js`)
✅ HTML files (`*.html`)
✅ CSS files (`*.css`)
✅ Documentation (`*.md`)
✅ Configuration files (`*.json`, `*.yaml`)

❌ Skip: `node_modules`, `package-lock.json`, `.env` files

### Focus Areas

**For API Functions** (`api/**/*.js`):
- Security vulnerabilities
- Error handling
- Async/await patterns
- Database operations

**For Frontend** (`*.html`, `*.js`):
- Code quality
- Best practices
- Performance
- Accessibility

**For Documentation** (`*.md`):
- Clarity
- Completeness
- Accuracy

## Using CodeRabbit

### 1. Creating a PR
Just create a PR as normal:
```bash
git checkout -b feature/my-feature
# Make changes...
git push origin feature/my-feature
gh pr create --title "Add new feature"
```

CodeRabbit will automatically start reviewing within seconds!

### 2. Reading Reviews

CodeRabbit posts two types of comments:

**Summary Comment** (at the top):
- Overall assessment
- Files changed count
- Key findings
- Recommendations

**Line Comments** (on specific code):
- Specific issues or suggestions
- Why it matters
- How to fix it

### 3. Responding to CodeRabbit

You can interact with CodeRabbit naturally:

**Ask for clarification:**
```
@coderabbitai Why is this a security issue?
```

**Request changes:**
```
@coderabbitai Can you suggest an alternative approach?
```

**Disagree:**
```
@coderabbitai I disagree because [reason]. This is intentional.
```

**Request specific reviews:**
```
@coderabbitai Please review the error handling in this function
```

### 4. Applying Suggestions

CodeRabbit often provides GitHub suggestions that you can commit directly:

1. Look for the "Suggestion" box in comments
2. Click "Commit suggestion"
3. The change is automatically committed to your PR!

## Commands You Can Use

| Command | What It Does |
|---------|--------------|
| `@coderabbitai review` | Trigger a new review |
| `@coderabbitai summary` | Get a summary of changes |
| `@coderabbitai help` | Show available commands |
| `@coderabbitai pause` | Pause reviews for this PR |
| `@coderabbitai resume` | Resume reviews |
| `@coderabbitai resolve` | Mark a conversation as resolved |

## Example Review Flow

### Scenario: You add a new API endpoint

**Your code:**
```javascript
// api/new-endpoint.js
module.exports = async (req, res) => {
  const data = req.body;
  // Process data...
  return res.json({ success: true });
};
```

**CodeRabbit might comment:**
> 🔒 **Security**: No input validation detected. Consider validating `req.body` before processing.
>
> **Suggestion:**
> ```javascript
> if (!req.body || !req.body.requiredField) {
>   return res.status(400).json({ error: 'Missing required field' });
> }
> ```

**You can respond:**
```
@coderabbitai Good catch! I'll add validation.
```

## Best Practices

### ✅ Do:
- Read CodeRabbit's comments carefully
- Respond to questions and concerns
- Apply helpful suggestions
- Explain your reasoning when you disagree
- Thank CodeRabbit for good catches! (It learns from praise)

### ❌ Don't:
- Ignore all comments without consideration
- Dismiss security warnings without investigation
- Auto-merge without reviewing CodeRabbit's feedback
- Get defensive - CodeRabbit is here to help!

## Common CodeRabbit Feedback

### Security Issues
```
🔒 Potential SQL injection vulnerability
🔒 Sensitive data logged to console
🔒 Missing authentication check
```

### Performance Issues
```
⚡ Inefficient loop - consider using map/filter
⚡ Unnecessary re-renders
⚡ Memory leak potential
```

### Best Practices
```
💡 Consider using async/await
💡 Magic numbers should be constants
💡 Function too complex - consider splitting
```

### Documentation
```
📚 Missing JSDoc comments
📚 Unclear variable name
📚 README needs updating
```

## Adjusting CodeRabbit's Behavior

Edit `coderabbit.yaml` to customize:

### Make reviews more concise:
```yaml
reviews:
  level: concise  # Change from 'detailed'
```

### Change tone to casual:
```yaml
reviews:
  tone: casual  # Change from 'professional'
```

### Skip certain files:
```yaml
reviews:
  scope:
    exclude:
      - "**/*.test.js"  # Don't review test files
```

### Add custom rules:
```yaml
rules:
  patterns:
    - pattern: "var "
      message: "Use 'const' or 'let' instead of 'var'"
      severity: warning
```

## Learning from CodeRabbit

CodeRabbit learns from:
- ✅ Your responses to suggestions
- ✅ What you accept vs reject
- ✅ Your coding patterns
- ✅ Team preferences

Over time, it gives more relevant feedback!

## Troubleshooting

### CodeRabbit not commenting?
- Check if CodeRabbit app is installed on your repo
- Verify `coderabbit.yaml` syntax
- Look for CodeRabbit status checks in PR

### Too many comments?
- Switch to `level: concise` in config
- Add more exclusions to `scope.exclude`
- Use `@coderabbitai pause` for specific PRs

### Disagreeing with suggestions?
- Reply with your reasoning
- CodeRabbit learns from your feedback
- Mark as resolved if it's intentional

## Privacy & Security

- CodeRabbit only reads code in public repos (or repos it's authorized for)
- Does not store sensitive data
- Reviews are ephemeral
- Complies with GitHub's security standards

## Resources

- [CodeRabbit Documentation](https://docs.coderabbit.ai)
- [Configuration Guide](https://docs.coderabbit.ai/guides/configure-coderabbit)
- [Best Practices](https://docs.coderabbit.ai/guides/best-practices)

## Getting Help

In your PR, just ask:
```
@coderabbitai help
```

Or visit: https://docs.coderabbit.ai

---

**Happy Coding with AI Assistance! 🚀**
