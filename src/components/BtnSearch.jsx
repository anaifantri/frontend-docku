import Svg from "@/components/Svg";
import SearchSvg from "@/assets/Svg/SearchSvg";

export default function BtnSearch({ action }) {
  return (
    <button
      type="button"
      className="flex-all-center mx-1 hover:text-teal-500 cursor-pointer"
      onClick={action}
    >
      <Svg title="Scan" c={"w-5 fill-current mx-1"}>
        <SearchSvg />
      </Svg>
    </button>
  );
}
