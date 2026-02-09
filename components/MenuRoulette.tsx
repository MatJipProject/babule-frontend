"use client";

import { useState } from "react";

interface Category {
  name: string;
  emoji: string;
  color: string;
  menus: string[];
}

const CATEGORIES: Category[] = [
  {
    name: "한식",
    emoji: "🍚",
    color: "#FF6B6B",
    menus: ["김치찌개", "된장찌개", "비빔밥", "불고기", "삼겹살", "갈비탕", "냉면", "제육볶음"],
  },
  {
    name: "중식",
    emoji: "🥟",
    color: "#FFA94D",
    menus: ["짜장면", "짬뽕", "탕수육", "마파두부", "볶음밥", "깐풍기", "양장피", "마라탕"],
  },
  {
    name: "일식",
    emoji: "🍣",
    color: "#FFD43B",
    menus: ["초밥", "라멘", "우동", "돈카츠", "카레", "사시미", "오코노미야끼", "소바"],
  },
  {
    name: "양식",
    emoji: "🍝",
    color: "#69DB7C",
    menus: ["파스타", "스테이크", "리조또", "피자", "햄버거", "오믈렛", "그라탕", "샐러드"],
  },
  {
    name: "분식",
    emoji: "🍜",
    color: "#4DABF7",
    menus: ["떡볶이", "순대", "김밥", "라볶이", "튀김", "어묵", "쫄면", "비빔국수"],
  },
  {
    name: "카페/디저트",
    emoji: "☕",
    color: "#B197FC",
    menus: ["아메리카노", "카페라떼", "케이크", "마카롱", "와플", "빙수", "스무디", "크로플"],
  },
  {
    name: "치킨",
    emoji: "🍗",
    color: "#FF8787",
    menus: ["후라이드", "양념치킨", "간장치킨", "마늘치킨", "허니버터", "불닭", "반반치킨", "순살치킨"],
  },
  {
    name: "야식",
    emoji: "🌙",
    color: "#74C0FC",
    menus: ["족발", "보쌈", "곱창", "회", "닭발", "떡볶이", "라면", "치즈볼"],
  },
];

const WHEEL_COLORS = [
  "#FF6B6B", "#FFA94D", "#FFD43B", "#69DB7C",
  "#4DABF7", "#B197FC", "#FF8787", "#74C0FC",
];

const WHEEL_SIZE = 400;
const HALF = WHEEL_SIZE / 2;

export default function MenuRoulette() {
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
    const targetAngle =
      360 * (5 + Math.random() * 3) + (menus.length - randomIndex) * segmentAngle;
    const newRotation = rotation + targetAngle;

    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      setResult(menus[randomIndex]);
    }, 4000);
  };

  const menus = selectedCategory.menus;
  const segmentAngle = 360 / menus.length;

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="max-w-[640px] mx-auto px-6 py-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-red-400 mb-2">오늘 뭐 먹지?</h2>
        <p className="text-sm text-gray-400 mb-6">
          분야를 선택하고 룰렛을 돌려보세요!
        </p>

        {/* 카테고리 선택 (가로 한 줄) */}
        <div className="flex gap-2 mb-10 flex-wrap justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategorySelect(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory.name === cat.name
                  ? "bg-red-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* 룰렛 */}
        <div className="relative mb-10">
          {/* 화살표 */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <div
              className="w-0 h-0"
              style={{
                borderLeft: "14px solid transparent",
                borderRight: "14px solid transparent",
                borderTop: "24px solid #ef4444",
              }}
            />
          </div>

          {/* 바퀴 */}
          <div
            className="rounded-full relative overflow-hidden shadow-xl border-[6px] border-white"
            style={{
              width: WHEEL_SIZE,
              height: WHEEL_SIZE,
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                : "none",
            }}
          >
            {menus.map((menu, i) => {
              const startAngle = i * segmentAngle;
              const midAngle = startAngle + segmentAngle / 2;
              const radMid = ((midAngle - 90) * Math.PI) / 180;
              const labelX = HALF + Math.cos(radMid) * (HALF * 0.68);
              const labelY = HALF + Math.sin(radMid) * (HALF * 0.68);

              return (
                <div key={menu}>
                  <svg
                    className="absolute inset-0"
                    width={WHEEL_SIZE}
                    height={WHEEL_SIZE}
                    viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
                  >
                    <path
                      d={describeArc(HALF, HALF, HALF, startAngle, startAngle + segmentAngle)}
                      fill={WHEEL_COLORS[i % WHEEL_COLORS.length]}
                      stroke="white"
                      strokeWidth="2"
                    />
                  </svg>
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: labelX,
                      top: labelY,
                      transform: `translate(-50%, -50%) rotate(${midAngle}deg)`,
                    }}
                  >
                    <span className="text-[13px] font-bold text-white drop-shadow-md whitespace-nowrap">
                      {menu}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* 가운데 원 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg z-10 flex items-center justify-center text-3xl">
              {selectedCategory.emoji}
            </div>
          </div>
        </div>

        {/* 스핀 버튼 */}
        <button
          onClick={spin}
          disabled={spinning}
          className={`px-12 py-3.5 rounded-full text-white font-bold text-lg shadow-lg transition-all ${
            spinning
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600 hover:scale-105 active:scale-95"
          }`}
        >
          {spinning ? "돌리는 중..." : "돌리기!"}
        </button>

        {/* 결과 */}
        {result && (
          <div className="mt-8 text-center animate-popup-in">
            <p className="text-gray-500 text-sm mb-1">오늘의 추천 메뉴는</p>
            <p className="text-4xl font-extrabold text-red-500 mb-1">
              {result}
            </p>
            <p className="text-gray-400 text-sm">맛있게 드세요!</p>
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
