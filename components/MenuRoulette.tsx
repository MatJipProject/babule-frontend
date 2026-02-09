"use client";

import { useState, useEffect } from "react";

interface Category {
  name: string;
  emoji: string;
  menus: string[];
}

const CATEGORIES: Category[] = [
  {
    name: "한식",
    emoji: "🍚",
    menus: ["김치찌개", "된장찌개", "비빔밥", "불고기", "삼겹살", "갈비탕", "냉면", "제육볶음"],
  },
  {
    name: "중식",
    emoji: "🥟",
    menus: ["짜장면", "짬뽕", "탕수육", "마파두부", "볶음밥", "깐풍기", "양장피", "마라탕"],
  },
  {
    name: "일식",
    emoji: "🍣",
    menus: ["초밥", "라멘", "우동", "돈카츠", "카레", "사시미", "오코노미야끼", "소바"],
  },
  {
    name: "양식",
    emoji: "🍝",
    menus: ["파스타", "스테이크", "리조또", "피자", "햄버거", "오믈렛", "그라탕", "샐러드"],
  },
  {
    name: "분식",
    emoji: "🍜",
    menus: ["떡볶이", "순대", "김밥", "라볶이", "튀김", "어묵", "쫄면", "비빔국수"],
  },
  {
    name: "카페/디저트",
    emoji: "☕",
    menus: ["아메리카노", "카페라떼", "케이크", "마카롱", "와플", "빙수", "스무디", "크로플"],
  },
  {
    name: "치킨",
    emoji: "🍗",
    menus: ["후라이드", "양념치킨", "간장치킨", "마늘치킨", "허니버터", "불닭", "반반치킨", "순살치킨"],
  },
  {
    name: "야식",
    emoji: "🌙",
    menus: ["족발", "보쌈", "곱창", "회", "닭발", "떡볶이", "라면", "치즈볼"],
  },
];

// 채도 낮추고 톤 맞춘 파스텔 팔레트
const SEGMENT_COLORS = [
  "#F87171", "#FB923C", "#FBBF24", "#34D399",
  "#60A5FA", "#A78BFA", "#F472B6", "#38BDF8",
];

function useWheelSize() {
  const [size, setSize] = useState(400);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setSize(260);
      else if (w < 768) setSize(320);
      else setSize(400);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}

export default function MenuRoulette() {
  const wheelSize = useWheelSize();
  const half = wheelSize / 2;
  const [selectedCategory, setSelectedCategory] = useState<Category>(CATEGORIES[0]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const handleCategorySelect = (category: Category) => {
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
    <div className="flex-1 overflow-y-auto bg-gray-50/80">
      <div className="max-w-[640px] mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col items-center">
        <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 mb-1">
          오늘 뭐 먹지?
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mb-5 md:mb-7">
          분야를 선택하고 룰렛을 돌려보세요!
        </p>

        {/* 카테고리 선택 */}
        <div className="flex gap-1.5 sm:gap-2 mb-6 md:mb-10 flex-wrap justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategorySelect(cat)}
              className={`flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                selectedCategory.name === cat.name
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              <span>{cat.emoji}</span>
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
                filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.15))",
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
              background: "#1f2937",
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
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
                      stroke="rgba(255,255,255,0.5)"
                      strokeWidth="1.5"
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
                        textShadow: "0 1px 3px rgba(0,0,0,0.3)",
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
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
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
          className={`px-8 sm:px-12 py-3 sm:py-3.5 rounded-full text-white font-bold text-base sm:text-lg transition-all duration-200 ${
            spinning
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-900 hover:bg-gray-800 active:scale-95"
          }`}
        >
          {spinning ? "돌리는 중..." : "돌리기!"}
        </button>

        {/* 결과 */}
        {result && (
          <div className="mt-6 md:mt-8 text-center animate-popup-in">
            <p className="text-gray-400 text-xs sm:text-sm mb-2">오늘의 추천 메뉴는</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">
              {result}
            </p>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">맛있게 드세요!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) {
  const startRad = ((startAngle - 90) * Math.PI) / 180;
  const endRad = ((endAngle - 90) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}
