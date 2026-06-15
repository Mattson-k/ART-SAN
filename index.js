/**
 * ARTSAN - Mural Collaboration Network
 * Core Application Logic, State Management, and Interactivity
 */

// 1. MOCK DATABASE STATE
const STATE = {
  currentRole: 'business', // 'business' or 'artist'
  activeProjectId: null, // Selected project in Workspace
  
  // Curated Artists Pool
  artists: [
    {
      id: 'art-1',
      name: 'Jessica Davis',
      avatar: 'assets/artist_avatar_1.png',
      location: 'Brooklyn, NY',
      style: 'Botanical',
      rating: 4.9,
      reviewsCount: 28,
      priceRange: '$1,200 - $3,500',
      bio: 'Specializing in oversized botanical storefront murals that bring organic warmth to brick facade coffee shops and local florist boutiques.',
      portfolio: [
        { title: 'Monstera Brick Cafe', url: 'assets/mural_botanical.png' },
        { title: 'Wildflower Greenhouse', url: 'assets/mural_realism.png' },
        { title: 'Modern Rose Boutique', url: 'assets/mural_abstract.png' }
      ]
    },
    {
      id: 'art-2',
      name: 'Marcus "Kobe" Vance',
      avatar: 'assets/artist_avatar_2.png',
      location: 'Queens, NY',
      style: 'Abstract',
      rating: 4.8,
      reviewsCount: 34,
      priceRange: '$1,500 - $4,000',
      bio: 'Focused on high-contrast geometric abstractions and vibrant street murals. Marcus uses neon gradients to give storefronts a modern, dynamic character.',
      portfolio: [
        { title: 'Neon Subway Facade', url: 'assets/mural_abstract.png' },
        { title: 'The Tiger Den storefront', url: 'assets/mural_realism.png' },
        { title: 'Grid Lock Concrete mural', url: 'assets/mural_botanical.png' }
      ]
    },
    {
      id: 'art-3',
      name: 'Elena Rostova',
      avatar: 'assets/artist_avatar_1.png',
      location: 'Lower East Side, NY',
      style: 'Realism',
      rating: 5.0,
      reviewsCount: 19,
      priceRange: '$2,000 - $6,000',
      bio: 'Hyper-realistic wildlife and portrait murals designed for flagship restaurant walls and high-end retail storefronts.',
      portfolio: [
        { title: 'Tiger Storefront', url: 'assets/mural_realism.png' },
        { title: 'Tropical Oasis Facade', url: 'assets/mural_botanical.png' },
        { title: 'Geometric Jaguar Wall', url: 'assets/mural_abstract.png' }
      ]
    }
  ],

  // Commissions Database
  projects: [
    {
      id: 'proj-101',
      title: 'Majestic Tiger Facade Painting',
      businessName: "The Tiger's Den",
      address: '142 Bedford Ave, Brooklyn NY',
      artistId: 'art-3',
      artistName: 'Elena Rostova',
      style: 'Realism',
      dimensions: '12ft x 18ft',
      budget: 2500,
      targetDate: '2026-06-28',
      status: 'active', // 'request', 'active', 'completed'
      progress: 65,
      timeline: [
        { name: 'Initial Design Approval', desc: 'Mural sketch review and contract release signed.', status: 'done' },
        { name: 'Milestone Deposit Paid', desc: '50% deposit processed via Stripe escrow.', status: 'done' },
        { name: 'Surface Preparation', desc: 'Brick cleaning, base paint layer coat, and sketching outline.', status: 'done' },
        { name: 'Color Fill & Rendering', desc: 'Filling out major colors and starting detailed texture work.', status: 'current' },
        { name: 'Final Client Inspection', desc: 'Business owner approval of finished details and mural sealer spray.', status: 'pending' },
        { name: 'Project Completion Payout', desc: 'Release remaining 50% fund milestone.', status: 'pending' }
      ],
      updates: [
        { user: 'Elena Rostova', time: '2 hours ago', text: 'Completed the primary background leaves and started shading the tiger claws. Texture detail matches original vector plan.' },
        { user: "The Tiger's Den", time: 'Yesterday', text: 'Looking fantastic! Love the depth on the brick seams.' }
      ],
      muralImage: 'assets/mural_realism.png',
      isDepositPaid: true,
      isFinalPaid: false
    },
    {
      id: 'proj-102',
      title: 'Neon Geometry Storefront Cafe Mural',
      businessName: 'Neon Coffee',
      address: '78 Orchard St, New York NY',
      artistId: 'art-2',
      artistName: 'Marcus Vance',
      style: 'Abstract',
      dimensions: '9ft x 12ft',
      budget: 1800,
      targetDate: '2026-07-02',
      status: 'request', // Request waiting for artist bid / payment
      progress: 0,
      timeline: [
        { name: 'Initial Design Approval', desc: 'Design mockup finalized by artist.', status: 'current' },
        { name: 'Milestone Deposit Paid', desc: '50% deposit processed via Stripe escrow.', status: 'pending' },
        { name: 'Surface Preparation', desc: 'Wall cleaning and primer outline.', status: 'pending' },
        { name: 'Color Fill & Rendering', desc: 'Spray painting neon details.', status: 'pending' },
        { name: 'Final Client Inspection', desc: 'Final walkthrough approval.', status: 'pending' }
      ],
      updates: [
        { user: 'Marcus Vance', time: '3 days ago', text: 'Submitted design sketch matching your neon pink branding theme. Standing by for deposit payment to secure materials.' }
      ],
      muralImage: 'assets/mural_abstract.png',
      isDepositPaid: false,
      isFinalPaid: false
    }
  ],

  // Stripe Transaction Log
  transactions: []
};

