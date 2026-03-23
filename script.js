const STORAGE_KEY = "worldblock-simulator-v1";
const FUNDING_TICK = 250;
const DEFAULT_MESSAGE = "Protocol state synchronized locally.";

const regionAnchors = {
  Africa: { x: [50, 60], y: [52, 66] },
  "Asia Pacific": { x: [77, 88], y: [42, 58] },
  Europe: { x: [51, 59], y: [30, 42] },
  "Latin America": { x: [26, 36], y: [52, 70] },
  "North America": { x: [16, 30], y: [24, 42] },
};

const ui = {
  message: {
    text: DEFAULT_MESSAGE,
    tone: "success",
  },
};

function createDefaultState() {
  const now = Date.now();

  return {
    mapMode: "issues",
    filters: {
      region: "All regions",
      exchangeTrust: 20,
    },
    selected: {
      type: "issue",
      id: "issue-water-cape",
    },
    highlightedIds: ["res-desal", "res-water-lab"],
    user: {
      name: "Atlas Operator",
      wbc: 950,
      wbv: 46,
      contributions: 7,
      votesCast: 0,
    },
    protocol: {
      circulatingWbc: 2400000,
      treasuryWbc: 185000,
      stethReserve: 912,
      demandIndex: 58,
      activeUsers: 1488,
      visibleTrustedProviders: 0,
      supplyTarget: 2450000,
    },
    issues: [
      {
        id: "issue-water-cape",
        title: "Cape Town water resilience",
        region: "Africa",
        x: 54,
        y: 61,
        severity: "Critical",
        requestedWbc: 32000,
        summary:
          "Coastal desalination and sensor routing are needed to stabilize municipal water access.",
        linkedResources: ["res-desal", "res-water-lab"],
        proposalIds: ["prop-water-cape"],
      },
      {
        id: "issue-grid-manila",
        title: "Manila microgrid resilience",
        region: "Asia Pacific",
        x: 84,
        y: 49,
        severity: "High",
        requestedWbc: 28000,
        summary:
          "Dense districts need resilient battery-backed power coordination during storm volatility.",
        linkedResources: ["res-grid-team", "res-battery-bank"],
        proposalIds: ["prop-grid-manila"],
      },
      {
        id: "issue-cold-bogota",
        title: "Bogota cold-chain access",
        region: "Latin America",
        x: 31,
        y: 58,
        severity: "High",
        requestedWbc: 19000,
        summary:
          "Food delivery and medicine storage require locally routed cooling capacity and verified operators.",
        linkedResources: ["res-cold-chain"],
        proposalIds: [],
      },
      {
        id: "issue-shelter-athens",
        title: "Athens shelter routing",
        region: "Europe",
        x: 56,
        y: 35,
        severity: "Moderate",
        requestedWbc: 16000,
        summary:
          "Temporary shelter inventory exists, but routing and trust verification remain fragmented.",
        linkedResources: ["res-shelter-kit"],
        proposalIds: [],
      },
      {
        id: "issue-learning-lagos",
        title: "Lagos learning commons",
        region: "Africa",
        x: 50,
        y: 54,
        severity: "High",
        requestedWbc: 12000,
        summary:
          "Distributed training, shared translation, and community moderators are needed for open learning paths.",
        linkedResources: ["res-language-hub", "res-water-lab"],
        proposalIds: ["prop-learning-lagos"],
      },
    ],
    resources: [
      {
        id: "res-desal",
        title: "Mobile desalination unit",
        type: "Equipment",
        region: "Africa",
        x: 56,
        y: 62,
        priceWbc: 84,
        providerWbv: 42,
        counterpartyFloor: 18,
        status: "Available",
        owner: "Blue Harbor Ops",
        summary:
          "Trailer-scale coastal desalination module ready for municipal deployment.",
        linkedIssues: ["issue-water-cape"],
      },
      {
        id: "res-water-lab",
        title: "Water analytics playbook",
        type: "Knowledge",
        region: "Africa",
        x: 52,
        y: 58,
        priceWbc: 36,
        providerWbv: 38,
        counterpartyFloor: 8,
        status: "Available",
        owner: "Aqua Commons",
        summary:
          "Open operating guide for testing, sampling, and sensor-based monitoring.",
        linkedIssues: ["issue-water-cape", "issue-learning-lagos"],
      },
      {
        id: "res-grid-team",
        title: "Community microgrid team",
        type: "Service",
        region: "Asia Pacific",
        x: 82,
        y: 50,
        priceWbc: 96,
        providerWbv: 51,
        counterpartyFloor: 24,
        status: "Available",
        owner: "Grid Relay Cooperative",
        summary:
          "Field operators for microgrid rollout, load balancing, and maintenance.",
        linkedIssues: ["issue-grid-manila"],
      },
      {
        id: "res-battery-bank",
        title: "Modular battery bank",
        type: "Equipment",
        region: "Asia Pacific",
        x: 80,
        y: 56,
        priceWbc: 128,
        providerWbv: 57,
        counterpartyFloor: 30,
        status: "Available",
        owner: "Signal Storage",
        summary:
          "Rapid-deploy storage stack sized for neighborhood power resilience.",
        linkedIssues: ["issue-grid-manila"],
      },
      {
        id: "res-cold-chain",
        title: "Shared cold-room access",
        type: "Space",
        region: "Latin America",
        x: 30,
        y: 60,
        priceWbc: 72,
        providerWbv: 34,
        counterpartyFloor: 12,
        status: "Available",
        owner: "Mercado Norte",
        summary:
          "Verified storage space for food, medicines, and community distribution.",
        linkedIssues: ["issue-cold-bogota"],
      },
      {
        id: "res-shelter-kit",
        title: "Rapid shelter inventory",
        type: "Equipment",
        region: "Europe",
        x: 55,
        y: 36,
        priceWbc: 54,
        providerWbv: 29,
        counterpartyFloor: 10,
        status: "Available",
        owner: "Civic Relief Network",
        summary:
          "Modular shelter kits with inventory tracking for emergency deployment.",
        linkedIssues: ["issue-shelter-athens"],
      },
      {
        id: "res-language-hub",
        title: "Multilingual facilitator pool",
        type: "Service",
        region: "Africa",
        x: 51,
        y: 55,
        priceWbc: 44,
        providerWbv: 26,
        counterpartyFloor: 6,
        status: "Available",
        owner: "Open Translation Circle",
        summary:
          "Facilitators for skill-sharing, moderation, and education delivery.",
        linkedIssues: ["issue-learning-lagos"],
      },
    ],
    proposals: [
      {
        id: "prop-water-cape",
        title: "Deploy Cape Town desalination corridor",
        issueId: "issue-water-cape",
        requestedWbc: 32000,
        fundedWbc: 14600,
        votes: 128,
        voterIds: [],
        status: "Ready",
        summary:
          "Blend mobile desalination, field sensors, and neighborhood delivery routing.",
      },
      {
        id: "prop-grid-manila",
        title: "Storm-resilient microgrid mesh",
        issueId: "issue-grid-manila",
        requestedWbc: 28000,
        fundedWbc: 8200,
        votes: 112,
        voterIds: [],
        status: "Ready",
        summary:
          "Coordinate battery deployment, field teams, and maintenance coverage by district.",
      },
      {
        id: "prop-learning-lagos",
        title: "Open learning moderators and translation fund",
        issueId: "issue-learning-lagos",
        requestedWbc: 12000,
        fundedWbc: 4300,
        votes: 88,
        voterIds: [],
        status: "Active",
        summary:
          "Support community moderators, translated content, and verified peer review.",
      },
    ],
    knowledge: [
      {
        id: "know-microgrid",
        title: "Community microgrid playbook",
        domain: "Energy",
        author: "Ava Chen",
        wbvReward: 6,
        summary:
          "Procurement, operator scheduling, and maintenance routing for local storage networks.",
        createdAt: now - 1000 * 60 * 40,
      },
      {
        id: "know-water",
        title: "Water sensor deployment checklist",
        domain: "Water",
        author: "Lebo Dlamini",
        wbvReward: 4,
        summary:
          "Field checklist for sampling, thresholds, and alert handling in low-resource districts.",
        createdAt: now - 1000 * 60 * 95,
      },
      {
        id: "know-rental",
        title: "Shared asset rental trust rubric",
        domain: "Marketplace",
        author: "Jonas Reed",
        wbvReward: 5,
        summary:
          "How to score reliable owners and renters with contribution-linked trust signals.",
        createdAt: now - 1000 * 60 * 180,
      },
    ],
    activity: [
      {
        id: "act-seed-1",
        kind: "proposal",
        message:
          "Cape Town desalination corridor passed the WBV validation threshold.",
        createdAt: now - 1000 * 60 * 18,
      },
      {
        id: "act-seed-2",
        kind: "knowledge",
        message: "Lebo Dlamini published a water sensor deployment checklist.",
        createdAt: now - 1000 * 60 * 52,
      },
      {
        id: "act-seed-3",
        kind: "exchange",
        message:
          "Signal Storage listed a modular battery bank on the resource map.",
        createdAt: now - 1000 * 60 * 84,
      },
    ],
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return createDefaultState();

    const parsed = JSON.parse(stored);
    if (!parsed || !parsed.issues || !parsed.resources || !parsed.proposals) {
      return createDefaultState();
    }

    return parsed;
  } catch {
    return createDefaultState();
  }
}

