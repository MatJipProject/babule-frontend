"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function SignupModal() {
  const { isSignupModalOpen, closeSignupModal, openLoginModal, signup } =
    useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nickname: "",
    birth: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!isSignupModalOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signup({
        username: formData.email, // API spec usually expects username/email
        password: formData.password,
        nickname: formData.nickname,
        birth: formData.birth,
        phone: formData.phone,
        email: formData.email,
      });
    } catch (error) {
      // Error handled in context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">회원가입</h2>
            <button
              onClick={closeSignupModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="이메일"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
            />
            <Input
              label="비밀번호"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="8자 이상 입력해주세요"
            />
            <Input
              label="닉네임"
              name="nickname"
              type="text"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="별명"
            />
            <Input
              label="생년월일"
              name="birth"
              type="text"
              value={formData.birth}
              onChange={handleChange}
              placeholder="YYYY-MM-DD"
            />
            <Input
              label="전화번호"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-0000-0000"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#E8513D] hover:bg-[#d9402c] text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/30 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? "가입 중..." : "가입하기"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            이미 계정이 있으신가요?{" "}
            <button
              onClick={openLoginModal}
              className="text-[#E8513D] font-semibold hover:underline"
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
      </label>
      <input
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8513D] focus:border-transparent outline-none transition-all text-gray-900 bg-gray-50 focus:bg-white"
        required
        {...props}
      />
    </div>
  );
}