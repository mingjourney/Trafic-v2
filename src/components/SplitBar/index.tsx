import "./index.css";
export default function SplitBar(
  {
    windowSize
  }:
    {
      windowSize: any
    }
) {

  return (
    <div className="personnalSelection" >
      <span>
        <span >Personal Attention</span>
        <span
          style={{ marginLeft: "60px", fontWeight: "400", color: "red" }}
          id="reminder"
        ></span>
      </span>

      <span>Workspace</span>
    </div>
  );
}
