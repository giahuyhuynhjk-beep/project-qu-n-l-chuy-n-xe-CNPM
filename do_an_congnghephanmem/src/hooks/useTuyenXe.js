import { useState, useEffect, useCallback } from "react";
import { tuyenXeApi } from "../api/tuyenXeApi";

// ============================================================
// useTuyenXe – Controller hook cho tuyến đường
// Cung cấp: data, loading, error, create, update, refresh
// ============================================================
export const useTuyenXe = () => {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // Tải toàn bộ danh sách tuyến xe
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await tuyenXeApi.getAll();
      setData(res.data);
    } catch (err) {
      console.error("[useTuyenXe] Lỗi:", err);
      setError(err.response?.data?.detail || "Không thể tải dữ liệu tuyến xe");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Tạo tuyến mới và refresh list
  const create = async (newData) => {
    const res = await tuyenXeApi.create(newData);
    await fetchData();
    return res.data;
  };

  // Cập nhật tuyến và refresh list
  const update = async (maTuyen, updatedData) => {
    const res = await tuyenXeApi.update(maTuyen, updatedData);
    await fetchData();
    return res.data;
  };

  return { data, loading, error, create, update, refresh: fetchData };
};
