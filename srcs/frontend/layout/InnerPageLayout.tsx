import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { Avatar } from "../components";
import { PersonalTokenContext } from "../context/personaltoken/personaltoken.context";
import { UserStatusContext } from "../context/userstatus/userstatus.context";
import { PROFILE_QUERY } from "../graphql";
import { UserStatus } from "../interfaces/userprofile.interface";
import styles from "./InnerPageLayout.module.css";

export const InnerPageLayout = ({ children }): JSX.Element => {
  const { setToken } = useContext(PersonalTokenContext);
  const { setStatus } = useContext(UserStatusContext);
  const router = useRouter();
  // get user
  const { data, error, loading } = useQuery(PROFILE_QUERY, {
    onError(err) {
      console.log(err);
    },
  });

  // wait fetching data
  if (loading) return <p>Loading user profile from graphql...</p>;
  if (error) router.push('/');

  // useEffect(() => {
  //   console.log("getProfile", data.getProfile);
  // }, []);

  const handleLogout = () => {
    console.log("Clear localStorage.");
    localStorage.clear();
    setToken(null);
    setStatus(UserStatus.Offline);
    router.push("/");
  };

  return (
    <div className={styles.wrapper}>
      <aside className={styles.aside}>
        <div className={styles.user}>
          <Avatar image={data.getProfile.avatar} />
          <p className={styles.stats}>
            {data.getProfile.name}
            &nbsp; &nbsp;
            <span>
              <img src="/rank.png" alt="Rank" title="Rank" />
              {data.getProfile.rank}
            </span>
            {/*
            <span>
              <img src="/wins.png" alt="Wins" title="Wins" />?
            </span>
            <span>
              <img src="/loses.png" alt="Loses" title="Loses" />?
            </span>
            */}
          </p>
        </div>
        <ul className={styles.navi}>
          <li
            className={router.pathname == "/activegames" ? styles.active : ""}
          >
            <Link href="/activegames">Active Games</Link>
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
          <li
            className={
              router.pathname.startsWith("/profile") ? styles.active : ""
            }
          >
            <Link href="/profile">Edit profile</Link>
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
              router.pathname.startsWith("/leaderboard") ? styles.active : ""
            }
          >
            <Link href="/leaderboard">Leaderboard</Link>
          </li>
          <li
            className={router.pathname.startsWith("/game") ? styles.active : ""}
          >
            <Link href="/game">Play game</Link>
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
