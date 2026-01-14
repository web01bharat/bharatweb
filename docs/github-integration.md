# Shopify GitHub Integration Guide

## Overview

The Shopify GitHub app enables a seamless two-way synchronization between your Shopify theme and a GitHub repository. This integration provides:

- **Automatic updates**: Changes pushed to GitHub are reflected in Shopify.
- **Version control**: Changes made in the Shopify admin are committed to GitHub.
- **Conflict resolution**: The system helps manage changes to avoid overwrites.

## File Structure Requirements

**Critical: Theme files must be at the repository root**

Shopify's GitHub integration requires theme files to be located at the root of your repository, not in a subdirectory. If your theme files are placed in a subdirectory (like `theme/`), the integration will fail with a "Branch isn't a valid theme" error.

### Required Root-Level Structure

```
/
├── assets/        # Must be at root
├── config/        # Must be at root
├── layout/        # Must be at root
├── locales/       # Must be at root
├── sections/      # Must be at root
├── snippets/      # Must be at root
├── templates/     # Must be at root
```

### SCSS Workflow with GitHub Integration

Shopify doesn't allow theme assets to be stored in subdirectories (e.g., `assets/scss/`). Our template addresses this by:

1. **Source files**: All SCSS source files are kept in a `scss/` directory at the repository root
   - This directory is not uploaded to Shopify (excluded via .shopifyignore)
   - Source files can use proper organization with subdirectories
   
2. **Compiled output**: SCSS is compiled to a single CSS file
   - Output goes to `assets/theme.css` (no subdirectories)
   - This file is uploaded to Shopify and used by the theme
   
3. **Development workflow**:
   - Edit SCSS files in the `scss/` directory
   - Run `npm run watch` to automatically compile changes
   - GitHub only syncs the compiled CSS file with Shopify

### Common Errors

1. **"Branch isn't a valid theme" Error**
   - Cause: Theme files are in a subdirectory, not at the repository root.
   - Solution: Move all theme files to the repository root.

2. **"Theme files may not be stored in subfolders" Error**
   - Cause: Assets are placed in subdirectories (e.g., `assets/scss/theme.scss`).
   - Solution: Use our SCSS workflow with source files in `scss/` and compiled output to `assets/theme.css`.

## Integration Setup Process

### Prerequisite: Create a GitHub Repository

Before connecting Shopify to GitHub, you need to set up a GitHub repository for your theme:

