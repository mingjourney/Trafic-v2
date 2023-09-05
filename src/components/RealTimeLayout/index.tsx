import { Fragment } from "react";
import FlowRouter from "../FlowRouter";
import MapFlow from "../MapFlow";
import EarlyWarning from "../EarlyWarning";
export default function RealTimeLayout({
  selectDay,
  selectedStation,
  flowCategory,
  timeCategory,
  mapType,
  changeSelectStation,
  selectFlowRange,
  changeSelectFlowRange,
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
  createImg: any;
  itemTitleSize: any;
}) {
  return (
    <Fragment>
      <FlowRouter
        mapType={mapType}
        selectDay={selectDay}
        selectedStation={selectedStation}
        flowCategory={flowCategory}
        timeCategory={timeCategory}
        selectFlowRange={selectFlowRange}
        createImg={createImg}
        itemTitleSize={itemTitleSize}
      />
      <MapFlow
        selectDay={selectDay}
        selectedStation={selectedStation}
        flowCategory={flowCategory}
        timeCategory={timeCategory}
        mapType={mapType}
        changeSelectStation={changeSelectStation}
        changeSelectFlowRange={changeSelectFlowRange}
        createImg={createImg}
        itemTitleSize={itemTitleSize}
      />
      <EarlyWarning
        flowCategory={flowCategory}
        createImg={createImg}
        changeSelectStation={changeSelectStation}
        itemTitleSize={itemTitleSize}
      />
    </Fragment>
  );
}

