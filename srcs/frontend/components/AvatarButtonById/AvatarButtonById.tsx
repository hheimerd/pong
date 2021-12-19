import cn from "classnames";
import Link from "next/link";
import React from "react";
import useUserById from "../../hooks/useUserById";
import { UserStatus } from "../../interfaces/userprofile.interface";
import { Avatar } from "../Avatar/Avatar";
import styles from "./AvatarButtonById.module.css";
import { AvatarButtonProps } from "./AvatarButtonById.props";

export const AvatarButtonById = ({
  user_id,
  className,
  ...props
}: AvatarButtonProps): JSX.Element => {
  
  const user = useUserById(user_id);
  if (typeof user === "undefined") return <span>Loading...</span>;
  const appearance = user.status
  // console.log("status", appearance);
  return (
    <Link href={"/users/" + user.id}>
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
