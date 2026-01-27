/**
 * Resource List Carousel Variants Handler
 * Adds variant selection functionality to product cards in resource list carousels
 */

document.addEventListener('DOMContentLoaded', function() {
  initResourceListVariants();
});

// Also initialize when sections are loaded via AJAX
document.addEventListener('shopify:section:load', function() {
  initResourceListVariants();
});

function initResourceListVariants() {
  const resourceListCarousels = document.querySelectorAll('.resource-list__carousel');
  
  resourceListCarousels.forEach(function(carousel) {
    const productCards = carousel.querySelectorAll('.product-card--with-variants');
    
    productCards.forEach(function(card) {
      enhanceProductCardVariants(card);
    });
  });
}

function enhanceProductCardVariants(productCard) {
  const productId = productCard.dataset.productId;
  const productHandle = productCard.dataset.productHandle;
  
  if (!productId || !productHandle) return;
  
  // Fetch product data and setup interactions
  fetchProductData(productHandle)
    .then(function(productData) {
      if (productData && productData.variants) {
        productCard.productData = productData;
        setupVariantInteractions(productCard, productData);
        updateInitialState(productCard, productData);
      }
    })
    .catch(function(error) {
      console.warn('Could not load product data for carousel:', productHandle, error);
    });
}

function fetchProductData(productHandle) {
  return fetch('/products/' + productHandle + '.js')
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Product not found');
      }
      return response.json();
    });
}

function setupVariantInteractions(productCard, productData) {
  // Handle swatch clicks
  productCard.addEventListener('click', function(event) {
    const swatch = event.target.closest('.swatch');
    if (!swatch || swatch.disabled) return;
    
    event.preventDefault();
    handleVariantSelection(productCard, productData, swatch);
  });

  // Handle quick add clicks
  productCard.addEventListener('click', function(event) {
    const quickAddBtn = event.target.closest('.quick-add-btn');
    if (!quickAddBtn) return;
    
    event.preventDefault();
    handleQuickAdd(quickAddBtn);
  });
}

function handleVariantSelection(productCard, productData, selectedSwatch) {
  const optionName = selectedSwatch.dataset.optionName;
  const optionValue = selectedSwatch.dataset.optionValue;
  
  // Update swatch selection state
  updateSwatchSelection(productCard, optionName, selectedSwatch);
  
  // Find matching variant
  const selectedOptions = getSelectedOptions(productCard);
  const matchingVariant = findMatchingVariant(productData, selectedOptions);
  
  if (matchingVariant) {
    updateProductCardDisplay(productCard, matchingVariant);
  }
  
  // Update availability of other swatches
  updateSwatchAvailability(productCard, productData, selectedOptions);
}

function updateSwatchSelection(productCard, optionName, selectedSwatch) {
  // Remove selection from other swatches of the same option
  const optionSwatches = productCard.querySelectorAll('[data-option-name="' + optionName + '"]');
  optionSwatches.forEach(function(swatch) {
    swatch.classList.remove('swatch--selected');
    swatch.setAttribute('aria-pressed', 'false');
  });
  
  // Select the clicked swatch
  selectedSwatch.classList.add('swatch--selected');
  selectedSwatch.setAttribute('aria-pressed', 'true');
}

function getSelectedOptions(productCard) {
  const selectedOptions = {};
  const selectedSwatches = productCard.querySelectorAll('.swatch--selected');
  
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
  
  // Update quick add button
  updateQuickAddButton(productCard, variant);
}

function updatePrice(productCard, variant) {
  const priceElement = productCard.querySelector('.price__current, .price');
  if (!priceElement) return;
  
  // Update main price
  if (priceElement.classList.contains('price__current')) {
    priceElement.textContent = formatMoney(variant.price);
  } else {
    priceElement.textContent = formatMoney(variant.price);
  }
  
  // Update compare at price
  const comparePriceElement = productCard.querySelector('.price__compare');
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
  const img = productCard.querySelector('.product-card__media-img');
  if (img && variant.featured_image) {
    // Create fade effect
    img.style.opacity = '0.5';
    
    // Load new image
    const newImage = new Image();
    newImage.onload = function() {
      img.src = variant.featured_image.src;
      img.alt = variant.featured_image.alt || variant.title;
      img.style.opacity = '1';
    };
    newImage.src = variant.featured_image.src;
  }
}

