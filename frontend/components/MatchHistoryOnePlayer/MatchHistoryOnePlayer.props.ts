import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface MatchHistoryOnePlayerProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  scores?: [number, number];
  users?: number[];
  href?: string;
}
