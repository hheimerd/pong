import {AvatarProps} from "./Avatar.props";
import styles from './Avatar.module.css';
import cn from 'classnames';
import {useEffect} from "react";

export const Avatar = ({ size = 'small', image = '/no-avatar.png', className, onClick, ...props}: AvatarProps): JSX.Element => {
  useEffect(() => {
    console.log("Avatar onClick: " + onClick);
  }, []);
  if (image === '') {
    image = '/no-avatar.png';
  }
  return (
    <img
      src={image}
      className={cn(styles.avatar, className, {
        [styles.small]: size == 'small',
        [styles.large]: size == 'large',
        [styles.pointer]: onClick,
      })}
      onClick={onClick ? onClick : null}
      {...props}
    />
  );
};
