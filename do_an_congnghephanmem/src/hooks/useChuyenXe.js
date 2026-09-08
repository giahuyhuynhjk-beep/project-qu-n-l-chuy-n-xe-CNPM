import { useState, useEffect, useCallback } from "react";
import { chuyenXeApi } from "../api/chuyenXeApi";

// ============================================================
// useChuyenXe – Controller hook cho chuyến xe
// ============================================================
export const useChuyenXe = () => {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await chuyenXeApi.getAll();
      setData(res.data);
    } catch (err) {
      console.error("[useChuyenXe] Lỗi:", err);
      setError(err.response?.data?.detail || "Không thể tải dữ liệu chuyến xe");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const create = async (newData) => {
    const res = await chuyenXeApi.create(newData);
    await fetchData();
    return res.data;
  };

  const update = async (maChuyen, updatedData) => {
    const res = await chuyenXeApi.update(maChuyen, updatedData);
    await fetchData();
    return res.data;
  };

  /**
   * Tìm kiếm chuyến xe (dùng ở trang Client)
   * @param {string} diemDi
   * @param {string} diemDen
   * @param {string} thoiGian
   */
  const search = async (diemDi, diemDen, thoiGian) => {
    const res = await chuyenXeApi.search(diemDi, diemDen, thoiGian);
    return res.data;
  };

  return { data, loading, error, create, update, search, refresh: fetchData };
};
