import { ButtonProps } from "./Button.props";
import styles from "./Button.module.css";
import cn from "classnames";
import ArrowIcon from "./Button.svg";

export const Button = ({
  appearance,
  size = "regular",
  arrow = "none",
  children,
  image = "",
  className,
  ...props
}: ButtonProps): JSX.Element => {
  return (
    <button
      className={cn(
        styles.button,
        className,
        {
          [styles.primary]: appearance == "primary",
          [styles.ghost]: appearance == "ghost",
        },
        {
          [styles.regular]: size == "regular",
          [styles.large]: size == "large",
        }
      )}
      {...props}
    >
      {image != "" && <img src={image} />}
      {children}
      {arrow != "none" && (
        <span
          className={cn(styles.arrow, {
            [styles.down]: arrow == "down",
          })}
        >
          <ArrowIcon />
        </span>
      )}
    </button>
  );
};
