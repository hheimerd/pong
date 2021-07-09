import {AvatarButtonProps} from "./AvatarButton.props";
import styles from './AvatarButton.module.css';
import React from "react";
import {Avatar} from "../Avatar/Avatar";
import Link from 'next/link'

export const AvatarButton = ({image, name, link, ...props}: AvatarButtonProps): JSX.Element => {
  return (
    <Link href={link}>
      <a className={styles.button} {...props}>
        <span className={styles.button__wrapper}>
          <span className={styles.button__image}>
            <Avatar image={image}/>
          </span>
          <span className={styles.button__name}>
            {name}
          </span>
        </span>
      </a>
    </Link>
  );
};
