import "./index.css";
import { subNameObj } from "../../MetroMap/MetroMapData";
import { useState } from "react";
export default function Rank({
  subId,
  isCrowded,
  changeSelectStation,
}: {
  subId: any;
  isCrowded?: any;
  changeSelectStation: any;
}) {
  const [checkboxSelect, setCheckboxSelect] = useState(false);
  const handleCheckboxSelect = (no: string) => {
    changeSelectStation(no);
  };
  return (
    <ul
      className="favorStation"
      style={{
        padding: 0,
      }}
    >
      <li
        style={{
          borderRight: isCrowded ? "10px solid #ee7964" : "10px solid #f0af54",
        }}
      >
        {" "}
        <input
          type="checkbox"
          checked={checkboxSelect}
          onChange={() => handleCheckboxSelect(subId)}
        />{" "}
        {subNameObj[subId]}
      </li>
    </ul>
  );
}
