import Svg from "@/components/Svg";
import ChangeSvg from "@/assets/Svg/ChangeSvg";

export default function BtnScan({ action }) {
  return (
    <button
      type="button"
      className="flex-all-center hover:text-teal-500 mx-1 cursor-pointer"
      onClick={action}
    >
      <Svg title="Scan" c={"w-5 fill-current mx-1"}>
        <ChangeSvg />
      </Svg>
    </button>
  );
}
