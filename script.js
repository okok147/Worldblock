const STORAGE_KEY = "worldblock-simulator-v1";
const FUNDING_TICK = 250;
const DEFAULT_MESSAGE = "Protocol state synchronized locally.";

const VALIDATOR_GROUPS = [
  {
    id: "crowd",
    label: "Crowd",
    description:
      "Open community review checks whether the proof is legible and relevant.",
  },
  {
    id: "experts",
    label: "Experts",
    description:
      "Domain experts validate methods, delivery quality, and technical credibility.",
  },
  {
    id: "committee",
    label: "Committee",
    description:
      "Treasury committee approves release only after public proof and review are complete.",
  },
];

const STAGE_BLUEPRINTS = [
  {
    id: "stage-1",
    label: "Stage 1",
    share: 0.25,
    objective:
      "Prove the operating model with baseline data, first deliverables, and initial beneficiary feedback.",
  },
  {
    id: "stage-2",
    label: "Stage 2",
    share: 0.35,
    objective:
      "Expand field deployment, verify execution quality, and show repeatable user outcomes.",
  },
  {
    id: "stage-3",
    label: "Stage 3",
    share: 0.4,
    objective:
      "Demonstrate sustained adoption, final delivery, and public closeout before full release.",
  },
];

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

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return map[character];
  });
}

function createValidatorState() {
  return Object.fromEntries(
    VALIDATOR_GROUPS.map((group) => [
      group.id,
      {
        status: "pending",
        updatedAt: null,
      },
    ]),
  );
}

function createStageFromBlueprint(blueprint) {
  return {
    id: blueprint.id,
    label: blueprint.label,
    share: blueprint.share,
    objective: blueprint.objective,
    proofs: [],
    validators: createValidatorState(),
    releasedWbc: 0,
    releasedAt: null,
  };
}

function createPlanFromProposal(proposal, issue, now, options = {}) {
  const plan = {
    id: `plan-${proposal.id.replace(/^prop-/, "")}`,
    proposalId: proposal.id,
    title: proposal.title,
    idea: proposal.summary,
    businessModel: `Raise WBC against ${
      issue?.title ?? "the linked issue"
    }, keep committed capital in treasury, and release funds only after stage proof and public validation.`,
    beneficiaries: issue
      ? `${issue.region} residents, field operators, and verified delivery partners connected to ${issue.title}.`
      : "Local residents, field operators, and verified delivery partners.",
    distributionLogic: [
      "Committed capital equals the WBC already funded into the linked proposal and held in treasury until release.",
      "Stage 1, Stage 2, and Stage 3 move the cumulative release ceiling to 25%, 60%, and 100% of the committed pool.",
      "The next tranche equals round(committed pool × cumulative share) minus WBC already released in prior stages.",
      "Every stage requires at least one proof package containing data, deliverables, and user feedback.",
      "Crowd, experts, and committee must all pass the current stage before treasury can release the next tranche.",
      "All proof, validation result, and release events stay visible in the public ledger.",
    ],
    createdAt: now,
    stages: STAGE_BLUEPRINTS.map(createStageFromBlueprint),
    ledger: [],
  };

  if (options.seedDemo) {
    const seededStage = plan.stages[0];

    seededStage.proofs.unshift({
      id: "proof-water-pilot",
      title: "Pilot desalination readiness packet",
      metrics:
        "12 shoreline telemetry points online, 3 intake tests passed, and 640 households mapped into the first routing cohort.",
      deliverables:
        "Procurement receipts, deployment calendar, and operator staffing matrix published to the protocol ledger.",
      feedback:
        "18 local operators and 46 resident interviews confirm the routing model is understandable and useful.",
      createdAt: now - 1000 * 60 * 220,
    });

    seededStage.validators.crowd = {
      status: "pass",
      updatedAt: now - 1000 * 60 * 180,
    };
    seededStage.validators.experts = {
      status: "pass",
      updatedAt: now - 1000 * 60 * 132,
    };

    plan.ledger = [
      {
        id: "ledger-water-proof",
        kind: "proof",
        stageId: "stage-1",
        title: "Stage 1 proof package published",
        summary:
          "Baseline telemetry, delivery documents, and community feedback were published for review.",
        tone: "neutral",
        createdAt: now - 1000 * 60 * 220,
      },
      {
        id: "ledger-water-crowd",
        kind: "validation",
        stageId: "stage-1",
        title: "Crowd validation passed",
        summary:
          "Public reviewers confirmed that the proof package is complete and matches the stated milestone.",
        tone: "success",
        createdAt: now - 1000 * 60 * 180,
      },
      {
        id: "ledger-water-expert",
        kind: "validation",
        stageId: "stage-1",
        title: "Expert validation passed",
        summary:
          "Technical reviewers accepted the deployment methodology and delivery readiness evidence.",
        tone: "success",
        createdAt: now - 1000 * 60 * 132,
      },
    ];
  }

  return plan;
}

function createPlansFromProposals(proposals, issues, now, options = {}) {
  return proposals.map((proposal, index) => {
    const issue = issues.find((entry) => entry.id === proposal.issueId);

    return createPlanFromProposal(proposal, issue, now - index * 1000 * 60, {
      seedDemo:
        Boolean(options.seedDefaultPlan) && proposal.id === "prop-water-cape",
    });
  });
}

