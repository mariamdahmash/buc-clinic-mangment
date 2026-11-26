import { Link, useOutletContext } from "react-router-dom";
import { adminSections } from "../../config/adminSections";

export default function ClinicOverview() {
  const { data, clinic, loading } = useOutletContext();

  if (loading) {
    return <div className="empty-state">جارٍ تحميل ملخص العيادة…</div>;
  }

  return (
    <>
      <div className="workspace-intro">
        <div>
          <span className="eyebrow">مساحة عيادتك</span>
          <h2>يوم منظم، ورعاية أفضل.</h2>
          <p>أضف التخصصات، ثم الدكاترة وفترات العمل لاستقبال الحجوزات.</p>
        </div>
        {clinic?.slug && (
          <a
            className="secondary-button"
            href={`/${clinic.slug}`}
            target="_blank"
            rel="noreferrer"
          >
            عرض موقع العيادة ↗
          </a>
        )}
      </div>

      <div className="stats-grid">
        {[
          ["الدكاترة النشطون", data.doctors, "/clinic-admin/doctors"],
          ["فترات العمل", data.schedules, "/clinic-admin/schedules"],
          ["الحجوزات الفعالة", data.bookings, "/clinic-admin/bookings"],
        ].map(([label, items, path]) => (
          <Link to={path} className="stat-card" key={label} style={{ textDecoration: "none", color: "inherit" }}>
            <span>{label}</span>
            <strong>{items.filter((x) => x.isActive).length}</strong>
            <small>مسجل بالعيادة</small>
          </Link>
        ))}
      </div>

      <div className="stats-grid" style={{ marginTop: "1rem" }}>
        {Object.entries(adminSections).map(([key, sec]) => (
          <Link
            key={key}
            to={`/clinic-admin/${key}`}
            className="stat-card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <span>إدارة {sec.label}</span>
            <strong>{data[key]?.length || 0}</strong>
            <small>اضغط للفتح والتعديل ←</small>
          </Link>
        ))}
      </div>
    </>
  );
}