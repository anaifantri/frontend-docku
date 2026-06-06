import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";

import Svg from "@/components/Svg";
import HeaderShow from "@/components/HeaderShow";
import BtnBack from "@/components/BtnBack";
import BtnEdit from "@/components/BtnEdit";
import BtnDelete from "@/components/BtnDelete";
import SuccessMessage from "@/components/SuccessMessage";
import LoadingData from "@/components/LoadingData";

import ImageSvg from "@/assets/Svg/ImageSvg";

export default function Show() {
  const { id } = useParams();
  const { token } = useAuth();
  const location = useLocation();
  const message = location.state?.message;
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/merchants/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMerchant(response.data);
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

  return (
    <>
      <div>
        <HeaderShow
          titleShow="Data Merchant"
          url="/merchants"
          getId={merchant.id}
          token={token}
        />
        <SuccessMessage message={message} duration="3000" />
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="flex-all-center col-span-1">
            {merchant.logo ? (
              <img
                src={merchant.logo}
                alt=""
                className="flex rounded-full w-36 mx-2"
              />
            ) : (
              <Svg title="Profile" c={"w-36 fill-current mx-2"}>
                <ImageSvg />
              </Svg>
            )}
          </div>
          <div className="col-span-2 texl-lg">
            <div className="flex w-full p-1">
              <label className="flex w-32">Kode Merchant</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold">{merchant.code}</label>
            </div>
            <div className="flex w-full p-1">
              <label className="flex w-32">Nama merchant</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold">{merchant.name}</label>
            </div>
            <div className="flex w-full p-1">
              <label className="flex w-32">Alamat</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold">
                {merchant.address}
              </label>
            </div>
            <div className="flex w-full p-1">
              <label className="flex w-32">No. Telepon</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold">
                {merchant.phone}
              </label>
            </div>
            <div className="flex w-full p-1">
              <label className="flex w-32">Nomor Hp.</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold">
                {merchant.mobile}
              </label>
            </div>
            <div className="flex w-full p-1">
              <label className="flex w-32">Email</label>
              <label>:</label>
              <label className="flex ml-2 font-semibold">
                {merchant.email}
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
