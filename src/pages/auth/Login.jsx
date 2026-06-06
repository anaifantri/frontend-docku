import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Svg from "@/components/Svg";
import SpinSvg from "@/assets/Svg/SpinSvg";

function Login() {
  const { user, login, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [getErrors, setGetErrors] = useState({});
  const navigate = useNavigate();
  const usernameRef = useRef();
  const errorRef = useRef();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
    usernameRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setGetErrors("");
    setErrorMessage("");
    setProcessing(true);
    try {
      await login({ username: username, password: password });
      setUsername("");
      setPassword("");
      setProcessing(false);
      navigate("/dashboard");
    } catch (err) {
      setProcessing(false);
      if (!err?.response) {
        setErrorMessage("No Server Response..!!");
      } else if (err.response?.status === 401) {
        setErrorMessage("Unauthorized..!!");
        console.log(err);
      } else {
        setGetErrors(err.response.data.errors);
        setErrorMessage("Login Failed..!!");
      }
    }
  };

  return (
    <>
      <div className="flex-all-center w-full h-screen top-0 bg-teal-50">
        <div className="grid grid-cols-2 w-150 h-100 bg-white border border-slate-100 rounded-4xl drop-shadow-xl">
          <div className="flex-all-center rounded-4xl bg-teal-800">
            <div>
              <div className="flex-all-center w-full text-white">
                {/* <svg
                  className="w-20 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 10.19l5.15 -5.12 3.8 0 0 0 2.09 1.7c0,0 -1.45,0.03 -2.71,0.48 -1.26,0.45 -1.89,1.12 -2.55,1.83 -1.45,1.55 -1.87,3.04 -1.86,4.94 0.02,1.9 0.59,2.93 1.69,4.32 0.37,0.47 0.74,0.92 1.37,1.27 0.21,0.11 1.12,0.77 1.71,0.96 0.59,0.18 2.19,0.25 2.19,0.25l-1.95 2.02 0 0 -3.96 0 -4.97 -5 0 -7.65z" />
                  <path d="M12.22 10.33c-0.05,0 -0.1,0 -0.15,0 -1.9,0 -3.44,1.54 -3.44,3.44 0,1.9 1.54,3.44 3.44,3.44 0.05,0 0.1,0 0.15,0l0 -6.88z" />
                  <path d="M16.14 2.99l0 14.43 0 2.77 0 3.37 -3.92 -2.99 0 -0.38 0 -2.77 0 -0.21c0.05,0 0.1,0 0.15,0 1.9,0 3.44,-1.54 3.44,-3.44 0,-1.9 -1.54,-3.44 -3.44,-3.44 -0.05,0 -0.1,0 -0.15,0l0 -10.33 3.92 2.99z" />
                </svg> */}

                <img className="w-48" src="/docku-v-white.png" alt="" />
              </div>
              {/* <div className="flex-all-center p-2 w-full text-3xl font-semibold text-white">
                PackDocs
              </div>
              <div className="flex-all-centerp-2 w-full text-base text-white">
                Smart Doc. Fast Track
              </div> */}
            </div>
          </div>
          <div className="flex-all-center">
            <div>
              {/* <div className="drop-shadow-lg m-auto w-24 h-24 flex bg-white rounded-full border border-slate-400 p-1">
                <div className="flex-all-center drop-shadow-md m-auto rounded-full border border-slate-300"></div>
              </div> */}

              <div className="flex-all-center p-2">
                <h2 className="tracking-widest font-bold text-xl text-teal-700">
                  Sign In
                </h2>
              </div>
              {errorMessage && (
                <span
                  className={
                    errorMessage
                      ? "flex-all-center m-auto w-full text-red-500 text-xs items-center"
                      : "hidden"
                  }
                >
                  {errorMessage}
                </span>
              )}

              <form onSubmit={handleSubmit}>
                <div className="flex-all-center">
                  <div>
                    <input
                      type="text"
                      className="flex items-center mt-4 py-1 px-2 w-48"
                      placeholder="username"
                      autoComplete="off"
                      required
                      ref={usernameRef}
                      onChange={(e) => setUsername(e.target.value)}
                      value={username}
                    />
                    {getErrors.username && (
                      <span
                        ref={errorRef}
                        className={
                          errorMessage
                            ? "flex-all-center m-auto w-full text-red-500 text-xs items-center"
                            : "hidden"
                        }
                      >
                        {getErrors.username}
                      </span>
                    )}
                    <input
                      type="password"
                      className="flex items-center mt-4 py-1 px-2 w-48"
                      placeholder="password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      required
                    />
                    {getErrors.password && (
                      <span
                        ref={errorRef}
                        className={
                          errorMessage
                            ? "flex-all-center m-auto w-full text-red-500 text-xs items-center"
                            : "hidden"
                        }
                      >
                        {getErrors.password}
                      </span>
                    )}
                    <Link
                      to="/forgot-password"
                      className="mt-2 flex-all-center w-full text-teal-800 text-sm"
                    >
                      Forgot password?
                    </Link>
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
                      <span>Login</span>
                    </button>
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

export default Login;
