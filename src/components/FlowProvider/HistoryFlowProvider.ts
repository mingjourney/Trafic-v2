export type HistoryFlowDataProvider = (
  station: string,
  eitherInOut: string,
  mapType: string,
  dateRange: [string, string]
) => Promise<any>;
