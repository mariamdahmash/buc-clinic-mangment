import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminShell from "../../components/admin/AdminShell";
import { apiRequest } from "../../api/http";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const { token, signOut } = useAuth();
  const [data, setData] = useState({
    specialties: [],
    doctors: [],
    services: [],
    schedules: [],
    bookings: [],
  });
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState("");

  const request = (path, options = {}) => apiRequest(path, { token, ...options });

  async function load() {
    setLoading(true);
    setGlobalError("");
    try {
      const keys = ["specialties", "doctors", "services", "schedules", "bookings"];
      const values = await Promise.all(keys.map((k) => request("/" + k)));
      setData(Object.fromEntries(keys.map((k, i) => [k, values[i]])));
      setClinic(await request("/clinic/me"));
    } catch (e) {
      setGlobalError(e?.message || "حدث خطأ أثناء تحميل البيانات");
      if (e?.status === 401) signOut();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) load();
  }, [token]);

  const counts = Object.fromEntries(
    Object.entries(data).map(([k, arr]) => [k, arr.length])
  );

  return (
    <AdminShell
      title={clinic?.name || "إدارة العيادة"}
      subtitle="كل ما تحتاجه لإدارة يوم العيادة، في مكان واحد."
      counts={counts}
    >
      {globalError && (
        <div className="form-error" role="alert">
          {globalError}
        </div>
      )}

      <Outlet context={{ data, clinic, loading, load, request }} />
    </AdminShell>
  );
}