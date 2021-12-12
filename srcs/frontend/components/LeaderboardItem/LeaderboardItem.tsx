import styles from "./LeaderboardItem.module.css";
import React from "react";
import { Avatar } from "../Avatar/Avatar";
import { LeaderboardItemProps } from "./LeaderboardItem.props";

export const LeaderboardItem = ({
  name = "",
  image,
  position,
}: // scoreRight,
// scoreLeft,
LeaderboardItemProps): JSX.Element => {
  // set small or large image
  return (
    <div className={styles.container}>
      <div className={styles.position}>{position}</div>
      <div className={styles.image}>
        <Avatar image={image} alt={name} aria-controls="simple-menu" />
      </div>
      <div className={styles.name}>{name}</div>
    </div>
  );
};
