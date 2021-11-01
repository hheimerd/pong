import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface LeaderboardItemProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  image?: [string, string];
  name?: string;
  position: number;
  scoreLeft: number;
  scoreRight: number;
}