function createDefaultState() {
  const now = Date.now();

  const issues = [
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
  ];

  const proposals = [
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
  ];

  const plans = createPlansFromProposals(proposals, issues, now, {
    seedDefaultPlan: true,
  });

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
    selectedPlanId: plans[0]?.id ?? null,
    selectedStageId: "stage-1",
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
    issues,
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
    proposals,
    plans,
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

function normalizeProof(proof) {
  return {
    id: proof?.id || `proof-${Date.now().toString(36)}`,
    title: String(proof?.title || "Proof package"),
    metrics: String(proof?.metrics || ""),
    deliverables: String(proof?.deliverables || ""),
    feedback: String(proof?.feedback || ""),
    createdAt: Number(proof?.createdAt) || Date.now(),
  };
}

function normalizeValidatorState(validators) {
  const safe = createValidatorState();

  VALIDATOR_GROUPS.forEach((group) => {
    const entry = validators?.[group.id];
    if (!entry) return;

    safe[group.id] = {
      status: ["pending", "pass", "fail"].includes(entry.status)
        ? entry.status
        : "pending",
      updatedAt: entry.updatedAt ? Number(entry.updatedAt) : null,
    };
  });

  return safe;
}

function normalizeStage(stage, index) {
  const blueprint =
    STAGE_BLUEPRINTS.find((entry) => entry.id === stage?.id) ??
    STAGE_BLUEPRINTS[index];
  const fallback = createStageFromBlueprint(blueprint);

  return {
    ...fallback,
    objective: String(stage?.objective || fallback.objective),
    proofs: Array.isArray(stage?.proofs)
      ? stage.proofs
          .map(normalizeProof)
          .sort((a, b) => b.createdAt - a.createdAt)
      : [],
    validators: normalizeValidatorState(stage?.validators),
    releasedWbc: Math.max(Number(stage?.releasedWbc) || 0, 0),
    releasedAt: stage?.releasedAt ? Number(stage.releasedAt) : null,
  };
}

function normalizeLedgerEntry(entry) {
  return {
    id: entry?.id || `ledger-${Date.now().toString(36)}`,
    kind: String(entry?.kind || "note"),
    stageId: entry?.stageId ? String(entry.stageId) : null,
    title: String(entry?.title || "Ledger entry"),
    summary: String(entry?.summary || ""),
    tone: ["success", "warning", "neutral"].includes(entry?.tone)
      ? entry.tone
      : "neutral",
    createdAt: Number(entry?.createdAt) || Date.now(),
  };
}

function normalizePlan(plan, proposals, issues, index) {
  const proposal =
    proposals.find((entry) => entry.id === plan?.proposalId) ??
    proposals[index];
  const issue = proposal
    ? issues.find((entry) => entry.id === proposal.issueId)
    : null;
  const fallback = proposal
    ? createPlanFromProposal(proposal, issue, Date.now() - index * 1000)
    : {
        id: plan?.id || `plan-${index}`,
        proposalId: plan?.proposalId || null,
        title: "Unlinked plan",
        idea: "",
        businessModel: "",
        beneficiaries: "",
        distributionLogic: [],
        createdAt: Date.now(),
        stages: STAGE_BLUEPRINTS.map(createStageFromBlueprint),
        ledger: [],
      };
  const storedStages = Array.isArray(plan?.stages) ? plan.stages : [];

  return {
    ...fallback,
    id: String(plan?.id || fallback.id),
    proposalId: fallback.proposalId,
    title: String(plan?.title || fallback.title),
    idea: String(plan?.idea || fallback.idea),
    businessModel: String(plan?.businessModel || fallback.businessModel),
    beneficiaries: String(plan?.beneficiaries || fallback.beneficiaries),
    distributionLogic:
      Array.isArray(plan?.distributionLogic) && plan.distributionLogic.length
        ? plan.distributionLogic.map((entry) => String(entry))
        : fallback.distributionLogic,
    createdAt: Number(plan?.createdAt) || fallback.createdAt,
    stages: STAGE_BLUEPRINTS.map((blueprint, stageIndex) =>
      normalizeStage(
        storedStages.find((entry) => entry?.id === blueprint.id) ??
          storedStages[stageIndex],
        stageIndex,
      ),
    ),
    ledger: Array.isArray(plan?.ledger)
      ? plan.ledger
          .map(normalizeLedgerEntry)
          .sort((a, b) => b.createdAt - a.createdAt)
      : fallback.ledger,
  };
}

function ensurePlanCoverage(plans, proposals, issues) {
  const byProposal = new Map(plans.map((plan) => [plan.proposalId, plan]));

  const ordered = proposals.map((proposal, index) => {
    const existing = byProposal.get(proposal.id);
    if (existing) return existing;

    return createPlanFromProposal(
      proposal,
      issues.find((entry) => entry.id === proposal.issueId),
      Date.now() - index * 1000,
    );
  });

  const extras = plans.filter(
    (plan) => !proposals.some((proposal) => proposal.id === plan.proposalId),
  );

  return [...ordered, ...extras];
}

function getRecommendedStageId(plan) {
  return plan?.stages.find((stage) => !stage.releasedAt)?.id ?? "stage-3";
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return createDefaultState();

    const parsed = JSON.parse(stored);
    if (
      !parsed ||
      !Array.isArray(parsed.issues) ||
      !Array.isArray(parsed.proposals)
    ) {
      return createDefaultState();
    }

    const fallback = createDefaultState();
    const merged = {
      ...fallback,
      ...parsed,
      filters: {
        ...fallback.filters,
        ...parsed.filters,
      },
      selected: {
        ...fallback.selected,
        ...parsed.selected,
      },
      user: {
        ...fallback.user,
        ...parsed.user,
      },
      protocol: {
        ...fallback.protocol,
        ...parsed.protocol,
      },
    };

    merged.issues =
      Array.isArray(parsed.issues) && parsed.issues.length
        ? parsed.issues
        : fallback.issues;
    merged.resources =
      Array.isArray(parsed.resources) && parsed.resources.length
        ? parsed.resources
        : fallback.resources;
    merged.proposals =
      Array.isArray(parsed.proposals) && parsed.proposals.length
        ? parsed.proposals
        : fallback.proposals;
    merged.knowledge = Array.isArray(parsed.knowledge)
      ? parsed.knowledge
      : fallback.knowledge;
    merged.activity = Array.isArray(parsed.activity)
      ? parsed.activity
      : fallback.activity;

    const storedPlans = Array.isArray(parsed.plans)
      ? parsed.plans.map((plan, index) =>
          normalizePlan(plan, merged.proposals, merged.issues, index),
        )
      : createPlansFromProposals(merged.proposals, merged.issues, Date.now());

    merged.plans = ensurePlanCoverage(
      storedPlans,
      merged.proposals,
      merged.issues,
    );

    if (!merged.plans.length) {
      merged.plans = fallback.plans;
    }

    const selectedPlan = merged.plans.find(
      (plan) => plan.id === parsed.selectedPlanId,
    );
    merged.selectedPlanId = selectedPlan?.id ?? merged.plans[0].id;

    const activePlan =
      merged.plans.find((plan) => plan.id === merged.selectedPlanId) ??
      merged.plans[0];
    merged.selectedStageId = activePlan.stages.some(
      (stage) => stage.id === parsed.selectedStageId,
    )
      ? parsed.selectedStageId
      : getRecommendedStageId(activePlan);

    return merged;
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
  metricPlans: document.getElementById("metric-plans"),
  metricReleased: document.getElementById("metric-released"),
  planSelect: document.getElementById("plan-select"),
  planTitle: document.getElementById("plan-title"),
  planIdea: document.getElementById("plan-idea"),
  planTags: document.getElementById("plan-tags"),
  planBusinessModel: document.getElementById("plan-business-model"),
  planBeneficiaries: document.getElementById("plan-beneficiaries"),
  planMetrics: document.getElementById("plan-metrics"),
  planStatus: document.getElementById("plan-status"),
  planStatusCopy: document.getElementById("plan-status-copy"),
  stageLane: document.getElementById("stage-lane"),
  selectedStageTitle: document.getElementById("selected-stage-title"),
  selectedStageStatus: document.getElementById("selected-stage-status"),
  selectedStageObjective: document.getElementById("selected-stage-objective"),
  selectedStageDetails: document.getElementById("selected-stage-details"),
  validatorList: document.getElementById("validator-list"),
  releaseStage: document.getElementById("release-stage"),
  proofList: document.getElementById("proof-list"),
  proofForm: document.getElementById("proof-form"),
  proofPlan: document.getElementById("proof-plan"),
  proofStage: document.getElementById("proof-stage"),
  proofTitle: document.getElementById("proof-title"),
  proofMetrics: document.getElementById("proof-metrics"),
  proofDeliverables: document.getElementById("proof-deliverables"),
  proofFeedback: document.getElementById("proof-feedback"),
  distributionLogic: document.getElementById("distribution-logic"),
  ledgerCount: document.getElementById("ledger-count"),
  logicScope: document.getElementById("logic-scope"),
  validationSummary: document.getElementById("validation-summary"),
  ledgerFeed: document.getElementById("ledger-feed"),
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

function formatTimestamp(timestamp) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(timestamp);
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

function getPlan(planId) {
  return state.plans.find((plan) => plan.id === planId);
}

function getPlanByProposalId(proposalId) {
  return state.plans.find((plan) => plan.proposalId === proposalId);
}

function getCurrentPlan() {
  return getPlan(state.selectedPlanId) ?? state.plans[0] ?? null;
}

function getPlanProposal(plan) {
  return plan ? getProposal(plan.proposalId) : null;
}

function getPlanIssue(plan) {
  const proposal = getPlanProposal(plan);
  return proposal ? getIssue(proposal.issueId) : null;
}

function getPlanStage(plan, stageId) {
  return plan?.stages.find((stage) => stage.id === stageId) ?? null;
}

function getSelectedStage(plan = getCurrentPlan()) {
  if (!plan) return null;

  return (
    getPlanStage(plan, state.selectedStageId) ??
    getPlanStage(plan, getRecommendedStageId(plan)) ??
    plan.stages[0]
  );
}

function getStageIndex(stageId) {
  return STAGE_BLUEPRINTS.findIndex((entry) => entry.id === stageId);
}

function getCumulativeShare(stageId) {
  const stageIndex = getStageIndex(stageId);

  return STAGE_BLUEPRINTS.slice(0, stageIndex + 1).reduce(
    (sum, stage) => sum + stage.share,
    0,
  );
}

function getStageUnlock(plan, stageId) {
  const stageIndex = getStageIndex(stageId);
  if (stageIndex <= 0) {
    return {
      locked: false,
      reason: "Unlocked",
    };
  }

  const previousStage = plan.stages[stageIndex - 1];
  if (previousStage?.releasedAt) {
    return {
      locked: false,
      reason: "Unlocked",
    };
  }

  return {
    locked: true,
    reason: `Release ${plan.stages[stageIndex - 1]?.label ?? "prior stage"} first`,
  };
}

function getReleasedTotal(plan) {
  return plan.stages.reduce((sum, stage) => sum + stage.releasedWbc, 0);
}

function getReleasedBeforeStage(plan, stageId) {
  const stageIndex = getStageIndex(stageId);

  return plan.stages
    .slice(0, stageIndex)
    .reduce((sum, stage) => sum + stage.releasedWbc, 0);
}

function getCommittedPool(plan) {
  return getPlanProposal(plan)?.fundedWbc ?? 0;
}

function getRequestedPool(plan) {
  return getPlanProposal(plan)?.requestedWbc ?? 0;
}

function getStageTargetAmount(plan, stageId) {
  const committedPool = getCommittedPool(plan);
  const targetReleased = Math.round(
    committedPool * getCumulativeShare(stageId),
  );
  const releasedBefore = getReleasedBeforeStage(plan, stageId);

  return Math.max(targetReleased - releasedBefore, 0);
}

function getStageValidatorCounts(stage) {
  const statuses = Object.values(stage.validators);
  const passCount = statuses.filter((entry) => entry.status === "pass").length;
  const failCount = statuses.filter((entry) => entry.status === "fail").length;

  return {
    passCount,
    failCount,
    total: statuses.length,
  };
}

function isPlanComplete(plan) {
  return plan.stages.every((stage) => stage.releasedAt);
}

function getStageState(plan, stage) {
  const unlock = getStageUnlock(plan, stage.id);
  const { passCount, failCount, total } = getStageValidatorCounts(stage);

  if (stage.releasedAt) {
    return {
      state: "pass",
      label: `Released ${formatWbc(stage.releasedWbc)}`,
    };
  }

  if (unlock.locked) {
    return {
      state: "locked",
      label: unlock.reason,
    };
  }

  if (!stage.proofs.length) {
    return {
      state: "pending",
      label: "Awaiting proof",
    };
  }

  if (failCount > 0) {
    return {
      state: "fail",
      label: "Validation failed",
    };
  }

  if (passCount === total) {
    return {
      state: "pass",
      label: "Ready to release",
    };
  }

  return {
    state: "pending",
    label: `${passCount}/${total} validators passed`,
  };
}

function getPlanStatus(plan) {
  if (!plan) {
    return {
      state: "pending",
      label: "No plan",
      copy: "Submit a proposal to create staged release controls.",
    };
  }

  if (isPlanComplete(plan)) {
    return {
      state: "pass",
      label: "Completed",
      copy: "All three stages released successfully. Distribution logic and validation history remain public.",
    };
  }

  const activeStage =
    plan.stages.find((stage) => !stage.releasedAt) ?? plan.stages[0];
  const stageState = getStageState(plan, activeStage);

  if (stageState.state === "locked") {
    return {
      state: "pending",
      label: `${activeStage.label} gated`,
      copy: "The next milestone remains locked until the prior stage releases funds publicly.",
    };
  }

  if (stageState.label === "Awaiting proof") {
    return {
      state: "pending",
      label: `${activeStage.label} needs proof`,
      copy: "Publish data, deliverables, and user feedback before any validator can approve the next release.",
    };
  }

  if (stageState.state === "fail") {
    return {
      state: "fail",
      label: `${activeStage.label} blocked`,
      copy: "At least one validator marked the stage as failed. Publish a stronger proof package before release.",
    };
  }

  if (stageState.label === "Ready to release") {
    return {
      state: "pass",
      label: `${activeStage.label} ready`,
      copy: "Crowd, experts, and committee all passed the current stage. Treasury can release the next tranche.",
    };
  }

  return {
    state: "pending",
    label: `${activeStage.label} in review`,
    copy: "Proof is public and review is underway. Treasury release remains locked until all three validator groups pass.",
  };
}

function getReleaseEligibility(plan, stage) {
  const unlock = getStageUnlock(plan, stage.id);
  const amount = getStageTargetAmount(plan, stage.id);
  const { passCount, total, failCount } = getStageValidatorCounts(stage);

  if (stage.releasedAt) {
    return {
      allowed: false,
      amount,
      reason: "Tranche already released",
    };
  }

  if (unlock.locked) {
    return {
      allowed: false,
      amount,
      reason: unlock.reason,
    };
  }

  if (!stage.proofs.length) {
    return {
      allowed: false,
      amount,
      reason: "Need proof package",
    };
  }

  if (failCount > 0) {
    return {
      allowed: false,
      amount,
      reason: "Resolve failed review",
    };
  }

  if (passCount < total) {
    return {
      allowed: false,
      amount,
      reason: "Need all validators",
    };
  }

  if (amount <= 0) {
    return {
      allowed: false,
      amount,
      reason: "No tranche available",
    };
  }

  if (state.protocol.treasuryWbc < amount) {
    return {
      allowed: false,
      amount,
      reason: "Treasury shortfall",
    };
  }

  return {
    allowed: true,
    amount,
    reason: `Release ${formatWbc(amount)}`,
  };
}

function setPlanSelection(planId, stageId = null) {
  const plan = getPlan(planId) ?? state.plans[0];
  if (!plan) return;

  state.selectedPlanId = plan.id;
  state.selectedStageId = plan.stages.some((stage) => stage.id === stageId)
    ? stageId
    : getRecommendedStageId(plan);
}

function recordActivity(kind, message) {
  state.activity.unshift({
    id: `act-${Date.now().toString(36)}`,
    kind,
    message,
    createdAt: Date.now(),
  });

  state.activity = state.activity.slice(0, 16);
}

function recordPlanLedger(plan, entry) {
  plan.ledger.unshift({
    id: `ledger-${Date.now().toString(36)}-${Math.round(Math.random() * 999)}`,
    createdAt: Date.now(),
    tone: "neutral",
    ...entry,
  });

  plan.ledger = plan.ledger.slice(0, 28);
}

function rewardContribution(wbv, message) {
  state.user.wbv += wbv;
  state.user.contributions += 1;
  recordActivity("trust", message);
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
  state.proposals.forEach(refreshProposalStatus);

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
  const openPlans = state.plans.filter((plan) => !isPlanComplete(plan)).length;
  const releasedStages = state.plans.reduce(
    (sum, plan) => sum + plan.stages.filter((stage) => stage.releasedAt).length,
    0,
  );

  state.protocol.demandIndex = clamp(
    28 +
      reservedResources * 7 +
      activeProposals * 5 +
      openPlans * 3 +
      releasedStages * 2 +
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
    state.plans.length * 13 +
    reservedResources * 11;

  state.protocol.visibleTrustedProviders = state.resources.filter(
    (resource) => resource.providerWbv >= state.filters.exchangeTrust,
  ).length;

  state.protocol.supplyTarget = Math.round(
    2100000 +
      state.protocol.demandIndex * 5400 +
      openFundingGap / 14 +
      reservedResources * 1800 +
      releasedStages * 900,
  );
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
  const openPlans = state.plans.filter((plan) => !isPlanComplete(plan)).length;
  const releasedWbc = state.plans.reduce(
    (sum, plan) => sum + getReleasedTotal(plan),
    0,
  );

  refs.metricCirculating.textContent = formatCompact(
    state.protocol.circulatingWbc,
  );
  refs.metricTreasury.textContent = formatCompact(state.protocol.treasuryWbc);
  refs.metricDemand.textContent = `${state.protocol.demandIndex}`;
  refs.metricSteth.textContent = `${state.protocol.stethReserve.toLocaleString()} stETH`;
  refs.metricPlans.textContent = `${openPlans}`;
  refs.metricReleased.textContent = formatCompact(releasedWbc);
}

function renderFilters() {
  const allRegions = getRegions();
  const listingRegions = allRegions.filter(
    (region) => region !== "All regions",
  );

  refs.regionFilter.innerHTML = allRegions
    .map(
      (region) =>
        `<option value="${escapeHtml(region)}" ${
          region === state.filters.region ? "selected" : ""
        }>${escapeHtml(region)}</option>`,
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
        `<option value="${escapeHtml(region)}" ${
          region === selectedListingRegion ? "selected" : ""
        }>${escapeHtml(region)}</option>`,
    )
    .join("");

  refs.listingIssue.innerHTML = state.issues
    .map(
      (issue) =>
        `<option value="${issue.id}" ${
          issue.id === selectedListingIssue ? "selected" : ""
        }>${escapeHtml(issue.title)}</option>`,
    )
    .join("");

  refs.proposalIssue.innerHTML = state.issues
    .map(
      (issue) =>
        `<option value="${issue.id}" ${
          issue.id === selectedProposalIssue ? "selected" : ""
        }>${escapeHtml(issue.title)}</option>`,
    )
    .join("");

  refs.exchangeTrustFilter.value = `${state.filters.exchangeTrust}`;
  refs.exchangeTrustOutput.textContent = `${state.filters.exchangeTrust} WBV provider floor`;
}

function renderPlanRoom() {
  const plan = getCurrentPlan();

  refs.planSelect.innerHTML = state.plans
    .map(
      (entry) =>
        `<option value="${entry.id}" ${
          entry.id === plan?.id ? "selected" : ""
        }>${escapeHtml(entry.title)}</option>`,
    )
    .join("");

  refs.proofPlan.innerHTML = state.plans
    .map(
      (entry) =>
        `<option value="${entry.id}" ${
          entry.id === plan?.id ? "selected" : ""
        }>${escapeHtml(entry.title)}</option>`,
    )
    .join("");

  if (!plan) {
    refs.planTitle.textContent = "No plan available";
    refs.planIdea.textContent =
      "Submit a proposal to generate a staged business plan and treasury gate.";
    refs.planBusinessModel.textContent =
      "A plan appears here after a proposal is created.";
    refs.planBeneficiaries.textContent =
      "Beneficiaries and counterparties appear here after a proposal is linked.";
    refs.planTags.innerHTML = "";
    refs.planMetrics.innerHTML = `<div class="empty-state">No plan metrics yet.</div>`;
    refs.planStatus.textContent = "No plan";
    refs.planStatus.dataset.state = "pending";
    refs.planStatusCopy.textContent =
      "No plan is available for review, proof submission, or fund release.";
    refs.stageLane.innerHTML = `<div class="empty-state">Stage milestones appear here when a plan exists.</div>`;
    refs.selectedStageTitle.textContent = "Stage";
    refs.selectedStageStatus.textContent = "Awaiting proof";
    refs.selectedStageObjective.textContent =
      "Stage detail appears when a plan is selected.";
    refs.selectedStageDetails.innerHTML = "";
    refs.validatorList.innerHTML = `<div class="empty-state">Validator controls appear when a plan is selected.</div>`;
    refs.releaseStage.disabled = true;
    refs.releaseStage.textContent = "Release next tranche";
    refs.proofStage.innerHTML = "";
    refs.proofList.innerHTML = `<div class="empty-state">No proof packages available.</div>`;
    refs.distributionLogic.innerHTML = `<div class="empty-state">Distribution rules appear here.</div>`;
    refs.ledgerCount.textContent = "0 entries";
    refs.logicScope.textContent = "Live formula";
    refs.validationSummary.textContent = "0 events";
    refs.ledgerFeed.innerHTML = `<div class="empty-state">No validation history yet.</div>`;
    return;
  }

  const issue = getPlanIssue(plan);
  const proposal = getPlanProposal(plan);
  const stage = getSelectedStage(plan);
  const stageState = getStageState(plan, stage);
  const planStatus = getPlanStatus(plan);
  const releasedTotal = getReleasedTotal(plan);
  const nextTranche = getStageTargetAmount(plan, stage.id);

  refs.proofStage.innerHTML = plan.stages
    .map((entry) => {
      const unlock = getStageUnlock(plan, entry.id);
      const suffix = entry.releasedAt
        ? " (released)"
        : unlock.locked
          ? " (locked)"
          : "";

      return `<option value="${entry.id}" ${
        entry.id === stage.id ? "selected" : ""
      }>${escapeHtml(entry.label + suffix)}</option>`;
    })
    .join("");

  refs.planTitle.textContent = plan.title;
  refs.planIdea.textContent = plan.idea;
  refs.planBusinessModel.textContent = plan.businessModel;
  refs.planBeneficiaries.textContent = plan.beneficiaries;
  refs.planStatus.textContent = planStatus.label;
  refs.planStatus.dataset.state = planStatus.state;
  refs.planStatusCopy.textContent = planStatus.copy;

  refs.planTags.innerHTML = [
    `<span class="meta-pill">${escapeHtml(issue?.title ?? "Unlinked issue")}</span>`,
    `<span class="meta-pill">${escapeHtml(proposal?.status ?? "No proposal state")}</span>`,
    `<span class="meta-pill">${formatWbc(proposal?.fundedWbc ?? 0)} committed</span>`,
    `<span class="meta-pill">${plan.stages.filter((entry) => entry.releasedAt).length}/3 stages released</span>`,
  ].join("");

  refs.planMetrics.innerHTML = [
    {
      label: "Requested pool",
      value: formatWbc(getRequestedPool(plan)),
      copy: "Target WBC requested by the linked proposal.",
    },
    {
      label: "Committed pool",
      value: formatWbc(getCommittedPool(plan)),
      copy: "WBC already funded into the proposal and held in treasury.",
    },
    {
      label: "Released so far",
      value: formatWbc(releasedTotal),
      copy: "Treasury WBC already released after validated milestones.",
    },
    {
      label: `Next tranche`,
      value: formatWbc(nextTranche),
      copy: `Live tranche amount for ${stage.label} based on current committed capital.`,
    },
  ]
    .map(
      (entry) => `
        <article class="plan-stat">
          <span>${escapeHtml(entry.label)}</span>
          <strong>${escapeHtml(entry.value)}</strong>
          <small>${escapeHtml(entry.copy)}</small>
        </article>
      `,
    )
    .join("");

  refs.stageLane.innerHTML = plan.stages
    .map((entry) => {
      const unlock = getStageUnlock(plan, entry.id);
      const stateMeta = getStageState(plan, entry);
      const validatorCounts = getStageValidatorCounts(entry);

      return `
        <button
          class="stage-card ${entry.id === stage.id ? "is-active" : ""} ${
            entry.releasedAt ? "is-released" : ""
          } ${unlock.locked ? "is-locked" : ""}"
          data-stage-id="${entry.id}"
          type="button"
        >
          <div class="stage-card__top">
            <strong>${escapeHtml(entry.label)}</strong>
            <span class="status-chip" data-state="${escapeHtml(
              stateMeta.state,
            )}">${escapeHtml(stateMeta.label)}</span>
          </div>
          <div class="stage-card__body">
            <strong>${Math.round(getCumulativeShare(entry.id) * 100)}% cumulative ceiling</strong>
            <p>${escapeHtml(entry.objective)}</p>
            <p>${entry.proofs.length} proof package${
              entry.proofs.length === 1 ? "" : "s"
            } · ${validatorCounts.passCount}/${validatorCounts.total} pass</p>
          </div>
        </button>
      `;
    })
    .join("");

  refs.selectedStageTitle.textContent = stage.label;
  refs.selectedStageStatus.textContent = stageState.label;
  refs.selectedStageObjective.textContent = stage.objective;

  const validatorCounts = getStageValidatorCounts(stage);
  const unlock = getStageUnlock(plan, stage.id);
  refs.selectedStageDetails.innerHTML = `
    <div>
      <dt>Cumulative ceiling</dt>
      <dd>${Math.round(getCumulativeShare(stage.id) * 100)}%</dd>
    </div>
    <div>
      <dt>Current tranche</dt>
      <dd>${formatWbc(getStageTargetAmount(plan, stage.id))}</dd>
    </div>
    <div>
      <dt>Proof packages</dt>
      <dd>${stage.proofs.length}</dd>
    </div>
    <div>
      <dt>Validators passed</dt>
      <dd>${validatorCounts.passCount}/${validatorCounts.total}</dd>
    </div>
    <div>
      <dt>Stage release</dt>
      <dd>${stage.releasedAt ? formatTimestamp(stage.releasedAt) : "Pending"}</dd>
    </div>
    <div>
      <dt>Gate state</dt>
      <dd>${unlock.locked ? unlock.reason : stageState.label}</dd>
    </div>
  `;

  refs.validatorList.innerHTML = VALIDATOR_GROUPS.map((group) => {
    const validator = stage.validators[group.id];
    const canReview =
      !unlock.locked && !stage.releasedAt && stage.proofs.length > 0;

    return `
      <article class="validator-row">
        <div class="validator-row__top">
          <div>
            <h3>${escapeHtml(group.label)}</h3>
            <p>${escapeHtml(group.description)}</p>
          </div>
          <span class="status-chip" data-state="${escapeHtml(
            validator.status,
          )}">${escapeHtml(
            validator.status === "pending"
              ? "Pending"
              : validator.status === "pass"
                ? "Pass"
                : "Fail",
          )}</span>
        </div>
        <div class="validator-row__meta">
          <span class="meta-pill">${
            validator.updatedAt
              ? `Updated ${escapeHtml(relativeTime(validator.updatedAt))}`
              : "No validation recorded"
          }</span>
          <span class="meta-pill">${escapeHtml(stage.label)}</span>
        </div>
        <div class="validator-row__actions">
          <button
            class="validator-button ${
              validator.status === "pass" ? "is-active" : ""
            }"
            data-result="pass"
            data-validate-group="${group.id}"
            data-validate-result="pass"
            type="button"
            ${canReview ? "" : "disabled"}
          >
            Pass
          </button>
          <button
            class="validator-button ${
              validator.status === "fail" ? "is-active" : ""
            }"
            data-result="fail"
            data-validate-group="${group.id}"
            data-validate-result="fail"
            type="button"
            ${canReview ? "" : "disabled"}
          >
            Fail
          </button>
        </div>
      </article>
    `;
  }).join("");

  const release = getReleaseEligibility(plan, stage);
  refs.releaseStage.disabled = !release.allowed;
  refs.releaseStage.textContent = release.allowed
    ? `Release ${formatWbc(release.amount)}`
    : release.reason;

  refs.proofList.innerHTML = stage.proofs.length
    ? stage.proofs
        .map(
          (proof) => `
            <article class="proof-entry">
              <div class="proof-entry__top">
                <div>
                  <h3>${escapeHtml(proof.title)}</h3>
                  <p>Published ${escapeHtml(formatTimestamp(proof.createdAt))}</p>
                </div>
                <span class="status-chip" data-state="pass">Public proof</span>
              </div>
              <div class="proof-entry__meta">
                <span class="meta-pill">${escapeHtml(stage.label)}</span>
                <span class="meta-pill">${escapeHtml(relativeTime(proof.createdAt))}</span>
              </div>
              <div class="proof-entry__sections">
                <section class="proof-entry__section">
                  <h4>Data / metrics</h4>
                  <p>${escapeHtml(proof.metrics)}</p>
                </section>
                <section class="proof-entry__section">
                  <h4>Deliverables</h4>
                  <p>${escapeHtml(proof.deliverables)}</p>
                </section>
                <section class="proof-entry__section">
                  <h4>User feedback</h4>
                  <p>${escapeHtml(proof.feedback)}</p>
                </section>
              </div>
            </article>
          `,
        )
        .join("")
    : `<div class="empty-state">No proof packages yet for ${escapeHtml(
        stage.label,
      )}. Submit data, deliverables, and user feedback to open validation.</div>`;

  const logic = [
    {
      title: "Funding pool",
      body: `Linked proposal holds ${formatWbc(
        getCommittedPool(plan),
      )} committed against ${formatWbc(
        getRequestedPool(plan),
      )} requested. Funds remain in treasury until a stage clears review.`,
    },
    {
      title: "Cumulative milestone target",
      body: `${stage.label} moves the release ceiling to ${Math.round(
        getCumulativeShare(stage.id) * 100,
      )}% of the committed pool.`,
    },
    {
      title: "Current tranche formula",
      body: `${formatWbc(
        getCommittedPool(plan),
      )} × ${Math.round(getCumulativeShare(stage.id) * 100)}% - ${formatWbc(
        getReleasedBeforeStage(plan, stage.id),
      )} already released = ${formatWbc(getStageTargetAmount(plan, stage.id))}.`,
    },
    {
      title: "Validation gate",
      body: "Treasury release requires at least one proof package plus pass results from crowd, experts, and committee on the selected stage.",
    },
    {
      title: "Treasury availability",
      body: `Current treasury balance is ${formatWbc(
        state.protocol.treasuryWbc,
      )}. Release remains blocked if the balance falls below the computed tranche.`,
    },
  ];

  refs.logicScope.textContent = `${stage.label} formula`;
  refs.distributionLogic.innerHTML = logic
    .map(
      (entry) => `
        <article class="logic-item">
          <strong>${escapeHtml(entry.title)}</strong>
          <p>${escapeHtml(entry.body)}</p>
        </article>
      `,
    )
    .join("");

  const ledger = plan.ledger.slice().sort((a, b) => b.createdAt - a.createdAt);
  const validationEvents = ledger.filter(
    (entry) => entry.kind === "validation" || entry.kind === "release",
  ).length;

  refs.ledgerCount.textContent = `${ledger.length} entries`;
  refs.validationSummary.textContent = `${validationEvents} review events`;
  refs.ledgerFeed.innerHTML = ledger.length
    ? ledger
        .map(
          (entry) => `
            <article class="ledger-entry">
              <div class="ledger-entry__top">
                <span class="ledger-kind">${escapeHtml(entry.kind)}</span>
                <span class="toolbar-value">${escapeHtml(
                  formatTimestamp(entry.createdAt),
                )}</span>
              </div>
              <h3>${escapeHtml(entry.title)}</h3>
              <p>${escapeHtml(entry.summary)}</p>
            </article>
          `,
        )
        .join("")
    : `<div class="empty-state">Proof, validation, and release events will publish here.</div>`;
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
          <span class="map-marker__label">${escapeHtml(label)}</span>
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
    refs.inspectorStatus.dataset.state = "pending";
    refs.inspectorCopy.textContent = data.summary;
    refs.detailGrid.innerHTML = `
      <div>
        <dt>Region</dt>
        <dd>${escapeHtml(data.region)}</dd>
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
    refs.inspectorStatus.dataset.state =
      data.status === "Reserved" ? "pass" : "pending";
    refs.inspectorCopy.textContent = data.summary;
    refs.detailGrid.innerHTML = `
      <div>
        <dt>Owner</dt>
        <dd>${escapeHtml(data.owner)}</dd>
      </div>
      <div>
        <dt>Region</dt>
        <dd>${escapeHtml(data.region)}</dd>
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
        <dd>${escapeHtml(data.status)}</dd>
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
          <strong>${escapeHtml(entry.data.title)}</strong>
          <div class="sidebar-meta">${
            entry.type === "issue"
              ? escapeHtml(entry.data.severity)
              : `${entry.data.providerWbv} WBV`
          } · ${escapeHtml(entry.data.region)}</div>
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
              <h3>${escapeHtml(resource.title)}</h3>
              <p class="data-row__summary">${escapeHtml(resource.summary)}</p>
            </div>
            <span class="status-chip" data-state="${
              resource.status === "Reserved" ? "pass" : "pending"
            }">${escapeHtml(resource.status)}</span>
          </div>
          <div class="data-row__meta">
            <span class="meta-pill">${escapeHtml(resource.type)}</span>
            <span class="meta-pill">${escapeHtml(resource.region)}</span>
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
              ${escapeHtml(eligibility.reason)}
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
      const plan = getPlanByProposalId(proposal.id);

      return `
        <article class="data-row">
          <div class="data-row__main">
            <div>
              <h3>${escapeHtml(proposal.title)}</h3>
              <p class="data-row__summary">${escapeHtml(proposal.summary)}</p>
            </div>
            <span class="status-chip" data-state="${
              proposal.status === "Funded" ? "pass" : "pending"
            }">${escapeHtml(proposal.status)}</span>
          </div>
          <div class="data-row__meta">
            <span class="meta-pill">${escapeHtml(
              issue?.title ?? "Unlinked issue",
            )}</span>
            <span class="meta-pill">${formatWbc(proposal.fundedWbc)} / ${formatWbc(
              proposal.requestedWbc,
            )}</span>
            <span class="meta-pill">${proposal.votes} WBV votes</span>
            <span class="meta-pill">${
              plan
                ? `${plan.stages.filter((stage) => stage.releasedAt).length}/3 stages released`
                : "No plan"
            }</span>
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
              data-open-plan="${proposal.id}"
              type="button"
              ${plan ? "" : "disabled"}
            >
              Open plan
            </button>
            <button
              class="button-inline"
              data-vote-proposal="${proposal.id}"
              type="button"
              ${alreadyVoted ? "disabled" : ""}
            >
              ${
                alreadyVoted
                  ? "Vote recorded"
                  : `Vote with ${state.user.wbv} WBV`
              }
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
              <h3>${escapeHtml(entry.title)}</h3>
              <p>${escapeHtml(entry.summary)}</p>
            </div>
            <span class="status-chip" data-state="pass">+${entry.wbvReward} WBV</span>
          </div>
          <div class="knowledge-entry__meta">
            <span class="meta-pill">${escapeHtml(entry.domain)}</span>
            <span class="meta-pill">${escapeHtml(entry.author)}</span>
            <span class="meta-pill">${escapeHtml(relativeTime(entry.createdAt))}</span>
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
            <span class="activity-kind">${escapeHtml(entry.kind)}</span>
            <span class="toolbar-value">${escapeHtml(
              relativeTime(entry.createdAt),
            )}</span>
          </div>
          <p>${escapeHtml(entry.message)}</p>
        </article>
      `,
    )
    .join("");
}

function renderNavState() {
  const sections = [
    "command-center",
    "plans",
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
  renderPlanRoom();
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
  setMessage(
    `${proposal.title} received ${FUNDING_TICK} WBC. Stage ceilings updated.`,
    "success",
  );
  renderAll();
}

function submitListing(event) {
  event.preventDefault();

  const linkedIssue = refs.listingIssue.value || state.issues[0].id;
  const position = randomPosition(refs.listingRegion.value);
  const id = `res-${Date.now().toString(36)}`;
  const title = refs.listingTitle.value.trim();

  state.resources.unshift({
    id,
    title,
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
    `${state.user.name} earned 2 WBV for publishing ${title}.`,
  );
  recordActivity(
    "exchange",
    `${state.user.name} listed ${title} on the resource map.`,
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
  const title = refs.proposalTitle.value.trim();
  const summary = refs.proposalSummary.value.trim();

  state.proposals.unshift({
    id,
    title,
    issueId,
    requestedWbc: Number(refs.proposalRequest.value),
    fundedWbc: 0,
    votes: 0,
    voterIds: [],
    status: "Active",
    summary,
  });

  if (issue && !issue.proposalIds.includes(id)) {
    issue.proposalIds.push(id);
  }

  const plan = createPlanFromProposal(getProposal(id), issue, Date.now());
  state.plans.unshift(plan);
  setPlanSelection(plan.id, "stage-1");

  rewardContribution(
    2,
    `${state.user.name} earned 2 WBV for submitting ${title}.`,
  );
  recordPlanLedger(plan, {
    kind: "plan",
    stageId: "stage-1",
    title: "Business plan created",
    summary:
      "Stage 1, Stage 2, and Stage 3 milestone gates were opened for public proof and validation.",
  });
  recordActivity(
    "proposal",
    `${state.user.name} queued ${title} and opened a staged business plan.`,
  );
  setMessage("Proposal added and staged plan created.", "success");
  refs.proposalForm.reset();
  refs.proposalRequest.value = "8000";
  renderAll();
}

function submitKnowledge(event) {
  event.preventDefault();

  const title = refs.knowledgeTitle.value.trim();
  const domain = refs.knowledgeDomain.value.trim();

  state.knowledge.unshift({
    id: `know-${Date.now().toString(36)}`,
    title,
    domain,
    author: state.user.name,
    wbvReward: 3,
    summary: refs.knowledgeSummary.value.trim(),
    createdAt: Date.now(),
  });

  rewardContribution(
    3,
    `${state.user.name} earned 3 WBV for publishing ${title}.`,
  );
  recordActivity(
    "knowledge",
    `${state.user.name} published a new knowledge entry in ${domain}.`,
  );
  setMessage("Knowledge entry published and WBV credited.", "success");
  refs.knowledgeForm.reset();
  renderAll();
}

function submitProof(event) {
  event.preventDefault();

  const plan = getPlan(refs.proofPlan.value);
  if (!plan) {
    setMessage("Select a plan before submitting proof.", "warning");
    renderStatus();
    return;
  }

  const stage = getPlanStage(plan, refs.proofStage.value);
  if (!stage) {
    setMessage("Select a valid stage before submitting proof.", "warning");
    renderStatus();
    return;
  }

  const unlock = getStageUnlock(plan, stage.id);
  if (unlock.locked) {
    setMessage(unlock.reason, "warning");
    renderStatus();
    return;
  }

  if (stage.releasedAt) {
    setMessage("This stage has already released funds.", "warning");
    renderStatus();
    return;
  }

  stage.proofs.unshift(
    normalizeProof({
      title: refs.proofTitle.value.trim(),
      metrics: refs.proofMetrics.value.trim(),
      deliverables: refs.proofDeliverables.value.trim(),
      feedback: refs.proofFeedback.value.trim(),
      createdAt: Date.now(),
    }),
  );
  stage.validators = createValidatorState();

  recordPlanLedger(plan, {
    kind: "proof",
    stageId: stage.id,
    title: `${stage.label} proof package published`,
    summary:
      "Data, deliverables, and user feedback were published to the public ledger for validation.",
  });
  recordActivity(
    "proof",
    `${state.user.name} published a proof package for ${plan.title} ${stage.label}.`,
  );
  rewardContribution(
    2,
    `${state.user.name} earned 2 WBV for publishing proof on ${plan.title}.`,
  );

  setPlanSelection(plan.id, stage.id);
  refs.proofForm.reset();
  refs.proofPlan.value = plan.id;
  refs.proofStage.value = stage.id;
  setMessage("Proof package published to the public ledger.", "success");
  renderAll();
}

function updateValidation(groupId, result) {
  const plan = getCurrentPlan();
  const stage = getSelectedStage(plan);
  const validatorGroup = VALIDATOR_GROUPS.find((entry) => entry.id === groupId);

  if (!plan || !stage || !validatorGroup) return;

  const unlock = getStageUnlock(plan, stage.id);
  if (unlock.locked) {
    setMessage(unlock.reason, "warning");
    renderStatus();
    return;
  }

  if (stage.releasedAt) {
    setMessage("This stage has already released funds.", "warning");
    renderStatus();
    return;
  }

  if (!stage.proofs.length) {
    setMessage("Submit proof before recording validation.", "warning");
    renderStatus();
    return;
  }

  stage.validators[groupId] = {
    status: result,
    updatedAt: Date.now(),
  };

  recordPlanLedger(plan, {
    kind: "validation",
    stageId: stage.id,
    tone: result === "pass" ? "success" : "warning",
    title: `${validatorGroup.label} validation ${result === "pass" ? "passed" : "failed"}`,
    summary: `${validatorGroup.label} marked ${stage.label} as ${
      result === "pass" ? "ready" : "failed"
    } after reviewing the latest proof package.`,
  });
  recordActivity(
    "validation",
    `${validatorGroup.label} marked ${plan.title} ${stage.label} as ${result}.`,
  );
  setMessage(
    `${validatorGroup.label} validation recorded for ${stage.label}.`,
    result === "pass" ? "success" : "warning",
  );
  renderAll();
}

function releaseStageFunds() {
  const plan = getCurrentPlan();
  const stage = getSelectedStage(plan);

  if (!plan || !stage) return;

  const eligibility = getReleaseEligibility(plan, stage);
  if (!eligibility.allowed) {
    setMessage(eligibility.reason, "warning");
    renderStatus();
    return;
  }

  state.protocol.treasuryWbc -= eligibility.amount;
  stage.releasedWbc = eligibility.amount;
  stage.releasedAt = Date.now();

  recordPlanLedger(plan, {
    kind: "release",
    stageId: stage.id,
    tone: "success",
    title: `${stage.label} released ${formatWbc(eligibility.amount)}`,
    summary:
      "Treasury released the next tranche after proof and all validator groups passed the current stage.",
  });
  recordActivity(
    "release",
    `${stage.label} for ${plan.title} released ${formatWbc(
      eligibility.amount,
    )} from treasury.`,
  );

  const nextStage = plan.stages.find((entry) => !entry.releasedAt);
  state.selectedStageId =
    nextStage?.id ?? plan.stages[plan.stages.length - 1].id;

  setMessage(
    `${stage.label} released ${formatWbc(eligibility.amount)} to execution.`,
    "success",
  );
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

refs.planSelect.addEventListener("change", (event) => {
  setPlanSelection(event.target.value);
  renderAll();
});

refs.proofPlan.addEventListener("change", (event) => {
  setPlanSelection(event.target.value);
  renderAll();
});

refs.proofStage.addEventListener("change", (event) => {
  const currentPlan = getCurrentPlan();
  if (!currentPlan) return;

  setPlanSelection(currentPlan.id, event.target.value);
  renderAll();
});

refs.focusLinked.addEventListener("click", focusLinkedNodes);
refs.primaryAction.addEventListener("click", handlePrimaryAction);
refs.secondaryAction.addEventListener("click", handleSecondaryAction);
refs.listingForm.addEventListener("submit", submitListing);
refs.proposalForm.addEventListener("submit", submitProposal);
refs.knowledgeForm.addEventListener("submit", submitKnowledge);
refs.proofForm.addEventListener("submit", submitProof);
refs.releaseStage.addEventListener("click", releaseStageFunds);
refs.recalculateSupply.addEventListener("click", recalculateSupply);
refs.resetDemo.addEventListener("click", resetSimulation);

refs.stageLane.addEventListener("click", (event) => {
  const button = event.target.closest("[data-stage-id]");
  if (!button) return;

  const plan = getCurrentPlan();
  if (!plan) return;

  setPlanSelection(plan.id, button.dataset.stageId);
  renderAll();
});

refs.validatorList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-validate-group]");
  if (!button) return;

  updateValidation(button.dataset.validateGroup, button.dataset.validateResult);
});

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

  const openPlanButton = event.target.closest("[data-open-plan]");
  if (openPlanButton) {
    const plan = getPlanByProposalId(openPlanButton.dataset.openPlan);
    if (plan) {
      setPlanSelection(plan.id);
      renderAll();
      jumpTo("#plans");
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