// 2. MUNICIPAL COMPLIANCE REGULATION DATA
const MUNICIPAL_RULES = {
  sf: {
    title: 'San Francisco Arts Commission (SFAC) Regulations',
    rules: [
      { title: 'Zoning & Easement', desc: 'Public-facing murals on private property do not require zoning permits unless they project more than 6 inches into the sidewalk easement.', badge: 'exempt' },
      { title: 'Historical Landmark Check', desc: 'If property is inside historic districts (e.g. Jackson Square, Alamo Square), mural designs must be approved by the Historic Preservation Commission.', badge: 'required' },
      { title: 'Public Art Registry', desc: 'Highly recommended to file with the Street Art Registry to protect artist rights under the Visual Artists Rights Act (VARA).', badge: 'optional' }
    ]
  },
  nyc: {
    title: 'New York City Landmark Preservation Commission Rules',
    rules: [
      { title: 'Landmarked Structures', desc: 'Any mural painted on a landmarked structure requires a Certificate of Appropriateness from the LPC. Painting directly on raw brick is strictly regulated.', badge: 'required' },
      { title: 'Zoning Code Sec 32-60', desc: 'Commercial murals cannot contain explicit advertisements or product logos unless they count towards the business storefront signage allowance limit.', badge: 'required' },
      { title: 'Temporary Glass Art', desc: 'Storefront window installations lasting less than 30 days are completely exempt from landmark constraints.', badge: 'exempt' }
    ]
  },
  chicago: {
    title: 'Chicago Public Art Ordinance & Zoning Regulations',
    rules: [
      { title: 'City Mural Registry', desc: 'Murals registered with the Department of Cultural Affairs and Special Events (DCASE) receive city protection from vandalism painting and code violations.', badge: 'optional' },
      { title: 'Building Owner License', desc: 'Owner must grant a signed easement certificate acknowledging the artist retains moral copyrights under the Illinois Fine Art Copyright Act.', badge: 'required' }
    ]
  },
  generic: {
    title: 'Standard Municipal Public Art Ordinances',
    rules: [
      { title: 'Advertising Clause', desc: 'Mural cannot contain text promoting products or commercial services, otherwise it is classified as a sign and subject to sign tax licensing.', badge: 'required' },
      { title: 'Property Consent', desc: 'Signed, notarized agreement between artist and property deed holder.', badge: 'required' }
    ]
  }
};

// 3. APPLICATION INITS & SPA ROUTING
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initRouter();
  initRoleSwitcher();
  initFormHandlers();
  initStripeHandlers();
  initLegalCenter();
  
  // Render galleries and lists
  renderMarketplace();
  renderProjectSidebar();
  updateCollabOverviewBadge();
  
  // Execute cinematic entrance animation (GSAP)
  runCinematicHeroEntrance();
});

// Cinematic Hero Animations with GSAP
function runCinematicHeroEntrance() {
  if (typeof gsap !== 'undefined') {
    // Parallax scene mouse movements
    const scene = document.getElementById('hero-scene');
    if (scene) {
      scene.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { width, height } = scene.getBoundingClientRect();
        const xOffset = (clientX / width - 0.5) * 40;
        const yOffset = (clientY / height - 0.5) * 40;
        
        gsap.to('.layer.depth-1', { duration: 0.8, x: xOffset * 0.3, y: yOffset * 0.3, ease: 'power2.out' });
        gsap.to('.layer.depth-2', { duration: 0.8, x: xOffset * 0.6, y: yOffset * 0.6, ease: 'power2.out' });
        gsap.to('.layer.depth-3', { duration: 0.8, x: xOffset * 0.8, y: yOffset * 0.8, ease: 'power2.out' });
        gsap.to('.layer.depth-4', { duration: 0.8, x: xOffset * 1.0, y: yOffset * 1.0, ease: 'power2.out' });
        gsap.to('.layer.depth-5', { duration: 0.8, x: xOffset * 1.3, y: yOffset * 1.3, ease: 'power2.out' });
      });
    }

    // Headline entrance reveal sequence
    const tl = gsap.timeline();
    tl.to('.title-word', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out'
    });
    
    tl.from('.hero-subtitle', {
      opacity: 0,
      y: 15,
      duration: 0.5,
      ease: 'power2.out'
    }, '-=0.2');
    
    tl.from('.hero-actions', {
      opacity: 0,
      y: 10,
      duration: 0.4,
      ease: 'power2.out'
    }, '-=0.2');
  }
}

