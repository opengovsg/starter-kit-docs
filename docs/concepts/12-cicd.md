# CI/CD

The application uses GitHub Actions for CI/CD. The GitHub Actions workflows can be found in the `.github/workflows/` directory.

There are currently three workflows set up:

- `ci.yml` - This workflow runs on every push to `main`, pull requests, and merge groups. It runs linting, formatting checks, type checking, and tests.
- `chromatic.yml` - This (optional) workflow runs on every pull request and pushes to `main`. It runs visual regression tests using Chromatic.
- `codeql.yml` - This workflow runs CodeQL security analysis on pushes to `main`, pull requests to `main`, and on a daily schedule.

## CI Workflow

The `ci.yml` workflow runs the following jobs in parallel:

| Job         | Description                                        |
| ----------- | -------------------------------------------------- |
| `lint`      | Runs ESLint and workspace linting (`pnpm lint:ws`) |
| `format`    | Checks code formatting with Prettier               |
| `typecheck` | Runs TypeScript type checking                      |
| `test`      | Runs Vitest tests with Testcontainers              |

### Test Job

The test job uses Testcontainers to spin up PostgreSQL and Redis containers automatically. No additional service configuration is needed.

Optionally, the test job supports [Datadog Test Visibility](https://docs.datadoghq.com/tests/) for test observability. To enable it, set the following secrets:

- `DD_SERVICE_NAME`: The Datadog service name
- `DD_API_KEY`: The Datadog API key

## Chromatic

The Chromatic workflow requires the following secret to be set up in the repository:

- `CHROMATIC_WEB_PROJECT_TOKEN`: The Chromatic project token. This can be found in the Chromatic project settings.

For more information on how to set up Chromatic, see our guide [here](../optional-features/01-chromatic.md).

## CodeQL

The CodeQL workflow runs automated security analysis using GitHub's CodeQL. It analyzes JavaScript/TypeScript code for security vulnerabilities and runs:

- On pushes to `main`
- On pull requests to `main`
- Daily at 10:00 UTC

No additional configuration is required for CodeQL.
