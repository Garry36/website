// ERPrath Enterprise ERP - Interactive Script
document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navbar Scroll Effect + Back-to-Top visibility (rAF-throttled)
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('backToTop');
  let scrollScheduled = false;

  window.addEventListener('scroll', () => {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(() => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      if (backToTopBtn) {
        backToTopBtn.classList.toggle('visible', window.scrollY > 500);
      }
      scrollScheduled = false;
    });
  }, { passive: true });

  // 2. Mobile Menu Toggle & Auto-Close (Supports #mobileToggle, #burgerMenu)
  const mobileToggle = document.getElementById('mobileToggle') || document.getElementById('burgerMenu') || document.querySelector('.mobile-toggle, .burger-menu');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggle && navMenu) {
    const hasSpans = mobileToggle.querySelector('span') !== null;
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      mobileToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      if (!hasSpans) {
        mobileToggle.textContent = isOpen ? '✕' : '☰';
      }
    });

    // Close menu when clicking nav links
    const navLinks = navMenu.querySelectorAll('.nav-link, a');
    const closeMenu = () => {
      navMenu.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.setAttribute('aria-label', 'Open menu');
      if (!hasSpans) {
        mobileToggle.textContent = '☰';
      }
    };
    mobileToggle._closeMenu = closeMenu;

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });

      // Smooth scroll offset-aware (account for fixed navbar)
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            const offset = window.innerWidth < 1025 ? 70 : 90;
            window.scrollTo({ top: targetEl.offsetTop - offset, behavior: 'smooth' });
          }
        }
      });
    });

    // Close menu when tapping outside of it or pressing Escape
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') &&
          !navMenu.contains(e.target) &&
          !mobileToggle.contains(e.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  // 2a. Scroll-spy: highlight the nav link of the section in view
  const spySections = ['overview', 'modules', 'industries', 'configurator', 'catalogue', 'calculator', 'compare', 'faq'];
  const spyLinks = new Map();
  spySections.forEach(id => {
    const link = document.querySelector('.nav-link[href="#' + id + '"]');
    if (link) spyLinks.set(id, link);
  });
  if (spyLinks.size) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          spyLinks.forEach(l => l.classList.remove('active'));
          const active = spyLinks.get(entry.target.id);
          if (active) active.classList.add('active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    spySections.forEach(id => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  // 2b. Back to Top Button
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 2c. Keyboard support: Escape closes modal & mobile menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const demoModal = document.getElementById('demoModal');
      if (demoModal) demoModal.classList.remove('active');
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (mobileToggle) {
          mobileToggle.setAttribute('aria-expanded', 'false');
          mobileToggle.setAttribute('aria-label', 'Open menu');
          mobileToggle.textContent = '☰';
        }
      }
    }
  });

  // 2b. FAQ Accordion Toggle
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const faqItem = btn.parentElement;
      const isActive = faqItem.classList.contains('active');
      
      // Close other items
      document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));
      document.querySelectorAll('.faq-question').forEach(q => q.setAttribute('aria-expanded', 'false'));

      if (!isActive) {
        faqItem.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      } else {
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // 3. Dashboard Interactive Tabs
  const dashTabs = document.querySelectorAll('.dash-tab');
  const kpiOee = document.getElementById('kpiOee');
  const kpiInventory = document.getElementById('kpiInventory');
  const kpiOrders = document.getElementById('kpiOrders');
  const kpiGst = document.getElementById('kpiGst');

  const dashData = {
    mfg: {
      oee: '88.4%', oeeTrend: '+4.2%',
      inv: '₹ 1.42 Cr', invTrend: '-8.5%',
      orders: '148 Active', ordersTrend: '+12',
      gst: '100% Verified', gstTrend: '12 E-Invoices'
    },
    inv: {
      oee: '99.1%', oeeTrend: 'Accuracy',
      inv: '42,500 Units', invTrend: 'In Stock',
      orders: '14 Low Stock', ordersTrend: 'Reorder Alert',
      gst: '0% Stockout', gstTrend: 'Optimal'
    },
    fin: {
      oee: '₹ 3.85 Cr', oeeTrend: 'Monthly Rev',
      inv: '₹ 42.5 L', invTrend: 'Receivables',
      orders: '100% Tax', ordersTrend: 'GST Ready',
      gst: 'Zero Penalty', gstTrend: 'E-Way Sync'
    }
  };

  let currentView = 'mfg';

  dashTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dashTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const view = tab.dataset.tab;
      currentView = view;
      
      if (dashData[view]) {
        kpiOee.innerHTML = `${dashData[view].oee} <span class="kpi-trend trend-up">${dashData[view].oeeTrend}</span>`;
        kpiInventory.innerHTML = `${dashData[view].inv} <span class="kpi-trend trend-up">${dashData[view].invTrend}</span>`;
        kpiOrders.innerHTML = `${dashData[view].orders} <span class="kpi-trend trend-up">${dashData[view].ordersTrend}</span>`;
        kpiGst.innerHTML = `${dashData[view].gst} <span class="kpi-trend trend-up">${dashData[view].gstTrend}</span>`;
      }
    });
  });

    // Trend badges pulse-menu: simulate live sensor drift so the dashboard feels alive
    let oeeDrift = 88.4;
    setInterval(() => {
      if (document.hidden || currentView !== 'mfg' || !kpiOee) return; // zero work on hidden tabs
      oeeDrift = Math.min(90.2, Math.max(87.6, oeeDrift + (Math.random() - 0.5) * 0.5));
      kpiOee.innerHTML = `${oeeDrift.toFixed(1)}% <span class="kpi-trend trend-up">${dashData.mfg.oeeTrend}</span>`;
    }, 4000);

  const revenueSlider = document.getElementById('revenueSlider');
  const revenueVal = document.getElementById('revenueVal');
  const plantCountSlider = document.getElementById('plantCountSlider');
  const plantCountVal = document.getElementById('plantCountVal');
  
  const annualSavings = document.getElementById('annualSavings');
  const prodEfficiency = document.getElementById('prodEfficiency');
  const stockoutDrop = document.getElementById('stockoutDrop');

  function calculateROI() {
    const rev = parseFloat(revenueSlider.value); // In Crores
    const plants = parseInt(plantCountSlider.value);

    revenueVal.textContent = `₹ ${rev} Cr`;
    plantCountVal.textContent = `${plants} ${plants === 1 ? 'Plant' : 'Plants'}`;

    // Estimated annual savings calculation logic (~4.5% to 6% of revenue optimization)
    const savingsInLakhs = Math.round((rev * 0.052 * 100) + (plants * 8.5));
    annualSavings.textContent = `₹ ${savingsInLakhs} Lakhs`;

    // Dynamic metrics
    const effBoost = Math.min(42, 24 + plants * 3);
    const wasteRed = Math.min(85, 60 + Math.round(rev * 0.8));

    prodEfficiency.textContent = `+${effBoost}%`;
    stockoutDrop.textContent = `-${wasteRed}%`;

    // Pop feedback on the savings figure while dragging
    annualSavings.classList.remove('pop');
    void annualSavings.offsetWidth; // reflow to restart transition
    annualSavings.classList.add('pop');
    setTimeout(() => annualSavings.classList.remove('pop'), 160);
  }

  if (revenueSlider && plantCountSlider) {
    revenueSlider.addEventListener('input', calculateROI);
    plantCountSlider.addEventListener('input', calculateROI);
    calculateROI(); // Initial run
  }

  // 5. Demo Request Modal Logic
  const demoModal = document.getElementById('demoModal');
  const openModalBtns = document.querySelectorAll('.open-demo-modal');
  const closeModalBtn = document.getElementById('closeModal');
  const demoForm = document.getElementById('demoForm');
  const toast = document.getElementById('toast');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!demoModal) return;
      demoModal.classList.add('active');
      // Close mobile menu behind the modal
      if (mobileToggle && mobileToggle._closeMenu && navMenu.classList.contains('active')) {
        mobileToggle._closeMenu();
      }
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      demoModal.classList.remove('active');
    });
  }

  if (demoModal) {
    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) {
        demoModal.classList.remove('active');
      }
    });
  }

  if (demoForm) {
    demoForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = demoForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerText;
      submitBtn.innerText = 'Submitting Request...';
      submitBtn.disabled = true;

      const formData = new FormData(demoForm);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();

        if (result.success) {
          if (demoModal) demoModal.classList.remove('active');

          // Show Toast Notification
          if (toast) {
            toast.querySelector('h5').textContent = 'Demo Request Received!';
            toast.querySelector('p').textContent = 'Thank you! Our ERP solution team will contact you shortly.';
            toast.classList.add('active');
            setTimeout(() => {
              toast.classList.remove('active');
            }, 5000);
          }
          demoForm.reset();
        } else {
          alert('Submission Error: ' + (result.message || 'Please try again later.'));
        }
      } catch (err) {
        console.error('Web3Forms submit error:', err);
        if (demoModal) demoModal.classList.remove('active');
        if (toast) {
          toast.classList.add('active');
          setTimeout(() => {
            toast.classList.remove('active');
          }, 5000);
        }
        demoForm.reset();
      } finally {
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }

  // 6. Apple-style Scroll Reveal — auto-applied, staggered per grid
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealTargets = document.querySelectorAll(
    '.section-header, .module-card, .industry-card, .seo-knowledge-card, .stat-item, .roi-box, .comparison-table-wrap, .faq-item, .cta-banner'
  );

  document.querySelectorAll('.modules-grid, .industries-grid, .seo-knowledge-grid, .stats-grid, .faq-grid').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      child.style.setProperty('--reveal-delay', `${Math.min(i * 0.08, 0.4)}s`);
    });
  });

  if (!reduceMotion && 'IntersectionObserver' in window) {
    revealTargets.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('visible');
        revealObserver.unobserve(el);

        // Clear animation classes after play so hover transforms work afterwards
        el.addEventListener('animationend', () => {
          el.classList.remove('reveal', 'visible');
          el.style.removeProperty('--reveal-delay');
        }, { once: true });
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(el => revealObserver.observe(el));
  }

  // 7. Animated Stat Counters (250+ / 28% / ₹850 Cr+ / 99.9%)
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      counterObserver.unobserve(entry.target);

      const el = entry.target;
      const original = el.dataset.original || el.textContent;
      el.dataset.original = original;

      const match = original.match(/([₹€$]?)([\d,.]+)(.*)/);
      if (!match) return;

      const [, prefix, digits, suffix] = match;
      const decimals = (digits.match(/\./g) || []).length;
      const target = parseFloat(digits.replace(/,/g, ''));
      if (isNaN(target)) return;

      if (reduceMotion) {
        el.textContent = original;
        return;
      }

      function formatValue(v) {
        return decimals
          ? v.toFixed(decimals)
          : v.toLocaleString('en-IN');
      }

      const duration = 1600;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4); // ease-out quart
        el.textContent = prefix + formatValue(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = original; // settle on exact original string
      }

      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.stat-item h3').forEach(el => counterObserver.observe(el));

  // 8. Live Shop Floor Feed — items cycle to simulate a real-time feed
  const liveFeed = document.querySelector('.live-feed');
  if (liveFeed && !reduceMotion) {
    setInterval(() => {
      if (document.hidden) return; // zero work on hidden tabs
      const items = liveFeed.querySelectorAll('.feed-item');
      if (items.length < 2) return;
      const first = items[0];
      first.classList.add('fade-out');
      setTimeout(() => {
        liveFeed.appendChild(first);
        first.classList.remove('fade-out');
      }, 300);
    }, 5000);
  }

  // 9. Hero Glow Mouse Parallax (desktop, fine pointers only)
  const hero = document.querySelector('.hero');
  const glow1 = document.querySelector('.hero-glow-1');
  const glow2 = document.querySelector('.hero-glow-2');
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  if (hero && glow1 && glow2 && finePointer && !reduceMotion && window.innerWidth > 768) {
    let targetX = 0, targetY = 0, animating = false;
    const AMP = 45;

    hero.addEventListener('mousemove', (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;   // -1 to 1
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;

      if (!animating) {
        animating = true;
        requestAnimationFrame(() => {
          // Glows drift opposite directions for depth
          glow1.style.transform = `translate(${targetX * AMP}px, ${targetY * AMP}px)`;
          glow2.style.transform = `translate(${-targetX * AMP * 0.7}px, ${-targetY * AMP * 0.7}px)`;
          animating = false;
        });
      }
    }, { passive: true });

    hero.addEventListener('mouseleave', () => {
      glow1.style.transform = '';
      glow2.style.transform = '';
    }, { passive: true });
  }

  // 10. Other Solutions — industry filtering with animated results
  const filterChips = document.querySelectorAll('.filter-chip');
  const productCards = document.querySelectorAll('.product-card');
  const catalogueCount = document.getElementById('catalogueCount');

  function applyCatalogueFilter(category, animate) {
    let visible = 0;

    productCards.forEach((card, index) => {
      const match = category === 'all' || card.dataset.cat === category;
      card.classList.toggle('hidden', !match);

      if (match) {
        visible++;
        if (animate && !reduceMotion) {
          card.style.animation = 'none';
          void card.offsetWidth; // restart animation
          card.style.animation = `fadeInUp 0.45s ${Math.min(index * 0.03, 0.25)}s backwards`;
        }
      }
    });

    if (catalogueCount) {
      catalogueCount.textContent = `Showing ${visible} of 214 solutions`;
    }
  }

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-selected', 'false');
      });
      chip.classList.add('active');
      chip.setAttribute('aria-selected', 'true');
      applyCatalogueFilter(chip.dataset.filter, true);
    });
  });

  // Deep-link from the Industries page: solutions.html?cat=auto
  const requestedCat = new URLSearchParams(window.location.search).get('cat');
  const requestedChip = requestedCat
    ? document.querySelector(`.filter-chip[data-filter="${requestedCat}"]`)
    : null;

  if (requestedChip) {
    requestedChip.click();
  } else if (productCards.length) {
    applyCatalogueFilter('all', false);
  }

  // 11. Live Global Region Clocks (Stuttgart, Bangalore, Dubai, Singapore)
  const regionCards = document.querySelectorAll('.region-card[data-tz]');
  if (regionCards.length) {
    const updateRegionClocks = () => {
      const now = new Date();
      regionCards.forEach(card => {
        const tz = card.getAttribute('data-tz');
        const timeEl = card.querySelector('.region-time');
        if (timeEl && tz) {
          try {
            const timeStr = new Intl.DateTimeFormat('en-GB', {
              timeZone: tz,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            }).format(now);
            timeEl.textContent = `${timeStr} UTC`;
          } catch (e) {
            // fallback
          }
        }
      });
    };
    updateRegionClocks();
    setInterval(updateRegionClocks, 1000);
  }

  // 12. Global Edge Network Latency Simulator
  const latencyNodes = document.querySelectorAll('.ping-val');
  if (latencyNodes.length) {
    setInterval(() => {
      if (document.hidden) return;
      latencyNodes.forEach(node => {
        const base = parseInt(node.getAttribute('data-base') || '12', 10);
        const jitter = Math.floor((Math.random() - 0.5) * 3);
        const val = Math.max(1, base + jitter);
        node.textContent = `${val}ms`;
      });
    }, 2800);
  }

  // 13. Apple Store "Buy iPhone" Inspired Interactive Configurator & Sticky Summary Bar
  const configSection = document.getElementById('configurator');
  const stickyBar = document.getElementById('appleStickyBar');

  if (configSection && stickyBar) {
    const modelCards = configSection.querySelectorAll('.apple-model-cards .apple-select-card');
    const swatches = configSection.querySelectorAll('.apple-swatches-row .apple-swatch-item');
    const capCards = configSection.querySelectorAll('.apple-capacity-grid .apple-cap-card');
    const tradeinCards = configSection.querySelectorAll('.apple-tradein-options .apple-tradein-card');

    const previewBadge = document.getElementById('previewEditionBadge');
    const previewTitle = document.getElementById('previewDeviceTitle');
    const previewDesc = document.getElementById('previewDeviceDesc');
    const previewOee = document.getElementById('previewOee');
    const previewStockout = document.getElementById('previewStockout');
    const previewIndustryFeature = document.getElementById('previewIndustryFeature');
    const finishLabel = document.getElementById('appleFinishLabel');

    const livePriceDisplay = document.getElementById('appleLivePriceDisplay');
    const liveRoiDisplay = document.getElementById('appleLiveRoiDisplay');
    const stickySummaryText = document.getElementById('appleStickySummaryText');
    const stickyPrice = document.getElementById('appleStickyPrice');
    const stickySavings = document.getElementById('appleStickySavings');

    let state = {
      model: 'core',
      modelName: 'ERPrath Industrial Core',
      basePrice: 45000,
      baseRoi: 1.42,
      vertical: 'auto',
      verticalName: 'Auto Components',
      verticalFeature: 'VDA 4905 EDI & Subcontracting Ready',
      scale: '1',
      scaleLabel: '1 Plant',
      scaleMult: 1.0,
      migration: 'yes'
    };

    function updateAppleConfigurator() {
      // Calculate dynamic price & ROI
      const totalMonthly = Math.round(state.basePrice * state.scaleMult - (state.migration === 'yes' ? 4000 : 0));
      const totalRoiCr = (state.baseRoi * state.scaleMult).toFixed(2);

      // Format currency
      const formattedPrice = `₹${totalMonthly.toLocaleString('en-IN')}/mo.`;
      const formattedRoi = `₹${totalRoiCr} Cr`;

      if (livePriceDisplay) livePriceDisplay.textContent = formattedPrice;
      if (liveRoiDisplay) liveRoiDisplay.textContent = formattedRoi;

      if (stickyPrice) stickyPrice.textContent = formattedPrice;
      if (stickySavings) stickySavings.textContent = `Est. ${formattedRoi}/yr ROI`;
      if (stickySummaryText) {
        stickySummaryText.textContent = `${state.modelName} · ${state.verticalName} · ${state.scaleLabel}`;
      }

      // Update sticky preview frame
      if (previewBadge) previewBadge.textContent = state.modelName;
      if (previewTitle) {
        previewTitle.textContent = state.model === 'core' 
          ? 'Single-Facility Production Core' 
          : 'Multi-Plant Autonomous Cloud Mesh';
      }
      if (previewDesc) {
        previewDesc.textContent = state.model === 'core'
          ? 'Configured for precision discrete manufacturing with shop-floor MRP, live inventory valuation, and automated GST compliance.'
          : 'Configured for multi-site industrial groups with real-time PLC/CNC spindle telemetry, VDA EDI, and global consolidation.';
      }
      if (previewOee) previewOee.textContent = state.model === 'core' ? '+28.5%' : '+38.4%';
      if (previewStockout) previewStockout.textContent = state.model === 'core' ? '-65%' : '-82%';
      if (previewIndustryFeature) previewIndustryFeature.textContent = state.verticalFeature;
      if (finishLabel) finishLabel.textContent = state.verticalName;
    }

    // Step 1: Model Selection
    modelCards.forEach(card => {
      card.addEventListener('click', () => {
        modelCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state.model = card.dataset.model;
        state.modelName = card.dataset.model === 'core' ? 'ERPrath Industrial Core' : 'ERPrath Enterprise Mesh';
        state.basePrice = parseFloat(card.dataset.basePrice);
        state.baseRoi = parseFloat(card.dataset.baseRoi);
        updateAppleConfigurator();
      });
    });

    // Step 2: Swatch Selection
    swatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        swatches.forEach(s => s.classList.remove('selected'));
        swatch.classList.add('selected');
        state.vertical = swatch.dataset.vertical;
        state.verticalName = swatch.dataset.name;
        state.verticalFeature = swatch.dataset.feature;
        updateAppleConfigurator();
      });
    });

    // Step 3: Capacity Selection
    capCards.forEach(card => {
      card.addEventListener('click', () => {
        capCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state.scale = card.dataset.scale;
        state.scaleLabel = card.dataset.label;
        state.scaleMult = parseFloat(card.dataset.scaleMult);
        updateAppleConfigurator();
      });
    });

    // Step 4: Trade-In Selection
    tradeinCards.forEach(card => {
      card.addEventListener('click', () => {
        tradeinCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state.migration = card.dataset.migration;
        updateAppleConfigurator();
      });
    });

    // Sticky Summary Bar Scroll Reveal (Apple Buy iPhone pattern)
    const toggleStickyBar = () => {
      const scrollPos = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Reveal sticky bar once user scrolls past 350px
      if (scrollPos > 350 && scrollPos < docHeight - 250) {
        stickyBar.classList.add('active');
      } else {
        stickyBar.classList.remove('active');
      }
    };

    window.addEventListener('scroll', toggleStickyBar, { passive: true });
    updateAppleConfigurator();
  }
});