// Custom Cursor coordinates follow
function initCursor() {
  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  // Attach hover listeners to buttons/links
  const hoverables = document.querySelectorAll('a, button, select, input, textarea, .portfolio-img-container, .project-item-card');
  hoverables.forEach(elem => {
    elem.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    elem.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
}

// Client Side SPA routing via hashes
function initRouter() {
  const navigateTo = () => {
    const hash = window.location.hash || '#landing';
    const activeSectionId = 'section-' + hash.replace('#', '');
    
    // Deactivate current active layouts
    document.querySelectorAll('.app-screen').forEach(screen => {
      screen.classList.remove('active');
    });
    
    // Activate targeted route screen
    const targetScreen = document.getElementById(activeSectionId);
    if (targetScreen) {
      targetScreen.classList.add('active');
    }
    
    // Highlight nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === hash) {
        item.classList.add('active');
      }
    });

    // Reset default cursor state on navigation
    const cursor = document.getElementById('custom-cursor');
    if (cursor) cursor.classList.remove('hovering');

    // Auto select first project in collab page
    if (hash === '#collab' && !STATE.activeProjectId && STATE.projects.length > 0) {
      selectProject(STATE.projects[0].id);
    }
  };

  window.addEventListener('hashchange', navigateTo);
  // Initial router check
  if (window.location.hash) {
    navigateTo();
  }
}

// Unified Role Switcher Manager
function initRoleSwitcher() {
  const buttons = document.querySelectorAll('.role-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      buttons.forEach(b => b.classList.remove('active'));
      const activeBtn = e.currentTarget;
      activeBtn.classList.add('active');
      
      STATE.currentRole = activeBtn.getAttribute('data-role');
      
      // Update UI state based on new role
      showToast(`Switched view mode to: ${STATE.currentRole.toUpperCase()}`);
      
      // Redraw list dependencies
      renderProjectSidebar();
      if (STATE.activeProjectId) {
        renderActiveProject(STATE.activeProjectId);
      }
      updateCollabOverviewBadge();
    });
  });
}

// Alert Toast Message System
function showToast(message) {
  const toast = document.getElementById('notification-banner');
  const text = document.getElementById('notification-message');
  if (!toast || !text) return;
  
  text.textContent = message;
  toast.classList.add('active');
  
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
}

// 4. MARKETPLACE RENDER ENGINE
function renderMarketplace() {
  const grid = document.getElementById('artist-grid-container');
  if (!grid) return;
  
  const searchVal = document.getElementById('marketplace-search-input').value.toLowerCase();
  const filterVal = document.getElementById('marketplace-style-filter').value;
  
  // Filter artists
  const filtered = STATE.artists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchVal) || 
                          artist.style.toLowerCase().includes(searchVal) ||
                          artist.location.toLowerCase().includes(searchVal);
    const matchesStyle = filterVal === 'all' || artist.style === filterVal;
    return matchesSearch && matchesStyle;
  });
  
  grid.innerHTML = '';
  
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-2 text-center py-5 glass-card">
        <p class="text-secondary">No artists match your criteria. Try adjusting filters or keyword searches.</p>
      </div>`;
    return;
  }
  
  filtered.forEach(artist => {
    const card = document.createElement('div');
    card.className = 'artist-card glass-card';
    
    // Build portfolio preview items
    let portfolioHTML = '';
    artist.portfolio.forEach((p, idx) => {
      portfolioHTML += `
        <div class="portfolio-img-container" onclick="openPortfolioLightbox('${artist.name}', '${p.title}', '${p.url}')">
          <img src="${p.url}" alt="${p.title} - mural by ${artist.name}" class="portfolio-img">
          <div class="portfolio-lbl">${p.title}</div>
        </div>`;
    });
    
    card.innerHTML = `
      <div class="artist-card-body">
        <div class="artist-avatar-wrap">
          <img src="${artist.avatar}" alt="${artist.name}" class="artist-avatar">
        </div>
        <div class="artist-info">
          <div class="artist-name-row">
            <h3 class="artist-name">${artist.name}</h3>
            <span class="artist-rating-badge">★ ${artist.rating.toFixed(1)} <span style="font-size:0.75rem; color:var(--text-muted);">(${artist.reviewsCount})</span></span>
          </div>
          <div class="artist-location">📍 ${artist.location} | Style: <span class="artist-style-tag">${artist.style}</span></div>
          <p class="artist-bio">${artist.bio}</p>
        </div>
      </div>
      <div class="portfolio-preview-slider">
        ${portfolioHTML}
      </div>
      <div class="card-actions-row">
        <button type="button" class="btn-primary" onclick="initiateCommissionWithArtist('${artist.id}', '${artist.name}')">Hire Artist</button>
        <button type="button" class="btn-secondary" onclick="viewArtistPortfolio('${artist.id}')">View Details</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function openPortfolioLightbox(artistName, workTitle, imageUrl) {
  showToast(`Viewing portfolio details: "${workTitle}" by ${artistName}`);
}

