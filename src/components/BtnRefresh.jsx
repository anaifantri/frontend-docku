import Svg from "@/components/Svg";
import RefreshSvg from "@/assets/Svg/RefreshSvg";

export default function BtnRefresh({ p, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={p}
      className={
        p
          ? "flex-all-center button-disabled w-24 mx-1"
          : "flex-all-center button-warning cursor-pointer w-24 mx-1"
      }
    >
      {p ? (
        <Svg title="Reset" c={"w-4 fill-current mx-1"}>
          <RefreshSvg />
        </Svg>
      ) : (
        <Svg title="Reset" c={"w-4 fill-current mx-1"}>
          <RefreshSvg />
        </Svg>
      )}
      <span className="mx-1">Reset</span>
    </button>
  );
}
