#!/bin/bash

# Smart GitHub Sync Script for Premium Website
# Handles commits in small batches and provides multiple backup options

echo "🔄 Smart GitHub Sync Starting..."

cd /workspace/premium_website

# Function to create commit batches
create_commit_batch() {
    local batch_name="$1"
    local files_pattern="$2"
    
    if [[ -n $(git status --porcelain $files_pattern) ]]; then
        git add $files_pattern
        git commit -m "Auto-batch: $batch_name - $(date '+%Y-%m-%d %H:%M')"
        echo "✅ Created commit batch: $batch_name"
        return 0
    else
        echo "ℹ️  No changes for batch: $batch_name"
        return 1
    fi
}

# Create targeted commit batches
echo "📦 Creating commit batches..."

# Batch 1: Core system files
create_commit_batch "Core System Updates" "src/App.tsx src/main.tsx src/index.css"

# Batch 2: Components
create_commit_batch "Component Updates" "src/components/"

# Batch 3: Pages
create_commit_batch "Page Updates" "src/pages/"

# Batch 4: Hooks and utilities
create_commit_batch "Hooks and Utils" "src/hooks/ src/utils/ src/contexts/"

# Batch 5: Database and backend
create_commit_batch "Database and Backend" "supabase/"

# Create backup files
echo "💾 Creating backup files..."

# Create patch file
git format-patch github/main --stdout > "/tmp/premium_website_$(date +%Y%m%d_%H%M).patch"

# Create bundle file
git bundle create "/tmp/premium_website_$(date +%Y%m%d_%H%M).bundle" github/main..HEAD

# Show status
COMMITS_AHEAD=$(git rev-list --count HEAD ^github/main 2>/dev/null || echo "0")
echo "📊 Status: $COMMITS_AHEAD commits ready for GitHub"

# List recent commits
echo "📋 Recent commits:"
git log --oneline -5

echo "✅ Smart GitHub Sync Complete!"
echo "🔗 Repository: https://github.com/omarfouad01/premium-website"
echo "📁 Backup files created in /tmp/"