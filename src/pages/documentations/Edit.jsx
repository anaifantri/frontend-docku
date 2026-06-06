import React, { useRef, useState, useCallback, useEffect } from "react";
import BarcodeScanner from "react-qr-barcode-scanner";
import Webcam from "react-webcam";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import api from "@/apiService";

import FormattedDateLong from "@/Utils/FormattedDateLong";
import HeaderEdit from "@/components/HeaderEdit";
import BtnStartRecord from "@/Components/BtnStartRecord";
import BtnStopRecord from "@/Components/BtnStopRecord";
import BtnScan from "@/components/BtnScan";
import BtnChange from "@/components/BtnChange";
import Modal from "@/components/Modal";
import LoadingData from "@/components/LoadingData";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [documentation, setDocumentation] = useState(null);
  const [shippingNumber, setShippingNumber] = useState();
  const [merchantId, setMerchantId] = useState();
  const [urlRecord, setUrlRecord] = useState("");
  const [stopScan, setStopScan] = useState(false);
  const [scan, setScan] = useState(false);
  const [record, setRecord] = useState(false);
  const [disableStart, setDisableStart] = useState(true);
  const [disableStop, setDisableStop] = useState(true);
  const [processing, setProcessing] = useState(false);
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/documentations/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDocumentation(response.data);
        setShippingNumber(response.data.shipping_number);
        setMerchantId(response.data.merchant_id);
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

  const handleChange = (e) => {
    // setGetData((prevGetData) => ({
    //   ...prevGetData,
    //   [e.target.name]: e.target.value,
    // }));
  };

  // Fungsi yang dipicu setiap kali kamera menangkap frame baru
  const handleUpdate = (err, result) => {
    if (result) {
      setShippingNumber(result.text);
      setStopScan(true);
      setScan(false);
      setIsModalOpen(false);
      console.log(result.text);
    } else {
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
      e.preventDefault();
      const formData = new FormData();
      formData.append("user_id", user.id);
      formData.append("merchant_id", merchantId);
      formData.append("shipping_number", shippingNumber);

      if (recordedChunks.length > 0) {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setUrlRecord(url);

        const videoFile = new File([blob], `droidcam_${Date.now()}.webm`, {
          type: "video/webm",
        });
        if (videoFile) {
          formData.append("video", videoFile);
        }
      }

      try {
        setProcessing(true);
        const response = await api.post(
          `/api/documentations/${id}/edit`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "mulipart/form-data",
            },
          },
        );
        navigate("/dashboard/documentations", {
          state: {
            message: "Edit data dokumentasi berhasil..!!",
          },
        });
        URL.revokeObjectURL(url);
        setRecordedChunks([]);
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
    [recordedChunks, documentation],
  );

  const handleButtonScan = () => {
    setIsModalOpen(true);
    setStopScan(false);
    setScan(true);
  };

  const handleButtonChange = () => {
    setIsModalOpen(true);
    setRecord(true);
    setDisableStart(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setStopScan(true);
    setScan(false);
    setRecord(false);
    setDisableStart(true);
    setDisableStop(true);
  };

  if (loading) {
    return <LoadingData />;
  }

  return (
    <>
      <form onSubmit={handleSave}>
        <div>
          <HeaderEdit
            titleEdit="Data Proses Pengemasan"
            backUrl="/dashboard/documentations"
            getProcessing={processing}
          />
          <div className="grid grid-cols-6 gap-2 w-300 mt-2">
            <div className="border border-teal-700 rounded-xl p-2 h-160 col-span-2">
              <div className="flex-all-center bg-teal-700 text-white rounded-t-xl text-md font-semibold tracking-wider p-1 h-8">
                <label className="flex">Edit Data Proses Pengemasan</label>
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
                <input
                  className="ml-2 px-2 w-54"
                  type="text"
                  name="shipping_number"
                  onChange={handleChange}
                  placeholder="Input / Scan Nomor Resi"
                  value={shippingNumber}
                />
                <BtnScan action={handleButtonScan} />
              </div>
              <div className="flex items-center text-teal-700 mt-2 text-sm px-2">
                <label className="flex w-24">Tanggal</label>
                <label className="flex">:</label>
                <label className="flex ml-2 w-60">
                  {FormattedDateLong(documentation.created_at)}
                </label>
              </div>
              <div className="flex items-center text-teal-700 mt-2 text-sm px-2">
                <label className="flex w-24">Dibuat oleh</label>
                <label className="flex">:</label>
                <label className="flex ml-2 w-60">
                  {documentation ? documentation.user.name : "-"}
                </label>
              </div>
              <div className="flex items-center text-teal-700 mt-4 text-sm px-2">
                <label className="flex w-24">Video URL</label>
                <label className="flex">:</label>
                <input
                  className="ml-2 px-2 w-54"
                  type="text"
                  defaultValue={documentation.video}
                />
                <BtnChange action={handleButtonChange} />
              </div>
            </div>

            <div className="border border-teal-700 rounded-xl col-span-4 p-2 h-160">
              <div className="flex-all-center bg-teal-700 text-white rounded-t-xl text-md font-semibold tracking-wider p-1 h-8">
                <label className="flex">Video Proses Pengemasan</label>
              </div>
              <div className="flex-all-center w-full">
                <video controls width="100%" src={documentation.video}>
                  Your browser does not support the video tag.
                </video>
                {/* Render scanner hanya jika pemindaian sedang aktif */}
                {/* {!stopScan ? (
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
          )} */}
              </div>
            </div>
          </div>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={
            (scan && "Scan Nomor Resi Pengiriman") ||
            (record && "Rekam Proses Pengemasan")
          }
        >
          <div className="flex-all-center w-full">
            {/* Render scanner hanya jika pemindaian sedang aktif */}
            {scan && (
              <BarcodeScanner
                width={780}
                // height={300}
                onUpdate={handleUpdate}
                // Opsional: memaksa kamera belakang pada HP (bukan DroidCam) jika diperlukan
                // videoConstraints={{ facingMode: "environment" }}
              />
            )}
            {record && (
              <div>
                <Webcam audio={true} ref={webcamRef} />
                <div className="flex-all-center w-full border-b border-t mt-4 p-1">
                  <BtnStartRecord
                    c={capturing}
                    d={disableStart}
                    action={handleStartCaptureClick}
                  />
                  <BtnStopRecord
                    s={disableStop}
                    action={handleStopCaptureClick}
                  />
                </div>
              </div>
            )}
          </div>
        </Modal>
      </form>
    </>
  );
};

export default Edit;
