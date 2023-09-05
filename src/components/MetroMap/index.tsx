import React, { useCallback, useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import {
  commonStationData,
  transferStationData,
  links,
  lineLabelData,
  subNameObj, // id -> 站点名集合
} from "./MetroMapData";
import useWindowSize from "../../useWindowSize";
import { FlowDataProvider } from "../FlowProvider/FlowDataProvider";
import { useSelector } from "react-redux";

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
const MetroMap = ({
  dateRange,
  eitherInOut,
  selectedStation,
  style,
  changeSelectStation,
  changeSelectFlowRange,
  stationsFlowDataProvider,
  sectionFlowDataProvider
}: {
  dateRange: [string, string];
  eitherInOut: string;
  style?: React.CSSProperties;
  selectedStation: any;
  changeSelectStation: any;
  changeSelectFlowRange: any;
  stationsFlowDataProvider: FlowDataProvider;
  sectionFlowDataProvider: FlowDataProvider;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // const [selectedStation,changeSelectStation] = useState("Sta1");

  const windowSize = useWindowSize();

  const state = useSelector((state: any) => state.state);

  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

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
              return Math.sqrt((data[2] / sum) * 1000) * 2;
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
    [eitherInOut, selectedStation, changeSelectStation, changeSelectFlowRange]
  );
  //获取数据
  useEffect(() => {
    // const data = {
    //   allStationsFlow: [
    //     { station: "1", flowIn: 2644, flowOut: 5618 },
    //     { station: "2", flowIn: 2758, flowOut: 5556 },
    //     { station: "3", flowIn: 4640, flowOut: 4879 },
    //     { station: "4", flowIn: 1147, flowOut: 2092 },
    //     { station: "5", flowIn: 1364, flowOut: 5358 },
    //     { station: "6", flowIn: 985, flowOut: 623 },
    //     { station: "7", flowIn: 3785, flowOut: 519 },
    //     { station: "8", flowIn: 5194, flowOut: 4609 },
    //     { station: "9", flowIn: 5265, flowOut: 1214 },
    //     { station: "10", flowIn: 4115, flowOut: 233 },
    //     { station: "11", flowIn: 3521, flowOut: 4239 },
    //     { station: "12", flowIn: 1644, flowOut: 4144 },
    //     { station: "13", flowIn: 5647, flowOut: 637 },
    //     { station: "14", flowIn: 3642, flowOut: 5741 },
    //     { station: "15", flowIn: 5574, flowOut: 1461 },
    //     { station: "16", flowIn: 3463, flowOut: 3466 },
    //     { station: "17", flowIn: 466, flowOut: 2590 },
    //     { station: "18", flowIn: 2994, flowOut: 836 },
    //     { station: "19", flowIn: 1342, flowOut: 4953 },
    //     { station: "20", flowIn: 5785, flowOut: 3024 },
    //     { station: "21", flowIn: 4064, flowOut: 131 },
    //     { station: "22", flowIn: 4399, flowOut: 1337 },
    //     { station: "23", flowIn: 2271, flowOut: 4393 },
    //     { station: "24", flowIn: 831, flowOut: 4652 },
    //     { station: "25", flowIn: 2540, flowOut: 3355 },
    //     { station: "26", flowIn: 2255, flowOut: 5583 },
    //     { station: "27", flowIn: 5579, flowOut: 3600 },
    //     { station: "28", flowIn: 2648, flowOut: 691 },
    //     { station: "29", flowIn: 5292, flowOut: 1733 },
    //     { station: "30", flowIn: 1489, flowOut: 2842 },
    //     { station: "31", flowIn: 5046, flowOut: 1079 },
    //     { station: "32", flowIn: 1962, flowOut: 2372 },
    //     { station: "33", flowIn: 4633, flowOut: 3184 },
    //     { station: "34", flowIn: 3327, flowOut: 3143 },
    //     { station: "35", flowIn: 4272, flowOut: 3483 },
    //     { station: "36", flowIn: 928, flowOut: 3987 },
    //     { station: "37", flowIn: 3548, flowOut: 1535 },
    //     { station: "38", flowIn: 288, flowOut: 87 },
    //     { station: "39", flowIn: 1809, flowOut: 2535 },
    //     { station: "40", flowIn: 3983, flowOut: 3721 },
    //     { station: "41", flowIn: 5354, flowOut: 4629 },
    //     { station: "42", flowIn: 3003, flowOut: 1216 },
    //     { station: "43", flowIn: 3584, flowOut: 4296 },
    //     { station: "44", flowIn: 4614, flowOut: 968 },
    //     { station: "45", flowIn: 1315, flowOut: 2654 },
    //     { station: "46", flowIn: 1789, flowOut: 4796 },
    //     { station: "47", flowIn: 1840, flowOut: 385 },
    //     { station: "48", flowIn: 4844, flowOut: 510 },
    //     { station: "49", flowIn: 2737, flowOut: 1854 },
    //     { station: "50", flowIn: 4343, flowOut: 2270 },
    //     { station: "51", flowIn: 4932, flowOut: 1473 },
    //     { station: "52", flowIn: 5755, flowOut: 3176 },
    //     { station: "53", flowIn: 3475, flowOut: 1867 },
    //     { station: "54", flowIn: 3714, flowOut: 2394 },
    //     { station: "55", flowIn: 5771, flowOut: 20 },
    //     { station: "56", flowIn: 5600, flowOut: 4477 },
    //     { station: "57", flowIn: 1896, flowOut: 1326 },
    //     { station: "58", flowIn: 1106, flowOut: 1899 },
    //     { station: "59", flowIn: 4618, flowOut: 4123 },
    //     { station: "60", flowIn: 1451, flowOut: 83 },
    //     { station: "61", flowIn: 1222, flowOut: 5814 },
    //     { station: "62", flowIn: 1730, flowOut: 5794 },
    //     { station: "63", flowIn: 2953, flowOut: 343 },
    //     { station: "64", flowIn: 2515, flowOut: 1339 },
    //     { station: "65", flowIn: 4282, flowOut: 4784 },
    //     { station: "66", flowIn: 3136, flowOut: 136 },
    //     { station: "67", flowIn: 1174, flowOut: 4035 },
    //     { station: "68", flowIn: 4163, flowOut: 1354 },
    //     { station: "69", flowIn: 1616, flowOut: 3851 },
    //     { station: "70", flowIn: 2165, flowOut: 5779 },
    //     { station: "71", flowIn: 4800, flowOut: 1206 },
    //     { station: "72", flowIn: 5554, flowOut: 5753 },
    //     { station: "73", flowIn: 4152, flowOut: 1970 },
    //     { station: "74", flowIn: 3212, flowOut: 3506 },
    //     { station: "75", flowIn: 1518, flowOut: 4392 },
    //     { station: "76", flowIn: 3541, flowOut: 1831 },
    //     { station: "77", flowIn: 4760, flowOut: 1554 },
    //     { station: "78", flowIn: 5783, flowOut: 2449 },
    //     { station: "79", flowIn: 3187, flowOut: 2450 },
    //     { station: "80", flowIn: 5361, flowOut: 4627 },
    //   ],
    // };
    if (Date.now() - lastUpdateTime < 1000 * 1) return;
    setLastUpdateTime(Date.now());
    Promise.all([
      stationsFlowDataProvider(state, "", eitherInOut),
      sectionFlowDataProvider(state, "", eitherInOut),
    ]).then(([stationsFlowData, sectionFlowData]) => {
      renderChart(stationsFlowData, sectionFlowData);
    });
  }, [dateRange, eitherInOut, lastUpdateTime, renderChart, sectionFlowDataProvider, selectedStation, state, stationsFlowDataProvider]);
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

export default MetroMap;
