"use client";

import { useAuth } from "@/context/AuthContext";

export default function MyPage() {
  const { user, openLoginModal } = useAuth();

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-50 py-10 px-4">
      {user ? (
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">내 정보</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#E8513D]/10 p-6 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#E8513D] flex items-center justify-center text-white text-2xl font-bold">
                {user.nickname.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {user.nickname}
                </h3>
                <p className="text-[#E8513D] font-medium text-sm">
                  배부룩 회원
                </p>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <InfoItem label="이메일" value={user.email} />
              <InfoItem label="생년월일" value={user.birth} />
              <InfoItem label="전화번호" value={user.phone} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-sm w-full">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">로그인이 필요해요</h2>
            <p className="text-gray-500 mb-6">
              마이페이지는 로그인 후 이용할 수 있습니다.
            </p>
            <button
              onClick={openLoginModal}
              className="w-full py-3 px-4 bg-[#E8513D] hover:bg-[#d9402c] text-white font-bold rounded-xl transition-colors shadow-lg shadow-orange-500/30"
            >
              로그인하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col border-b border-gray-50 last:border-0 pb-4 last:pb-0">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </span>
      <span className="text-gray-800 font-medium">{value || "-"}</span>
    </div>
  );
}
