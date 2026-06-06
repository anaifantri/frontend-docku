import React, { useRef, useState, useCallback, useEffect } from "react";
import BarcodeScanner from "react-qr-barcode-scanner";
import { useAuth } from "@/context/AuthContext";
import api from "@/apiService";

import FormattedDateLong from "@/Utils/FormattedDateLong";
import BtnScan from "@/components/BtnScan";
import BtnSearch from "@/components/BtnSearch";
import Modal from "@/components/Modal";

function Tracking() {
  const { token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentation, setDocumentation] = useState(null);
  const [shippingNumber, setShippingNumber] = useState();
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef(null);
  const shippingNumberRef = useRef(null);
  const getDate = Date.now();
  const today = new Intl.DateTimeFormat("en-CA").format(new Date());

  const [stopScan, setStopScan] = useState(false);

  useEffect(() => {
    shippingNumberRef.current.focus();
  }, []);

  const handleChange = (e) => {
    setShippingNumber(e.target.value);
  };

  const handleTracking = async () => {
    if (!shippingNumber) {
      alert("Silahkan input / scan nomor resi terlebih dahulu !!!");
      shippingNumberRef.current.focus();
    } else {
      try {
        // let objectUrl = "";
        setLoading(true);
        const response = await api.get(
          "/api/documentations/tracking/" + shippingNumber,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setDocumentation(response.data);
        // const videoBlob = new Blob([response.data.video]);
        // objectUrl = URL.createObjectURL(videoBlob);
        // setVideoUrl(objectUrl);
        setLoading(false);
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
    }
  };

  const handleButtonScan = () => {
    setIsModalOpen(true);
    setStopScan(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setStopScan(true);
  };

  const handleScanUpdate = (err, result) => {
    if (result) {
      // Jika QR Code atau Barcode berhasil dideteksi
      setShippingNumber(result.text);
      setIsModalOpen(false);
      setStopScan(true);
      setDocumentation(null);
    } else {
      // Menangani error pencarian (biasanya karena kode belum terlihat)
      if (err && err.name !== "NotFoundException") {
        // console.log("Error pemindaian:", err);
      }
    }
  };

  return (
    <>
      <div className="grid grid-cols-6 gap-2 w-300">
        <div className="border border-teal-700 rounded-xl p-2 h-160 col-span-2">
          <div className="flex-all-center bg-teal-700 text-white rounded-t-xl text-md font-semibold tracking-wider p-1 h-8">
            <label className="flex">
              Tracking Data Rekaman Proses Pengemasan
            </label>
          </div>
          <div className="flex items-center text-teal-700 mt-2 text-sm px-2">
            <label className="flex w-24">Nomor Resi</label>
            <label className="flex">:</label>
            <div className="flex-all-center">
              <input
                className="ml-2 px-2 w-48"
                type="text"
                // name="shipping_number"
                onChange={handleChange}
                ref={shippingNumberRef}
                placeholder="Input / Resi"
                value={shippingNumber}
              />
              <BtnScan action={handleButtonScan} />
              <BtnSearch action={handleTracking} />
            </div>
          </div>
          <div className="flex-all-center text-teal-700 font-semibold border-b border-t mt-8 text-sm px-2">
            Data Hasil Tracking
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
              <video
                ref={videoRef}
                controls
                width="100%"
                src={documentation.video}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="flex-all-center w-full">
              Belum ada data, silahkan input nomor resi atau scan resi kemudian
              klik tombol search
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Scan Nomor Resi Pengiriman"
      >
        <div className="flex-all-center w-full">
          {/* Render scanner hanya jika pemindaian sedang aktif */}
          {!stopScan ? (
            <BarcodeScanner
              width={780}
              // height={300}
              onUpdate={handleScanUpdate}
              // Opsional: memaksa kamera belakang pada HP (bukan DroidCam) jika diperlukan
              // videoConstraints={{ facingMode: "environment" }}
            />
          ) : (
            <div>Nomor Resi = {shippingNumber ? shippingNumber : "-"}</div>
          )}
        </div>
      </Modal>
    </>
  );
}

export default Tracking;
