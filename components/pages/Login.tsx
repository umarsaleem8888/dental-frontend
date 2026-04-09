
// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, Navigate } from 'react-router-dom';
// import { login } from '../slices/authSlice';
// import { RootState } from '../app/store';
// import { Lock, Mail, Eye, EyeOff, Stethoscope, ArrowRight } from 'lucide-react';

// const Login: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { isAuthenticated } = useSelector((state: RootState) => state.auth);

//   if (isAuthenticated) return <Navigate to="/dashboard" replace />;

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Requested credentials: abc@gamil.com / 123456
//     if (email === 'abc@gamil.com' && password === '123456') {
//       dispatch(login({ email }));
//       navigate('/dashboard');
//     } else {
//       setError('Invalid credentials. Hint: abc@gamil.com / 123456');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
//       {/* Background Orbs */}
//       <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-primary-500/10 rounded-full blur-[80px]" />
//       <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[80px]" />

//       <div className="w-full max-w-[380px] relative z-10 animate-in fade-in zoom-in-95 duration-500">
//         <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-8 space-y-6">
//           <div className="text-center space-y-2">
//             <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-primary-500/20 mb-4">
//               <Stethoscope size={28} />
//             </div>
//             <h1 className="text-2xl font-black tracking-tight">DentFlow Login</h1>
//             <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">Clinical Access Portal</p>
//           </div>

//           <form onSubmit={handleLogin} className="space-y-5">
//             <div className="space-y-4">
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
//                 <div className="relative">
//                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//                   <input 
//                     type="email" 
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="abc@gamil.com"
//                     className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-primary-500/20 text-sm font-medium transition-all"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
//                 <div className="relative">
//                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//                   <input 
//                     type={showPassword ? "text" : "password"}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="••••••••"
//                     className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3.5 pl-11 pr-11 outline-none focus:ring-2 focus:ring-primary-500/20 text-sm font-medium transition-all"
//                     required
//                   />
//                   <button 
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
//                   >
//                     {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {error && (
//               <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 text-rose-600 p-3 rounded-lg text-[10px] font-bold flex items-center gap-2">
//                 <div className="w-1.5 h-1.5 bg-rose-600 rounded-full" />
//                 {error}
//               </div>
//             )}

//             <button 
//               type="submit" 
//               className="w-full bg-primary-600 text-white font-black py-3.5 rounded-xl shadow-lg shadow-primary-500/10 flex items-center justify-center gap-2 transition-all active:scale-[0.97] group text-sm uppercase tracking-widest"
//             >
//               Log In <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
//             </button>
//           </form>

//           <div className="text-center pt-2">
//              <button type="button" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary-500 transition-colors">
//                Forgot Access Credentials?
//              </button>
//           </div>
//         </div>
        
//         <p className="mt-6 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
//            Secured by DentFlow Cloud
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;
