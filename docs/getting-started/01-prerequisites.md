import VercelSignup from "./images/vercel/setup/signup.png"
import VercelYourName from "./images/vercel/setup/your-name.png"
import VercelGit from "./images/vercel/setup/git.png"

import NeonVercelIntegration from "./images/neon/vercel-integration.png"
import NeonInstallIntegration from "./images/neon/install-integration.png"
import NeonInstallCreateDbStep from "./images/neon/install-create-db-step.png"

# Prerequisites

:::info
You MUST be a public officer with access to [Postman.gov.sg (Legacy)](https://legacy.postman.gov.sg) to deploy this application.

If you do not have access, you will need to modify the email sending functionality to use an alternative email service provider yourself (and skip the Postman API key steps below).
:::

Before we can deploy your application, you will need to obtain two sets of credentials:

- An API key from [Postman (Legacy)](https://legacy.postman.gov.sg), for sending emails, including emails for logging into your product
- A Vercel account, to deploy and host your product
- A Neon database cluster, to hold information for your product

## Postman API

[Postman (Legacy)](https://legacy.postman.gov.sg) is the Whole of Government's messaging service. It offers an API to send emails from your product, accessible through a key unique to you.

:::note
The API keys are valid for 6 months. You will need to regenerate the key and update your Vercel environment variables whenever (and ideally before) it expires.
:::

### Step 1: Navigate to settings page

Login into [Postman](https://legacy.postman.gov.sg) with your .gov.sg email and navigate to the Settings page. Click on "Generate API Key".

![Postman Settings](https://1981680851-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MAQH3DF49Lq0AJudrbF%2Fuploads%2FjJsBFXqPldqbpTv6JqPJ%2FScreenshot%202023-02-24%20at%203.13.56%20PM.png?alt=media&token=7dcd58ed-52ae-4aff-93ae-9ab8702ab8d0)

### Step 2: Provide a key label

Provide a descriptive label for your API key. This will help you to identify the key in the future.

![Postman New API Key](https://1981680851-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MAQH3DF49Lq0AJudrbF%2Fuploads%2Fl8qPjaF3eiNIrt0Zo8Op%2FScreenshot%202023-04-05%20at%2010.53.38%20AM.png?alt=media&token=ba47bc2a-ca93-4ec8-b66c-b6d9affebca4)

### Step 3: Save API key

Save the API key somewhere safe. You will need this when deploying your application in the next step.

![Postman Copy API Key](https://1981680851-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MAQH3DF49Lq0AJudrbF%2Fuploads%2FJ2ztqOOvyBfcaV0gdLfI%2FScreenshot%202023-04-05%20at%2010.54.31%20AM.png?alt=media&token=ce699a50-6ed6-4614-8d1e-cdd18cb6ba89)

## Vercel

We use [Vercel](https://vercel.com) to conveniently host starter-kit projects.
You will need to sign-up for an account with them to deploy your product there.

### Step 1: Sign up

Visit the Vercel [sign-up page](https://vercel.com/signup), and select the Hobby plan.
If you wish to pay and upgrade to Vercel Pro, you may do so later.

:::note
If you already have a hobby account with Vercel, you may use that instead. If you are setting up Starter Kit for hackathon (or similar) purposes, we recommend creating a new Pro account to avoid conflicts with your existing projects (to be able to deploy from our GitHub org).
:::

<img src={VercelSignup} />

Enter an appropriate name for your Vercel account, like your product name.

<img src={VercelYourName} />

### Step 2: Connect with GitHub

In the screen that follows, connect your GitHub account.

<img src={VercelGit} />

Proceed to the next steps to complete the setup process to deploy Starter Kit to Vercel.
