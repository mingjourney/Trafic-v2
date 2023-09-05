import { useCallback, useState } from "react";
import "./index.css";
import MetroMap from "../MetroMap";
import withdrawLogo from "../../images/撤销.png";
import { allStationsFlowProvider } from "../FlowProvider/AllStationsFlowProvider";
import { sectionFlowProvider } from "../FlowProvider/SectionFlowProvider";
export default function StationFlow({
  selectedStation,
  selectDay,
  flowCategory,
  timeCategory,
  mapType,
  changeSelectStation,
  changeSelectFlowRange,
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
  createImg: any;
  itemTitleSize: any;
}) {
  const [checkboxTwo, setCheckboxTwo] = useState(false);
  const handleCheckboxTwoClick = useCallback(() => {
    setCheckboxTwo(false);
    createImg("item2");
  }, [createImg]);
  return (
    <div className="item" style={{ flex: 2.2 }}>
      <div>
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
        <span style={{ display: "none" }}>
          <img
            src={withdrawLogo}
            alt="withDraw"
            onClick={() => {
              changeSelectFlowRange("Total Flow");
            }}
          />
        </span>
        {/* <span style={{ fontSize: selectResultSize }} className="select-result">{selectDay}</span> */}
      </div>
      <div className="content" id="item2" style={{ flex: 2.2 }}>
        <MetroMap
          style={{ flex: 1 }}
          selectedStation={selectedStation}
          dateRange={selectDay}
          eitherInOut={flowCategory}
          changeSelectStation={changeSelectStation}
          changeSelectFlowRange={changeSelectFlowRange}
          stationsFlowDataProvider={allStationsFlowProvider}
          sectionFlowDataProvider={sectionFlowProvider}
        />
      </div>
    </div>
  );
}
