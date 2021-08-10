import { AnchorHTMLAttributes, DetailedHTMLProps } from "react";
import { IUserProfile } from "../../interfaces/userprofile.interface";

export interface AvatarButtonProps
  extends DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  user: IUserProfile;
  link: string;
  appearance?: "offline" | "online" | "ingame";
}
