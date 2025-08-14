// CSS Layout Debugging JavaScript Utility
class LayoutDebugger {
  constructor() {
    this.isEnabled = false;
    this.debugElements = new Set();
    this.observerConfig = {
      attributes: true,
      childList: true,
      subtree: true,
      attributeOldValue: true
    };
    this.mutationObserver = null;
    this.resizeObserver = null;
    this.intersectionObserver = null;
  }

  // Initialize debugging
  init() {
    console.log('🎨 CSS Layout Debugger Initialized');
    this.createDebugPanel();
    this.setupEventListeners();
    this.detectLayoutIssues();
    this.setupObservers();
  }

  // Create debug control panel
  createDebugPanel() {
    const panel = document.createElement('div');
    panel.id = 'css-debug-panel';
    panel.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 15px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      z-index: 999999;
      min-width: 250px;
      max-height: 400px;
      overflow-y: auto;
      border: 2px solid #355E3B;
    `;

    panel.innerHTML = `
      <div style="margin-bottom: 10px; font-weight: bold; color: #50C878;">
        🎨 CSS Layout Debugger
      </div>
      <div>
        <label style="display: block; margin: 5px 0;">
          <input type="checkbox" id="debug-borders"> Show Element Borders
        </label>
        <label style="display: block; margin: 5px 0;">
          <input type="checkbox" id="debug-grid"> Show Grid Overlay
        </label>
        <label style="display: block; margin: 5px 0;">
          <input type="checkbox" id="debug-flex"> Highlight Flexbox
        </label>
        <label style="display: block; margin: 5px 0;">
          <input type="checkbox" id="debug-overflow"> Detect Overflow
        </label>
        <label style="display: block; margin: 5px 0;">
          <input type="checkbox" id="debug-glass"> Glass Effects
        </label>
        <label style="display: block; margin: 5px 0;">
          <input type="checkbox" id="debug-responsive"> Responsive Info
        </label>
      </div>
      <div style="margin-top: 10px;">
        <button id="analyze-layout" style="background: #355E3B; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
          🔍 Analyze Layout Issues
        </button>
      </div>
      <div id="debug-results" style="margin-top: 10px; font-size: 11px; max-height: 200px; overflow-y: auto;"></div>
    `;

    document.body.appendChild(panel);
  }

  // Setup event listeners
  setupEventListeners() {
    // Debug toggles
    document.getElementById('debug-borders').addEventListener('change', (e) => {
      this.toggleDebugClass('debug-borders', e.target.checked);
    });

    document.getElementById('debug-grid').addEventListener('change', (e) => {
      this.toggleDebugClass('debug-grid', e.target.checked);
    });

    document.getElementById('debug-flex').addEventListener('change', (e) => {
      this.toggleDebugClass('debug-flex', e.target.checked);
    });

    document.getElementById('debug-overflow').addEventListener('change', (e) => {
      this.toggleDebugClass('debug-overflow', e.target.checked);
    });

    document.getElementById('debug-glass').addEventListener('change', (e) => {
      this.toggleDebugClass('debug-glass', e.target.checked);
    });

    document.getElementById('debug-responsive').addEventListener('change', (e) => {
      this.toggleDebugClass('debug-breakpoints', e.target.checked);
    });

    // Analysis button
    document.getElementById('analyze-layout').addEventListener('click', () => {
      this.analyzeLayoutIssues();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey) {
        switch(e.key) {
          case 'B':
            e.preventDefault();
            document.getElementById('debug-borders').click();
            break;
          case 'G':
            e.preventDefault();
            document.getElementById('debug-grid').click();
            break;
          case 'F':
            e.preventDefault();
            document.getElementById('debug-flex').click();
            break;
          case 'O':
            e.preventDefault();
            document.getElementById('debug-overflow').click();
            break;
          case 'A':
            e.preventDefault();
            this.analyzeLayoutIssues();
            break;
        }
      }
    });
  }

  // Toggle debug classes
  toggleDebugClass(className, enabled) {
    if (enabled) {
      document.body.classList.add(className);
    } else {
      document.body.classList.remove(className);
    }
  }

  // Detect common layout issues
  detectLayoutIssues() {
    const issues = [];

    // Check for horizontal overflow
    if (document.body.scrollWidth > document.body.clientWidth) {
      issues.push({
        type: 'horizontal-overflow',
        message: 'Page has horizontal overflow',
        element: document.body,
        severity: 'high'
      });
    }

    // Check for elements extending beyond viewport
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        issues.push({
          type: 'element-overflow',
          message: `Element extends beyond viewport: ${el.tagName.toLowerCase()}${el.className ? '.' + el.className.split(' ')[0] : ''}`,
          element: el,
          severity: 'medium'
        });
      }
    });

    // Check for missing box-sizing
    elements.forEach(el => {
      const computed = getComputedStyle(el);
      if (computed.boxSizing !== 'border-box' && (computed.padding !== '0px' || computed.border !== '0px')) {
        issues.push({
          type: 'box-sizing',
          message: `Element might benefit from box-sizing: border-box`,
          element: el,
          severity: 'low'
        });
      }
    });

    // Check for glass effects without fallbacks
    elements.forEach(el => {
      const computed = getComputedStyle(el);
      if (computed.backdropFilter && computed.backdropFilter !== 'none') {
        // Check if there's a fallback background
        if (!computed.backgroundColor || computed.backgroundColor === 'rgba(0, 0, 0, 0)') {
          issues.push({
            type: 'glass-fallback',
            message: 'Glass effect without background fallback',
            element: el,
            severity: 'medium'
          });
        }
      }
    });

    return issues;
  }

  // Comprehensive layout analysis
  analyzeLayoutIssues() {
    const results = document.getElementById('debug-results');
    results.innerHTML = '<div style="color: #50C878;">🔍 Analyzing layout...</div>';

    setTimeout(() => {
      const issues = this.detectLayoutIssues();
      const performance = this.analyzePerformance();
      
      let html = `<div style="color: #50C878; font-weight: bold;">📊 Analysis Results:</div>`;
      
      if (issues.length === 0) {
        html += '<div style="color: #50C878;">✅ No major layout issues detected!</div>';
      } else {
        issues.forEach(issue => {
          const color = issue.severity === 'high' ? '#ff4444' : 
                      issue.severity === 'medium' ? '#ffaa00' : '#ffffff';
          html += `
            <div style="margin: 5px 0; color: ${color};">
              <strong>${issue.type}:</strong> ${issue.message}
            </div>
          `;
        });
      }

      html += `<div style="margin-top: 10px; color: #50C878; font-weight: bold;">⚡ Performance:</div>`;
      html += `<div>Paint Time: ${performance.paintTime}ms</div>`;
      html += `<div>Layout Time: ${performance.layoutTime}ms</div>`;
      html += `<div>Total Elements: ${performance.elementCount}</div>`;

      // Specific checks for the green space issue
      html += `<div style="margin-top: 10px; color: #50C878; font-weight: bold;">🔍 Green Space Investigation:</div>`;
      const bodyWidth = document.body.scrollWidth;
      const viewportWidth = window.innerWidth;
      const overflowElements = this.findOverflowingElements();
      
      html += `<div>Body Width: ${bodyWidth}px</div>`;
      html += `<div>Viewport Width: ${viewportWidth}px</div>`;
      html += `<div>Overflow: ${bodyWidth > viewportWidth ? 'YES' : 'NO'}</div>`;
      
      if (overflowElements.length > 0) {
        html += `<div style="color: #ff4444;">🚨 Overflowing Elements:</div>`;
        overflowElements.slice(0, 5).forEach(el => {
          html += `<div style="margin-left: 10px;">• ${el.tagName.toLowerCase()}${el.className ? '.' + el.className.split(' ')[0] : ''}</div>`;
        });
      }

      results.innerHTML = html;
    }, 100);
  }

  // Find elements causing horizontal overflow
  findOverflowingElements() {
    const overflowing = [];
    const elements = document.querySelectorAll('*');
    
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > window.innerWidth + 10) { // 10px tolerance
        overflowing.push(el);
      }
    });

    return overflowing.sort((a, b) => {
      const aRect = a.getBoundingClientRect();
      const bRect = b.getBoundingClientRect();
      return (bRect.right - window.innerWidth) - (aRect.right - window.innerWidth);
    });
  }

  // Performance analysis
  analyzePerformance() {
    const start = performance.now();
    
    // Trigger a layout calculation
    document.body.offsetHeight;
    
    const layoutTime = performance.now() - start;
    
    return {
      paintTime: Math.round(layoutTime * 100) / 100,
      layoutTime: Math.round(layoutTime * 100) / 100,
      elementCount: document.querySelectorAll('*').length
    };
  }

  // Setup observers for dynamic detection
  setupObservers() {
    // Mutation observer for DOM changes
    this.mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          this.checkNewElements(mutation.addedNodes);
        }
      });
    });

    this.mutationObserver.observe(document.body, this.observerConfig);

    // Resize observer for layout changes
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.target === document.body) {
            this.checkForHorizontalOverflow();
          }
        });
      });

      this.resizeObserver.observe(document.body);
    }
  }

  // Check new elements for issues
  checkNewElements(nodes) {
    nodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const rect = node.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
          console.warn('🚨 New element causing overflow:', node);
          node.classList.add('debug-horizontal-scroll');
        }
      }
    });
  }

  // Real-time horizontal overflow detection
  checkForHorizontalOverflow() {
    const hasOverflow = document.body.scrollWidth > document.body.clientWidth;
    if (hasOverflow && !document.body.classList.contains('debug-horizontal-scroll')) {
      document.body.classList.add('debug-horizontal-scroll');
      console.warn('🚨 Horizontal overflow detected!');
    } else if (!hasOverflow && document.body.classList.contains('debug-horizontal-scroll')) {
      document.body.classList.remove('debug-horizontal-scroll');
      console.log('✅ Horizontal overflow resolved!');
    }
  }

  // Get detailed element information
  getElementInfo(element) {
    const computed = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    
    return {
      tagName: element.tagName.toLowerCase(),
      className: element.className,
      id: element.id,
      dimensions: {
        width: rect.width,
        height: rect.height,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom
      },
      styles: {
        position: computed.position,
        display: computed.display,
        overflow: computed.overflow,
        overflowX: computed.overflowX,
        overflowY: computed.overflowY,
        boxSizing: computed.boxSizing,
        width: computed.width,
        maxWidth: computed.maxWidth,
        minWidth: computed.minWidth,
        margin: computed.margin,
        padding: computed.padding,
        border: computed.border,
        transform: computed.transform,
        backdropFilter: computed.backdropFilter
      }
    };
  }

  // Export debug report
  exportReport() {
    const issues = this.detectLayoutIssues();
    const performance = this.analyzePerformance();
    const overflowElements = this.findOverflowingElements();
    
    const report = {
      timestamp: new Date().toISOString(),
      issues: issues,
      performance: performance,
      overflowElements: overflowElements.slice(0, 10).map(el => this.getElementInfo(el)),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      document: {
        scrollWidth: document.body.scrollWidth,
        scrollHeight: document.body.scrollHeight,
        clientWidth: document.body.clientWidth,
        clientHeight: document.body.clientHeight
      }
    };

    console.log('📋 Layout Debug Report:', report);
    return report;
  }

  // Cleanup
  destroy() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    
    const panel = document.getElementById('css-debug-panel');
    if (panel) {
      panel.remove();
    }
    
    document.body.classList.remove(
      'debug-borders', 'debug-grid', 'debug-flex', 
      'debug-overflow', 'debug-glass', 'debug-breakpoints',
      'debug-horizontal-scroll'
    );
  }
}

// Auto-initialize in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.layoutDebugger = new LayoutDebugger();
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.layoutDebugger.init();
    });
  } else {
    window.layoutDebugger.init();
  }
  
  // Global access for console debugging
  window.debugLayout = {
    analyze: () => window.layoutDebugger.analyzeLayoutIssues(),
    export: () => window.layoutDebugger.exportReport(),
    destroy: () => window.layoutDebugger.destroy()
  };
  
  console.log('🎨 Layout Debugger loaded! Use window.debugLayout for manual control.');
  console.log('Keyboard shortcuts: Ctrl+Shift+B (borders), Ctrl+Shift+G (grid), Ctrl+Shift+F (flex), Ctrl+Shift+O (overflow), Ctrl+Shift+A (analyze)');
}

export default LayoutDebugger;
