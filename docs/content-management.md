
### 3. New File: docs/content-management.md

```markdown
# Content Management for Shopify Themes

## Overview

Shopify themes contain two types of files:
1. **Code files**: Templates, CSS, JavaScript, etc.
2. **Content files**: JSON files containing theme settings and section content

When using GitHub with Shopify, you need a strategy to manage content changes made in the admin interface.

## The Challenge

- Content changes in the Shopify admin create automatic commits to GitHub
- These commits can pollute your version history with minor changes
- Merge conflicts can occur between developer changes and admin changes

## Our Solution

We use a combination of:
1. **Git ignoring** content files (settings_data.json and section JSON files)
2. **Replica themes** for development work
3. **Selective merging** to control when content changes are propagated

## Workflow

### 1. Setup

```bash
# Ensure content files are ignored
echo "config/settings_data.json" >> .gitignore
echo "sections/*.json" >> .gitignore
echo "templates/*.json" >> .gitignore

# Remove these files from Git tracking
git rm --cached config/settings_data.json
git rm --cached sections/*.json
git rm --cached templates/*.json
git commit -m "Stop tracking content files"