import { standardTime } from "../../Utils/standardTime";
export async function stationFlowProvider(
  state: any,
  selectedStation: string, //"0","1"-"80"
  eitherInOut: string
): Promise<any> {
  const stationsAllTime =
    eitherInOut === "inflow" ? state.station_flow_in : state.station_flow_out;

  const stationsPredictTime =
    eitherInOut === "inflow"
      ? state.station_flow_in_predict
      : state.station_flow_out_predict;

  const predictFlowList: Array<number> = stationsPredictTime.map(
    (item: Array<string>) => Number(item[Number(selectedStation)])
  );
  const stationFlowList = Object.entries(stationsAllTime)
    .sort(([LTime], [NTime]) => (LTime > NTime ? 1 : -1))
    .map(([time, v]) => ({
      time,
      flow: Number((v as any)?.[selectedStation] ?? 0),
    }))
    .slice(-6);
  const stationFlowAddList = stationFlowList.map((e, index) => ({
    time: standardTime(new Date(new Date(e.time).getTime() + 1000 * 60 * 6)),
    flow: predictFlowList[index],
  }));
  const stationFlowListAll = stationFlowList.concat(stationFlowAddList);
  const result = {
    [eitherInOut === "inflow" ? "flowIn" : "flowOut"]: stationFlowListAll,
  };
  return result;
}
