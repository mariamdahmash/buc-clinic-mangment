import { NavLink } from "react-router-dom";
import {
  Activity,
  Building2,
  LogOut,
  LayoutDashboard,
  Stethoscope,
  Users,
  BriefcaseMedical,
  CalendarClock,
  CalendarCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const clinicLinks = [
  { to: "/clinic-admin", label: "نظرة عامة", icon: LayoutDashboard, end: true },
  { to: "/clinic-admin/specialties", label: "التخصصات", key: "specialties", icon: Stethoscope },
  { to: "/clinic-admin/doctors", label: "الدكاترة", key: "doctors", icon: Users },
  { to: "/clinic-admin/services", label: "الخدمات", key: "services", icon: BriefcaseMedical },
  { to: "/clinic-admin/schedules", label: "جداول العمل", key: "schedules", icon: CalendarClock },
  { to: "/clinic-admin/bookings", label: "الحجوزات", key: "bookings", icon: CalendarCheck },
];

export default function AdminSidebar({ counts }) {
  const { user, signOut } = useAuth();
  const isSuper = user?.role === "superadmin";

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <span className="admin-brand-mark">
          <Activity size={22} />
        </span>
        <span>
          BUC <b>Clinic</b>
          <small>Healthcare workspace</small>
        </span>
      </div>

      <div className="sidebar-label">مساحة العمل</div>

      {isSuper ? (
        <NavLink
          to="/super-admin"
          className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
        >
          <Building2 size={18} />
          إدارة العيادات
        </NavLink>
      ) : (
        <nav aria-label="أقسام العيادة">
          {clinicLinks.map(({ to, label, key, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              style={{ justifyContent: "space-between" }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Icon size={18} />
                {label}
              </span>
              {key && counts && typeof counts[key] === "number" && (
                <small style={{ opacity: 0.85 }}>({counts[key]})</small>
              )}
            </NavLink>
          ))}
        </nav>
      )}

      <div className="sidebar-bottom">
        <div className="user-avatar">{user?.name?.[0] || "U"}</div>
        <div className="user-meta">
          <b>{user?.name || "المستخدم"}</b>
          <small>{isSuper ? "مدير النظام" : "مدير العيادة"}</small>
        </div>
        <button className="icon-button" onClick={signOut} title="تسجيل الخروج">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}