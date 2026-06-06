import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Svg from "@/components/Svg";
import SpinSvg from "@/assets/Svg/SpinSvg";

function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const emailRef = useRef();
  const [processing, setProcessing] = useState(false);
  //   const errorRef = useRef();

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const response = await forgotPassword(email);
      setMessage(response.data.message);
      console.log(response.data);
      setProcessing(false);
    } catch (error) {
      setProcessing(false);
      console.error("Error sending email", error);
    }
  };

  return (
    <>
      <div className="flex-all-center w-full h-screen top-0 bg-teal-50">
        <div className="flex-all-center bg-white w-150 h-100 border-slate-100 rounded-4xl drop-shadow-xl">
          {/* <div className="flex-all-center rounded-4xl bg-teal-800">
            <div>
              <div className="flex-all-center w-full text-white">
                <svg
                  className="w-20 fill-current"
                  viewBox="0 0 256 256"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M58.446 127.855L140.401 46.3l32.106 26.083s-11.13.225-20.794 3.706c-9.663 3.48-14.486 8.596-19.58 14.04-11.146 11.915-14.325 23.365-14.243 37.955.08 14.59 4.462 22.448 12.94 33.133 2.87 3.619 5.696 7.099 10.508 9.728 1.64.897 8.563 5.947 13.122 7.36 4.559 1.413 16.789 1.949 16.789 1.949l-29.911 31.06-82.892-83.459z" />
                  <circle cx="173" cy="126" r="22" />
                </svg>
              </div>
              <div className="flex-all-center p-2 w-full text-3xl font-semibold text-white">
                PackDocs
              </div>
              <div className="flex-all-centerp-2 w-full text-base text-white">
                Smart Doc. Fast Track
              </div>
            </div>
          </div> */}
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
                <h2 className="tracking-widest font-bold text-xl text-teal-700">
                  Forgot Password
                </h2>
              </div>
              {message && (
                <span
                  className={
                    message
                      ? "flex-all-center m-auto w-full text-red-700 text-sm items-center"
                      : "hidden"
                  }
                >
                  {message}
                </span>
              )}
              {/* {errorMessage && (
                <span
                  className={
                    errorMessage
                      ? "flex-all-center m-auto w-full text-red-500 text-xs items-center"
                      : "hidden"
                  }
                >
                  {errorMessage}
                </span>
              )} */}

              <form onSubmit={handleSubmit}>
                <div className="flex-all-center mt-6">
                  <div>
                    <label className="text-teal-900">Email Address</label>
                    <input
                      type="email"
                      className="flex items-center mt-2 py-1 px-2 w-80"
                      placeholder="Input email address"
                      autoComplete="off"
                      required
                      ref={emailRef}
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                    />
                    {/* {getErrors.email && (
                      <span
                        ref={errorRef}
                        className={
                          getErrors.email
                            ? "flex-all-center m-auto w-full text-red-500 text-xs items-center"
                            : "hidden"
                        }
                      >
                        {getErrors.email}
                      </span>
                    )} */}
                    <button
                      type="submit"
                      className={
                        processing
                          ? "flex justify-center items-center w-48 m-auto font-semibold tracking-widest mt-6 drop-shadow-xl rounded-2xl p-2 button-disabled cursor-pointer"
                          : "flex justify-center items-center w-48 m-auto font-semibold tracking-widest mt-6 drop-shadow-xl rounded-2xl p-2 button-primary cursor-pointer"
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
                      <span>Reset Password</span>
                    </button>
                    <Link
                      to="/"
                      className="text-teal-900 mt-4 flex justify-center"
                    >
                      Back to login
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
