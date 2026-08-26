
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { login } from '../slices/authSlice';
import { RootState } from '../app/store';
import { Lock, Mail, Eye, EyeOff, Stethoscope, ArrowRight } from 'lucide-react';
import { apiGet, apiPost } from '@/utilz/endpoints';
import { motion, AnimatePresence } from "framer-motion";
import {
  setInitialState
} from '../slices/uiSlice';
import Select from "react-select";
import { showToast } from '@/components/Toast';
import { getRolesForEmployee } from '@/api/roles';
import  LoginBgImg  from '../images/localImages/dental-Login2.jpeg'

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]);

  const baseUrl = import.meta.env.VITE_API_URL;

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const getAllRoles = async () => {
    try {
      const Roles = await getRolesForEmployee();

      // console.log("rrrr", Roles);

      const R = Roles.map((r: any) => ({
        value: r.name,
        label: r.name,
        id: r._id,
      }));

      setRoleOptions(R);
    } catch (error) {
      console.error("Failed to load roles:", error);
    }
  };

  useEffect(() => {
    getAllRoles();
  }, []);

  // const roleOptions = [
  //   { value: "super_admin", label: "Super Admin" },
  //   { value: "admin", label: "Admin" },
  //   { value: "doctor", label: "Doctor" },
  //   { value: "assistant", label: "Dental Assistant" },
  //   { value: "receptionist", label: "Receptionist" },
  //   { value: "pharmacist", label: "Pharmacist" },
  //   { value: "accountant", label: "Accountant" },
  // ];
  const [selectedRole, setSelectedRole] = useState<{
    value: string;
    label: string;
    id: string;
  } | null>(null);

  const [isAdmin, setIsAdmin] = useState(true);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // if (email === 'abc@gamil.com' && password === '123456') {

      setLoading(true);

      // const payload = { email, password }

      // console.log(selectedRole,'sele');


      const payload = {
        email,
        password,
        role: isAdmin ? "6a7a1352cf6822fb3ae371a9" : (selectedRole?.id || null),
      };

      // console.log(" pay : ",payload);


      const login = await apiPost(`${baseUrl}/auth/login`, payload);

      if (!login.token) {
        throw error;
      }

      // console.log("login d : ", login);
      localStorage.setItem('token', JSON.stringify(login.token))
      localStorage.setItem('user', JSON.stringify(login))

      const ui = await apiGet(`${baseUrl}/theme/`);

      // console.log("ui : ", ui);

      showToast({ text: "Login Successfully", type: "success" });

      dispatch(setInitialState(ui))
      setLoading(false)

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error: any) {
      setLoading(false)
      showToast({
        text: "Login failed. Please check your credentials and try again.",
        type: "error",
      });
      console.error(error.message);
      setError('Something went wrong. Please try again.');
      setTimeout(() => {
        setError('');
      }, 3500);
    }
  };


  return (
    <>
      <div
       style={{
        backgroundImage: `url(${LoginBgImg})`,
      }} 
      className="bg-cover bg-center bg-no-repeat min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Background Orbs */}

<div className="  absolute inset-0
  bg-gradient-to-br
  from-blue-700/70
  via-blue-500/40
  to-slate-900/70" >

</div>

        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-primary-500/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[80px]" />
        <div className="  w-full max-w-[380px] relative z-10 animate-in fade-in zoom-in-95 duration-500">
          <div className=" w-full
    rounded-[2rem]
    p-6
    space-y-2

    bg-white/10
    dark:bg-slate-900/20

    backdrop-blur-xl
    backdrop-saturate-150



    
    shadow-2xl shadow-black/20

    text-white
    overflow-hidden">
            <div className=" text-center space-y-0">
              <div className="w-12 h-12 bg-[#3b82f6] rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-primary-500/20 mb-0">
                <Stethoscope size={20} />
              </div>
              <h1 className="text-[20px] font-black tracking-tight">Dental Expert Login</h1>
              <p className="text-white dark:text-white text-xs font-medium uppercase tracking-wider">Clinical Access Portal</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-2">
              <div className="space-y-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black tracking-widest text-white ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white" size={16} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="abc@gamil.com"
                      className="  w-full
  bg-white/10
  dark:bg-white/5
  backdrop-blur-md
  border border-white/20
  rounded-xl
  py-3.5 pl-11 pr-4
  outline-none
  text-white
  placeholder:text-white/50
  focus:ring-2
  focus:ring-blue-400/40
  focus:border-white/40
  text-sm
  font-medium
  transition-all"
                      required
                    />
                  </div>
                </div>


                <div className="space-y-1.5">
                  <label className="text-[10px] font-black  tracking-widest text-white ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white" size={16} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="  w-full
  bg-white/10
  dark:bg-white/5
  backdrop-blur-md
  border border-white/20
  rounded-xl
  py-3.5 pl-11 pr-11
  outline-none
  text-white
  placeholder:text-white/50
  focus:ring-2
  focus:ring-blue-400/40
  focus:border-white/40
  text-sm
  font-medium
  transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* //// */}

                {/* Account Type */}

                <div className="z-[-10] space-y-3">

                  <label className="text-[10px] font-black  tracking-widest text-white ml-1">
                    Account Type
                  </label>

                  <div className=" relative flex bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-1">

                    {/* Animated Background */}
                    <motion.div
                      layout
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                      className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg shadow-md ${isAdmin
                        ? "left-1 bg-blue-500"
                        : "left-[calc(50%+2px)] bg-emerald-500"
                        }`}
                    />

                    <button
                      type="button"
                      onClick={() => setIsAdmin(true)}
                      className={`relative z-10 flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors ${isAdmin ? "text-white" : "text-white"
                        }`}
                    >
                      Admin
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsAdmin(false)}
                      className={`relative z-10 flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors ${!isAdmin ? "text-white" : "text-white"
                        }`}
                    >
                      Staff
                    </button>

                  </div>

                </div>

                {/* <AnimatePresence initial={false}> */}

                {!isAdmin && (

                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                      y: -15,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      y: -15,
                    }}
                    transition={{
                      duration: .35,
                    }}
                    className="overflow-hidden"
                  >

                    <>
                      <label className="text-[10px] font-black  tracking-widest text-white ml-1 block mb-2">
                        Staff Role
                      </label>

                      <Select
                        options={roleOptions}
                        value={selectedRole}
                        onChange={(option) => setSelectedRole(option)}
                        placeholder="Search Staff Role..."
                        isSearchable

                        menuPlacement="top"
                        menuPosition="fixed"
                        menuPortalTarget={document.body}

                        menuShouldScrollIntoView={false}

                        styles={{
                          control: (base, state) => ({
                            ...base,
                            minHeight: "50px",
                            borderRadius: "14px",
                            borderColor: state.isFocused
                              ? "#3b82f6"
                              : "#d1d5db",

                            boxShadow: state.isFocused
                              ? "0 0 0 2px rgba(59,130,246,0.15)"
                              : "none",

                            "&:hover": {
                              borderColor: "#3b82f6",
                            },
                          }),

                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 999999,
                          }),

                          menu: (base) => ({
                            ...base,
                            zIndex: 999999,
                            borderRadius: "12px",
                            overflow: "hidden",
                            marginBottom: "8px",
                          }),

                          // ⭐ MOST IMPORTANT
                          menuList: (base) => ({
                            ...base,
                            maxHeight: "220px",
                            padding: "6px",
                            overflowY: "auto",
                          }),

                          option: (base, state) => ({
                            ...base,
                            borderRadius: "8px",
                            padding: "10px 12px",

                            backgroundColor: state.isSelected
                              ? "#3b82f6"
                              : state.isFocused
                                ? "#dbeafe"
                                : "#ffffff",

                            color: state.isSelected
                              ? "#ffffff"
                              : "#111827",

                            cursor: "pointer",
                          }),
                        }}
                      />
                    </>


                  </motion.div>

                )}

                {/* </AnimatePresence> */}

                {/* //// */}


                {/* //// */}

                {/* <div className="mt-2">
                <Select
                  options={roleOptions}
                  value={selectedRole}
                  onChange={(option) => setSelectedRole(option)}
                  placeholder="Search or Select Role..."
                  isSearchable
                  className="text-sm"
                  menuPlacement="top"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      minHeight: "50px",
                      borderRadius: "12px",
                      borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
                      boxShadow: state.isFocused
                        ? "0 0 0 2px rgba(37,99,235,.2)"
                        : "none",
                      "&:hover": {
                        borderColor: "#2563eb",
                      },
                    }),
                    menu: (base) => ({
                      ...base,
                      borderRadius: "12px",
                      overflow: "hidden",
                      zIndex: 50,
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused
                        ? "#dbeafe"
                        : state.isSelected
                          ? "#2563eb"
                          : "#fff",
                      color: state.isSelected ? "#fff" : "#111827",
                      cursor: "pointer",
                    }),
                  }}
                />
              </div> */}

                {/* //// */}

              </div>

              {error && (
                <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 text-rose-600 p-3 rounded-lg text-[10px] font-bold flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-rose-600 rounded-full" />
                  {error}
                </div>
              )}

              <div className='flex gap-1 ' >
                <button
                  type="submit"
                  disabled={loading}
                  className="  w-full
  bg-white/15
  hover:bg-white/25
  backdrop-blur-md
  border border-white/25
  text-white
  font-black
  py-3.5
  rounded-xl
  shadow-xl shadow-black/10
  flex items-center justify-center gap-2
  transition-all
  active:scale-[0.97]
  group
  text-sm
  
  tracking-widest
  disabled:opacity-70
  disabled:cursor-not-allowed"
                >
                  {loading ? (
                    "Loading ..."
                  ) : (
                    <>
                      Log In <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* <button
                onClick={()=> navigate('/signup')}
                className=" border w-[34%] bg-blue-500 hover:bg-blue-600  text-white font-black py-3.5 rounded-xl shadow-lg shadow-primary-500/10 flex items-center justify-center gap-2 transition-all active:scale-[0.97] group text-sm uppercase tracking-widest disabled:opacity-70 disabled:cursor-not-allowed"
               >
                Sign up
              </button> */}

              </div>

            </form>



            {/* <div className="text-center pt-2">
             <button type="button" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary-500 transition-colors">
               Forgot Access Credentials?
             </button>
          </div> */}
          </div>

          {/* <p className="mt-6 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
            Secured by Dentel Expert Cloud
          </p> */}
        </div>
      </div>
    </>
  );
};

export default Login;
