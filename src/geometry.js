(function () {
  "use strict";

  const center = [-117.8851, 33.88155];
  const feetPerDegreeLatitude = 364000;
  const feetPerDegreeLongitude = feetPerDegreeLatitude * Math.cos(center[1] * Math.PI / 180);

  function point(xFeet, yFeet) {
    return [
      center[0] + xFeet / feetPerDegreeLongitude,
      center[1] + yFeet / feetPerDegreeLatitude
    ];
  }

  function rectangle(minX, minY, maxX, maxY) {
    return [[
      point(minX, minY),
      point(maxX, minY),
      point(maxX, maxY),
      point(minX, maxY),
      point(minX, minY)
    ]];
  }

  window.SFS_GEOMETRY = Object.freeze({
    center,
    guidedCase: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          id: "guided-site",
          properties: { role: "site", name: "Fullerton Learning Site" },
          geometry: { type: "Polygon", coordinates: rectangle(-100, -150, 100, 150) }
        },
        {
          type: "Feature",
          id: "guided-building-1",
          properties: { role: "building", name: "Building 1" },
          geometry: { type: "Polygon", coordinates: rectangle(-50, -50, 50, 50) }
        }
      ]
    }
  });
}());
