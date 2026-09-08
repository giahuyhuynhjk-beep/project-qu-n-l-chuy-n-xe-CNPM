import { useState, useEffect, useCallback } from "react";
import { xeApi } from "../api/xeApi";

// ============================================================
// useXe – Controller hook cho phương tiện
// ============================================================
export const useXe = () => {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await xeApi.getAll();
      setData(res.data);
    } catch (err) {
      console.error("[useXe] Lỗi:", err);
      setError(err.response?.data?.detail || "Không thể tải dữ liệu xe");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const create = async (newData) => {
    const res = await xeApi.create(newData);
    await fetchData();
    return res.data;
  };

  const update = async (bienSo, updatedData) => {
    const res = await xeApi.update(bienSo, updatedData);
    await fetchData();
    return res.data;
  };

  const remove = async (bienSo) => {
    await xeApi.delete(bienSo);
    await fetchData();
  };

  return { data, loading, error, create, update, remove, refresh: fetchData };
};
