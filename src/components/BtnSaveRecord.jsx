import Svg from "@/components/Svg";
import SaveSvg from "@/assets/Svg/SaveSvg";
import SpinSvg from "@/assets/Svg/SpinSvg";

export default function BtnSaveRecord({ p, disableSave, action }) {
  return (
    <button
      type="button"
      onClick={action}
      disabled={disableSave}
      className={
        disableSave
          ? "flex-all-center button-disabled w-24 mx-1"
          : "flex-all-center button-primary cursor-pointer w-24 mx-1"
      }
    >
      {/* <Svg title="Save" c={"w-4 fill-current mx-1"}>
        <SaveSvg />
      </Svg> */}
      {/* <span className="mx-1">Save</span> */}
      {p ? (
        <Svg title="Spin" c={"w-4 fill-current mx-1 animate-spin"}>
          <SpinSvg />
        </Svg>
      ) : (
        <Svg title="Save" c={"w-4 fill-current mx-1"}>
          <SaveSvg />
        </Svg>
      )}
      <span className="mx-1">{p ? "Saving..." : "Save"}</span>
    </button>
  );
}
