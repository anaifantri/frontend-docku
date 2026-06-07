import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation, useSearchParams } from "react-router-dom";

import api from "@/apiService";

import FormattedDateLong from "@/Utils/FormattedDateLong";
import HeaderIndex from "@/components/HeaderIndex";
import TdAction from "@/components/TdAction";
import Svg from "@/components/Svg";
import ListViewSvg from "@/assets/Svg/ListViewSvg";
import SmallViewSvg from "@/assets/Svg/SmallViewSvg";
import BtnPlay from "@/Components/BtnPlay";
import BtnEdit from "@/components/BtnEdit";
import BtnDelete from "@/components/BtnDelete";
import BtnBack from "@/components/BtnBack";
import SuccessMessage from "@/components/SuccessMessage";
import FailedMessage from "@/components/FailedMessage";
import LoadingData from "../../components/LoadingData";
import Modal from "@/components/Modal";
import VideoCard from "@/components/VideoCard";

export default function Index() {
  const [searchParams] = useSearchParams();
  const deleteMessage = searchParams.get("message");
  const failedDelete = searchParams.get("failed");
  const location = useLocation();
  const { token } = useAuth();
  const message = location.state?.message;
  const failed = location.state?.failed;
  const [documentations, setDocumentations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listView, setListView] = useState(true);
  const [smallView, setSmallView] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  // const videoRef = useRef(null);

  // fetch data all user
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/documentations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDocumentations(response.data);
      } catch (error) {
        setError(error);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleView = (e) => {
    setListView((prevListView) => !prevListView);
    setSmallView((prevSmallView) => !prevSmallView);
  };

  const handlePlay = (index) => {
    setIsModalOpen(true);
    setVideoUrl(documentations[index].video);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return <LoadingData />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div>
        <HeaderIndex
          title="Daftar Dokumentasi"
          addTitle="Tambah Dokumentasi"
          addUrl="/dashboard/documentations/create"
        />
        {deleteMessage && (
          <SuccessMessage message={deleteMessage} duration="3000" />
        )}
        {failedDelete && (
          <FailedMessage message={failedDelete} duration="3000" />
        )}
        {message && <SuccessMessage message={message} duration="3000" />}
        {failed && <FailedMessage message={failed} duration="3000" />}
        <div className="flex p-1 justify-end items-center w-full">
          <button
            type="button"
            disabled={listView}
            className={
              listView
                ? "flex-all-center w-8 text-slate-700"
                : "flex-all-center w-8 text-teal-700 hover:text-teal-500 cursor-pointer"
            }
            onClick={handleView}
          >
            <Svg title="List View" c={"w-5 fill-current mx-1"}>
              <ListViewSvg />
            </Svg>
          </button>
          <button
            type="button"
            disabled={smallView}
            className={
              smallView
                ? "flex-all-center w-8 text-slate-700"
                : "flex-all-center w-8 text-teal-700 hover:text-teal-500 cursor-pointer"
            }
            onClick={handleView}
          >
            <Svg title="Samll View" c={"w-5 fill-current mx-1"}>
              <SmallViewSvg />
            </Svg>
          </button>
        </div>
        {listView && (
          <div className="flex justify-center w-220">
            <table className="table-auto">
              <thead>
                <tr className="h-10 bg-teal-100">
                  <th className="th-center w-10">No.</th>
                  <th className="th-center w-40">Nomor Resi</th>
                  <th className="th-center w-28">Tanggal</th>
                  <th className="th-center w-36">Merchant</th>
                  <th className="th-center w-36">Dibuat oleh</th>
                  <th className="th-center w-24">Rekaman</th>
                  <th className="th-center w-24">Status</th>
                  <th className="th-center w-32">Action</th>
                </tr>
              </thead>
              <tbody>
                {documentations.map((documentation, index) => (
                  <tr className="bg-white" key={index}>
                    <td className="td-center">{index + 1}</td>
                    <td className="td-center">
                      {documentation.shipping_number}
                    </td>
                    <td className="td-center">
                      {FormattedDateLong(documentation.created_at)}
                    </td>
                    <td className="td-center">{documentation.merchant.name}</td>
                    <td className="td-center">{documentation.user.name}</td>
                    <td className="td-center">
                      <BtnPlay action={() => handlePlay(index)} />
                    </td>
                    <td className="td-center"></td>
                    <td className="td-center">
                      <TdAction
                        showUrl={`/dashboard/documentations/${documentation.id}`}
                        editUrl={`/dashboard/documentations/edit/${documentation.id}`}
                        deleteUrl="/api/documentations/delete/"
                        deleteId={documentation.id}
                        getToken={token}
                        returnUrl="/dashboard/documentations"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {smallView && (
          <div className="flex justify-center w-220">
            <div className="grid grid-cols-3 gap-2">
              {documentations.map((documentation, index) => (
                <div key={index} className="video-card">
                  <VideoCard
                    title={`No. Resi : ${documentation.shipping_number}`}
                    videoUrl={documentation.video}
                    thumbnailUrl=""
                    action={() => handlePlay(index)}
                    url={"/documentations"}
                    getId={documentation.id}
                    token={token}
                    date={documentation.created_at}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Rekaman Proses Pengemasan"
      >
        <div className="flex-all-center w-full">
          <video
            // ref={videoRef}
            autoPlay
            controls
            width="100%"
            src={videoUrl}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </Modal>
    </>
  );
}
