"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import KakaoMapComponent from "@/components/KakaoMap";
import PlaceDetailCard from "@/components/PlaceDetailCard";
import { dummyPlaces } from "@/data/dummyPlaces";
import MenuRoulette from "@/components/MenuRoulette";
import PlaceListPage from "@/components/PlaceListPage";
import type { PlaceData } from "@/types/kakao";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const HEADER_HEIGHT = 56;

const tabs = ["홈", "맛집 지도", "메뉴 추천", "맛집 목록", "마이"] as const;
type Tab = (typeof tabs)[number];

const regions = [
  "전체", "구로", "강남", "합정", "한남", "이태원", "성수", "을지로", "서초", "신사", "청담", "용산",
];

// 히어로 슬라이드 데이터 (dummyPlaces id 참조)
const hotPlaceConfigs = [
  { placeId: "102", emoji: "🫙", gradient: "from-[#78350F] to-[#B45309]", tag: "40년 전통" },
  { placeId: "1", emoji: "🍣", gradient: "from-[#E8513D] to-[#F2734E]", tag: "예약 필수" },
  { placeId: "6", emoji: "🍽️", gradient: "from-[#1E1B4B] to-[#312E81]", tag: "미쉐린 2스타" },
  { placeId: "101", emoji: "🍜", gradient: "from-[#065F46] to-[#10B981]", tag: "구로 핫플" },
  { placeId: "2", emoji: "🥩", gradient: "from-[#92400E] to-[#D97706]", tag: "숯불 맛집" },
  { placeId: "105", emoji: "🍣", gradient: "from-[#0C4A6E] to-[#0284C7]", tag: "가성비 초밥" },
  { placeId: "3", emoji: "🍝", gradient: "from-[#064E3B] to-[#059669]", tag: "파인다이닝" },
];

const menuCategories = [
  { name: "파스타", emoji: "🍝", color: "#F87171" },
  { name: "한식", emoji: "🍚", color: "#FB923C" },
  { name: "돈까스/우동", emoji: "🍛", color: "#FBBF24" },
  { name: "양식", emoji: "🍕", color: "#34D399" },
  { name: "카페", emoji: "☕", color: "#60A5FA" },
  { name: "치킨", emoji: "🍗", color: "#A78BFA" },
];

// 카테고리 이모지 맵
function getCategoryEmoji(category: string) {
  const map: Record<string, string> = {
    "오마카세": "🍣", "한식": "🍖", "양식": "🍝", "일식": "🍱", "카페": "☕",
  };
  return map[category] || "🍽️";
}

// 지역별 필터 (API 연결 시 서버에서 처리)
function filterByArea(places: PlaceData[], area: string) {
  if (area === "전체") return places;
  return places.filter((p) => p.area === area);
}

// ── 스크롤 트리거 훅 ──
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setRevealed(true); },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, revealed };
}

