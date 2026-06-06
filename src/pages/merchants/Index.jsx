import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation, useSearchParams } from "react-router-dom";

import api from "@/apiService";

import HeaderIndex from "@/components/HeaderIndex";
import TdAction from "@/components/TdAction";
import SuccessMessage from "@/components/SuccessMessage";
import FailedMessage from "@/components/FailedMessage";
import LoadingData from "@/components/LoadingData";

function Index() {
  const [searchParams] = useSearchParams();
  const deleteMessage = searchParams.get("message");
  const failedDelete = searchParams.get("failed");
  const location = useLocation();
  const { token } = useAuth();
  const message = location.state?.message;
  const failed = location.state?.failed;
  const [merchants, setMerchants] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/merchants", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMerchants(response.data);
      } catch (error) {
        setError(error);
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
      <div className="w-300">
        <HeaderIndex
          title="Daftar Merchant"
          addTitle="Tambah Merchant"
          addUrl="/dashboard/merchants/create"
        />
        {deleteMessage && (
          <SuccessMessage message={deleteMessage} duration="3000" />
        )}
        {failedDelete && (
          <FailedMessage message={failedDelete} duration="3000" />
        )}
        {message && <SuccessMessage message={message} duration="3000" />}
        {failed && <FailedMessage message={failed} duration="3000" />}
        <table className="table-auto mt-2 w-full">
          <thead>
            <tr className="h-10 bg-teal-100">
              <th className="th-center w-10">No.</th>
              <th className="th-center w-20">Kode</th>
              <th className="th-center w-40">Nama</th>
              <th className="th-center">Address</th>
              <th className="th-center w-28">Phone</th>
              <th className="th-center w-28">No. Hp.</th>
              <th className="th-center w-56">Email</th>
              <th className="th-center w-32">Action</th>
            </tr>
          </thead>
          <tbody>
            {merchants.map((merchant, index) => (
              <tr className="bg-white" key={index}>
                <td className="td-center">{index + 1}</td>
                <td className="td-center">{merchant.code}</td>
                <td className="td-center">{merchant.name}</td>
                <td className="td-left">{merchant.address}</td>
                <td className="td-center">{merchant.phone}</td>
                <td className="td-center">{merchant.mobile}</td>
                <td className="td-center">{merchant.email}</td>
                <td className="td-center">
                  <TdAction
                    showUrl={`/dashboard/merchants/${merchant.id}`}
                    editUrl={`/dashboard/merchants/edit/${merchant.id}`}
                    deleteUrl="/api/merchants/delete/"
                    deleteId={merchant.id}
                    getToken={token}
                    returnUrl="/dashboard/merchants"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Index;
