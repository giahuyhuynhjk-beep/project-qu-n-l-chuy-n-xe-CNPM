import { useState, useEffect, useCallback } from "react";
import { nhanVienApi } from "../api/nhanVienApi";

// ============================================================
// useNhanVien – Controller hook cho nhân viên / tài xế
// ============================================================
export const useNhanVien = () => {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await nhanVienApi.getAll();
      setData(res.data);
    } catch (err) {
      console.error("[useNhanVien] Lỗi:", err);
      setError(err.response?.data?.detail || "Không thể tải dữ liệu nhân viên");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const create = async (newData) => {
    const res = await nhanVienApi.create(newData);
    await fetchData();
    return res.data;
  };

  const update = async (maNV, updatedData) => {
    const res = await nhanVienApi.update(maNV, updatedData);
    await fetchData();
    return res.data;
  };

  const remove = async (maNV) => {
    await nhanVienApi.delete(maNV);
    await fetchData();
  };

  // Filter chỉ lấy tài xế (ChucVu = "Tài xế")
  const drivers = data.filter((nv) => nv.ChucVu === "Tài xế" || nv.ChucVu === "tai_xe");

  return { data, drivers, loading, error, create, update, remove, refresh: fetchData };
};
