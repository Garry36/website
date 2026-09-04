// ERPrath Enterprise ERP - Interactive Script
document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navbar Scroll Effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      if (navMenu.style.display === 'flex') {
        navMenu.style.display = 'none';
      } else {
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.background = '#0f172a';
        navMenu.style.padding = '1.5rem';
        navMenu.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
      }
    });
  }

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

  dashTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dashTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const view = tab.dataset.tab;
      
      if (dashData[view]) {
        kpiOee.innerHTML = `${dashData[view].oee} <span class="kpi-trend trend-up">${dashData[view].oeeTrend}</span>`;
        kpiInventory.innerHTML = `${dashData[view].inv} <span class="kpi-trend trend-up">${dashData[view].invTrend}</span>`;
        kpiOrders.innerHTML = `${dashData[view].orders} <span class="kpi-trend trend-up">${dashData[view].ordersTrend}</span>`;
        kpiGst.innerHTML = `${dashData[view].gst} <span class="kpi-trend trend-up">${dashData[view].gstTrend}</span>`;
      }
    });
  });

  // 4. Manufacturing ROI Calculator
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
      demoModal.classList.add('active');
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
          demoModal.classList.remove('active');
          
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
        demoModal.classList.remove('active');
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
});
