export async function sectionFlowProvider(
  state: any,
  station: string,
  eitherInOut: string
): Promise<any> {
  const sectionAllTime = state.section_flow;
  const allTime = Object.keys(sectionAllTime);
  if (allTime.length < 2) {
    return [];
  }
  allTime.sort();
  const sections = sectionAllTime[allTime[allTime.length - 2]];
  const result = Object.keys(sections).map((section: string) => ({
    section,    
    flow: +sections[section],
  }));
  return result;
}
