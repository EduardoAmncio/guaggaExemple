import React, { useCallback, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import Quagga from '@ericblade/quagga2';

const devices = navigator.mediaDevices.enumerateDevices().then(function(devices) {
    const arraydevices = [];
    devices.forEach(function(device) {
        var z = document.createElement('a'); 
        var br = document.createElement('br');// is a node
        z.innerHTML = 'Comeco: ' + JSON.stringify(device);
       
        document.getElementById('corpo').appendChild(z)
        document.getElementById('corpo').appendChild(br)
     //   document.getElementById('corpo').appendChild(br)
      //  document.getElementById('corpo').appendChild(br)
    });
    
    return arraydevices;
   //     console.log(`tetetes`)
    //  drawingCtx.fillText(`teste`, 10, 20);
      // console.log(JSON.stringify(device))
      // const drawingCtx = Quagga.canvas.ctx.overlay;
      // drawingCtx.font = "24px Arial";
      //  drawingCtx.fillStyle = 'green';
                      // drawingCtx.fillStyle = validated ? 'green' : 'red';
                      // drawingCtx.fillText(`${result.codeResult.code} valid: ${validated}`, 10, 50);
          
          //console.log(device.kind + ": " + device.label +
          //            " id = " + device.deviceId);
  }).result

  console.log(devices)

function getMedian(arr) {

    arr.sort((a, b) => a - b);
    const half = Math.floor(arr.length / 2);
    if (arr.length % 2 === 1) {
        return arr[half];
    }
    return (arr[half - 1] + arr[half]) / 2;
}

function getMedianOfCodeErrors(decodedCodes) {
    const errors = decodedCodes.filter(x => x.error !== undefined).map(x => x.error);
    const medianOfErrors = getMedian(errors);
    return medianOfErrors;

}

const defaultConstraints = {
    width: 2400,
    height: 1080,

    focusMode: 'continuous',
    
};

const defaultLocatorSettings = {
    patchSize: 'medium',
    halfSample: true,
};
//console.log(JSON.stringify(navigator.mediaDevices.enumerateDevices()))
// navigator.mediaDevices.enumerateDevices()
// .then(function(devices) {
//   devices.forEach(function(device) {
    
//     console.log(JSON.stringify(device))
   
//   });
// })
const defaultDecoders = ['ean_reader'];

const Scanner = ({
    onDetected,
    scannerRef,
    onScannerReady,
    cameraId,
    facingMode= 'environment',
    constraints = defaultConstraints,
    locator = defaultLocatorSettings,
    numOfWorkers = navigator.hardwareConcurrency || 0,
    decoders = defaultDecoders,
    locate = true,
    focusMode= 'continuous',
    frequency= `full`,

}) => {
    const errorCheck = useCallback((result) => {
        if (!onDetected) {
            return;
        }
        const err = getMedianOfCodeErrors(result.codeResult.decodedCodes);
        // if Quagga is at least 75% certain that it read correctly, then accept the code.
        if (err < 0.25) {
            onDetected(result.codeResult.code);
        }
    }, [onDetected]);

    const handleProcessed = (result) => {
        
        const drawingCtx = Quagga.canvas.ctx.overlay;
        const drawingCanvas = Quagga.canvas.dom.overlay;
        drawingCtx.font = "24px Arial";
        drawingCtx.fillStyle = 'green';

        if (result) {

            
            console.log(JSON.stringify(devices))

            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width')), parseInt(drawingCanvas.getAttribute('height')));
                result.boxes.filter((box) => box !== result.box).forEach((box) => {
                    Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: 'purple', lineWidth: 2 });
                });
            }
            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: 'blue', lineWidth: 2 });
            }
            if (result.codeResult && result.codeResult.code && result.codeResult.code.length >= 1) {
                console.log(result.codeResult.code)
                // const validated = barcodeValidator(result.codeResult.code);
                // const validated = validateBarcode(result.codeResult.code);
                // Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: validated ? 'green' : 'red', lineWidth: 3 });
                
                drawingCtx.font = "24px Arial";
                // drawingCtx.fillStyle = validated ? 'green' : 'red';
                // drawingCtx.fillText(`${result.codeResult.code} valid: ${validated}`, 10, 50);
                drawingCtx.fillText(result.codeResult.code, 10, 20);
                // if (validated) {
                //     onDetected(result);
                // }
                navigator.mediaDevices.enumerateDevices().then(function(devices) {
                  devices.forEach(function(device) {
                      console.log(`tetetes`)
                    drawingCtx.fillText(`teste`, 10, 20);
                    // console.log(JSON.stringify(device))
                    // const drawingCtx = Quagga.canvas.ctx.overlay;
                    // drawingCtx.font = "24px Arial";
                    //  drawingCtx.fillStyle = 'green';
                                    // drawingCtx.fillStyle = validated ? 'green' : 'red';
                                    // drawingCtx.fillText(`${result.codeResult.code} valid: ${validated}`, 10, 50);
                        
                        //console.log(device.kind + ": " + device.label +
                        //            " id = " + device.deviceId);
                });
})
            }
        }
    };

    useLayoutEffect(() => {
        
        Quagga.init({
            inputStream: {
                type: 'LiveStream',
                constraints: {
                    ...constraints,
                    frequency,
                    
                    ...(cameraId ? { deviceId: cameraId } : { facingMode })
                },
                target: scannerRef.current,
            },
            locator,
            focusMode,
            numOfWorkers,
            decoder: { readers: decoders },
            locate,
        }, (err) => {
            Quagga.onProcessed(handleProcessed);
            
            if (err) {
                return console.log('Error starting Quagga:', err);
            }
            if (scannerRef && scannerRef.current) {
                Quagga.start();
                if (onScannerReady) {
                    onScannerReady();
                }
            }
        });
        Quagga.onDetected(errorCheck);
        return () => {
            Quagga.offDetected(errorCheck);
            Quagga.offProcessed(handleProcessed);
            Quagga.stop();
        };
    }, [cameraId, onDetected, onScannerReady, scannerRef, errorCheck, constraints, locator, decoders, locate]);
    return null;
}

Scanner.propTypes = {
    onDetected: PropTypes.func.isRequired,
    scannerRef: PropTypes.object.isRequired,
    onScannerReady: PropTypes.func,
    cameraId: PropTypes.string,
    facingMode: PropTypes.string,
    constraints: PropTypes.object,
    locator: PropTypes.object,
    numOfWorkers: PropTypes.number,
    decoders: PropTypes.array,
    locate: PropTypes.bool,
};

export default Scanner;
