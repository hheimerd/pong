import styles from "./MatchHistoryOnePlayer.module.css";
import React from "react";
import cn from "classnames";
import { MatchHistoryOnePlayerProps } from "./MatchHistoryOnePlayer.props";
import { Avatar } from "../Avatar/Avatar";
import { useQuery } from "@apollo/client";
import { USER_QUERY } from "../../graphql";
import Link from "next/link";

export const MatchHistoryOnePlayer = ({
  scores,
  users,
  href,
  ...props
}: MatchHistoryOnePlayerProps): JSX.Element => {
  // get user
  const {
    data: dataL,
    error: errorL,
    loading: loadingL,
  } = useQuery(USER_QUERY, {
    variables: { userId: users[0] },
    onError(err) {
      console.log(err);
    },
  });

  // wait fetching data
  if (loadingL) return <p>Loading user profile from graphql...</p>;
  if (errorL) return <p>Error: can't fetching data from graphql :(</p>;

  return (
    <Link href={typeof href != "undefined" ? href : ""}>
      <div
        className={cn(styles.container, {
          [styles.clk]: typeof scores === "undefined",
        })}
      >
        <div className={styles.left_name}>{dataL.user.name}</div>
        <div className={styles.left_img}>
          <Avatar
            image={dataL.user.avatar}
            alt={dataL.user.name}
            aria-controls="simple-menu"
          />
        </div>
        <div className={styles.score}>
          {typeof scores != "undefined" ? scores[0] + ":" + scores[1] : ""}
        </div>
        <div className={styles.right_img}></div>
        <div className={styles.right_name}></div>
      </div>
    </Link>
  );
};
