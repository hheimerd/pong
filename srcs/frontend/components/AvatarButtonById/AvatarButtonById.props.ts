import { AnchorHTMLAttributes, DetailedHTMLProps } from "react";
import {
  IUserProfile,
  UserStatus,
} from "../../interfaces/userprofile.interface";

export interface AvatarButtonProps
  extends DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  user_id: number;
}
