import React from "react";
import ScreenshotArea from "../ScreenshotArea";
import "./index.css";
export default function WorkArea({
  itemTitleSize,
  workAreaRef,
  itemHeight,
}: {
  itemTitleSize: any;
  workAreaRef: any;
  itemHeight: any;
}) {
  return (
    <div className="item" style={{ flex: 3, width: "600px" }}>
      <label>
        <div className="left">
          <div className="circle" style={{ backgroundColor: "#308aed " }}></div>
          <span className="headline" style={{ fontSize: itemTitleSize }}>
            Work Space
          </span>
        </div>

        <span className="select-result"></span>
      </label>
      <div className="content" style={{ height: itemHeight }}>
        <ScreenshotArea workAreaRef={workAreaRef} />
      </div>
    </div>
  );
}

