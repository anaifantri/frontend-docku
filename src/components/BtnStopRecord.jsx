import Svg from "@/components/Svg";
import StopRecordSvg from "@/assets/Svg/StopRecordSvg";

export default function BtnStopRecord({ s, action }) {
  return (
    <button
      type="button"
      onClick={action}
      disabled={s}
      className={
        s
          ? "flex-all-center button-disabled w-36 mx-1"
          : "flex-all-center button-danger cursor-pointer w-36 mx-1"
      }
    >
      <Svg title="Stop" c={"w-4 fill-current mx-1"}>
        <StopRecordSvg />
      </Svg>
      <span className="mx-1">Stop</span>
    </button>
  );
}
