# Product Custom Tabs & Accordion Feature

## Overview

This feature adds customizable product-specific tabs and accordion functionality to your Shopify theme. It allows merchants to display product information in an organized, interactive way with support for various content types and metafields.

## Files Created/Modified

### Main Section
- `/sections/product-custom-tabs.liquid` - Main section for product custom tabs

### JavaScript Component
- `/assets/product-custom-tabs.js` - Tab functionality and interaction handling

### Styling
- `/assets/product-custom-tabs-enhancement.css` - Additional CSS enhancements

### Content Snippets
- `/snippets/product-custom-tab-content.liquid` - Basic rich text content renderer
- `/snippets/product-custom-tab-accordion.liquid` - Pre-built accordion content
- `/snippets/product-custom-tab-specifications.liquid` - Product specifications display
- `/snippets/product-custom-tab-metafields.liquid` - Custom metafield content renderer

### Block Components
- `/blocks/product-custom-accordion-row.liquid` - Individual accordion row component

## Features

### 1. Multiple Tab Types

#### Basic Content Tab (`tab_content`)
- Rich text content editor
- Custom icons
- Flexible content management

#### Accordion Tab (`tab_accordion`)
- Pre-built accordion rows for:
  - Materials information
  - Care instructions
  - Sizing & fit details
  - Shipping information
- Uses product metafields when available
- Fallback content for products without metafields

#### Specifications Tab (`tab_specifications`)
- Displays product specifications in a structured format
- Configurable fields (product type, vendor, SKU, weight, etc.)
- Automatic variant information
- Product tags display
- Custom metafield support

#### Metafields Tab (`tab_metafields`)
- Dynamic metafield content rendering
- Support for various metafield types:
  - Text fields
  - Images
  - Lists
  - Booleans
  - Numbers
  - Dates
  - Colors
  - Ratings
  - JSON data
- Configurable namespace and keys

### 2. Responsive Design
- Desktop: Horizontal tab navigation
- Mobile: Accordion-style interface
- Touch-friendly interaction
- Keyboard navigation support

### 3. Advanced Features
- **Tab State Persistence**: Remembers selected tab per product
- **Lazy Loading**: Images load only when tab becomes active
- **Accessibility**: Full ARIA support and keyboard navigation
- **Print Support**: All content visible when printing
- **Animation**: Smooth transitions and fade effects

## Usage Instructions

### 1. Adding the Section

1. In the Shopify theme editor, go to your product template
2. Click "Add section"
3. Select "Product Custom Tabs"
4. Configure the section settings

### 2. Section Settings

- **Section heading**: Optional heading above the tabs
- **Section width**: Page width or full width
- **Gap**: Space between content elements
- **Color scheme**: Theme color scheme to use
- **Padding**: Top and bottom spacing

### 3. Adding Tab Content

#### Basic Content Tab
1. Add a "Basic Tab Content" block
2. Set the tab title and optional icon
3. Add rich text content in the editor

#### Accordion Tab
1. Add an "Accordion Tab" block
2. Configure tab title and icon
3. Choose accordion icon style (caret or plus)
4. Enable/disable dividers

#### Specifications Tab
1. Add a "Product Specifications" block
2. Choose which product fields to display:
   - Product type
   - Vendor/brand
   - SKU
   - Barcode
   - Weight
   - Tags

#### Metafields Tab
1. Add a "Product Metafields" block
2. Enter the metafield namespace (e.g., "custom" or "specifications")
3. Enter metafield keys separated by commas
4. Example: `material, care_instructions, dimensions`

### 4. Metafield Setup

To use metafields effectively, create them in your Shopify admin:

1. Go to Settings > Metafields
2. Select "Products"
3. Create metafields with appropriate types:
   - `custom.materials` (Multi-line text)
   - `custom.care_instructions` (Multi-line text)
   - `specifications.dimensions` (Single line text)
   - `specifications.warranty` (Single line text)

### 5. Customization

#### Adding Custom Content Types
You can extend the accordion tab by modifying `/snippets/product-custom-tab-accordion.liquid` to add more accordion rows.

#### Styling Customization
Add custom CSS to `/assets/product-custom-tabs-enhancement.css` or your main theme CSS file.

#### JavaScript Customization
The JavaScript component dispatches events you can listen to:
```javascript
document.addEventListener('product-tab-changed', (event) => {
  console.log('Active tab:', event.detail.activeIndex);
});
```

## Best Practices

### 1. Content Organization
- Use descriptive tab titles
- Limit to 3-5 tabs for optimal UX
- Group related information together

### 2. Performance
- Use metafields for product-specific content
- Keep rich text content concise
- Optimize images used in metafields

### 3. Accessibility
- Provide meaningful tab titles
- Use appropriate heading hierarchy
- Test with keyboard navigation

### 4. Mobile Experience
- Test accordion functionality on mobile devices
- Ensure touch targets are appropriately sized
- Keep content scannable

## Troubleshooting

### Tabs Not Showing
- Check that the section has blocks added
- Verify JavaScript file is loading
- Check browser console for errors

### Metafields Not Displaying
- Verify metafield namespace and keys are correct
- Check that metafields have values for the product
- Ensure metafield definitions exist in Shopify admin

### Styling Issues
- Check CSS file is loading correctly
- Verify color scheme settings
- Check for conflicting CSS rules

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Notes

- Tab content is loaded on demand
- Images are lazy-loaded when tabs become active
- Tab state is cached in localStorage
- Minimal JavaScript footprint (~3KB gzipped)

This feature provides a comprehensive solution for displaying product information in an organized, user-friendly way while maintaining flexibility for different product types and information requirements.
