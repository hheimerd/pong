import cn from "classnames";
import Link from "next/link";
import React from "react";
import { UserStatus } from "../../interfaces/userprofile.interface";
import { Avatar } from "../Avatar/Avatar";
import styles from "./AvatarButton.module.css";
import { AvatarButtonProps } from "./AvatarButton.props";

export const AvatarButton = ({
  user,
  link,
  appearance,
  className,
  ...props
}: AvatarButtonProps): JSX.Element => {
  return (
    <Link href={link}>
      <a className={styles.button} {...props}>
        <span
          className={cn(styles.button__wrapper, className, {
            [styles.offline]: typeof appearance === "undefined",
            [styles.offline]: appearance == UserStatus.Offline,
            [styles.online]: appearance == UserStatus.Online,
            [styles.ingame]: appearance == UserStatus.InGame,
            [styles.undefined]: appearance == UserStatus.Undefined,
          })}
        >
          <span className={styles.button__image}>
            <Avatar image={user.avatar} />
          </span>
          <span className={styles.button__name}>{user.name}</span>
        </span>
      </a>
    </Link>
  );
};
