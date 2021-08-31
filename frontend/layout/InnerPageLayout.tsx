import { useQuery } from "@apollo/client";
import Link from "next/link";
import router, { useRouter } from "next/router";
import React from "react";
import { Avatar } from "../components";
import { PROFILE_QUERY } from "../graphql";
import styles from "./InnerPageLayout.module.css";

export const InnerPageLayout = ({ children }): JSX.Element => {
  // get user
  const { data, error, loading } = useQuery(PROFILE_QUERY);

  // wait fetching data
  if (loading) return <p>Loading user profile from graphql...</p>;
  if (error) return <p>Error: can't fetching data from graphql :(</p>;

  return (
    <div className={styles.wrapper}>
      <aside className={styles.aside}>
        <div className={styles.user}>
          <Avatar
            image={data.getProfile.avatar}
            alt={data.getProfile.name}
            aria-controls="simple-menu"
          />
          <p>
            {data.getProfile.name}
            <br />
            R: 0 W: 0 L: 0
          </p>
        </div>
        <ul className={styles.navi}>
          <li className={router.pathname == "/" ? styles.active : ""}>
            <Link href="/">Home</Link>
          </li>
          <li
            className={
              router.pathname.startsWith("/users") ? styles.active : ""
            }
          >
            <Link href="/users">All users</Link>
          </li>
          <li
            className={
              router.pathname.startsWith("/profile") ? styles.active : ""
            }
          >
            <Link href="/profile">Edit profile</Link>
          </li>
          <li
            className={router.pathname.startsWith("/game") ? styles.active : ""}
          >
            <Link href="/game">Game</Link>
          </li>
          <li
            className={
              router.pathname.startsWith("/chats") ? styles.active : ""
            }
          >
            <Link href="/chats">Chats</Link>
          </li>
          <li
            className={
              router.pathname.startsWith("/channels") ? styles.active : ""
            }
          >
            <Link href="/channels">Channels</Link>
          </li>
          <li>
            <Link href="/logout">Logout</Link>
          </li>
        </ul>
        <hr />
        <ul className={styles.navi}>
          <li
            className={
              router.pathname.startsWith("/admins") ? styles.active : ""
            }
          >
            <Link href="/admin">Admin</Link>
          </li>
        </ul>
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  );
};
