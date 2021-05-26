
import './App.css';
import {useState, useEffect} from "react";
import {interval, timer} from "rxjs";
import {first, scan, share, startWith} from "rxjs/operators";
import { Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

function App() {
    const [time, setTime] = useState(0);
    const [isGoing, setIsGoing] = useState(false);
    let timer$ = interval(1000);
    useEffect(() => {
        let start;
        start = timer$
        .pipe(
            startWith(time),
            scan( time => time + 1),
            share()
        )
        .subscribe(i => {
            if (isGoing) {
                setTime(i)
            }
        })
        return () => start.unsubscribe();
    },[isGoing, time, timer$] )

    const stopStartClick = (button) => {

        const start = isGoing;
        if (button === 'Start') {
            setIsGoing(!start);
        } else if (button === 'Stop') {
            setTime(0);
            setIsGoing(!start);
        }
    }
    const handleReset = () => {
        setIsGoing(true);
        setTime(0);
    };
    const handleWait = () => {
        const dbClick = timer(300);
        dbClick.pipe(first()).subscribe(() => {
            setIsGoing(false);
        });
    };

    const showTheTime = (time) => {
        return new Date(time * 1000).toISOString().substr(12, 8);
    }
    return (
    <div className="App">
        <div>{showTheTime(time)}</div>



<Button
onClick={isGoing ? () => stopStartClick("Stop") : () => stopStartClick("Start")}
>{isGoing ? "Stop" : "Start"}</Button>
<Button onDoubleClick={handleWait}>Wait</Button>
<Button onClick={handleReset}>Reset</Button>
    </div>
  );
}

export default App;
