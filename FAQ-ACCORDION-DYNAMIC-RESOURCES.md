# FAQ Accordion with Dynamic Resources

The FAQ accordion row blocks now support dynamic resource connections, allowing you to populate content from various sources.

## New Features Added

### Content Types Available:

1. **Blocks (Default)** - Traditional block content (backward compatible)
2. **Custom Content** - Rich text content entered directly in the theme editor
3. **Dynamic Metafield** - Connect to metafields from products, pages, blog, articles, or shop
4. **Product Description** - Use product descriptions
5. **Page Content** - Use page content
6. **Article Content** - Use article content

### How to Use Dynamic Metafields:

1. Set Content Type to "Dynamic Metafield"
2. Enter the metafield namespace (e.g., "custom", "global", "specifications")
3. Enter the metafield key (e.g., "faq_answer", "material_info")

The system will automatically check for metafields in this order:
- Product metafields (if on product page)
- Page metafields (if on page)
- Blog metafields (if on blog)
- Article metafields (if on article)
- Shop metafields (global)

### Examples:

#### FAQ from Shop Metafields:
- Namespace: `custom`
- Key: `shipping_policy`

#### Product-specific FAQ:
- Namespace: `product`
- Key: `care_instructions`

#### Page-specific FAQ:
- Namespace: `page`
- Key: `additional_info`

## Files Modified:

1. `blocks/_accordion-row.liquid` - Added dynamic content support to original block
2. `blocks/accordion_row.liquid` - New dedicated FAQ accordion row block
3. `sections/faq.liquid` - New dedicated FAQ section
4. `snippets/_accordion-row.liquid` - Reusable accordion row snippet

## Usage:

### For FAQ Section:
Use the new "FAQ Accordion" section which uses the `accordion_row` block type.

### For Product/General Accordions:
Continue using the existing `_accordion-row` block which now has dynamic resource support.

## Backward Compatibility:

All existing accordion rows will continue to work exactly as before. The default content type is "blocks" which maintains the original functionality.
