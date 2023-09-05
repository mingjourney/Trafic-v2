import "./index.css";

export default function ScreenshotArea({ workAreaRef }: { workAreaRef: any }) {
  return <div className="workArea" ref={workAreaRef} id="scr"></div>;
}

