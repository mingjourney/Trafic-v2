import { Fragment } from "react";
import "./index.css";
import logo from "../../images/logo.png";
import { DatePicker, Space } from "antd";
export default function Header({
  defaultDayValue,
  onChangeDay,
  switchInflowCategory,
  switchOutflowCategory,
  switchTimeCategory,
  flowCategory,
  timeCategory,
}: {
  defaultDayValue: any;
  onChangeDay: any;
  switchInflowCategory: any;
  switchOutflowCategory: any;
  switchTimeCategory: any;
  flowCategory: any;
  timeCategory: any;
}) {
  const { RangePicker } = DatePicker;
  return (
    <Fragment>
      <div className="header">
        <div className="logo">
          <img src={logo} alt="" />
          <span>HangZhou</span>
        </div>
        <div className="selecter">
          <div className="is-select">
            {timeCategory === "history" ? (
              <Space direction="horizontal" size={12}>
                <RangePicker
                  className="is-select"
                  dateRender={(current) => {
                    const style: any = {};
                    if (current.date() === 1) {
                      style.border = "1px solid #1230ff";
                      style.borderRadius = "50%";
                    }
                    return (
                      <div className="ant-picker-cell-inner" style={style}>
                        {current.date()}
                      </div>
                    );
                  }}
                  onChange={(value, dateString) => {
                    onChangeDay(value, dateString);
                  }}
                />
              </Space>
            ) : (
              <div></div>
            )}
          </div>
        </div>
        <div className="user">
          <button
            id="intoSta"
            style={{ marginRight: 10 }}
            className={
              timeCategory === "realTime"
                ? flowCategory === "outflow"
                  ? "notPitchY"
                  : "pitchY"
                : flowCategory === "outflow"
                ? "notPitchB"
                : "pitchB"
            }
            onClick={switchInflowCategory}
          >
            Inbound
          </button>
          <button
            id="outSta"
            style={{ marginRight: 30 }}
            className={
              timeCategory === "realTime"
                ? flowCategory === "inflow"
                  ? "notPitchY"
                  : "pitchY"
                : flowCategory === "inflow"
                ? "notPitchB"
                : "pitchB"
            }
            onClick={switchOutflowCategory}
          >
            Outbound
          </button>
          <button
            style={{
              backgroundColor:
                timeCategory === "realTime" ? "#faad3d" : "#4395a6",
            }}
            onClick={switchTimeCategory}
          >
            {timeCategory === "realTime" ? "Real-Time" : "History"}
          </button>
          <div className="mine">
            <img src="user.jpg" alt="" />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
