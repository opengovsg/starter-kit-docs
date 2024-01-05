# Preface

The infrastructure for Starter Kit in this document (Vercel + NeonDB) is optimised for quick prototyping and development. It is **not recommended** for serious production use.

For serious production use cases, consider directly deploying the Starter Kit application to AWS (and skipping the infrastructure part of these documentation). In the near future, [`create-ogp-app`](https://github.com/opengovsg/create-ogp-app) should support this workflow.

Nonetheless, on low-risk production use cases, the Starter Kit infrastructure can still be used as a production deployment. We have a document on when one might want to migrate to AWS [here](./guides/migrate-vercel-to-aws.md).

## Why?
:::info
TL;DR: Vercel does not have adequate logging and monitoring capabilities for our production use cases. NeonDB is too new and not battle-tested enough for production use cases.
:::

As OGP moves deeper into each vertical, infra security/proper logging/monitoring increasingly becomes less and less negotiable. With that in mind, Vercel’s lack of APM/logging, and public Internet routed DB connections etc. makes it less suitable for a full production app today. We’ve debated on what should be the fallback option, including DigitalOcean/render.com etc., but as of today, the only tested and trustable solution would be AWS. 

Once we free Vercel from being the defacto service for running our production apps, the same requirement on the backing data store was also lifted. CockroachDB was chosen previously since at least it had better monitoring and is a less “beta” software compared to neon.tech. However, since the DB is only meant for prototyping, we’d prioritise dev friendliness (e.g. data branching) over production DB requirements (e.g. monitoring), and having a better integration with Vercel (via Neon's Vercel integration) became the natural choice to be running behind a Vercel deployment too.