// ── 카운트업 훅 ──
function useCountUp(target: number, duration: number, start: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

interface HomePageProps {
  onNavigateToPlace: (place: PlaceData) => void;
}

function HomePage({ onNavigateToPlace }: HomePageProps) {
  const [heroVisible, setHeroVisible] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const regionScrollRef = useRef<HTMLDivElement>(null);

  // 스크롤 애니메이션 refs
  const statsReveal = useScrollReveal();
  const rankReveal = useScrollReveal();
  const reviewTickerReveal = useScrollReveal();

  // 통계 카운트업
  const totalPlaces = useCountUp(dummyPlaces.length, 1500, statsReveal.revealed);
  const totalReviews = useCountUp(
    dummyPlaces.reduce((sum, p) => sum + (p.reviewCount || 0), 0),
    2000,
    statsReveal.revealed,
  );
  const avgRating = useCountUp(46, 1200, statsReveal.revealed); // 4.6 x 10
  const totalAreas = useCountUp(
    new Set(dummyPlaces.map((p) => p.area)).size,
    1000,
    statsReveal.revealed,
  );

  // 랭킹 데이터 (리뷰 수 기준 TOP 5)
  const topRanked = [...dummyPlaces]
    .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
    .slice(0, 5);
  const maxReviewCount = topRanked[0]?.reviewCount || 1;

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // hotPlaces를 실제 데이터에서 구성
  const hotPlaces = hotPlaceConfigs.map((config, i) => {
    const place = dummyPlaces.find((p) => p.id === config.placeId)!;
    return { ...config, place, rank: i + 1 };
  });

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      {/* 섹션 1: 히어로 배너 */}
      <section
        className={`hero-section relative overflow-hidden transition-all duration-1000 ease-out ${
          heroVisible ? "hero-expanded" : "hero-collapsed"
        }`}
      >
        <div className="hero-swiper">
          <Swiper
            modules={[Pagination, Autoplay, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
            onSlideChange={(swiper) => setActiveHeroIndex(swiper.realIndex)}
            className="h-full"
          >
            {hotPlaces.map((item) => (
              <SwiperSlide key={item.rank}>
                <div
                  className={`relative min-h-[260px] md:min-h-[300px] bg-gradient-to-br ${item.gradient} cursor-pointer`}
                  onClick={() => onNavigateToPlace(item.place)}
                >
                  {/* 배경 장식 */}
                  <div className="absolute top-4 right-4 w-40 h-40 md:w-56 md:h-56 rounded-full bg-white/[0.04]" />
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/[0.04]" />

                  <div className="relative max-w-[900px] mx-auto px-5 md:px-8 py-7 md:py-10 h-full">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-10 h-full">
                      {/* 텍스트 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className="inline-flex items-center bg-white/15 backdrop-blur-sm text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full tracking-wider border border-white/10">
                            THICKEATSCORE
                          </span>
                          <span className="inline-flex items-center bg-white/20 text-white text-[10px] md:text-xs font-medium px-2.5 py-1 rounded-full">
                            {item.tag}
                          </span>
                        </div>
                        <h2 className="text-[22px] md:text-[36px] font-extrabold text-white leading-tight mb-1">
                          지금 가장 핫한 맛집
                        </h2>
                        <p className="text-white/70 text-sm md:text-base mb-5">
                          배부룩 큐레이팅이 들려주는 진짜 맛집
                        </p>
                        {/* 순위 + 별점 */}
                        <div className="flex items-center gap-3">
                          <span className="bg-white text-[#E8513D] text-xs md:text-sm font-extrabold w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-md">
                            {item.rank}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-yellow-300 text-sm">★</span>
                            <span className="text-white font-bold text-sm">{item.place.rating}</span>
                            <span className="text-white/50 text-xs">({item.place.reviewCount})</span>
                          </div>
                        </div>
                      </div>

                      {/* 이미지 + 정보 카드 */}
                      <div className="w-full md:w-[260px] shrink-0">
                        <div className="relative">
                          <div className="w-full aspect-[4/3] bg-white/15 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10">
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-5xl md:text-7xl drop-shadow-lg">{item.emoji}</span>
                            </div>
                          </div>
                          <div className="absolute -bottom-3 left-2 md:left-0 bg-white rounded-xl shadow-lg px-3.5 py-2.5 max-w-[210px]">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <p className="text-xs font-bold text-gray-900 truncate">{item.place.name}</p>
                              <span className="text-[10px] text-gray-400 shrink-0 bg-gray-100 px-1.5 py-0.5 rounded">{item.place.category}</span>
                            </div>
                            <p className="text-[10px] text-gray-500 line-clamp-1">{item.place.review}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* 커스텀 슬라이드 카운터 */}
          <div className="absolute bottom-3 right-4 md:right-8 z-10 bg-black/30 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-full border border-white/10">
            {activeHeroIndex + 1} / {hotPlaces.length}
          </div>
        </div>
      </section>

      {/* 섹션 2: 지역 선택 */}
      <section className="max-w-[900px] mx-auto px-4 md:px-6 pt-6 pb-2 animate-fade-in-up animate-delay-2">
        <p className="text-sm text-gray-600 mb-3 font-medium">아래의 정보를 골라봐요</p>
        <div
          ref={regionScrollRef}
          className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedRegion === region
                  ? "bg-[#E8513D] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </section>

      {/* 섹션 3: 지금 끌리는 메뉴는? */}
      <section className="mt-6 menu-crave-section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F97316] to-[#EA580C]" />

        <div className="relative max-w-[900px] mx-auto px-4 md:px-6 py-10 md:py-14">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-3xl md:text-4xl">🍴</span>
          </div>
          <p className="text-center text-white/70 text-xs tracking-[0.2em] mb-1 uppercase">
            Pasta &middot; Korean &middot; Japanese
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white text-center mb-8 md:mb-10">
            지금 끌리는 메뉴는?
          </h2>

          <div className="grid grid-cols-3 gap-x-6 gap-y-6 max-w-[400px] mx-auto">
            {menuCategories.map((cat, i) => (
              <div
                key={cat.name}
                className={`flex flex-col items-center cursor-pointer group animate-fade-in-up animate-delay-${i < 3 ? i + 1 : i - 1}`}
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/90 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                  <span className="text-3xl md:text-4xl">{cat.emoji}</span>
                </div>
                <p className="text-white text-xs md:text-sm font-medium mt-2 text-center">
                  {cat.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 섹션 4: 방금 저장된 맛집 (지역 필터 연동) */}
      <section className="max-w-[900px] mx-auto px-4 md:px-6 pt-10 md:pt-14 pb-10 md:pb-16">
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 text-center mb-8 md:mb-10 animate-fade-in-up">
          방금 저장된 맛집
        </h2>

        <div className="saved-swiper animate-fade-in-up animate-delay-1">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1.2}
            centeredSlides={false}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              480: { slidesPerView: 1.5, spaceBetween: 16 },
              640: { slidesPerView: 2.2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 20 },
            }}
            className="pb-10"
          >
            {filterByArea(dummyPlaces, selectedRegion).map((place) => (
              <SwiperSlide key={place.id}>
                <div
                  className="group cursor-pointer"
                  onClick={() => onNavigateToPlace(place)}
                >
                  <div className="aspect-[4/3] bg-gray-200 rounded-xl overflow-hidden mb-3 relative">
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                      <span className="text-4xl">{getCategoryEmoji(place.category)}</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white text-xs leading-relaxed line-clamp-2">
                        &ldquo;{place.review}&rdquo;
                      </p>
                    </div>
                  </div>
                  <div className="px-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-gray-800 group-hover:text-[#E8513D] transition-colors truncate">
                        {place.name}
                      </p>
                      {place.rating && (
                        <span className="text-xs text-yellow-500 font-medium shrink-0">★ {place.rating}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <p className="text-xs text-gray-500">{place.category} · {place.area}</p>
                      {place.reviewCount && (
                        <span className="text-[10px] text-gray-400">리뷰 {place.reviewCount.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="flex justify-center mt-4 animate-fade-in-up animate-delay-3">
          <button className="bg-gray-900 text-white text-sm font-medium px-8 py-2.5 rounded-full hover:bg-gray-700 transition-colors">
            view more
          </button>
        </div>
      </section>

      {/* ════════════════════════════════════════
          섹션 5: 실시간 리뷰 피드 (무한 마퀴)
          ════════════════════════════════════════ */}
      <section className="py-10 md:py-14 bg-gray-50 overflow-hidden">
        <div
          ref={reviewTickerReveal.ref}
          className={`scroll-reveal ${reviewTickerReveal.revealed ? "revealed" : ""}`}
        >
          <div className="max-w-[900px] mx-auto px-4 md:px-6 mb-6">
            <p className="text-xs text-[#E8513D] font-bold tracking-widest uppercase mb-1">Live Reviews</p>
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
              지금 올라오는 생생한 리뷰
            </h2>
          </div>

          {/* 1번 줄 → */}
          <div className="mb-4 overflow-hidden">
            <div className="marquee-track">
              {[...dummyPlaces, ...dummyPlaces].map((place, i) => {
                const review = place.reviews?.[0];
                if (!review) return null;
                return (
                  <div
                    key={`a-${i}`}
                    onClick={() => onNavigateToPlace(place)}
                    className="shrink-0 w-[300px] md:w-[340px] mx-2 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#E8513D] to-[#F97316] flex items-center justify-center shrink-0">
                        <span className="text-[10px] text-white font-bold">{review.author.charAt(0)}</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{review.author}</span>
                      <span className="text-yellow-400 text-xs">{"★".repeat(review.rating)}</span>
                      <span className="text-[10px] text-gray-400 ml-auto">{review.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-2">{review.content}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#E8513D]">{place.name}</span>
                      <span className="text-[10px] text-gray-400">{place.area}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2번 줄 ← (역방향) */}
          <div className="overflow-hidden">
            <div className="marquee-track-reverse">
              {[...dummyPlaces, ...dummyPlaces].map((place, i) => {
                const review = place.reviews?.[1] || place.reviews?.[0];
                if (!review) return null;
                return (
                  <div
                    key={`b-${i}`}
                    onClick={() => onNavigateToPlace(place)}
                    className="shrink-0 w-[280px] md:w-[320px] mx-2 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shrink-0">
                        <span className="text-[10px] text-white font-bold">{review.author.charAt(0)}</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{review.author}</span>
                      <span className="text-yellow-400 text-xs">{"★".repeat(review.rating)}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{review.content}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          섹션 6: 배부룩 통계 (카운트업 애니메이션)
          ════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#0F172A] animated-gradient" />
        {/* 플로팅 파티클 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[5%] text-4xl opacity-10 float-particle-1">🍣</div>
          <div className="absolute top-[60%] left-[15%] text-3xl opacity-10 float-particle-2">🍖</div>
          <div className="absolute top-[20%] right-[10%] text-5xl opacity-10 float-particle-3">🍝</div>
          <div className="absolute top-[70%] right-[20%] text-3xl opacity-10 float-particle-1">☕</div>
          <div className="absolute top-[40%] left-[50%] text-4xl opacity-10 float-particle-2">🍕</div>
          <div className="absolute top-[80%] left-[60%] text-3xl opacity-[0.07] float-particle-3">🍜</div>
        </div>

        <div
          ref={statsReveal.ref}
          className={`relative max-w-[900px] mx-auto px-4 md:px-6 py-16 md:py-24 scroll-reveal ${statsReveal.revealed ? "revealed" : ""}`}
        >
          <p className="text-center text-[#E8513D] text-xs font-bold tracking-widest uppercase mb-2">
            Baeburook in Numbers
          </p>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white text-center mb-4">
            숫자로 보는 배부룩
          </h2>
          <p className="text-center text-white/40 text-sm mb-12 md:mb-16">
            매일 업데이트되는 실시간 맛집 데이터
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { value: totalPlaces, suffix: "곳", label: "등록된 맛집", icon: "📍" },
              { value: totalReviews, suffix: "+", label: "누적 리뷰", icon: "💬", format: true },
              { value: avgRating, suffix: "", label: "평균 별점", icon: "⭐", decimal: true },
              { value: totalAreas, suffix: "개", label: "탐험 지역", icon: "🗺️" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="text-center group"
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="text-3xl mb-3 group-hover:scale-125 transition-transform duration-300">
                  {stat.icon}
                </div>
                <p className="stat-number text-3xl md:text-5xl font-black text-white mb-1">
                  {stat.decimal
                    ? (stat.value / 10).toFixed(1)
                    : stat.format
                      ? stat.value.toLocaleString()
                      : stat.value}
                  <span className="text-[#E8513D] text-lg md:text-2xl ml-0.5">{stat.suffix}</span>
                </p>
                <p className="text-white/50 text-xs md:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          섹션 7: 이 주의 맛집 TOP 5 (애니메이션 랭킹)
          ════════════════════════════════════════ */}
      <section className="max-w-[900px] mx-auto px-4 md:px-6 py-12 md:py-16">
        <div
          ref={rankReveal.ref}
          className={`scroll-reveal ${rankReveal.revealed ? "revealed" : ""}`}
        >
          <div className="flex items-end justify-between mb-8 md:mb-10">
            <div>
              <p className="text-xs text-[#E8513D] font-bold tracking-widest uppercase mb-1">Weekly Ranking</p>
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">이 주의 맛집 TOP 5</h2>
            </div>
            <span className="text-xs text-gray-400">리뷰 수 기준</span>
          </div>

          <div className="space-y-4">
            {topRanked.map((place, i) => {
              const barWidth = ((place.reviewCount || 0) / maxReviewCount) * 100;
              const medals = ["🥇", "🥈", "🥉"];
              return (
                <div
                  key={place.id}
                  onClick={() => onNavigateToPlace(place)}
                  className="group cursor-pointer rank-card"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 hover:shadow-md hover:border-gray-200 transition-all duration-200">
                    <div className="flex items-center gap-3 md:gap-4 mb-3">
                      {/* 순위 */}
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                        {i < 3 ? (
                          <span className="text-xl md:text-2xl">{medals[i]}</span>
                        ) : (
                          <span className="text-lg md:text-xl font-black text-gray-300">{i + 1}</span>
                        )}
                      </div>
                      {/* 정보 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-sm md:text-base font-bold text-gray-900 group-hover:text-[#E8513D] transition-colors truncate">
                            {place.name}
                          </h3>
                          {place.isHot && (
                            <span className="shrink-0 text-[10px] bg-red-50 text-red-500 font-bold px-1.5 py-0.5 rounded">HOT</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{place.category} · {place.area}</p>
                      </div>
                      {/* 별점 + 리뷰 수 */}
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 justify-end">
                          <span className="text-yellow-400 text-xs">★</span>
                          <span className="text-sm font-bold text-gray-800">{place.rating}</span>
                        </div>
                        <p className="text-[11px] text-gray-400">리뷰 {(place.reviewCount || 0).toLocaleString()}</p>
                      </div>
                    </div>
                    {/* 프로그레스 바 */}
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-[1.5s] ease-out ${
                          i === 0 ? "bg-gradient-to-r from-[#E8513D] to-[#F97316]" :
                          i === 1 ? "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]" :
                          i === 2 ? "bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8]" :
                          "bg-gray-300"
                        }`}
                        style={{ width: rankReveal.revealed ? `${barWidth}%` : "0%" }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-gray-500 text-center py-8 px-4">
        <p className="text-xs">배부룩 &copy; 2025. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function Home() {
  const [selectedPlace, setSelectedPlace] = useState<PlaceData | null>(null);
  const [focusPlace, setFocusPlace] = useState<PlaceData | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("홈");

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSelectedPlace(null);
  };

  // 홈에서 맛집 클릭 → 맛집지도 탭으로 이동 + 해당 위치 포커스
  const handleNavigateToPlace = useCallback((place: PlaceData) => {
    setActiveTab("맛집 지도");
    setSelectedPlace(place);
    setFocusPlace(place);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        () => {
          setCurrentLocation({ lat: 37.4955, lng: 126.8875 });
        },
      );
    } else {
      setCurrentLocation({ lat: 37.4955, lng: 126.8875 });
    }
  }, []);

  const handleMapReady = useCallback(() => {}, []);

  const renderContent = () => {
    switch (activeTab) {
      case "홈":
        return <HomePage onNavigateToPlace={handleNavigateToPlace} />;
      case "맛집 지도":
        return (
          <div className="relative flex-1">
            <KakaoMapComponent
              places={dummyPlaces}
              onPlaceClick={(place) => {
                setSelectedPlace(place);
                setFocusPlace(place);
              }}
              currentLocation={currentLocation}
              onMapReady={handleMapReady}
              focusPlace={focusPlace}
            />
            {selectedPlace && (
              <PlaceDetailCard
                place={selectedPlace}
                onClose={() => setSelectedPlace(null)}
              />
            )}
          </div>
        );
      case "메뉴 추천":
        return <MenuRoulette />;
      case "맛집 목록":
        return (
          <PlaceListPage
            places={dummyPlaces}
            onPlaceClick={handleNavigateToPlace}
          />
        );
      default:
        return (
          <div className="flex-1 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-300 mb-2">
                {activeTab}
              </p>
              <p className="text-sm text-gray-400">준비 중입니다</p>
            </div>
          </div>
        );
    }
  };

  return (
    <main className="h-screen flex flex-col overflow-hidden">
      {/* 헤더 */}
      <header
        className="bg-white border-b border-gray-200 shrink-0"
        style={{ height: HEADER_HEIGHT }}
      >
        <div className="max-w-[900px] mx-auto h-full flex items-center justify-center gap-3 sm:gap-6 md:gap-10 px-4 md:px-6 relative">
          <h1
            className="text-lg md:text-xl font-extrabold text-red-500 tracking-wider cursor-pointer shrink-0"
            onClick={() => handleTabChange("홈")}
          >
            배부룩
          </h1>
          <nav className="flex items-center h-full gap-3 sm:gap-6 md:gap-10 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`relative h-full text-xs sm:text-[13px] md:text-[15px] font-medium transition-colors whitespace-nowrap ${
                  tab === activeTab
                    ? "text-red-500"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab}
                {tab === activeTab && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-red-500 rounded-t-full" />
                )}
              </button>
            ))}
          </nav>
          <button className="absolute right-4 md:right-0 hidden sm:block text-xs text-gray-500 border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors">
            로그인
          </button>
        </div>
      </header>

      {/* 콘텐츠 영역 */}
      {renderContent()}
    </main>
  );
}
