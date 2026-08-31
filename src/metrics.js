(function () {
  "use strict";

  const squareFeetPerSquareMeter = 10.7639104167;

  function classifyFeatures(featureCollection) {
    const polygons = featureCollection.features.filter((feature) => feature.geometry && feature.geometry.type === "Polygon");
    const site = polygons.find((feature) => feature.properties && feature.properties.role === "site") || polygons[0] || null;
    const buildings = polygons.filter((feature) => feature !== site && (!feature.properties || feature.properties.role !== "site"));
    return { site, buildings };
  }

  function emptyMetrics() {
    return {
      siteAreaSqFt: 0,
      siteAreaAcres: 0,
      perimeterFeet: 0,
      buildableAreaSqFt: 0,
      footprintSqFt: 0,
      grossFloorAreaSqFt: 0,
      far: 0,
      lotCoveragePercent: 0,
      openSiteAreaSqFt: 0,
      farCapacitySqFt: 0,
      physicalCapacitySqFt: 0,
      unusedFarCapacitySqFt: 0,
      bindingConstraint: "FAR",
      violationCount: 0,
      buildingCount: 0,
      envelope: null
    };
  }

  function calculateCapacity(featureCollection, assumptions) {
    const { site, buildings } = classifyFeatures(featureCollection);
    if (!site) return emptyMetrics();

    const siteAreaSqFt = turf.area(site) * squareFeetPerSquareMeter;
    const perimeterFeet = turf.length(turf.polygonToLine(site), { units: "feet" });
    const buffered = turf.buffer(site, -Math.max(0, assumptions.setbackFeet), { units: "feet", steps: 12 });
    const envelope = buffered && ["Polygon", "MultiPolygon"].includes(buffered.geometry.type) ? buffered : null;
    const buildableAreaSqFt = envelope ? turf.area(envelope) * squareFeetPerSquareMeter : 0;
    const footprintSqFt = buildings.reduce((total, building) => total + turf.area(building) * squareFeetPerSquareMeter, 0);
    const grossFloorAreaSqFt = footprintSqFt * assumptions.stories;
    const far = siteAreaSqFt > 0 ? grossFloorAreaSqFt / siteAreaSqFt : 0;
    const lotCoveragePercent = siteAreaSqFt > 0 ? footprintSqFt / siteAreaSqFt * 100 : 0;
    const farCapacitySqFt = siteAreaSqFt * assumptions.maxFar;
    const coverageFootprintSqFt = siteAreaSqFt * assumptions.maxLotCoveragePercent / 100;
    const physicalCapacitySqFt = Math.min(buildableAreaSqFt, coverageFootprintSqFt) * assumptions.stories;
    const violationCount = envelope ? buildings.filter((building) => !turf.booleanWithin(building, envelope)).length : buildings.length;

    return {
      siteAreaSqFt,
      siteAreaAcres: siteAreaSqFt / 43560,
      perimeterFeet,
      buildableAreaSqFt,
      footprintSqFt,
      grossFloorAreaSqFt,
      far,
      lotCoveragePercent,
      openSiteAreaSqFt: Math.max(0, siteAreaSqFt - footprintSqFt),
      farCapacitySqFt,
      physicalCapacitySqFt,
      unusedFarCapacitySqFt: Math.max(0, farCapacitySqFt - grossFloorAreaSqFt),
      bindingConstraint: farCapacitySqFt <= physicalCapacitySqFt ? "FAR" : "Coverage and stories",
      violationCount,
      buildingCount: buildings.length,
      envelope
    };
  }

  window.SFS_METRICS = Object.freeze({ classifyFeatures, calculateCapacity });
}());
