
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Outlet, NavLink, useLocation, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { logout } from '../slices/authSlice';
import {
  toggleTheme,
  toggleGlassMode,
  resetUI,
  applyThemePreset,
  toggleSidebarCollapsed,
  setSidebarWidth,
  setSidebarGradient,
  setSidebarBgColor,
  setBodyColor,
  setPrimaryColor,
  setCardColor,
  setCardPadding,
  setTextColor,
  setFontSize,
  setFontFamily,
  setTopBarGradient,
  setTopBarColor,
  setTopBarOpacity,
  toggleTopBarFloating,
  setTopBarButtonStyle,
  setButtonStyle,
  setButtonRadius
} from '../slices/uiSlice';
import Modal from '../components/Modal';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  FileText,
  CreditCard,
  BarChart3,
  Menu,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Bell,
  Search,
  Settings,
  PlusCircle,
  Palette,
  Check,
  Home,
  Monitor,
  Sparkles,
  Layers,
  Type,
  Maximize,
  Grid,
  Paintbrush,
  RotateCcw,
  Zap,
  Glasses,
  Box,
  CornerDownRight,
  Sliders,
  Type as TypeIcon,
  RectangleHorizontal,
  Compass,
  Pill,
  LogOut,
  Loader2,
  Loader,
  ReceiptText
} from 'lucide-react';
import ConfirmDialog from '@/components/ConfirmDialog';
import { apiPost } from '@/utilz/endpoints';
import Loading from '@/components/loading';

const baseUrl = import.meta.env.VITE_API_URL;

const PRESET_GRADIENTS = [
  { name: 'Midnight Pro', start: '#0f172a', end: '#1e293b' },
  { name: 'Ocean Breeze', start: '#0ea5e9', end: '#0284c7' },
  { name: 'Deep Forest', start: '#064e3b', end: '#065f46' },
  { name: 'Royal Purple', start: '#4c1d95', end: '#5b21b6' },
  { name: 'Sunset Bloom', start: '#9d174d', end: '#be185d' },
];

const TOPBAR_PRESETS = [
  { name: 'Glass White', start: 'rgba(255, 255, 255, 0.7)', end: 'rgba(255, 255, 255, 0.4)' },
  { name: 'Soft Indigo', start: 'rgba(99, 102, 241, 0.15)', end: 'rgba(99, 102, 241, 0.05)' },
  { name: 'Clinic Teal', start: 'rgba(20, 184, 166, 0.15)', end: 'rgba(20, 184, 166, 0.05)' },
  { name: 'Dark Velvet', start: 'rgba(15, 23, 42, 0.9)', end: 'rgba(30, 41, 59, 0.7)' },
  { name: 'Neon Dusk', start: 'rgba(244, 63, 94, 0.1)', end: 'rgba(139, 92, 246, 0.1)' },
];

const THEME_PRESETS = [
  {
    name: 'Modern Clinic',
    icon: Stethoscope,
    config: {
      primaryColor: '#0ea5e9',
      bodyColor: '#f8fafc',
      cardColor: '#ffffff',
      glassMode: false,
      sidebarGradient: { start: '#0f172a', end: '#1e293b', name: 'Midnight Pro' },
      fontFamily: "'Inter', sans-serif"
    }
  },
  {
    name: 'Oceanic Glass',
    icon: Glasses,
    config: {
      primaryColor: '#0284c7',
      bodyColor: '#f0f9ff',
      cardColor: '#ffffff',
      glassMode: true,
      sidebarGradient: { start: '#0369a1', name: "Oceanic Glass", end: '#0ea5e9' },
      fontFamily: "'Poppins', sans-serif"
    }
  },
  {
    name: 'Royal Velvet',
    icon: Sparkles,
    config: {
      primaryColor: '#a855f7',
      bodyColor: '#faf5ff',
      cardColor: '#ffffff',
      glassMode: true,
      sidebarGradient: { start: '#581c87', name: 'Royal Velvet', end: '#7e22ce' },
      fontFamily: "'Montserrat', sans-serif"
    }
  },
  {
    name: 'Dark Stealth',
    icon: Moon,
    config: {
      theme: 'dark' as const,
      primaryColor: '#6366f1',
      bodyColor: '#020617',
      cardColor: '#0f172a',
      glassMode: true,
      sidebarGradient: { start: '#000000', name: "Dark Stealth", end: '#1e1b4b' },
      fontFamily: "'Roboto', sans-serif"
    }
  }
];

