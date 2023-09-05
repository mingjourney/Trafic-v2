import { useState, useCallback } from "react";
import "./index.css";
import MetroMapHistory from "../MetroMapHistory";
import { allStationsHistoryFlowProvider } from "../FlowProvider/AllStationsHistoryFlowProvider";
import { sectionHistoryFlowProvider } from "../FlowProvider/SectionHistoryFlowProvider";
export default function MapFlowHistory({
  selectedStation,
  selectDay,
  flowCategory,
  timeCategory,
  mapType,
  changeSelectStation,
  changeSelectFlowRange,
  switchMapType,
  createImg,
  itemTitleSize,
}: {
  selectedStation: any;
  selectDay: any;
  flowCategory: any;
  timeCategory: any;
  mapType: any;
  changeSelectStation: any;
  changeSelectFlowRange: any;
  switchMapType: any;
  createImg: any;
  itemTitleSize: any;
}) {
  const [checkboxTwo, setCheckboxTwo] = useState(false);
  const handleCheckboxTwoClick = useCallback(() => {
    setCheckboxTwo(false);
    createImg("item2");
  }, [createImg]);
  return (
    <div className="item" id="screen1" style={{ flex: 2.2 }}>
      <div className="label">
        <div className="left">
          <input
            type="checkbox"
            checked={checkboxTwo}
            onChange={() => handleCheckboxTwoClick()}
          />
          <span style={{ fontSize: itemTitleSize }} className="headline">
            Map Flow
          </span>
        </div>

        <div className="user">
          <span
            id="day"
            className={mapType !== "day" ? "notPitchB" : "pitchB"}
            onClick={() => switchMapType("day")}
          >
            Day
          </span>
          <span
            id="morning"
            className={mapType !== "morning" ? "notPitchB" : "pitchB"}
            onClick={() => switchMapType("morning")}
          >
            morning
          </span>
          <span
            id="evening"
            className={mapType !== "evening" ? "notPitchB" : "pitchB"}
            onClick={() => switchMapType("evening")}
          >
            evening
          </span>
        </div>
        {/* <span style={{ fontSize: selectResultSize }} className="select-result">{selectDay}</span> */}
      </div>
      <div className="content" style={{ flex: 2.2 }} id="item2">
        <MetroMapHistory
          style={{ flex: 1 }}
          selectedStation={selectedStation}
          dateRange={selectDay}
          eitherInOut={flowCategory}
          changeSelectStation={changeSelectStation}
          changeSelectFlowRange={changeSelectFlowRange}
          mapType={mapType}
          stationsFlowDataProvider={allStationsHistoryFlowProvider}
          sectionFlowDataProvider={sectionHistoryFlowProvider}
        />
      </div>
    </div>
  );
}

