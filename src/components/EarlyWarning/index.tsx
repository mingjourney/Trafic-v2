import { useState, useCallback } from "react";
import Ranks from "../Ranks";

export default function EarlyWarning({
  flowCategory,
  createImg,
  changeSelectStation,
  itemTitleSize,
}: {
  flowCategory: any;
  createImg: any;
  changeSelectStation: any;
  itemTitleSize: any;
}) {
  const [earlyWarning, setEarlyWarning] = useState(
    //
    // fetcher  without attribute 
    //setEarlyWarning
    [
      { subId: "1" },
      { subId: "2" },
      { subId: "3" },
      { subId: "4" },
      { subId: "5" },
      { subId: "6" },
      { subId: "7" },
      { subId: "8" },
      { subId: "9" },
      { subId: "10" },
      { subId: "11" },
    ]
  );
  //获取earlyWarning,setEarlyWarning
  const [checkboxThree, setCheckboxThree] = useState(false);
  const handleCheckboxThreeClick = useCallback(() => {
    setCheckboxThree(false);
    createImg("item3");
  }, [createImg]);
  return (
    <div className="item">
      <label>
        <div className="left">
          <input
            type="checkbox"
            checked={checkboxThree}
            onChange={() => handleCheckboxThreeClick()}
          />
          <span style={{ fontSize: itemTitleSize }} className="headline">
            Early Warning
          </span>
        </div>
        {/* <span style={{ fontSize: selectResultSize }} className="select-result">{}</span> */}
      </label>
      <div className="content" id="item3" style={{ overflow: "hidden" }}>
        <Ranks
          earlyWarning={earlyWarning}
          changeSelectStation={changeSelectStation}
        ></Ranks>
      </div>
    </div>
  );
}
