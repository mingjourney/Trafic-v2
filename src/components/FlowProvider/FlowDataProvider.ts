export type FlowDataProvider = (
  state: any,
  station: string,
  eitherInOut: string
) => Promise<any>;
