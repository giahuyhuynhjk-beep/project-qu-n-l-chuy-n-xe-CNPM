import React, { useMemo, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import AccountManagement from "./AccountManagement";
import AdminDashboard from "./AdminDashboard";
import AssignmentManagement from "./AssignmentManagement";
import BookingManagementAdmin from "./BookingManagementAdmin";
import FareManagement from "./FareManagement";
import RefundManagement from "./RefundManagement";
import ReportsDashboard from "./ReportsDashboard";
import RouteManagement from "./RouteManagement";
import ScheduleManagement from "./ScheduleManagement";
import VehicleManagement from "./VehicleManagement";
import QuanLyChuyenXe from "../staff/QuanLyChuyenXe";

const pageMap = {
  dashboard: AdminDashboard,
  trips: QuanLyChuyenXe,
  assignments: AssignmentManagement,
  bookings: BookingManagementAdmin,
  accounts: AccountManagement,
  vehicles: VehicleManagement,
  routes: RouteManagement,
  schedules: ScheduleManagement,
  fares: FareManagement,
  reports: ReportsDashboard,
  refunds: RefundManagement,
};

export default function AdminApp() {
  const [activePage, setActivePage] = useState("trips");
  const Page = useMemo(() => pageMap[activePage] || QuanLyChuyenXe, [activePage]);

  return (
    <AdminLayout activeKey={activePage} onChangePage={setActivePage}>
      <Page onChangePage={setActivePage} />
    </AdminLayout>
  );
}
