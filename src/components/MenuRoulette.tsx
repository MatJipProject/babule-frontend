"use client";

import { useState } from "react";
import { MENU_CATEGORIES, SEGMENT_COLORS } from "@/data/constants";
import type { MenuCategory } from "@/data/constants";
import { useWheelSize } from "@/hooks/useWheelSize";
import { describeArc } from "@/utils/svg";

interface MenuRouletteProps {
  onFindPlaces?: (menu: string) => void;
}

export default function MenuRoulette({ onFindPlaces }: MenuRouletteProps = {}) {
  const wheelSize = useWheelSize();
  const half = wheelSize / 2;
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>(MENU_CATEGORIES[0]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const handleCategorySelect = (category: MenuCategory) => {
    if (spinning) return;
    setSelectedCategory(category);
    setResult(null);
    setRotation(0);
  };

  const spin = () => {
    if (spinning) return;

    setSpinning(true);
    setResult(null);

    const menus = selectedCategory.menus;
    const segmentAngle = 360 / menus.length;
    const randomIndex = Math.floor(Math.random() * menus.length);

    const targetStop = 360 - (randomIndex * segmentAngle + segmentAngle / 2);
    const currentAngle = rotation % 360;
    let delta = targetStop - currentAngle;
    if (delta < 0) delta += 360;
    const fullSpins = 360 * (5 + Math.floor(Math.random() * 3));
    const newRotation = rotation + fullSpins + delta;

    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      setResult(menus[randomIndex]);
    }, 4000);
  };

  const menus = selectedCategory.menus;
  const segmentAngle = 360 / menus.length;
  const borderWidth = wheelSize < 320 ? 5 : 7;

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/50">
      <div className="max-w-[640px] mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col items-center">
        <p className="text-xs text-[#E8513D] font-bold tracking-widest uppercase mb-1">Menu Roulette</p>
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight mb-1">
          오늘 뭐 먹지?
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mb-5 md:mb-7">
          분야를 선택하고 룰렛을 돌려보세요!
        </p>

        {/* 카테고리 선택 */}
        <div className="flex gap-1.5 sm:gap-2 mb-6 md:mb-10 flex-wrap justify-center max-w-[520px]">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategorySelect(cat)}
              className={`flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                selectedCategory.name === cat.name
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-white text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              style={selectedCategory.name !== cat.name ? { boxShadow: "0 1px 2px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)" } : undefined}
            >
              <span className="text-sm">{cat.emoji}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* 룰렛 */}
        <div className="relative mb-6 md:mb-10">
          {/* 화살표 */}
          <div className="absolute left-1/2 -translate-x-1/2 z-20" style={{ top: -(borderWidth + 6) }}>
            <div
              className="w-0 h-0"
              style={{
                borderLeft: `${wheelSize < 320 ? 10 : 13}px solid transparent`,
                borderRight: `${wheelSize < 320 ? 10 : 13}px solid transparent`,
                borderTop: `${wheelSize < 320 ? 20 : 26}px solid #1f2937`,
                filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.2))",
              }}
            />
          </div>

          {/* 외곽 링 */}
          <div
            className="rounded-full relative"
            style={{
              width: wheelSize + borderWidth * 2,
              height: wheelSize + borderWidth * 2,
              padding: borderWidth,
              background: "linear-gradient(145deg, #1f2937, #111827)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {/* 바퀴 */}
            <div
              className="rounded-full relative overflow-hidden"
              style={{
                width: wheelSize,
                height: wheelSize,
                transform: `rotate(${rotation}deg)`,
                transition: spinning
                  ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                  : "none",
              }}
            >
              <svg
                className="absolute inset-0"
                width={wheelSize}
                height={wheelSize}
                viewBox={`0 0 ${wheelSize} ${wheelSize}`}
              >
                {menus.map((_, i) => {
                  const startAngle = i * segmentAngle;
                  return (
                    <path
                      key={i}
                      d={describeArc(half, half, half, startAngle, startAngle + segmentAngle)}
                      fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth="1"
                    />
                  );
                })}
              </svg>

              {/* 라벨 */}
              {menus.map((menu, i) => {
                const startAngle = i * segmentAngle;
                const midAngle = startAngle + segmentAngle / 2;
                const radMid = ((midAngle - 90) * Math.PI) / 180;
                const labelX = half + Math.cos(radMid) * (half * 0.66);
                const labelY = half + Math.sin(radMid) * (half * 0.66);

                return (
                  <div
                    key={menu}
                    className="absolute pointer-events-none"
                    style={{
                      left: labelX,
                      top: labelY,
                      transform: `translate(-50%, -50%) rotate(${midAngle}deg)`,
                    }}
                  >
                    <span
                      className="font-bold text-white whitespace-nowrap"
                      style={{
                        fontSize: wheelSize < 320 ? 9 : wheelSize < 400 ? 11 : 13,
                        textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                      }}
                    >
                      {menu}
                    </span>
                  </div>
                );
              })}

              {/* 가운데 원 */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full z-10 flex items-center justify-center"
                style={{
                  width: wheelSize < 320 ? 42 : wheelSize < 400 ? 54 : 66,
                  height: wheelSize < 320 ? 42 : wheelSize < 400 ? 54 : 66,
                  fontSize: wheelSize < 320 ? 20 : wheelSize < 400 ? 26 : 32,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.12), 0 0 0 3px rgba(255,255,255,0.5)",
                }}
              >
                {selectedCategory.emoji}
              </div>
            </div>
          </div>
        </div>

        {/* 스핀 버튼 */}
        <button
          onClick={spin}
          disabled={spinning}
          className={`group flex items-center gap-2 px-8 sm:px-12 py-3 sm:py-3.5 rounded-full text-white font-bold text-base sm:text-lg transition-all duration-200 ${
            spinning
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 active:scale-95 shadow-lg shadow-gray-900/20"
          }`}
        >
          {spinning ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              돌리는 중...
            </>
          ) : (
            <>
              돌리기!
              <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </>
          )}
        </button>

        {/* 결과 */}
        {result && (
          <div className="mt-6 md:mt-8 w-full max-w-[360px] animate-popup-in">
            <div className="bg-white rounded-2xl p-6 text-center" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.04)" }}>
              <p className="text-gray-400 text-xs sm:text-sm mb-2">오늘의 추천 메뉴는</p>
              <p className="text-3xl sm:text-4xl font-black text-gray-900 mb-1 tracking-tight">
                {result}
              </p>
              <p className="text-gray-300 text-xs sm:text-sm mt-1 mb-4">맛있게 드세요!</p>
              {onFindPlaces && (
                <button
                  onClick={() => onFindPlaces(result)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E8513D] to-[#F2734E] text-white text-sm font-semibold rounded-xl hover:from-[#d4462f] hover:to-[#e5623f] active:scale-[0.98] transition-all shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  이 메뉴 맛집 보러가기
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