function viewArtistPortfolio(artistId) {
  const artist = STATE.artists.find(a => a.id === artistId);
  if (artist) {
    showToast(`Opening portfolio details for ${artist.name}...`);
  }
}

// Redirect commission button clicking
function initiateCommissionWithArtist(artistId, artistName) {
  const dropdown = document.getElementById('comm-style-pref');
  const artist = STATE.artists.find(a => a.id === artistId);
  if (dropdown && artist) {
    dropdown.value = artist.style;
  }
  const desc = document.getElementById('comm-description');
  if (desc) {
    desc.value = `Hi ${artistName}, we love your portfolio on Artsan and want to commission a custom ${artist.style} mural for our storefront...`;
  }
  window.location.hash = '#commission';
  showToast(`Pre-filled commission request for ${artistName}!`);
}

// 5. FORM AND INTERACTION SUBMISSIONS
function initFormHandlers() {
  // Gallery search hooks
  const searchInput = document.getElementById('marketplace-search-input');
  const filterDropdown = document.getElementById('marketplace-style-filter');
  
  if (searchInput) searchInput.addEventListener('input', renderMarketplace);
  if (filterDropdown) filterDropdown.addEventListener('change', renderMarketplace);
  
  // Commission request publication
  const form = document.getElementById('commission-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic validate
      const businessName = document.getElementById('comm-business-name').value;
      const address = document.getElementById('comm-location').value;
      const budget = parseInt(document.getElementById('comm-budget').value);
      const targetDate = document.getElementById('comm-timeline').value;
      const desc = document.getElementById('comm-description').value;
      const style = document.getElementById('comm-style-pref').value;
      const dimensions = document.getElementById('comm-dimensions').value;
      const facadeType = document.getElementById('comm-mural-type').value;

      if (!businessName || !address || !budget || !targetDate || !desc) {
        showToast('Please fill out all required fields.');
        return;
      }

      // Generate a mock project request entry
      const newRequest = {
        id: 'proj-' + (100 + STATE.projects.length + 1),
        title: `${facadeType.toUpperCase()} Mural Design`,
        businessName,
        address,
        artistId: 'art-1', // Default assignment for prototype flow
        artistName: 'Jessica Davis',
        style,
        dimensions,
        budget,
        targetDate,
        status: 'request',
        progress: 0,
        timeline: [
          { name: 'Initial Design Approval', desc: 'Mockup and legal permit sign-off.', status: 'current' },
          { name: 'Milestone Deposit Paid', desc: '50% deposit processed via Stripe escrow.', status: 'pending' },
          { name: 'Surface Preparation', desc: 'Wall cleaning and primer mapping.', status: 'pending' },
          { name: 'Color Fill & Rendering', desc: 'Painting execution steps.', status: 'pending' },
          { name: 'Final Client Inspection', desc: 'Approval of details.', status: 'pending' }
        ],
        updates: [
          { user: businessName, time: 'Just now', text: `Published commission request details: ${desc}` }
        ],
        muralImage: style === 'Botanical' ? 'assets/mural_botanical.png' : 'assets/mural_abstract.png',
        isDepositPaid: false,
        isFinalPaid: false
      };

      STATE.projects.unshift(newRequest);
      
      // Reset form
      form.reset();
      
      // Update UI and route
      renderProjectSidebar();
      selectProject(newRequest.id);
      updateCollabOverviewBadge();
      
      window.location.hash = '#collab';
      showToast('Commission request published successfully!');
    });
  }
}

// 6. COLLABORATION TIMELINE AND PROGRESS RENDERERS
function renderProjectSidebar() {
  const container = document.getElementById('project-list-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  if (STATE.projects.length === 0) {
    container.innerHTML = '<p class="text-muted text-center py-4">No projects logged yet.</p>';
    return;
  }
  
  STATE.projects.forEach(project => {
    const item = document.createElement('div');
    item.className = `project-item-card ${STATE.activeProjectId === project.id ? 'active' : ''}`;
    item.setAttribute('id', `project-card-${project.id}`);
    item.addEventListener('click', () => selectProject(project.id));
    
    let badgeClass = 'badge-draft';
    if (project.status === 'active') badgeClass = 'badge-active';
    if (project.status === 'completed') badgeClass = 'badge-completed';
    
    item.innerHTML = `
      <div class="project-item-title">${project.title}</div>
      <div class="project-item-meta">
        <span>${project.businessName}</span>
        <span class="project-badge ${badgeClass}">${project.status}</span>
      </div>
    `;
    container.appendChild(item);
  });
}

