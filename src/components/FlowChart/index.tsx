import React, { useCallback, useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import useWindowSize from "../../useWindowSize";
import "./index.css";
import { FlowDataProvider } from "../FlowProvider/FlowDataProvider";
import { useSelector } from "react-redux";
const chartStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
};
const FlowChart = ({
  station,
  eitherInOut,
  style,
  dataProvider,
}: {
  station: string;
  eitherInOut: string;
  style: React.CSSProperties;
  dataProvider: FlowDataProvider;
}) => {
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  const ref = useRef<HTMLDivElement>(null);

  const windowSize = useWindowSize();

  const state = useSelector((state: any) => state.state);

  const renderChart = useCallback(
    (flowData: {
      flowIn: { time: string; flow: number }[];
      flowOut: { time: string; flow: number }[];
    }) => {
      if (!ref.current) return;
      const chart =
        echarts.getInstanceByDom(ref.current) ?? echarts.init(ref.current);
      const key = eitherInOut === "inflow" ? "flowIn" : "flowOut";
      const markTime = flowData[key][flowData[key].length - 7]?.time ?? "";
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
              color: "#666",
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
              color: "#",
            },
            markLine: {
              label: {
                formatter: `now : ${markTime && markTime.split(" ")[1].split(":").slice(0, 2).join(":")}`,
              },
              data: [
                {
                  name: "now",
                  xAxis: markTime,
                  lineStyle: {
                    width: 1.3,
                    color: "#4395a6",
                  },
                },
              ],
              silent: true,
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: "rgba(225, 185, 210,0.4)",
                },
                {
                  offset: 1,
                  color: "rgba(45, 67, 122,0.7)",
                },
              ]),
            },
          },
        ],
      });
    },
    [eitherInOut]
  );
  useEffect(() => {
    // const data = {
    //   flowIn: [
    //     { time: "2021-12-1", flow: 218 },
    //     { time: "2021-12-2", flow: 378 },
    //     { time: "2021-12-3", flow: 193 },
    //     { time: "2021-12-4", flow: 263 },
    //     { time: "2021-12-5", flow: 254 },
    //     { time: "2021-12-6", flow: 310 },
    //     { time: "2021-12-7", flow: 215 },
    //     { time: "2021-12-8", flow: 200 },
    //     { time: "2021-12-9", flow: 225 },
    //     { time: "2021-12-10", flow: 354 },
    //     { time: "2021-12-11", flow: 373 },
    //     { time: "2021-12-12", flow: 260 },
    //     { time: "2021-12-13", flow: 263 },
    //     { time: "2021-12-14", flow: 198 },
    //     { time: "2021-12-15", flow: 355 },
    //     { time: "2021-12-16", flow: 156 },
    //     { time: "2021-12-17", flow: 160 },
    //     { time: "2021-12-18", flow: 293 },
    //     { time: "2021-12-19", flow: 289 },
    //     { time: "2021-12-20", flow: 375 },
    //     { time: "2021-12-21", flow: 319 },
    //     { time: "2021-12-22", flow: 253 },
    //     { time: "2021-12-23", flow: 217 },
    //     { time: "2021-12-24", flow: 305 },
    //     { time: "2021-12-25", flow: 198 },
    //     { time: "2021-12-26", flow: 259 },
    //     { time: "2021-12-27", flow: 239 },
    //     { time: "2021-12-28", flow: 142 },
    //     { time: "2021-12-29", flow: 363 },
    //   ],
    //   flowOut: [
    //     { time: "2021-12-1", flow: 154 },
    //     { time: "2021-12-2", flow: 177 },
    //     { time: "2021-12-3", flow: 371 },
    //     { time: "2021-12-4", flow: 373 },
    //     { time: "2021-12-5", flow: 154 },
    //     { time: "2021-12-6", flow: 372 },
    //     { time: "2021-12-7", flow: 200 },
    //     { time: "2021-12-8", flow: 130 },
    //     { time: "2021-12-9", flow: 133 },
    //     { time: "2021-12-10", flow: 202 },
    //     { time: "2021-12-11", flow: 246 },
    //     { time: "2021-12-12", flow: 280 },
    //     { time: "2021-12-13", flow: 150 },
    //     { time: "2021-12-14", flow: 291 },
    //     { time: "2021-12-15", flow: 395 },
    //     { time: "2021-12-16", flow: 391 },
    //     { time: "2021-12-17", flow: 299 },
    //     { time: "2021-12-18", flow: 395 },
    //     { time: "2021-12-19", flow: 147 },
    //     { time: "2021-12-20", flow: 147 },
    //     { time: "2021-12-21", flow: 376 },
    //     { time: "2021-12-22", flow: 310 },
    //     { time: "2021-12-23", flow: 153 },
    //     { time: "2021-12-24", flow: 216 },
    //     { time: "2021-12-25", flow: 321 },
    //     { time: "2021-12-26", flow: 313 },
    //     { time: "2021-12-27", flow: 346 },
    //     { time: "2021-12-28", flow: 395 },
    //     { time: "2021-12-29", flow: 102 },
    //   ],
    // };
    if (Date.now() - lastUpdateTime < 1000 * 1) return;
    setLastUpdateTime(Date.now());
    dataProvider(state, station, eitherInOut).then((data) => {
      renderChart(data);
    });
  }, [station, eitherInOut, renderChart, dataProvider, state, lastUpdateTime]);

  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.getInstanceByDom(ref.current);
    if (!chart) return;
    setTimeout(() => {
      chart.resize();
    }, 3);
  }, [windowSize]);
  return <div ref={ref} style={Object.assign({}, chartStyle, style)}>
  </div>;
};

export default FlowChart;
