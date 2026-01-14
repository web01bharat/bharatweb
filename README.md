# Shopify Theme Development Template

A standardized development environment and workflow for Shopify themes, compatible with GitHub integration.

## Prerequisites

**Node.js Version 18 Required**

Before starting, ensure you have Node.js version 18 installed. You can check your version with:
```bash
node --version
```

If you need to install or switch to Node 18, use a version manager like nvm:
```bash
nvm install 18
nvm use 18
```

## Features

* Local development with hot reloading
* SCSS preprocessing
* Theme Check linting
* GitHub Actions for CI/CD
* Streamlined authentication and deployment
* Fully compatible with Shopify GitHub integration

## Quick Start

### Option 1: Using the Setup Script (Recommended)

We provide a setup script that automates the entire theme setup process in one step:

```bash
# Make the script executable
chmod +x ./scripts/setup-theme.sh

# For a new theme:
./scripts/setup-theme.sh --store=your-store.myshopify.com

# For an existing theme:
./scripts/setup-theme.sh --store=your-store.myshopify.com --theme=your-theme-id

# To automatically start the development server after setup:
./scripts/setup-theme.sh --store=your-store.myshopify.com --dev
```

**What the script does:**
- Creates necessary project directories
- Initializes Git repository (if not already initialized)
- Sets up environment files (.env)
- Installs Shopify CLI if needed
- Pulls an existing theme or initializes a new one
- Creates configuration files (.theme-check.yml)
- Can start the development server immediately with the --dev flag

