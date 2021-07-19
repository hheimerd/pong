import {CanvasProps} from "./Canvas.props";
import styles from './Canvas.module.css';
import cn from 'classnames';
import {useEffect, useRef} from "react";
import React from "react";

/*
 * https://hashnode.blainegarrett.com/html-5-canvas-react-refs-and-typescript-ckf4jju8r00eypos1gyisenyf
 */

export const Canvas = ({ size = 'medium', offsetY = 20, children, className, ...props}: CanvasProps): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    // Initialize
    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext('2d');
      const ctx = canvasCtxRef.current;
      ctx.fillStyle = "black";
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.fillRect(20, offsetY, 10, 30);
      console.log('setOffsetY: ' + offsetY);
      canvasRef.current.focus();
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      key={"editor"}
      className={cn(styles.canvas, className, {
        [styles.small]: size == 'small',
        [styles.medium]: size == 'medium',
        [styles.large]: size == 'large',
      })}
      {...props}
    >
      {children}
    </canvas>
  );
};
