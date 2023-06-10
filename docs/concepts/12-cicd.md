# CI/CD

The application uses GitHub Actions for CI/CD. The GitHub Actions workflow can be found in the `.github/workflows/*.yml` directory.

There are currently two workflows set up:

- `main.yml` - This workflow runs on every push. This workflow is responsible for running the tests and ensuring the code can be compiled.
- `chromatic.yml` - This (optional) workflow runs on every pull request and pushes to `develop`. This workflow is responsible for running the visual regression tests using Chromatic.

## Chromatic

The workflow requires the following secrets to be set up in the repository:

- `CHROMATIC_PROJECT_TOKEN`: The Chromatic project token. This can be found in the Chromatic project settings.

For more information on how to set up Chromatic, see our guide [here](../optional-features/03-chromatic.md).