function selectProject(projectId) {
  STATE.activeProjectId = projectId;
  
  // Update active css states in sidebar list
  document.querySelectorAll('.project-item-card').forEach(card => {
    card.classList.remove('active');
  });
  const selectedCard = document.getElementById(`project-card-${projectId}`);
  if (selectedCard) selectedCard.classList.add('active');
  
  renderActiveProject(projectId);
}

function updateCollabOverviewBadge() {
  const badge = document.getElementById('collab-overview-badge');
  if (!badge) return;
  
  const activeCount = STATE.projects.filter(p => p.status === 'active').length;
  const requestCount = STATE.projects.filter(p => p.status === 'request').length;
  const completedCount = STATE.projects.filter(p => p.status === 'completed').length;
  
  badge.innerHTML = `
    <div class="stat-item">
      <span class="stat-val">${activeCount}</span>
      <span class="stat-lbl">Active</span>
    </div>
    <div class="stat-item" style="border-left: 1px solid var(--border-glass); padding-left: 20px;">
      <span class="stat-val">${requestCount}</span>
      <span class="stat-lbl">Requests</span>
    </div>
    <div class="stat-item" style="border-left: 1px solid var(--border-glass); padding-left: 20px;">
      <span class="stat-val">${completedCount}</span>
      <span class="stat-lbl">Completed</span>
    </div>
  `;
}

// Detailed active project workspace rendering
function renderActiveProject(projectId) {
  const workspace = document.getElementById('active-project-workspace');
  if (!workspace) return;
  
  const project = STATE.projects.find(p => p.id === projectId);
  if (!project) {
    workspace.innerHTML = `
      <div class="empty-state-workspace text-center">
        <h3>Project not found</h3>
      </div>`;
    return;
  }
  
  // Timelines HTML
  let timelineHTML = '';
  project.timeline.forEach((step, idx) => {
    let stepClass = '';
    if (step.status === 'done') stepClass = 'done';
    else if (step.status === 'current') stepClass = 'current';
    
    timelineHTML += `
      <div class="timeline-step ${stepClass}">
        <div class="step-indicator">${idx + 1}</div>
        <div class="step-info">
          <div class="step-title">${step.name}</div>
          <div class="step-desc">${step.desc}</div>
        </div>
      </div>`;
  });
  
  // Updates feed HTML
  let updatesHTML = '';
  project.updates.forEach(u => {
    updatesHTML += `
      <div class="feed-item">
        <span class="feed-time">${u.time}</span>
        <span class="feed-user">${u.user}:</span>
        <p class="feed-text">${u.text}</p>
      </div>`;
  });
  
  // Panel Action Control Options based on Artist vs Business view and Project state
  let actionPanelHTML = '';
  
  if (STATE.currentRole === 'artist') {
    // ARTIST DASHBOARD PANEL CONTROLS
    actionPanelHTML = `
      <div class="progress-section">
        <div class="progress-header-row">
          <h4>Execution Progress</h4>
          <span class="progress-percentage">${project.progress}%</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill" style="width: ${project.progress}%"></div>
        </div>
        
        ${project.status === 'active' ? `
          <div class="progress-slider-control">
            <label for="artist-progress-slider" style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Adjust Completion %</label>
            <input type="range" id="artist-progress-slider" class="progress-input-range" min="0" max="100" value="${project.progress}" oninput="updateArtistProgressLabel(this.value)">
            <button type="button" class="btn-primary w-full mt-3" onclick="saveArtistProgress('${project.id}')">Post Progress Update</button>
          </div>
        ` : ''}
      </div>

      <div class="glass-card mb-4">
        <h4>Share Progress Upload</h4>
        <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:12px;">Submit canvas sketch files or installation progress photos.</p>
        <button type="button" class="btn-secondary w-full" onclick="simulateMuralPhotoUpload('${project.id}')">📷 Upload Photo Proof</button>
      </div>
    `;
  } else {
    // BUSINESS DASHBOARD PANEL CONTROLS
    let paymentButtonHTML = '';
    
    if (project.status === 'request') {
      paymentButtonHTML = `
        <button type="button" class="btn-primary w-full mb-3" onclick="openStripeEscrowCheckout('${project.id}', 'deposit')">Pay Deposit Milestone ($${(project.budget / 2).toFixed(0)})</button>
        <p style="font-size:0.75rem; color:var(--text-muted); text-align:center;">Funds will be held in Stripe Escrow until layout sketch approval.</p>
      `;
    } else if (project.status === 'active' && project.progress === 100 && !project.isFinalPaid) {
      paymentButtonHTML = `
        <button type="button" class="btn-primary w-full mb-3" onclick="openStripeEscrowCheckout('${project.id}', 'final')">Approve Mural & Pay Final Milestone ($${(project.budget / 2).toFixed(0)})</button>
        <p style="font-size:0.75rem; color:var(--text-muted); text-align:center;">Approve final murals and release remaining funds to the artist.</p>
      `;
    } else if (project.status === 'completed' || project.isFinalPaid) {
      paymentButtonHTML = `
        <div class="text-center py-2 success-state-alert">
          <span style="color:var(--success); font-weight:700;">✓ Transaction Fully Settled</span>
          <p style="font-size:0.75rem; color:var(--text-muted);">Invoice logs available in Stripe Dashboard ledger.</p>
        </div>
      `;
    } else {
      paymentButtonHTML = `
        <div class="text-center py-2" style="background:rgba(255,255,255,0.02); border-radius:6px; border:1px dashed var(--border-glass);">
          <span style="font-size:0.85rem; color:var(--text-muted);">Deposit Paid ($${(project.budget / 2).toFixed(0)})</span>
          <p style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">Remaining milestone unlocks at 100% completion.</p>
        </div>
      `;
    }

    actionPanelHTML = `
      <div class="progress-section">
        <div class="progress-header-row">
          <h4>Project Progress</h4>
          <span class="progress-percentage">${project.progress}%</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill" style="width: ${project.progress}%"></div>
        </div>
      </div>

      <div class="glass-card mb-4">
        <h4>Milestone Payments</h4>
        <div style="margin-top:16px;">
          ${paymentButtonHTML}
        </div>
      </div>
      
      ${project.status === 'active' ? `
        <div class="glass-card mb-4">
          <h4>Installation Details</h4>
          <div style="font-size:0.85rem; margin-top:8px;">
            <p><strong>Proposed Date:</strong> ${project.targetDate}</p>
            <p style="margin-top:4px;"><strong>Dimensions:</strong> ${project.dimensions}</p>
            <p style="margin-top:4px;"><strong>Location Facade:</strong> ${project.address}</p>
          </div>
        </div>
      ` : ''}
    `;
  }
  
  workspace.innerHTML = `
    <div class="workspace-header">
      <div>
        <h3 class="w-title">${project.title}</h3>
        <div class="w-meta-row">
          <span>Business: <strong>${project.businessName}</strong></span>
          <span>Artist: <strong>${project.artistName}</strong></span>
        </div>
      </div>
      <div>
        <span class="project-badge badge-active" style="padding: 6px 12px; font-size: 0.85rem;">Status: ${project.status.toUpperCase()}</span>
      </div>
    </div>
    
    <div class="workspace-body-grid">
      <!-- Left side: Timeline updates and Comments -->
      <div>
        <div class="mural-proofs-container mb-4">
          <h4>Live Canvas / Proofs</h4>
          <div class="mural-canvas-preview mt-3">
            <img src="${project.muralImage}" alt="Current state of mural project" class="mural-canvas-img" id="workspace-proof-image">
            ${project.progress === 0 ? `<div class="mural-draft-overlay">Sketch Outline Pending</div>` : ''}
          </div>
        </div>
        
        <div class="glass-card mb-4">
          <h4>Project Milestones</h4>
          <div class="timeline-list">
            ${timelineHTML}
          </div>
        </div>
        
        <div class="glass-card">
          <h4>Workspace Activity Updates</h4>
          <div class="activity-feed-scroller mt-3" id="collab-feed-list">
            ${updatesHTML}
          </div>
          
          <div class="activity-input-form mt-3">
            <input type="text" id="input-collab-message" class="form-input" style="flex-grow:1; border-radius:24px;" placeholder="Post a comment or correction request...">
            <button type="button" class="btn-primary" style="padding: 10px 20px; border-radius:24px;" onclick="postCollabComment('${project.id}')">Send</button>
          </div>
        </div>
      </div>
      
      <!-- Right side: Role specific actions -->
      <div>
        ${actionPanelHTML}
      </div>
    </div>
  `;
}

