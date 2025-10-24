# 🎯 Branch Practice Exercises

Try these commands to learn branch management!

## Exercise 1: View Your Branches
```bash
# See all your branches
git branch -a

# See which branch you're on (look for the *)
git branch

# See more details
git branch -v
```

## Exercise 2: Switch Between Branches
```bash
# Switch to main
git checkout main

# Look around (notice the files might be different!)
ls -la

# Switch back to test branch
git checkout test-pr-for-coderabbit

# Check again
ls -la
```

## Exercise 3: See the Differences
```bash
# While on test-pr-for-coderabbit, compare to main
git diff main

# See which files are different
git diff main --name-only

# See just the commit history difference
git log main..HEAD --oneline
```

## Exercise 4: Create Your Own Branch
```bash
# Make sure you're on main first
git checkout main

# Create a new experimental branch
git checkout -b experiment/my-first-feature

# Make a small change (try editing README.md)
# Then commit it
git add .
git commit -m "My first feature branch commit!"

# Push it to GitHub
git push -u origin experiment/my-first-feature
```

## Exercise 5: Clean Up
```bash
# Go back to main
git checkout main

# Delete your experimental branch (locally)
git branch -d experiment/my-first-feature

# Delete it from GitHub too
git push origin --delete experiment/my-first-feature
```

## Exercise 6: Update Your Branch
```bash
# Switch to your test branch
git checkout test-pr-for-coderabbit

# Get latest changes from main
git merge main

# Or try rebasing instead (cleaner history)
git rebase main
```

## Visual Understanding

### When you create a branch:
```
Before:
main:     A---B---C
                  ↑
                 HEAD

After creating "feature" branch:
main:     A---B---C
                  ↑
                 HEAD (feature)
```

### After making commits on feature:
```
main:     A---B---C
                  \
feature:           D---E
                       ↑
                      HEAD
```

### After merging feature into main:
```
main:     A---B---C---F (merge commit)
                  \   /
feature:           D-E
```

## Pro Tips

1. **Always know your branch**: Run `git branch` before making changes
2. **Keep main clean**: Never commit directly to main, always use feature branches
3. **Pull before branch**: Update main before creating new branches
4. **Small branches**: One feature per branch, merge often
5. **Descriptive names**: `feature/add-dark-mode` not `stuff` or `updates`

## Common Mistakes to Avoid

❌ **Don't**: Make changes without checking which branch you're on
✅ **Do**: Run `git branch` first

❌ **Don't**: Create branches from outdated main
✅ **Do**: `git checkout main && git pull` first

❌ **Don't**: Keep branches open for weeks
✅ **Do**: Merge within days

❌ **Don't**: Mix multiple features in one branch
✅ **Do**: One feature = one branch

## Your Current Situation

You're on: `test-pr-for-coderabbit`
Main is at: `a34f88d`
Your branch is at: `e0f8ce5` (1 commit ahead)

This is perfect! You have:
- ✅ A stable `main` branch
- ✅ A feature branch with changes
- ✅ An open pull request (#1)
- ✅ Waiting for CodeRabbit review

## Next Steps

1. Wait for CodeRabbit to review your PR
2. Address any comments
3. Merge the PR when ready
4. Pull latest main
5. Delete the merged branch
6. Create new branches for new features!
