import { useState, useEffect, Fragment, useCallback, useRef } from "react";
import moment from "moment";
import Header from "./components/Header";
import MainDataArea from "./components/MainDataArea";
import SplitBar from "./components/SplitBar";
import useWindowSize from "./useWindowSize";
import LikeDataArea from "./components/LikeDataArea";
import { subNameObj } from "./components/MetroMap/MetroMapData";
import html2canvas from "html2canvas";
import { useDispatch } from "react-redux";
import { slice } from "./redux/slice";
import './App.css'

export default function App() {
  const dispatch = useDispatch();
  const [timeCategory, setTimeCategory] = useState("realTime");
  const [flowCategory, setFlowCategory] = useState("inflow");
  const [mapType, setMapType] = useState("day");
  const [selectFlowRange, setSelectFlowRange] = useState("Total Flow");
  const [selectDay, setSelectDay] = useState(["2020-07-07", "2020-07-12"] as [
    string,
    string
  ]);
  const defaultDayValue = moment("");
  const [selectedStation, setSelectedStation] = useState("");
  const [focusStation, setFocusStation] = useState([
    { subId: "2" },
    { subId: "3" },
    { subId: "5" },
    { subId: "6" },
    { subId: "7" },
    { subId: "8" },
    { subId: "9" },
    { subId: "10" },
  ]);
  const changeSelectStation = useCallback((sta: string) => {
    setSelectedStation(sta);
  }, []);
  const [itemTitleSize, setItemTitleSize] = useState(15);
  const changeSelectFlowRange = useCallback((flowRange: string) => {
    setSelectFlowRange(flowRange);
  }, []);
  const switchTimeCategory = useCallback(() => {
    timeCategory === "realTime"
      ? setTimeCategory("history")
      : setTimeCategory("realTime");
  }, [timeCategory]);
  const switchInflowCategory = useCallback(() => {
    setFlowCategory("inflow");
  }, []);

  const switchOutflowCategory = useCallback(() => {
    setFlowCategory("outflow");
  }, []);
  const switchMapType = useCallback((type: string) => {
    setMapType(type);
  }, []);

  const workAreaRef = useRef(null);
  const createImg = useCallback((id: string) => {
    // 绑定在某个点击事件
    html2canvas(document.getElementById(id) as any).then((canvas) => {
      if (id === "item2") {
        canvas.style.width = windowSize.width * 0.2 + "px";
        canvas.style.height = windowSize.height * 0.15 + "px";
      } else {
        canvas.style.width = windowSize.width * 0.1 + "px";
        canvas.style.height = windowSize.height * 0.15 + "px";
      }
      // console.log(canvas);
      // const listW = [...workAreaImg]
      // listW.push(canvas)
      // setWorkAreaImg(listW)
      document.getElementById("scr")?.appendChild(canvas);
    });
  }, []);

  const addFocusStation = (selectedStation: any) => {
    const focusList = [...focusStation];
    const listLength = focusStation.length;
    focusList.push({
      subId: "" + (listLength + 1),
      // subName: subNameObj[selectedStation],
    });
    setFocusStation(focusList);
  };
  const onChangeDay = (_date: any, dateString: [string, string]) => {
    console.log("value", _date);
    console.log("dateString", dateString);
    if (dateString) {
      setSelectDay(dateString);
    }
  };
  const windowSize = useWindowSize();
  useEffect(() => {
    setItemTitleSize(16 + (windowSize.width - 1500) / 150);
    // selectResultSize = (windowSize.width / 640) * 6.5;
    console.log(itemTitleSize);
  }, [windowSize, itemTitleSize]);
  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/");
    socket.onmessage = function (e) {
      const obj = JSON.parse(e.data);
      dispatch(slice.actions.update(obj));
    };
  }, []);
  return (
    <Fragment>
      <Header
        defaultDayValue={defaultDayValue}
        onChangeDay={onChangeDay}
        flowCategory={flowCategory}
        timeCategory={timeCategory}
        switchInflowCategory={switchInflowCategory}
        switchOutflowCategory={switchOutflowCategory}
        switchTimeCategory={switchTimeCategory}
      />
      <MainDataArea
        selectDay={selectDay}
        selectedStation={selectedStation}
        selectFlowRange={selectFlowRange}
        flowCategory={flowCategory}
        timeCategory={timeCategory}
        mapType={mapType}
        changeSelectStation={changeSelectStation}
        changeSelectFlowRange={changeSelectFlowRange}
        switchMapType={switchMapType}
        createImg={createImg}
        itemTitleSize={itemTitleSize}
      />
      <SplitBar windowSize={windowSize} />
      {/* <HtmlCrop></HtmlCrop> */}

      <LikeDataArea
        focusStation={focusStation}
        timeCategory={timeCategory}
        selectedStation={selectedStation}
        selectDay={selectDay}
        flowCategory={flowCategory}
        mapType={mapType}
        addFocusStation={addFocusStation}
        workAreaRef={workAreaRef}
        itemTitleSize={itemTitleSize}
      />

      {/* {document.body.appendChild(workAreaImg[0])} */}
    </Fragment>
  );
}
