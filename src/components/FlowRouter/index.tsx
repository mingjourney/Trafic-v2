import { useCallback, useState } from "react";
import FlowChart from "../FlowChart";
import FlowChartHistory from "../FlowChartHistory";
import { lineHistoryFlowProvider } from "../FlowProvider/LineHistoryFlowProvider";
import { stationHistoryFlowProvider } from "../FlowProvider/StationHistoryFlowProvider";
import { totalHistoryFlowProvider } from "../FlowProvider/TotalHistoryFlowProvider";
import { stationFlowProvider } from "../FlowProvider/StationFlowProvider";
import { lineFlowProvider } from "../FlowProvider/LineFlowProvider";
import { totalFlowProvider } from "../FlowProvider/TotalFlowProvider";
import "./index.css";
export default function FlowRouter({
  selectedStation,
  selectDay,
  flowCategory,
  timeCategory,
  selectFlowRange,
  mapType,
  createImg,
  itemTitleSize,

}: {
  selectedStation: any;
  selectDay: any;
  flowCategory: any;
  timeCategory: any;
  selectFlowRange: any;
  mapType: any;
  createImg: any;
  itemTitleSize: any;
}) {
  const [checkboxOne, setCheckboxOne] = useState(false);
  const handleCheckboxOneClick = useCallback(() => {
    setCheckboxOne(false);
    createImg("item1");
  }, [createImg]);

  return (
    <div className="item">
      <label>
        <div className="left">
          <input
            type="checkbox"
            onChange={() => handleCheckboxOneClick()}
            checked={checkboxOne}
          />
          <span style={{ fontSize: itemTitleSize }} className="headline">
            {selectFlowRange}
          </span>
        </div>
        {/* <span style={{ fontSize: selectResultSize }} className="select-result">{selectedStation}</span> */}
      </label>
      <div className="content" id="item1" style={{ flex: 2.2 }}>
        {timeCategory === "realTime"
          ? (
            {
              "Total Flow": () => (
                <FlowChart
                  style={{ flex: 1 }}
                  station={selectedStation}
                  eitherInOut={flowCategory}
                  dataProvider={totalFlowProvider}
                />
              ),
              "Station Flow": () => (
                <FlowChart
                  style={{ flex: 1 }}
                  station={selectedStation}
                  eitherInOut={flowCategory}
                  dataProvider={stationFlowProvider}
                />
              ),
              "Line Flow": () => (
                <FlowChart
                  style={{ flex: 1 }}
                  station={selectedStation}
                  eitherInOut={flowCategory}
                  dataProvider={lineFlowProvider}
                />
              ),
            } as any
          )[selectFlowRange]()
          : (
            {
              "Total Flow": () => (
                <FlowChartHistory
                  dateRange={selectDay}
                  style={{ flex: 1 }}
                  station={selectedStation}
                  eitherInOut={flowCategory}
                  mapType={mapType}
                  dataProvider={totalHistoryFlowProvider}
                />
              ),
              "Station Flow": () => (
                <FlowChartHistory
                  dateRange={selectDay}
                  style={{ flex: 1 }}
                  station={selectedStation}
                  eitherInOut={flowCategory}
                  mapType={mapType}
                  dataProvider={stationHistoryFlowProvider}
                />
              ),
              "Line Flow": () => (
                <FlowChartHistory
                  dateRange={selectDay}
                  style={{ flex: 1 }}
                  station={selectedStation}
                  eitherInOut={flowCategory}
                  mapType={mapType}
                  dataProvider={lineHistoryFlowProvider}
                />
              ),
            } as any
          )[selectFlowRange]()}
      </div>
    </div>
  );
}
