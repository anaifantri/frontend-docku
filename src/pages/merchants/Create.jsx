import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import api from "@/apiService";

import Svg from "@/components/Svg";
import HeaderCreate from "@/components/HeaderCreate";
import ImageSvg from "@/assets/Svg/ImageSvg";

export default function Create() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [processing, setProcessing] = useState(false);

  const errorRef = useRef();
  const nameRef = useRef();
  const fileInputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [getErrors, setGetErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    mobile: "",
    email: "",
    logo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "logo") {
      const file = e.target.files[0];
      if (file) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: file,
        }));
        const previewUrl = URL.createObjectURL(file);
        setLogoPreview(previewUrl);
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  const handleLogoClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors("");

    const dataMerchant = new FormData();
    dataMerchant.append("user_id", user.id);
    dataMerchant.append("name", formData.name);
    dataMerchant.append("address", formData.address);
    dataMerchant.append("phone", formData.phone);
    dataMerchant.append("mobile", formData.mobile);
    dataMerchant.append("email", formData.email);

    if (formData.logo) {
      dataMerchant.append("logo", formData.logo);
    }
    try {
      setProcessing(true);
      const response = await api.post("/api/merchants", dataMerchant, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "mulipart/form-data",
        },
      });
      const registerToken = response?.data?.token;
      const registerUser = response?.data?.user;
      navigate("/dashboard/merchants", {
        state: {
          message: "Penambahan Merchant baru berhasil..!!",
        },
      });
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No Server Response..!!");
      } else if (err.response?.status === 401) {
        setErrorMessage("Unauthorized..!!");
      } else {
        setGetErrors(err.response.data.errors);
        nameRef.current.focus();
        console.log(err.response.data.errors);
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <HeaderCreate
            titleCreate="Data Merchant"
            backUrl="/dashboard/merchants"
            getProcessing={processing}
          />
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="flex-all-center col-span-1">
              <div>
                <div className="flex-all-center">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt=""
                      className="flex w-36 h-36 mx-2"
                    />
                  ) : (
                    <Svg title="Profile" c={"w-36 fill-current mx-2"}>
                      <ImageSvg />
                    </Svg>
                  )}
                </div>
                <div className="flex-all-center">
                  <input
                    type="file"
                    name="logo"
                    ref={fileInputRef}
                    onChange={handleChange}
                    style={{ display: "none" }}
                    accept="image/*"
                  />
                  <button
                    type="button"
                    className="flex-all-center bg-amber-500 text-white rounded-lg px-4 py-1 hover:bg-amber-700 mt-2 cursor-pointer"
                    onClick={handleLogoClick}
                  >
                    Pilih Logo
                  </button>
                </div>
                {getErrors.logo && (
                  <span
                    ref={errorRef}
                    className={
                      getErrors
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors.logo}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-all-center col-span-2">
              <div>
                <div className="flex items-center mt-4">
                  <label className="w-44">Nama</label>
                  <input
                    type="text"
                    name="name"
                    className="flex p-2 h-8 w-72"
                    placeholder="Input Nama Merchant"
                    autoComplete="off"
                    ref={nameRef}
                    onChange={handleChange}
                    value={formData.name}
                    required
                  />
                </div>
                {getErrors.name && (
                  <span
                    ref={errorRef}
                    className={
                      getErrors
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors.name}
                  </span>
                )}

                <div className="flex mt-2">
                  <label className="w-44">Alamat</label>
                  <textarea
                    className="flex p-2 w-72"
                    name="address"
                    placeholder="Input alamat"
                    rows={5}
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                {getErrors.address && (
                  <span
                    ref={errorRef}
                    className={
                      getErrors
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors.address}
                  </span>
                )}

                <div className="flex items-center mt-2">
                  <label className="w-44">No. Telepon</label>
                  <input
                    type="number"
                    name="phone"
                    min={0}
                    step={1}
                    placeholder="Input No. Telepon"
                    className="flex p-2 h-8 w-72 spinner-disabled"
                    autoComplete="off"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                {getErrors.phone && (
                  <span
                    ref={errorRef}
                    className={
                      getErrors
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors.phone}
                  </span>
                )}

                <div className="flex items-center mt-2">
                  <label className="w-44">No. Hp.</label>
                  <input
                    type="number"
                    name="mobile"
                    min={0}
                    step={1}
                    placeholder="Input No. Hp."
                    className="flex p-2 h-8 w-72 spinner-disabled"
                    autoComplete="off"
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                </div>
                {getErrors.mobile && (
                  <span
                    ref={errorRef}
                    className={
                      getErrors
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors.mobile}
                  </span>
                )}
                <div className="flex items-center mt-2">
                  <label className="w-44">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="flex p-2 h-8 w-72"
                    placeholder="Email"
                    autoComplete="off"
                    onChange={handleChange}
                    value={formData.email}
                  />
                </div>
                {getErrors.email && (
                  <span
                    ref={errorRef}
                    className={
                      getErrors
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors.email}
                  </span>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
