# Migrate from Vercel to AWS

:::note
This is **NOT** a necessary step. Please skip this page if you are just reading all the Starter Kit documents.

Vercel should satisfy our needs in most cases. Please only read when you are actually blocked by Vercel and are thinking about moving out.
:::note

## Common reasons to migrate away from Vercel

1. Datadog APM
    - Datadog APM is not possible in Vercel at the moment
1. Static IPs
    - Egress: Vercel does offer static IPs, for their **Enterprise plan** only, [read more here](https://vercel.com/guides/can-i-get-a-fixed-ip-address). Needing static egress IPs alone does not mean you should migrate to AWS.
    - Ingress: Vercel can **NOT** offer static IPs for ingress. It might just be that it is not supported even on an AWS API gateway. This is a valid reason for the migration.
1. Other AWS services

    Please try to use equivalent SaaS alternatives first, e.g.:
    - RDS: [CockroachDB](https://www.cockroachlabs.com/) or [Neon](https://neon.tech/)
    - Redis/Kafka/Message queue: [Upstash](https://upstash.com/)
    - SES: [Postman](https://postman.gov.sg/)

    Potential valid reasons:
    - ElasticSearch (please try [Elastic's SaaS](https://www.elastic.co/) first if billing is not an issue)
    - Need GPU equipped compute to train AI models
1. Heightened concern about security and maintenance

    The SaaS products are quite easy to use. However, since they are inevitably open to the public network, there is an increased risk of DDoSing and brute-force attacks on the data infrastructure themselves. It is valid to move to AWS to conceal everything within private subnets thus mitigating the aforementioned risks **if** your service contains highly sensitive data (e.g. medical records).
1. Cost

    Vercel and Serverless in general cost very little to start with. However, it can cost quite a lot more at scale. If your monthly running cost is in the **high 3 digits or more**, moving to AWS might help cut it down. Make sure to do your calculations first!

## Common reasons **NOT** to migrate (since AWS is NOT a silver bullet)

- AWS: Infrastructure as a Service (IaaS)
- Vercel/CockroachDB/Upstash: Platform as a Service (PaaS)

Migrating to AWS means that you are going one layer lower in abstraction, which means there will be a lot more details to manage, e.g.:

- VPC (think of routing tables, security group rules etc.)
- ECS + ELB (think of auto scaling strategies, health checks etc.)
- RDS (think of replicas, failovers, instance upgrades etc.)
- IAM (everything about access management can be a pain)

There are tools like [pulumi-components](https://github.com/opengovsg/pulumi-components) to help reduce the "AWS tax". However, it still requires **YOU** to understand everything that is happening inside to operate your infrastructure confidently.

## How to migrate to AWS

This will typically take more than an hour. Please get your AWS account ready, and:

**If you have used Pulumi and ECS before**: reference the following repositories/PRs:

- <https://github.com/opengovsg/bright-infra>
- <https://github.com/opengovsg/bright/pull/120>

**If there is any doubts with Pulumi or ECS**: give us a ping on [#tooling-team](https://opengovproducts.slack.com/archives/C04S1UY5YJU), especially [@Blake](https://opengovproducts.slack.com/team/U03K4FYCDAA). We are more than happy to pair with you and help sort out any issues regarding Vercel/AWS!
