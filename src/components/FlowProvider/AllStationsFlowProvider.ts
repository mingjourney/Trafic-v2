export async function allStationsFlowProvider(
  state: any,
  station: string,
  eitherInOut: string
): Promise<any> {
  const stationsAllTime =
    eitherInOut === "inflow" ? state.station_flow_in : state.station_flow_out;
  const allTime = Object.keys(stationsAllTime);
  if (allTime.length < 2) {
    return [];
  }
  allTime.sort();
  const stations = stationsAllTime[allTime[allTime.length - 1]];
  const result = Object.keys(stations).map((stationName: string) => ({
    station: stationName,
    [eitherInOut === "inflow" ? "flowIn" : "flowOut"]: +stations[stationName],
  }));
  return result;
}