// Range slider label update
window.updateArtistProgressLabel = function(val) {
  const percentageLabel = document.querySelector('.progress-percentage');
  if (percentageLabel) percentageLabel.textContent = val + '%';
  
  const bar = document.querySelector('.progress-bar-fill');
  if (bar) bar.style.width = val + '%';
};

// Save progress level
window.saveArtistProgress = function(projectId) {
  const project = STATE.projects.find(p => p.id === projectId);
  const slider = document.getElementById('artist-progress-slider');
  if (!project || !slider) return;
  
  const oldVal = project.progress;
  const newVal = parseInt(slider.value);
  project.progress = newVal;
  
  // Transition milestones statuses based on percentage
  if (newVal >= 30 && oldVal < 30) {
    project.timeline[2].status = 'done';
    project.timeline[3].status = 'current';
  }
  if (newVal >= 90 && oldVal < 90) {
    project.timeline[3].status = 'done';
    project.timeline[4].status = 'current';
  }
  if (newVal === 100) {
    project.timeline[4].status = 'done';
    showToast('Mural 100% completed! Waiting for final business inspection and payout release.');
  }
  
  project.updates.unshift({
    user: project.artistName,
    time: 'Just now',
    text: `Updated installation execution progress from ${oldVal}% to ${newVal}%.`
  });
  
  renderActiveProject(projectId);
  showToast(`Progress saved: ${newVal}%`);
};

