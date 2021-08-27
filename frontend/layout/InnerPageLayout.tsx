import { useQuery } from "@apollo/client";
import Link from "next/link";
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
        <Avatar
          image={data.getProfile.avatar}
          alt={data.getProfile.name}
          aria-controls="simple-menu"
        />
        <p>{data.getProfile.name}</p>
        <ul className={styles.navi}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/users">All users</Link>
          </li>
          <li>
            <Link href="/profile">Edit profile</Link>
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
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  );
};
