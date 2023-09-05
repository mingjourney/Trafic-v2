import { standardTime } from "../../Utils/standardTime";

const lineMap: any = { Line1: 0, Line2: 1, Line4: 2 };
const eitherInOutMap: any = { inflow: 0, outflow: 3 };
const lineRangeMap: any = {
  Line1: [0, 34],
  Line2: [34, 67],
  Line4: [67, 81],
};
const sum = (arr: Array<any>) =>
  arr.reduce((prev, curr) => Number(prev) + Number(curr), 0) as number;

export async function lineFlowProvider(
  state: any,
  selectedLine: string,
  eitherInOut: string
): Promise<any> {
  const selectedIndex = eitherInOutMap[eitherInOut] + lineMap[selectedLine];
  const stationsAllTime =
    eitherInOut === "inflow" ? state.station_flow_in : state.station_flow_out;
  const predictFlowList = state.line_flow_predict;
  const predictlineFlowList = predictFlowList.map(
    (item: any) => item[selectedIndex]
  );
  const lineFlowList = Object.entries(stationsAllTime)
    .sort(([LTime], [NTime]) => (LTime > NTime ? 1 : -1))
    .map(([time, v]) => ({
      time,
      flow: sum(
        Object.entries(v as any)
          .filter(([station]) => {
            const id = Number(station);
            return (
              id >= lineRangeMap[selectedLine][0] &&
              id < lineRangeMap[selectedLine][1]
            );
          })
          .map(([, flow]) => flow)
      ),
    }))
    .slice(-6);
  const lineFlowAddList = lineFlowList.map((item, index) => ({
    time: standardTime(new Date(new Date(item.time).getTime() + 1000 * 60 * 6)),
    flow: predictlineFlowList[index],
  }));
  const stationFlowListAll = lineFlowList.concat(lineFlowAddList);
  const result = {
    [eitherInOut === "inflow" ? "flowIn" : "flowOut"]: stationFlowListAll,
  };
  return result;
}
