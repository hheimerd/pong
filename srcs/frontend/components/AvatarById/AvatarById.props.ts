import { DetailedHTMLProps, ImgHTMLAttributes } from "react";

export interface AvatarByIdProps
  extends DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  size?: "xxsmall" | "xsmall" | "small" | "large";
  user_id?: number;
}
