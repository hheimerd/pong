import { AvatarProps } from "./Avatar.props";
import styles from "./Avatar.module.css";
import cn from "classnames";
import { useEffect } from "react";

export const Avatar = ({
  size = "small",
  name = "",
  image,
  className,
  onClick,
  ...props
}: AvatarProps): JSX.Element => {
  if (Object.keys(image).length === 0) {
    image = ["/no-avatar.png", "/no-avatar.png"];
  } else {
    image = [
      "http://" + process.env.BACKEND_HOST + "/public/" + image[0],
      "http://" + process.env.BACKEND_HOST + "/public/" + image[1],
    ];
  }
  // set small or large image
  const src = size === "small" ? image[0] : image[1];
  const date = new Date().getTime();
  return (
    <img
      src={src + "?" + date}
      className={cn(styles.avatar, className, {
        [styles.xxsmall]: size == "xxsmall",
        [styles.xsmall]: size == "xsmall",
        [styles.small]: size == "small",
        [styles.large]: size == "large",
        [styles.pointer]: onClick,
      })}
      alt={name}
      onClick={onClick ? onClick : null}
      {...props}
    />
  );
};
