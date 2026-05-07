import React from "react";
import "../styles/loader.css"; // we will create this file

export default function Loader({ size = 22 }) {
  return (
    <div className="flex justify-center items-center">
      <div className="loader">
        {[1, 2, 3, 4].map((_, i) => (
          <div className="circle" key={i}>
            <div className="dot" />
            <div className="outline" />
          </div>
        ))}
      </div>
    </div>
  );
}
