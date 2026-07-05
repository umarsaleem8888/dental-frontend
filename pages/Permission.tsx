import ConfirmDialog from "@/components/ConfirmDialog";
import CustomTooltip from "@/components/CustomTooltip";
import Modal from "@/components/Modal";
import { showToast } from "@/components/Toast";
import { apiDelete } from "@/utilz/endpoints";
import { BookText, Check, DeleteIcon, Edit2, Eye, EyeClosed, EyeOff, Folder, Minus, Notebook, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import React, { useState } from "react";

export default function Permission() {

    const baseUrl = import.meta.env.VITE_API_URL;

    const actionIcons = {
        read: <Eye size={16} />,
        create: <Plus size={16} />,
        update: <Pencil size={16} />,
        delete: <Trash2 size={16} />,
    };

    const actionTooltips: Record<string, string> = {
        create: "Allows users to create new records.",
        read: "Allows users to view existing records.",
        update: "Allows users to edit existing records.",
        delete: "Allows users to permanently remove records.",
    };

    const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(
        {}
    );

    const toggleModule = (module: string) => {
        setExpandedModules((prev) => ({
            ...prev,
            [module]: !prev[module],
        }));
    };

    // =========================
    // Roles
    // =========================
    const roles = [
        "Super Admin",
        "Admin",
        "Doctor",
        "HR",
    ];

    // =========================
    // Modules
    // =========================
    const modules = [
        "Prescription",
        "Invoice",
        "Patients",
        "Appointments",
        "Employees",
        "Reports",
    ];

    // =========================
    // Permission Types
    // =========================
    const actions = ["create", "read", "update", "delete"];

    // =========================
    // Selected Role
    // =========================
    const [selectedRole, setSelectedRole] = useState("Super Admin");

    // =========================
    // Permissions State
    // =========================
    const [permissions, setPermissions] = useState({
        "Super Admin": {},
        "Admin": {},
        "Doctor": {},
        "HR": {},
    });

    const [openRoleModal, setOpenRoleModal] = useState(false);

    const [editingRole, setEditingRole] = useState<string | null>(null);

    const [roleName, setRoleName] = useState("");

    const handleEditRole = (role: string) => {
        setEditingRole(role);
        setRoleName(role);
        setOpenRoleModal(true);
    };

    const [moduleVisibility, setModuleVisibility] = useState<
        Record<string, boolean>
    >({});

    const toggleModuleVisibility = (module: string) => {
        setModuleVisibility((prev) => ({
            ...prev,
            [module]: !prev[module],
        }));
    };

    // =========================
    // Toggle Permission
    // =========================
    const togglePermission = (module: any, action: any) => {

        setPermissions((prev: any) => ({
            ...prev,

            [selectedRole]: {
                ...prev[selectedRole],

                [module]: {
                    ...prev[selectedRole]?.[module],

                    [action]:
                        !prev[selectedRole]?.[module]?.[action],
                },
            },
        }));
    };

    const [editMode, setEditMode] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
        isOpen: false,
        id: null
    });

    const handleDelete = async () => {
        try {
            if (!deleteModal.id) return;
            const d = await apiDelete(`${baseUrl}/patient/${deleteModal.id}`);
            if (d) {
                // dispatch(deletePatient(deleteModal.id));
                showToast({ text: "Deleted Successfully", type: "success" });
            }
        } catch (error: any) {
            showToast({ text: "Not Deleted, try again", type: "error" });
            console.error(error.message);
            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 p-6 rounded-xl">

            {/* Heading */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Permission Management
                </h1>

                <p className="text-slate-500 mt-2">
                    Manage roles and permissions
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* ========================= */}
                {/* Left Side Roles */}
                {/* ========================= */}
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">

                    <div className="mb-6 flex flex-col items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-md">

                        <div className=" w-full" >

                            <h2 className="text-2xl font-bold text-slate-800 flex gap-2">
                                Roles <BookText />
                            </h2>

                            <p className=" text-sm text-slate-500">
                                Create, update and manage system roles.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setEditingRole(null);
                                setRoleName("");
                                setOpenRoleModal(true);
                            }}
                            className="
        flex
        items-center
        gap-2
        rounded-xl
        bg-blue-600
        px-5
        py-3
        text-white
        font-semibold
        shadow-md
        transition-all
        duration-300
        hover:bg-blue-700
        hover:scale-105
        active:scale-95
        mt-5
    "
                        >
                            <Plus size={18} />
                            Create Role
                        </button>

                    </div>


                    <div className="space-y-3">

                        {roles?.map((role) => {

                            const active = selectedRole === role;

                            return (
                                <button
                                    key={role}
                                    onClick={() => setSelectedRole(role)}
                                    className={`w-full text-left p-4 rounded-2xl transition-all  shadow-md`}
                                >
                                    <div className="flex justify-between items-center" >
                                        <div className={`flex gap-2 items-center `} >
                                            <div
                                                className={`
                                                             rounded-full bg-blue-600
                                                            transition-all duration-300 ease-in-out
                                                            ${active ? "scale-100 opacity-100 h-2 w-2" : "scale-0 opacity-0 h-0 w-0"}
                                                         `}
                                            />
                                            <p className={`font-bold ${active ? "text-blue-600" : "text-black"}`}>
                                                {role}
                                            </p>
                                        </div>
                                        <div className="flex gap-2" >
                                            <Edit2
                                                size={14}
                                                color="green"
                                                className="cursor-pointer"
                                                onClick={() => handleEditRole(role)}
                                            />
                                            <Trash2 size={16} onClick={() => setDeleteModal({ isOpen: true, id: '098' })} color="red" />
                                        </div>

                                    </div>
                                </button>
                            );
                        })}

                    </div>
                </div>

                {/* ========================= */}
                {/* Right Side Permissions */}
                {/* ========================= */}
                <div className="lg:col-span-3 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">

                    <div className="flex items-center justify-between mb-8">

                        <div>
                            <h2
                                className={`
                                             text-blue-500 text-2xl font-bold
                                             transition-all duration-300 ease-in-out
                                             opacity-100 translate-y-0
                                           `}
                                key={selectedRole}
                            >
                                {selectedRole} Permissions
                            </h2>

                            <p className="text-slate-500 mt-1">
                                Manage module access
                            </p>
                        </div>

                        <button
                            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex gap-2"
                        >
                            Save <Save size={18} />
                        </button>
                    </div>

                    {/* Modules */}
                    <div className="space-y-5 ">

                        {modules?.map((module) => (
                            <div
                                key={module}
                                className="rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-300 p-6"
                            >
                                {/* Module Header */}
                                <div className="flex items-center justify-between mb-4 border-b pb-4">

                                    <div className="flex items-center gap-3">

                                        <div className="h-11 w-11 rounded-xl bg-blue-100 flex items-center justify-center">
                                            <Folder className="text-blue-600" size={22} />
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-lg">
                                                {module}
                                            </h3>

                                            <p className="text-sm text-slate-500">
                                                Manage {module} permissions
                                            </p>
                                        </div>

                                    </div>

                                    <button
                                        onClick={() => toggleModule(module)}
                                        className="
            h-10
            w-10
            rounded-xl
            bg-slate-100
            hover:bg-blue-100
            transition-all
            duration-300
            flex
            items-center
            justify-center
        "
                                    >
                                        <div
                                            className="
                transition-all
                duration-300
            "
                                        >
                                            {expandedModules[module] ? (
                                                <Minus className="text-blue-600" size={20} />
                                            ) : (
                                                <Plus className="text-blue-600" size={20} />
                                            )}
                                        </div>
                                    </button>

                                </div>

                                {/* visibility //// */}

                                <div className="mb-6 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50">

                                    <div className="flex items-center gap-3">

                                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <Eye size={18} className="text-blue-600" />
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-slate-800">
                                                Module Visibility
                                            </h4>

                                            <p className="text-xs text-slate-500">
                                                Control whether this module appears for the selected role.
                                            </p>
                                        </div>

                                    </div>

                                    {/* Switch */}

                                    <button
                                        onClick={() => toggleModuleVisibility(module)}
                                        className={`
        relative
        h-7
        w-14
        rounded-full
        transition-all
        duration-300
        ${moduleVisibility[module]
                                                ? "bg-green-500"
                                                : "bg-slate-300"
                                            }
    `}
                                    >
                                        <div
                                            className={`
            absolute
            top-1
            h-5
            w-5
            rounded-full
            bg-white
            shadow-md
            transition-all
            duration-300
            flex
            items-center
            justify-center
            ${moduleVisibility[module]
                                                    ? "translate-x-8"
                                                    : "translate-x-1"
                                                }
        `}
                                        >
                                            {moduleVisibility[module] ? (
                                                <Eye
                                                    size={12}
                                                    className="text-green-600 transition-all duration-300"
                                                />
                                            ) : (
                                                <EyeClosed
                                                    size={12}
                                                    className="text-slate-500 transition-all duration-300"
                                                />
                                            )}
                                        </div>
                                    </button>

                                </div>

                                {/* //// */}

                                {/* Actions */}

                                {/* //// */}

                                <div
                                    className={`
                                                overflow-hidden
                                                transition-all
                                                duration-500
                                                ease-in-out
                                                ${expandedModules[module]
                                            ? "max-h-[500px] opacity-100 mt-4"
                                            : "max-h-0 opacity-0"
                                        }
                                          `}
                                >
                                    <div
                                        className={`
         
            transition-all
            duration-300
            ${moduleVisibility[module]
                                                ? "opacity-100"
                                                : "opacity-40 pointer-events-none"
                                            }
        `}
                                    >


                                        <div className="  grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {actions?.map((action) => {

                                                const active = (permissions as any)?.[selectedRole]?.[module]?.[action];

                                                return (

                                                    <CustomTooltip
                                                        content={actionTooltips[action]}
                                                    >

                                                        <button
                                                            key={action}
                                                            onClick={() => togglePermission(module, action)}
                                                            className={`
        group
        relative
        rounded-xl
        border
        px-4
        py-3
        transition-all
        duration-300
        flex
        items-center
        justify-between
        hover:scale-[1.03]
        ${active
                                                                    ? "border-green-200 bg-green-50"
                                                                    : "border-slate-200 bg-white"
                                                                }
    `}
                                                        >
                                                            {/* Tooltip */}
                                                            <div
                                                                className="
            pointer-events-none
            absolute
            -top-12
            left-1/2
            -translate-x-1/2
            whitespace-nowrap
            rounded-lg
            bg-slate-900
            px-3
            py-2
            text-xs
            text-white
            opacity-0
            transition-all
            duration-200
            group-hover:opacity-100
            group-hover:-translate-y-1
            shadow-lg
            z-50
        "
                                                            >
                                                                {actionTooltips[action] ?? `Manage ${action} permission`}

                                                                {/* Arrow */}
                                                                <div
                                                                    className="
                absolute
                left-1/2
                top-full
                -translate-x-1/2
                border-4
                border-transparent
                border-t-slate-900
            "
                                                                />
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                {actionIcons[action as keyof typeof actionIcons] ?? (
                                                                    <Folder size={16} />
                                                                )}

                                                                <span className="capitalize font-medium">
                                                                    {action}
                                                                </span>
                                                            </div>

                                                            {active ? (
                                                                <div className="h-7 w-7 rounded-full bg-green-500 flex items-center justify-center">
                                                                    <Check size={15} className="text-white" />
                                                                </div>
                                                            ) : (
                                                                <div className="h-7 w-7 rounded-full bg-red-500 flex items-center justify-center">
                                                                    <X size={15} className="text-white" />
                                                                </div>
                                                            )}
                                                        </button>

                                                    </CustomTooltip>

                                                );
                                            })}
                                        </div>
                                    </div>

                                </div>

                                {/* ///// */}

                            </div>
                        ))}

                    </div>
                </div>
            </div>
            {/* //// */}

            <ConfirmDialog
                isOpen={deleteModal?.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={handleDelete}
                title="Delete User Role ?"
                subtitle="This will permanently remove the User-Role"
                button={''}
            />

            {/* //// */}

            <Modal
                isOpen={openRoleModal}
                onClose={() => setOpenRoleModal(false)}
                title={editingRole ? "Edit Role" : "Create Role"}
            >

                <div className="space-y-6 ">

                    <div>

                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Role Name
                        </label>

                        <input
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            placeholder="e.g. Receptionist"
                            className="
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    px-4
                    py-3
                    outline-none
                    transition-all
                    duration-300
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                "
                        />

                        <p className="mt-2 text-xs text-slate-500">
                            Enter a unique role name for your organization.
                        </p>

                    </div>

                    <div className="flex justify-end gap-3">

                        <button
                            onClick={() => setOpenRoleModal(false)}
                            className="
                    rounded-xl
                    border
                    border-slate-300
                    px-5
                    py-2.5
                    font-medium
                    transition-all
                    hover:bg-slate-100
                "
                        >
                            Cancel
                        </button>

                        <button
                            className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-blue-600
                    px-5
                    py-2.5
                    text-white
                    font-semibold
                    transition-all
                    duration-300
                    hover:bg-blue-700
                    active:scale-95
                "
                        >
                            {editingRole ? (
                                <>
                                    <Save size={18} />
                                    Update Role
                                </>
                            ) : (
                                <>
                                    <Plus size={18} />
                                    Create Role
                                </>
                            )}
                        </button>

                    </div>

                </div>

            </Modal>

            {/* //// */}
        </div>

    );
}