1. **Create a new private repository**:
   - Go to [GitHub](https://github.com/) and sign in
   - Click the "+" icon in the top right and select "New repository"
   - Name your repository (preferably matching your theme/store name)
   - Select "Private" to keep your code secure
   - Do not initialize with README, .gitignore, or license files
   - Click "Create repository"

2. **Add team members/collaborators**:
   - Go to repository "Settings" > "Collaborators and teams"
   - Under "Manage access", click "Add people" or "Add teams"
   - Enter GitHub usernames or email addresses of your team members
   - Select appropriate permission levels:
     - **Admin**: Full repository control, including adding collaborators
     - **Write**: Push to repository and create branches
     - **Read**: View code only (not recommended for active developers)
   - Click "Add [name]" to send invitation

3. **Connect your local project to GitHub**:
   ```bash
   # Navigate to your theme directory
   cd /path/to/your/theme
   
   # Initialize git (if not already done)
   git init
   
   # Set the remote origin to your GitHub repository
   git remote set-url origin https://github.com/your-username/your-repo-name.git
   
   # Add all files
   git add .
   
   # Commit files
   git commit -m "Initial theme commit"
   
   # Push to GitHub
   git push -u origin main
   ```

4. **Create test branch**:
   ```bash
   # Create and checkout a test branch
   git checkout -b test
   
   # Push test branch to GitHub
   git push -u origin test
   ```

Now that your GitHub repository is set up with team access, you can proceed to connect it to your Shopify store.

### Connect Repository to Shopify

1. **Navigate to Shopify Admin**:
   - Go to **Online Store > Themes** in your Shopify admin
   - Click the **"Add theme"** dropdown button
   - Select **"Connect to GitHub"**

2. **Select Repository**:
   - Choose the relevant site/repository from the list
   - If your new site isn't available, you'll need to configure GitHub app permissions

3. **Configure GitHub App Permissions** (if needed):
   - Go to [GitHub App Installations](https://github.com/settings/installations/)
   - Find the Shopify GitHub app
   - Click **"Configure"**
   - Under **"Repository access"**, select **"All repositories"** or add your specific repository
   - If you don't have access to the repository, contact a senior developer with access to configure this for you

4. **Connect Branches**:
   - Once permissions are configured, return to Shopify admin
   - Your repository should now be visible in the side panel
   - Select both **"main"** and **"test"** branches
   - This will create two separate themes representing each branch as different theme versions
   - Click **"Connect"** to finalize the integration

**Note**: Each branch will create a separate theme in your Shopify store, allowing you to work on different versions simultaneously.

## Branch Management Best Practices

### Development Workflow

1. **Create a development branch** from your main branch.
2. **Connect this branch** to a development theme in Shopify.
3. **Make and test changes** in this development environment.
4. **Create a pull request** to merge changes to your main branch.
5. **Review and approve** the pull request.

### Theme Preview

To preview changes from a specific branch:
1. Navigate to **Online Store > Themes** in your Shopify admin.
2. Find the connected theme for your branch.
3. Click **Preview** to view the theme.

## Managing Content Changes

When using GitHub integration with Shopify, you'll need a strategy to handle content changes made in the admin interface:

### Content Change Workflow

1. **Development Theme Changes**:
   - Create a development theme for each feature branch
   - Make code changes in your local environment
   - Test changes by pushing to your development theme
   - Admin may make content changes in this theme for testing

2. **Content Preservation Options**:
   - **Option A: Preserve content changes**
     - When merging to main, include the JSON files with admin changes
     - This preserves all content updates made in the Shopify admin
   
   - **Option B: Discard content changes**
     - Before merging, reset JSON files to match production
     - Use `git checkout origin/main -- config/settings_data.json sections/` to reset files
     - This keeps only code changes, not admin content changes

3. **Backup Process**:
   - Before discarding content changes, create backups:
   ```bash
   # Create backup of current JSON files
   mkdir -p backups/$(date +%Y%m%d)
   shopify theme pull --path=backups/$(date +%Y%m%d) --only="config/settings_data.json sections/*.json"
   ```

## Troubleshooting

### Synchronization Issues

If changes aren't synchronizing properly:

1. **Check Connection Status**: Verify the branch is still connected in Shopify admin.
2. **Manual Refresh**: Try disconnecting and reconnecting the branch.
3. **Review GitHub Permissions**: Ensure Shopify still has access to your repository.

### Invalid Theme Structure

If your repository structure is invalid:

1. Run `shopify theme check` to validate your theme structure.
2. Compare your repository structure with a known working Shopify theme.
3. Ensure all theme files are at the repository root, not in a subdirectory.

## Tips for Successful Integration

1. **Use meaningful commit messages** to track changes across both platforms.
2. **Maintain a clean branch structure** with main/master as your production theme.
3. **Create feature branches** for specific changes/features.
4. **Don't modify theme files directly** in the Shopify admin for connected themes.
5. **Regularly pull changes** if multiple developers are working on the theme.

## Resources

- [Shopify GitHub Integration Documentation](https://shopify.dev/docs/themes/github)
- [Shopify Theme Requirements](https://shopify.dev/docs/themes/architecture)
- [GitHub Flow Documentation](https://docs.github.com/en/get-started/quickstart/github-flow)

---

## Next Steps

Now that you have completed the GitHub integration setup, [return to the main documentation](../README.md#quick-start) to continue with development workflow.

The next step will guide you through starting the development server and SCSS compiler to begin working on your theme.
