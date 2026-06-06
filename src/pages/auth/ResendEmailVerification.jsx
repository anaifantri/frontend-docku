import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import Svg from "@/components/Svg";
import SpinSvg from "@/assets/Svg/SpinSvg";

function resendEmailVerification() {
  const { user, resendEmailVerification } = useAuth();
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setMessage("");
    try {
      const response = await resendEmailVerification(user);
      setMessage(response.data.message);
      setProcessing(false);
    } catch (err) {
      if (!err?.response) {
        setError("No Server Response..!!");
      } else if (err.response?.status === 400) {
        setMessage(err.response.data.message);
      } else {
        console.log(err);
        setMessage(err.response.data.message);
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <div className="flex-all-center w-full h-screen top-0 bg-teal-50">
        <div className="flex-all-center bg-white w-150 h-100 border-slate-100 rounded-4xl drop-shadow-xl">
          <div className="flex-all-center">
            <div>
              <div className="flex-all-center w-full text-teal-800">
                <svg
                  className="w-20 fill-current"
                  viewBox="0 0 256 256"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M58.446 127.855L140.401 46.3l32.106 26.083s-11.13.225-20.794 3.706c-9.663 3.48-14.486 8.596-19.58 14.04-11.146 11.915-14.325 23.365-14.243 37.955.08 14.59 4.462 22.448 12.94 33.133 2.87 3.619 5.696 7.099 10.508 9.728 1.64.897 8.563 5.947 13.122 7.36 4.559 1.413 16.789 1.949 16.789 1.949l-29.911 31.06-82.892-83.459z" />
                  <circle cx="173" cy="126" r="22" />
                </svg>
              </div>
              <div className="flex-all-center p-2">
                <label className="flex justify-center text-center tracking-widest font-bold text-sm text-teal-700 w-96">
                  Klik tombol di bawah ini untuk pengiriman ulang link
                  verifikasi email
                </label>
              </div>
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

              <form onSubmit={handleSubmit}>
                <div className="flex-all-center mt-6">
                  <button
                    type="submit"
                    className={
                      processing
                        ? "flex justify-center items-center m-auto font-semibold tracking-widest mt-6 drop-shadow-xl rounded-2xl p-2 button-disabled cursor-pointer"
                        : "flex justify-center items-center m-auto font-semibold tracking-widest mt-6 drop-shadow-xl rounded-2xl p-2 button-primary cursor-pointer"
                    }
                  >
                    {processing && (
                      <Svg
                        title="Spin"
                        c={"w-5 fill-current mx-2 animate-spin"}
                      >
                        <SpinSvg />
                      </Svg>
                    )}
                    <span>Resend Verification</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default resendEmailVerification;
