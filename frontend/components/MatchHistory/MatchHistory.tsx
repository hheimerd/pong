import styles from "./MatchHistory.module.css";
import React from "react";
import { MatchHistoryProps } from "./MatchHistory.props";
import { Avatar } from "../Avatar/Avatar";

export const MatchHistory = ({
  nameRight = "",
  imageRight,
  scoreRight,
  nameLeft = "",
  imageLeft,
  scoreLeft,
  ...props
}: MatchHistoryProps): JSX.Element => {
  // set small or large image
  return (
    <div className={styles.container}>
      <div className={styles.left_name}>{nameLeft}</div>
      <div className={styles.left_img}>
        <Avatar image={imageLeft} alt={nameLeft} aria-controls="simple-menu" />
      </div>
      <div className={styles.score}>
        {scoreLeft} : {scoreRight}
      </div>
      <div className={styles.right_img}>
        <Avatar
          image={imageRight}
          alt={nameRight}
          aria-controls="simple-menu"
        />
      </div>
      <div className={styles.right_name}>{nameRight}</div>
    </div>
  );
};
