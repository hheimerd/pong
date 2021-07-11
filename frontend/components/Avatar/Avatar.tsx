import {AvatarProps} from "./Avatar.props";
import styles from './Avatar.module.css';
import cn from 'classnames';

export const Avatar = ({ size = 'small', image = '/no-avatar.png', className, ...props}: AvatarProps): JSX.Element => {
  if (image === '') {
    image = '/no-avatar.png'
  }
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
