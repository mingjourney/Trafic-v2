import { request } from "graphql-request";

const fetcher = (query: string) => request("/api/graphql/", query);

const mapping: any = {
  "day": 0,
  "morning": 1,
  "evening": 2,
};

const getQueryString = (line: string, eitherInOut: string, mapType: string, start: string, end: string) =>
   `{
      lineFlow(line: "${line}", dateRange: {start: "${start}", end: "${end}"}, timeType: ${mapping[mapType]}) {
        ${eitherInOut === "inflow" ? "flowIn" : "flowOut"} {
          time
          flow
        }
      }
    }`;;

export async function lineHistoryFlowProvider(
  station: string,
  eitherInOut: string,
  mapType: string,
  dateRange: [string, string]
): Promise<any> {
  const query = getQueryString(station, eitherInOut, mapType, ...dateRange);
  const data = await fetcher(query);
  return data.lineFlow;
}
