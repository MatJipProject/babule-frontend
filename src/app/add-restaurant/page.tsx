"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// 검색 결과 타입 정의
interface SearchResult {
  id: number;
  name: string;
  address: string;
  imageUrl: string;
}

export default function AddRestaurantPage() {
  const router = useRouter();
  const { user, openLoginModal, openSignupModal } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    category: "KOREAN",
    description: "",
    imageUrl: "",
  });
  const [restaurantName, setRestaurantName] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);



  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    // TODO: 실제 API 연동 필요
    // API 명세에 따라, restaurant_id가 실제로는 검색어(이름)를 의미하는 것으로 간주하고 구현합니다.
    if (!restaurantName.trim()) {
      alert("검색할 맛집 이름을 입력해주세요.");
      return;
    }
    const mockApiUrl = `/api/v1/restaurants/${restaurantName}`; // 요청 URL
    console.log("Searching:", restaurantName);

    // --- API 호출 시뮬레이션 ---
    // 실제로는 fetch 등을 사용하여 API를 호출하고 데이터를 받아옵니다.
    // const response = await fetch(mockApiUrl);
    // const data = await response.json();
    // setSearchResults(data.results);

    // 현재는 목(mock) 데이터를 사용합니다.
    setSearchResults([
      {
        id: 1,
        name: restaurantName,
        address: "서울시 강남구",
        imageUrl: "https://source.unsplash.com/random/200x200",
      },
      {
        id: 2,
        name: `${restaurantName} 2호점`,
        address: "서울시 서초구",
        imageUrl: "https://source.unsplash.com/random/200x201",
      },
    ]);
    console.log("Mock API URL:", mockApiUrl);
  };

  const handleSelectRestaurant = (result: SearchResult) => {
    setFormData((prev) => ({ ...prev, name: result.name, address: result.address, imageUrl: result.imageUrl }));
    setRestaurantName(result.name); // 검색창에도 선택한 맛집 이름 반영
    setSearchResults([]); // 목록 숨기기
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      alert("맛집을 검색하고 선택해주세요.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요한 서비스입니다.");
      openLoginModal();
      return;
    }

    const restaurantId = formData.name;
    const requestBody = new FormData();

    const requestData = {
      category: formData.category,
      address: formData.address,
      description: formData.description,
    };

    requestBody.append("request_data", JSON.stringify(requestData));

    if (imageFile) {
      requestBody.append("files", imageFile);
    }

    try {
      const response = await fetch(
        `https://api.baebulook.site/api/v1/restaurants/${restaurantId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: requestBody,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "맛집 등록에 실패했습니다.");
      }

      alert("맛집이 성공적으로 추가되었습니다!");
      router.push("/list");
    } catch (error: any) {
      console.error("Failed to add restaurant:", error);
      alert(error.message);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-56px)] bg-gray-50 flex flex-col items-center justify-center text-center p-4">
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-lg max-w-md w-full border border-gray-100">
          <svg className="w-16 h-16 mx-auto text-orange-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">로그인이 필요해요</h1>
          <p className="text-gray-600 mb-6">맛집을 추가하려면 먼저 로그인해주세요.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={openLoginModal}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#E8513D] to-[#F97316] text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              로그인
            </button>
            <button
              onClick={openSignupModal}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors duration-200"
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            {/* 맛집 검색 */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                맛집 검색 <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="restaurantName"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#E8513D] focus:ring-0 transition-colors bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-400"
                  placeholder="예: 맛있는 떡볶이집"
                  required
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="ml-4 px-6 py-3 bg-gradient-to-r from-[#E8513D] to-[#F97316] text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  검색
                </button>
              </div>
              {searchResults.length > 0 && (
                <ul className="mt-2 border border-gray-200 rounded-xl bg-white shadow-lg z-20 relative">
                  {searchResults.map((result) => (
                    <li key={result.id} onClick={() => handleSelectRestaurant(result)} className="p-4 flex items-center cursor-pointer hover:bg-gray-50 border-b last:border-b-0">
                      <img src={result.imageUrl} alt={result.name} className="w-10 h-10 rounded-full mr-4 object-cover" />
                      <div>
                        <p className="font-semibold">{result.name}</p>
                        <p className="text-sm text-gray-500">{result.address}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
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
                readOnly // 검색 후 자동 입력되므로 읽기 전용으로 설정
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
              {formData.imageUrl && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">선택된 이미지:</p>
                  <img src={formData.imageUrl} alt="미리보기" className="w-[100px] h-[100px] rounded-xl object-cover" />
                </div>
              )}
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
                          const file = e.target.files ? e.target.files[0] : null;
                          if (file) {
                            setImageFile(file);
                            setFormData((prev) => ({
                              ...prev,
                              imageUrl: URL.createObjectURL(file),
                            }));
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