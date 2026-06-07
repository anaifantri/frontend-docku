import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import api from "@/apiService";
import { useAuth } from "@/context/AuthContext";

import Svg from "@/components/Svg";
import HeaderEdit from "@/components/HeaderEdit";
import ImageSvg from "@/assets/Svg/ImageSvg";
import LoadingData from "@/components/LoadingData";

export default function Edit() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [logoPreview, setLogoPreview] = useState("");
  const fileInputRef = useRef(null);
  const [logo, setLogo] = useState(null);
  const nameRef = useRef();
  const errorRef = useRef();
  const [getErrors, setGetErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const [editMerchant, setEditMerchant] = useState({
    id: "",
    code: "",
    name: "",
    address: "",
    phone: "",
    mobile: "",
    email: "",
    logo: null,
  });

  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    if (e.target.name == "logo") {
      const file = e.target.files[0];
      if (file) {
        setLogo(file);
        const previewUrl = URL.createObjectURL(file);
        setLogoPreview(previewUrl);
      }
    } else {
      setEditMerchant({ ...editMerchant, [e.target.name]: e.target.value });
    }
  };

  const handleLogoClick = () => {
    fileInputRef.current.click(); // Trigger the hidden file input click
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/merchants/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEditMerchant(response.data);
        setLogoPreview(response.data.logo);
      } catch (err) {
        if (!err?.response) {
          setError("No Server Response..!!");
        } else if (err.response?.status === 401) {
          setError("Unauthorized..!!");
        } else {
          setError(err.response.data.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingData />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGetErrors("");

    const formData = new FormData();
    formData.append("user_id", user.id);
    formData.append("name", editMerchant.name);
    formData.append("address", editMerchant.address);
    formData.append("phone", editMerchant.phone);
    formData.append("mobile", editMerchant.mobile);
    if (editMerchant.email) {
      formData.append("email", editMerchant.email);
    }

    if (logo) {
      formData.append("logo", logo);
    }
    try {
      setProcessing(true);
      const response = await api.post(`/api/merchants/${id}/edit`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "mulipart/form-data",
        },
      });
      navigate("/dashboard/merchants", {
        state: { message: "Berhasil mengubah data merchant..!!" },
      });
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No Server Response..!!");
      } else if (err.response?.status === 401) {
        setErrorMessage("Unauthorized..!!");
      } else {
        setGetErrors(err.response.data.errors);
        nameRef.current.focus();
        console.log(err.response.data);
        setErrorMessage("Update gagal..!!");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <HeaderEdit
            titleEdit="Data Merchant"
            backUrl="/dashboard/merchants"
            getProcessing={processing}
          />
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="flex-all-center col-span-1">
              <div>
                <div className="flex-all-center">
                  {logoPreview ? (
                    <img src={logoPreview} alt="" className="flex w-36 mx-2" />
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
                    Ganti Logo
                  </button>
                </div>
                {getErrors.logo && (
                  <span
                    ref={errorRef}
                    className={
                      errorMessage
                        ? "flex w-full text-red-500 text-xs items-center"
                        : "hidden"
                    }
                  >
                    {getErrors.logo}
                  </span>
                )}
              </div>
            </div>
            <div className="col-span-2">
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
                  defaultValue={editMerchant.name}
                  required
                />
              </div>
              {getErrors.name && (
                <span
                  ref={errorRef}
                  className={
                    errorMessage
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
                  defaultValue={editMerchant.address}
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
                  type="text"
                  name="phone"
                  className="flex p-2 h-8 w-72"
                  placeholder="Input No. Telepon"
                  autoComplete="off"
                  onChange={handleChange}
                  defaultValue={editMerchant.phone}
                />
              </div>
              {getErrors.phone && (
                <span
                  ref={errorRef}
                  className={
                    errorMessage
                      ? "flex w-full text-red-500 text-xs items-center"
                      : "hidden"
                  }
                >
                  {getErrors.phone}
                </span>
              )}

              <div className="flex items-center mt-2">
                <label className="w-44">No. Handphone</label>
                <input
                  type="text"
                  name="phone"
                  className="flex p-2 h-8 w-72"
                  placeholder="Input No. Handphone"
                  autoComplete="off"
                  onChange={handleChange}
                  defaultValue={editMerchant.mobile}
                />
              </div>
              {getErrors.mobile && (
                <span
                  ref={errorRef}
                  className={
                    errorMessage
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
                  placeholder="Input Email"
                  autoComplete="off"
                  onChange={handleChange}
                  defaultValue={editMerchant.email}
                />
              </div>
              {getErrors.email && (
                <span
                  ref={errorRef}
                  className={
                    errorMessage
                      ? "flex w-full text-red-500 text-xs items-center"
                      : "hidden"
                  }
                >
                  {getErrors.email}
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
