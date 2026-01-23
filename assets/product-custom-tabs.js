import { mediaQueryLarge } from '@theme/utilities';

/**
 * Product Custom Tabs Component
 * Handles tab navigation and content switching for product-specific tabs
 */
class ProductCustomTabs extends HTMLElement {
  constructor() {
    super();
    this.productId = this.dataset.productId || '';
    this.currentIndex = 0;
    this.isMobile = !mediaQueryLarge.matches;
    this.handleResize = this.handleResize.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  get refs() {
    return {
      tabs: Array.from(this.querySelectorAll('.product-custom-tabs__tab')),
      panels: Array.from(this.querySelectorAll('.product-custom-tabs__panel')),
      nav: this.querySelector('.product-custom-tabs__nav')
    };
  }

  connectedCallback() {
    this.setupEventListeners();
    this.checkResponsiveMode();
    
    // Load saved tab state for this product
    this.loadSavedTabState();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  setupEventListeners() {
    const { tabs } = this.refs;
    
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', (e) => this.handleTabClick(e, index));
      tab.addEventListener('keydown', this.handleKeydown);
    });

    mediaQueryLarge.addEventListener('change', this.handleResize);
    this.addEventListener('keydown', this.handleKeydown);
  }

  removeEventListeners() {
    mediaQueryLarge.removeEventListener('change', this.handleResize);
    this.removeEventListener('keydown', this.handleKeydown);
  }

  handleResize() {
    this.isMobile = !mediaQueryLarge.matches;
    this.checkResponsiveMode();
  }

  checkResponsiveMode() {
    const { nav } = this.refs;
    
    if (!nav) return;
    
    if (this.isMobile) {
      // Mobile: Convert to accordion-style if needed
      nav.setAttribute('data-mobile-mode', 'true');
    } else {
      // Desktop: Use tab navigation
      nav.removeAttribute('data-mobile-mode');
    }
  }

  /**
   * @param {Event} event
   * @param {number} index
   */
  handleTabClick(event, index) {
    event.preventDefault();
    this.selectTab(index);
  }

  /**
   * @param {KeyboardEvent} event
   */
  handleKeydown(event) {
    const { tabs } = this.refs;
    const currentTab = /** @type {HTMLElement} */ (event.target);
    
    if (!currentTab.classList.contains('product-custom-tabs__tab')) {
      return;
    }

    const currentIndex = tabs.indexOf(currentTab);
    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case 'ArrowRight':
        event.preventDefault();
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        nextIndex = tabs.length - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectTab(currentIndex);
        return;
      default:
        return;
    }

    const nextTab = /** @type {HTMLElement} */ (tabs[nextIndex]);
    if (nextTab) {
      nextTab.focus();
      this.selectTab(nextIndex);
    }
  }

  /**
   * @param {number} index
   */
  selectTab(index) {
    const { tabs, panels } = this.refs;
    
    if (index < 0 || index >= tabs.length) {
      return;
    }

    // Update current index
    this.currentIndex = index;

    // Update tab states
    tabs.forEach((tab, i) => {
      const isActive = i === index;
      tab.classList.toggle('product-custom-tabs__tab--active', isActive);
      tab.setAttribute('aria-selected', isActive.toString());
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    // Update panel states
    panels.forEach((panel, i) => {
      const isActive = i === index;
      panel.classList.toggle('product-custom-tabs__panel--active', isActive);
      
      if (isActive) {
        panel.removeAttribute('hidden');
        panel.setAttribute('tabindex', '0');
        
        // Trigger any animations or lazy loading in the active panel
        this.activatePanel(/** @type {HTMLElement} */ (panel));
      } else {
        panel.setAttribute('hidden', '');
        panel.setAttribute('tabindex', '-1');
      }
    });

    // Save tab state for this product
    this.saveTabState(index);

    // Dispatch custom event for other components to listen to
    this.dispatchEvent(new CustomEvent('product-tab-changed', {
      detail: {
        productId: this.productId,
        activeIndex: index,
        activeTab: tabs[index],
        activePanel: panels[index]
      },
      bubbles: true
    }));
  }

  /**
   * @param {HTMLElement} panel
   */
  activatePanel(panel) {
    // Initialize any components in the newly active panel
    const accordions = panel.querySelectorAll('accordion-custom');
    accordions.forEach(/** @param {HTMLElement} accordion */ (accordion) => {
      // Trigger accordion initialization if needed
      accordion.dispatchEvent(new Event('panel-activated', { bubbles: false }));
    });

    // Lazy load images if any
    const lazyImages = panel.querySelectorAll('img[data-src]');
    lazyImages.forEach(/** @param {HTMLImageElement} img */ (img) => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
    });
  }

  /**
   * @param {number} index
   */
  saveTabState(index) {
    if (!this.productId) return;
    
    try {
      const tabState = {
        productId: this.productId,
        activeIndex: index,
        timestamp: Date.now()
      };
      localStorage.setItem(`product-custom-tabs-${this.productId}`, JSON.stringify(tabState));
    } catch (error) {
      console.warn('Could not save tab state:', error);
    }
  }

  loadSavedTabState() {
    if (!this.productId) return;
    
    try {
      const savedState = localStorage.getItem(`product-custom-tabs-${this.productId}`);
      if (savedState) {
        const state = JSON.parse(savedState);
        
        // Only use saved state if it's recent (within 1 hour)
        const isRecent = Date.now() - state.timestamp < 3600000;
        
        if (isRecent && state.activeIndex !== undefined) {
          // Small delay to ensure DOM is ready
          setTimeout(() => {
            this.selectTab(state.activeIndex);
          }, 100);
          return;
        }
      }
    } catch (error) {
      console.warn('Could not load saved tab state:', error);
    }

    // Default to first tab
    this.selectTab(0);
  }

  // Public method to programmatically select a tab
  /**
   * @param {string} title
   */
  selectTabByTitle(title) {
    const { tabs } = this.refs;
    const targetTab = tabs.find(tab => {
      const textElement = tab.querySelector('.product-custom-tabs__tab-text');
      return textElement && textElement.textContent && textElement.textContent.trim() === title;
    });
    
    if (targetTab) {
      const index = tabs.indexOf(targetTab);
      this.selectTab(index);
      return true;
    }
    
    return false;
  }

  // Public method to get current tab info
  getCurrentTab() {
    const { tabs, panels } = this.refs;
    
    return {
      index: this.currentIndex,
      tab: tabs[this.currentIndex],
      panel: panels[this.currentIndex],
      title: tabs[this.currentIndex]?.querySelector('.product-custom-tabs__tab-text')?.textContent?.trim()
    };
  }
}

// Register the custom element
if (!customElements.get('product-custom-tabs')) {
  customElements.define('product-custom-tabs', ProductCustomTabs);
}

export default ProductCustomTabs;