const state = loadState();

const refs = {
  navButtons: [...document.querySelectorAll(".nav-button")],
  jumpButtons: [...document.querySelectorAll("[data-jump]")],
  statusBanner: document.getElementById("status-banner"),
  operatorName: document.getElementById("operator-name"),
  walletWbc: document.getElementById("wallet-wbc"),
  walletWbv: document.getElementById("wallet-wbv"),
  contributionCount: document.getElementById("contribution-count"),
  metricCirculating: document.getElementById("metric-circulating"),
  metricTreasury: document.getElementById("metric-treasury"),
  metricDemand: document.getElementById("metric-demand"),
  metricSteth: document.getElementById("metric-steth"),
  metricTrusted: document.getElementById("metric-trusted"),
  modeButtons: [...document.querySelectorAll(".segmented-button")],
  regionFilter: document.getElementById("region-filter"),
  mapModeLabel: document.getElementById("map-mode-label"),
  mapModeCopy: document.getElementById("map-mode-copy"),
  mapSummary: document.getElementById("map-summary"),
  mapSurface: document.getElementById("map-surface"),
  focusLinked: document.getElementById("focus-linked"),
  inspectorTitle: document.getElementById("inspector-title"),
  inspectorStatus: document.getElementById("inspector-status"),
  inspectorCopy: document.getElementById("inspector-copy"),
  detailGrid: document.getElementById("detail-grid"),
  primaryAction: document.getElementById("primary-action"),
  secondaryAction: document.getElementById("secondary-action"),
  linkedList: document.getElementById("linked-list"),
  relatedCount: document.getElementById("related-count"),
  exchangeTrustFilter: document.getElementById("exchange-trust-filter"),
  exchangeTrustOutput: document.getElementById("exchange-trust-output"),
  exchangeList: document.getElementById("exchange-list"),
  listingForm: document.getElementById("listing-form"),
  listingTitle: document.getElementById("listing-title"),
  listingType: document.getElementById("listing-type"),
  listingRegion: document.getElementById("listing-region"),
  listingPrice: document.getElementById("listing-price"),
  listingFloor: document.getElementById("listing-floor"),
  listingIssue: document.getElementById("listing-issue"),
  listingSummary: document.getElementById("listing-summary"),
  treasuryFill: document.getElementById("treasury-fill"),
  proposalList: document.getElementById("proposal-list"),
  proposalForm: document.getElementById("proposal-form"),
  proposalTitle: document.getElementById("proposal-title"),
  proposalIssue: document.getElementById("proposal-issue"),
  proposalRequest: document.getElementById("proposal-request"),
  proposalSummary: document.getElementById("proposal-summary"),
  knowledgeList: document.getElementById("knowledge-list"),
  knowledgeForm: document.getElementById("knowledge-form"),
  knowledgeTitle: document.getElementById("knowledge-title"),
  knowledgeDomain: document.getElementById("knowledge-domain"),
  knowledgeSummary: document.getElementById("knowledge-summary"),
  supplyTarget: document.getElementById("supply-target"),
  supplyCopy: document.getElementById("supply-copy"),
  supplyBars: document.getElementById("supply-bars"),
  recalculateSupply: document.getElementById("recalculate-supply"),
  activityCount: document.getElementById("activity-count"),
  activityFeed: document.getElementById("activity-feed"),
  resetDemo: document.getElementById("reset-demo"),
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(value) {
  return value.toLocaleString();
}

function formatWbc(value) {
  return `${formatNumber(Math.round(value))} WBC`;
}

function formatCompact(value) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function relativeTime(timestamp) {
  const minutes = Math.max(1, Math.round((Date.now() - timestamp) / 60000));

  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setMessage(text, tone = "success") {
  ui.message = { text, tone };
  renderStatus();
}

function renderStatus() {
  refs.statusBanner.textContent = ui.message.text;
  refs.statusBanner.dataset.tone = ui.message.tone;
}

function randomPosition(region) {
  const anchor = regionAnchors[region] ?? regionAnchors.Africa;
  const x = anchor.x[0] + Math.random() * (anchor.x[1] - anchor.x[0]);
  const y = anchor.y[0] + Math.random() * (anchor.y[1] - anchor.y[0]);

  return {
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
  };
}

function getRegions() {
  return [
    "All regions",
    ...new Set(state.issues.map((issue) => issue.region).sort()),
  ];
}

function getIssue(issueId) {
  return state.issues.find((issue) => issue.id === issueId);
}

function getResource(resourceId) {
  return state.resources.find((resource) => resource.id === resourceId);
}

function getProposal(proposalId) {
  return state.proposals.find((proposal) => proposal.id === proposalId);
}

function getSelectedNode() {
  if (!state.selected) return null;

  if (state.selected.type === "issue") {
    const issue = getIssue(state.selected.id);
    return issue ? { type: "issue", data: issue } : null;
  }

  const resource = getResource(state.selected.id);
  return resource ? { type: "resource", data: resource } : null;
}

function getVisibleMapNodes() {
  if (state.mapMode === "issues") {
    return state.issues.filter(
      (issue) =>
        state.filters.region === "All regions" ||
        issue.region === state.filters.region,
    );
  }

  return state.resources.filter(
    (resource) =>
      (state.filters.region === "All regions" ||
        resource.region === state.filters.region) &&
      resource.providerWbv >= state.filters.exchangeTrust,
  );
}

function getVisibleExchangeResources() {
  return state.resources.filter(
    (resource) => resource.providerWbv >= state.filters.exchangeTrust,
  );
}

function refreshProposalStatus(proposal) {
  if (proposal.fundedWbc >= proposal.requestedWbc && proposal.votes >= 100) {
    proposal.status = "Funded";
    return;
  }

  if (proposal.votes >= 100) {
    proposal.status = "Ready";
    return;
  }

  proposal.status = "Active";
}

function updateProtocolMetrics() {
  const openFundingGap = state.proposals.reduce(
    (sum, proposal) =>
      sum + Math.max(proposal.requestedWbc - proposal.fundedWbc, 0),
    0,
  );
  const reservedResources = state.resources.filter(
    (resource) => resource.status === "Reserved",
  ).length;
  const activeProposals = state.proposals.filter(
    (proposal) => proposal.status !== "Funded",
  ).length;

  state.proposals.forEach(refreshProposalStatus);

  state.protocol.demandIndex = clamp(
    28 +
      reservedResources * 7 +
      activeProposals * 5 +
      Math.round(openFundingGap / 9000) +
      state.knowledge.length * 2 +
      state.user.contributions,
    18,
    98,
  );

  state.protocol.activeUsers =
    1200 +
    state.resources.length * 17 +
    state.knowledge.length * 12 +
    state.proposals.length * 21 +
    reservedResources * 11;

  state.protocol.visibleTrustedProviders = state.resources.filter(
    (resource) => resource.providerWbv >= state.filters.exchangeTrust,
  ).length;

  state.protocol.supplyTarget = Math.round(
    2100000 +
      state.protocol.demandIndex * 5400 +
      openFundingGap / 14 +
      reservedResources * 1800,
  );
}

function recordActivity(kind, message) {
  state.activity.unshift({
    id: `act-${Date.now().toString(36)}`,
    kind,
    message,
    createdAt: Date.now(),
  });

  state.activity = state.activity.slice(0, 12);
}

function rewardContribution(wbv, message) {
  state.user.wbv += wbv;
  state.user.contributions += 1;
  recordActivity("trust", message);
}

function renderSidebar() {
  refs.operatorName.textContent = state.user.name;
  refs.walletWbc.textContent = formatWbc(state.user.wbc);
  refs.walletWbv.textContent = `${formatNumber(state.user.wbv)} WBV`;
  refs.contributionCount.textContent = `${formatNumber(
    state.user.contributions,
  )} contribution paths recorded.`;
}

function renderMetrics() {
  refs.metricCirculating.textContent = formatCompact(
    state.protocol.circulatingWbc,
  );
  refs.metricTreasury.textContent = formatCompact(state.protocol.treasuryWbc);
  refs.metricDemand.textContent = `${state.protocol.demandIndex}`;
  refs.metricSteth.textContent = `${state.protocol.stethReserve.toLocaleString()} stETH`;
  refs.metricTrusted.textContent = `${state.protocol.visibleTrustedProviders}`;
}

function renderFilters() {
  const allRegions = getRegions();
  const listingRegions = allRegions.filter(
    (region) => region !== "All regions",
  );

  refs.regionFilter.innerHTML = allRegions
    .map(
      (region) =>
        `<option value="${region}" ${
          region === state.filters.region ? "selected" : ""
        }>${region}</option>`,
    )
    .join("");

  const selectedListingRegion = listingRegions.includes(
    refs.listingRegion.value,
  )
    ? refs.listingRegion.value
    : listingRegions[0];
  const selectedListingIssue = state.issues.some(
    (issue) => issue.id === refs.listingIssue.value,
  )
    ? refs.listingIssue.value
    : state.issues[0].id;
  const selectedProposalIssue = state.issues.some(
    (issue) => issue.id === refs.proposalIssue.value,
  )
    ? refs.proposalIssue.value
    : state.issues[0].id;

  refs.listingRegion.innerHTML = listingRegions
    .map(
      (region) =>
        `<option value="${region}" ${
          region === selectedListingRegion ? "selected" : ""
        }>${region}</option>`,
    )
    .join("");

  refs.listingIssue.innerHTML = state.issues
    .map(
      (issue) =>
        `<option value="${issue.id}" ${
          issue.id === selectedListingIssue ? "selected" : ""
        }>${issue.title}</option>`,
    )
    .join("");

  refs.proposalIssue.innerHTML = state.issues
    .map(
      (issue) =>
        `<option value="${issue.id}" ${
          issue.id === selectedProposalIssue ? "selected" : ""
        }>${issue.title}</option>`,
    )
    .join("");

  refs.exchangeTrustFilter.value = `${state.filters.exchangeTrust}`;
  refs.exchangeTrustOutput.textContent = `${state.filters.exchangeTrust} WBV provider floor`;
}

function renderMap() {
  const nodes = getVisibleMapNodes();
  refs.mapSurface.dataset.mode = state.mapMode;

  refs.modeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === state.mapMode);
  });

  if (state.mapMode === "issues") {
    refs.mapModeLabel.textContent = "Issue map";
    refs.mapModeCopy.textContent =
      "Tracking planetary bottlenecks, funding gaps, and community demand.";
    refs.mapSummary.textContent = `${nodes.length} issues visible across ${
      state.filters.region === "All regions"
        ? "all regions"
        : state.filters.region
    }.`;
  } else {
    refs.mapModeLabel.textContent = "Resource map";
    refs.mapModeCopy.textContent =
      "Showing verified providers filtered by WBV trust on the exchange surface.";
    refs.mapSummary.textContent = `${nodes.length} resources visible with provider trust above ${state.filters.exchangeTrust} WBV.`;
  }

  refs.mapSurface.innerHTML = nodes
    .map((node) => {
      const nodeType = state.mapMode === "issues" ? "issue" : "resource";
      const isSelected =
        state.selected?.type === nodeType && state.selected?.id === node.id;
      const isHighlighted = state.highlightedIds.includes(node.id);
      const label =
        nodeType === "issue" ? node.severity : `${node.providerWbv} WBV`;

      return `
        <button
          class="map-marker ${isSelected ? "is-selected" : ""} ${
            isHighlighted ? "is-highlighted" : ""
          }"
          data-node-type="${nodeType}"
          data-node-id="${node.id}"
          style="left: ${node.x}%; top: ${node.y}%;"
          type="button"
        >
          <span class="map-marker__pin"></span>
          <span class="map-marker__label">${label}</span>
        </button>
      `;
    })
    .join("");
}

