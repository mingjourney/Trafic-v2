import RealTimeLayout from "../RealTimeLayout";
import HistoryLayout from "../HistoryLayout";
import "./index.css";
import useWindowSize from "../../useWindowSize";
export default function MainDataArea({
  selectDay,
  selectedStation,
  flowCategory,
  timeCategory,
  mapType,
  changeSelectStation,
  selectFlowRange,
  changeSelectFlowRange,
  switchMapType,
  createImg,
  itemTitleSize,
}: {
  selectDay: any;
  selectedStation: any;
  flowCategory: any;
  timeCategory: any;
  mapType: any;
  changeSelectStation: any;
  selectFlowRange: any;
  changeSelectFlowRange: any;
  switchMapType: any;
  createImg: any;
  itemTitleSize: any;
}) {
  // const dateStr = selectDay[0] + '-' + selectDay[1]
  const windowSize = useWindowSize();
  let mainDataHeiget = windowSize.height * 0.42;
  return (
    <div className="mainData" style={{ height: mainDataHeiget }}>
      {timeCategory === "realTime" ? (
        <RealTimeLayout
          selectDay={selectDay}
          selectedStation={selectedStation}
          flowCategory={flowCategory}
          timeCategory={timeCategory}
          mapType={mapType}
          changeSelectStation={changeSelectStation}
          selectFlowRange={selectFlowRange}
          changeSelectFlowRange={changeSelectFlowRange}
          createImg={createImg}
          itemTitleSize={itemTitleSize}
        />
      ) : (
        <HistoryLayout
          selectDay={selectDay}
          selectedStation={selectedStation}
          flowCategory={flowCategory}
          timeCategory={timeCategory}
          mapType={mapType}
          changeSelectStation={changeSelectStation}
          selectFlowRange={selectFlowRange}
          changeSelectFlowRange={changeSelectFlowRange}
          switchMapType={switchMapType}
          createImg={createImg}
          itemTitleSize={itemTitleSize}
        />
      )}
    </div>
  );
}

