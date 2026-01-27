/**
 * Enhanced Product Carousel with Real Shopify Variants
 * This script enhances product carousels to work with actual Shopify product variants
 */

document.addEventListener('DOMContentLoaded', function() {
  initProductCarouselVariants();
});

// Also initialize when sections are loaded via AJAX
document.addEventListener('shopify:section:load', function() {
  initProductCarouselVariants();
});

function initProductCarouselVariants() {
  const productCarousels = document.querySelectorAll('.product-carousel-content');
  
  productCarousels.forEach(function(carousel) {
    const productCards = carousel.querySelectorAll('product-card');
    
    productCards.forEach(function(card) {
      enhanceProductCard(card);
    });
  });
}

function enhanceProductCard(productCard) {
  // Look for existing product data or fetch it
  const productHandle = getProductHandle(productCard);
  
  if (productHandle) {
    fetchProductData(productCard, productHandle)
      .then(function(productData) {
        if (productData && productData.variants) {
          addVariantControls(productCard, productData);
          setupVariantInteractions(productCard, productData);
        }
      })
      .catch(function(error) {
        console.warn('Could not enhance product card:', error);
      });
  }
}

function getProductHandle(productCard) {
  // Try multiple ways to get the product handle
  if (productCard.dataset.productHandle) {
    return productCard.dataset.productHandle;
  }
  
  // Try to extract from product URL link
  const productLink = productCard.querySelector('a[href*="/products/"]');
  if (productLink) {
    const match = productLink.href.match(/\/products\/([^/?#]+)/);
    if (match) {
      return match[1];
    }
  }
  
  return null;
}

function fetchProductData(productCard, productHandle) {
  return fetch('/products/' + productHandle + '.js')
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Product not found');
      }
      return response.json();
    })
    .then(function(productData) {
      // Store product data on the card
      productCard.productData = productData;
      return productData;
    });
}

function addVariantControls(productCard, productData) {
  // Only add controls if there are multiple variants
  if (!productData.variants || productData.variants.length <= 1) {
    return;
  }

  const cardContent = productCard.querySelector('.card__content, .product-card__content');
  if (!cardContent) return;

  // Create variant container
  const variantContainer = document.createElement('div');
  variantContainer.className = 'product-card__variants';
  
  // Add size options if available
  if (hasOption(productData, 'Size')) {
    const sizeSelector = createOptionSelector(productData, 'Size');
    if (sizeSelector) {
      variantContainer.appendChild(sizeSelector);
    }
  }
  
  // Add color options if available
  if (hasOption(productData, 'Color')) {
    const colorSelector = createOptionSelector(productData, 'Color');
    if (colorSelector) {
      variantContainer.appendChild(colorSelector);
    }
  }
  
  // Add style options if available
  if (hasOption(productData, 'Style')) {
    const styleSelector = createOptionSelector(productData, 'Style');
    if (styleSelector) {
      variantContainer.appendChild(styleSelector);
    }
  }

  // Insert the variant container
  const priceElement = cardContent.querySelector('.price, .product-card__price');
  if (priceElement && priceElement.nextSibling) {
    cardContent.insertBefore(variantContainer, priceElement.nextSibling);
  } else {
    cardContent.appendChild(variantContainer);
  }
}

function hasOption(productData, optionName) {
  return productData.options && productData.options.includes(optionName);
}

function createOptionSelector(productData, optionName) {
  const optionIndex = productData.options.indexOf(optionName);
  if (optionIndex === -1) return null;
  
  // Get unique values for this option
  const optionValues = getUniqueOptionValues(productData, optionIndex);
  if (optionValues.length <= 1) return null;
  
  const container = document.createElement('div');
  container.className = 'variant-option variant-option--' + optionName.toLowerCase();
  
  // Add label
  const label = document.createElement('span');
  label.className = 'variant-label';
  label.textContent = optionName + ':';
  container.appendChild(label);
  
  // Add swatches container
  const swatchesContainer = document.createElement('div');
  swatchesContainer.className = 'variant-swatches';
  
  optionValues.forEach(function(value) {
    const swatch = createVariantSwatch(productData, optionName, optionIndex, value);
    if (swatch) {
      swatchesContainer.appendChild(swatch);
    }
  });
  
  container.appendChild(swatchesContainer);
  return container;
}

function getUniqueOptionValues(productData, optionIndex) {
  const values = [];
  productData.variants.forEach(function(variant) {
    if (variant.options[optionIndex] && values.indexOf(variant.options[optionIndex]) === -1) {
      values.push(variant.options[optionIndex]);
    }
  });
  return values;
}

