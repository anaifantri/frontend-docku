import React, { useRef, useState, useCallback, useEffect } from "react";
import BarcodeScanner from "react-qr-barcode-scanner";
import Webcam from "react-webcam";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import api from "@/apiService";

import FormattedDateLong from "@/Utils/FormattedDateLong";
import BtnStartRecord from "@/Components/BtnStartRecord";
import BtnStopRecord from "@/Components/BtnStopRecord";
import BtnRefresh from "@/Components/BtnRefresh";
import BtnSaveRecord from "@/Components/BtnSaveRecord";
import BtnCancel from "@/components/BtnCancel";

const Create = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  // const [shippingNumber, setShippingNumber] = useState("");
  const [urlRecord, setUrlRecord] = useState("");
  const [stopScan, setStopScan] = useState(false);
  const [disableReset, setDisableReset] = useState(true);
  const [disableStart, setDisableStart] = useState(true);
  const [disableStop, setDisableStop] = useState(true);
  const [disableSave, setDisableSave] = useState(true);
  const [processing, setProcessing] = useState(false);
  const getDate = Date.now();
  const today = new Intl.DateTimeFormat("en-CA").format(new Date());
  const webcamRef = useRef(null);
  const shippingNumberRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const [getData, setGetData] = useState({
    shipping_number: "",
    user_id: user.id,
    merchant_id: "2",
  });

  useEffect(() => {
    shippingNumberRef.current.focus();
  }, []);

  const handleChange = (e) => {
    setGetData((prevGetData) => ({
      ...prevGetData,
      [e.target.name]: e.target.value,
    }));
  };

  // Fungsi yang dipicu setiap kali kamera menangkap frame baru
  const handleUpdate = (err, result) => {
    if (result) {
      // Jika QR Code atau Barcode berhasil dideteksi
      // setShippingNumber(result.text);
      setGetData((prevGetData) => ({
        ...prevGetData,
        ["shipping_number"]: result.text,
      }));
      setStopScan(true); // Hentikan scanner setelah berhasil memindai
      setDisableReset(false); // Hentikan scanner setelah berhasil memindai
      setDisableStart(false); // Hentikan scanner setelah berhasil memindai
    } else {
      // Menangani error pencarian (biasanya karena kode belum terlihat)
      if (err && err.name !== "NotFoundException") {
        // console.log("Error pemindaian:", err);
      }
    }
  };
  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    setDisableStart(true);
    setDisableStop(false);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener("dataavailable", ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    });
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
    setDisableStop(true);
    setDisableSave(false);
  }, [mediaRecorderRef, setCapturing, setUrlRecord]);

  const handleSave = useCallback(
    async (e) => {
      if (recordedChunks.length === 0) return;

      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setUrlRecord(url);

      const videoFile = new File([blob], `droidcam_${Date.now()}.webm`, {
        type: "video/webm",
      });

      e.preventDefault();

      const formData = new FormData();
      formData.append("user_id", getData.user_id);
      formData.append("merchant_id", getData.merchant_id);
      formData.append("shipping_number", getData.shipping_number);
      formData.append("video", videoFile);
      // console.log(getData);
      // console.log(videoFile);

      try {
        setProcessing(true);
        const response = await api.post("/api/documentations", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "mulipart/form-data",
          },
        });
        URL.revokeObjectURL(url);
        setRecordedChunks([]);
        alert(
          `Rekaman proses packaging dengan nomor resi : ${response.data.documentation.shipping_number}  berhasil disimpan`,
        );
        console.log(response.data);
        handleReset();
        // navigate("/dashboard/users", {
        //   state: {
        //     message: "Penambahan user baru berhasil..!!",
        //   },
        // });
      } catch (err) {
        if (!err?.response) {
          // setErrorMessage("No Server Response..!!");
        } else if (err.response?.status === 401) {
          // setErrorMessage("Unauthorized..!!");
        } else {
          // setGetErrors(err.response.data.errors);
          // nameRef.current.focus();
          console.log(err.response.data);
        }
      } finally {
        setProcessing(false);
      }
    },
    [recordedChunks],
  );

  const handleReset = () => {
    setGetData((prevGetData) => ({
      ...prevGetData,
      ["shipping_number"]: "",
    }));
    setUrlRecord("");
    setDisableStop(true);
    setDisableStart(true);
    setDisableSave(true);
    setDisableReset(true);
    setStopScan(false);
    setRecordedChunks([]);
  };

  return (
    <div className="grid grid-cols-6 gap-2 w-300">
      <div className="border border-teal-700 rounded-xl p-2 h-160 col-span-2">
        <div className="flex-all-center bg-teal-700 text-white rounded-t-xl text-md font-semibold tracking-wider p-1 h-8">
          <label className="flex">Merekam Proses Pengemasan</label>
        </div>
        <div className="flex items-center text-teal-700 mt-2 text-sm px-2">
          <label className="flex w-24">Nomor Resi</label>
          <label className="flex">:</label>
          <input
            className="ml-2 px-2 w-60"
            type="text"
            name="shipping_number"
            onChange={handleChange}
            ref={shippingNumberRef}
            placeholder="Input / Scan Nomor Resi"
            defaultValue={getData.shipping_number}
          />
        </div>
        <div className="flex items-center text-teal-700 mt-2 text-sm px-2">
          <label className="flex w-24">Tanggal</label>
          <label className="flex">:</label>
          <label className="flex ml-2 w-60">{FormattedDateLong(today)}</label>
        </div>
        <div className="flex-all-center w-full border-b border-t mt-4 p-1">
          <BtnStartRecord
            c={capturing}
            d={disableStart}
            action={handleStartCaptureClick}
          />
          <BtnStopRecord s={disableStop} action={handleStopCaptureClick} />
        </div>
        <div className="flex items-center text-teal-700 mt-4 text-sm px-2">
          <label className="flex w-24">Hasil Rekaman</label>
          <label className="flex">:</label>
          <input
            className="ml-2 px-2 w-60"
            type="text"
            defaultValue={urlRecord}
          />
        </div>
        <div className="flex-all-center w-full border-b border-t mt-4 p-1">
          <BtnCancel backUrl="/dashboard/documentations" />
          <BtnSaveRecord
            p={processing}
            disableSave={disableSave}
            action={handleSave}
          />
          <BtnRefresh p={disableReset} onClick={handleReset} />
        </div>
      </div>

      <div className="border border-teal-700 rounded-xl col-span-4 p-2 h-160">
        <div className="flex-all-center bg-teal-700 text-white rounded-t-xl text-md font-semibold tracking-wider p-1 h-8">
          <label className="flex">
            {stopScan ? "Merekam Proses Pengemasan" : "Scan Resi Pengiriman"}
          </label>
        </div>
        <div className="flex-all-center w-full">
          {/* Render scanner hanya jika pemindaian sedang aktif */}
          {!stopScan ? (
            <BarcodeScanner
              width={780}
              // height={300}
              onUpdate={handleUpdate}
              // Opsional: memaksa kamera belakang pada HP (bukan DroidCam) jika diperlukan
              // videoConstraints={{ facingMode: "environment" }}
            />
          ) : (
            <div>
              <Webcam audio={true} ref={webcamRef} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Create;
