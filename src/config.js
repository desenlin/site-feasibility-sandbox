(function () {
  "use strict";

  // Replace this object to change basemap providers without touching planning logic.
  window.SFS_CONFIG = Object.freeze({
    mapProvider: {
      id: "openstreetmap",
      label: "OpenStreetMap",
      tileUrl: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19
    },
    initialAssumptions: {
      setbackFeet: 20,
      maxFar: 2,
      maxLotCoveragePercent: 60,
      stories: 3
    }
  });
}());