// Simulate mural proof image upload
window.simulateMuralPhotoUpload = function(projectId) {
  const project = STATE.projects.find(p => p.id === projectId);
  if (!project) return;
  
  // Toggle between abstract/botanical/realism to simulate drawing changes
  let nextImage = 'assets/mural_botanical.png';
  if (project.muralImage === 'assets/mural_botanical.png') nextImage = 'assets/mural_realism.png';
  else if (project.muralImage === 'assets/mural_realism.png') nextImage = 'assets/mural_abstract.png';
  
  project.muralImage = nextImage;
  
  project.updates.unshift({
    user: project.artistName,
    time: 'Just now',
    text: 'Uploaded a high-resolution progress photo proof of the storefront canvas facade.'
  });
  
  renderActiveProject(projectId);
  showToast('Photo proof successfully uploaded to workspace!');
};

// Comment submission inside project board
window.postCollabComment = function(projectId) {
  const project = STATE.projects.find(p => p.id === projectId);
  const input = document.getElementById('input-collab-message');
  if (!project || !input || !input.value.trim()) return;
  
  const sender = STATE.currentRole === 'artist' ? project.artistName : project.businessName;
  
  project.updates.unshift({
    user: sender,
    time: 'Just now',
    text: input.value.trim()
  });
  
  input.value = '';
  renderActiveProject(projectId);
  showToast('Comment posted.');
};


// 7. STRIPE ESCROW CHECKOUT PAYMENTS SIMULATION
let currentCheckoutProjectId = null;
let currentCheckoutType = null; // 'deposit' or 'final'

window.openStripeEscrowCheckout = function(projectId, paymentType) {
  const project = STATE.projects.find(p => p.id === projectId);
  if (!project) return;
  
  currentCheckoutProjectId = projectId;
  currentCheckoutType = paymentType;
  
  const modal = document.getElementById('stripe-checkout-modal');
  const title = document.getElementById('stripe-summary-title');
  const amount = document.getElementById('stripe-summary-amount');
  const payBtn = document.getElementById('stripe-pay-btn-text');
  
  const cost = project.budget / 2;
  
  title.textContent = paymentType === 'deposit' ? `50% Deposit: ${project.title}` : `Remaining 50%: ${project.title}`;
  amount.textContent = `$${cost.toFixed(2)}`;
  payBtn.textContent = `Pay $${cost.toFixed(2)}`;
  
  modal.classList.add('active');
  modal.removeAttribute('aria-hidden');
};

function initStripeHandlers() {
  const modal = document.getElementById('stripe-checkout-modal');
  const closeBtn = document.getElementById('btn-close-stripe');
  const form = document.getElementById('stripe-card-form');
  const errorMsg = document.getElementById('stripe-error-message');
  const spinner = document.getElementById('stripe-spinner');
  const payBtnText = document.getElementById('stripe-pay-btn-text');
  const submitBtn = document.getElementById('stripe-submit-button');
  
  const closeStripe = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    form.reset();
    errorMsg.innerHTML = '';
  };
  
  if (closeBtn) closeBtn.addEventListener('click', closeStripe);
  
  // Format credit card spaces
  const cardNumInput = document.getElementById('stripe-card-number');
  if (cardNumInput) {
    cardNumInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      let matches = v.match(/\d{4,16}/g);
      let match = matches && matches[0] || '';
      let parts = [];

      for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
      }

      if (parts.length > 0) {
        e.target.value = parts.join(' ');
      } else {
        e.target.value = v;
      }
      
      // Card brand logos
      const brandIcon = document.getElementById('stripe-brand-icon');
      if (v.startsWith('4')) brandIcon.textContent = 'Visa';
      else if (v.startsWith('5')) brandIcon.textContent = 'MC';
      else brandIcon.textContent = '💳';
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const cardNum = cardNumInput.value.replace(/\s+/g, '');
      
      // Reset animations
      errorMsg.innerHTML = '';
      spinner.classList.remove('hidden');
      submitBtn.setAttribute('disabled', 'true');
      
      setTimeout(() => {
        // Validation cases matching Stripe CLI/SDK tests
        if (cardNum.startsWith('4242')) {
          // Case 1: Standard card success
          processSuccessfulStripePayment(closeStripe);
        } else if (cardNum.startsWith('40000025')) {
          // Case 2: 3D Secure mock requirements
          spinner.classList.add('hidden');
          submitBtn.removeAttribute('disabled');
          openStripe3DSVerification(closeStripe);
        } else {
          // Case 3: Decline trigger
          spinner.classList.add('hidden');
          submitBtn.removeAttribute('disabled');
          errorMsg.textContent = 'Your card was declined. Please check details or use test card 4242.';
        }
      }, 1500);
    });
  }
}

