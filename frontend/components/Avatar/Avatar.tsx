import {AvatarProps} from "./Avatar.props";
import styles from './Avatar.module.css';
import cn from 'classnames';

export const Avatar = ({ size = 'small', image, className, ...props}: AvatarProps): JSX.Element => {
  return (
    <img
      src={image}
      className={cn(styles.avatar, className, {
        [styles.small]: size == 'small',
        [styles.large]: size == 'large',
      })}
      {...props}
    />
  );
};
