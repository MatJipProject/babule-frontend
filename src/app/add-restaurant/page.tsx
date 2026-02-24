"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddRestaurantPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    category: "KOREAN",
    description: "",
    imageUrl: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 실제 API 연동 필요
    console.log("Submitting:", formData);
    alert("맛집이 성공적으로 추가되었습니다!");
    router.push("/list");
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-orange-50 to-rose-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-white/50">
          <div className="bg-gradient-to-r from-[#E8513D] to-[#F97316] p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">맛집 추가하기</h1>
              <p className="opacity-90 font-medium">
                나만의 숨은 맛집을 공유해보세요!
              </p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* 맛집 이름 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                맛집 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#E8513D] focus:ring-0 transition-colors bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-400"
                placeholder="예: 맛있는 떡볶이집"
                required
              />
            </div>

            {/* 카테고리 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                카테고리 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#E8513D] focus:ring-0 transition-colors bg-gray-50 focus:bg-white appearance-none text-gray-800"
                >
                  <option value="KOREAN">한식</option>
                  <option value="CHINESE">중식</option>
                  <option value="JAPANESE">일식</option>
                  <option value="WESTERN">양식</option>
                  <option value="SNACK">분식</option>
                  <option value="ETC">기타</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            {/* 주소 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                주소 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#E8513D] focus:ring-0 transition-colors bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-400"
                placeholder="서울시 강남구..."
                required
              />
            </div>

            {/* 설명 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                설명
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#E8513D] focus:ring-0 transition-colors bg-gray-50 focus:bg-white resize-none text-gray-800 placeholder-gray-400"
                placeholder="이 맛집의 특징을 알려주세요!"
              />
            </div>

            {/* 사진 추가 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                사진 추가
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-[#E8513D] transition-colors bg-gray-50 hover:bg-gray-100">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-[#E8513D] hover:text-[#d9402c] focus-within:outline-none"
                    >
                      <span>파일 업로드</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => {
                          // TODO: 파일 업로드 로직 구현
                          if (e.target.files && e.target.files[0]) {
                            console.log("File selected:", e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[#E8513D] to-[#F97316] text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              맛집 등록하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}