import React from "react";
import clsx from "clsx";
import styles from "./styles.module.scss";
import Link from "@docusaurus/Link";

import { BiRightArrowAlt } from "react-icons/bi";
import { LaunchImage, WhatIsImage } from "../svgr";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
  link?: {
    to: string;
    label: string;
  };
};

const FeatureList: FeatureItem[] = [
  {
    title: "3 steps to launch",
    Svg: LaunchImage,
    description: (
      <>All it takes is 3 easy steps to launch a StarterApp with our kit.</>
    ),
    link: {
      to: "/docs/getting-started/deploying",
      label: "Read more about it",
    },
  },
  {
    title: "What is StarterKit?",
    Svg: WhatIsImage,
    description: (
      <>
        StarterKit is a technical kit to quickly build new products from{" "}
        <Link to="https://open.gov.sg">Open Government Products</Link>,
        Singapore.
      </>
    ),
    link: {
      to: "https://github.com/opengovsg/starter-kit",
      label: "Go to the repository",
    },
  },
];

function Feature({ title, Svg, description, link }: FeatureItem) {
  return (
    <div className={styles.feature}>
      <div className="container">
        <div className={clsx("row", styles.orientation)}>
          <div className={clsx("col", styles.description)}>
            <h3>{title}</h3>
            <p>{description}</p>
            {link && (
              <Link className={styles.link} to={link.to}>
                {link.label}
                <BiRightArrowAlt />
              </Link>
            )}
          </div>
          <div className="col">
            <div className="text--center">
              <Svg className={styles.featureSvg} role="img" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      {FeatureList.map((props, idx) => (
        <Feature key={idx} {...props} />
      ))}
    </section>
  );
}
