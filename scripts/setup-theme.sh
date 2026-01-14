#!/bin/bash
# filepath: /home/aj/sites/shopify-dev-template/scripts/setup-theme.sh

#!/bin/bash

# Script to set up a new Shopify theme project with the files at repository root
# Updated for GitHub integration compatibility (requires theme files at root)

echo "Setting up Shopify theme project..."

# Parse command line arguments
STORE_URL=""
THEME_ID=""
DEV_MODE=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --store=*)
      STORE_URL="${1#*=}"
      shift
      ;;
    --theme=*)
      THEME_ID="${1#*=}"
      shift
      ;;
    --dev)
      DEV_MODE=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: ./setup-theme.sh --store=your-store.myshopify.com [--theme=your-theme-id] [--dev]"
      exit 1
      ;;
  esac
done

if [ -z "$STORE_URL" ]; then
  echo "Error: Store URL is required"
  echo "Usage: ./setup-theme.sh --store=your-store.myshopify.com [--theme=your-theme-id] [--dev]"
  exit 1
fi

PROJECT_NAME=$(basename $(pwd))

# Create directory structure for project organization (not theme files)
mkdir -p scripts
mkdir -p docs

# Initialize Git repository if not already one
if [ ! -d ".git" ]; then
  git init
  echo "node_modules/" > .gitignore
  echo ".DS_Store" >> .gitignore
  echo ".env" >> .gitignore
  echo ".theme-check.yml" >> .gitignore
  echo ".shopifyignore" >> .gitignore
fi

# Create env file
echo "SHOPIFY_STORE=\"$STORE_URL\"" > .env
if [ -n "$THEME_ID" ]; then
  echo "SHOPIFY_THEME_ID=\"$THEME_ID\"" >> .env
fi

# Check if the Shopify CLI is installed
if ! command -v shopify &> /dev/null; then
  echo "Shopify CLI is not installed. Installing..."
  npm install -g @shopify/cli @shopify/theme
fi

# If theme ID is provided, pull existing theme
if [ -n "$THEME_ID" ]; then
  echo "Pulling existing theme (ID: $THEME_ID) from $STORE_URL..."
  shopify theme pull --store="$STORE_URL" --theme="$THEME_ID" --path=.
else
  # Initialize new theme at root directory
  echo "Initializing new theme at repository root..."
  shopify theme init --path=.
fi

# Create a .theme-check.yml configuration
cat > .theme-check.yml << EOL
root: ./
ignore:
  - node_modules/
  - scripts/
  - docs/
EOL

# Start development server if --dev flag is provided
if [ "$DEV_MODE" = true ]; then
  echo "Starting development server..."
  shopify theme dev --store="$STORE_URL"
else
  echo "Theme setup complete!"
  echo "To start development, run: shopify theme dev --store=$STORE_URL"
fi