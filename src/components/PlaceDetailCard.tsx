'use client';

import { useState, useEffect } from 'react';
import type { PlaceData } from '@/types/kakao';

interface PlaceDetailCardProps {
  place: PlaceData;
  onClose: () => void;
  isLoggedIn?: boolean;
}

export default function PlaceDetailCard({ place, onClose }: PlaceDetailCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("hungry-favorites");
    if (saved) {
      try {
        const favs = JSON.parse(saved);
        setIsFavorite(favs.includes(place.id));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, [place.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const saved = localStorage.getItem("hungry-favorites");
    let favs: string[] = [];
    if (saved) {
      try { favs = JSON.parse(saved); } catch (e) {}
    }
    const newFavs = favs.includes(place.id) 
      ? favs.filter(id => id !== place.id) 
      : [...favs, place.id];
    localStorage.setItem("hungry-favorites", JSON.stringify(newFavs));
    setIsFavorite(!isFavorite);
  };

  const BRAND = "#E8513D";
  const BRAND2 = "#F97316";

  // 카카오맵 좌표 기반 길찾기/보기 링크 생성
  const kakaoMapUrl = `https://map.kakao.com/link/map/${encodeURIComponent(place.name)},${place.lat},${place.lng}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-end">
      {/* 딤 배경 */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      {/* 하단 슬라이드 패널 */}
      <div className="relative w-full max-w-[480px] mx-auto bg-white rounded-t-[32px] overflow-hidden shadow-2xl animate-slide-up max-h-[85vh] flex flex-col">
        
        {/* 모바일 드래그 핸들 */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/40 rounded-full z-20" />

        {/* 상단 이미지 영역 */}
        <div className="relative h-[220px] shrink-0 overflow-hidden">
          <img
            src={place.images?.[0] || `https://picsum.photos/seed/${place.id}/800/600`}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          <button 
            onClick={onClose} 
            className="absolute top-5 left-5 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-black/50 transition-colors"
          >
            ✕
          </button>
          <button 
            onClick={toggleFavorite} 
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xl text-lg hover:scale-110 active:scale-90 transition-transform"
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
          
          <div className="absolute bottom-6 left-7">
            <span 
              className="text-white px-4 py-1.5 rounded-full text-[11px] font-black shadow-lg"
              style={{ background: `linear-gradient(135deg, ${BRAND}, ${BRAND2})` }}
            >
              {place.category}
            </span>
          </div>
        </div>

        {/* 상세 정보 영역 */}
        <div className="flex-1 overflow-y-auto p-7 pb-32 scrollbar-hide">
          <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">{place.name}</h2>
          
          <div className="flex items-center gap-1.5 mb-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`text-base ${i < Math.round(place.rating || 0) ? "text-yellow-400" : "text-gray-200"}`}>★</span>
            ))}
            <span className="font-black text-gray-900 ml-2 text-base">{place.rating?.toFixed(1)}</span>
            <span className="text-xs text-gray-400 ml-1">({place.reviewCount}개 리뷰)</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {place.tags?.map(t => (
              <span key={t} className="bg-[#FFF5F3] text-[#E8513D] px-4 py-1.5 rounded-full text-[11px] font-black border border-[#E8513D]/10">
                #{t}
              </span>
            ))}
          </div>

          <div className="bg-[#FAF9F7] p-5 rounded-2xl text-[14px] text-gray-600 leading-[1.8] mb-8 italic border border-[#F0EDE8]">
            💬 {place.description || place.review}
          </div>

          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <span className="text-2xl">📍</span>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">주소</p>
                <p className="text-[14px] text-gray-700 font-bold leading-relaxed">{place.address}</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-2xl">📞</span>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">전화</p>
                <p className="text-[14px] font-black" style={{ color: BRAND }}>{place.phone || "02-1234-5678"}</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-2xl">🕐</span>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">영업시간</p>
                <p className="text-[14px] text-gray-700 font-bold leading-relaxed">{place.openHours || "11:00 ~ 22:00 (연중무휴)"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 고정 버튼 (CTA) */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pt-4 bg-white/95 backdrop-blur-md border-t border-[#F0EDE8] z-30">
          <a
            href={kakaoMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-16 text-white font-black text-base rounded-[20px] flex items-center justify-center gap-2 shadow-2xl transition-all active:scale-[0.98] hover:scale-[1.01]"
            style={{ 
              background: `linear-gradient(135deg, ${BRAND}, ${BRAND2})`,
              boxShadow: `0 8px 30px ${BRAND}44`
            }}
          >
            🗺️ 지도에서 보기
          </a>
        </div>
      </div>
    </div>
  );
}
