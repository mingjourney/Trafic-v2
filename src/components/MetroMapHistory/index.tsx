import React, { useCallback, useEffect, useRef } from "react";
import * as echarts from "echarts";
import {
  commonStationData,
  transferStationData,
  links,
  lineLabelData,
  subNameObj,
} from "../MetroMap/MetroMapData";
import useWindowSize from "../../useWindowSize";
import { HistoryFlowDataProvider } from "../FlowProvider/HistoryFlowProvider";

commonStationData.forEach((obj: any) => {
  Object.assign(obj, {
    symbol: "circle",
    symbolSize: [6, 6],
    label: {
      color: "rgba(0,0,0,0.75)",
      position: "bottom",
      fontSize: 10,
      fontWeight: 100,
      rotate: 0,
      padding: -4,
    },
    fixed: true,
    category: 2,
    itemStyle: {
      normal: {
        color: "rgba(0,0,0,0.4)",
      },
    },
  });
});
transferStationData.forEach((obj: any) => {
  Object.assign(obj, {
    symbol: "circle",
    symbolSize: [8, 8],
    label: {
      color: "rgba(0,0,0,0.95)",
      position: "bottom",
      fontSize: 10,
      rotate: 0,
      padding: -4,
    },
    fixed: true,
    category: 2,
    itemStyle: {
      normal: {
        color: "rgba(65,252,0,0.5)",
      },
    },
  });
});
lineLabelData.forEach((obj) => {
  Object.assign(obj, {
    tooltip: {},
    symbolSize: 0,
    fixed: true,
    category: 1,
    itemStyle: {
      normal: {
        color: "rgba(0,0,0,0)",
      },
    },
  });
});
const data = [...commonStationData, ...transferStationData];
const chartStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
};
const MetroMapHistory = ({
  dateRange,
  eitherInOut,
  selectedStation,
  mapType,
  style,
  changeSelectStation,
  changeSelectFlowRange,
  stationsFlowDataProvider,
  sectionFlowDataProvider,
}: {
  dateRange: [string, string];
  eitherInOut: string;
  mapType: any;
  style?: React.CSSProperties;
  selectedStation: any;
  changeSelectStation: any;
  changeSelectFlowRange: any;
  stationsFlowDataProvider: HistoryFlowDataProvider;
  sectionFlowDataProvider: HistoryFlowDataProvider;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // const [selectedStation,changeSelectStation] = useState("Sta1");

  const windowSize = useWindowSize();

  const renderChart = useCallback(
    (stationsFlowData: any, sectionFlowData: any) => {
      if (!ref.current) return;
      let chart = echarts.getInstanceByDom(ref.current);
      if (!chart) {
        chart = echarts.init(ref.current);
        chart.on("click", "series", (params: any) => {
          if (params.seriesType === "graph" && params.dataType === "node") {
            if (params.componentSubType === "scatter") {
              if (changeSelectStation) {
                changeSelectStation(params.id);
              }
            } else if (params.componentSubType === "graph") {
              changeSelectFlowRange("Line Flow");
              // change selected line
              console.log(`${params.name} selected`);
              changeSelectStation(params.name);
            }
          } else if (params.seriesType === "scatter") {
            changeSelectFlowRange("Station Flow");
            if (changeSelectStation) {
              console.log(params.data[3]);
              // changeSelectStation(subNameObj[params.data[3]]);SubName
              changeSelectStation(params.data[3]);
            }
          }
        });
      }
      const keyIO = eitherInOut === "inflow" ? "flowIn" : "flowOut";
      const sum = stationsFlowData.reduce(
        (total: number, e: any) => total + e[keyIO],
        0
      );
      const sectionFlowMap = Object.fromEntries(
        sectionFlowData.map((e: any) => [e.section, e.flow])
      ); // nota bene
      chart.setOption({
        backgroundColor: "#f9f9f9",
        grid: {
          left: "2%",
          right: "2%",
          top: "2%",
          bottom: "2%",
          containLabel: true,
        },
        xAxis: {
          show: false,
          min: 0,
          max: 450,
          axisPointer: {
            show: false,
          },
        },
        yAxis: {
          show: false,
          min: 0,
          max: 360,
          axisPointer: {
            show: false,
          },
        },
        dataZoom: [
          {
            type: "inside",
            xAxisIndex: [0],
            start: 0,
            end: 100,
            moveOnMouseMove: true,
          },
          {
            type: "inside",
            yAxisIndex: [0],
            start: 0,
            end: 100,
            moveOnMouseMove: true,
          },
        ],
        tooltip: {
          show: false,
        },
        series: [
          {
            id: "stations",
            type: "graph",
            draggable: false,
            coordinateSystem: "cartesian2d",
            symbol: "rect",
            symbolOffset: ["15%", 0],
            label: {
              normal: {
                show: false,
              },
            },
            labelLayout: {
              hideOverlap: true,
            },
            data: data.map((e) =>
              Object.assign({}, e, {
                itemStyle: {
                  normal: {
                    color:
                      e.id === selectedStation
                        ? "#f00"
                        : e.itemStyle.normal.color,
                  },
                },
              })
            ),
            links: links.map((e) =>
              Object.assign({}, e, {
                lineStyle: {
                  normal: {
                    color: e.lineStyle.normal.color,
                    width:
                      1 +
                      (0.3 *
                        Math.log(
                          1 + (sectionFlowMap[`${e.source}-${e.target}`] ?? 0)
                        )) **
                        2,
                  },
                },
              })
            ),
            lineStyle: {
              normal: {
                opacity: 0.6,
                curveness: 0,
                width: 2,
              },
            },
          },
          {
            type: "graph",
            draggable: false,
            coordinateSystem: "cartesian2d",
            symbol: "rect",
            symbolOffset: ["15%", 0],
            label: {
              show: true,
            },
            data: lineLabelData,
          },
          {
            type: "scatter",
            data: stationsFlowData.map((e: any) => {
              const station: any = data.find((s) => s.id === e.station);
              return [...station.value, e[keyIO], e.station];
            }),
            symbolSize: (data: number[]) => {
              return Math.sqrt((data[2] / sum) * 3000) * 3;
            },
            itemStyle: {
              color: (params: any) => {
                if (params.value[3] === selectedStation) {
                  return "#f00";
                }
                if (
                  transferStationData.find((e: any) => e.id === params.value[3])
                ) {
                  return new echarts.graphic.RadialGradient(0.5, 0.5, 0.5, [
                    {
                      offset: 0,
                      color: "rgba(76,155,166,0.4)",
                    },
                    {
                      offset: 1,
                      color: "rgba(76,155,166,1)",
                    },
                  ]);
                }
                return new echarts.graphic.RadialGradient(0.5, 0.5, 0.5, [
                  {
                    offset: 0,
                    color: "rgba(153,138,105,0.3)",
                  },
                  {
                    offset: 1,
                    color: "rgba(153,138,105,0.8)",
                  },
                ]);
              },
            },
          },
        ],
      });
    },
    [eitherInOut, selectedStation, changeSelectFlowRange, changeSelectStation]
  );
  //获取数据
  useEffect(() => {
    // const data = {
    //   allStationsFlow: [
    //     { station: "1", flowIn: 921, flowOut: 4898 },
    //     { station: "2", flowIn: 3517, flowOut: 5029 },
    //     { station: "3", flowIn: 2546, flowOut: 4234 },
    //     { station: "4", flowIn: 5585, flowOut: 5206 },
    //     { station: "5", flowIn: 1588, flowOut: 88 },
    //     { station: "6", flowIn: 4558, flowOut: 783 },
    //     { station: "7", flowIn: 3374, flowOut: 1468 },
    //     { station: "8", flowIn: 239, flowOut: 4113 },
    //     { station: "9", flowIn: 1469, flowOut: 4497 },
    //     { station: "10", flowIn: 2805, flowOut: 358 },
    //     { station: "11", flowIn: 3151, flowOut: 5344 },
    //     { station: "12", flowIn: 4556, flowOut: 4335 },
    //     { station: "13", flowIn: 1867, flowOut: 1923 },
    //     { station: "14", flowIn: 3071, flowOut: 1808 },
    //     { station: "15", flowIn: 5377, flowOut: 3553 },
    //     { station: "16", flowIn: 5733, flowOut: 3853 },
    //     { station: "17", flowIn: 3520, flowOut: 2115 },
    //     { station: "18", flowIn: 694, flowOut: 2089 },
    //     { station: "19", flowIn: 1109, flowOut: 3393 },
    //     { station: "20", flowIn: 4280, flowOut: 5809 },
    //     { station: "21", flowIn: 1084, flowOut: 1914 },
    //     { station: "22", flowIn: 1908, flowOut: 468 },
    //     { station: "23", flowIn: 3313, flowOut: 4363 },
    //     { station: "24", flowIn: 378, flowOut: 74 },
    //     { station: "25", flowIn: 2523, flowOut: 4146 },
    //     { station: "26", flowIn: 1777, flowOut: 4584 },
    //     { station: "27", flowIn: 5048, flowOut: 342 },
    //     { station: "28", flowIn: 3538, flowOut: 838 },
    //     { station: "29", flowIn: 3570, flowOut: 3411 },
    //     { station: "30", flowIn: 717, flowOut: 1231 },
    //     { station: "31", flowIn: 5372, flowOut: 2966 },
    //     { station: "32", flowIn: 772, flowOut: 2751 },
    //     { station: "33", flowIn: 2402, flowOut: 4575 },
    //     { station: "34", flowIn: 1897, flowOut: 1720 },
    //     { station: "35", flowIn: 4531, flowOut: 1717 },
    //     { station: "36", flowIn: 2675, flowOut: 4941 },
    //     { station: "37", flowIn: 4783, flowOut: 2963 },
    //     { station: "38", flowIn: 502, flowOut: 512 },
    //     { station: "39", flowIn: 54, flowOut: 1758 },
    //     { station: "40", flowIn: 2749, flowOut: 4068 },
    //     { station: "41", flowIn: 4026, flowOut: 291 },
    //     { station: "42", flowIn: 3542, flowOut: 3542 },
    //     { station: "43", flowIn: 195, flowOut: 4815 },
    //     { station: "44", flowIn: 303, flowOut: 3515 },
    //     { station: "45", flowIn: 876, flowOut: 178 },
    //     { station: "46", flowIn: 1473, flowOut: 1058 },
    //     { station: "47", flowIn: 3059, flowOut: 2060 },
    //     { station: "48", flowIn: 3154, flowOut: 157 },
    //     { station: "49", flowIn: 522, flowOut: 2908 },
    //     { station: "50", flowIn: 2260, flowOut: 5585 },
    //     { station: "51", flowIn: 1100, flowOut: 4781 },
    //     { station: "52", flowIn: 5049, flowOut: 3817 },
    //     { station: "53", flowIn: 2418, flowOut: 2405 },
    //     { station: "54", flowIn: 2155, flowOut: 4574 },
    //     { station: "55", flowIn: 353, flowOut: 3016 },
    //     { station: "56", flowIn: 4995, flowOut: 2744 },
    //     { station: "57", flowIn: 2817, flowOut: 3333 },
    //     { station: "58", flowIn: 4412, flowOut: 1964 },
    //     { station: "59", flowIn: 4826, flowOut: 2998 },
    //     { station: "60", flowIn: 2259, flowOut: 4613 },
    //     { station: "61", flowIn: 5386, flowOut: 3049 },
    //     { station: "62", flowIn: 4062, flowOut: 757 },
    //     { station: "63", flowIn: 1219, flowOut: 3715 },
    //     { station: "64", flowIn: 283, flowOut: 3466 },
    //     { station: "65", flowIn: 1761, flowOut: 5771 },
    //     { station: "66", flowIn: 2481, flowOut: 5354 },
    //     { station: "67", flowIn: 3834, flowOut: 5709 },
    //     { station: "68", flowIn: 5498, flowOut: 4863 },
    //     { station: "69", flowIn: 3622, flowOut: 2529 },
    //     { station: "70", flowIn: 4258, flowOut: 5021 },
    //     { station: "71", flowIn: 1323, flowOut: 2640 },
    //     { station: "72", flowIn: 801, flowOut: 2940 },
    //     { station: "73", flowIn: 1364, flowOut: 3221 },
    //     { station: "74", flowIn: 4936, flowOut: 3856 },
    //     { station: "75", flowIn: 4751, flowOut: 1527 },
    //     { station: "76", flowIn: 562, flowOut: 1999 },
    //     { station: "77", flowIn: 3880, flowOut: 1000 },
    //     { station: "78", flowIn: 5419, flowOut: 4842 },
    //     { station: "79", flowIn: 4118, flowOut: 1930 },
    //     { station: "80", flowIn: 5255, flowOut: 4698 },
    //   ],
    // };
    Promise.all([
      stationsFlowDataProvider("", eitherInOut, mapType, dateRange),
      sectionFlowDataProvider("", eitherInOut, mapType, dateRange),
    ]).then(([stationsFlowData, sectionFlowData]) => {
      renderChart(stationsFlowData, sectionFlowData);
    });
  }, [dateRange, eitherInOut, renderChart, selectedStation, mapType]);
  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.getInstanceByDom(ref.current);
    if (!chart) return;
    setTimeout(() => {
      chart.resize();
    }, 3);
  }, [windowSize]);
  return <div ref={ref} style={Object.assign({}, chartStyle, style)}></div>;
};

export default MetroMapHistory;
