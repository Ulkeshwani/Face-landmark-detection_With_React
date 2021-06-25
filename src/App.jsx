import React, { Component, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";

import { drawMesh } from "./util.js";
import "./App.css";

function App() {
  //some ref
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  //load facemesh
  const loadFacemesh = async () => {
    const net = await facemesh.load(
      facemesh.SupportedPackages.mediapipeFacemesh
    );
    setInterval(() => {
      detectMesh(net);
    }, 100);
  };

  //load Detection
  const detectMesh = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      //get Video props
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      //set Video Props
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      //set canvas props
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      //make detection
      const face = await net.estimateFaces({ input: video });

      const ctx = canvasRef.current.getContext("2d");
      requestAnimationFrame(() => {
        drawMesh(face, ctx);
      });
    }
  };

  loadFacemesh();
  return (
    <div className="App">
      <header className="App-header">
        {/*webcam component*/}
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
            borderRadius: 5,
          }}
        />
        {/*canvas over webcam to draw*/}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
            borderRadius: 5,
          }}
        />
      </header>
    </div>
  );
}

export default App;
