import { useState } from "react";
import { Plus, RefreshCw, Search, Pencil, Trash2 } from "lucide-react";
import { useAdminResource } from "../../hooks/useAdminResource";

export default function DoctorsPage() {
  const { items, allData, loading, load, busy, error, setError, notice, setNotice, createItem, updateItem, toggleStatus, deleteItem } =
    useAdminResource("doctors");

  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [specialtyId, setSpecialtyId] = useState("");
  const [image, setImage] = useState("");
  const [bio, setBio] = useState("");
  const [isActive, setIsActive] = useState(true);

  function openNew() {
    setEditingId(null);
    setName("");
    setTitle("");
    setEmail("");
    setSpecialtyId("");
    setImage("");
    setBio("");
    setIsActive(true);
    setError("");
    setNotice("");
    setIsFormOpen(true);
  }

  function openEdit(item) {
    setEditingId(item._id);
    setName(item.name || "");
    setTitle(item.title || "");
    setEmail(item.email || "");
    setSpecialtyId(typeof item.specialtyId === "object" ? item.specialtyId?._id || "" : item.specialtyId || "");
    setImage(item.image || "");
    setBio(item.bio || "");
    setIsActive(item.isActive ?? true);
    setError("");
    setNotice("");
    setIsFormOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { name, title, email, specialtyId, image, bio, isActive };
    const ok = editingId ? await updateItem(editingId, payload) : await createItem(payload);
    if (ok) setIsFormOpen(false);
  }

  const getSpecialtyName = (spec) => {
    if (!spec) return "";
    if (typeof spec === "object") return spec.name;
    return allData.specialties.find((s) => s._id === spec)?.name || "";
  };

  const filtered = items.filter((x) =>
    `${x.name} ${x.title} ${x.email}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <div className="section-toolbar">
        <div>
          <h2>الدكاترة</h2>
          <p>أضف بيانات الأطباء واربط كل طبيب بالتخصص الخاص به.</p>
        </div>
        <div className="toolbar-actions">
          <button className="secondary-button" disabled={loading || busy} onClick={load}>
            <RefreshCw size={16} /> تحديث
          </button>
          <button className="primary-button" disabled={busy || loading} onClick={openNew}>
            <Plus size={18} /> إضافة طبيب
          </button>
        </div>
      </div>

      {error && <div className="form-error" role="alert">{error}</div>}
      {notice && <div className="form-success" role="status">{notice}</div>}

      {isFormOpen && (
        <section className="editor-panel">
          <h3>{editingId ? "تعديل بيانات طبيب" : "إضافة طبيب جديد"}</h3>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-grid">
              <label className="field-label">
                اسم الطبيب
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label className="field-label">
                الدرجة / المسمى الوظيفي
                <input type="text" required placeholder="مثال: استشاري جراحة" value={title} onChange={(e) => setTitle(e.target.value)} />
              </label>
              <label className="field-label">
                البريد الإلكتروني
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <label className="field-label">
                التخصص
                <select required value={specialtyId} onChange={(e) => setSpecialtyId(e.target.value)}>
                  <option value="">اختر التخصص</option>
                  {allData.specialties.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} {!s.isActive ? "(متوقف)" : ""}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field-label">
                رابط الصورة (اختياري)
                <input type="url" value={image} onChange={(e) => setImage(e.target.value)} />
              </label>
              <label className="field-label" style={{ gridColumn: "1 / -1" }}>
                نبذة عن الطبيب
                <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
              </label>
            </div>
            <div className="modal-actions">
              <button type="button" className="secondary-button" disabled={busy} onClick={() => setIsFormOpen(false)}>إلغاء</button>
              <button className="primary-button" disabled={busy}>{busy ? "جارٍ الحفظ…" : "حفظ الطبيب"}</button>
            </div>
          </form>
        </section>
      )}

      <div className="table-card">
        <div className="table-toolbar">
          <label className="search-field">
            <Search size={18} />
            <input placeholder="ابحث باسم الطبيب أو المسمى…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <span className="result-count">{filtered.length} طبيب</span>
        </div>

        {loading ? (
          <div className="empty-state">جارٍ تحميل الدكاترة…</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <h3>{query ? "لا توجد نتائج" : "ابدأ بإضافة أول طبيب"}</h3>
            <p>تأكد من إضافة التخصصات أولاً ثم أضف الأطباء.</p>
          </div>
        ) : (
          <div className="data-list">
            {filtered.map((item) => (
              <article className="data-row" key={item._id}>
                <div className="data-primary">
                  <b>{item.name}</b>
                  <small>
                    {item.title} {getSpecialtyName(item.specialtyId) ? `· ${getSpecialtyName(item.specialtyId)}` : ""}
                  </small>
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
                    حذف هذا الطبيب نهائيًا؟{" "}
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