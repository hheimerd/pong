import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

export interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children: ReactNode;
  image?: string;
  appearance: "primary" | "ghost";
  arrow?: "right" | "down" | "none";
  size?: "regular" | "large";
}
