import React from "react";
import styles from "./InnerPageLayout.module.css";
import Link from "next/link";

export const InnerPageLayout = ({ children }): JSX.Element => {
  return (
    <>
      <div className={styles.wrapper}>
        <nav>
          <ul className={styles.navi}>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/users">Users</Link>
            </li>
            <li>
              <Link href="/profile">Profile</Link>
            </li>
            <li>
              <Link href="/game">Game</Link>
            </li>
            <li>
              <Link href="/chats">Chats</Link>
            </li>
            <li>
              <Link href="/channels">Channels</Link>
            </li>
            <li>
              <Link href="/admin">Admin</Link>
            </li>
            <li>
              <Link href="/logout">Logout</Link>
            </li>
          </ul>
        </nav>
        <main>{children}</main>
      </div>
    </>
  );
};
