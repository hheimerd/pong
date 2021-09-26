import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Avatar } from "../components";
import { PROFILE_QUERY } from "../graphql";
import styles from "./InnerPageLayout.module.css";

export const InnerPageLayout = ({ children }): JSX.Element => {
  const router = useRouter();
  // get user
  const { data, error, loading } = useQuery(PROFILE_QUERY);

  // wait fetching data
  if (loading) return <p>Loading user profile from graphql...</p>;
  if (error) return <p>Error: can't fetching data from graphql :(</p>;

  console.log("getProfile", data.getProfile);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <div className={styles.wrapper}>
      <aside className={styles.aside}>
        <div className={styles.user}>
          <Avatar
            image={data.getProfile.avatar}
            alt={data.getProfile.name}
            aria-controls="simple-menu"
          />
          <p className={styles.stats}>
            {data.getProfile.name}
            <br />
            <span>
              <img src="/rank.png" alt="Rank" title="Rank" />0
            </span>
            <span>
              <img src="/wins.png" alt="Wins" title="Wins" />0
            </span>
            <span>
              <img src="/loses.png" alt="Loses" title="Loses" />0
            </span>
          </p>
        </div>
        <ul className={styles.navi}>
          <li className={router.pathname == "/" ? styles.active : ""}>
            <Link href="/dashboard">Home</Link>
          </li>
          <li
            className={
              router.pathname.startsWith("/friends") ? styles.active : ""
            }
          >
            <Link href="/friends">Friends</Link>
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
            <span onClick={() => handleLogout()}>Logout</span>
          </li>
        </ul>
        {data.getProfile.roles.includes("Admin") && (
          <>
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
          </>
        )}
      </aside>
      <main className={styles.content}>
        <div className={styles.logout} onClick={() => handleLogout()}>
          Logout
        </div>
        {children}
      </main>
    </div>
  );
};