After running the script, you can skip to [GitHub integration](#set-up-github-integration) or directly to the [development workflow](#development-workflow) if you've already set up GitHub integration.

### Option 2: Manual Setup

If you prefer to set up your project manually, follow these steps:

1.  **Ensure Node.js 18 is installed**:
    ```bash
    node --version  # Should show v18.x.x
    ```

2.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    ```

4.  **Set up the theme:**

    * For a new theme:

        ```bash
        npm run setup -- --store=your-store.myshopify.com
        ```

    * For an existing theme:

        ```bash
        npm run setup -- --store=your-store.myshopify.com --theme=your-theme-id
        ```

5.  **Update theme IDs in package.json**:
    After setup, update the theme IDs in `package.json`:
    - Replace `<YOUR_THEME_ID>` with your main theme ID
    - Replace `<YOUR_TEST_THEME_ID>` with your test theme ID
    - You can find theme IDs in Shopify admin under **Online Store > Themes**

6.  **Start development:**

    ```bash
    # In one terminal: start SCSS watcher
    npm run watch
    
    # In another terminal: start dev server
    npm run dev

    (use node 18)
    ```

7.  **Set up GitHub integration:**

    Follow our [GitHub Integration Guide](https://github.com/TincanPipPip/shopify-development-template/blob/main/docs/github-integration.md) to configure the two-way synchronization between your local development environment, GitHub repository, and Shopify store. This guide will walk you through:
    
    * Downloading theme files
    * Setting up the build process with GitHub
    * Configuring the Shopify GitHub app
    * Managing branch synchronization
    
    When you've completed the GitHub integration setup, return here to continue with the development workflow.

8.  **Start development:**

    ```bash
    # In one terminal: compile SCSS
    npm run watch
    
    # In another terminal: start Shopify dev server
    npm run dev
    ```

## Project Structure

```
/                  # Root (contains theme files)
├── assets/        # Theme assets (CSS, JS, images)
│   └── theme.css  # Compiled CSS (do not edit directly)
├── config/        # Theme settings
├── layout/        # Theme layout templates
├── locales/       # Translation files
├── scss/          # SCSS source files (not uploaded to Shopify)
│   ├── components/  # Component styles
│   ├── layout/      # Layout styles
│   └── utils/       # Variables, mixins, etc.
├── sections/      # Theme sections
├── snippets/      # Reusable code snippets
├── templates/     # Theme templates
├── scripts/       # Development scripts
└── docs/          # Documentation
```

## Important: GitHub Integration Structure

Shopify's GitHub integration **requires** theme files to be at the repository root, not in a subdirectory. This template follows that requirement by placing all theme files at the root level. If you place theme files in a subdirectory, GitHub integration will fail with a "Branch isn't a valid theme" error.

Additionally, Shopify doesn't allow theme files in subdirectories within assets. To maintain a proper SCSS workflow:
- SCSS source files are kept in the `scss/` directory (not uploaded to Shopify)
- Compiled CSS is output to `assets/theme.css` (uploaded to Shopify)

See [GitHub Integration Documentation](docs/github-integration.md) for detailed information.

## Development Workflow

1.  **Authentication process:**

    ```bash
    shopify auth login
    ```

2.  **Development process:**

    ```bash
    # In one terminal: compile SCSS
    npm run watch
    
    # In another terminal: start Shopify dev server
    npm run dev
    ```

3.  **Theme checking:**

    ```bash
    npm run check
    ```

4.  **Pushing changes:**

    ```bash
    npm run push
    ```

## SCSS Workflow

* SCSS files are located in the `scss/` directory (not uploaded to Shopify)
* Compiled CSS is output to `assets/theme.css` (uploaded to Shopify)

### Option 1: Using the SCSS Setup Script (Recommended)

We provide a setup script that creates the complete SCSS structure in one step:

```bash
# Make the script executable
chmod +x ./scripts/setup-scss.sh

# Run the setup script
./scripts/setup-scss.sh
```

**What the script does:**
- Creates an organized SCSS directory structure (`scss/` with subdirectories)
- Sets up starter files with basic scaffolding (variables, mixins, component files)
- Creates imports in the main SCSS file
- Creates/updates `.shopifyignore` file to exclude the SCSS directory from Shopify
- Verifies that `theme.css` is properly referenced in your theme.liquid file
- Attempts to compile SCSS to CSS if Sass is installed
- Creates the necessary files to begin development immediately

After running the script, you can directly start editing the SCSS files and run the watcher.

### Option 2: Manual Setup

If you prefer to set up your SCSS structure manually:

1.  **Set up SCSS structure:**

    ```bash
    npm run setup-scss
    ```

2.  **Watch for changes:**

    ```bash
    npm run watch
    ```

3.  **Build for production:**

    ```bash
    npm run build
    ```

## JavaScript Development

The template includes built-in support for custom JavaScript development:

* A `custom-global.js` file is automatically included in the theme layout
* Place all JavaScript files directly in the `assets` directory (no subdirectories allowed)
* The main script is included with the `defer` attribute for optimal loading performance

### Working with JavaScript

1. **Edit the main JavaScript file:**

    ```bash
    # Edit the custom-global.js file in your assets directory
    assets/custom-global.js
    ```

2. **Access Shopify data:**

    ```javascript
    // Example: Access Shopify cart data
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => console.log('Cart contents:', cart));
    ```

3. **Organize your code:**

    JavaScript files are included in the GitHub sync workflow, allowing proper version control and team collaboration. For larger themes, consider using a module pattern to organize your code.

### Best Practices

* Keep JavaScript files minimal and focused
* Use event delegation for dynamically added elements
* Leverage existing Shopify JavaScript objects when available
* Test across different browsers and devices

For more detailed information, see the [JavaScript Development Guide](docs/shopify-development-environment-setup#javascript-development).

## Scaffolding Components

* Create new sections using the scaffold-section script.

    ```bash
    npm run scaffold-section my-new-section
    ```

## Deployment Process

* Two-environment workflow:
    * **Development environment:** Push to the `development` branch.
    * **Production environment:** Create a pull request from `development` to `main`.
* GitHub Actions automatically deploy changes based on the branch.
* Alternatively, use Shopify GitHub integration for seamless two-way sync.

## GitHub Integration

* Required repository secrets for GitHub Actions:
    * `SHOPIFY_STORE_URL`
    * `SHOPIFY_PASSWORD`
    * `SHOPIFY_DEV_THEME_ID`
    * `SHOPIFY_PROD_THEME_ID`

## Content Management Workflow

This theme uses a specific workflow to handle admin content changes while maintaining clean version control:

1. **Development themes**: Each branch connects to a separate development theme
2. **JSON file handling**: Admin-modified JSON files are gitignored to prevent unwanted commits
3. **Selective merging**: When desired, JSON content changes can be included in merges to preserve admin updates
4. **Content preservation**: Regular backups of JSON configuration can be created using `npm run backup-admin`

See [Content Management Guide](docs/content-management.md) for detailed workflow.

## Additional Resources

* [Shopify Theme Development Documentation](https://shopify.dev/docs/themes)
* [Liquid Template Language](https://shopify.dev/docs/themes/liquid)
* [Shopify CLI Documentation](https://shopify.dev/docs/themes/tools/cli)
* [Shopify GitHub Integration](https://shopify.dev/docs/themes/github)
* [Development Environment Setup Guide](docs/shopify-development-environment-setup.md)
