#!/bin/bash

# Auto-commit and push script for Premium Website
# This script will be called after every successful build and deploy

echo "🚀 Auto-committing and pushing to GitHub..."

cd /workspace/premium_website

# Check if there are any changes to commit
if [[ -n $(git status --porcelain) ]]; then
    echo "📝 Found changes to commit..."
    git add -A
    git commit -m "Auto-commit: $(date '+%Y-%m-%d %H:%M:%S') - Latest updates and improvements"
else
    echo "✅ No new changes to commit"
fi

# Check if there are commits to push
COMMITS_AHEAD=$(git rev-list --count HEAD ^github/main 2>/dev/null || echo "0")

if [[ "$COMMITS_AHEAD" -gt 0 ]]; then
    echo "📤 Pushing $COMMITS_AHEAD commits to GitHub..."
    
    # Try to push with different methods
    if git push github main 2>/dev/null; then
        echo "✅ Successfully pushed to GitHub!"
    elif git push github main --force-with-lease 2>/dev/null; then
        echo "✅ Successfully force-pushed to GitHub!"
    else
        echo "❌ Failed to push to GitHub. Commits are ready locally."
        echo "📋 Manual push required: git push github main"
        echo "🔗 Repository: https://github.com/omarfouad01/premium-website"
    fi
else
    echo "✅ All commits are already pushed to GitHub"
fi

echo "🎯 GitHub sync complete!"