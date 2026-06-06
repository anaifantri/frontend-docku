import Svg from "@/components/Svg";
import PlaySvg from "@/assets/Svg/PlaySvg";

export default function BtnPlay({ action }) {
  return (
    <button
      type="button"
      className="flex-all-center w-full text-teal-700 hover:text-teal-500 mx-1 cursor-pointer"
      onClick={action}
    >
      <Svg title="Play" c={"w-5 fill-current mx-1"}>
        <PlaySvg />
      </Svg>
    </button>
  );
}
