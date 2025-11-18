"use client";

import Link from "next/link";
import { useAuth } from "@/api/contexts/auth-context";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faFolder,
  faUser,
  faTimes,
  faSignOutAlt,
  faUserCircle,
  faBook,
  faClipboardList,
  faMoneyBillWave,
} from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
  const [isMasterDataOpen, setIsMasterDataOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { user, logout } = useAuth();

  const masterRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (masterRef.current && !masterRef.current.contains(event.target as Node)) {
        setIsMasterDataOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleOpenSidebar = () => setIsSidebarOpen(true);
    document.addEventListener("openSidebar", handleOpenSidebar);
    return () => document.removeEventListener("openSidebar", handleOpenSidebar);
  }, []);

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 z-20 border-r border-gray-200 bg-white transform transition-transform duration-300
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0 flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-6 border-b border-gray-100">
          <h1 className="select-none text-gray-800 text-2xl font-bold">
            Lib<span className="text-[var(--main-theme)]">E</span>
          </h1>
          <div className="md:hidden">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="cursor-pointer text-gray-800 focus:outline-none"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-6" ref={masterRef}>
            <button
              onClick={() => setIsMasterDataOpen(!isMasterDataOpen)}
              className="flex items-center w-full p-3 space-x-2 text-sm text-gray-800 hover:bg-[var(--main-theme)]/10 rounded-md transition-colors"
            >
              <FontAwesomeIcon icon={faFolder} />
              <span className="flex-1 text-left">Master Data</span>
              <FontAwesomeIcon
                icon={faChevronRight}
                className={`transform transition-transform duration-200 ease-in-out ${
                  isMasterDataOpen ? "rotate-90" : "rotate-0"
                }`}
              />
            </button>

            {isMasterDataOpen && (
              <nav className="mt-2 ml-2 pl-4 border-l border-gray-200 space-y-2">
                <Link
                  href="/users"
                  className="flex items-center p-2 space-x-1 text-sm text-gray-700 hover:bg-[var(--main-theme)]/10 rounded-md transition-colors"
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span>Users</span>
                </Link>

                <Link
                  href="/books"
                  className="flex items-center p-2 space-x-1 text-sm text-gray-700 hover:bg-[var(--main-theme)]/10 rounded-md transition-colors"
                >
                  <FontAwesomeIcon icon={faBook} />
                  <span>Books</span>
                </Link>

                <Link
                  href="/borrowings"
                  className="flex items-center p-2 space-x-1 text-sm text-gray-700 hover:bg-[var(--main-theme)]/10 rounded-md transition-colors"
                >
                  <FontAwesomeIcon icon={faClipboardList} />
                  <span>Borrowings</span>
                </Link>

                <Link
                  href="/fines"
                  className="flex items-center p-2 space-x-1 text-sm text-gray-700 hover:bg-[var(--main-theme)]/10 rounded-md transition-colors"
                >
                  <FontAwesomeIcon icon={faMoneyBillWave} />
                  <span>Fines</span>
                </Link>
              </nav>
            )}
          </div>
        </div>

        {/* User section */}
        <div className="relative px-4 py-4 border-t border-gray-200" ref={userRef}>
          <button
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center w-full p-3 space-x-2 text-sm text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
          >
            <FontAwesomeIcon icon={faUserCircle} />
            <span className="flex-1 text-left text-[var(--main-theme)]">
              {user?.name || "User Menu"}
            </span>
            <FontAwesomeIcon
              icon={faChevronRight}
              className={`transform transition-transform duration-200 ease-in-out ${
                isUserDropdownOpen ? "rotate-270" : "rotate-90"
              }`}
            />
          </button>

          {isUserDropdownOpen && (
            <div className="absolute bottom-full mb-2 left-4 w-[calc(100%-2rem)] bg-white rounded-md shadow-md overflow-hidden">
              <Link
                href="/profile"
                className="flex items-center w-full px-4 py-3 space-x-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors"
              >
                <FontAwesomeIcon icon={faUser} />
                <span>Profile</span>
              </Link>
              <button
                onClick={logout}
                className="cursor-pointer flex items-center w-full px-4 py-3 space-x-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
