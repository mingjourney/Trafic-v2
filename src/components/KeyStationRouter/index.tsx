import { useEffect, useState } from "react";
import KeyStationCharts from "../KeyStationCharts";
import KeyStationHistoryCharts from "../KeyStationHistoryCharts";
import "./index.css";
import { stationHistoryFlowProvider } from "../FlowProvider/StationHistoryFlowProvider";
import { subNameObj } from "../MetroMap/MetroMapData"
import { stationFlowProvider } from "../FlowProvider/StationFlowProvider";
export default function KeyStationRouter({
  itemTitleSize,
  focusStation,
  selectedStation,
  selectDay,
  flowCategory,
  timeCategory,
  addFocusStation,
  itemHeight,
  mapType,
}: {
  focusStation: any;
  selectedStation: string;
  selectDay: [string, string];
  flowCategory: string;
  timeCategory: string;
  addFocusStation: any;
  itemTitleSize: number;
  itemHeight: number;
  mapType: string;
}) {
  const [showList, setShowList] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const handleAddFocus = (selectedStation: string) => {
    const reminder = document.getElementById("reminder");
    if (selectedStation === "") {
      reminder!.innerHTML = "Select a site on the map screen";
      setTimeout(() => {
        reminder!.innerHTML = "";
      }, 3000);
      return false;
    }
    if (selectedStation.substring(0, 4) !== "Line") {
      addFocusStation(selectedStation);
      listLength = focusStation.length;
      cycleTime = Math.ceil((listLength + 1) / 3);
      console.log(cycleTime);
      setPageNumber(cycleTime - 1);
    } else {
      document.getElementById("reminder")!.innerHTML =
        "Lines are not allowed to be added";
      setTimeout(() => {
        reminder!.innerHTML = "";
      }, 3000);
      return false;
    }
  };
  var listLength = focusStation.length;
  var cycleTime = Math.ceil(listLength / 3);
  const changePageNumberI = () => {
    if (pageNumber > 0) {
      setPageNumber(pageNumber - 1);
    }
  };
  const changePageNumberD = () => {
    if (pageNumber < cycleTime - 1) {
      setPageNumber(pageNumber + 1);
    }
  };

  useEffect(() => {
    setShowList(focusStation.slice(pageNumber * 3, (pageNumber + 1) * 3));
  }, [pageNumber, focusStation]);
  return (
    <div className="item" style={{ flex: 1 }}>
      <div className="lable">
        <div className="left">
          <div className="circle" style={{ backgroundColor: "#9848db" }}></div>
          <span style={{ fontSize: itemTitleSize }} className="headline">
            Key Station
          </span>
        </div>
        <div className="choose">
          <button id="addSta" onClick={() => handleAddFocus(selectedStation)}>
            add
          </button>
          <button id="left" onClick={() => changePageNumberI()}>
            &lt;
          </button>
          <button id="right" onClick={() => changePageNumberD()}>
            &gt;
          </button>
        </div>
      </div>
      <div className="content" style={{ height: itemHeight }}>
        <ul
          className="favorStation"
          style={{ display: "flex", flexDirection: "column" }}
        >
          {showList.map((station: any) => {
            return (
              <li key={station.subId} style={{ height: itemHeight * 0.21 }}>
                <span>{subNameObj[station.subId]}</span>
                <div className="chartsShow">
                  {timeCategory === "realTime" ?
                    <KeyStationCharts
                      // style={{ flex: 1 }}
                      station={station.subId}
                      eitherInOut={flowCategory}
                      dataProvider={stationFlowProvider}
                    />
                    :
                    <KeyStationHistoryCharts
                      // style={{ flex: 1 }}
                      station={station.subId}
                      dateRange={selectDay}
                      eitherInOut={flowCategory}
                      mapType={mapType}
                      dataProvider={stationHistoryFlowProvider}
                    />
                  }

                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

