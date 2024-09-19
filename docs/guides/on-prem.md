# Deploying to a Physical Server or Virtual Private Server

In some situations, you may decide against - or lack access to - cloud services
like AWS and Vercel. In such cases, you will have to deploy your application
to a physical server, or a virtual private server (VPS).

## Prerequisites

- A physical server, or a VPS
- A database server
- [Environment variables](../concepts/08-env-variables.md) needed to run the application,
  as well as to connect [Prisma](../concepts/03-prisma.md) to the database and email.

## Deploying

### Preparation of server
- Log into the server that will host the application.
- Ensure that Node.js and npm are installed on the server.
  - You may wish to use [nvm](https://github.com/nvm-sh/nvm) or [volta](https://volta.sh)
    to do so.

### Preparation of codebase
- Find a way to copy the codebase onto the server.

#### Using git
You may wish to use `git clone` as a convenient way to copy the codebase onto the server.

The full command to do so would vary, depending on where your Git repository is and how
you connect to it.

##### Example
As an example, if you were to copy the original Starter Kit codebase, you would type:
```
git clone git@github.com:opengovsg/starter-kit
```

- Install the codebase's package dependencies by running:
```
npm ci
```

- Create an `.env` file in the same directory as `package.json`, and populate it with
  environment variables as listed in [Prerequisites](#prerequisites)

- Build the codebase by running:
```
npm run build
```

This will also perform any database migrations

- Run the built codebase by running:
```
npm start
```

This will start the application and make it accessible on port 3000 by default,
or the port number defined by the `PORT` environment variable.