function reserveEligibility(resource) {
  if (resource.status !== "Available") {
    return {
      allowed: false,
      reason: "Already reserved",
    };
  }

  if (state.user.wbc < resource.priceWbc) {
    return {
      allowed: false,
      reason: "Insufficient WBC",
    };
  }

  if (state.user.wbv < resource.counterpartyFloor) {
    return {
      allowed: false,
      reason: `Need ${resource.counterpartyFloor} WBV`,
    };
  }

  return {
    allowed: true,
    reason: `Reserve for ${resource.priceWbc} WBC`,
  };
}

function renderInspector() {
  const selected = getSelectedNode();

  if (!selected) {
    refs.inspectorTitle.textContent = "Select a node";
    refs.inspectorStatus.textContent = "Awaiting input";
    refs.inspectorCopy.textContent =
      "Choose an issue or resource node to inspect local demand, trust requirements, and linked protocol actions.";
    refs.detailGrid.innerHTML = "";
    refs.primaryAction.textContent = "Select a node";
    refs.primaryAction.disabled = true;
    refs.secondaryAction.textContent = "Open response flow";
    refs.secondaryAction.disabled = true;
    refs.linkedList.innerHTML = "";
    refs.relatedCount.textContent = "0";
    return;
  }

  const { type, data } = selected;
  const linkedNodes =
    type === "issue"
      ? data.linkedResources.map((id) => ({
          type: "resource",
          data: getResource(id),
        }))
      : data.linkedIssues.map((id) => ({
          type: "issue",
          data: getIssue(id),
        }));

  refs.inspectorTitle.textContent = data.title;
  refs.relatedCount.textContent = `${linkedNodes.filter(Boolean).length}`;

  if (type === "issue") {
    refs.inspectorStatus.textContent = data.severity;
    refs.inspectorCopy.textContent = data.summary;
    refs.detailGrid.innerHTML = `
      <div>
        <dt>Region</dt>
        <dd>${data.region}</dd>
      </div>
      <div>
        <dt>Requested</dt>
        <dd>${formatWbc(data.requestedWbc)}</dd>
      </div>
      <div>
        <dt>Linked resources</dt>
        <dd>${data.linkedResources.length}</dd>
      </div>
      <div>
        <dt>Active proposals</dt>
        <dd>${data.proposalIds.length}</dd>
      </div>
    `;
    refs.primaryAction.textContent = "View linked resources";
    refs.primaryAction.disabled = data.linkedResources.length === 0;
    refs.secondaryAction.textContent = "Create response proposal";
    refs.secondaryAction.disabled = false;
  } else {
    const eligibility = reserveEligibility(data);

    refs.inspectorStatus.textContent = data.status;
    refs.inspectorCopy.textContent = data.summary;
    refs.detailGrid.innerHTML = `
      <div>
        <dt>Owner</dt>
        <dd>${data.owner}</dd>
      </div>
      <div>
        <dt>Region</dt>
        <dd>${data.region}</dd>
      </div>
      <div>
        <dt>Price</dt>
        <dd>${formatWbc(data.priceWbc)}</dd>
      </div>
      <div>
        <dt>Provider trust</dt>
        <dd>${data.providerWbv} WBV</dd>
      </div>
      <div>
        <dt>Requester floor</dt>
        <dd>${data.counterpartyFloor} WBV</dd>
      </div>
      <div>
        <dt>Status</dt>
        <dd>${data.status}</dd>
      </div>
    `;
    refs.primaryAction.textContent = eligibility.reason;
    refs.primaryAction.disabled = !eligibility.allowed;
    refs.secondaryAction.textContent = "View linked issues";
    refs.secondaryAction.disabled = data.linkedIssues.length === 0;
  }

  refs.linkedList.innerHTML = linkedNodes
    .filter((entry) => entry.data)
    .map(
      (entry) => `
        <button
          class="linked-button"
          data-select-type="${entry.type}"
          data-select-id="${entry.data.id}"
          type="button"
        >
          <strong>${entry.data.title}</strong>
          <div class="sidebar-meta">${
            entry.type === "issue"
              ? entry.data.severity
              : `${entry.data.providerWbv} WBV`
          } · ${entry.data.region}</div>
        </button>
      `,
    )
    .join("");
}

