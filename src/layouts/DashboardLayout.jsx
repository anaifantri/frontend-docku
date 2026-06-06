import HeaderLayout from "@/layouts/HeaderLayout";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";

import Svg from "@/Components/Svg";
import EmailSvg from "@/Assets/Svg/EmailSvg";

export default function DashboardLayout() {
  const { user, logout, resendEmailVerification } = useAuth();
  const [message, setMessage] = useState("");

  // const handleResend = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await resendEmailVerification(user);
  //     setMessage(response.data.message);
  //   } catch (error) {
  //     if (error.response && error.response.status === 400) {
  //       setMessage(err.response.data.message);
  //     } else {
  //       setMessage("Something went wrong. Please try again.");
  //     }
  //   }
  // };

  return (
    <>
      <HeaderLayout />
      <main>
        <div className="flex w-full min-h-screen justify-center p-4 text-sm bg-teal-50 z-0">
          {user && !user.email_verified_at ? (
            <div className="text-red-700 text-xs">
              <div className="flex-all-center">
                <span className="flex font-semibold">
                  Akun anda belum aktif..!!
                </span>
                <span className="flex ml-2">
                  Silakan periksa inbox email Anda untuk memverifikasi akun.
                </span>
              </div>
              <div className="flex-all-center w-full text-teal-800">
                {message && (
                  <>
                    <span
                      className={
                        message
                          ? "flex-all-center m-auto w-full text-red-700 text-sm items-center"
                          : "hidden"
                      }
                    >
                      {message}
                    </span>
                  </>
                )}
              </div>
              <div className="flex-all-center mt-4">
                <Link
                  to={"/resend-email-verification"}
                  className="flex-all-center mx-1 button-success cursor-pointer"
                  // onClick={handleResend}
                >
                  <Svg title="Resend" c={"w-3 fill-current mx-1"}>
                    <EmailSvg />
                  </Svg>
                  <span className="mx-1">Resend Email Verification</span>
                </Link>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </>
  );
}
