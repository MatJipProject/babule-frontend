"use client";

import { useState, useEffect, useCallback } from "react";
import KakaoMapComponent from "@/components/KakaoMap";
import PlaceDetailCard from "@/components/PlaceDetailCard";
import { dummyPlaces } from "@/data/dummyPlaces";
import MenuRoulette from "@/components/MenuRoulette";
import type { PlaceData } from "@/types/kakao";

const HEADER_HEIGHT = 56;

const tabs = ["홈", "맛집 지도", "메뉴 추천", "맛집 목록", "마이"] as const;
type Tab = (typeof tabs)[number];

function HomePage() {
  return (
    <div className="flex-1 overflow-y-auto bg-white">
      {/* 히어로 배너 */}
      <div className="max-w-[900px] mx-auto px-4 md:px-6 pt-4 md:pt-6 animate-fade-in-up">
        <div className="w-full h-[140px] sm:h-[180px] md:h-[240px] bg-gray-200 rounded-2xl" />
      </div>

      {/* 지금 인기 장소 */}
      <section className="max-w-[900px] mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-4">
        <h2 className="text-xl md:text-2xl font-bold text-red-400 text-center mb-6 md:mb-10 animate-fade-in-up animate-delay-1">
          지금 인기 장소
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {dummyPlaces.slice(0, 3).map((place, i) => (
            <div
              key={place.id}
              className={`group cursor-pointer animate-fade-in-up animate-delay-${i + 2} hover:-translate-y-1 transition-transform duration-200`}
            >
              <div className="aspect-[4/3] bg-gray-200 rounded-xl mb-2 overflow-hidden">
                <div className="w-full h-full bg-gray-200 group-hover:scale-105 transition-transform duration-300" />
              </div>
              <p className="text-xs text-gray-500 truncate">{place.name}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6 animate-fade-in-up animate-delay-5">
          <button className="bg-gray-900 text-white text-xs font-medium px-5 py-2 rounded-full hover:bg-gray-700 transition-colors">
            view more
          </button>
        </div>
      </section>

      {/* 새로운 맛집 발견! */}
      <section className="max-w-[900px] mx-auto px-4 md:px-6 pt-8 md:pt-10 pb-8 md:pb-12">
        <h2 className="text-xl md:text-2xl font-bold text-red-400 text-center mb-6 md:mb-8 animate-fade-in-up">
          새로운 맛집 발견!
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {dummyPlaces.slice(0, 3).map((place, i) => (
            <div
              key={place.id}
              className={`bg-gray-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200 animate-fade-in-up animate-delay-${i + 1}`}
            >
              <div className="aspect-[4/3] bg-gray-300 overflow-hidden">
                <div className="w-full h-full bg-gray-300 hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-700 leading-relaxed line-clamp-2 mb-2">
                  &ldquo;{place.review}&rdquo;
                </p>
                <p className="text-xs text-gray-500">{place.name}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6 animate-fade-in-up animate-delay-4">
          <button className="bg-gray-900 text-white text-xs font-medium px-5 py-2 rounded-full hover:bg-gray-700 transition-colors">
            view more
          </button>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  const [selectedPlace, setSelectedPlace] = useState<PlaceData | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("홈");

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSelectedPlace(null);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        () => {
          setCurrentLocation({ lat: 37.4842, lng: 126.8959 });
        },
      );
    } else {
      setCurrentLocation({ lat: 37.4842, lng: 126.8959 });
    }
  }, []);

  const handleMapReady = useCallback(() => {}, []);

  const renderContent = () => {
    switch (activeTab) {
      case "홈":
        return <HomePage />;
      case "맛집 지도":
        return (
          <div className="relative flex-1">
            <KakaoMapComponent
              places={dummyPlaces}
              onPlaceClick={setSelectedPlace}
              currentLocation={currentLocation}
              onMapReady={handleMapReady}
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
