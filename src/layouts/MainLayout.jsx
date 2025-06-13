

import React, { useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import ThemeToggleButton from '../components/ThemeToggleButton';


import logoSadariDiri from '../assets/badges/kakek-zeus.png';      // Logo utama aplikasi
import logokuatdiri from '../assets/badges/logo-kuat-diri.png'; // Logo untuk menu Sadari Diri

// --- Ikon yang digunakan ---
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  PuzzlePieceIcon,
  ChartBarIcon,
  LightBulbIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDoubleLeftIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/solid';

// --- Konfigurasi Navigasi ---
const menuNavigation = [
  { name: 'Beranda', href: '/home', icon: HomeIcon },
  { name: 'Pilih Mode AI', href: '/ngobrol-ai', icon: LightBulbIcon },
  { name: 'ChatAI', href: '/chat', icon: ChatBubbleLeftEllipsisIcon },
  { name: 'Challenge', href: '/challenges', icon: PuzzlePieceIcon },
  { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
];

const supportNavigation = [
  { name: 'Sadari Diri', href: '/sadari-diri', logoSrc: logoSadariDiri },
];


function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSidebarExpanded, setDesktopSidebarExpanded] = useState(true);

 

  const navLinkClasses = ({ isActive }, isCollapsed) =>
    `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ease-in-out group ${
      isCollapsed ? 'justify-center' : ''
    } ${
      isActive
        ? 'bg-teal-600 dark:bg-teal-700 text-white'
        : 'text-gray-300 hover:bg-slate-700 dark:hover:bg-slate-600 hover:text-white'
    }`;

  const toggleDesktopSidebar = () => {
    setDesktopSidebarExpanded(!desktopSidebarExpanded);
  };
 
  const sidebarContent = (isDesktop, isDesktopCollapsed, onMobileLinkClick) => (
    <>
      {/* Top section: Logo Aplikasi */}
      <div className={`px-4 pt-5 pb-3 flex ${isDesktopCollapsed ? 'justify-center' : 'justify-between'} items-center`}>
        <Link to="/" className={`text-2xl font-bold text-white flex items-center ${isDesktopCollapsed ? 'justify-center w-full' : ''}`} onClick={() => { if (!isDesktop && onMobileLinkClick) { onMobileLinkClick(); } }}>
          {/* PERBAIKAN: Gunakan variabel logoUtama yang sudah diimpor */}
          <img src={logokuatdiri} alt="Logo Kuat Diri" className={`h-10 w-10 ${!isDesktopCollapsed ? 'mr-3' : ''} flex-shrink-0 object-cover rounded-full`} />
          {!isDesktopCollapsed && <span className="transition-opacity duration-200">Kuat Diri</span>}
        </Link>
        {isDesktop && (
          <button onClick={toggleDesktopSidebar} className={`p-1 rounded-md text-gray-300 hover:bg-slate-700 dark:hover:bg-slate-600 hover:text-white ${isDesktopCollapsed ? 'ml-0' : 'ml-2'}`} aria-label={desktopSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}>
            {desktopSidebarExpanded ? <ChevronDoubleLeftIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-2 mt-2">
        {!isDesktopCollapsed && (<h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-3 mb-1">Menu</h3>)}
        {menuNavigation.map((item) => (
          <NavLink key={item.name} to={item.href} className={(navProps) => navLinkClasses(navProps, isDesktopCollapsed)} title={isDesktopCollapsed ? item.name : undefined} onClick={() => { if (!isDesktop && onMobileLinkClick) { onMobileLinkClick(); } }}>
            <item.icon className={`h-5 w-5 ${!isDesktopCollapsed ? 'mr-3' : ''} flex-shrink-0`} aria-hidden="true" />
            {!isDesktopCollapsed && <span className="transition-opacity duration-200">{item.name}</span>}
          </NavLink>
        ))}

        {!isDesktopCollapsed && (<h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-1">Edukasi Judi Online</h3>)}
        {supportNavigation.map((item) => (
          <NavLink key={item.name} to={item.href} className={(navProps) => navLinkClasses(navProps, isDesktopCollapsed)} title={isDesktopCollapsed ? item.name : undefined} onClick={() => { if (!isDesktop && onMobileLinkClick) { onMobileLinkClick(); } }}>
            {item.logoSrc ? (
              <img src={item.logoSrc} alt={item.name} className={`h-6 w-6 ${!isDesktopCollapsed ? 'mr-3' : ''} flex-shrink-0`} />
            ) : (
              <item.icon className={`h-5 w-5 ${!isDesktopCollapsed ? 'mr-3' : ''} flex-shrink-0`} aria-hidden="true" />
            )}
            {!isDesktopCollapsed && <span className="transition-opacity duration-200">{item.name}</span>}
          </NavLink>
        ))}

        {!isDesktopCollapsed && (<h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-1">Dukungan</h3>)}
        <a
        href="mailto:ghanioy12346@gmail.com"
        className={`text-gray-300 hover:bg-slate-700 dark:hover:bg-slate-600 hover:text-white group flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ease-in-out ${
          isDesktopCollapsed ? 'justify-center' : ''
        }`}
        title={isDesktopCollapsed ? "Hubungi Kami" : undefined}
      >
        <EnvelopeIcon className={`h-5 w-5 ${!isDesktopCollapsed ? 'mr-3' : ''} flex-shrink-0`} aria-hidden="true" />
        {!isDesktopCollapsed && <span className="transition-opacity duration-200">Hubungi Kami</span>}
      </a>
      </nav>

      {/* Bottom Section: Hanya Tombol Tema */}
      <div className="px-2 pb-4 mt-auto pt-4 border-t border-slate-700 dark:border-slate-600">
        <div className={`px-1 ${isDesktopCollapsed ? 'flex justify-center' : ''}`}>
          <ThemeToggleButton collapsed={isDesktopCollapsed} />
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 md:flex transition-colors duration-300">
      <aside className={`hidden md:flex md:flex-col bg-slate-800 dark:bg-slate-900 text-white shadow-lg fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out ${desktopSidebarExpanded ? 'md:w-64' : 'md:w-20'}`}>
        {sidebarContent(true, !desktopSidebarExpanded, null)}
      </aside>

      <div className={`md:hidden fixed inset-0 z-40 flex ${mobileMenuOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" onClick={() => setMobileMenuOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-800 dark:bg-slate-900 text-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button type="button" className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" onClick={() => setMobileMenuOpen(false)}>
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <div className="h-0 flex-1 flex flex-col overflow-y-auto pt-2 pb-4">
            {sidebarContent(false, false, () => setMobileMenuOpen(false))}
          </div>
        </div>
        <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
      </div>
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${desktopSidebarExpanded ? 'md:ml-64' : 'md:ml-20'}`}>
        <header className="md:hidden bg-slate-100 dark:bg-slate-950 p-3 sticky top-0 z-10 shadow-sm">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-teal-600 dark:text-teal-500">Kuat Diri</Link>
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700">
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