import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

import styles from "./index.module.scss";
import {
  CallToAction,
  HeroImage,
  HomepageFeatures,
} from "../components/Landing";

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
            to="/docs/preface"
          >
            Get Started
          </Link>
        </div>
        <HeroImage
          style={{
            maxWidth: "852px",
          }}
        />
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <CallToAction />
      </main>
    </Layout>
  );
}
