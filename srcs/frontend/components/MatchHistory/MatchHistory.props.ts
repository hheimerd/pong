import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface MatchHistoryProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  scores?: [number, number];
  users?: number[];
  href?: string;
}
