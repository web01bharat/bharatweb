#!/bin/bash

# Script to set up SCSS structure in the scss directory (not uploaded to Shopify)
# and compile to assets/theme.css (which will be uploaded to Shopify)

echo "Setting up SCSS structure..."

# Create SCSS directory structure (source files - not uploaded to Shopify)
mkdir -p scss
mkdir -p scss/components
mkdir -p scss/layout
mkdir -p scss/utils

# Create main SCSS file
cat > scss/theme.scss << EOL
/*
* Shopify Theme SCSS Main File
*/

// Utils
@import "utils/variables";
@import "utils/mixins";

// Layout
@import "layout/header";
@import "layout/footer";
@import "layout/grid";

// Components
@import "components/buttons";
@import "components/forms";
@import "components/navigation";
EOL

# Create utility files
cat > scss/utils/_variables.scss << EOL
// Colors
\$color-primary: #000000;
\$color-secondary: #333333;
\$color-accent: #ff0000;
\$color-background: #ffffff;

// Typography
\$font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
\$font-heading: \$font-body;
EOL

cat > scss/utils/_mixins.scss << EOL
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin responsive-image {
  max-width: 100%;
  height: auto;
}

@mixin visually-hidden {
  position: absolute;
  overflow: hidden;
  clip: rect(0 0 0 0);
  height: 1px;
  width: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
}
EOL

# Create empty layout files
cat > scss/layout/_header.scss << EOL
// Header styles
EOL

cat > scss/layout/_footer.scss << EOL
// Footer styles
EOL

cat > scss/layout/_grid.scss << EOL
// Grid system styles
EOL

# Create empty component files
cat > scss/components/_buttons.scss << EOL
// Button styles
EOL

cat > scss/components/_forms.scss << EOL
// Form styles
EOL

cat > scss/components/_navigation.scss << EOL
// Navigation styles
EOL

# Ensure the assets directory exists
mkdir -p assets

# Create or update .shopifyignore file to exclude scss directory
if [ -f ".shopifyignore" ]; then
  # Check if scss/ is already in .shopifyignore
  if ! grep -q "scss/" .shopifyignore; then
    echo "scss/" >> .shopifyignore
    echo "Added scss/ to .shopifyignore file"
  fi
else
  echo "scss/" > .shopifyignore
  echo "Created .shopifyignore file with scss/ directory excluded"
fi

# Check if theme.liquid exists and contains theme.css reference
if [ -f "layout/theme.liquid" ]; then
  if ! grep -q "theme.css.*asset_url.*stylesheet_tag" layout/theme.liquid; then
    echo "Warning: theme.css may not be properly included in your theme.liquid file."
    echo "Please ensure it has this line somewhere in the <head> section:"
    echo "{{ 'theme.css' | asset_url | stylesheet_tag }}"
  else
    echo "Confirmed theme.css is properly included in theme.liquid"
  fi
else
  echo "Warning: layout/theme.liquid file not found."
  echo "Please ensure to include theme.css in your main layout file:"
  echo "{{ 'theme.css' | asset_url | stylesheet_tag }}"
fi

# Compile SCSS to CSS
if command -v sass &> /dev/null; then
  echo "Compiling SCSS to CSS..."
  sass --style=compressed scss/theme.scss:assets/theme.css
else
  echo "Warning: sass is not installed. Please run 'npm install' to install dependencies."
  echo "Then run 'npm run build' to compile SCSS to CSS."
fi

echo "SCSS setup complete!"
echo "Source SCSS files are in the scss/ directory (not uploaded to Shopify)"
echo "Compiled CSS is in assets/theme.css (will be uploaded to Shopify)"
echo "Run 'npm run watch' to automatically compile SCSS to CSS when files change"