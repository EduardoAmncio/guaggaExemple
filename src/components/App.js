import React, { useState, useRef } from 'react';
import Scanner from './Scanner';
import Result from './Result';
import { string } from 'prop-types';

const App = () => {
    const [scanning, setScanning] = useState(false);
    const [results, setResults] = useState('');
    const scannerRef = useRef(null);

    return (
        <div id='corpo'>
            <button onClick={() => setScanning(!scanning)}>{scanning ? 'Stop' : 'Start'}</button>
            {/* <ul className="results">
                {results.map((result) => (result.codeResult && <Result key={result.codeResult.code} result={result} />))}
            </ul> */}
            <div ref={scannerRef} style={{ position: 'relative', border: '3px solid red' }}>
                {/* <video style={{ width: window.innerWidth, height: 480, border: '3px solid orange' }}/> */}
                <canvas className="drawingBuffer" style={{
                    position: 'absolute',
                    top: '0px',
                    // left: '0px',
                    //  height: '100%',
                    //  width: '100%',

                    border: '3px solid green',
                }} width="2400" height="1080" />
                {scanning ? <Scanner
                    decoders={[
                        'i2of5_reader',
                    ]}
                    scannerRef={scannerRef} onDetected={(result) => {
                        if (result.length >= 2) {
                            console.log(result)
                            setResults(result)
                        }
                    }} /> : null}
            </div>
            <p></p>
        </div>
    );
};

export default App;