function createVariantSwatch(productData, optionName, optionIndex, value) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'variant-swatch';
  button.dataset.optionName = optionName;
  button.dataset.optionValue = value;
  button.setAttribute('aria-label', optionName + ': ' + value);
  
  // Check if this option value is available
  const isAvailable = productData.variants.some(function(variant) {
    return variant.options[optionIndex] === value && variant.available;
  });
  
  if (!isAvailable) {
    button.classList.add('variant-swatch--unavailable');
    button.disabled = true;
  }
  
  // Style the swatch based on option type
  if (optionName.toLowerCase() === 'color') {
    button.classList.add('variant-swatch--color');
    
    // Try to find a variant image for this color
    const colorVariant = productData.variants.find(function(variant) {
      return variant.options[optionIndex] === value && variant.featured_image;
    });
    
    if (colorVariant && colorVariant.featured_image) {
      const img = document.createElement('img');
      img.src = colorVariant.featured_image.src.replace(/\.(jpg|jpeg|png|webp)/, '_30x30.$1');
      img.alt = value;
      img.loading = 'lazy';
      button.appendChild(img);
    } else {
      // Create a color swatch
      const colorDiv = document.createElement('div');
      colorDiv.className = 'swatch-color';
      colorDiv.style.backgroundColor = getColorValue(value);
      button.appendChild(colorDiv);
    }
    
    // Add color name as tooltip
    button.title = value;
  } else {
    // For size, style, etc. - show text
    button.classList.add('variant-swatch--text');
    button.textContent = value;
  }
  
  return button;
}

function getColorValue(colorName) {
  // Simple color name to hex mapping
  const colorMap = {
    'red': '#ff0000',
    'blue': '#0000ff',
    'green': '#008000',
    'black': '#000000',
    'white': '#ffffff',
    'gray': '#808080',
    'grey': '#808080',
    'pink': '#ffc0cb',
    'yellow': '#ffff00',
    'orange': '#ffa500',
    'purple': '#800080',
    'brown': '#a52a2a',
    'navy': '#000080',
    'maroon': '#800000'
  };
  
  return colorMap[colorName.toLowerCase()] || '#' + colorName.replace(/[^0-9a-f]/gi, '').substr(0, 6);
}

function setupVariantInteractions(productCard, productData) {
  productCard.addEventListener('click', function(event) {
    const swatch = event.target.closest('.variant-swatch');
    if (!swatch || swatch.disabled) return;
    
    event.preventDefault();
    handleVariantSelection(productCard, productData, swatch);
  });
}

function handleVariantSelection(productCard, productData, selectedSwatch) {
  const optionName = selectedSwatch.dataset.optionName;
  
  // Update swatch selection state
  updateSwatchSelection(productCard, optionName, selectedSwatch);
  
  // Find the matching variant
  const selectedOptions = getSelectedOptions(productCard);
  const matchingVariant = findMatchingVariant(productData, selectedOptions);
  
  if (matchingVariant) {
    updateProductCardDisplay(productCard, matchingVariant);
  }
}

function updateSwatchSelection(productCard, optionName, selectedSwatch) {
  // Remove selection from other swatches of the same option
  const optionSwatches = productCard.querySelectorAll('[data-option-name="' + optionName + '"]');
  optionSwatches.forEach(function(swatch) {
    swatch.classList.remove('variant-swatch--selected');
    swatch.setAttribute('aria-pressed', 'false');
  });
  
  // Select the clicked swatch
  selectedSwatch.classList.add('variant-swatch--selected');
  selectedSwatch.setAttribute('aria-pressed', 'true');
}

function getSelectedOptions(productCard) {
  const selectedOptions = {};
  const selectedSwatches = productCard.querySelectorAll('.variant-swatch--selected');
  
  selectedSwatches.forEach(function(swatch) {
    const optionName = swatch.dataset.optionName;
    const optionValue = swatch.dataset.optionValue;
    if (optionName && optionValue) {
      selectedOptions[optionName] = optionValue;
    }
  });
  
  return selectedOptions;
}

function findMatchingVariant(productData, selectedOptions) {
  return productData.variants.find(function(variant) {
    return productData.options.every(function(optionName, index) {
      return !selectedOptions[optionName] || 
             selectedOptions[optionName] === variant.options[index];
    });
  });
}

