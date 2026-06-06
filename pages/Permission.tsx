// import React, { useState } from "react";

// export default function Permission() {

//   // =========================
//   // Roles
//   // =========================
//   const roles = [
//     "Super Admin",
//     "Admin",
//     "Doctor",
//     "HR",
//   ];

//   // =========================
//   // Modules
//   // =========================
//   const modules = [
//     "Prescription",
//     "Invoice",
//     "Patients",
//     "Appointments",
//     "Employees",
//     "Reports",
//   ];

//   // =========================
//   // Permission Types
//   // =========================
//   const actions = ["create", "read", "update", "delete"];

//   // =========================
//   // Selected Role
//   // =========================
//   const [selectedRole, setSelectedRole] = useState("Super Admin");

//   // =========================
//   // Permissions State
//   // =========================
//   const [permissions, setPermissions] = useState({
//     "Super Admin": {},
//     "Admin": {},
//     "Doctor": {},
//     "HR": {},
//   });

//   // =========================
//   // Toggle Permission
//   // =========================
//   const togglePermission = (module:any, action:any) => {

//     setPermissions((prev) => ({
//       ...prev,

//       [selectedRole]: {
//         ...prev[selectedRole]  ,

//         [module]: {
//           ...prev[selectedRole]?.[module],

//           [action]:
//             !prev[selectedRole]?.[module]?.[action],
//         },
//       },
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-slate-100 p-6">

//       {/* Heading */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold">
//           Permission Management
//         </h1>

//         <p className="text-slate-500 mt-2">
//           Manage roles and permissions
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

//         {/* ========================= */}
//         {/* Left Side Roles */}
//         {/* ========================= */}
//         <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">

//           <h2 className="text-xl font-bold mb-5">
//             Roles
//           </h2>

//           <div className="space-y-3">

//             {roles.map((role) => {

//               const active = selectedRole === role;

//               return (
//                 <button
//                   key={role}
//                   onClick={() => setSelectedRole(role)}
//                   className={`w-full text-left p-4 rounded-2xl transition-all border
                  
//                   ${active
//                       ? "bg-blue-600 text-white border-blue-600"
//                       : "bg-slate-50 hover:bg-slate-100 border-slate-200"
//                     }
                  
//                   `}
//                 >
//                   <p className="font-bold">
//                     {role}
//                   </p>
//                 </button>
//               );
//             })}

//           </div>
//         </div>

//         {/* ========================= */}
//         {/* Right Side Permissions */}
//         {/* ========================= */}
//         <div className="lg:col-span-3 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">

//           <div className="flex items-center justify-between mb-8">

//             <div>
//               <h2 className="text-2xl font-bold">
//                 {selectedRole} Permissions
//               </h2>

//               <p className="text-slate-500 mt-1">
//                 Manage module access
//               </p>
//             </div>

//             <button
//               className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold"
//             >
//               Save
//             </button>
//           </div>

//           {/* Modules */}
//           <div className="space-y-5">

//             {modules.map((module) => (

//               <div
//                 key={module}
//                 className="border border-slate-200 rounded-3xl p-5"
//               >

//                 {/* Module Name */}
//                 <div className="mb-5">
//                   <h3 className="text-xl font-bold">
//                     {module}
//                   </h3>
//                 </div>
// permissions
//                 {/* Actions */}
//                 <div className="flex flex-wrap gap-3">

//                   {actions?.map((action:any) => {

//                     const active = [selectedRole]?.[module]?.[action]  ;

//                     return (
//                       <button
//                         key={action}
//                         onClick={() =>
//                           togglePermission(module, action)
//                         }
//                         className={`px-5 py-3 rounded-2xl font-bold capitalize transition-all
                        
//                         ${active
//                             ? "bg-green-500 text-white"
//                             : "bg-slate-100 text-slate-700"
//                           }
                        
//                         `}
//                       >
//                         {action}
//                       </button>
//                     );
//                   })}

//                 </div>
//               </div>
//             ))}

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
