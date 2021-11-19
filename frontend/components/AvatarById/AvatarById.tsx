import cn from "classnames";
import Link from "next/link";
import router from "next/router";
import React from "react";
import useUserById from "../../hooks/useUserById";
import styles from "./AvatarById.module.css";
import { AvatarByIdProps } from "./AvatarById.props";

export const AvatarById = ({
  size = "small",
  user_id,
  onClick,
  ...props
}: AvatarByIdProps): JSX.Element => {
  const user = useUserById(user_id);

  if (typeof user === "undefined") return <span>Loading...</span>;

  const handleClick = () => {
    router.push("/users/" + user.id);
  };

  let image = [];
  if (typeof user.avatar === "undefined") {
    image = ["/no-avatar.png", "/no-avatar.png"];
  } else {
    image = [
      "http://" + process.env.BACKEND_HOST + "/public/" + user.avatar[0],
      "http://" + process.env.BACKEND_HOST + "/public/" + user.avatar[1],
    ];
  }
  // set small or large image
  const src = size === "small" ? image[0] : image[1];
  const date = new Date().getTime();
  return (
    <>
      <img
        src={src + "?" + date}
        className={cn(styles.avatar, {
          [styles.xxsmall]: size == "xxsmall",
          [styles.xsmall]: size == "xsmall",
          [styles.small]: size == "small",
          [styles.large]: size == "large",
          [styles.pointer]: onClick,
        })}
        alt={user.name}
        onClick={() => handleClick()}
        {...props}
      />
      &nbsp;
      <Link href={"/users/" + user.id}>{user.login}</Link>
    </>
  );
};
