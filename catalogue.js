/* ============================================================
   ERPrath Product Catalogue — 200+ premium digital solutions
   Renders into #productGrid. Data-driven for performance:
   the HTML stays light and the grid is built in one pass.
   ============================================================ */
(function () {
  'use strict';

  var CATEGORIES = {
    core: {
      prefix: 'CORE', start: 101, label: 'Platform Core',
      items: [
        ['CogniBOM\u2122 Suite', 'Graph-based BOM intelligence with impact simulation across 12 revision levels.'],
        ['Synapse MRP Engine', 'Self-tuning material planning that adapts to supplier lead-time drift.'],
        ['Apex OEE Cloud', 'Edge-computed OEE with auto-detected downtime reasons from PLC telemetry.'],
        ['Quantum Nesting', 'Constraint-solver nesting that lifts sheet yield by up to 9.4%.'],
        ['Sentinel Trace', 'Zero-trust batch genealogy with immutable, tamper-evident audit anchoring.'],
        ['Orbit WMS', 'Bin-level warehouse orchestration with autonomous put-away logic.'],
        ['Prism Analytics', 'Executive telemetry with drill-through to any transaction in three clicks.'],
        ['Atlas Compliance', 'One console for GST, e-way, DPDP and GDPR obligations.'],
        ['Kinetic Scheduler', 'Finite-capacity scheduling that re-plans around breakdowns in real time.'],
        ['Fusion Costing', 'Activity-based product costing with live variance attribution.'],
        ['Aether Portal', 'Buyer and supplier self-service with SSO and granular access scopes.'],
        ['Titan Throughput', 'Digital-twin throughput simulation for capital and capacity decisions.'],
        ['Nova Forecast', 'Demand sensing from orders, seasons and distributor signals.'],
        ['Zenith Quality', 'Closed-loop CAPA with statistical process control overlays.'],
        ['Pulse IoT Gateway', 'Sub-second PLC, weighbridge and energy-meter ingestion at the edge.'],
        ['Delta Energy', 'Machine-level kWh attribution with tariff-aware load shifting.'],
        ['Axiom Credit', 'Credit exposure under continuous scoring with automatic holds at limit.'],
        ['Vertex Transfer', 'Inter-plant transfer orchestration with in-transit ledger integrity.'],
        ['Echo Maintenance', 'Predictive maintenance from vibration, thermal and cycle spectra.'],
        ['Lumen ESG', 'Scope-1 and Scope-2 carbon ledger mapped to BRSR disclosures.'],
        ['Strata Insights', 'Semantic layer powering every dashboard from one metric definition.'],
        ['Nexus Supplier', 'Supplier risk graph scored on delivery, quality and ESG performance.'],
        ['Halo Inspection', 'Camera-assisted in-process inspection with defect clustering.'],
        ['Meridian GST', 'NIC-integrated e-invoicing designed reconciliation-first.'],
        ['Catalyst CPS', 'Cyber-physical bridge connecting legacy machines without retrofits.'],
        ['Aurora Dashboards', 'Role-aware command centres with anomaly-first layouts.'],
        ['Kepler Simulation', 'What-if modelling for routing, shifts and overtime decisions.'],
        ['Vector APQP', 'Stage-gated launch workspace with structured evidence capture.'],
        ['Beacon Mobility', 'Offline-first shop-floor app with conflict-safe synchronisation.'],
        ['Cipher Vault', 'Field-level encryption, immutable logs and zero-trust access control.'],
        ['Ledger Bridge', 'Two-way posting to Tally Prime, SAP and direct bank feeds.'],
        ['Echo Signature', 'eSign and digital approval chains with tamper-evident trails.'],
        ['Vector Labels', 'GS1-compliant barcode and QR generation at print-line speed.'],
        ['Orbit Sandbox', 'Isolated replica environments for safe change management.']
      ]
    },
    auto: {
      prefix: 'AUTO', start: 201, label: 'Auto & Machining',
      items: [
        ['Precision OEE Matrix', 'Spindle-level OEE across CNC cells with shift-benchmarked baselines.'],
        ['Carbide Sentinel', 'Tool-life telemetry from load signatures with regrind forecasting.'],
        ['Launch Gate APQP', 'PPAP packs, control plans and OEM schedule sync in one workspace.'],
        ['Cycle Sync', 'Real-time cycle-time deviation alerts per workstation and part family.'],
        ['Spindle Health AI', 'Bearing-fault prediction from acoustic and vibration spectra.'],
        ['Torque Ledger', 'Fastener torque traceability per VIN with audit-ready export.'],
        ['Gauge Cloud', 'Calibration schedules, MSA studies and gauge R&R automation.'],
        ['Line Balance Studio', 'Operator-to-station balancing across mixed-model assembly lines.'],
        ['Kanban Pulse', 'e-Kanban replenishment driven by consumption and transit buffers.'],
        ['Heat Treat Tracker', 'Furnace batch recipes with quench-time and hardness genealogy.'],
        ['Paint Shop Analytics', 'Booth efficiency, film-thickness statistics and rework attribution.'],
        ['Weld Integrity Suite', 'Weld-parameter capture with NDT result linkage.'],
        ['Casting Yield Engine', 'Yield, rejection and riser optimisation by pattern.'],
        ['Gear Metrology Cloud', 'CMM result ingestion with SPC drift detection.'],
        ['Tier-1 Schedule Bridge', 'OEM EDI schedule ingestion with automatic acknowledgement.'],
        ['Tool Crib Optimizer', 'Consumable demand forecasting and automated reorder points.'],
        ['Cell Digital Twin', 'Simulated cell throughput before capital investment is committed.'],
        ['Rework Cost Radar', 'Rework loops quantified in rupees and lost capacity.'],
        ['Fastener Vision', 'Pick-to-light and vision verification for safety-critical fits.'],
        ['Poka Shield', 'Error-proofing rules enforced at every station scan.'],
        ['EOL Test Gateway', 'End-of-line test capture with automatic quarantine on failure.'],
        ['Warranty Loop', 'Field-failure feedback wired back into BOM revision decisions.'],
        ['Lubricant Ledger', 'Machine-wise lubrication schedules with consumption analytics.'],
        ['Shift Command', 'Handover notes, safety checks and production snapshots by shift.'],
        ['Downtime Genome', 'Root-cause clustering across 18 months of stoppage events.'],
        ['Cavity Counter', 'High-volume part counting with weight-based reconciliation.'],
        ['Fixture Registry', 'Fixture life, usage and calibration in one searchable register.'],
        ['Subcontract Flow', 'Job-work challans with scrap and recovery reconciliation.'],
        ['VIN Passport', 'Complete build record from raw casting to dispatch in one scan.'],
        ['Lean Cell Planner', 'Takt-time planning with operator walking-path heatmaps.']
      ]
    },
    pharma: {
      prefix: 'PHM', start: 301, label: 'Pharma & Chemicals',
      items: [
        ['Helix Recipe', 'Multi-level recipe scaling with controlled-variable envelopes.'],
        ['FEFO Engine', 'Expiry-first picking with quarantine-safe allocation logic.'],
        ['Vector eBMR', '21 CFR-aligned batch records with electronic sign-off.'],
        ['COA Studio', 'Auto-generated Certificates of Analysis bound to lab data.'],
        ['Stability Orbit', 'Accelerated and long-term study scheduling with OOS escalation.'],
        ['Cleanroom Guard', 'Environmental monitoring with excursion alerts and trend maps.'],
        ['Weigh Dispense', 'Barcode-verified dispensing with tolerance interlocks.'],
        ['Granulation Twin', 'Process-parameter simulation for confident scale-up decisions.'],
        ['Tablet Vision', 'Defect classification from inline camera feeds at press speed.'],
        ['Blister Integrity', 'Seal-strength and vision checks at packaging-line speed.'],
        ['Serialisation Hub', 'Track-and-trace aligned to global serialisation mandates.'],
        ['Cold Chain Pulse', 'Temperature-logged shipments with excursion evidence packs.'],
        ['Deviation Nexus', 'Deviation intake, triage and CAPA linkage in one flow.'],
        ['LIMS Bridge', 'Two-way laboratory synchronisation with sample-level traceability.'],
        ['Solvent Ledger', 'Solvent recovery, reuse ratios and loss accounting.'],
        ['Reactor Scheduler', 'Multi-purpose reactor allocation with cleaning windows.'],
        ['Yield Chemist', 'Reaction yield variance with batch-to-batch attribution.'],
        ['Formulation Vault', 'Version-controlled formulations with IP-grade access control.'],
        ['Trial Batch Lab', 'R&D-to-production handoff with full parameter provenance.'],
        ['Validation Compass', 'IQ/OQ/PQ evidence packs assembled automatically per audit.'],
        ['Pharmacovigilance Link', 'Complaint intake wired directly to batch genealogy.'],
        ['Dossier Builder', 'CTD-ready document assembly from live specifications.'],
        ['Audit Trail Guard', 'Tamper-evident logs with regulator-readable annotations.'],
        ['Label Integrity', 'Artwork version control with dispensing-time verification.'],
        ['Complaint Radar', 'Market complaint trends by product, site and lot.'],
        ['Pack Line OEE', 'Packaging efficiency with changeover-loss attribution.'],
        ['Hold & Release', 'Quarantine workflows with dual-authorisation release.'],
        ['Stability Inventory', 'Stability sample inventory with pull-schedule automation.'],
        ['Micro Tracker', 'Environmental and water testing cadence with auto-reminders.'],
        ['Batch Cost Lens', 'True batch cost including utilities, yield loss and QC.']
      ]
    },
    plastics: {
      prefix: 'PLS', start: 401, label: 'Plastics & Packaging',
      items: [
        ['Mould Life Matrix', 'Mould cycle counts, cavity output and maintenance thresholds.'],
        ['Resin Ledger', 'Virgin, regrind and masterbatch ratios enforced per job.'],
        ['Cavity Vision', 'Shot-weight and flash detection from inline inspection.'],
        ['Dryer Pulse', 'Dew-point and drying telemetry with automatic alarms.'],
        ['Cycle Genome', 'Cycle-time fingerprints that flag drift before scrap appears.'],
        ['Hot Runner Guard', 'Zone-level temperature control with deviation evidence.'],
        ['Toolroom Cloud', 'Mould repair history, spare inserts and turnaround tracking.'],
        ['Changeover Sprint', 'SMED choreography with sequenced tooling kits.'],
        ['Winder Analytics', 'Extrusion throughput with gauge-variance attribution.'],
        ['Film Gauge Twin', 'Thickness-profile simulation and die-bolt guidance.'],
        ['Blow Mould Ledger', 'Parison weights, cycle logs and scrap reconciliation.'],
        ['Rotomould Tracker', 'Oven cycle recipes with wall-thickness verification.'],
        ['Colour Match AI', 'Spectrophotometer-driven batch corrections in real time.'],
        ['Regrind Ratio Control', 'Verified recycled content per SKU for compliance reporting.'],
        ['Scrap Yield Engine', 'Trim and purging losses quantified per shift and machine.'],
        ['Pack Line Sync', 'Bag, box and pallet counts reconciled to dispatch.'],
        ['Die Life Sentinel', 'Extrusion die wear tracking correlated with quality outcomes.'],
        ['Material Trace Passport', 'Polymer lot genealogy from resin bag to finished pallet.'],
        ['Energy per Shot', 'kWh attribution at machine and mould level.'],
        ['Maintenance Orbit', 'Preventive schedules tuned to actual shot counts.'],
        ['Shift OEE Pulse', 'OEE by mould, machine and operator without manual logs.'],
        ['QC Sampling Smart', 'Sampling plans that adapt to live process capability.'],
        ['Mould Change Kit', 'Auto-sequenced tooling and document kits per changeover.'],
        ['Post-Process Portal', 'Printing, lamination and packing job visibility.'],
        ['Cavity Costing', 'Cost per cavity and per shot with margin clarity.'],
        ['Resin Forecast', 'Polymer demand sensing with price-benchmark overlays.'],
        ['Waste-to-Value', 'Regrind recovery routed back into production plans.'],
        ['Cooling Optimizer', 'Chiller load balancing against mould-temperature targets.'],
        ['Tool Compliance', 'Mould passports with certification and service history.'],
        ['Pack Label Verify', 'Label verification before dispatch, online or offline.']
      ]
    },
    electronics: {
      prefix: 'ELE', start: 501, label: 'Electricals & Electronics',
      items: [
        ['Serial Trace Cloud', 'Component genealogy from SMT reel to shipped unit.'],
        ['Test Station Gateway', 'Automated bench integration with fail-bin routing.'],
        ['SMT Command', 'Feeder, stencil and reflow telemetry per board type.'],
        ['Reflow Twin', 'Profile simulation against solder-joint quality outcomes.'],
        ['AOI Nexus', 'Defect clustering across lines, shifts and panel designs.'],
        ['X-Ray Insight', 'BGA void analysis linked to process parameters.'],
        ['Component Vault', 'MSL, ESD and lifecycle status for every part number.'],
        ['ECN Velocity', 'Engineering change impact across BOMs and open orders.'],
        ['PCB Cost Lens', 'Panel utilisation and yield-driven costing.'],
        ['Flex Assembly Cloud', 'Rigid-flex build records with bend-radius checks.'],
        ['Conformal Coat Guard', 'Coating thickness verification with lot-level evidence.'],
        ['Burn-In Orbit', 'Environmental stress screening schedules and results.'],
        ['Firmware Binding', 'Firmware-to-serial mapping with controlled rollback.'],
        ['ESD Sentinel', 'Static-control checks logged at every station entry.'],
        ['Warranty Bridge', 'Field returns traced to test-station signatures.'],
        ['Box Build Studio', 'Cable, harness and enclosure kits sequenced to plan.'],
        ['Harness Trace', 'Wire-level traceability with continuity test capture.'],
        ['RF Test Hub', 'Antenna and RF parameter capture per unit.'],
        ['Compliance Ledger', 'RoHS, REACH and conflict-mineral evidence per shipment.'],
        ['Obsolescence Radar', 'Last-time-buy alerts from lifecycle and demand data.'],
        ['Counterfeit Shield', 'Incoming component authentication and risk scoring.'],
        ['Line Balancing AI', 'Placement-rate balancing across SMT lines.'],
        ['Feeder Health', 'Nozzle and feeder wear prediction from pick errors.'],
        ['Panel Yield Engine', 'Panel design yield simulation before release.'],
        ['Dispatch DNA', 'Packing, labelling and serial reconciliation in one scan.'],
        ['Field Diagnostics', 'Customer-facing self-service test and RMA intake.'],
        ['Repair Loop', 'Rework orders wired to failure codes and true cost.'],
        ['Burn Rack Scheduler', 'Capacity planning for test racks and chambers.'],
        ['Calibration Cloud', 'Instrument calibration across labs and production lines.'],
        ['Lot Genealogy API', 'Open API for buyer-side traceability verification.']
      ]
    },
    metal: {
      prefix: 'MET', start: 601, label: 'Metal Fabrication',
      items: [
        ['Nesting Apex', 'Constraint-solver nesting with remnant-aware planning.'],
        ['Cut Genome', 'Laser and plasma parameters linked to edge-quality outcomes.'],
        ['Weld Ledger', 'Welder certification, WPS linkage and NDT evidence.'],
        ['Galvanizing Orbit', 'Zinc consumption, coating thickness and job-work ledger.'],
        ['Press Life Matrix', 'Die life, sharpening cycles and tonnage logs.'],
        ['Bending Twin', 'Bend-sequence simulation with spring-back compensation.'],
        ['Plate Passport', 'Heat-number traceability from mill certificate to dispatch.'],
        ['Powder Coat Analytics', 'Film thickness, cure logs and rework attribution.'],
        ['Fabrication Cost Lens', 'True cost per assembly with scrap attribution.'],
        ['Remnant Registry', 'Off-cut inventory searchable by grade and thickness.'],
        ['Saw Optimizer', 'Bar and tube cutting with remnant-first allocation.'],
        ['Surface Prep Guard', 'Blast profile and cleanliness evidence per lot.'],
        ['Duct Flow Designer', 'Sheet-metal HVAC fitting generation from specifications.'],
        ['Beam Line Studio', 'Structural steel fabrication sequencing and marking.'],
        ['Scrap-to-Value', 'Scrap classified, weighed and routed to the best-price buyer.'],
        ['Laser OEE Pulse', 'Machine efficiency with gas and power attribution.'],
        ['Job Work Challan Cloud', '57F4 challans with scrap and recovery reconciliation.'],
        ['Coil Slitting Twin', 'Slit-width optimisation against open orders.'],
        ['Tooling Sentinel', 'Punch and die wear alerts from tonnage signatures.'],
        ['QA Dimensional Cloud', 'First-article and in-process measurement capture.'],
        ['Powder Inventory', 'Coating stock with batch and shelf-life control.'],
        ['Weld Seam Vision', 'Automated seam inspection with defect mapping.'],
        ['Line Sequence AI', 'Fabrication sequencing that respects fixture constraints.'],
        ['Project Fabrication Hub', 'Site-wise dispatch schedules and packing plans.'],
        ['Thermal Profile Twin', 'Heat-treatment curves verified against specification.'],
        ['Coating Cost Engine', 'Powder, gas and labour cost per square metre.'],
        ['Dispatch Weight Passport', 'Weighbridge-verified dispatch with automatic invoicing.'],
        ['Capital Tooling ROI', 'Tooling investment tracked against production hours.'],
        ['Safety Permit Cloud', 'Hot-work, height and confined-space permits.'],
        ['Calibration Bridge', 'Instrument calibration for gauges and CMMs.']
      ]
    },
    trading: {
      prefix: 'TRD', start: 701, label: 'Wholesale Trading',
      items: [
        ['Transfer Apex', 'Inter-branch transfers with GST-grade documentation.'],
        ['Scheme Engine', 'Slab discounts, seasonal offers and claim settlement.'],
        ['Credit Radar', 'Buyer exposure scored continuously with automatic holds.'],
        ['Route Optimizer', 'Delivery planning with load and time-window constraints.'],
        ['Price Matrix', 'Party- and volume-wise pricing enforced at billing.'],
        ['Batch FEFO Trade', 'Expiry-aware allocation across godowns.'],
        ['Dropship Flow', 'Direct-to-customer dispatch with margin control.'],
        ['Consignment Ledger', 'Vendor-owned stock with automated settlement.'],
        ['Return Portal', 'Returns, replacements and credit notes in one flow.'],
        ['Barcode Put-Away', 'Scan-driven binning with capacity checks.'],
        ['Multi-UOM Billing', 'Case, piece and weight billing without conversion errors.'],
        ['Broker Commission', 'Agent-wise commission with claim-level audit.'],
        ['Demand Radar', 'Distributor sell-out signals feeding replenishment.'],
        ['Pallet Tracker', 'Pallet and crate movement with returnable-asset control.'],
        ['GST Reconciliation', 'GSTR-2B matching with guided mismatch workflows.'],
        ['E-Way Automation', 'Auto-generated e-way bills for every dispatch leg.'],
        ['Customer Portal', 'Order tracking and invoice downloads via WhatsApp.'],
        ['Secondary Sales', 'Field-rep order capture with geo-verified visits.'],
        ['Stock Accuracy AI', 'Cycle-count scheduling tuned to shrinkage risk.'],
        ['Landed Cost Engine', 'Freight, duty and handling in true landed cost.'],
        ['Warehouse Slotting', 'Velocity-based slotting recommendations.'],
        ['Contract Pricing', 'Long-term agreements with revision controls.'],
        ['Credit Insurance Bridge', 'Exposure shared with insurers and banking partners.'],
        ['Label Print Cloud', 'GS1 labels with SSCC generation at packing speed.'],
        ['Trade Compliance', 'FSSAI, legal metrology and BIS documentation.'],
        ['Replenishment Twin', 'Service-level simulation before policy changes.'],
        ['Aggregator Sync', 'Marketplace and quick-commerce order ingestion.'],
        ['Margin Lens', 'SKU-level margin after discounts and freight.'],
        ['Cold Storage Pulse', 'Temperature-monitored storage with excursion logs.'],
        ['B2B Payments', 'Credit terms, reminders and reconciliation in one ledger.']
      ]
    }
  };

  var TIER_PATTERN = ['Flagship', 'Add-on', 'Add-on', 'Platform', 'Add-on', 'New', 'Add-on', 'Enterprise', 'Add-on', 'Add-on', 'Add-on'];

  function buildCard(item, catKey, index, globalIndex) {
    var cat = CATEGORIES[catKey];
    var code = cat.prefix + '-' + (cat.start + index);
    var tier = TIER_PATTERN[globalIndex % TIER_PATTERN.length];
    var tierClass = tier === 'New' ? ' product-tier tier-new' : 'product-tier';

    var card = document.createElement('a');
    card.className = 'product-card';
    card.href = 'contact.html';
    card.setAttribute('data-cat', catKey);
    card.setAttribute('aria-label', item[0] + ' — book a demo');
    card.innerHTML =
      '<div class="product-top">' +
        '<span class="product-code">' + code + '</span>' +
        '<span class="' + tierClass + '">' + tier + '</span>' +
      '</div>' +
      '<h4>' + item[0] + '</h4>' +
      '<p>' + item[1] + '</p>' +
      '<div class="product-foot"><span>' + cat.label + '</span><span class="product-arrow">\u2192</span></div>';
    return card;
  }

  function render() {
    var grid = document.getElementById('productGrid');
    if (!grid) return;

    var fragment = document.createDocumentFragment();
    var globalIndex = 0;

    Object.keys(CATEGORIES).forEach(function (catKey) {
      CATEGORIES[catKey].items.forEach(function (item, index) {
        fragment.appendChild(buildCard(item, catKey, index, globalIndex));
        globalIndex++;
      });
    });

    grid.innerHTML = '';
    grid.appendChild(fragment);

    var count = document.getElementById('catalogueCount');
    if (count) {
      count.textContent = 'Showing ' + globalIndex + ' of ' + globalIndex + ' solutions';
    }
  }

  render();
})();
