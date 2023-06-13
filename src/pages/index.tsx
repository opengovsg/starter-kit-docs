import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";

import styles from "./index.module.scss";

import HeroImage from "@site/static/img/landing-hero.svg";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={clsx("hero hero--primary", styles.hero)}>
      <div className="container">
        <h1 className={clsx("hero__title", styles.hero__title)}>
          Building with <em>{siteConfig.title}</em>
        </h1>
        <p className={clsx("hero__subtitle", styles.hero__subtitle)}>
          {siteConfig.tagline}
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary"
            to="/docs/getting-started/prerequisites"
          >
            Get Started
          </Link>
        </div>
        <HeroImage />
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
