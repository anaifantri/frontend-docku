import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import UlNavLink from "@/components/UlNavLink";
import LiNavLink from "@/components/LiNavLink";

import Svg from "@/components/Svg";

import LogoutSvg from "@/assets/Svg/LogoutSvg";
import ProfileSvg from "@/assets/Svg/ProfileSvg";
import ArrowSvg from "@/assets/Svg/ArrowSvg";

export default function RightNav() {
  const { user, logout } = useAuth();

  return (
    <div className="flex justify-end items-center sm:col-span-2 w-full">
      <div>
        <div className="flex-all-center text-teal-50 hover:text-teal-300 cursor-pointer">
          {user && user.photo ? (
            <img
              src={user.photo}
              alt=""
              className="flex rounded-full w-6 h-6 mx-2"
            />
          ) : (
            <Svg title="Profile" c={"w-5 fill-current mx-2"}>
              <ProfileSvg />
            </Svg>
          )}
          <nav className="nav-link group">
            <UlNavLink title={user.name} c="nav-link group"></UlNavLink>
            <div className="hidden group-hover:block absolute top-4 pt-5">
              <div className="w-max border-t-2 border-t-teal-900 rounded-b-lg border border-teal-700 bg-teal-50 px-2">
                <LiNavLink
                  title="My Profile"
                  c="li-nav-link"
                  url={`/dashboard/users/${user.id}`}
                >
                  <Svg title="Arrow" c={"nav-svg w-5 fill-current"}>
                    <ProfileSvg />
                  </Svg>
                </LiNavLink>
                <button
                  onClick={logout}
                  className="flex justify-start w-full text-teal-700 hover:text-teal-500 cursor-pointer"
                >
                  <Svg title="Arrow" c={"flex nav-svg w-5 fill-current"}>
                    <LogoutSvg />
                  </Svg>
                  <span className="flex ml-2">Logout</span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
