import { useEffect, useState } from "react";
import "./index.css";
import Rank from "./Rank";
export default function Ranks({
  earlyWarning,
  changeSelectStation,
}: {
  earlyWarning?: any;
  changeSelectStation: any;
}) {
  const [showList, setShowList] = useState([]);
  const [count, setCount] = useState(0);
  const listLength = earlyWarning.length;
  const cycleTime = Math.ceil(listLength / 6);
  useEffect(() => {
    setTimeout(() => {
      setCount(count + 1);
      if (count === cycleTime) {
        setCount(0);
      } else {
        setShowList(earlyWarning.slice(count * 6, (count + 1) * 6));
      }
    }, 2000);
  }, [count, cycleTime, showList, setShowList, earlyWarning]);
  return (
    <div className="allLine">
      {showList.map((warning: any) => {
        return (
          <Rank
            className="earlyWarning"
            changeSelectStation={changeSelectStation}
            key={warning.subId}
            {...warning}
          />
        );
      })}
    </div>
  );
}
