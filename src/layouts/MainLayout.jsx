// src/layouts/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import ThemeToggleButton from '../components/ThemeToggleButton';
import { useUser } from '../context/UserContext';

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
  XMarkIcon,
  ChevronDoubleLeftIcon, // Icon for collapsing sidebar
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
];

function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSidebarExpanded, setDesktopSidebarExpanded] = useState(true);
  const { userName, clearUserName } = useUser();

  const navLinkClasses = ({ isActive }, isCollapsed) =>
    `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ease-in-out group ${
      isCollapsed ? 'justify-center' : ''
    } ${
      isActive
        ? 'bg-teal-600 dark:bg-teal-700 text-white'
        : 'text-gray-300 hover:bg-slate-700 dark:hover:bg-slate-600 hover:text-white'
    }`;

  const handleClearNameAndLogout = () => {
    clearUserName();
    console.log('User name cleared.');
    // if (mobileMenuOpen) setMobileMenuOpen(false); // Optionally close mobile menu here too
  };

  const profileDisplayName = userName && userName.trim() !== "" ? userName : "Pengguna";
  const showProfileSection = userName !== null;

  const toggleDesktopSidebar = () => {
    setDesktopSidebarExpanded(!desktopSidebarExpanded);
  };

  // Updated sidebarContent to include onMobileLinkClick
  const sidebarContent = (isDesktop, isDesktopCollapsed, onMobileLinkClick) => (
    <>
      {/* Top section: Logo and Toggle Button for Desktop */}
      <div className={`px-4 pt-5 pb-3 flex ${isDesktopCollapsed ? 'justify-center' : 'justify-between'} items-center`}>
        <Link
          to="/"
          className={`text-2xl font-bold text-white flex items-center ${isDesktopCollapsed ? 'justify-center w-full' : ''}`}
          onClick={() => {
            if (!isDesktop && onMobileLinkClick) {
              onMobileLinkClick();
            }
          }}
        >
          <ShieldCheckIcon className={`h-8 w-8 ${!isDesktopCollapsed ? 'mr-2' : ''} text-teal-400 flex-shrink-0`} />
          {!isDesktopCollapsed && <span className="transition-opacity duration-200">Kuat Diri</span>}
        </Link>
        {isDesktop && (
          <button
            onClick={toggleDesktopSidebar}
            className={`p-1 rounded-md text-gray-300 hover:bg-slate-700 dark:hover:bg-slate-600 hover:text-white ${isDesktopCollapsed ? 'ml-0' : 'ml-2'}`}
            aria-label={desktopSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {desktopSidebarExpanded ? (
              <ChevronDoubleLeftIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-2 mt-2">
        {!isDesktopCollapsed && (
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-3 mb-1">
            Menu
            </h3>
        )}
        {menuNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={(navProps) => navLinkClasses(navProps, isDesktopCollapsed)}
            title={isDesktopCollapsed ? item.name : undefined}
            onClick={() => {
              if (!isDesktop && onMobileLinkClick) {
                onMobileLinkClick();
              }
            }}
          >
            <item.icon className={`h-5 w-5 ${!isDesktopCollapsed ? 'mr-3' : ''} flex-shrink-0`} aria-hidden="true" />
            {!isDesktopCollapsed && <span className="transition-opacity duration-200">{item.name}</span>}
          </NavLink>
        ))}

        {!isDesktopCollapsed && (
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-1">
            Edukasi
            </h3>
        )}
        {supportNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={(navProps) => navLinkClasses(navProps, isDesktopCollapsed)}
            title={isDesktopCollapsed ? item.name : undefined}
            onClick={() => {
              if (!isDesktop && onMobileLinkClick) {
                onMobileLinkClick();
              }
            }}
          >
            <item.icon className={`h-5 w-5 ${!isDesktopCollapsed ? 'mr-3' : ''} flex-shrink-0`} aria-hidden="true" />
            {!isDesktopCollapsed && <span className="transition-opacity duration-200">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section of Sidebar */}
      <div className={`px-2 pb-4 space-y-4 mt-auto ${isDesktopCollapsed ? 'pt-4 border-t border-slate-700 dark:border-slate-600' : ''}`}>
        <div className={`px-1 ${isDesktopCollapsed ? 'flex justify-center' : ''}`}>
          <ThemeToggleButton collapsed={isDesktopCollapsed} />
        </div>

        {showProfileSection && (
          <div className={`${!isDesktopCollapsed ? 'border-t border-slate-700 dark:border-slate-600 pt-4' : ''}`}>
            <Link
              to="/profil"
              className={`flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 group ${isDesktopCollapsed ? 'justify-center' : ''}`}
              title={isDesktopCollapsed ? profileDisplayName : "Profil"}
              onClick={() => {
                if (!isDesktop && onMobileLinkClick) {
                  onMobileLinkClick();
                }
              }}
            >
              <UserCircleIcon className={`h-8 w-8 ${!isDesktopCollapsed ? 'mr-3' : ''} text-gray-400 group-hover:text-white flex-shrink-0`} />
              {!isDesktopCollapsed && (
                <div>
                  <p className="text-sm font-medium text-white truncate max-w-[120px] transition-opacity duration-200">
                    {profileDisplayName}
                  </p>
                </div>
              )}
            </Link>
          </div>
        )}

        {showProfileSection && (
          <button
            onClick={() => {
              handleClearNameAndLogout();
              // Decide if this button should also close the mobile menu
              // if (!isDesktop && onMobileLinkClick) {
              //  onMobileLinkClick();
              // }
            }}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-slate-700 dark:hover:bg-slate-600 hover:text-white group ${isDesktopCollapsed ? 'justify-center' : ''}`}
            title={isDesktopCollapsed ? (userName && userName.trim() !== "" ? "Ganti Nama" : "Isi Nama") : undefined}
          >
            <ArrowRightOnRectangleIcon className={`h-5 w-5 ${!isDesktopCollapsed ? 'mr-3' : ''} flex-shrink-0`} aria-hidden="true" />
            {!isDesktopCollapsed && <span className="transition-opacity duration-200">{userName && userName.trim() !== "" ? "Ganti Nama" : "Isi Nama"}</span>}
          </button>
        )}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 md:flex transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex md:flex-col bg-slate-800 dark:bg-slate-900 text-white shadow-lg fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out ${
          desktopSidebarExpanded ? 'md:w-64' : 'md:w-20'
        }`}
      >
        {/* Pass null for onMobileLinkClick for desktop sidebar */}
        {sidebarContent(true, !desktopSidebarExpanded, null)}
      </aside>

      {/* Mobile Menu Overlay */}
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
              {/* Pass setMobileMenuOpen(false) as the click handler for mobile links */}
              {sidebarContent(false, false, () => setMobileMenuOpen(false))}
            </div>
          </div>
          <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          desktopSidebarExpanded ? 'md:ml-64' : 'md:ml-20'
        }`}
      >
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