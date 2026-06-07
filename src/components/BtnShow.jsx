import { Link, useNavigate } from "react-router-dom";
import Svg from "@/Components/Svg";
import ShowSvg from "@/Assets/Svg/ShowSvg";

export default function BtnShow({ showUrl }) {
  return (
    <Link to={showUrl} className="flex-all-center button-primary mx-1">
      <Svg title="Edit" c={"w-5 fill-current mx-1"}>
        <ShowSvg />
      </Svg>
      <span className="mx-1">Show</span>
    </Link>
  );
}
