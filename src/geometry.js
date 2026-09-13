(function () {
  "use strict";

  function polygonFeature(id, role, name, coordinates, status) {
    return {
      type: "Feature",
      id,
      properties: { role, name, status },
      geometry: { type: "Polygon", coordinates: [coordinates] }
    };
  }

  function rectangle(minLon, minLat, maxLon, maxLat) {
    return [
      [minLon, minLat],
      [maxLon, minLat],
      [maxLon, maxLat],
      [minLon, maxLat],
      [minLon, minLat]
    ];
  }

  function caseDefinition(id, title, description, center, zoom, assumptions, features, sourceNote) {
    return {
      id,
      title,
      description,
      center,
      zoom,
      assumptions,
      sourceNote,
      featureCollection: { type: "FeatureCollection", features }
    };
  }

  const pollakOutline = [
    [-117.8856848, 33.8817533],
    [-117.8856528, 33.8817956],
    [-117.8856448, 33.8818512],
    [-117.8856578, 33.8819047],
    [-117.8856928, 33.8819403],
    [-117.8856969, 33.8819905],
    [-117.8856939, 33.8821042],
    [-117.8856278, 33.8821274],
    [-117.8855278, 33.8821468],
    [-117.8854428, 33.8821452],
    [-117.8853591, 33.8821272],
    [-117.8852642, 33.8820968],
    [-117.8851857, 33.8820936],
    [-117.8851158, 33.8821073],
    [-117.8851128, 33.8817666],
    [-117.8851508, 33.8817488],
    [-117.8851588, 33.8817154],
    [-117.8851428, 33.8816820],
    [-117.8851048, 33.8816664],
    [-117.8851068, 33.8815801],
    [-117.8851018, 33.8813283],
    [-117.8850548, 33.8813271],
    [-117.8850488, 33.8809015],
    [-117.8857058, 33.8808946],
    [-117.8857128, 33.8813196],
    [-117.8856758, 33.8813193],
    [-117.8856848, 33.8817533]
  ];

  const lotCEastOutline = [
    [-117.8875610, 33.8787884],
    [-117.8875263, 33.8787396],
    [-117.8875241, 33.8785807],
    [-117.8876099, 33.8785783],
    [-117.8876040, 33.8784416],
    [-117.8877086, 33.8783820],
    [-117.8877254, 33.8783441],
    [-117.8867165, 33.8783568],
    [-117.8867219, 33.8784757],
    [-117.8867631, 33.8784939],
    [-117.8867646, 33.8785452],
    [-117.8867599, 33.8785568],
    [-117.8867133, 33.8785601],
    [-117.8867192, 33.8786359],
    [-117.8868558, 33.8787993],
    [-117.8875610, 33.8787884]
  ];

  const lotDOutline = [
    [-117.8881123, 33.8845303],
    [-117.8880281, 33.8845332],
    [-117.8880286, 33.8845759],
    [-117.8876170, 33.8845807],
    [-117.8876157, 33.8845388],
    [-117.8875536, 33.8845384],
    [-117.8875368, 33.8836942],
    [-117.8875937, 33.8836932],
    [-117.8875950, 33.8836448],
    [-117.8881058, 33.8836404],
    [-117.8881123, 33.8845303]
  ];

  const lotGOutline = [
    [-117.8874489, 33.8884828],
    [-117.8874030, 33.8884993],
    [-117.8873956, 33.8885106],
    [-117.8874082, 33.8885461],
    [-117.8871900, 33.8886163],
    [-117.8868612, 33.8887100],
    [-117.8864940, 33.8887782],
    [-117.8862881, 33.8887994],
    [-117.8860789, 33.8888146],
    [-117.8858858, 33.8888189],
    [-117.8858835, 33.8887776],
    [-117.8858132, 33.8887772],
    [-117.8858057, 33.8884476],
    [-117.8858780, 33.8884433],
    [-117.8858711, 33.8879361],
    [-117.8860861, 33.8879376],
    [-117.8860863, 33.8878089],
    [-117.8871165, 33.8877959],
    [-117.8871171, 33.8878703],
    [-117.8871926, 33.8878721],
    [-117.8871930, 33.8880308],
    [-117.8871162, 33.8880305],
    [-117.8872048, 33.8881930],
    [-117.8872758, 33.8881670],
    [-117.8874489, 33.8884828]
  ];

  const cases = {
    pollak: caseDefinition(
      "pollak",
      "Pollak Library study area",
      "The mapped Pollak Library footprint sits inside an instructional study boundary. Edit either shape and test how assumptions affect capacity.",
      [-117.88538, 33.88155],
      18,
      { setbackFeet: 20, maxFar: 2, maxLotCoveragePercent: 60, stories: 3 },
      [
        polygonFeature(
          "pollak-study-site",
          "site",
          "Pollak Library instructional study boundary",
          rectangle(-117.88590, 33.88075, -117.88486, 33.88229),
          "instructional-boundary"
        ),
        polygonFeature("pollak-library", "building", "Pollak Library mapped footprint", pollakOutline, "mapped-existing")
      ],
      "The building outline follows OpenStreetMap geometry. The surrounding study boundary is instructional, not a legal parcel."
    ),
    lot_c_east: caseDefinition(
      "lot_c_east",
      "South campus surface-lot study",
      "A compact infill exercise using the mapped boundary of the surface lot identified in OpenStreetMap as Lot C East.",
      [-117.88720, 33.87856],
      19,
      { setbackFeet: 10, maxFar: 1.5, maxLotCoveragePercent: 60, stories: 4 },
      [
        polygonFeature("lot-c-east-site", "site", "Mapped surface-lot study boundary", lotCEastOutline, "mapped-example"),
        polygonFeature(
          "lot-c-east-concept",
          "building",
          "Hypothetical infill building",
          rectangle(-117.88738, 33.878405, -117.88690, 33.878515),
          "hypothetical"
        )
      ],
      "The site outline is adapted from OpenStreetMap. The building and development assumptions are hypothetical."
    ),
    lot_d: caseDefinition(
      "lot_d",
      "West campus surface-lot study",
      "A longer-site redevelopment exercise using the mapped surface-lot boundary west of the campus core.",
      [-117.88783, 33.88411],
      18,
      { setbackFeet: 20, maxFar: 3, maxLotCoveragePercent: 55, stories: 5 },
      [
        polygonFeature("lot-d-site", "site", "Mapped surface-lot study boundary", lotDOutline, "mapped-example"),
        polygonFeature(
          "lot-d-concept",
          "building",
          "Hypothetical linear building",
          rectangle(-117.88798, 33.88373, -117.88769, 33.88445),
          "hypothetical"
        )
      ],
      "The site outline is adapted from OpenStreetMap. The building and development assumptions are hypothetical."
    ),
    lot_g: caseDefinition(
      "lot_g",
      "North campus surface-lot study",
      "A multi-building exercise using the irregular mapped boundary of a surface lot near the north edge of campus.",
      [-117.88661, 33.88831],
      18,
      { setbackFeet: 20, maxFar: 1, maxLotCoveragePercent: 45, stories: 3 },
      [
        polygonFeature("lot-g-site", "site", "Mapped surface-lot study boundary", lotGOutline, "mapped-example"),
        polygonFeature(
          "lot-g-concept-west",
          "building",
          "Hypothetical west building",
          rectangle(-117.88702, 33.88810, -117.88652, 33.88842),
          "hypothetical"
        ),
        polygonFeature(
          "lot-g-concept-east",
          "building",
          "Hypothetical east building",
          rectangle(-117.88634, 33.88810, -117.88598, 33.88842),
          "hypothetical"
        )
      ],
      "The site outline is adapted from OpenStreetMap. The buildings and development assumptions are hypothetical."
    )
  };

  const guidedCaseId = "pollak";
  const guidedCase = cases[guidedCaseId];

  window.SFS_GEOMETRY = Object.freeze({
    center: guidedCase.center,
    guidedCaseId,
    guidedCase: guidedCase.featureCollection,
    cases: Object.freeze(cases)
  });
}());
