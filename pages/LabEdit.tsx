// import React from 'react'

// const LabEdit = () => {
//   return (
//     <div>
//       this lab lab Edit 
//     </div>
//   )
// }

// export default LabEdit

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPut } from "@/utilz/endpoints";
import { showToast } from "@/components/Toast";
import { useDispatch, useSelector } from "react-redux";
import { updatelab } from "@/slices/lab";
import { RootState } from '../app/store';
import { ArrowLeft, Loader2, Save } from "lucide-react";

interface LabsForm {
  name: string;
  owner: string;
  phone: string;
  adress: string;
  status: string;
}

const LabEdit: React.FC = () => {
  const { id } = useParams();
  const navi = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();

  const existingLab = useSelector((state: RootState) => state.lab.list.find(p => p.id === id));

  console.log("existingLab :", existingLab);



  const [form, setForm] = useState({
    name: existingLab?.name || "",
    owner: existingLab?.owner || "",
    phone: existingLab?.phone || "",
    adress: existingLab?.adress || "",
    status: existingLab?.status || "Active",
  });

  const [errors, setErrors] = useState<Partial<LabsForm>>({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // =========================
  // 📥 FETCH SINGLE LAB
  // =========================
  // const fetchLab = async () => {
  //   if (!id) return;

  //   setFetching(true);
  //   try {
  //     const res = await apiGet(`${baseUrl}/labs/${id}`);

  //     console.log('res ;;;;',res);


  //     const data = res?.data;

  //     setForm({
  //       labName: data.labName || "",
  //       ownerName: data.ownerName || "",
  //       phone: data.phone || "",
  //       address: data.address || "",
  //       status: data.status || "Active",
  //     });

  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setFetching(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchLab();
  // }, [id]);

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

    console.log('form in v : ', form);

    const ph = String(form.phone || "");

    if (!form.name.trim()) newErrors.name = "Lab name is required";
    if (!form.owner.trim()) newErrors.owner = "Owner name is required";
    if (!ph.trim()) newErrors.phone = "Phone is required";
    // if (!/^03\d{9}$/.test(ph))
    //   newErrors.phone = "Enter valid Pakistani number (03XXXXXXXXX)";
    if (!form.adress.trim()) newErrors.adress = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // 🚀 UPDATE
  // =========================
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !id) return;

    setLoading(true);
    try {
      const res = await apiPut(`${baseUrl}/labs/${id}`, form);

      console.log("Updated Data:", form);
      console.log('res : ', res);

      ////

      const data = {
        id: res?.data?._id,
        name: res?.data?.name,
        owner: res?.data?.owner,
        phone: res?.data?.phone,
        adress: res?.data?.adress,
        status: res?.data?.status,
      }


      if (res) {
        dispatch(updatelab(data));
        showToast({
          text: "Updated successfully",
          type: "success",
        });
        setLoading(false);
        return;
      }

      ////


      // navi("/labs");
    } catch (err) {

      const message = err?.response?.data?.message || "Something went wrong";

      showToast({
        text: message || "Not Updated , try again",
        type: "error",
      });

    }
    finally {
      setLoading(false);
    }
  };

  // =========================
  // ⏳ LOADING UI
  // =========================
  if (fetching) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <p>Loading lab data...</p>
      </div>
    );
  }

  return (

    <>

      <div>

  <div className=" max-w-3xl mx-auto  flex items-center ">
          <button onClick={() => navi(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Edit Lab</h2>
            <p className="text-slate-500">Update record for {existingLab?.name}</p>
          </div>
        </div>
      

        <div className="mt-8 max-w-3xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-md border">

 

          {/* <h2 className="text-2xl font-bold mb-6">Edit Lab</h2> */}

          {/* //// */}



          {/* //// */}

          <form onSubmit={handleUpdate} className="space-y-5">
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
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold"
              >
                {loading ? "Updating..." : "Update Lab"}
              </button> */}

              {/* <div style={{border:'solid 1px green'}} className=" p-8 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3"> */}
                <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all">
                  {/* <Save size={18} /> Update Patient */}

                  {
                    loading ?
                      <div className="w-full flex items-center justify-center animate-in fade-in duration-500">
                        <Loader2 color={'#0ea5e9'} size={25} />
                      </div>
                      :
                      <>
                        <Save size={18} /> Update Patient
                      </>
                  }

                </button>
              {/* </div> */}

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

export default LabEdit;