function renderExchange() {
  const resources = getVisibleExchangeResources();

  refs.exchangeList.innerHTML = resources
    .map((resource) => {
      const eligibility = reserveEligibility(resource);

      return `
        <article class="data-row">
          <div class="data-row__main">
            <div>
              <h3>${resource.title}</h3>
              <p class="data-row__summary">${resource.summary}</p>
            </div>
            <span class="status-chip">${resource.status}</span>
          </div>
          <div class="data-row__meta">
            <span class="meta-pill">${resource.type}</span>
            <span class="meta-pill">${resource.region}</span>
            <span class="meta-pill">${formatWbc(resource.priceWbc)}</span>
            <span class="meta-pill">Provider ${resource.providerWbv} WBV</span>
            <span class="meta-pill">Floor ${resource.counterpartyFloor} WBV</span>
          </div>
          <div class="data-row__actions">
            <button
              class="button-inline"
              data-open-resource="${resource.id}"
              type="button"
            >
              Open on map
            </button>
            <button
              class="button-inline"
              data-reserve-resource="${resource.id}"
              type="button"
              ${eligibility.allowed ? "" : "disabled"}
            >
              ${eligibility.reason}
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderProposals() {
  const treasuryFill = Math.min(
    (state.protocol.treasuryWbc / 250000) * 100,
    100,
  );
  refs.treasuryFill.style.width = `${treasuryFill}%`;

  refs.proposalList.innerHTML = state.proposals
    .map((proposal) => {
      const issue = getIssue(proposal.issueId);
      const alreadyVoted = proposal.voterIds.includes(state.user.name);
      const canFund =
        state.user.wbc >= FUNDING_TICK && proposal.status !== "Funded";

      return `
        <article class="data-row">
          <div class="data-row__main">
            <div>
              <h3>${proposal.title}</h3>
              <p class="data-row__summary">${proposal.summary}</p>
            </div>
            <span class="status-chip">${proposal.status}</span>
          </div>
          <div class="data-row__meta">
            <span class="meta-pill">${issue?.title ?? "Unlinked issue"}</span>
            <span class="meta-pill">${formatWbc(proposal.fundedWbc)} / ${formatWbc(
              proposal.requestedWbc,
            )}</span>
            <span class="meta-pill">${proposal.votes} WBV votes</span>
          </div>
          <div class="data-row__actions">
            <button
              class="button-inline"
              data-select-proposal="${proposal.id}"
              type="button"
            >
              Inspect issue
            </button>
            <button
              class="button-inline"
              data-vote-proposal="${proposal.id}"
              type="button"
              ${alreadyVoted ? "disabled" : ""}
            >
              ${alreadyVoted ? "Vote recorded" : `Vote with ${state.user.wbv} WBV`}
            </button>
            <button
              class="button-inline"
              data-fund-proposal="${proposal.id}"
              type="button"
              ${canFund ? "" : "disabled"}
            >
              ${canFund ? `Fund ${FUNDING_TICK} WBC` : "Insufficient WBC"}
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderKnowledge() {
  refs.knowledgeList.innerHTML = state.knowledge
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt)
    .map(
      (entry) => `
        <article class="knowledge-entry">
          <div class="knowledge-entry__main">
            <div>
              <h3>${entry.title}</h3>
              <p>${entry.summary}</p>
            </div>
            <span class="status-chip">+${entry.wbvReward} WBV</span>
          </div>
          <div class="knowledge-entry__meta">
            <span class="meta-pill">${entry.domain}</span>
            <span class="meta-pill">${entry.author}</span>
            <span class="meta-pill">${relativeTime(entry.createdAt)}</span>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderSupply() {
  const delta = state.protocol.supplyTarget - state.protocol.circulatingWbc;
  const direction = delta >= 0 ? "expand" : "contract";

  refs.supplyTarget.textContent = formatWbc(state.protocol.supplyTarget);
  refs.supplyCopy.textContent = `Demand suggests the circulating supply should ${direction} by ${formatNumber(
    Math.abs(delta),
  )} WBC from the current level.`;

  const base = state.protocol.demandIndex;
  const bars = Array.from({ length: 8 }, (_, index) =>
    clamp(22 + ((base + index * 6) % 70), 22, 94),
  );

  refs.supplyBars.innerHTML = bars
    .map((height) => `<span style="height: ${height}%"></span>`)
    .join("");
}

function renderActivity() {
  refs.activityCount.textContent = `${state.activity.length} events`;
  refs.activityFeed.innerHTML = state.activity
    .map(
      (entry) => `
        <article class="feed-item">
          <div class="feed-item__top">
            <span class="activity-kind">${entry.kind}</span>
            <span class="toolbar-value">${relativeTime(entry.createdAt)}</span>
          </div>
          <p>${entry.message}</p>
        </article>
      `,
    )
    .join("");
}

function renderNavState() {
  const sections = [
    "command-center",
    "maps",
    "exchange",
    "governance",
    "knowledge",
    "adaptive",
  ];

  const current = sections
    .map((id) => document.getElementById(id))
    .filter(Boolean)
    .find((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= 180 && rect.bottom >= 180;
    });

  refs.navButtons.forEach((button) => {
    button.classList.toggle(
      "is-active",
      button.dataset.jump === `#${current?.id ?? "command-center"}`,
    );
  });
}

