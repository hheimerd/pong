import {AnchorHTMLAttributes, DetailedHTMLProps} from "react";

export interface AvatarButtonProps extends DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
  image: string;
  link: string;
  name: string;
}

