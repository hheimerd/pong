import styles from './Chat.module.css';
import {ChatProps} from './Chat.props';

export const Chat: React.FC<ChatProps> = ({children, ...props}: ChatProps): JSX.Element => {
  return (
    <div className={styles.chat} {...props}>
      {children}
    </div>
  );
};
