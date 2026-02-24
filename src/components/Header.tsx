"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

export const HEADER_HEIGHT = 56;

const NAV_ITEMS = [
  { label: "홈", href: "/" },
  { label: "맛집 지도", href: "/map" },
  { label: "메뉴 추천", href: "/roulette" },
  { label: "맛집 목록", href: "/list" },
  { label: "마이", href: "/my" },
];

export default function Header() {
  const pathname = usePathname();
  const { user, openLoginModal, logout, openSignupModal } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLabel =
    NAV_ITEMS.find((item) => item.href === pathname)?.label ?? "";

  return (
    <>
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 safe-area-top"
      style={{ height: HEADER_HEIGHT }}
    >
      <div className="max-w-[900px] mx-auto h-full px-4 flex items-center justify-between">
        {/* 브랜드 로고 */}
        <Link href="/" className="flex items-center gap-1 btn-press">
          <span className="text-xl font-extrabold bg-gradient-to-r from-[#E8513D] to-[#F97316] bg-clip-text text-transparent">
            배부룩
          </span>
        </Link>

        {/* 모바일: 현재 탭 이름 */}
        <span className="md:hidden text-sm font-semibold text-gray-700">
          {pathname !== "/" && currentLabel}
        </span>

        {/* 데스크탑: 탭 네비게이션 */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors btn-press ${
                pathname === href
                  ? "text-[#E8513D]"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              {label}
              {pathname === href && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[3px] bg-[#E8513D] rounded-full" />
              )}
            </Link>
          ))}
          {user && (
            <Link
              href="/add-restaurant"
              className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors btn-press ${
                pathname === "/add-restaurant"
                  ? "text-[#E8513D]"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              맛집 추가
              {pathname === "/add-restaurant" && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[3px] bg-[#E8513D] rounded-full" />
              )}
            </Link>
          )}
        </nav>

        {/* 유저 정보 또는 로그인 버튼 */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1 rounded-full transition-colors hover:bg-gray-100"
              >
                <div className="w-8 h-8 rounded-full bg-[#E8513D] flex items-center justify-center text-white text-sm font-bold">
                  {user.nickname.charAt(0)}
                </div>
                <span className="hidden md:block text-sm font-semibold text-gray-800">
                  {user.nickname}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-20 animate-in fade-in duration-150">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">{user.nickname}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/my"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      <span>마이페이지</span>
                    </Link>
                  </div>
                  <div className="py-1 border-t border-gray-100">
                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      <span>로그아웃</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={openSignupModal}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors btn-press"
              >
                회원가입
              </button>
              <button
                onClick={openLoginModal}
                className="px-3 py-1.5 text-sm font-medium text-white bg-[#E8513D] rounded-lg hover:bg-opacity-90 transition-colors btn-press"
              >
                로그인
              </button>
            </>
          )}
        </div>
      </div>
    </header>
    <LoginModal />
    <SignupModal />
    </>
  );
}
