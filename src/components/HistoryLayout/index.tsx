import { Fragment } from "react";
import StationFlow from "../FlowRouter";
import MapFlowHistory from "../MapFlowHistory";
export default function HistoryLayout({
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
    return (
        <Fragment>
            <StationFlow
                selectDay={selectDay}
                selectedStation={selectedStation}
                flowCategory={flowCategory}
                timeCategory={timeCategory}
                selectFlowRange={selectFlowRange}
                mapType={mapType}
                createImg={createImg}
                itemTitleSize={itemTitleSize}
            />
            <MapFlowHistory
                selectDay={selectDay}
                selectedStation={selectedStation}
                flowCategory={flowCategory}
                timeCategory={timeCategory}
                mapType={mapType}
                changeSelectStation={changeSelectStation}
                changeSelectFlowRange={changeSelectFlowRange}
                switchMapType={switchMapType}
                createImg={createImg}
                itemTitleSize={itemTitleSize}
            />
        </Fragment>
    );
}

