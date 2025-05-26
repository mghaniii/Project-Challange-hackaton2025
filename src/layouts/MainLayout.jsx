// src/layouts/MainLayout.jsx
import React, { useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import ThemeToggleButton from '../components/ThemeToggleButton';
import { useUser } from '../context/UserContext'; // Impor useUser

// ... (Impor ikon tetap sama)
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  PuzzlePieceIcon,
  ChartBarIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/solid';

// ... (Definisi menuNavigation dan supportNavigation tetap sama)
const menuNavigation = [
  { name: 'Beranda', href: '/', icon: HomeIcon },
  { name: 'Chatbot', href: '/chat', icon: ChatBubbleLeftEllipsisIcon },
  { name: 'Challenge', href: '/challenges', icon: PuzzlePieceIcon },
  { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
  { name: 'Ngobrol AI', href: '/ngobrol-ai', icon: LightBulbIcon },
];

const supportNavigation = [
  { name: 'Sadari Diri', href: '/sadari-diri', icon: ShieldCheckIcon },
];

function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userName, clearUserName } = useUser(); // Gunakan userName dan clearUserName dari context

  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ease-in-out group
     ${
       isActive
         ? 'bg-teal-600 dark:bg-teal-700 text-white'
         : 'text-gray-300 hover:bg-slate-700 dark:hover:bg-slate-600 hover:text-white'
     }`;

  const handleClearNameAndLogout = () => {
    clearUserName(); // Ini akan memicu prompt nama lagi di HomeScreen
    // Jika ada logika logout sebenarnya (misal hapus token), tambahkan di sini
    // navigate('/'); // Arahkan ke halaman utama setelah nama dihapus
    console.log('User name cleared.');
  };

  // Tentukan nama yang akan ditampilkan di profil
  // Jika userName ada dan bukan string kosong, tampilkan itu.
  // Jika userName adalah string kosong (skip) atau null, tampilkan "Pengguna" atau sembunyikan.
  const profileDisplayName = userName && userName.trim() !== "" ? userName : "Pengguna";
  const showProfileSection = userName !== null; // Tampilkan section profil jika sudah ada interaksi nama (diisi atau diskip)

  const sidebarContent = (
    <>
      {/* ... Logo/App Name dan Navigation Links sama seperti sebelumnya ... */}
      <div className="px-4 py-5">
        <Link to="/" className="text-2xl font-bold text-white flex items-center">
          <ShieldCheckIcon className="h-8 w-8 mr-2 text-teal-400" />
          SadariDiri
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-2">
        <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-3 mb-1">
          Menu
        </h3>
        {menuNavigation.map((item) => (
          <NavLink key={item.name} to={item.href} className={navLinkClasses}>
            <item.icon className="h-5 w-5 mr-3 flex-shrink-0" aria-hidden="true" />
            {item.name}
          </NavLink>
        ))}
        <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-1">
          Edukasi
        </h3>
        {supportNavigation.map((item) => (
          <NavLink key={item.name} to={item.href} className={navLinkClasses}>
            <item.icon className="h-5 w-5 mr-3 flex-shrink-0" aria-hidden="true" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section of Sidebar */}
      <div className="px-2 pb-4 space-y-4">
        <div className="px-1">
          <ThemeToggleButton />
        </div>

        {/* User Profile Section - Ditampilkan jika sudah ada interaksi nama */}
        {showProfileSection && (
          <div className="border-t border-slate-700 dark:border-slate-600 pt-4">
            <Link
              to="/profil" // Arahkan ke halaman profil jika ada
              className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 group"
            >
              <UserCircleIcon className="h-8 w-8 mr-3 text-gray-400 group-hover:text-white" />
              <div>
                <p className="text-sm font-medium text-white truncate max-w-[120px]">
                  {profileDisplayName} {/* Tampilkan nama atau "Pengguna" */}
                </p>
              </div>
            </Link>
          </div>
        )}

        {/* Tombol untuk hapus nama/logout - Ditampilkan jika sudah ada interaksi nama */}
        {showProfileSection && (
          <button
            onClick={handleClearNameAndLogout}
            className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-slate-700 dark:hover:bg-slate-600 hover:text-white group"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3 flex-shrink-0" aria-hidden="true" />
            {userName && userName.trim() !== "" ? "Ganti Nama" : "Isi Nama"}
          </button>
        )}
      </div>
    </>
  );

  // ... (Sisa kode MainLayout.jsx untuk tampilan mobile dan konten utama tetap sama)
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 md:flex transition-colors duration-300">
      <aside className="hidden md:flex md:flex-col md:w-64 bg-slate-800 dark:bg-slate-900 text-white shadow-lg">
        {sidebarContent}
      </aside>
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-800 dark:bg-slate-900 text-white">
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                        type="button"
                        className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                </div>
                <div className="h-0 flex-1 flex flex-col overflow-y-auto pt-2 pb-4">
                  {sidebarContent}
                </div>
            </div>
            <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
        </div>
      )}
      <div className="flex-1 flex flex-col">
        <header className="md:hidden bg-slate-100 dark:bg-slate-950 p-3 sticky top-0 z-10 shadow-sm">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-teal-600 dark:text-teal-500">
              SadariDiri
            </Link>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 text-gray-800 dark:text-gray-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;