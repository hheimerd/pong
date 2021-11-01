import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface MatchHistoryProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  imageLeft?: [string, string];
  imageRight?: [string, string];
  nameLeft?: string;
  nameRight?: string;
  scoreLeft: number;
  scoreRight: number;
}