const MainLayout: React.FC = () => {


  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const ui = useSelector((state: RootState) => state.ui);
  const [isResizing, setIsResizing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'type' | 'layout'>('visual');
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--app-font-family', ui.fontFamily);
    root.style.setProperty('--app-text-color', ui.textColor);
    root.style.setProperty('--card-bg', ui.cardColor);
    root.style.setProperty('--body-bg', ui.bodyColor);

    const sizeMap = { small: '14px', medium: '16px', large: '18px' };
    root.style.setProperty('--app-font-size', sizeMap[ui.fontSize]);

    const paddingMap = { compact: '0.75rem', comfortable: '1.5rem', spacious: '2.5rem' };
    root.style.setProperty('--card-padding', paddingMap[ui.cardPadding]);

    const radiusMap = { none: '0px', md: '0.5rem', xl: '0.75rem', full: '9999px' };
    root.style.setProperty('--btn-radius', radiusMap[ui.buttonRadius]);

    if (ui.glassMode) {
      document.body.classList.add('glass-active');
    } else {
      document.body.classList.remove('glass-active');
    }
  }, [ui.fontFamily, ui.fontSize, ui.textColor, ui.cardPadding, ui.glassMode, ui.buttonRadius, ui.cardColor, ui.bodyColor]);

  const applyPrimaryPalette = (hex: string) => {
    const root = document.documentElement;
    root.style.setProperty('--primary-50', hex + '10');
    root.style.setProperty('--primary-500', hex);
    root.style.setProperty('--primary-600', hex);
  };

  useEffect(() => {
    applyPrimaryPalette(ui.primaryColor);
  }, [ui.primaryColor]);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => setIsResizing(false), []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth > 160 && newWidth < 480) {
        dispatch(setSidebarWidth(newWidth));
      }
    }
  }, [isResizing, dispatch]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  const handleLogout = () => {
    // dispatch(logout());
    localStorage.clear();
    navigate('/login');
  };

  const pathnames = location.pathname.split('/').filter((x) => x);
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/medicines', label: 'Medicines', icon: Pill },
    { path: '/doctors', label: 'Doctors', icon: Stethoscope },
    { path: '/patients', label: 'Patients', icon: Users },
    { path: '/appointments', label: 'Appointments', icon: Calendar },
    { path: '/prescriptions', label: 'Prescriptions', icon: FileText },
    { path: '/Invoices', label: 'Invoices' , icon: ReceiptText },
    // { path: '/billing', label: 'Billing', icon: CreditCard },
    { path: '/analysis', label: 'Analysis', icon: BarChart3 },
  ];

  const getButtonStyleClass = () => {
    switch (ui.buttonStyle) {
      case 'gradient': return 'btn-style-gradient';
      case 'glow': return 'btn-style-glow';
      case 'flat': return 'btn-style-flat';
      default: return 'bg-primary-600';
    }
  };

  const getHeaderIconRadius = () => {
    switch (ui.topBarButtonStyle) {
      case 'circle': return 'rounded-full';
      case 'square': return 'rounded-none';
      default: return 'rounded-xl';
    }
  };

  const headerStyle: React.CSSProperties = {
    background: ui.topBarGradient.start === ui.topBarGradient.end
      ? ui.topBarColor
      : `linear-gradient(to right, ${ui.topBarGradient.start}, ${ui.topBarGradient.end})`,
    opacity: ui.topBarOpacity,
    ...(ui.topBarFloating ? {
      margin: '1rem',
      borderRadius: '1.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      width: 'calc(100% - 2rem)',
      border: '1px solid rgba(255,255,255,0.1)'
    } : {
      width: '100%',
      borderBottom: '1px solid rgba(0,0,0,0.1)'
    })
  };

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null
  });


  const handleLogoutPop = () => {
    handleLogout()
  }

  

  const handleLayoutChange = async () => {

    setLoading(true);

    try {

      const payload = {

        theme: ui.theme,
        glassMode: false,
        sidebarGradient: {
          start: ui.sidebarGradient.start,
          name: ui.sidebarGradient.name,
          end: ui.sidebarGradient.end,
        },
        sidebarBgColor: ui.sidebarBgColor,
        bodyColor: ui.bodyColor,
        primaryColor: ui.primaryColor,
        cardColor: ui.cardColor,
        cardPadding: ui.cardPadding,
        textColor: ui.textColor,
        fontSize: ui.fontSize,
        fontFamily: ui.fontFamily,
        topBarGradient: {
          start: ui.topBarGradient.start,
          end: ui.topBarGradient.end,
        },
        topBarColor: ui.topBarColor,
        topBarOpacity: ui.topBarOpacity,
        topBarFloating: ui.topBarFloating,
        topBarButtonStyle: ui.topBarButtonStyle,
        buttonStyle: ui.buttonStyle,
        buttonRadius: ui.buttonRadius,
        sidebarLayout: {
          width: ui.sidebarLayout.width,
          collapsed: ui.sidebarLayout.collapsed,
        }
      }

      const d = await apiPost(`${baseUrl}/theme/`, payload);

      if (d) {
        setLoading(false);

        setIsSettingsOpen(false);
      }

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>

      <div
        className="flex h-screen w-full overflow-hidden main-body-transition dark:bg-slate-950 transition-all duration-500"
        style={{
          '--body-bg': ui.bodyColor,
          '--card-bg': ui.cardColor
        } as React.CSSProperties}
      >
        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          style={{
            width: ui.sidebarLayout.collapsed ? '80px' : `${ui.sidebarLayout.width}px`,
            '--sidebar-start': ui.sidebarGradient.start,
            '--sidebar-end': ui.sidebarGradient.end,
          } as React.CSSProperties}
          className="relative flex flex-col transition-[width] duration-300 ease-in-out border-r border-slate-200 dark:border-slate-800 sidebar-gradient-overlay text-white z-40"
        >
          {/* Sidebar Header */}
          <div className={`h-16 flex items-center ${ui.sidebarLayout.collapsed ? 'justify-center' : 'justify-between px-6'} border-b border-white/10 shrink-0`}>
            {!ui.sidebarLayout.collapsed && <span className="text-2xl font-bold tracking-tighter truncate">DentFlow</span>}
            <button
              onClick={() => dispatch(toggleSidebarCollapsed())}
              className={`p-2 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center shrink-0 ${ui.sidebarLayout.collapsed ? 'w-10 h-10' : ''}`}
            >
              {ui.sidebarLayout.collapsed ? <Menu size={20} className="shrink-0" /> : <ChevronLeft size={20} className="shrink-0" />}
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide">
            {navItems?.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                title={ui.sidebarLayout.collapsed ? item.label : ''}
                className={({ isActive }) => `
                flex items-center rounded-xl transition-all duration-200 min-h-[48px]
                ${ui.sidebarLayout.collapsed ? 'justify-center px-0' : 'gap-4 px-4'} 
                ${isActive ? 'bg-white/20 shadow-lg shadow-black/10 backdrop-blur-md text-white' : 'hover:bg-white/10 text-white/70 hover:text-white'}
              `}
              >
                <item.icon size={20} className="shrink-0 flex-none" />
                {!ui.sidebarLayout.collapsed && <span className="font-bold truncate text-sm shrink leading-none">{item.label}</span>}
              </NavLink>
            ))}
          </nav>

          {!ui.sidebarLayout.collapsed && <div onMouseDown={startResizing} className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-white/20 transition-colors z-50" />}

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-white/10 space-y-2 shrink-0">
            <button
              onClick={() => dispatch(toggleTheme())}
              title={ui.sidebarLayout.collapsed ? (ui.theme === 'light' ? 'Dark Mode' : 'Light Mode') : ''}
              className={`flex items-center ${ui.sidebarLayout.collapsed ? 'justify-center px-0' : 'gap-4 px-4'} w-full py-3 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white min-h-[48px]`}
            >
              {ui.theme === 'light' ? <Moon size={20} className="shrink-0" /> : <Sun size={20} className="shrink-0" />}
              {!ui.sidebarLayout.collapsed && <span className="font-bold text-sm shrink leading-none">{ui.theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
            </button>

            <button
              onClick={() => setDeleteModal({ isOpen: true })}
              title={ui.sidebarLayout.collapsed ? 'Sign Out' : ''}
              className={`flex items-center ${ui.sidebarLayout.collapsed ? 'justify-center px-0' : 'gap-4 px-4'} w-full py-3 rounded-xl hover:bg-rose-500/20 transition-colors text-white/70 hover:text-rose-400 min-h-[48px]`}
            >
              <LogOut size={20} className="shrink-0" />
              {!ui.sidebarLayout.collapsed && <span className="font-bold text-sm shrink leading-none">Sign Out</span>}
            </button>

            <div className={`flex items-center ${ui.sidebarLayout.collapsed ? 'justify-center' : 'gap-3 px-4'} py-2`}>
              <div className="w-8 h-8 rounded-full bg-primary-500 border border-white/20 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">AD</div>
              {!ui.sidebarLayout.collapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold truncate">Admin User</span>
                  <span className="text-[10px] text-white/50 truncate">Chief Dentist</span>
                </div>
              )}
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden relative">
          <header
            style={headerStyle}
            className="h-16 flex items-center justify-between px-8 backdrop-blur-md shrink-0 z-30 transition-all duration-500"
          >
            <div className="flex items-center gap-6 flex-1 max-w-xl">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Link to="/dashboard" className="text-slate-400 hover:text-primary-500 transition-colors p-1"><Home size={16} /></Link>
                {pathnames.length > 0 && <ChevronRight size={14} className="text-slate-300" />}
                {pathnames.map((name, index) => {
                  const formattedName = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
                  return <span key={name} className="font-bold truncate max-w-[150px]">{formattedName}</span>;
                })}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className={`p-2 text-slate-500 hover:bg-white/40 dark:hover:bg-slate-800/40 relative transition-all active:scale-95 border border-transparent hover:border-white/20 ${getHeaderIconRadius()}`}>
                <Bell size={20} />
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className={`p-2 text-slate-500 hover:bg-white/40 dark:hover:bg-slate-800/40 transition-all active:scale-95 group border border-transparent hover:border-white/20 ${getHeaderIconRadius()}`}
              >
                <Settings size={20} className="group-hover:rotate-45 transition-transform duration-500" />
              </button>

              <div className="h-6 w-px bg-slate-300/30 dark:bg-slate-600/30 mx-1" />

              <button className={`flex items-center gap-2 text-white px-5 py-2.5 font-bold text-sm transition-all custom-radius active:scale-[0.97] hover:translate-y-[-1px] ${getButtonStyleClass()}`}>
                <PlusCircle size={18} />
                <span className="hidden sm:inline">Add Oppointment</span>
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 scroll-smooth z-20">
            <Outlet />
          </div>
        </main>

        {/* Modal Settings */}
        <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Experience Customizer">
          <div className="flex border-b border-slate-100 dark:border-slate-800 mb-6">
            {['visual', 'type', 'layout'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === tab ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-400'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-8 overflow-y-auto max-h-[60vh] px-1 scrollbar-hide">
            {activeTab === 'visual' && (
              <>
                {/* BRANDING & CORE COLORS */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Palette size={14} className="text-primary-500" /> Branding & Core Colors
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Brand Primary</span>
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <input
                            type="color"
                            value={ui.primaryColor}
                            onChange={(e) => dispatch(setPrimaryColor(e.target.value))}
                            className="w-8 h-8 rounded-lg cursor-pointer p-0 bg-transparent border-none z-10 relative"
                          />
                          <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 -z-1" />
                        </div>
                        <span className="text-[10px] font-bold font-mono uppercase truncate">{ui.primaryColor}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Main Body / Canvas</span>
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <input
                            type="color"
                            value={ui.bodyColor}
                            onChange={(e) => dispatch(setBodyColor(e.target.value))}
                            className="w-8 h-8 rounded-lg cursor-pointer p-0 bg-transparent border-none z-10 relative"
                          />
                          <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 -z-1" />
                        </div>
                        <span className="text-[10px] font-bold font-mono uppercase truncate">{ui.bodyColor}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Card / Table Surfaces</span>
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <input
                            type="color"
                            value={ui.cardColor}
                            onChange={(e) => dispatch(setCardColor(e.target.value))}
                            className="w-8 h-8 rounded-lg cursor-pointer p-0 bg-transparent border-none z-10 relative"
                          />
                          <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 -z-1" />
                        </div>
                        <span className="text-[10px] font-bold font-mono uppercase truncate">{ui.cardColor}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Header Solid Color</span>
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <input
                            type="color"
                            value={ui.topBarColor}
                            onChange={(e) => dispatch(setTopBarColor(e.target.value))}
                            className="w-8 h-8 rounded-lg cursor-pointer p-0 bg-transparent border-none z-10 relative"
                          />
                          <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 -z-1" />
                        </div>
                        <span className="text-[10px] font-bold font-mono uppercase truncate">{ui.topBarColor}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar Gradient personality */}
                <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Compass size={14} className="text-primary-500" /> Sidebar Personality
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_GRADIENTS.map(preset => (
                      <button key={preset.name} onClick={() => dispatch(setSidebarGradient(preset))} className={`p-2 rounded-xl border-2 flex items-center gap-2 transition-all ${ui.sidebarGradient.start === preset.start ? 'border-primary-500 bg-primary-50/20' : 'border-slate-100 dark:border-slate-800'}`}>
                        <div style={{ background: `linear-gradient(to bottom right, ${preset.start}, ${preset.end})` }} className="w-4 h-4 rounded shrink-0" />
                        <span className="text-[9px] font-bold truncate">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Style */}
                <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Box size={14} className="text-primary-500" /> Button Personality
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {['flat', 'gradient', 'glow'].map(style => (
                      <button
                        key={style}
                        onClick={() => dispatch(setButtonStyle(style as any))}
                        className={`py-2 px-1 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${ui.buttonStyle === style ? 'border-primary-500 bg-primary-50/20' : 'border-slate-100 dark:border-slate-800'}`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Presets */}
                <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Zap size={14} className="text-amber-500" /> Theme Presets
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {THEME_PRESETS.map(preset => (
                      <button
                        key={preset.name}
                        onClick={() => dispatch(applyThemePreset(preset.config as any))}
                        className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-primary-500 transition-all flex flex-col items-center gap-2 group"
                      >
                        <preset.icon size={14} className="text-primary-500" />
                        <span className="text-[7px] font-black uppercase tracking-tighter text-center">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'type' && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><TypeIcon size={14} /> Font Style</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['Inter', 'Poppins', 'Roboto', 'Montserrat'].map(name => {
                      const val = `'${name}', sans-serif`;
                      return (
                        <button key={name} onClick={() => dispatch(setFontFamily(val))} className={`p-3 rounded-xl border-2 text-left transition-all ${ui.fontFamily === val ? 'border-primary-500 bg-primary-50/20' : 'border-slate-100 dark:border-slate-800'}`}>
                          <p style={{ fontFamily: val }} className="text-sm font-bold">{name}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Base Font Scale</h4>
                  <div className="flex gap-2">
                    {['small', 'medium', 'large'].map(size => (
                      <button
                        key={size}
                        onClick={() => dispatch(setFontSize(size as any))}
                        className={`flex-1 py-2 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${ui.fontSize === size ? 'border-primary-500 bg-primary-50/20 text-primary-500' : 'border-slate-100 dark:border-slate-800'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'layout' && (
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Maximize size={14} /> Interface Density</h4>
                <div className="space-y-2">
                  {[
                    { id: 'compact', label: 'Compact', desc: 'Maximum data visibility' },
                    { id: 'comfortable', label: 'Comfortable', desc: 'Standard clinical balance' },
                    { id: 'spacious', label: 'Spacious', desc: 'Relaxed reading experience' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => dispatch(setCardPadding(opt.id as any))}
                      className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${ui.cardPadding === opt.id ? 'border-primary-500 bg-primary-50/20' : 'border-slate-100 dark:border-slate-800'}`}
                    >
                      <div>
                        <span className="text-xs font-bold uppercase tracking-widest block">{opt.label} Mode</span>
                        <span className="text-[10px] text-slate-400">{opt.desc}</span>
                      </div>
                      {ui.cardPadding === opt.id && <Check size={18} className="text-primary-500" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 mb-4 flex flex-col gap-3">
            <button
              onClick={handleLayoutChange}
              className="w-full bg-slate-900 dark:bg-primary-600 text-white font-black py-4 rounded-2xl hover:bg-black transition-all uppercase tracking-widest text-xs shadow-xl active:scale-95">
              { loading ? <div className="w-full flex align-items justify-center" > <Loader2 style={{height:'16px',width:'16px'}} /> </div>  :"Save Visual Experience"} 
            </button>
            {/* <button onClick={() => { if (confirm('Factory reset all UI customizations?')) dispatch(resetUI()); }} className="w-full py-3 rounded-2xl border-2 border-slate-100 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
              <RotateCcw size={14} /> Factory Reset Theme
            </button> */}
          </div>
        </Modal>
      </div>

      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleLogoutPop}
        title="Confirm Sign Out"
        subtitle="Are you sure you want to end your current session?"
        button="Sign Out"
      />

    </>

  );
};

export default MainLayout;