function updateProductCardDisplay(productCard, variant) {
  // Update price
  updatePrice(productCard, variant);
  
  // Update image if variant has one
  if (variant.featured_image) {
    updateProductImage(productCard, variant);
  }
  
  // Update availability status
  updateAvailability(productCard, variant);
  
  // Update quick add button if exists
  updateQuickAddButton(productCard, variant);
}

function updatePrice(productCard, variant) {
  const priceElement = productCard.querySelector('.price, .product-card__price');
  if (!priceElement) return;
  
  // Update main price
  const currentPriceElement = priceElement.querySelector('.price__current, .current-price') || priceElement;
  if (currentPriceElement) {
    currentPriceElement.textContent = formatMoney(variant.price);
  }
  
  // Update compare at price
  const comparePriceElement = priceElement.querySelector('.price__compare, .compare-price');
  if (comparePriceElement) {
    if (variant.compare_at_price && variant.compare_at_price > variant.price) {
      comparePriceElement.textContent = formatMoney(variant.compare_at_price);
      comparePriceElement.style.display = '';
    } else {
      comparePriceElement.style.display = 'none';
    }
  }
}

function updateProductImage(productCard, variant) {
  const img = productCard.querySelector('.card__media img, .product-card__media img');
  if (img && variant.featured_image) {
    img.src = variant.featured_image.src;
    img.alt = variant.featured_image.alt || variant.title;
  }
}

function updateAvailability(productCard, variant) {
  if (variant.available) {
    productCard.classList.remove('product-unavailable', 'sold-out');
    productCard.classList.add('product-available');
  } else {
    productCard.classList.remove('product-available');
    productCard.classList.add('product-unavailable', 'sold-out');
  }
}

function updateQuickAddButton(productCard, variant) {
  const quickAddButton = productCard.querySelector('.quick-add-btn, [data-quick-add]');
  if (!quickAddButton) return;
  
  quickAddButton.dataset.variantId = variant.id;
  
  if (variant.available) {
    quickAddButton.disabled = false;
    quickAddButton.textContent = 'Quick Add • ' + formatMoney(variant.price);
    quickAddButton.classList.remove('btn-disabled');
  } else {
    quickAddButton.disabled = true;
    quickAddButton.textContent = 'Sold Out';
    quickAddButton.classList.add('btn-disabled');
  }
}

function formatMoney(cents) {
  // Use Shopify's money formatting if available
  if (window.Shopify && window.Shopify.formatMoney) {
    return window.Shopify.formatMoney(cents);
  }
  
  // Fallback formatting
  const dollars = (cents / 100).toFixed(2);
  return '$' + dollars;
}

// Add CSS styles for the variant swatches
const style = document.createElement('style');
style.textContent = `
  .product-card__variants {
    margin: 8px 0;
  }
  
  .variant-option {
    margin-bottom: 8px;
  }
  
  .variant-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 4px;
    color: rgb(var(--color-foreground));
  }
  
  .variant-swatches {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  
  .variant-swatch {
    border: 1px solid rgba(var(--color-foreground), 0.2);
    background: transparent;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
  }
  
  .variant-swatch--text {
    padding: 6px 12px;
    font-size: 0.75rem;
    font-weight: 500;
    min-width: 40px;
    text-align: center;
  }
  
  .variant-swatch--color {
    width: 32px;
    height: 32px;
    padding: 2px;
    overflow: hidden;
  }
  
  .variant-swatch--color img,
  .swatch-color {
    width: 100%;
    height: 100%;
    border-radius: 2px;
    object-fit: cover;
  }
  
  .variant-swatch:hover:not(:disabled) {
    border-color: rgb(var(--color-foreground));
    transform: scale(1.05);
  }
  
  .variant-swatch--selected {
    border-color: rgb(var(--color-foreground)) !important;
    border-width: 2px;
  }
  
  .variant-swatch--selected::after {
    content: '✓';
    position: absolute;
    top: -2px;
    right: -2px;
    background: rgb(var(--color-foreground));
    color: rgb(var(--color-background));
    border-radius: 50%;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: bold;
  }
  
  .variant-swatch--unavailable {
    opacity: 0.4;
    cursor: not-allowed;
  }
  
  .variant-swatch--unavailable::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 10%;
    right: 10%;
    height: 1px;
    background: rgb(var(--color-foreground));
    transform: translateY(-50%) rotate(45deg);
    z-index: 1;
  }
`;
document.head.appendChild(style);
