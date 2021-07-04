import React, {useEffect, useState} from "react";
import {Canvas, Button, Htag} from "../components";
import useKeypress from "../hooks/useKeypress";

export default function Home(): JSX.Element {
    const [counter, setCounter] = useState<number>(0);
    const [offsetY, setOffsetY] = useState<number>(0);

    useEffect(() => {
        console.log('Counter: ' + counter);
    });

    useKeypress('ArrowLeft', () => {
        console.log('you pressed ArrowLeft!')
        setOffsetY(offsetY => offsetY + 2);
        console.log('you pressed ArrowRight, new_offsetY: ' + offsetY)
    }, offsetY);

    useKeypress('ArrowRight', () => {
        setOffsetY(offsetY => offsetY - 2);
        console.log('you pressed ArrowRight, new_offsetY: ' + offsetY)
    }, offsetY);

    return (
        <div className="wrapper">
        <div className="leftplayer">Left Player</div>
    <div className="gamearea">
    <Htag tag='h1'>Buttons</Htag>
        <Htag tag='h3'>{counter}</Htag>
        <Button appearance='primary' arrow='right' onClick={() => setCounter(x => x + 1)}>Button</Button>
    <Htag tag='h1'>Canvas</Htag>
        <Canvas size="medium" offsetY={offsetY}/>
    </div>
    <div className="rightplayer">Right Player</div>
    </div>
);
}
