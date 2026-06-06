import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import BarcodeScanner from "react-qr-barcode-scanner";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";

import FormattedDateLong from "@/Utils/FormattedDateLong";
import HeaderShow from "@/components/HeaderShow";
import LoadingData from "@/components/LoadingData";

function Show() {
  const { id } = useParams();
  const location = useLocation();
  const message = location.state?.message;
  const { token } = useAuth();
  const [documentation, setDocumentation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/documentations/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDocumentation(response.data);
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

  return (
    <>
      <div>
        <HeaderShow
          titleShow="Data Rekaman Pengemasan"
          url="/documentations"
          getId={documentation.id}
          token={token}
        />
        <div className="grid grid-cols-6 gap-2 w-300">
          <div className="border border-teal-700 rounded-xl p-2 h-160 col-span-2">
            <div className="flex-all-center bg-teal-700 text-white rounded-t-xl text-md font-semibold tracking-wider p-1 h-8">
              <label className="flex">Data Rekaman Proses Pengemasan</label>
            </div>
            <div className="flex items-center text-teal-700 mt-2 text-sm px-2">
              <label className="flex w-24">Merchant</label>
              <label className="flex">:</label>
              <label className="flex ml-2 w-60">
                {documentation ? documentation.merchant.name : "-"}
              </label>
            </div>
            <div className="flex items-center text-teal-700 mt-2 text-sm px-2">
              <label className="flex w-24">Nomor Resi</label>
              <label className="flex">:</label>
              <label className="flex ml-2 w-60">
                {documentation ? documentation.shipping_number : "-"}
              </label>
            </div>
            <div className="flex items-center text-teal-700 mt-2 text-sm px-2">
              <label className="flex w-24">Tanggal</label>
              <label className="flex">:</label>
              <label className="flex ml-2 w-60">
                {documentation
                  ? FormattedDateLong(documentation.created_at)
                  : "-"}
              </label>
            </div>
            <div className="flex items-center text-teal-700 mt-2 text-sm px-2">
              <label className="flex w-24">Dibuat oleh</label>
              <label className="flex">:</label>
              <label className="flex ml-2 w-60">
                {documentation ? documentation.user.name : "-"}
              </label>
            </div>
          </div>

          <div className="border border-teal-700 rounded-xl col-span-4 p-2 h-160">
            <div className="flex-all-center bg-teal-700 text-white rounded-t-xl text-md font-semibold tracking-wider p-1 h-8">
              <label className="flex">Video Rekaman Proses Pengemasan</label>
            </div>
            {documentation ? (
              <div className="flex-all-center w-full">
                <video controls width="100%" src={documentation.video}>
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="flex-all-center w-full">
                Data Rekaman Tidak Ditemukan
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Show;
