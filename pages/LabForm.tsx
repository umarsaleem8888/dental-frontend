// import React from 'react'

// const LabForm = () => {
//   return (
//     <div>
//       this is lab form
//     </div>
//   )
// }

// export default LabForm

import { showToast } from "@/components/Toast";
import { addlab } from "@/slices/lab";
import { addPatient } from "@/slices/patientsSlice";
import { apiPost } from "@/utilz/endpoints";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { apiPost } from "@/utilz/endpoints";

interface LabsForm {
  name: string;
  owner: string;
  phone: string;
  adress: string;
  status: string;
}

const LabForm: React.FC = () => {
  const navi = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();

  const [form, setForm] = useState<LabsForm>({
    name: "",
    owner: "",
    phone: "",
    adress: "",
    status: "Active",
  });

  const [errors, setErrors] = useState<Partial<LabsForm>>({});
  const [loading, setLoading] = useState(false);

  // =========================
  // ✏️ HANDLE CHANGE
  // =========================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =========================
  // ✅ VALIDATION
  // =========================
  const validate = () => {
    const newErrors: Partial<LabsForm> = {};

    const ph = String(form.phone || "");

    if (!form.name.trim()) newErrors.name = "Lab name is required";
    if (!form.owner.trim()) newErrors.owner = "Owner name is required";
    if (!ph.trim()) newErrors.phone = "Phone is required";
    // if (!/^03\d{9}$/.test(form.phone))
    //   newErrors.phone = "Enter valid Pakistani number (03XXXXXXXXX)";
    if (!form.adress.trim()) newErrors.adress = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // 🚀 SUBMIT
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {

      const Getdata = await apiPost(`${baseUrl}/labs`, form);

      console.log("Submitted Data:", form);
      console.log('res : ', Getdata);

      ////

      if (Getdata) {

        console.log("data : ", Getdata);


        const data = {
          id: Getdata?.data?._id,
          name: Getdata?.data?.name,
          phone: Getdata?.data?.phone,
          owner: Getdata?.data?.owner,
          adress: Getdata?.data?.adress,
          status: Getdata?.data?.status,
        }

        console.log("p data : ", data);


        dispatch(addlab(data));
        setLoading(false);
        showToast({
          text: "Created Successfully",
          type: "success",
        });

        ////

      }

      // navi("/labs");
    } catch (err) {

      const message = err?.response?.data?.message || "Something went wrong";

      showToast({
        text: message || "Not Updated , try again",
        type: "error",
      });

    } finally {
      setLoading(false);
    }
  };

  return (

    <>
      <div>
        <div className="flex items-center max-w-3xl mx-auto">
          <button onClick={() => navi(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Register Lab</h2>
            <p className="text-slate-500">Add a new Lab to the clinical database.</p>
          </div>
        </div>

        <div className="mt-8 max-w-3xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-md border">
          {/* <h2 className="text-2xl font-bold mb-6">Create Lab</h2> */}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* LAB NAME */}
            <div>
              <label className="text-sm font-semibold">Lab Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-lg border dark:bg-slate-800"
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name}</p>
              )}
            </div>

            {/* OWNER */}
            <div>
              <label className="text-sm font-semibold">Owner Name</label>
              <input
                type="text"
                name="owner"
                value={form.owner}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-lg border dark:bg-slate-800"
              />
              {errors.owner && (
                <p className="text-red-500 text-xs">{errors.owner}</p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm font-semibold">Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="03XXXXXXXXX"
                className="w-full mt-1 p-3 rounded-lg border dark:bg-slate-800"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone}</p>
              )}
            </div>

            {/* ADDRESS */}
            <div>
              <label className="text-sm font-semibold">Address</label>
              <input
                type="text"
                name="adress"
                value={form.adress}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-lg border dark:bg-slate-800"
              />
              {errors.adress && (
                <p className="text-red-500 text-xs">{errors.adress}</p>
              )}
            </div>

            {/* STATUS */}
            <div>
              <label className="text-sm font-semibold">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-lg border dark:bg-slate-800"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 pt-4">
              {/* <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold"
          >
            {loading ? "Creating..." : "Create Lab"}
          </button> */}

              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary-500/20 transition-all active:scale-95"
              >
                {
                  loading ?
                    <div className="w-full flex items-center justify-center animate-in fade-in duration-500">
                      <Loader2 color={'#0ea5e9'} size={25} />
                    </div>
                    :
                    <>
                      <Save size={18} /> Register Lab
                    </>
                }
              </button>

              <button
                type="button"
                onClick={() => navi(-1)}
                className="px-6 py-3 rounded-xl border font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>

  );
};

export default LabForm;
