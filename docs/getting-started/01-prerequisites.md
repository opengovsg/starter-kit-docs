import DbCreateAccount from "./images/cockroach/cockroach-create-account.png"
import DbCreateCluster from "./images/cockroach/cockroach-create-cluster.png"
import DbCreateUser from "./images/cockroach/cockroach-create-sql-user.png"

# Prerequisites

Before we can deploy your application, you will need to obtain two sets of credentials:

- A CockroachDB database cluster, to hold information for your product
- An API key from [Postman](https://www.postman.gov.sg), for sending emails, including emails for logging into your product

## CockroachDB

We recommend using [CockroachDB](https://www.cockroachlabs.com/) to host the database for your product.

### Step 1: Creating an account

Go to this [link](https://www.cockroachlabs.com/lp/serverless), login and create your account. Set your Company Name to your project name.

<img src={DbCreateAccount} width={500} />

### Step 2: Creating a cluster

Create a free serverless cluster with AWS as the provider and Singapore as the region.

<img src={DbCreateCluster} />

### Step 3: Creating a user and save connection string

Create a SQL user. Set it to anything other than `root`. Save the connection string. You will need this later.

<img src={DbCreateUser} width={500} />

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
