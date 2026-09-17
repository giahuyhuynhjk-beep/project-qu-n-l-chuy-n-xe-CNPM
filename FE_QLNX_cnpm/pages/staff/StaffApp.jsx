import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StaffLayout from '../../layouts/StaffLayout';

import Tongquan from './Tongquan';
import QuanLyDatVe from './QuanLyDatVe';
import QuanLyChuyenXe from './QuanLyChuyenXe';
import PhanCongTaiXe from './PhanCongTaiXe';
import HotroKH from './HotroKH';
import XacnhanTT from './XacnhanTT';

export default function StaffApp() {
  return (
    <Routes>
      <Route path="/" element={<StaffLayout />}>
        {/* Các trang hiển thị bên trong StaffLayout */}
        <Route index element={<QuanLyDatVe />} />
        <Route path="tongquan" element={<Tongquan />} />
        <Route path="quan-ly-chuyen-xe" element={<QuanLyChuyenXe />} />
        <Route path="driver" element={<PhanCongTaiXe />} />
        <Route path="support" element={<HotroKH />} />
        <Route path="payment" element={<XacnhanTT />} />
        {/* Placeholder cho các trang chưa có */}
        <Route path="status" element={<div>Theo dõi trạng thái</div>} />
        <Route path="refund" element={<div>Xử lý hủy/đổi vé</div>} />
      </Route>
    </Routes>
  );
}
