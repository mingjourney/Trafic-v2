import React, { useCallback, useEffect, useRef } from "react";
import * as echarts from "echarts";
import useWindowSize from "../../useWindowSize";
import "./index.css";
import { HistoryFlowDataProvider } from "../FlowProvider/HistoryFlowProvider";
const chartStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
};

const FlowChartHistory = ({
  station,
  dateRange,
  eitherInOut,
  mapType,
  style,
  dataProvider,
}: {
  station: string;
  dateRange: [string, string];
  eitherInOut: string;
  mapType: string;
  style: React.CSSProperties;
  dataProvider: HistoryFlowDataProvider;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const windowSize = useWindowSize();

  const renderChart = useCallback(
    (flowData: {
      flowIn: { time: string; flow: number }[];
      flowOut: { time: string; flow: number }[];
    }) => {
      if (!ref.current) return;
      const chart =
        echarts.getInstanceByDom(ref.current) ?? echarts.init(ref.current);
      const key = eitherInOut === "inflow" ? "flowIn" : "flowOut";
      chart.setOption({
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "5%",
          right: "5%",
          top: "10%",
          bottom: "4%",
          containLabel: true,
        },

        xAxis: {
          type: "category",
          boundaryGap: false,
          data: flowData[key].map((e) => e.time),
          show: false,
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: "rgba(0,0,0,0.75)",
          },
          splitLine: {
            lineStyle: {
              color: "#205864",
            },
          },
        },
        series: [
          {
            data: flowData[key].map((e) => e.flow),
            showSymbol: false,
            type: "line",
            itemStyle: {
              normal: {
                lineStyle: {
                  width: 0.7,
                },
              },
            },
            lineStyle: {
              color: "",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: "#215f75",
                },
                {
                  offset: 1,
                  color: "#8fbec7",
                },
              ]),
            },
          },
        ],
      });
    },
    [eitherInOut]
  );
  //获取数据
  useEffect(() => {
    // const data = {
    //   flowIn: [
    //     { time: "2021-12-1", flow: 117 },
    //     { time: "2021-12-2", flow: 101 },
    //     { time: "2021-12-3", flow: 328 },
    //     { time: "2021-12-4", flow: 168 },
    //     { time: "2021-12-5", flow: 257 },
    //     { time: "2021-12-6", flow: 393 },
    //     { time: "2021-12-7", flow: 358 },
    //     { time: "2021-12-8", flow: 311 },
    //     { time: "2021-12-9", flow: 167 },
    //     { time: "2021-12-10", flow: 324 },
    //     { time: "2021-12-11", flow: 313 },
    //     { time: "2021-12-12", flow: 127 },
    //     { time: "2021-12-13", flow: 182 },
    //     { time: "2021-12-14", flow: 311 },
    //     { time: "2021-12-15", flow: 111 },
    //     { time: "2021-12-16", flow: 384 },
    //     { time: "2021-12-17", flow: 304 },
    //     { time: "2021-12-18", flow: 352 },
    //     { time: "2021-12-19", flow: 134 },
    //     { time: "2021-12-20", flow: 107 },
    //     { time: "2021-12-21", flow: 332 },
    //     { time: "2021-12-22", flow: 142 },
    //     { time: "2021-12-23", flow: 190 },
    //     { time: "2021-12-24", flow: 386 },
    //     { time: "2021-12-25", flow: 398 },
    //     { time: "2021-12-26", flow: 295 },
    //     { time: "2021-12-27", flow: 205 },
    //     { time: "2021-12-28", flow: 128 },
    //     { time: "2021-12-29", flow: 267 },
    //   ],
    //   flowOut: [
    //     { time: "2021-12-1", flow: 188 },
    //     { time: "2021-12-2", flow: 166 },
    //     { time: "2021-12-3", flow: 153 },
    //     { time: "2021-12-4", flow: 148 },
    //     { time: "2021-12-5", flow: 219 },
    //     { time: "2021-12-6", flow: 124 },
    //     { time: "2021-12-7", flow: 294 },
    //     { time: "2021-12-8", flow: 233 },
    //     { time: "2021-12-9", flow: 256 },
    //     { time: "2021-12-10", flow: 227 },
    //     { time: "2021-12-11", flow: 248 },
    //     { time: "2021-12-12", flow: 245 },
    //     { time: "2021-12-13", flow: 373 },
    //     { time: "2021-12-14", flow: 353 },
    //     { time: "2021-12-15", flow: 123 },
    //     { time: "2021-12-16", flow: 149 },
    //     { time: "2021-12-17", flow: 188 },
    //     { time: "2021-12-18", flow: 153 },
    //     { time: "2021-12-19", flow: 246 },
    //     { time: "2021-12-20", flow: 200 },
    //     { time: "2021-12-21", flow: 188 },
    //     { time: "2021-12-22", flow: 133 },
    //     { time: "2021-12-23", flow: 386 },
    //     { time: "2021-12-24", flow: 301 },
    //     { time: "2021-12-25", flow: 156 },
    //     { time: "2021-12-26", flow: 142 },
    //     { time: "2021-12-27", flow: 150 },
    //     { time: "2021-12-28", flow: 225 },
    //     { time: "2021-12-29", flow: 245 },
    //   ],
    // };
    dataProvider(station, eitherInOut, mapType, dateRange).then((data) => {
      renderChart(data);
    });
  }, [station, mapType, dateRange, eitherInOut, renderChart, dataProvider]);

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

export default FlowChartHistory;