function processSuccessfulStripePayment(closeCallback) {
  const project = STATE.projects.find(p => p.id === currentCheckoutProjectId);
  if (!project) return;
  
  const cost = project.budget / 2;
  
  // Update local DB records
  if (currentCheckoutType === 'deposit') {
    project.isDepositPaid = true;
    project.status = 'active';
    project.timeline[1].status = 'done';
    project.timeline[2].status = 'current';
    project.updates.unshift({
      user: 'Stripe Webhook',
      time: 'Just now',
      text: `Payment of $${cost.toFixed(0)} deposit completed successfully. Escrow funds secured.`
    });
  } else {
    project.isFinalPaid = true;
    project.status = 'completed';
    project.timeline[4].status = 'done';
    if (project.timeline[5]) project.timeline[5].status = 'done';
    project.updates.unshift({
      user: 'Stripe Webhook',
      time: 'Just now',
      text: `Payment of $${cost.toFixed(0)} final milestone completed. Escrow balance released to artist.`
    });
  }
  
  // Add transactions
  STATE.transactions.push({
    id: 'ch_' + Math.floor(Math.random()*1000000),
    project: project.title,
    amount: cost,
    type: currentCheckoutType,
    date: new Date().toLocaleDateString()
  });
  
  // Reset loader and notify
  const spinner = document.getElementById('stripe-spinner');
  const submitBtn = document.getElementById('stripe-submit-button');
  spinner.classList.add('hidden');
  submitBtn.removeAttribute('disabled');
  
  closeCallback();
  renderActiveProject(currentCheckoutProjectId);
  updateCollabOverviewBadge();
  showToast('Payment processed successfully through Stripe!');
}

function openStripe3DSVerification(closeCallback) {
  const overlay3ds = document.getElementById('stripe-3ds-overlay');
  overlay3ds.classList.remove('hidden');
  overlay3ds.removeAttribute('aria-hidden');
  
  const approveBtn = document.getElementById('btn-3ds-approve');
  const cancelBtn = document.getElementById('btn-3ds-cancel');
  
  const cleanup = () => {
    overlay3ds.classList.add('hidden');
    overlay3ds.setAttribute('aria-hidden', 'true');
  };
  
  approveBtn.onclick = () => {
    cleanup();
    processSuccessfulStripePayment(closeCallback);
  };
  
  cancelBtn.onclick = () => {
    cleanup();
    const errorMsg = document.getElementById('stripe-error-message');
    errorMsg.textContent = 'Authentication failed. Transaction cancelled.';
  };
}


// 8. LEGAL COMPLIANCE CENTER
function initLegalCenter() {
  const citySelector = document.getElementById('legal-city-selector');
  if (citySelector) {
    citySelector.addEventListener('change', (e) => {
      renderZoningRules(e.target.value);
    });
    // Trigger default
    renderZoningRules(citySelector.value);
  }
  
  // Legal Contract generator hooks
  const genBtn = document.getElementById('btn-generate-contract');
  if (genBtn) {
    genBtn.addEventListener('click', () => {
      const artist = document.getElementById('legal-artist-name').value || '[Artist Name]';
      const owner = document.getElementById('legal-owner-name').value || '[Business Owner]';
      
      const contractText = `MURAL INSTALLATION AND COPYRIGHT RELEASE AGREEMENT

This Agreement is made on ${new Date().toLocaleDateString()} between:
Artist: ${artist}
Property / Business Owner: ${owner}

1. LICENSE AND SCOPE: The Owner grants the Artist permission to install a custom mural design on the building exterior located at the designated address.
2. PUBLIC ART COMPLIANCE: The parties certify that this mural is an original artwork and does not constitute commercial signage or advertising as defined by local municipal zoning codes.
3. COPYRIGHT & OWNERSHIP: The Artist retains copyright ownership, including moral rights under the Visual Artists Rights Act (VARA) of 1990 (17 U.S.C. 106A). The Owner agrees not to alter, paint over, or destroy the mural for a period of no less than 1 year, unless emergency facade repairs are required.
4. MILESTONE PAYMENTS: Payments shall be released via Stripe milestone escrow (50% deposit, 50% final release).

Signed:
_________________________ (Artist)
_________________________ (Business/Owner)
`;
      const box = document.getElementById('contract-text-preview');
      if (box) {
        box.textContent = contractText;
      }
      showToast('Contract Draft successfully generated!');
    });
  }
}

function renderZoningRules(cityKey) {
  const container = document.getElementById('city-compliance-rules');
  if (!container) return;
  
  const data = MUNICIPAL_RULES[cityKey];
  if (!data) return;
  
  let rulesHTML = `<h4>${data.title}</h4><div class="timeline-list mt-3">`;
  
  data.rules.forEach(rule => {
    let badgeClass = 'badge-optional';
    if (rule.badge === 'required') badgeClass = 'badge-required';
    if (rule.badge === 'exempt') badgeClass = 'badge-exempt';
    
    rulesHTML += `
      <div class="rule-group">
        <div class="rule-title">${rule.title} <span class="rule-badge ${badgeClass}">${rule.badge}</span></div>
        <p class="rule-desc">${rule.desc}</p>
      </div>`;
  });
  
  rulesHTML += '</div>';
  container.innerHTML = rulesHTML;
}
