import { useState } from "react";
import { Plus, RefreshCw, Search, Pencil, Trash2 } from "lucide-react";
import { useAdminResource } from "../../hooks/useAdminResource";

export default function BookingsPage() {
  const { items, allData, loading, load, busy, error, setError, notice, setNotice, createItem, updateItem, toggleStatus, deleteItem } =
    useAdminResource("bookings");

  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [scheduleId, setScheduleId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [isActive, setIsActive] = useState(true);

  const getDoctorName = (doc) => {
    const id = typeof doc === "object" ? doc?._id : doc;
    return allData.doctors.find((d) => d._id === id)?.name || "طبيب";
  };

  function getAvailableSlots() {
    const schedule = allData.schedules.find((s) => s._id === scheduleId);
    if (!schedule) return [];

    const toMinutes = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
    const slots = [];

    for (
      let m = toMinutes(schedule.startTime);
      m + schedule.slotMinutes <= toMinutes(schedule.endTime);
      m += schedule.slotMinutes
    ) {
      const formatted = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
      const isTaken = items.some(
        (b) => b._id !== editingId && b.isActive && b.scheduleId === schedule._id && b.startTime === formatted
      );
      if (!isTaken) slots.push(formatted);
    }
    return slots;
  }

  function openNew() {
    setEditingId(null);
    setPatientName("");
    setPhone("");
    setScheduleId("");
    setStartTime("");
    setIsActive(true);
    setError("");
    setNotice("");
    setIsFormOpen(true);
  }

  function openEdit(item) {
    setEditingId(item._id);
    setPatientName(item.patientName || "");
    setPhone(item.phone || "");
    setScheduleId(typeof item.scheduleId === "object" ? item.scheduleId?._id || "" : item.scheduleId || "");
    setStartTime(item.startTime || "");
    setIsActive(item.isActive ?? true);
    setError("");
    setNotice("");
    setIsFormOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { patientName, phone, scheduleId, startTime, isActive };
    const ok = editingId ? await updateItem(editingId, payload) : await createItem(payload);
    if (ok) setIsFormOpen(false);
  }

  const filtered = items.filter((x) =>
    `${x.patientName} ${x.phone} ${x.date} ${getDoctorName(x.doctorId)}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <div className="section-toolbar">
        <div>
          <h2>الحجوزات</h2>
          <p>حجوزات الموقع والاستقبال. إلغاء الحجز يتيح الوقت من جديد.</p>
        </div>
        <div className="toolbar-actions">
          <button className="secondary-button" disabled={loading || busy} onClick={load}>
            <RefreshCw size={16} /> تحديث
          </button>
          <button className="primary-button" disabled={busy || loading} onClick={openNew}>
            <Plus size={18} /> إضافة حجز
          </button>
        </div>
      </div>

      {error && <div className="form-error" role="alert">{error}</div>}
      {notice && <div className="form-success" role="status">{notice}</div>}

      {isFormOpen && (
        <section className="editor-panel">
          <h3>{editingId ? "تعديل حجز" : "تسجيل حجز جديد"}</h3>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-grid">
              <label className="field-label">
                اسم المريض
                <input type="text" required value={patientName} onChange={(e) => setPatientName(e.target.value)} />
              </label>
              <label className="field-label">
                رقم التواصل
                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>
              <label className="field-label">
                فترة العمل
                <select
                  required
                  value={scheduleId}
                  onChange={(e) => {
                    setScheduleId(e.target.value);
                    setStartTime("");
                  }}
                >
                  <option value="">اختر فترة العمل</option>
                  {allData.schedules
                    .filter((s) => s.isActive || s._id === scheduleId)
                    .map((s) => (
                      <option key={s._id} value={s._id}>
                        {getDoctorName(s.doctorId)} · {s.date} · {s.startTime}–{s.endTime}
                      </option>
                    ))}
                </select>
              </label>
              <label className="field-label">
                وقت الكشف
                <select required value={startTime} onChange={(e) => setStartTime(e.target.value)} disabled={!scheduleId}>
                  <option value="">اختر الوقت المتاح</option>
                  {getAvailableSlots().map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="modal-actions">
              <button type="button" className="secondary-button" disabled={busy} onClick={() => setIsFormOpen(false)}>إلغاء</button>
              <button className="primary-button" disabled={busy}>{busy ? "جارٍ الحفظ…" : "تأكيد الحجز"}</button>
            </div>
          </form>
        </section>
      )}

      <div className="table-card">
        <div className="table-toolbar">
          <label className="search-field">
            <Search size={18} />
            <input placeholder="ابحث باسم المريض أو الهاتف أو الطبيب…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <span className="result-count">{filtered.length} حجز</span>
        </div>

        {loading ? (
          <div className="empty-state">جارٍ تحميل الحجوزات…</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <h3>{query ? "لا توجد نتائج" : "لا توجد حجوزات مسجلة بعد"}</h3>
            <p>استخدم زر الإضافة بالأعلى لتسجيل حجز استقبال.</p>
          </div>
        ) : (
          <div className="data-list">
            {filtered.map((item) => (
              <article className="data-row" key={item._id}>
                <div className="data-primary">
                  <b>{item.patientName}</b>
                  <small>
                    {getDoctorName(item.doctorId)} · {item.date} · {item.startTime} · {item.phone}
                  </small>
                </div>
                <span className={"state-pill " + (!item.isActive ? "paused" : "")}>
                  {item.isActive ? "حجز فعال" : "ملغي"}
                </span>
                <div className="row-actions">
                  <button className="text-button" disabled={busy} onClick={() => openEdit(item)}>
                    <Pencil size={14} /> تعديل
                  </button>
                  <button className="text-button" disabled={busy} onClick={() => toggleStatus(item)}>
                    {item.isActive ? "إلغاء الحجز" : "تفعيل"}
                  </button>
                  <button className="text-button danger" disabled={busy} onClick={() => setDeletingId(item._id)}>
                    <Trash2 size={14} /> حذف
                  </button>
                </div>
                {deletingId === item._id && (
                  <div className="delete-confirm" role="alert">
                    حذف سجل الحجز نهائيًا؟{" "}
                    <button className="secondary-button" disabled={busy} onClick={() => setDeletingId(null)}>رجوع</button>
                    <button className="primary-button danger-bg" disabled={busy} onClick={async () => { await deleteItem(item._id); setDeletingId(null); }}>
                      تأكيد الحذف
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}