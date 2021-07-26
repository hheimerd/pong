import {AvatarButtonProps} from "./AvatarButton.props";
import styles from './AvatarButton.module.css';
import React from "react";
import {Avatar} from "../Avatar/Avatar";
import cn from 'classnames';
import Link from 'next/link';

export const AvatarButton = ({user, link, appearance, className, ...props}: AvatarButtonProps): JSX.Element => {
  let image = "";
  if (typeof user.avatar !== "undefined" && typeof user.avatar.sm !== "undefined") {
    image = user.avatar.sm;
  }
  return (
    <Link href={link}>
      <a
        className={styles.button}
        {...props}>
        <span 
          className={cn(styles.button__wrapper, className, {
            [styles.offline]: typeof appearance === 'undefined',
            [styles.offline]: appearance == 'offline',
            [styles.online]: appearance == 'online',
            [styles.ingame]: appearance == 'ingame',
          })}
        >
          <span className={styles.button__image}>
            <Avatar image={image}/>
          </span>
          <span className={styles.button__name}>
            {user.name}
          </span>
        </span>
      </a>
    </Link>
  );
};
