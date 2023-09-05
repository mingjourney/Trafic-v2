import { standardTime } from "../../Utils/standardTime";

const eitherInOutMap: any = { inflow: 0, outflow: 1 };

export async function totalFlowProvider(
  state: any,
  selectedLine: string,
  eitherInOut: string
): Promise<any> {
  const stationsAllTime =
    eitherInOut === "inflow" ? state.station_flow_in : state.station_flow_out;
  const predictFlowList = state.total_flow_predict;
  const selectedIndex = eitherInOutMap[eitherInOut];
  const predictTotalFlowList = predictFlowList.map(
    (item: any) => item[selectedIndex]
  );
  const sum = (arr: Array<any>) =>
    arr.reduce((prev, curr) => Number(prev) + Number(curr)); // sum自己处理好
  const lineFlowList = Object.entries(stationsAllTime)
    .sort(([LTime], [NTime]) => (LTime > NTime ? 1 : -1))
    .map(([time, v]) => {
      const sumList = sum(Object.values(v as any));
      return {
        time,
        flow: sumList,
      };
    })
    .slice(-6);

  const lineFlowAddList = lineFlowList.map((item, index) => ({
    time: standardTime(
      new Date(new Date(item.time).getTime() + 1000 * 60 * 6)
    ),
    flow: predictTotalFlowList[index],
  }));
  const stationFlowListAll = lineFlowList.concat(lineFlowAddList);
  const result = {
    [eitherInOut === "inflow" ? "flowIn" : "flowOut"]: stationFlowListAll,
  };
  return result;
}
