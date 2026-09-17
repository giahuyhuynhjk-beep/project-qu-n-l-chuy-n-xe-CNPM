import { useState, useEffect, useCallback } from "react";
import { veApi } from "../api/veApi";

// ============================================================
// useVe – Controller hook cho vé đặt
// ============================================================
export const useVe = () => {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await veApi.getAll();
      setData(res.data);
    } catch (err) {
      console.error("[useVe] Lỗi:", err);
      setError(err.response?.data?.detail || "Không thể tải dữ liệu vé");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /** Đặt vé mới (Client) */
  const datVe = async (newData) => {
    const res = await veApi.create(newData);
    await fetchData();
    return res.data;
  };

  /** Cập nhật trạng thái vé (Staff xác nhận, hủy...) */
  const updateVe = async (maVe, updatedData) => {
    const res = await veApi.update(maVe, updatedData);
    await fetchData();
    return res.data;
  };

  /** Xóa vé */
  const removeVe = async (maVe) => {
    await veApi.delete(maVe);
    await fetchData();
  };

  // Helper: Vé đang chờ thanh toán
  const pendingPayment = data.filter(
    (v) => v.TrangThaiThanhToan === "CHỜ XỬ LÝ" || v.TrangThaiVe === "CHỜ THANH TOÁN"
  );

  return {
    data,
    pendingPayment,
    loading,
    error,
    datVe,
    updateVe,
    removeVe,
    refresh: fetchData,
  };
};
