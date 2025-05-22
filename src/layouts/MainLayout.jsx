// src/layouts/MainLayout.jsx
import React, { useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
 // Pastikan path ini benar
import ThemeToggleButton from '../components/ThemeToggleButton.jsx';

// Impor ikon-ikon yang dibutuhkan (seperti di atas)
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  PuzzlePieceIcon,
  ChartBarIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  Bars3Icon, // Hamburger Icon
  XMarkIcon  // Close Icon
} from '@heroicons/react/24/solid';

const menuNavigation = [
  { name: 'Beranda', href: '/', icon: HomeIcon },
  { name: 'Chatbot', href: '/chat', icon: ChatBubbleLeftEllipsisIcon },
  { name: 'Challenge', href: '/challenges', icon: PuzzlePieceIcon },
  { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
  { name: 'Ngobrol AI', href: '/ngobrol-ai', icon: LightBulbIcon },
];

const supportNavigation = [
  { name: 'Sadari Diri', href: '/sadari-diri', icon: ShieldCheckIcon },
  // { name: 'Pengaturan', href: '/settings', icon: Cog6ToothIcon }, // Contoh
];

function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ease-in-out group
     ${
       isActive
         ? 'bg-teal-600 dark:bg-teal-700 text-white'
         : 'text-gray-300 hover:bg-slate-700 dark:hover:bg-slate-600 hover:text-white'
     }`;

  const sidebarContent = (
    <>
      {/* Logo/App Name */}
      <div className="px-4 py-5">
        <Link to="/" className="text-2xl font-bold text-white flex items-center">
          {/* Ganti dengan logo jika ada */}
          <ShieldCheckIcon className="h-8 w-8 mr-2 text-teal-400" />
          SadariDiri
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-2">
        {/* Menu Group */}
        <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-3 mb-1">
          Menu
        </h3>
        {menuNavigation.map((item) => (
          <NavLink key={item.name} to={item.href} className={navLinkClasses}>
            <item.icon className="h-5 w-5 mr-3 flex-shrink-0" aria-hidden="true" />
            {item.name}
          </NavLink>
        ))}

        {/* Support Group */}
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
        <div className="px-1"> {/* Wrapper untuk Theme Toggle agar paddingnya pas */}
            <ThemeToggleButton /> {/* Tombol ini harusnya sudah di styling untuk dark mode */}
        </div>

        {/* User Profile Section - Placeholder */}
        <div className="border-t border-slate-700 dark:border-slate-600 pt-4">
          <Link
            to="/profil" // Arahkan ke halaman profil jika ada
            className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 group"
          >
            <UserCircleIcon className="h-8 w-8 mr-3 text-gray-400 group-hover:text-white" />
            <div>
              <p className="text-sm font-medium text-white">Nama User</p> {/* Ganti dengan nama user asli */}
              <p className="text-xs text-gray-400 group-hover:text-gray-200">Lihat Profil</p>
            </div>
          </Link>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => { console.log('Logout clicked'); /* Implement logout logic */ }}
          className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-slate-700 dark:hover:bg-slate-600 hover:text-white group"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3 flex-shrink-0" aria-hidden="true" />
          Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 md:flex transition-colors duration-300">
      {/* Sidebar untuk Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-slate-800 dark:bg-slate-900 text-white shadow-lg">
        {sidebarContent}
      </aside>

      {/* Mobile Menu (Sidebar Overlay) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" onClick={() => setMobileMenuOpen(false)}></div>
            
            {/* Sidebar Panel */}
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
                <div className="h-0 flex-1 flex flex-col overflow-y-auto pt-2 pb-4"> {/* pt-2 untuk memberi ruang dari X button */}
                  {sidebarContent}
                </div>
            </div>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
        </div>
      )}

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col">
        {/* Header untuk Mobile (Hanya tombol hamburger) */}
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

        {/* Footer tidak wajib jika sidebar sudah sangat dominan, tapi jika mau: */}
        {/* <footer className="text-center p-4 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm">
          © {new Date().getFullYear()} SadariDiri. Hak Cipta Dilindungi.
        </footer> */}
      </div>
    </div>
  );
}

export default MainLayout;