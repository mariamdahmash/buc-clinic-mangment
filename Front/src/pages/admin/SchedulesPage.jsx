import { useState } from "react";
import { Plus, RefreshCw, Search, Pencil, Trash2 } from "lucide-react";
import { useAdminResource } from "../../hooks/useAdminResource";

export default function SchedulesPage() {
  const { items, allData, loading, load, busy, error, setError, notice, setNotice, createItem, updateItem, toggleStatus, deleteItem } =
    useAdminResource("schedules");

  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slotMinutes, setSlotMinutes] = useState(30);
  const [isActive, setIsActive] = useState(true);

  function openNew() {
    setEditingId(null);
    setDoctorId("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setSlotMinutes(30);
    setIsActive(true);
    setError("");
    setNotice("");
    setIsFormOpen(true);
  }

  function openEdit(item) {
    setEditingId(item._id);
    setDoctorId(typeof item.doctorId === "object" ? item.doctorId?._id || "" : item.doctorId || "");
    setDate(item.date || "");
    setStartTime(item.startTime || "");
    setEndTime(item.endTime || "");
    setSlotMinutes(item.slotMinutes ?? 30);
    setIsActive(item.isActive ?? true);
    setError("");
    setNotice("");
    setIsFormOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      doctorId,
      date,
      startTime,
      endTime,
      slotMinutes: Number(slotMinutes),
      isActive,
    };
    const ok = editingId ? await updateItem(editingId, payload) : await createItem(payload);
    if (ok) setIsFormOpen(false);
  }

  const getDoctorName = (doc) => {
    const id = typeof doc === "object" ? doc?._id : doc;
    return allData.doctors.find((d) => d._id === id)?.name || "طبيب";
  };

  const filtered = items.filter((x) =>
    `${getDoctorName(x.doctorId)} ${x.date}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <div className="section-toolbar">
        <div>
          <h2>جداول العمل</h2>
          <p>أضف فترة بتاريخ محدد. جميع الأوقات بتوقيت القاهرة.</p>
        </div>
        <div className="toolbar-actions">
          <button className="secondary-button" disabled={loading || busy} onClick={load}>
            <RefreshCw size={16} /> تحديث
          </button>
          <button className="primary-button" disabled={busy || loading} onClick={openNew}>
            <Plus size={18} /> إضافة فترة عمل
          </button>
        </div>
      </div>

      {error && <div className="form-error" role="alert">{error}</div>}
      {notice && <div className="form-success" role="status">{notice}</div>}

      {isFormOpen && (
        <section className="editor-panel">
          <h3>{editingId ? "تعديل فترة عمل" : "إضافة فترة عمل جديدة"}</h3>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-grid">
              <label className="field-label">
                الطبيب
                <select required value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
                  <option value="">اختر الطبيب</option>
                  {allData.doctors.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name} {!d.isActive ? "(متوقف)" : ""}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field-label">
                التاريخ
                <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
              <label className="field-label">
                من الساعة
                <input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </label>
              <label className="field-label">
                إلى الساعة
                <input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </label>
              <label className="field-label">
                مدة الكشف بالدقائق
                <input type="number" required min={5} max={120} value={slotMinutes} onChange={(e) => setSlotMinutes(e.target.value)} />
              </label>
            </div>
            <div className="modal-actions">
              <button type="button" className="secondary-button" disabled={busy} onClick={() => setIsFormOpen(false)}>إلغاء</button>
              <button className="primary-button" disabled={busy}>{busy ? "جارٍ الحفظ…" : "حفظ الفترة"}</button>
            </div>
          </form>
        </section>
      )}

      <div className="table-card">
        <div className="table-toolbar">
          <label className="search-field">
            <Search size={18} />
            <input placeholder="ابحث باسم الطبيب أو التاريخ…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <span className="result-count">{filtered.length} فترة</span>
        </div>

        {loading ? (
          <div className="empty-state">جارٍ تحميل جداول العمل…</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <h3>{query ? "لا توجد نتائج" : "ابدأ بإضافة أول فترة عمل"}</h3>
            <p>حدد الطبيب والتاريخ وساعات التواجد لاستقبال الحجوزات.</p>
          </div>
        ) : (
          <div className="data-list">
            {filtered.map((item) => (
              <article className="data-row" key={item._id}>
                <div className="data-primary">
                  <b>{getDoctorName(item.doctorId)} · {item.date}</b>
                  <small>من {item.startTime} إلى {item.endTime} · مدة الكشف {item.slotMinutes} دقيقة</small>
                </div>
                <span className={"state-pill " + (!item.isActive ? "paused" : "")}>
                  {item.isActive ? "نشط" : "متوقف"}
                </span>
                <div className="row-actions">
                  <button className="text-button" disabled={busy} onClick={() => openEdit(item)}>
                    <Pencil size={14} /> تعديل
                  </button>
                  <button className="text-button" disabled={busy} onClick={() => toggleStatus(item)}>
                    {item.isActive ? "تعطيل" : "تفعيل"}
                  </button>
                  <button className="text-button danger" disabled={busy} onClick={() => setDeletingId(item._id)}>
                    <Trash2 size={14} /> حذف
                  </button>
                </div>
                {deletingId === item._id && (
                  <div className="delete-confirm" role="alert">
                    حذف فترة العمل نهائيًا؟{" "}
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