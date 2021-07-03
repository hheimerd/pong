import {DetailedHTMLProps, HTMLAttributes, ReactNode} from "react";

export interface CanvasProps extends DetailedHTMLProps<HTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement> {
  children?: ReactNode;
  offsetY: number;
  size: 'small' | 'medium' | 'large';
}

