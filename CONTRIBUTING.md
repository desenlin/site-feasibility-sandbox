# Contributing

Thank you for helping improve the Site Feasibility Sandbox.

## Before proposing a change

- Use a GitHub issue to describe a reproducible problem or focused improvement.
- Keep the project instructional, static, and free of user accounts, paid APIs, and server-side storage.
- Do not submit actual student records, private parcel information, copyrighted course materials, or credentials.

## Development principles

1. Preserve the separation among provider configuration, guided geometry, calculations, interaction logic, and styling.
2. Keep calculations transparent and define any new metric in the interface and documentation.
3. Maintain keyboard access and visible focus states.
4. Test at desktop and mobile widths.
5. Confirm that drawing, editing, reset, assumption controls, metric updates, and concept definitions still work.

## Map or library replacement

Basemap settings are isolated in `src/config.js`. When replacing a provider:

- confirm that its terms allow the intended educational traffic;
- avoid services that require a billable account or exposed browser key;
- update `ATTRIBUTION.md` and the map attribution;
- test the geometry canvas when tiles are unavailable.

Third-party versions are pinned in `index.html`. Review release notes and licenses before changing them.

## Pull requests

Use a short, descriptive title and explain:

- the instructional or maintenance problem;
- the files and behavior changed;
- the checks performed; and
- any new dependency, data source, or service risk.

By contributing, you agree that your contribution may be distributed under the repository's applicable code or content license.
