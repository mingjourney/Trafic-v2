import { request } from "graphql-request";

const fetcher = (query: string) => request("/api/graphql/", query);

const mapping: any = {
  "day": 0,
  "morning": 1,
  "evening": 2,
};

const getQueryString = (eitherInOut: string, mapType: string, start: string, end: string) =>
  `{
    allStationsFlow(dateRange: {start: "${start}", end: "${end}"}, timeType: ${mapping[mapType]}) {
      station
      ${eitherInOut === "inflow" ? "flowIn" : "flowOut"}
    }
  }`;

export async function allStationsHistoryFlowProvider(
  station: string,
  eitherInOut: string,
  mapType: string,
  dateRange: [string, string]
): Promise<any> {
  const query = getQueryString(eitherInOut, mapType, ...dateRange);
  const data = await fetcher(query);
  return data.allStationsFlow;
}