function updateAvailability(productCard, variant) {
  if (variant.available) {
    productCard.classList.remove('product-card--sold-out');
    productCard.classList.add('product-card--available');
  } else {
    productCard.classList.remove('product-card--available');
    productCard.classList.add('product-card--sold-out');
  }
}

function updateQuickAddButton(productCard, variant) {
  const quickAddBtn = productCard.querySelector('.quick-add-btn');
  if (!quickAddBtn) return;
  
  quickAddBtn.dataset.variantId = variant.id;
  
  if (variant.available) {
    quickAddBtn.disabled = false;
    quickAddBtn.textContent = 'Quick Add - ' + formatMoney(variant.price);
    quickAddBtn.classList.remove('button--disabled');
  } else {
    quickAddBtn.disabled = true;
    quickAddBtn.textContent = 'Sold Out';
    quickAddBtn.classList.add('button--disabled');
  }
}

function updateSwatchAvailability(productCard, productData, selectedOptions) {
  // Update availability for all swatches based on current selections
  const allSwatches = productCard.querySelectorAll('.swatch');
  
  allSwatches.forEach(function(swatch) {
    if (swatch.classList.contains('swatch--selected')) return;
    
    const optionName = swatch.dataset.optionName;
    const optionValue = swatch.dataset.optionValue;
    
    // Check if this option combination would result in an available variant
    const testOptions = Object.assign({}, selectedOptions);
    testOptions[optionName] = optionValue;
    
    const hasAvailableVariant = productData.variants.some(function(variant) {
      return variant.available && productData.options.every(function(option, index) {
        return !testOptions[option] || testOptions[option] === variant.options[index];
      });
    });
    
    if (hasAvailableVariant) {
      swatch.classList.remove('swatch--unavailable');
      swatch.disabled = false;
    } else {
      swatch.classList.add('swatch--unavailable');
      swatch.disabled = true;
    }
  });
}

function updateInitialState(productCard, productData) {
  // Set default variant (first available one)
  const defaultVariant = productData.variants.find(function(variant) {
    return variant.available;
  }) || productData.variants[0];
  
  if (defaultVariant) {
    updateProductCardDisplay(productCard, defaultVariant);
  }
}

function handleQuickAdd(quickAddBtn) {
  const variantId = quickAddBtn.dataset.variantId;
  const productId = quickAddBtn.dataset.productId;
  
  if (!variantId) {
    console.warn('No variant selected for quick add');
    return;
  }
  
  // Show loading state
  const originalText = quickAddBtn.textContent;
  quickAddBtn.textContent = 'Adding...';
  quickAddBtn.disabled = true;
  
  addToCart(variantId, 1)
    .then(function(success) {
      if (success) {
        quickAddBtn.textContent = 'Added!';
        setTimeout(function() {
          quickAddBtn.textContent = originalText;
          quickAddBtn.disabled = false;
        }, 2000);
      } else {
        quickAddBtn.textContent = originalText;
        quickAddBtn.disabled = false;
      }
    });
}

function addToCart(variantId, quantity) {
  return fetch('/cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: variantId,
      quantity: quantity || 1
    })
  })
  .then(function(response) {
    if (response.ok) {
      return response.json().then(function(result) {
        // Dispatch cart updated event
        document.dispatchEvent(new CustomEvent('cart:updated', {
          detail: { item: result }
        }));
        
        // Show success feedback
        showAddToCartFeedback(true);
        return true;
      });
    } else {
      throw new Error('Failed to add to cart');
    }
  })
  .catch(function(error) {
    console.error('Error adding to cart:', error);
    showAddToCartFeedback(false);
    return false;
  });
}

function showAddToCartFeedback(success) {
  const message = success ? 'Added to cart!' : 'Error adding to cart';
  
  // Simple toast notification
  const toast = document.createElement('div');
  toast.className = 'cart-toast cart-toast--' + (success ? 'success' : 'error');
  toast.textContent = message;
  toast.style.cssText = 
    'position: fixed; ' +
    'top: 20px; ' +
    'right: 20px; ' +
    'padding: 12px 24px; ' +
    'background: ' + (success ? '#10b981' : '#ef4444') + '; ' +
    'color: white; ' +
    'border-radius: 6px; ' +
    'z-index: 10000; ' +
    'transform: translateX(100%); ' +
    'transition: transform 0.3s ease;';
  
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(function() {
    toast.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after delay
  setTimeout(function() {
    toast.style.transform = 'translateX(100%)';
    setTimeout(function() {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
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