function renderAll() {
  updateProtocolMetrics();
  renderStatus();
  renderSidebar();
  renderMetrics();
  renderFilters();
  renderMap();
  renderInspector();
  renderExchange();
  renderProposals();
  renderKnowledge();
  renderSupply();
  renderActivity();
  renderNavState();
  saveState();
}

function selectNode(type, id, highlights = []) {
  state.selected = { type, id };
  state.highlightedIds = highlights;
  renderAll();
}

function jumpTo(selector) {
  const target = document.querySelector(selector);
  if (!target) return;

  target.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function focusLinkedNodes() {
  const selected = getSelectedNode();
  if (!selected) {
    setMessage("Select an issue or resource node first.", "warning");
    renderStatus();
    return;
  }

  if (selected.type === "issue") {
    if (!selected.data.linkedResources.length) {
      setMessage(
        "No linked resources are available for this issue yet.",
        "warning",
      );
      renderStatus();
      return;
    }

    state.mapMode = "resources";
    state.highlightedIds = [...selected.data.linkedResources];
    state.selected = {
      type: "resource",
      id: selected.data.linkedResources[0],
    };
    setMessage("Focused the resource map on linked capacity.", "success");
    renderAll();
    return;
  }

  if (!selected.data.linkedIssues.length) {
    setMessage("No linked issues are attached to this resource.", "warning");
    renderStatus();
    return;
  }

  state.mapMode = "issues";
  state.highlightedIds = [...selected.data.linkedIssues];
  state.selected = {
    type: "issue",
    id: selected.data.linkedIssues[0],
  };
  setMessage("Focused the issue map on linked demand.", "success");
  renderAll();
}

function reserveResource(resourceId) {
  const resource = getResource(resourceId);
  if (!resource) return;

  const eligibility = reserveEligibility(resource);
  if (!eligibility.allowed) {
    setMessage(eligibility.reason, "warning");
    renderStatus();
    return;
  }

  state.user.wbc -= resource.priceWbc;
  state.protocol.treasuryWbc += Math.round(resource.priceWbc * 0.55);
  resource.status = "Reserved";

  recordActivity(
    "exchange",
    `${state.user.name} secured ${resource.title} for ${resource.priceWbc} WBC.`,
  );
  setMessage(`${resource.title} reserved with WBC settlement.`, "success");
  selectNode("resource", resource.id, [...resource.linkedIssues]);
}

function voteProposal(proposalId) {
  const proposal = getProposal(proposalId);
  if (!proposal) return;

  if (proposal.voterIds.includes(state.user.name)) {
    setMessage(
      "Your WBV vote is already attached to this proposal.",
      "warning",
    );
    renderStatus();
    return;
  }

  proposal.votes += state.user.wbv;
  proposal.voterIds.push(state.user.name);
  state.user.votesCast += 1;
  refreshProposalStatus(proposal);
  recordActivity(
    "governance",
    `${state.user.name} cast ${state.user.wbv} WBV on ${proposal.title}.`,
  );
  setMessage(`WBV vote recorded for ${proposal.title}.`, "success");
  renderAll();
}

function fundProposal(proposalId) {
  const proposal = getProposal(proposalId);
  if (!proposal) return;

  if (state.user.wbc < FUNDING_TICK) {
    setMessage("Insufficient WBC to fund this proposal.", "warning");
    renderStatus();
    return;
  }

  state.user.wbc -= FUNDING_TICK;
  state.protocol.treasuryWbc += FUNDING_TICK;
  proposal.fundedWbc += FUNDING_TICK;
  refreshProposalStatus(proposal);
  rewardContribution(
    1,
    `${state.user.name} earned 1 WBV for funding ${proposal.title}.`,
  );
  setMessage(`${proposal.title} received ${FUNDING_TICK} WBC.`, "success");
  renderAll();
}

function submitListing(event) {
  event.preventDefault();

  const linkedIssue = refs.listingIssue.value || state.issues[0].id;
  const position = randomPosition(refs.listingRegion.value);
  const id = `res-${Date.now().toString(36)}`;

  state.resources.unshift({
    id,
    title: refs.listingTitle.value.trim(),
    type: refs.listingType.value,
    region: refs.listingRegion.value,
    x: position.x,
    y: position.y,
    priceWbc: Number(refs.listingPrice.value),
    providerWbv: state.user.wbv,
    counterpartyFloor: Number(refs.listingFloor.value),
    status: "Available",
    owner: state.user.name,
    summary: refs.listingSummary.value.trim(),
    linkedIssues: [linkedIssue],
  });

  const issue = getIssue(linkedIssue);
  if (issue && !issue.linkedResources.includes(id)) {
    issue.linkedResources.push(id);
  }

  rewardContribution(
    2,
    `${state.user.name} earned 2 WBV for publishing ${refs.listingTitle.value.trim()}.`,
  );
  recordActivity(
    "exchange",
    `${state.user.name} listed ${refs.listingTitle.value.trim()} on the resource map.`,
  );
  state.mapMode = "resources";
  setMessage("New resource listing published to the exchange.", "success");
  refs.listingForm.reset();
  refs.listingPrice.value = "60";
  refs.listingFloor.value = "12";
  selectNode("resource", id, [linkedIssue]);
}

function submitProposal(event) {
  event.preventDefault();

  const issueId = refs.proposalIssue.value;
  const issue = getIssue(issueId);
  const id = `prop-${Date.now().toString(36)}`;

  state.proposals.unshift({
    id,
    title: refs.proposalTitle.value.trim(),
    issueId,
    requestedWbc: Number(refs.proposalRequest.value),
    fundedWbc: 0,
    votes: 0,
    voterIds: [],
    status: "Active",
    summary: refs.proposalSummary.value.trim(),
  });

  if (issue && !issue.proposalIds.includes(id)) {
    issue.proposalIds.push(id);
  }

  rewardContribution(
    2,
    `${state.user.name} earned 2 WBV for submitting ${refs.proposalTitle.value.trim()}.`,
  );
  recordActivity(
    "proposal",
    `${state.user.name} queued a proposal for ${issue?.title ?? "an issue node"}.`,
  );
  setMessage("Proposal added to the governance queue.", "success");
  refs.proposalForm.reset();
  refs.proposalRequest.value = "8000";
  renderAll();
}

function submitKnowledge(event) {
  event.preventDefault();

  state.knowledge.unshift({
    id: `know-${Date.now().toString(36)}`,
    title: refs.knowledgeTitle.value.trim(),
    domain: refs.knowledgeDomain.value.trim(),
    author: state.user.name,
    wbvReward: 3,
    summary: refs.knowledgeSummary.value.trim(),
    createdAt: Date.now(),
  });

  rewardContribution(
    3,
    `${state.user.name} earned 3 WBV for publishing ${refs.knowledgeTitle.value.trim()}.`,
  );
  recordActivity(
    "knowledge",
    `${state.user.name} published a new knowledge entry in ${refs.knowledgeDomain.value.trim()}.`,
  );
  setMessage("Knowledge entry published and WBV credited.", "success");
  refs.knowledgeForm.reset();
  renderAll();
}

function recalculateSupply() {
  const delta = state.protocol.supplyTarget - state.protocol.circulatingWbc;
  state.protocol.circulatingWbc = state.protocol.supplyTarget;
  recordActivity(
    "supply",
    `Adaptive supply ${delta >= 0 ? "expanded" : "contracted"} by ${formatNumber(
      Math.abs(delta),
    )} WBC.`,
  );
  setMessage(
    "Adaptive WBC supply updated to the current demand target.",
    "success",
  );
  renderAll();
}

function prefillProposalFromIssue(issue) {
  refs.proposalTitle.value = `Response for ${issue.title}`;
  refs.proposalIssue.value = issue.id;
  refs.proposalSummary.value = issue.summary;
  jumpTo("#proposal-form");
  refs.proposalTitle.focus();
  setMessage("Proposal form prefilled from the selected issue.", "success");
  renderStatus();
}

function handlePrimaryAction() {
  const selected = getSelectedNode();
  if (!selected) return;

  if (selected.type === "issue") {
    focusLinkedNodes();
    return;
  }

  reserveResource(selected.data.id);
}

function handleSecondaryAction() {
  const selected = getSelectedNode();
  if (!selected) return;

  if (selected.type === "issue") {
    prefillProposalFromIssue(selected.data);
    return;
  }

  focusLinkedNodes();
}

function resetSimulation() {
  localStorage.removeItem(STORAGE_KEY);
  Object.assign(state, createDefaultState());
  setMessage("Simulation reset to the seeded whitepaper scenario.", "success");
  renderAll();
}

refs.jumpButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selector = button.dataset.jump;
    if (selector) jumpTo(selector);
  });
});

