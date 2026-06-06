import Svg from "@/components/Svg";
import ScanSvg from "@/assets/Svg/ScanSvg";

export default function BtnScan({ action }) {
  return (
    <button
      type="button"
      className="flex-all-center hover:text-teal-500 mx-1 cursor-pointer"
      onClick={action}
    >
      <Svg title="Scan" c={"w-5 fill-current mx-1"}>
        <ScanSvg />
      </Svg>
    </button>
  );
}
