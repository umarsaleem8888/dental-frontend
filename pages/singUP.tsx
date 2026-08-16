import { getRolesForEmployee } from "@/api/roles";
import { showToast } from "@/components/Toast";
import { apiPost } from "@/utilz/endpoints";
import { BriefcaseBusiness, EqualApproximatelyIcon, EyeClosed, EyeIcon, Lock, Mail, MapPinHouse, PersonStandingIcon, Plus, PlusCircle, User2Icon, UserRoundPen, UserStar } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
// import { FaEye, FaEyeSlash, FaUserMd } from "react-icons/fa";
// import { MdEmail, MdLock, MdPerson } from "react-icons/md";

const Signup = () => {

    const baseUrl = import.meta.env.VITE_API_URL;

    const Navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [roleOptions, setRoleOptions] = useState([]);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        designation: "",
        department: "",
        experience: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const payload = {
                ...formData,
                role: selectedRole?.value,
            };

            console.log(payload);

            //////////////////

            const Created = await apiPost(`${baseUrl}/auth/signup`, payload);

            if (Created) {
                console.log("c : ", Created);

                showToast({ text: "Created Successfully", type: "success" });
            }
            else {
                console.log('sdfsdf error');

                showToast({ text: "not register", type: "error" });
            }
        }
        catch (err) {

            // console.log('in  error',err);

            showToast({ text: "not register", type: "error" });

        }



    };

    const getAllRoles = async () => {
        try {
            const Roles = await getRolesForEmployee();

            console.log("rrrr", Roles);

            const R = Roles.map((r: any) => ({
                value: r._id || r.id,
                label: r.name || r.name,
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
    //     { value: "super_admin", label: "Super Admin" },
    //     { value: "admin", label: "Admin" },
    //     { value: "doctor", label: "Doctor" },
    //     { value: "assistant", label: "Dental Assistant" },
    //     { value: "receptionist", label: "Receptionist" },
    //     { value: "pharmacist", label: "Pharmacist" },
    //     { value: "accountant", label: "Accountant" },
    // ];
    const [selectedRole, setSelectedRole] = useState<{
        value: string;
        label: string;
    } | null>(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-blue-100 flex items-center justify-center p-6">

            <div className="w-[90%] max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-1">

                {/* Left Side */}
                {/* <div className="hidden lg:flex flex-col justify-center bg-blue-600 text-white p-12 relative">

                    <div className="absolute inset-0 opacity-10">
                        <div className="w-full h-full bg-[radial-gradient(circle_at_top_right,white,transparent_50%)]"></div>
                    </div>

                    <div className="relative z-10">

                        <div className="w-20 h-20 rounded-full bg-white text-blue-600 flex items-center justify-center text-4xl mb-8">

                            <User2Icon />
                        </div>

                        <h1 className="text-4xl font-bold leading-tight">
                            Welcome to
                            <br />
                            Dental Expert
                        </h1>

                        <p className="mt-6 text-blue-100 text-lg leading-8">
                            Create your account and manage patients, appointments,
                            prescriptions, billing, and clinic operations efficiently.
                        </p>

                    =

                    </div>

                </div> */}

                {/* Right Side */}

                <div className="p-8 lg:p-12">

                    <div className="text-center lg:text-left">

                        <h2 className="text-3xl font-bold text-gray-800">
                            Create Account
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Register your new Staff person in Dental Expert account.
                        </p>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-10 space-y-6"
                    >

                        {/* Name */}

                        <div>

                            <label className="text-sm font-medium text-gray-600">
                                Full Name
                            </label>

                            <div className="mt-2 flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 ring-blue-500">

                                <PersonStandingIcon className="text-gray-400 text-xl" />

                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Muhammad Umar"
                                    className="ml-3 w-full outline-none"
                                />

                            </div>

                        </div>

                        {/* Email */}

                        <div>

                            <label className="text-sm font-medium text-gray-600">
                                Email Address
                            </label>

                            <div className="mt-2 flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 ring-blue-500">

                                <Mail className="text-gray-400 text-xl" />

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="example@gmail.com"
                                    className="ml-3 w-full outline-none"
                                />

                            </div>

                        </div>

                        {/* //// */}

                        <div>

                            <label className="text-sm font-medium text-gray-600">
                                Designation
                            </label>

                            <div className="mt-2 flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 ring-blue-500">

                                <MapPinHouse className="text-gray-400 text-xl" />

                                <input
                                    type="input"
                                    name="designation"
                                    value={formData?.designation}
                                    onChange={handleChange}
                                    placeholder="Enger Designation"
                                    className="ml-3 w-full outline-none"
                                />

                            </div>

                        </div>

                        {/* //// */}

                        <div>

                            <label className="text-sm font-medium text-gray-600">
                                Department
                            </label>

                            <div className="mt-2 flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 ring-blue-500">

                                <UserStar className="text-gray-400 text-xl" />

                                <input
                                    type="input"
                                    name="department"
                                    value={formData?.department}
                                    onChange={handleChange}
                                    placeholder="e.g Hr"
                                    className="ml-3 w-full outline-none"
                                />

                            </div>

                        </div>

                        {/* //// */}

                        <div>

                            <label className="text-sm font-medium text-gray-600">
                                Experience
                            </label>

                            <div className="mt-2 flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 ring-blue-500">

                                <BriefcaseBusiness className="text-gray-400 text-xl" />

                                <input
                                    type="number"
                                    name="experience"
                                    value={formData?.experience}
                                    onChange={handleChange}
                                    placeholder="e.g doctor"
                                    className="ml-3 w-full outline-none"
                                />

                            </div>

                        </div>

                        {/* ///// */}

                        {/* //// */}

                        {/* //// */}

                        {/* Role */}

                        <div className="" >
                            <label className="text-sm font-medium text-gray-600">
                                Select Role
                            </label>

                            <div className=" flex items-end gap-2" >
                                <div className=" w-[74%] mt-2">
                                    <Select
                                        options={roleOptions}
                                        value={selectedRole}
                                        onChange={(option) => setSelectedRole(option)}
                                        placeholder="Search or Select Role..."
                                        isSearchable
                                        className="text-sm"
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
                                </div>
                                <button onClick={() => Navigate("/permission")} className="flex justify-center items-center  gap-1 w-[24%] h-[50px] text-sm  bg-blue-600 hover:bg-blue-700 duration-300 text-white py-3 rounded-xl font-semibold shadow-lg" >Add New Role <PlusCircle size={14} /> </button>

                            </div>

                        </div>

                        {/* //// */}

                        {/* Password */}

                        <div>

                            <label className="text-sm font-medium text-gray-600">
                                Password
                            </label>

                            <div className="mt-2 flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 ring-blue-500">

                                <Lock className="text-gray-400 text-xl" />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="********"
                                    className="ml-3 w-full outline-none"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeIcon className="text-gray-400" />
                                    ) : (
                                        <EyeClosed className="text-gray-400" />
                                    )}
                                </button>

                            </div>

                        </div>

                        {/* Confirm Password */}

                        <div>

                            <label className="text-sm font-medium text-gray-600">
                                Confirm Password
                            </label>

                            <div className="mt-2 flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 ring-blue-500">

                                <Lock className="text-gray-400 text-xl" />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="********"
                                    className="ml-3 w-full outline-none"
                                />

                            </div>

                        </div>

                        {/* //// */}



                        {/* Button */}

                        <button
                            type="submit"
                            className="flex justify-center items-center gap-2 w-full bg-blue-600 hover:bg-blue-700 duration-300 text-white py-3 rounded-xl font-semibold shadow-lg"
                        >
                            Create Account <UserRoundPen size={17} />
                        </button>

                    </form>

                    <div className="mt-8 text-center">

                        <p className="text-gray-500">
                            Already have an account?
                            <span onClick={() => Navigate('/login')} className="text-blue-600 font-semibold cursor-pointer ml-2 hover:underline">
                                Sign In
                            </span>
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Signup;