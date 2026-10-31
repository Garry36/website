// ERPrath Enterprise ERP - Interactive Script
document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navbar Scroll Effect + Back-to-Top visibility + Dynamic Sticky Bottom Price Bar
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('backToTop');
  const bottomPriceBar = document.getElementById('bottomPriceBar');
  const globalSection = document.getElementById('global');
  const priceBarDismiss = document.getElementById('priceBarDismiss');
  let priceBarDismissed = false;
  try {
    priceBarDismissed = sessionStorage.getItem('erprath_pricebar_dismissed') === 'true';
  } catch (e) {}

  if (priceBarDismiss && bottomPriceBar) {
    priceBarDismiss.addEventListener('click', () => {
      priceBarDismissed = true;
      try {
        sessionStorage.setItem('erprath_pricebar_dismissed', 'true');
      } catch (e) {}
      bottomPriceBar.classList.remove('visible');
      document.body.classList.remove('price-bar-active');
      bottomPriceBar.setAttribute('aria-hidden', 'true');
    });
  }

  // Smooth scroll for price-bar-link
  const priceBarLinks = document.querySelectorAll('.price-bar-link[href^="#"]');
  priceBarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const offset = window.innerWidth < 1025 ? 70 : 90;
          window.scrollTo({ top: targetEl.offsetTop - offset, behavior: 'smooth' });
        }
      }
    });
  });

  const updatePriceBar = () => {
    if (!bottomPriceBar || !globalSection || priceBarDismissed) return;
    const rect = globalSection.getBoundingClientRect();
    // Activates when scrolling reaches #global onward (when top of #global enters viewport)
    const shouldShow = rect.top <= window.innerHeight * 0.8;
    if (shouldShow) {
      if (!bottomPriceBar.classList.contains('visible')) {
        bottomPriceBar.classList.add('visible');
        document.body.classList.add('price-bar-active');
        bottomPriceBar.setAttribute('aria-hidden', 'false');
      }
    } else {
      if (bottomPriceBar.classList.contains('visible')) {
        bottomPriceBar.classList.remove('visible');
        document.body.classList.remove('price-bar-active');
        bottomPriceBar.setAttribute('aria-hidden', 'true');
      }
    }
  };

  let scrollScheduled = false;

  window.addEventListener('scroll', () => {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(() => {
      if (navbar) {
        if (window.scrollY > 40) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
      if (backToTopBtn) {
        backToTopBtn.classList.toggle('visible', window.scrollY > 500);
      }
      updatePriceBar();
      scrollScheduled = false;
    });
  }, { passive: true });

  // Initial check on load
  updatePriceBar();

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
  const spySections = ['overview', 'modules', 'industries', 'pricing', 'catalogue', 'calculator', 'compare', 'faq'];
  const spyLinks = new Map();
  const allNavLinks = document.querySelectorAll('.nav-link');
  spySections.forEach(id => {
    const link = document.querySelector('.nav-link[href="#' + id + '"]')
      || (id === 'overview' ? document.querySelector('.nav-link[href="index.html"]') : null);
    if (link) spyLinks.set(id, link);
  });
  if (spyLinks.size) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Clear every nav link first so page links (e.g. Home) don't stay active too.
          allNavLinks.forEach(l => l.classList.remove('active'));
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

  // 2c. Keyboard support: Escape closes the mobile menu
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (navMenu && navMenu.classList.contains('active')) {
      if (mobileToggle && typeof mobileToggle._closeMenu === 'function') {
        mobileToggle._closeMenu();
      } else {
        navMenu.classList.remove('active');
        if (mobileToggle) {
          mobileToggle.setAttribute('aria-expanded', 'false');
          mobileToggle.setAttribute('aria-label', 'Open menu');
          // Text-glyph toggles get reset; icon toggles (with <span> bars) keep their markup.
          if (!mobileToggle.querySelector('span')) mobileToggle.textContent = '☰';
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

  // 5. Contact form submission
  const demoForm = document.getElementById('demoForm');
  const toast = document.getElementById('toast');

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
          // Show Toast Notification
          if (toast) {
            const toastIcon = toast.querySelector('.toast-icon');
            const toastHeading = toast.querySelector('h5');
            const toastMessage = toast.querySelector('p');
            if (toastIcon) toastIcon.textContent = '✓';
            if (toastHeading) toastHeading.textContent = 'Demo Request Received!';
            if (toastMessage) {
              toastMessage.textContent = 'Thank you! Our ERP solution team will contact you shortly.';
            }
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
        if (toast) {
          const toastIcon = toast.querySelector('.toast-icon');
          const toastHeading = toast.querySelector('h5');
          const toastMessage = toast.querySelector('p');
          if (toastIcon) toastIcon.textContent = '!';
          if (toastHeading) toastHeading.textContent = 'Submission Failed';
          if (toastMessage) {
            toastMessage.textContent = 'We could not send your request. Please try again or email info@erprath.com.';
          }
          toast.classList.add('active');
          setTimeout(() => {
            toast.classList.remove('active');
            if (toastIcon) toastIcon.textContent = '✓';
            if (toastHeading) toastHeading.textContent = 'Demo Request Received!';
            if (toastMessage) {
              toastMessage.textContent = 'Thank you! Our ERP solution team will contact you shortly.';
            }
          }, 5000);
        }
        // Keep the form filled in so the visitor can retry without re-entering details.
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

      const match = original.trim().match(/^([^0-9]*)([\d,.]+)(.*)$/);
      if (!match) return;

      const [, prefix, digits, suffix] = match;
      // Count decimal places (digits after the dot), not the number of dots.
      const decimals = (digits.split('.')[1] || '').length;
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
      catalogueCount.textContent = `Showing ${visible} of 200+ solutions`;
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
  // Match against the rendered chips instead of interpolating user input into a selector.
  const requestedChip = requestedCat
    ? Array.from(filterChips).find(chip => chip.dataset.filter === requestedCat) || null
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
            const parts = new Intl.DateTimeFormat('en-GB', {
              timeZone: tz,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
              timeZoneName: 'shortOffset'
            }).formatToParts(now);
            const part = type => {
              const found = parts.find(p => p.type === type);
              return found ? found.value : '';
            };
            const timeStr = `${part('hour')}:${part('minute')}:${part('second')}`;
            const zone = part('timeZoneName');
            timeEl.textContent = zone ? `${timeStr} ${zone}` : timeStr;
          } catch (e) {
            // Older browsers may not support shortOffset; still show local time.
            try {
              timeEl.textContent = new Intl.DateTimeFormat('en-GB', {
                timeZone: tz,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
              }).format(now);
            } catch (e2) {
              // Leave the placeholder if the timezone is unsupported.
            }
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

  // 13. Interactive Hero Job Card Hotspot Inspector
  const hotspotBtns = document.querySelectorAll('.hotspot-pin-btn');
  const inspectorBadge = document.getElementById('inspectorBadge');
  const inspectorTitle = document.getElementById('inspectorTitle');
  const inspectorDesc = document.getElementById('inspectorDesc');
  const inspectorStat = document.getElementById('inspectorStat');
  const prevHotspotBtn = document.getElementById('prevHotspotBtn');
  const nextHotspotBtn = document.getElementById('nextHotspotBtn');

  if (hotspotBtns.length && inspectorTitle && inspectorDesc && inspectorStat) {
    const hotspotData = {
      1: {
        badge: 'HOTSPOT 1: REAL-TIME MACHINE TELEMETRY',
        title: 'Automatic Spindle & Cycle Time Tracking (VMC-02)',
        desc: 'Operators tap to start their shift. The system automatically measures planned 48s cycle time vs actual elapsed time. If spindle idle time exceeds 6 minutes, an immediate reason code (Tool Change, Setup, Inspection) is logged without paper registers.',
        stat: '<span style="color: #067f37;">&#10003; Floor Impact:</span> Eliminates 100% of end-of-shift paper logbook faking'
      },
      2: {
        badge: 'HOTSPOT 2: HEAT TREATMENT & TOLERANCE GATE',
        title: 'Furnace Soak Temperature & Pyrometry Gate (860°C)',
        desc: 'Batch #2/4 cannot advance to OP 30 CNC Grind until the calibrated thermocouple log confirms 860°C soak for 45 minutes and Rockwell hardness tests yield 45-48 HRC. Defective heat runs are locked instantly on the line.',
        stat: '<span style="color: #067f37;">&#10003; Floor Impact:</span> Zero customer rejections from soft-core metallurgical flaws'
      },
      3: {
        badge: 'HOTSPOT 3: RAW MATERIAL RECONCILIATION & SCRAP',
        title: 'Tight EN-24 Billet Material Yield & Scrap Control',
        desc: '120.0 kg inward billet yielded 500 pcs with precisely 1.8 kg (1.5%) turnings discard. Any scrap surge over 2.0% automatically alerts the plant manager before the afternoon melt report.',
        stat: '<span style="color: #067f37;">&#10003; Floor Impact:</span> Recover ₹18,000–₹42,000 monthly in unaccounted alloy scrap loss'
      },
      4: {
        badge: 'HOTSPOT 4: 1D/2D BARCODE TRACEABILITY',
        title: 'Instant Job Card Handover via Standard 2D Barcode',
        desc: 'Floor supervisors scan the laminated route card with any standard ₹1,200 USB barcode scanner or Android rugged PDA. Instantly commits part counts, tool wear, and operator ID to the central database.',
        stat: '<span style="color: #067f37;">&#10003; Floor Impact:</span> 0.4 second routing transfers with zero keyboard typing errors'
      }
    };

    let activeHotspotIndex = 1;

    const renderHotspot = (id) => {
      activeHotspotIndex = parseInt(id, 10);
      const data = hotspotData[activeHotspotIndex];
      if (!data) return;

      hotspotBtns.forEach(btn => {
        const btnId = parseInt(btn.getAttribute('data-hotspot'), 10);
        btn.classList.toggle('active', btnId === activeHotspotIndex);
      });

      if (inspectorBadge) {
        inspectorBadge.innerHTML = `<span class="pulse-beacon" style="width: 6px; height: 6px; background: var(--primary); border-radius: 50%;"></span> ${data.badge}`;
      }
      inspectorTitle.textContent = data.title;
      inspectorDesc.textContent = data.desc;
      inspectorStat.innerHTML = data.stat;
    };

    hotspotBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-hotspot');
        renderHotspot(id);
      });
    });

    if (prevHotspotBtn) {
      prevHotspotBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let target = activeHotspotIndex - 1;
        if (target < 1) target = 4;
        renderHotspot(target);
      });
    }

    if (nextHotspotBtn) {
      nextHotspotBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let target = activeHotspotIndex + 1;
        if (target > 4) target = 1;
        renderHotspot(target);
      });
    }
  }

  // 14. Silent Shop-Floor Bleed Calculator
  const machineSlider = document.getElementById('calcMachines');
  const materialSlider = document.getElementById('calcMaterial');
  const idleSlider = document.getElementById('calcIdle');

  const machineValEl = document.getElementById('calcMachinesVal');
  const materialValEl = document.getElementById('calcMaterialVal');
  const idleValEl = document.getElementById('calcIdleVal');

  const totalBleedEl = document.getElementById('totalBleedVal');
  const scrapBleedEl = document.getElementById('scrapBleedVal');
  const idleBleedEl = document.getElementById('idleBleedVal');
  const jobworkBleedEl = document.getElementById('jobworkBleedVal');
  const daysToEqualEl = document.getElementById('daysToEqualERP');

  if (machineSlider && materialSlider && idleSlider && totalBleedEl) {
    const formatINR = (val) => {
      return '₹' + Math.round(val).toLocaleString('en-IN');
    };

    const updateBleedCalc = () => {
      const machines = parseInt(machineSlider.value, 10);
      const materialSpendLakhs = parseFloat(materialSlider.value);
      const materialSpend = materialSpendLakhs * 100000;
      const idleMins = parseInt(idleSlider.value, 10);

      if (machineValEl) machineValEl.textContent = `${machines} Cells`;
      if (materialValEl) materialValEl.textContent = `₹${materialSpendLakhs.toFixed(1)} Lakhs/mo`;
      if (idleValEl) idleValEl.textContent = `${idleMins} Mins/shift`;

      // 1. Scrap reconciliation variance (1.8% average unaccounted runner/burr/turnings)
      const scrapLoss = materialSpend * 0.018;

      // 2. Ghost machine idle time (2 shifts, 26 days/mo, machine hour rate ₹450)
      const idleLoss = machines * (idleMins / 60) * 2 * 26 * 450;

      // 3. Delayed job-work 54(4) material reconciliation & rejection dispute (1.0%)
      const jobworkLoss = materialSpend * 0.01;

      const totalMonthlyBleed = scrapLoss + idleLoss + jobworkLoss;

      // Days to equal annual ERPrath Standard Plan (₹25,000)
      const dailyBleed = totalMonthlyBleed / 30;
      const daysToEqual = Math.max(1, Math.round(25000 / dailyBleed));

      if (totalBleedEl) totalBleedEl.textContent = `${formatINR(totalMonthlyBleed)} / mo`;
      if (scrapBleedEl) scrapBleedEl.textContent = formatINR(scrapLoss);
      if (idleBleedEl) idleBleedEl.textContent = formatINR(idleLoss);
      if (jobworkBleedEl) jobworkBleedEl.textContent = formatINR(jobworkLoss);
      if (daysToEqualEl) daysToEqualEl.textContent = `${daysToEqual} days`;
    };

    machineSlider.addEventListener('input', updateBleedCalc);
    materialSlider.addEventListener('input', updateBleedCalc);
    idleSlider.addEventListener('input', updateBleedCalc);

    updateBleedCalc();
  }
});
