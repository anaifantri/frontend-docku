import { Link } from "react-router-dom";
import NavLink from "@/components/NavLink";
import LiNavLink from "@/components/LiNavLink";
import Svg from "@/components/Svg";

import PackageSvg from "@/assets/Svg/PackageSvg";
import TrackSvg from "@/assets/Svg/TrackSvg";
import ComplaintSvg from "@/assets/Svg/ComplaintSvg";
import SettingSvg from "@/assets/Svg/SettingSvg";
import ArrowSvg from "@/assets/Svg/ArrowSvg";
import HomeSvg from "@/assets/Svg/HomeSvg";

export default function NavBar() {
  return (
    <div className="flex-all-center mx-2 col-span-12 px-32 ">
      <div className="grid grid-cols-5 gap-2 w-full">
        <Link
          className="flex justify-center items-center w-full text-teal-50 relative hover:text-teal-300 text-base"
          to={"/dashboard"}
        >
          <Svg title="Request" c={"nav-svg"}>
            <HomeSvg />
          </Svg>
          <span className="text-base ml-2">Dashboard</span>
        </Link>
        <NavLink
          title="Documentations"
          c="nav-link group"
          navSvg={<PackageSvg />}
        >
          <LiNavLink
            title="Documentations"
            c="li-nav-link"
            url="/dashboard/documentations"
          >
            <Svg title="Arrow" c={"nav-svg w-5 fill-current rotate-270"}>
              <ArrowSvg />
            </Svg>
          </LiNavLink>
          <LiNavLink
            title="Report"
            c="li-nav-link"
            url="/dashboard/documentations/report"
          >
            <Svg title="Arrow" c={"nav-svg w-5 fill-current rotate-270"}>
              <ArrowSvg />
            </Svg>
          </LiNavLink>
        </NavLink>
        <NavLink
          title="Complaints"
          c="nav-link group"
          navSvg={<ComplaintSvg />}
        >
          <LiNavLink
            title="Complaints"
            c="li-nav-link"
            url="/dashboard/complaints"
          >
            <Svg title="Arrow" c={"nav-svg w-5 fill-current rotate-270"}>
              <ArrowSvg />
            </Svg>
          </LiNavLink>
          <LiNavLink
            title="Report"
            c="li-nav-link"
            url="/dashboard/complaint/report"
          >
            <Svg title="Arrow" c={"nav-svg w-5 fill-current rotate-270"}>
              <ArrowSvg />
            </Svg>
          </LiNavLink>
        </NavLink>
        <Link
          className="flex justify-center items-center w-full text-teal-50 relative hover:text-teal-300 text-base"
          to={"/dashboard/tracking"}
        >
          <Svg title="Request" c={"nav-svg"}>
            <TrackSvg />
          </Svg>
          <span className="text-base ml-2">Tracking</span>
        </Link>
        <NavLink title="Setting" c="nav-link group" navSvg={<SettingSvg />}>
          <LiNavLink
            title="Merchants"
            c="li-nav-link"
            url="/dashboard/merchants"
          >
            <Svg title="Arrow" c={"nav-svg w-5 fill-current rotate-270"}>
              <ArrowSvg />
            </Svg>
          </LiNavLink>
          <LiNavLink title="Users" c="li-nav-link" url="/dashboard/users">
            <Svg title="Arrow" c={"nav-svg w-5 fill-current rotate-270"}>
              <ArrowSvg />
            </Svg>
          </LiNavLink>
        </NavLink>
      </div>
    </div>
  );
}
