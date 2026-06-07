import Svg from "@/components/Svg";
import PlaySvg from "@/assets/Svg/PlaySvg";

export default function BtnPlayVideo({ action }) {
  return (
    <button
      type="button"
      className="flex-all-center w-full text-white/50 hover:text-teal-50 mx-1 cursor-pointer"
      onClick={action}
    >
      <Svg title="Play" c={"w-10 fill-current mx-1"}>
        <PlaySvg />
      </Svg>
    </button>
  );
}
