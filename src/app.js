(function () {
  "use strict";

  const config = window.SFS_CONFIG;
  const geometry = window.SFS_GEOMETRY;
  const metricsApi = window.SFS_METRICS;
  const state = {
    features: structuredClone(geometry.guidedCase),
    assumptions: { ...config.initialAssumptions },
    pendingRole: null,
    mode: "none"
  };

  const byId = (id) => document.getElementById(id);
  const formatNumber = (value, digits = 0) => new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  }).format(Number.isFinite(value) ? value : 0);

  function showLibraryError() {
    byId("mapStatus").textContent = "Geometry libraries unavailable";
    const message = document.createElement("div");
    message.className = "map-error";
    message.textContent = "The map libraries could not load. Check your connection and refresh the page.";
    document.querySelector(".map-stage").appendChild(message);
  }

  if (!window.L || !window.turf || !L.PM) {
    showLibraryError();
    return;
  }

  const map = L.map("map", { zoomControl: false }).setView([geometry.center[1], geometry.center[0]], 17);
  L.control.zoom({ position: "bottomright" }).addTo(map);

  const featureGroup = L.featureGroup().addTo(map);
  const envelopeGroup = L.featureGroup().addTo(map);
  map.pm.setGlobalOptions({ layerGroup: featureGroup, snappable: true });

  const tileLayer = L.tileLayer(config.mapProvider.tileUrl, {
    attribution: config.mapProvider.attribution,
    maxZoom: config.mapProvider.maxZoom
  });
  tileLayer.once("load", () => { byId("mapStatus").textContent = `${config.mapProvider.label} connected`; });
  tileLayer.once("tileerror", () => { byId("mapStatus").textContent = "Geometry canvas active"; });
  tileLayer.addTo(map);
  byId("mapStatus").textContent = "Geometry canvas active";

  function featureStyle(feature) {
    return feature && feature.properties && feature.properties.role === "building"
      ? { color: "#a94709", weight: 2, fillColor: "#f58220", fillOpacity: 0.62 }
      : { color: "#00244e", weight: 3, fillColor: "#00244e", fillOpacity: 0.12 };
  }

  function renderFeatures() {
    featureGroup.clearLayers();
    L.geoJSON(state.features, {
      style: featureStyle,
      onEachFeature(feature, layer) {
        layer.feature = feature;
        featureGroup.addLayer(layer);
      }
    });
  }

  function renderEnvelope(envelope) {
    envelopeGroup.clearLayers();
    if (!envelope) return;
    L.geoJSON(envelope, {
      style: { color: "#1d8f97", weight: 2, dashArray: "6 6", fillColor: "#1d8f97", fillOpacity: 0.13 },
      onEachFeature(_feature, layer) {
        layer.options.pmIgnore = true;
        envelopeGroup.addLayer(layer);
      }
    });
  }

  function updateResults() {
    const result = metricsApi.calculateCapacity(state.features, state.assumptions);
    renderEnvelope(result.envelope);
    byId("farMetric").textContent = formatNumber(result.far, 2);
    byId("farMaximum").textContent = state.assumptions.maxFar.toFixed(1);
    byId("siteAreaMetric").textContent = formatNumber(result.siteAreaSqFt);
    byId("siteAreaNote").textContent = `sq ft · ${formatNumber(result.siteAreaAcres, 2)} acres`;
    byId("buildableMetric").textContent = formatNumber(result.buildableAreaSqFt);
    byId("footprintMetric").textContent = formatNumber(result.footprintSqFt);
    byId("footprintNote").textContent = `sq ft · ${result.buildingCount} building${result.buildingCount === 1 ? "" : "s"}`;
    byId("gfaMetric").textContent = formatNumber(result.grossFloorAreaSqFt);
    byId("gfaNote").textContent = `sq ft at ${state.assumptions.stories} stories`;
    byId("coverageMetric").textContent = `${formatNumber(result.lotCoveragePercent, 1)}%`;
    byId("coverageNote").textContent = `Maximum ${state.assumptions.maxLotCoveragePercent}%`;
    byId("openAreaMetric").textContent = formatNumber(result.openSiteAreaSqFt);
    byId("farCapacityMetric").textContent = formatNumber(result.farCapacitySqFt);
    byId("unusedMetric").textContent = formatNumber(result.unusedFarCapacitySqFt);

    const warning = result.violationCount > 0;
    byId("constraintBox").classList.toggle("warning", warning);
    byId("constraintHeading").textContent = warning ? "Geometry warning" : "Likely binding constraint";
    byId("constraintValue").textContent = warning
      ? `${result.violationCount} footprint violation${result.violationCount === 1 ? "" : "s"}`
      : result.bindingConstraint;
    byId("constraintCopy").textContent = warning
      ? "Move or resize each footprint so it stays within the buildable envelope."
      : `FAR capacity is ${formatNumber(result.farCapacitySqFt)} sq ft; coverage-and-story capacity is ${formatNumber(result.physicalCapacitySqFt)} sq ft.`;
    byId("constraintHelp").dataset.definition = warning
      ? "One or more building footprints extend outside the buildable envelope created by the selected setback."
      : "The assumption that currently produces the lower development capacity when comparing the FAR limit with coverage-and-story capacity.";
    byId("constraintHelp").setAttribute("aria-label", warning ? "Definition of geometry warning" : "Definition of likely binding constraint");
  }

  function syncFeaturesFromMap() {
    state.features = featureGroup.toGeoJSON();
    updateResults();
  }

  function disableAllModes() {
    map.pm.disableDraw();
    map.pm.disableGlobalEditMode();
    map.pm.disableGlobalDragMode();
    map.pm.disableGlobalRotateMode();
    map.pm.disableGlobalRemovalMode();
  }

  const modeButtons = {
    change: byId("editVertices"),
    drag: byId("moveShapes"),
    rotate: byId("rotateShapes"),
    delete: byId("deleteShapes"),
    none: byId("finishEditing")
  };

  function setActiveMode(mode) {
    state.mode = mode;
    Object.entries(modeButtons).forEach(([name, button]) => button.classList.toggle("active", name === mode));
  }

  function activateMode(nextMode) {
    disableAllModes();
    if (nextMode === state.mode || nextMode === "none") {
      setActiveMode("none");
      byId("toolInstruction").textContent = "Editing finished. Choose another tool when ready.";
      return;
    }
    if (nextMode === "change") map.pm.enableGlobalEditMode();
    if (nextMode === "drag") map.pm.enableGlobalDragMode();
    if (nextMode === "rotate") map.pm.enableGlobalRotateMode();
    if (nextMode === "delete") map.pm.enableGlobalRemovalMode();
    setActiveMode(nextMode);
    const guidance = {
      change: "Drag a vertex to reshape a site or building.",
      drag: "Drag a site or building to move it.",
      rotate: "Select and rotate a building or site.",
      delete: "Click a shape to delete it."
    };
    byId("toolInstruction").textContent = guidance[nextMode];
  }

  function startDrawing(role) {
    disableAllModes();
    setActiveMode("none");
    state.pendingRole = role;
    map.pm.enableDraw(role === "site" ? "Polygon" : "Rectangle", {
      snappable: true,
      pathOptions: role === "site"
        ? { color: "#00244e", fillColor: "#00244e", fillOpacity: 0.12 }
        : { color: "#a94709", fillColor: "#f58220", fillOpacity: 0.62 }
    });
    byId("toolInstruction").textContent = role === "site"
      ? "Click the parcel corners; click the first point to finish the boundary."
      : "Click and drag on the map to place a rectangular footprint.";
  }

  map.on("pm:create", (event) => {
    const role = state.pendingRole || "building";
    if (!featureGroup.hasLayer(event.layer)) featureGroup.addLayer(event.layer);
    const created = event.layer.toGeoJSON();
    event.layer.feature = {
      ...created,
      properties: {
        ...(created.properties || {}),
        role,
        name: role === "site" ? "Custom Learning Site" : `Building ${featureGroup.getLayers().length}`
      }
    };
    if (role === "site") {
      featureGroup.eachLayer((layer) => {
        if (layer !== event.layer && layer.feature && layer.feature.properties && layer.feature.properties.role === "site") {
          featureGroup.removeLayer(layer);
        }
      });
    }
    state.pendingRole = null;
    byId("toolInstruction").textContent = role === "site" ? "New site boundary added." : "Building footprint added.";
    syncFeaturesFromMap();
  });

  ["pm:update", "pm:dragend", "pm:rotateend", "pm:remove"].forEach((eventName) => {
    map.on(eventName, syncFeaturesFromMap);
  });

  byId("addBuilding").addEventListener("click", () => startDrawing("building"));
  byId("drawSite").addEventListener("click", () => startDrawing("site"));
  byId("editVertices").addEventListener("click", () => activateMode("change"));
  byId("moveShapes").addEventListener("click", () => activateMode("drag"));
  byId("rotateShapes").addEventListener("click", () => activateMode("rotate"));
  byId("deleteShapes").addEventListener("click", () => activateMode("delete"));
  byId("finishEditing").addEventListener("click", () => activateMode("none"));

  byId("setback").addEventListener("input", (event) => {
    state.assumptions.setbackFeet = Number(event.target.value);
    byId("setbackValue").textContent = `${state.assumptions.setbackFeet} ft`;
    updateResults();
  });
  byId("maxFar").addEventListener("input", (event) => {
    state.assumptions.maxFar = Number(event.target.value);
    byId("maxFarValue").textContent = state.assumptions.maxFar.toFixed(1);
    updateResults();
  });
  byId("coverage").addEventListener("change", (event) => {
    state.assumptions.maxLotCoveragePercent = Math.min(100, Math.max(1, Number(event.target.value) || 1));
    event.target.value = state.assumptions.maxLotCoveragePercent;
    updateResults();
  });
  byId("stories").addEventListener("change", (event) => {
    state.assumptions.stories = Math.min(30, Math.max(1, Number(event.target.value) || 1));
    event.target.value = state.assumptions.stories;
    updateResults();
  });

  byId("resetCase").addEventListener("click", () => {
    disableAllModes();
    state.features = structuredClone(geometry.guidedCase);
    state.assumptions = { ...config.initialAssumptions };
    state.pendingRole = null;
    byId("setback").value = state.assumptions.setbackFeet;
    byId("setbackValue").textContent = `${state.assumptions.setbackFeet} ft`;
    byId("maxFar").value = state.assumptions.maxFar;
    byId("maxFarValue").textContent = state.assumptions.maxFar.toFixed(1);
    byId("coverage").value = state.assumptions.maxLotCoveragePercent;
    byId("stories").value = state.assumptions.stories;
    renderFeatures();
    updateResults();
    map.setView([geometry.center[1], geometry.center[0]], 17, { animate: true });
    setActiveMode("none");
    byId("toolInstruction").textContent = "Guided case restored.";
  });

  function installTooltips() {
    const tooltip = byId("conceptTooltip");
    let activeTrigger = null;

    function place(trigger) {
      const rect = trigger.getBoundingClientRect();
      tooltip.hidden = false;
      tooltip.textContent = trigger.dataset.definition;
      const width = tooltip.offsetWidth;
      const height = tooltip.offsetHeight;
      const left = Math.max(12, Math.min(window.innerWidth - width - 12, rect.left + rect.width / 2 - width / 2));
      const above = rect.top - height - 9;
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${above >= 8 ? above : rect.bottom + 9}px`;
      activeTrigger = trigger;
    }

    function hide(trigger) {
      if (activeTrigger && trigger && activeTrigger !== trigger) return;
      tooltip.hidden = true;
      activeTrigger = null;
    }

    document.querySelectorAll(".help-trigger").forEach((trigger) => {
      trigger.addEventListener("mouseenter", () => place(trigger));
      trigger.addEventListener("mouseleave", () => hide(trigger));
      trigger.addEventListener("focus", () => place(trigger));
      trigger.addEventListener("blur", () => hide(trigger));
      trigger.addEventListener("click", (event) => {
        event.stopPropagation();
        if (activeTrigger === trigger && !tooltip.hidden) hide(trigger); else place(trigger);
      });
    });
    document.addEventListener("click", () => hide());
    window.addEventListener("resize", () => { if (activeTrigger) place(activeTrigger); });
  }

  renderFeatures();
  updateResults();
  installTooltips();
}());
