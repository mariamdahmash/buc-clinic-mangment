import { useState } from "react";
import { useOutletContext } from "react-router-dom";

export function useAdminResource(endpoint) {
  const { data, loading, load, request } = useOutletContext();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function runAction(fn, successMessage) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn();
      setNotice(successMessage);
      await load();
      return true;
    } catch (e) {
      setError(e?.message || "تعذر إتمام العملية.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  const createItem = (body) =>
    runAction(() => request(`/${endpoint}`, { method: "POST", body }), "تمت الإضافة بنجاح.");

  const updateItem = (id, body) =>
    runAction(() => request(`/${endpoint}/${id}`, { method: "PUT", body }), "تم التعديل بنجاح.");

  const toggleStatus = (item) =>
    runAction(
      () => request(`/${endpoint}/${item._id}/status`, { method: "PATCH", body: { isActive: !item.isActive } }),
      "تم تحديث الحالة."
    );

  const deleteItem = (id) =>
    runAction(() => request(`/${endpoint}/${id}`, { method: "DELETE" }), "تم الحذف بنجاح.");

  return {
    items: data[endpoint] || [],
    allData: data,
    loading,
    load,
    busy,
    error,
    setError,
    notice,
    setNotice,
    createItem,
    updateItem,
    toggleStatus,
    deleteItem,
  };
}