refs.modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.mapMode = button.dataset.mode;
    state.highlightedIds = [];
    setMessage(
      button.dataset.mode === "issues"
        ? "Issue map activated."
        : "Resource map activated.",
      "success",
    );
    renderAll();
  });
});

refs.regionFilter.addEventListener("change", (event) => {
  state.filters.region = event.target.value;
  renderAll();
});

refs.exchangeTrustFilter.addEventListener("input", (event) => {
  state.filters.exchangeTrust = Number(event.target.value);
  renderAll();
});

refs.focusLinked.addEventListener("click", focusLinkedNodes);
refs.primaryAction.addEventListener("click", handlePrimaryAction);
refs.secondaryAction.addEventListener("click", handleSecondaryAction);
refs.listingForm.addEventListener("submit", submitListing);
refs.proposalForm.addEventListener("submit", submitProposal);
refs.knowledgeForm.addEventListener("submit", submitKnowledge);
refs.recalculateSupply.addEventListener("click", recalculateSupply);
refs.resetDemo.addEventListener("click", resetSimulation);

refs.mapSurface.addEventListener("click", (event) => {
  const marker = event.target.closest(".map-marker");
  if (!marker) return;

  state.highlightedIds = [];
  selectNode(marker.dataset.nodeType, marker.dataset.nodeId);
});

