import { useEffect, useRef, useState } from "react";
import {
  Link,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import Svg from "@/Components/Svg";
import SpinSvg from "@/Assets/Svg/SpinSvg";

function verifyEmail() {
  const navigate = useNavigate();
  const { user, verifyEmail } = useAuth();
  const { id, hash } = useParams();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await verifyEmail(id, hash, searchParams);
        setMessage(response.data.message);
        setLoading(false);
      } catch (err) {
        if (!err?.response) {
          setError("No Server Response..!!");
        } else if (err.response?.status === 403) {
          seterror(err.response.data.message);
        } else {
          seterror(err.response.data.data);
        }
      } finally {
        setLoading(false);
      }
    };

    return () => fetchData();
  }, []);

  return (
    <>
      <div className="flex-all-center mt-6">
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
                    <h2 className="tracking-widest font-bold text-xl text-teal-700">
                      Verifikasi Email
                    </h2>
                  </div>
                  {loading && (
                    <div>
                      <div className="flex-all-center w-full">
                        <Svg
                          title="Back"
                          c={"w-5 fill-current mx-1 animate-spin"}
                        >
                          <SpinSvg />
                        </Svg>
                      </div>
                      <span className="flex-all-center w-full">
                        {" "}
                        Proses verifikasi email...
                      </span>
                    </div>
                  )}
                  {message && (
                    <>
                      <span
                        className={
                          message
                            ? "flex-all-center m-auto w-full text-green-700 text-sm items-center"
                            : "hidden"
                        }
                      >
                        {message}
                      </span>
                      {user ? (
                        <Link
                          to="/dashboard"
                          className="text-teal-900 mt-4 flex justify-center hover:text-teal-700"
                        >
                          To Dashboard
                        </Link>
                      ) : (
                        <Link
                          to="/"
                          className="text-teal-900 mt-4 flex justify-center hover:text-teal-700"
                        >
                          Back to login
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      </div>
    </>
  );
}

export default verifyEmail;
