import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import clsx from "clsx";

import styles from "./styles.module.scss";
import { CallToActionImage } from "../svgr/CallToActionImage";
import Link from "@docusaurus/Link";

export function CallToAction() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <div className={clsx(styles.cta)}>
      <div className={clsx("container", styles.container)}>
        <CallToActionImage />
        <h2>Try {siteConfig.title} now</h2>
        <Link
          className="button button--primary"
          to="/docs/getting-started/prerequisites"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
