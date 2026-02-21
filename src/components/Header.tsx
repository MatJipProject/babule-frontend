"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

  const currentLabel =
    NAV_ITEMS.find((item) => item.href === pathname)?.label ?? "";

  return (
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
        </nav>

        {/* 유저 아이콘 */}
        <Link
          href="/my"
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors btn-press"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </Link>
      </div>
    </header>
  );
}
