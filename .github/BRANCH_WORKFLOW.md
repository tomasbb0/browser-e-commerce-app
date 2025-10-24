# Git Branch Workflow Guide

## Current Branches

- `main` - Production branch (always stable)
- `test-pr-for-coderabbit` - Test/demo branch

## Common Branch Commands

### Viewing Branches
```bash
git branch              # List local branches
git branch -a           # List all branches (local + remote)
git branch -v           # List with last commit info
```

### Creating Branches
```bash
# Create and switch in one command
git checkout -b feature/my-new-feature

# Or separately:
git branch feature/my-new-feature
git checkout feature/my-new-feature

# Modern way (Git 2.23+):
git switch -c feature/my-new-feature
```

### Switching Branches
```bash
git checkout main              # Switch to main
git checkout feature-name      # Switch to another branch
git switch main               # Modern alternative
```

### Pushing Branches
```bash
# Push current branch to remote
git push origin feature/my-feature

# Push and set upstream (first time)
git push -u origin feature/my-feature
```

### Updating Your Branch
```bash
# Get latest from main while on your feature branch
git checkout main
git pull
git checkout feature/my-feature
git merge main

# Or using rebase (cleaner history):
git checkout feature/my-feature
git rebase main
```

### Deleting Branches
```bash
# Delete local branch (after merging)
git branch -d feature/my-feature

# Force delete (if not merged)
git branch -D feature/my-feature

# Delete remote branch
git push origin --delete feature/my-feature
```

## Recommended Branch Naming

Use prefixes to categorize branches:

- `feature/` - New features
  - Example: `feature/add-dark-mode`
  
- `fix/` - Bug fixes
  - Example: `fix/checkout-button-error`
  
- `docs/` - Documentation updates
  - Example: `docs/update-readme`
  
- `refactor/` - Code refactoring
  - Example: `refactor/database-functions`
  
- `test/` - Testing/experiments
  - Example: `test/pr-for-coderabbit`

## Typical Workflow

### 1. Start New Feature
```bash
# Make sure main is up to date
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/amazing-new-feature

# Make your changes...
git add .
git commit -m "Add amazing feature"

# Push to GitHub
git push -u origin feature/amazing-new-feature
```

### 2. Create Pull Request
```bash
# Using GitHub CLI
gh pr create --title "Add amazing feature" \
             --body "This adds an amazing new feature"

# Or visit GitHub and click "Compare & pull request"
```

### 3. After PR Review
```bash
# If changes requested, make them:
git add .
git commit -m "Address review comments"
git push  # No need for -u, already set

# After approval, merge on GitHub
# Then cleanup:
git checkout main
git pull origin main
git branch -d feature/amazing-new-feature
```

## Working with Multiple People

### Update Your Branch with Latest Main
```bash
# While on your feature branch
git fetch origin
git merge origin/main

# Or rebase (cleaner):
git fetch origin
git rebase origin/main
```

### Resolve Conflicts
```bash
# If merge/rebase has conflicts:
# 1. Open conflicted files
# 2. Look for <<<<<<< HEAD markers
# 3. Choose which changes to keep
# 4. Remove conflict markers
# 5. Stage resolved files:
git add conflicted-file.js

# 6. Continue:
git merge --continue
# or
git rebase --continue
```

## Best Practices

1. **Keep branches short-lived** - Merge within days, not weeks
2. **One feature per branch** - Don't mix unrelated changes
3. **Branch from main** - Always start from the latest main
4. **Pull main often** - Keep your branch up to date
5. **Meaningful names** - `feature/add-user-auth` not `stuff` or `test`
6. **Delete after merge** - Clean up merged branches
7. **Commit often** - Small, logical commits are better

## Checking Branch Status

### See what branch you're on:
```bash
git branch          # * shows current branch
git status          # Also shows current branch
```

### See differences between branches:
```bash
# Compare current branch to main
git diff main

# Compare two specific branches
git diff main..feature/my-feature

# List files that differ
git diff --name-only main
```

### See commit history:
```bash
# Current branch
git log --oneline

# Compare with main
git log main..HEAD --oneline

# Visual graph
git log --oneline --graph --all
```

## Quick Reference

| Task | Command |
|------|---------|
| Create branch | `git checkout -b branch-name` |
| Switch branch | `git checkout branch-name` |
| List branches | `git branch -a` |
| Push branch | `git push -u origin branch-name` |
| Delete local | `git branch -d branch-name` |
| Delete remote | `git push origin --delete branch-name` |
| Update from main | `git merge main` (while on feature branch) |
| See current branch | `git branch` or `git status` |

## Need Help?

- Stuck on a branch? `git status` shows what's happening
- Made a mistake? `git reflog` shows command history, you can usually recover
- Want to undo? `git reset --hard origin/branch-name` resets to remote version
