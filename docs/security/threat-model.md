# HYROX50 Static Site Threat Model

## Scope

HYROX50 is a public, read-only GitHub Pages website containing a fixed training
plan. It has no accounts, forms, database, analytics, AI integration, or
server-side application code.

## Assets

- Integrity and availability of the published training plan
- Integrity of the source repository and deployment workflow
- User trust that the displayed schedule has not been altered

## Trust Boundaries

- Source changes entering the repository
- Third-party npm packages used during build and testing
- GitHub Actions building and publishing the static files
- Browser execution of the published JavaScript bundle

## Security Invariants

- The repository and web bundle contain no credentials or private information.
- The site accepts and stores no user input.
- The deployment workflow uses least-privilege GitHub permissions.
- Only reviewed source from the main branch is published.
- Training content is schema-validated and tested before deployment.

## Primary Risks And Mitigations

- **Unauthorized plan changes:** protect the GitHub account and main branch,
  review changes, and require successful automated checks before publishing.
- **Compromised dependencies or Actions:** keep the lockfile committed, use
  `npm ci`, audit dependencies, scope permissions per job, and pin GitHub
  Actions to reviewed immutable commit SHAs before release.
- **Accidental credential publication:** run a secret scan before release and
  never add secrets because this static site has no legitimate need for them.
- **Misleading training guidance:** present workouts as a general plan, include
  scaling and RPE guidance, and stop training when pain or illness makes it
  unsafe.
- **Availability failure:** GitHub Pages hosts only generated static files, so
  there is no application server or database to attack or maintain.

## Review Triggers

Update this threat model before adding accounts, persistence, user-entered
notes, analytics, third-party integrations, AI features, or any backend.
