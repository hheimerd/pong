import Link from "next/link";
import React from "react";
import styles from "./HomePageLayout.module.css";

export const HomePageLayout = ({ children }): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <header>
        <h1 className={styles.h1}>Pong Online</h1>
        <p className={styles.desc}>Online pong MULTIPLAYER with friends</p>
      </header>
      <main className={styles.content}>{children}</main>
    </div>
  );
};
