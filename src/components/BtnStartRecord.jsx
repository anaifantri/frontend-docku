import Svg from "@/components/Svg";
import StartRecordSvg from "@/assets/Svg/StartRecordSvg";
import SpinSvg from "@/assets/Svg/SpinSvg";

export default function BtnStartRecord({ c, d, action }) {
  return (
    <button
      type="button"
      onClick={action}
      disabled={d}
      className={
        d
          ? "flex-all-center button-disabled w-36 mx-1"
          : "flex-all-center button-primary cursor-pointer w-36 mx-1"
      }
    >
      {c ? (
        <Svg title="Spin" c={"w-4 fill-current mx-1 animate-spin"}>
          <SpinSvg />
        </Svg>
      ) : (
        <Svg title="Start" c={"w-4 fill-current mx-1"}>
          <StartRecordSvg />
        </Svg>
      )}
      <span className="mx-1">{c ? "Recording..." : "Start"}</span>
    </button>
  );
}
