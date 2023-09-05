import KeyStationRouter from "../KeyStationRouter";
import WorkArea from "../WorkArea";
import "./index.css";
import useWindowSize from "../../useWindowSize";
export default function LikeDataArea({
  focusStation,
  selectedStation,
  selectDay,
  flowCategory,
  timeCategory,
  addFocusStation,
  workAreaRef,
  itemTitleSize,
  mapType,
}: {
  focusStation: any;
  selectedStation: any;
  selectDay: any;
  flowCategory: any;
  timeCategory: any;
  addFocusStation: any;
  workAreaRef: any;
  itemTitleSize: any;
  mapType: any;
}) {
  const windowSize = useWindowSize();
  const itemHeight = windowSize.height * 0.43;
  return (
    <div className="likeData" style={{ height: itemHeight }}>
      <KeyStationRouter
        itemTitleSize={itemTitleSize}
        focusStation={focusStation}
        timeCategory={timeCategory}
        mapType={mapType}
        selectedStation={selectedStation}
        selectDay={selectDay}
        flowCategory={flowCategory}
        addFocusStation={addFocusStation}
        itemHeight={itemHeight}
      />
      <WorkArea
        itemTitleSize={itemTitleSize}
        workAreaRef={workAreaRef}
        itemHeight={itemHeight} />
    </div>
  );
}

