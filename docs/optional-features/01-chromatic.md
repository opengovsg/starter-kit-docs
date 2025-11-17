# Chromatic CI/CD workflow

This workflow runs on every pull request and pushes to main branches, but only if the `CHROMATIC_PROJECT_TOKEN` secret is set up in the repository. This workflow is responsible for running the visual regression tests using Chromatic, a software as a service that integrates with Storybook to detect visual changes in the UI components and pages.

:::note
Find out more about what Chromatic is and does [here](https://www.chromatic.com/).
:::

## SaaS setup

Chromatic has a robust free plan that allows for 5000 free snapshots per month, which should be sufficient for the prototyping phase.

To minimise unnecessary snapshots, the workflow only runs on any pull requests, or pushes to the `main` branch. This means that the workflow will not run on pushes to feature branches, and will only run on pushes to the main branch if the pull request has already been merged.

[Turbosnap](https://www.chromatic.com/docs/turbosnap) is also enabled, which means that Chromatic will only take snapshots of the pages/components that have changed, instead of all of them.

The settings for the workflow can be found in `.github/workflows/chromatic.yml`.

### Prerequisites

The project you want to connect to Chromatic should already be on GitHub.

### Set up

To set up Chromatic, follow the steps below:

1. Sign up/sign in to Chromatic [here](https://www.chromatic.com/start) with your GitHub account and add a project by clicking on "Choose from GitHub".
   ![Add project](./images/chromatic/add-project.png)
2. Choose the repository you want to connect to Chromatic.
   ![Choose repository](./images/chromatic/choose-project.png)
3. You do not need to follow the steps outlined on the next page. The only important step is the project token, which is displayed in the page, or can also be found in the project settings:
   ![Store project tokens](./images/chromatic/store-project-token.png)
   ![Project settings](./images/chromatic/project-settings.png)
4. Go to the GitHub repository secrets page, by going to Settings > Security/Secrets and variables > Actions:
   ![Go to GitHub](./images/chromatic/github-main.png)
   ![Go to GitHub repository settings](./images/chromatic/github-settings.png)
   ![Go to GitHub repository secrets](./images/chromatic/github-add-secret.png)
5. Add and save the `CHROMATIC_PROJECT_TOKEN` secret with the value of the project token obtained in step 3.
   ![Add and save secret](./images/chromatic/github-add-and-save-secret.png)

With this done, Chromatic should be set up and ready to use. The GitHub action should run on every pull request, and pushes to the `main` branches.
