import DbCreateAccount from "./images/neon/neon-create-account.png"
import DbCreateProject from "./images/neon/neon-create-project.png"
import DbViewDefaultConnectionString from "./images/neon/neon-view-default-connection-string.png"
import DbCreateRole from "./images/neon/neon-create-role.png"
import DbCreateDatabase from "./images/neon/neon-create-database.png"

import VercelSignup from "./images/vercel/setup/signup.png"
import VercelYourName from "./images/vercel/setup/your-name.png"
import VercelGit from "./images/vercel/setup/git.png"

# Prerequisites

Before we can deploy your application, you will need to obtain two sets of credentials:

- A Neon database cluster, to hold information for your product
- An API key from [Postman](https://www.postman.gov.sg), for sending emails, including emails for logging into your product
- A Vercel account, to deploy and host your product

## Neon

We recommend using [Neon](https://www.neon.tech/) to host the database for your product.

### Step 1: Creating an account

Go to this [link](https://console.neon.tech/), login and create your account.

<img src={DbCreateAccount} width={500} />

### Step 2: Creating a project

Create a free project with Singapore as the region. You may leave the database name as the default value as we will be creating another database later.

<img src={DbCreateProject} width={500} />

A database connection string will be displayed to you, but you do not need to save this value.

<img src={DbViewDefaultConnectionString} width={500} />

### Step 3: Creating a role for your application

Click on Roles in the sidebar and create a SQL user for your application.

<img src={DbCreateRole} width={500} />

### Step 4: Creating a database

Click on Databases in the sidebar and create a new database with your application role as the owner.

<img src={DbCreateDatabase} width={500} />

<br /><br />

:::tip
You may delete the default role and database as they will no longer be used.
:::

## Postman API

[Postman](https://www.postman.gov.sg) is the Singapore Government's messaging service. It offers an API to send emails from your product, accessible through a key unique to you.

### Step 1: Navigate to settings page

Login into [Postman](https://postman.gov.sg) with your .gov.sg email and navigate to the Settings page. Click on "Generate API Key".

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

<img src={VercelSignup} />

Enter an appropriate name for your Vercel account, like your product name.

<img src={VercelYourName} />

### Step 2: Connect with GitHub

In the screen that follows, connect your GitHub account.

<img src={VercelGit} />
