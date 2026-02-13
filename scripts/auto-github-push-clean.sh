#!/bin/bash

# Automated GitHub Push Script
# This script will automatically push all future updates to GitHub
# Requires GITHUB_TOKEN environment variable to be set

echo "🚀 Starting automated GitHub push..."

cd /workspace/premium_website

# Set the working remote with environment token
# Token should be set as environment variable: GITHUB_TOKEN
if [[ -n "$GITHUB_TOKEN" ]]; then
    git remote set-url github https://$GITHUB_TOKEN@github.com/Omar-Fouad-Organization/Premium-website.git
else
    echo "❌ GITHUB_TOKEN environment variable not set"
    echo "ℹ️  Please set the token: export GITHUB_TOKEN=your_token_here"
    exit 1
fi

# Check if there are any changes to commit
if [[ -n $(git status --porcelain) ]]; then
    echo "📝 Found changes to commit..."
    
    # Add all changes
    git add -A
    
    # Create commit with timestamp
    git commit -m "Auto-update: $(date '+%Y-%m-%d %H:%M:%S') - Latest improvements and fixes"
    
    echo "✅ Changes committed successfully"
else
    echo "ℹ️  No new changes to commit"
fi

# Check if there are commits to push
COMMITS_AHEAD=$(git rev-list --count HEAD ^github/main 2>/dev/null || echo "0")

if [[ "$COMMITS_AHEAD" -gt 0 ]]; then
    echo "📤 Pushing $COMMITS_AHEAD commits to GitHub..."
    
    # Push to GitHub with the working token
    if git push github main; then
        echo "✅ Successfully pushed $COMMITS_AHEAD commits to GitHub!"
        echo "🔗 Repository: https://github.com/Omar-Fouad-Organization/Premium-website"
        return 0
    else
        echo "❌ Failed to push to GitHub"
        return 1
    fi
else
    echo "✅ All commits are already synchronized with GitHub"
fi

echo "🎯 GitHub sync complete!"