refs.linkedList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-select-type]");
  if (!button) return;

  state.mapMode =
    button.dataset.selectType === "issue" ? "issues" : "resources";
  state.highlightedIds = [];
  selectNode(button.dataset.selectType, button.dataset.selectId);
});

refs.exchangeList.addEventListener("click", (event) => {
  const openButton = event.target.closest("[data-open-resource]");
  if (openButton) {
    state.mapMode = "resources";
    selectNode("resource", openButton.dataset.openResource);
    jumpTo("#maps");
    return;
  }

  const reserveButton = event.target.closest("[data-reserve-resource]");
  if (reserveButton) {
    reserveResource(reserveButton.dataset.reserveResource);
  }
});

refs.proposalList.addEventListener("click", (event) => {
  const inspectButton = event.target.closest("[data-select-proposal]");
  if (inspectButton) {
    const proposal = getProposal(inspectButton.dataset.selectProposal);
    if (proposal) {
      state.mapMode = "issues";
      selectNode("issue", proposal.issueId);
      jumpTo("#maps");
    }
    return;
  }

  const voteButton = event.target.closest("[data-vote-proposal]");
  if (voteButton) {
    voteProposal(voteButton.dataset.voteProposal);
    return;
  }

  const fundButton = event.target.closest("[data-fund-proposal]");
  if (fundButton) {
    fundProposal(fundButton.dataset.fundProposal);
  }
});

window.addEventListener("scroll", renderNavState, { passive: true });
window.addEventListener("resize", renderNavState);

renderAll();
