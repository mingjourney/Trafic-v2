import { request } from "graphql-request";

const fetcher = (query: string) => request("/api/graphql/", query);

const mapping: any = {
  "day": 0,
  "morning": 1,
  "evening": 2,
};

const getQueryString = (mapType: string, start: string, end: string) =>
  `{
    sectionFlow(dateRange: {start: "${start}", end: "${end}"}, timeType: ${mapping[mapType]}) {
      section
      flow
    }
  }`;

export async function sectionHistoryFlowProvider(
  station: string,
  eitherInOut: string,
  mapType: string,
  dateRange: [string, string]
): Promise<any> {
  const query = getQueryString(mapType, ...dateRange);
  const data = await fetcher(query);
  return data.sectionFlow;
}
