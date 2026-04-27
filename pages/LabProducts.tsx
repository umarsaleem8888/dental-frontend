

import React, { useEffect, useState } from "react";
import { Search, Package, Trash2, Edit2, ArrowLeft, Loader2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ConfirmDialog from "@/components/ConfirmDialog";
import Loading from "@/components/loading";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "@/components/Toast";
import { addlabPro, deletelabPro, emptylabPro, updatelabPro } from "@/slices/labProduct";
import { apiDelete, apiGet, apiPost, apiPut } from "@/utilz/endpoints";
import { RootState } from '../app/store';
import { formatDate } from "@/utilz/formateDate";

interface Product {
  // id: string;
  name: string;
  price: number;
  // category: string;
  // createdAt: string;
}

const LabProducts: React.FC = () => {

  const navi = useNavigate();

  const baseUrl = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const AlllabsProductData = useSelector((state: RootState) => state.labProduct.list);

  const { id } = useParams();
  const labId = id;

  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  ////


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productId, setProductId] = useState();

  const [form, setForm] = useState({
    name: "",
    price: "",
  });

  const [errors, setErrors] = useState<{ name?: string; price?: string }>({});

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm({ name: "", price: "" });
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {


    setEditingProduct(product);
    setForm({
      name: product.name,
      price: String(product.price),
    });
    setProductId(product.id || product._id)
    setErrors({});
    setIsModalOpen(true);
  };


  const validate = () => {
    const newErrors: any = {};

    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.price) newErrors.price = "Price is required";
    if (Number(form.price) <= 0) newErrors.price = "Price must be > 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    if (editingProduct) {

      setLoading(true);
      try {
        const res = await apiPut(`${baseUrl}/labproducts/${productId}`, form);

        const data = {
          id: res?.data?._id,
          name: res?.data?.name,
          price: res?.data?.price,
          labName: res.labName,
          createdAt: res?.data?.createdAt,
        }

        ////

        if (res) {
          dispatch(updatelabPro(data));
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
        console.error(err);
      } finally {
        setLoading(false);
      }

      ////////////////



    } else {
      // CREATE
      // const newProduct: Product = {
      //   name: form.name,
      //   price: Number(form.price),
      // };

      setLoading(true);
      try {
        const Getdata = await apiPost(`${baseUrl}/labproducts/${labId}`, form);

        if (Getdata) {

          const data = {
            id: Getdata?.data?._id,
            name: Getdata?.data?.name,
            price: Getdata?.data?.price,
            labName: Getdata?.data?.labName,
            createdAt: Getdata?.data?.createdAt,
          }

          dispatch(addlabPro(data));
          setLoading(false);
          showToast({
            text: "Created Successfully",
            type: "success",
          });

          ////

        }

        // navi("/labs");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }

      ////

      // setProducts((prev) => [newProduct, ...prev]);
    }

    setIsModalOpen(false);
  };


  /////

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const fetchProducts = async () => {

    try {
      let res;
      const link = `${baseUrl}/labproducts/${labId}`;

      res = await apiGet(link);

      return res?.data?.map((m: any) => ({
        id: m?.id || m?._id,
        name: m?.name,
        price: m?.price,
        labName: m?.labName,
        createdAt: m?.createdAt,
      }));

    } catch (err) {
      console.error(err);
      setLoading(false);
    }

  };



  useEffect(() => {
    const loadData = async () => {
      dispatch(emptylabPro());
      try {
        setLoading(true);
        const data = await fetchProducts();

        data?.forEach((m: any) => dispatch(addlabPro(m)));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [dispatch]);


  const filteredProducts = AlllabsProductData?.filter((p: any) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const handleDelete = async () => {

    if (!deleteModal.id) return;

    try {
      if (!deleteModal.id) return;
      const d = await apiDelete(`${baseUrl}/labproducts/${deleteModal.id}`);
      if (d) {
        dispatch(deletelabPro(deleteModal.id));
        showToast({ text: "Deleted Successfully", type: "success" });
      }
    } catch (error: any) {
      showToast({ text: "Not Deleted, try again", type: "error" });
      console.error(error.message);
      alert(error.message);
    }


    setProducts((prev) => prev.filter((p: any) => p.id !== deleteModal.id));
    setDeleteModal({ isOpen: false, id: null });
  };

  // =========================
  // ⏳ LOADING
  // =========================
  // if (loading) {
  //   return (
  //     <div className="h-[70vh] flex items-center justify-center">
  //       <Loading color="#0ea5e9" size="25" />
  //     </div>
  //   );
  // }

  return (
    <>
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* HEADER */}
        <div className="flex justify-between items-center">

          <div className="flex justify-center items-center gap-2 flex-colomns" >
            <ArrowLeft onClick={() => navi(-1)} style={{ cursor: "pointer" }} className="text-gray-500" size={18} />
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Lab Products</h2>
              <p className="text-slate-500 dark:text-slate-400">Manage your Lab's Products records.</p>
            </div>

          </div>

          {/* <Link
          to={`/products/new/${id}`}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold"
        >
          Add Product
        </Link> */}
          <button
            onClick={openCreateModal}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold"
          >
            Add Product
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative w-[300px]">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="p-3 pl-10 rounded-lg border w-full dark:bg-slate-800"
          />
          <Search className="absolute left-3 top-3.5 text-slate-400" size={16} />
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-4 text-xs font-bold">Product</th>
                {/* <th className="px-6 py-4 text-xs font-bold">Category</th> */}
                <th className="px-6 py-4 text-xs font-bold">Price</th>
                <th className="px-6 py-4 text-xs font-bold">Date</th>
                <th className="px-6 py-4 text-right text-xs font-bold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentProducts.map((p: any) => (
                <tr key={p?.id || p?._id} className="border-t hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="px-6 py-4 font-semibold flex items-center gap-2">
                    <Package color="#0ea5e9" size={16} />
                    {p?.name}
                  </td>
                  {/* <td className="px-6 py-4">{p.category}</td> */}
                  <td className="px-6 py-4 font-bold text-emerald-600">
                    Rs. {p?.price}
                  </td>
                  <td className="px-6 py-4"> {formatDate(p?.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {/* <button className="p-2 text-slate-400 hover:text-amber-500">
                      <Edit2 size={16} />
                    </button> */}
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-2 text-slate-400 hover:text-amber-500"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteModal({ isOpen: true, id: p?.id || p._id })
                        }
                        className="p-2 text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* EMPTY */}
          {filteredProducts.length === 0 && (
            <div className="py-16 text-center">
              <Package size={40} className="mx-auto text-slate-300" />
              <p className="text-slate-500 mt-2">No products found</p>
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 border-t">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 border rounded-lg disabled:opacity-40"
              >
                Previous
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg ${currentPage === page
                      ? "bg-primary-600 text-white"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 border rounded-lg disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* DELETE MODAL */}
        <ConfirmDialog
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, id: null })}
          onConfirm={handleDelete}
          title="Delete Product?"
          subtitle="This will permanently remove the product."
        />



      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-[400px] shadow-lg">
            <h3 className="text-xl font-bold mb-4">
              {editingProduct ? "Edit Product" : "Create Product"}
            </h3>

            <div className="space-y-4">
              {/* NAME */}
              <div>
                <label className="text-sm font-semibold">Product Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded-lg dark:bg-slate-800"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name}</p>
                )}
              </div>

              {/* PRICE */}
              <div>
                <label className="text-sm font-semibold">Price</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded-lg dark:bg-slate-800"
                />
                {errors.price && (
                  <p className="text-red-500 text-xs">{errors.price}</p>
                )}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg"
              >
                {loading ? <Loader2 color="white" size="18" /> : (editingProduct ? "Update" : "Create")}
              </button>
            </div>
          </div>
        </div>
      )}

    </>


  );



};

export default LabProducts;