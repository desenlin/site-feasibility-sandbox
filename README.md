<h1 align="center">Site Feasibility Sandbox</h1>

<p align="center"><strong>An instructional tool for geometry literacy and development-capacity analysis</strong></p>
<p align="center"><strong>Created by <a href="https://desenlin.com/">Desen Lin</a>, California State University, Fullerton</strong></p>

<p align="center">
  <a href="https://desenlin.com/site-feasibility-sandbox/"><strong>Launch the sandbox</strong></a>
</p>

## Purpose

The Site Feasibility Sandbox helps real estate students connect a site's geometry with basic development-capacity measures. Students can begin with the mapped Pollak Library footprint or one of three prepared campus surface-lot studies, draw or edit site and building shapes, change development assumptions, and see the resulting metrics update immediately.

The tool emphasizes conceptual learning rather than regulatory or architectural precision. It does not attempt to model solar access, local zoning overlays, parking standards, entitlement risk, construction feasibility, or investment returns.

## Learning concepts

- Site area and buildable area after a uniform setback
- Building footprint, lot coverage, and open site area
- Gross floor area and floor area ratio (FAR)
- FAR capacity and unused capacity
- The potentially binding relationship among FAR, lot coverage, setbacks, and stories
- Geometry warnings when a footprint falls outside the simplified buildable envelope
- Comparison of differently shaped prepared study sites

Each key concept includes a short definition that appears by hovering over or focusing on its question-mark control.

## Using the sandbox

1. Open the [published tool](https://desenlin.com/site-feasibility-sandbox/).
2. Start with the Pollak Library guided case, load a prepared surface-lot study, or draw a replacement site.
3. Add, reshape, move, rotate, or delete building footprints.
4. Change the setback, maximum FAR, maximum lot coverage, and story assumptions.
5. Interpret the live capacity results and the likely binding constraint.
6. Review the [About and methods](https://desenlin.com/site-feasibility-sandbox/about.html) page before interpreting a geographically referenced example.

No account is required. Calculations run in the browser, and the application does not collect or transmit student inputs.

## Technical design

The project is intentionally framework-free: plain HTML, CSS, and JavaScript are served as static files through GitHub Pages. There is no application server, database, API key, or usage-billed cloud resource.

The code is separated by responsibility:

| File | Responsibility |
|---|---|
| `index.html` / `about.html` | Interactive workspace and project methods |
| `src/config.js` | Basemap provider settings |
| `src/geometry.js` | Guided and prepared-case geometry, labels, and assumptions |
| `src/metrics.js` | Capacity calculations |
| `src/app.js` | Map editing, controls, tooltips, and result rendering |
| `assets/styles.css` | Layout and visual design |

Third-party browser libraries are pinned to explicit versions. See [Architecture and maintenance](docs/ARCHITECTURE.md) and [Third-party attribution](ATTRIBUTION.md).

## Hosting and cost controls

GitHub Pages serves only static files. The repository contains no paid API credentials, serverless functions, databases, or metered application services. Unexpected traffic therefore cannot create a usage bill for the project owner. GitHub or the external tile provider may throttle abusive traffic under their own service policies.

## Educational limitations

Measurements are preliminary and not survey-grade. Mapped outlines provide geographic context; they do not establish a legal parcel, ownership, development availability, or institutional plans. Prepared building concepts and development assumptions are hypothetical unless explicitly identified as mapped existing.

Results are not a zoning or entitlement determination, architectural or engineering plan, appraisal, investment recommendation, or other professional or consulting advice. A real feasibility study requires verified parcel data, applicable regulations, easements, infrastructure, parking, access, environmental conditions, market evidence, and professional review.

## Citation

GitHub's **Cite this repository** function is enabled through [`CITATION.cff`](CITATION.cff). A suggested citation is:

> Lin, Desen. (2026). *Site Feasibility Sandbox* (Version 1.1.0) [Computer software]. https://github.com/desenlin/site-feasibility-sandbox

## Reuse and licensing

- Original source code is licensed under the [MIT License](LICENSE-CODE.md).
- Original educational text, examples, tables, definitions, and visualizations are licensed under [Creative Commons Attribution 4.0 International](LICENSE-CONTENT.md), unless otherwise noted.
- Suggested attribution: **Site Feasibility Sandbox by Desen Lin, California State University, Fullerton**, with a link to this repository.

The licenses apply only to material for which Desen Lin holds the necessary rights. CSUF and CSU names, logos, and trademarks, along with third-party libraries, map data, fonts, icons, and other externally owned materials, are excluded and remain subject to their respective terms. Attribution does not imply institutional endorsement.

## Contributing and maintenance

Bug reports and focused improvements are welcome. Review [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), and the [changelog](CHANGELOG.md) before contributing.

---

<p align="center"><strong>Created by <a href="https://desenlin.com/">Desen Lin</a></strong> for real estate instruction at California State University, Fullerton.</p>
