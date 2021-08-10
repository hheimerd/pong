import { DetailedHTMLProps, ImgHTMLAttributes } from "react";

export interface AvatarProps
  extends DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  image?: [string, string];
  size?: "small" | "large";
  name?: string;
}
