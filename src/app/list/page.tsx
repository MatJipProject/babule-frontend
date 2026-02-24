"use client";

import { HEADER_HEIGHT } from "@/components/Header";
import { useState } from "react";

// ── img URL 없이 grad(그라디언트) + emoji 사용 ──
const PLACES = [
  { 
    id:"1", name:"진짜맛있는삼겹살", category:"한식", region:"홍대", rating:4.8, reviewCount:6, 
    tags:["#혼밥ok","#가성비"], emoji:"🥩", grad:"linear-gradient(135deg,#ff6b35,#f7931e)", 
    description:"홍대 골목 깊숙이 숨어있는 진짜배기 삼겹살집",
    address: "서울 마포구 어울마당로 123", phone: "02-333-1234", hours: "11:30 ~ 23:00"
  },
  { 
    id:"2", name:"홍대 라멘집", category:"일식", region:"홍대", rating:4.5, reviewCount:6, 
    tags:["#데이트","#분위기good"], emoji:"🍜", grad:"linear-gradient(135deg,#c94b4b,#4b134f)", 
    description:"진한 돈코츠 육수의 정통 라멘",
    address: "서울 마포구 와우산로 45", phone: "02-321-5678", hours: "11:00 ~ 21:00"
  },
  { 
    id:"3", name:"성수 브런치카페", category:"카페", region:"성수", rating:4.6, reviewCount:6, 
    tags:["#인스타감성","#브런치"], emoji:"☕", grad:"linear-gradient(135deg,#b79891,#6f4e37)", 
    description:"성수동 힙한 브런치 카페",
    address: "서울 성동구 연무장길 8", phone: "02-461-9988", hours: "09:00 ~ 20:00"
  },
  { 
    id:"4", name:"이태원 버거집", category:"양식", region:"이태원", rating:4.3, reviewCount:6, 
    tags:["#수제버거","#혼밥ok"], emoji:"🍔", grad:"linear-gradient(135deg,#f7971e,#ffd200)", 
    description:"두툼한 수제 패티 버거",
    address: "서울 용산구 이태원로 191", phone: "02-790-1122", hours: "11:30 ~ 22:00"
  },
  { 
    id:"5", name:"강남 스시", category:"일식", region:"강남", rating:4.9, reviewCount:6, 
    tags:["#오마카세","#특별한날"], emoji:"🍣", grad:"linear-gradient(135deg,#1a1a2e,#16213e)", 
    description:"신선한 재료의 스시 오마카세",
    address: "서울 강남구 테헤란로 25", phone: "02-555-4433", hours: "12:00 ~ 22:00 (Break 15~17)"
  },
  { 
    id:"6", name:"종로 설렁탕", category:"한식", region:"종로", rating:4.4, reviewCount:6, 
    tags:["#국물맛집","#아침식사"], emoji:"🍲", grad:"linear-gradient(135deg,#74b9ff,#a29bfe)", 
    description:"60년 전통 설렁탕",
    address: "서울 종로구 인사동길 12", phone: "02-733-1122", hours: "07:00 ~ 21:00"
  },
  { 
    id:"7", name:"명동 칼국수", category:"한식", region:"명동", rating:4.2, reviewCount:6, 
    tags:["#칼국수","#줄서는집"], emoji:"🍝", grad:"linear-gradient(135deg,#fd79a8,#e17055)", 
    description:"손칼국수 원조",
    address: "서울 중구 명동10길 25", phone: "02-776-5348", hours: "10:30 ~ 21:00"
  },
  { 
    id:"8", name:"성수 디저트바", category:"디저트", region:"성수", rating:4.7, reviewCount:6, 
    tags:["#인스타감성","#케이크"], emoji:"🎂", grad:"linear-gradient(135deg,#fccb90,#d57eeb)", 
    description:"인생 케이크집",
    address: "서울 성동구 아차산로 13", phone: "02-499-0011", hours: "11:00 ~ 22:00"
  },
  { 
    id:"9", name:"강남 파스타", category:"양식", region:"강남", rating:4.5, reviewCount:6, 
    tags:["#데이트","#파스타"], emoji:"🍝", grad:"linear-gradient(135deg,#55efc4,#00b894)", 
    description:"직접 만든 생면 파스타",
    address: "서울 강남구 강남대로 102길", phone: "02-567-8899", hours: "11:30 ~ 21:30"
  },
  { 
    id:"10", name:"잠실 곱창", category:"한식", region:"잠실", rating:4.6, reviewCount:6, 
    tags:["#야식","#술안주"], emoji:"🔥", grad:"linear-gradient(135deg,#f12711,#f5af19)", 
    description:"신선한 국내산 곱창",
    address: "서울 송파구 올림픽로 32길", phone: "02-412-3344", hours: "16:00 ~ 01:00"
  },
];

const CATEGORY_ICONS: Record<string, string> = {
  "한식": "🍚",
  "일식": "🍣",
  "양식": "🍝",
  "카페": "☕",
  "디저트": "🍰",
  "분식": "🥘",
};

const CATEGORIES = ["전체","한식","일식","양식","카페","디저트","분식"];
const REGIONS    = ["전체","홍대","성수","강남","이태원","종로","명동","잠실"];
const BRAND      = "#E8513D";
const BRAND2     = "#F97316";

interface Place {
  id: string;
  name: string;
  category: string;
  region: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  emoji: string;
  grad: string;
  description: string;
  address: string;
  phone: string;
  hours: string;
}

// ── 카드 ──────────────────────────────────────────
function PlaceCard({ place, isFav, onFav, onClick, reviewCount }: { 
  place: Place; 
  isFav: boolean; 
  onFav: () => void; 
  onClick: () => void;
  reviewCount: number;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 18, overflow: "hidden", cursor: "pointer", background: "white",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hov ? "0 12px 30px rgba(0,0,0,0.13)" : "0 2px 10px rgba(0,0,0,0.07)",
        transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      {/* 그라디언트 이미지 영역 */}
      <div style={{
        position: "relative", height: 118, overflow: "hidden",
        background: place.grad,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{
          fontSize: 48,
          transform: hov ? "scale(1.15)" : "scale(1)",
          transition: "transform 0.35s ease",
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
          display: "block",
        }}>{place.emoji}</span>

        {/* 카테고리 뱃지 */}
        <span style={{
          position: "absolute", top: 8, left: 8,
          fontSize: 9, fontWeight: 700, color: "white",
          background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)",
          padding: "2px 7px", borderRadius: 99,
          border: "1px solid rgba(255,255,255,0.25)",
        }}>{place.category}</span>

        {/* 즐겨찾기 */}
        <button onClick={e => { e.stopPropagation(); onFav(); }} style={{
          position: "absolute", top: 6, right: 6,
          width: 26, height: 26, borderRadius: "50%",
          background: "rgba(255,255,255,0.88)", border: "none",
          cursor: "pointer", fontSize: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
        }}>{isFav ? "❤️" : "🤍"}</button>
      </div>

      {/* 텍스트 영역 */}
      <div style={{ padding: "10px 10px 12px" }}>
        <h3 style={{
          fontSize: 12, fontWeight: 800, color: "#111", marginBottom: 5,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{place.name}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 7 }}>
          <span style={{ fontSize: 11, color: "#fbbf24" }}>★</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#111" }}>{place.rating}</span>
          <span style={{ fontSize: 10, color: "#b0b0b0" }}>({reviewCount})</span>
          <span style={{ marginLeft: "auto", fontSize: 9, color: "#b0b0b0" }}>📍{place.region}</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {place.tags.slice(0, 2).map(t => (
            <span key={t} style={{
              fontSize: 9, padding: "2px 7px", borderRadius: 99,
              background: "#fff5f3", color: BRAND, fontWeight: 600,
              border: `1px solid ${BRAND}28`, whiteSpace: "nowrap",
            }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 상세 슬라이드 패널 ───────────────────────────────
function DetailPanel({ place, isFav, onFav, onClose, onReviewSubmit }: {
  place: Place;
  isFav: boolean;
  onFav: () => void;
  onClose: () => void;
  onReviewSubmit: () => void;
}) {
  const [view, setView] = useState<"info" | "review" | "reviews">("info"); // "info" | "review" | "reviews"
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  // 리뷰 목록을 상태로 관리 (등록 후 즉시 반영 시뮬레이션)
  interface Review {
    id: number;
    author: string;
    date: string;
    rating: number;
    comment: string;
    photos: string[];
  }

  const [reviewsList, setReviewsList] = useState<Review[]>([
    { id: 1, author: "미식가A", date: "2024.02.20", rating: 5, comment: "진짜 맛있어요! 재방문 의사 200%입니다.", photos: [place.grad, place.grad] },
    { id: 2, author: "배고픈사람", date: "2024.02.18", rating: 4, comment: "양도 많고 친절하시네요. 다만 대기가 좀 길었어요.", photos: [] },
    { id: 3, author: "단골손님", date: "2024.02.15", rating: 5, comment: "여기만 오면 항상 과식하게 되네요. 고기 질이 정말 좋아요.", photos: [place.grad] },
    { id: 4, author: "혼밥러", date: "2024.02.10", rating: 4, comment: "혼자 가도 눈치 안 주시고 친절하게 응대해주셔서 좋았습니다.", photos: [] },
    { id: 5, author: "맛탐정", date: "2024.02.05", rating: 3, comment: "맛은 괜찮은데 가격이 조금 비싼 편인 것 같아요.", photos: [place.grad, place.grad, place.grad] },
    { id: 6, author: "푸드파이터", date: "2024.01.28", rating: 5, comment: "밑반찬까지 싹싹 비우고 왔습니다. 홍대 오면 무조건 여기죠!", photos: [] },
  ]);

  const isReviewForm = view === "review";
  const isReviewsList = view === "reviews";
  const isValid = comment.length >= 5;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 10) {
      alert("사진은 최대 10장까지 등록 가능합니다.");
      return;
    }
    const newPhotos = files.map(file => URL.createObjectURL(file));
    setPhotos([...photos, ...newPhotos]);
  };

  const removePhoto = (idx: number) => {
    setPhotos(photos.filter((_, i) => i !== idx));
  };

  const handleSubmitReview = () => {
    if (!isValid) return;

    const newReview = {
      id: Date.now(),
      author: "나 (작성자)",
      date: new Date().toLocaleDateString(),
      rating: rating,
      comment: comment,
      photos: [...photos]
    };

    setReviewsList([newReview, ...reviewsList]);
    setView("reviews");
    setComment("");
    setRating(5);
    setPhotos([]);
    onReviewSubmit();
  };

  return (
    <div className="detail-overlay" style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes dimIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        @media (min-width: 768px) {
          .detail-overlay {
            align-items: center !important;
            padding: 20px;
          }
          .detail-panel {
            max-width: 540px !important;
            border-radius: 24px !important;
            max-height: 85vh !important;
            animation: zoomIn 0.3s cubic-bezier(0.32,0.72,0,1) !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2) !important;
          }
        }
      `}</style>

      {/* 딤 배경 */}
      <div onClick={onClose} style={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.42)", backdropFilter: "blur(3px)",
        animation: "dimIn 0.25s ease",
      }} />

      {/* 바텀시트 (데스크탑에서는 모달) */}
      <div className="detail-panel" style={{
        position: "relative", width: "100%", background: "white",
        display: "flex", flexDirection: "column",
        maxHeight: "88vh",
        animation: "slideUp 0.32s cubic-bezier(0.32,0.72,0,1)",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
        borderRadius: "24px 24px 0 0", overflow: "hidden",
      }}>

        {/* 핸들 바 */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px", flexShrink: 0 }}>
          <div style={{ width: 40, height: 4, borderRadius: 99, background: "#e5e7eb" }} />
        </div>

        {/* 상단 헤더 영역 */}
        {view === "info" ? (
          <div style={{
            position: "relative", height: 200, flexShrink: 0,
            background: place.grad,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 16px", borderRadius: 20, overflow: "hidden",
          }}>
            <span style={{ fontSize: 80, filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.25))" }}>
              {place.emoji}
            </span>
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)",
            }} />
            <button onClick={onClose} style={{
              position: "absolute", top: 12, right: 12,
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "white", fontSize: 14, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
            <button onClick={onFav} style={{
              position: "absolute", top: 12, left: 12,
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(255,255,255,0.92)", border: "none",
              cursor: "pointer", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}>{isFav ? "❤️" : "🤍"}</button>
            <div style={{ position: "absolute", bottom: 12, left: 14 }}>
              <span style={{
                fontSize: 11, fontWeight: 700, color: "white",
                background: `linear-gradient(135deg,${BRAND},${BRAND2})`,
                padding: "3px 11px", borderRadius: 99,
              }}>{place.category}</span>
            </div>
          </div>
        ) : (
          <div style={{ padding: "10px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={() => setView("info")} style={{
              background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#666"
            }}>←</button>
            <h2 style={{ fontSize: 16, fontWeight: 800 }}>{isReviewForm ? "리뷰 등록" : "리뷰 목록"}</h2>
            <div style={{ width: 24 }} />
          </div>
        )}

        {/* 스크롤 콘텐츠 */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 110px" }}>
          {view === "info" && (
            <>
              <h2 style={{ fontSize: 21, fontWeight: 900, color: "#111", marginBottom: 10 }}>
                {place.name}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 14 }}>
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} style={{ fontSize: 15, color: i < Math.round(place.rating) ? "#fbbf24" : "#e5e7eb" }}>★</span>
                ))}
                                <span style={{ fontWeight: 800, color: "#111", fontSize: 14, marginLeft: 2 }}>{place.rating}</span>
                                <button onClick={() => setView("reviews")} style={{
                                  background: "none", border: "none", padding: 0,
                                  color: "#9ca3af", fontSize: 12, cursor: "pointer", marginLeft: 8,
                                  display: "inline-flex", alignItems: "center", gap: 2
                                }}>
                                  리뷰 {reviewsList.length}개 <span style={{ fontSize: 10, position: "relative", top: 0.5 }}>&gt;</span>
                                </button>
                              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
                {place.tags.map(t => (
                  <span key={t} style={{
                    fontSize: 11, padding: "4px 12px", borderRadius: 99,
                    background: "#fff5f3", color: BRAND, fontWeight: 600,
                    border: `1px solid ${BRAND}28`,
                  }}>{t}</span>
                ))}
              </div>
              <div style={{
                fontSize: 13, color: "#4b5563", lineHeight: 1.85,
                marginBottom: 20, padding: "14px 16px",
                background: "#fafafa", borderRadius: 14,
              }}>
                💬 {place.description}
              </div>
              {[
                ["📍", "주소", place.address],
                ["📞", "전화", place.phone],
                ["🕐", "영업시간", place.hours],
              ].map(([icon, label, val]) => (
                <div key={label} style={{ display: "flex", gap: 13, alignItems: "flex-start", marginBottom: 16 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <p style={{ fontSize: 10, color: "#9ca3af", marginBottom: 2 }}>{label}</p>
                    <p style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{val}</p>
                  </div>
                </div>
              ))}
            </>
          )}

          {isReviewForm && (
            <div style={{ animation: "dimIn 0.3s ease" }}>
              <div style={{ textAlign: "center", marginBottom: 30 }}>
                <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 15, color: "#111" }}>{place.name}은 어떠셨나요?</p>
                <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                  {[1, 2, 3, 4, 5].map(v => (
                    <button key={v} onClick={() => setRating(v)} style={{
                      background: "none", border: "none", fontSize: 32, cursor: "pointer",
                      color: v <= rating ? "#fbbf24" : "#e5e7eb",
                      transition: "transform 0.1s"
                    }} onPointerDown={e => e.currentTarget.style.transform="scale(0.9)"}
                       onPointerUp={e => e.currentTarget.style.transform="scale(1)"}>★</button>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: BRAND, marginTop: 10, fontWeight: 700 }}>
                  {["최악이에요", "별로예요", "보통이에요", "맛있어요", "최고예요"][rating-1]}
                </p>
              </div>

              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="솔직한 후기를 남겨주세요 (최소 5자)"
                style={{
                  width: "100%", height: 120, padding: 16, borderRadius: 16,
                  background: "#f9f9f9", border: "1px solid #eee", fontSize: 14,
                  outline: "none", resize: "none", boxSizing: "border-box",
                  marginBottom: 8
                }}
              />
              <div style={{ fontSize: 11, color: comment.length >= 5 ? "#10b981" : "#9ca3af", textAlign: "right", marginBottom: 20 }}>
                {comment.length} / 최소 5자
              </div>

              {/* 사진 등록 */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>사진 등록 ({photos.length}/10)</p>
                <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10, scrollbarWidth: "none" }}>
                  {/* 업로드 버튼 */}
                  {photos.length < 10 && (
                    <label style={{
                      flexShrink: 0, width: 80, height: 80, borderRadius: 12,
                      background: "#f3f4f6", border: "1px dashed #d1d5db",
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", gap: 4
                    }}>
                      <span style={{ fontSize: 20, color: "#9ca3af" }}>+</span>
                      <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
                    </label>
                  )}
                  {/* 사진 미리보기 */}
                  {photos.map((src, i) => (
                    <div key={i} style={{ position: "relative", flexShrink: 0 }}>
                      <img src={src} alt="preview" style={{ width: 80, height: 80, borderRadius: 12, objectFit: "cover" }} />
                      <button onClick={() => removePhoto(i)} style={{
                        position: "absolute", top: -5, right: -5, width: 20, height: 20, borderRadius: "50%",
                        background: "rgba(0,0,0,0.5)", color: "white", border: "none", fontSize: 10,
                        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
                      }}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {isReviewsList && (
            <div style={{ animation: "dimIn 0.3s ease" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {reviewsList.map(rev => (
                  <div key={rev.id} style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#333", marginRight: 8 }}>{rev.author}</span>
                        <span style={{ fontSize: 11, color: "#fbbf24" }}>★ {rev.rating}</span>
                      </div>
                      <span style={{ fontSize: 11, color: "#9ca3af" }}>{rev.date}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.6, marginBottom: 10 }}>{rev.comment}</p>
                    {rev.photos.length > 0 && (
                      <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" }}>
                        {rev.photos.map((p, idx) => (
                          <div key={idx} style={{ 
                            width: 70, height: 70, borderRadius: 8, 
                            background: p.startsWith('blob:') ? `url(${p}) center/cover` : p, 
                            flexShrink: 0 
                          }}>
                            {p.startsWith('blob:') && <img src={p} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA 버튼 */}
        <div style={{
          padding: "14px 20px 28px", background: "white", borderTop: "1px solid #f0ede8",
          display: "flex", gap: 10,
        }}>
          {view === "info" && (
            <>
              <button onClick={() => setView("review")} style={{
                flex: 1, padding: "15px",
                background: "#fff5f3",
                color: BRAND, fontWeight: 800, fontSize: 14,
                borderRadius: 14, border: `1px solid ${BRAND}44`, cursor: "pointer",
              }}>✍️ 리뷰 등록</button>
              <button style={{
                flex: 1.5, padding: "15px",
                background: `linear-gradient(135deg,${BRAND},${BRAND2})`,
                color: "white", fontWeight: 800, fontSize: 14,
                borderRadius: 14, border: "none", cursor: "pointer",
                boxShadow: `0 6px 20px ${BRAND}44`,
              }}>🗺️ 지도에서 보기</button>
            </>
          )}
          {isReviewForm && (
            <button
              onClick={handleSubmitReview}
              disabled={!isValid}
              style={{
                flex: 1, padding: "15px",
                background: isValid ? `linear-gradient(135deg,${BRAND},${BRAND2})` : "#e5e7eb",
                color: isValid ? "white" : "#9ca3af",
                fontWeight: 800, fontSize: 14,
                borderRadius: 14, border: "none",
                cursor: isValid ? "pointer" : "not-allowed",
                transition: "all 0.2s"
              }}>
              {isValid ? "등록 완료" : "5자 이상 작성해주세요"}
            </button>
          )}
          {isReviewsList && (
            <button onClick={() => setView("review")} style={{
              flex: 1, padding: "15px",
              background: `linear-gradient(135deg,${BRAND},${BRAND2})`,
              color: "white", fontWeight: 800, fontSize: 14,
              borderRadius: 14, border: "none", cursor: "pointer",
            }}>✍️ 나도 리뷰 쓰기</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── 메인 ───────────────────────────────────────────
export default function ListPage() {
  const [favs, setFavs]       = useState<Set<string>>(new Set());
  const [cat, setCat]         = useState("전체");
  const [region, setRegion]   = useState("전체");
  const [query, setQuery]     = useState("");
  const [onlyFav, setOnlyFav] = useState(false);
  const [detail, setDetail]   = useState<Place | null>(null);

  // 맛집별 리뷰 수 관리 상태 (초기값은 PLACES의 reviewCount)
  const [reviewCounts, setReviewCounts] = useState<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    PLACES.forEach(p => counts[p.id] = p.reviewCount);
    return counts;
  });

  const incrementReviewCount = (id: string) => setReviewCounts(prev => ({
    ...prev,
    [id]: prev[id] + 1
  }));

  const toggleFav = (id: string) => setFavs(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const filtered = PLACES.filter(p => {
    const q = query.toLowerCase();
    return (
      (cat === "전체" || p.category === cat) &&
      (region === "전체" || p.region === region) &&
      (!onlyFav || favs.has(p.id)) &&
      (!q || p.name.includes(q) || p.category.includes(q) || p.tags.some(t => t.includes(q)))
    );
  });

  return (
    <div style={{ fontFamily: "system-ui,-apple-system,sans-serif", background: "#f5f4f2", minHeight: `calc(100vh - ${HEADER_HEIGHT}px)` }}>

      {/* 헤더 */}
      <div style={{
        background: "white", padding: "18px 18px 0",
        position: "sticky", top: HEADER_HEIGHT, zIndex: 30,
        boxShadow: "0 1px 0 #eeebe6",
        margin: "0 -1rem", // layout padding 보정
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, padding: "0 18px" }}>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: "#111" }}>
            🍽️ <span style={{ color: BRAND }}>맛집</span> 목록
          </h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setOnlyFav(!onlyFav)} style={{
              padding: "5px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700,
              border: `1.5px solid ${onlyFav ? "#fca5a5" : "#e5e7eb"}`,
              background: onlyFav ? "#fef2f2" : "white",
              color: onlyFav ? "#ef4444" : "#9ca3af", cursor: "pointer",
            }}>{onlyFav ? "❤️ 즐겨찾기" : "🤍 즐겨찾기"}</button>
          </div>
        </div>

        {/* 검색 */}
        <div style={{ position: "relative", marginBottom: 12, padding: "0 18px" }}>
          <span style={{ position: "absolute", left: 34, top: "50%", transform: "translateY(-50%)", color: "#aaa", fontSize: 14 }}>🔍</span>
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="맛집 이름, 카테고리, 태그 검색"
            style={{
              width: "100%", padding: "12px 16px 12px 42px",
              background: "#f3f4f6", border: "none", borderRadius: 24,
              fontSize: 13, color: "#111", outline: "none", boxSizing: "border-box",
            }} />
        </div>

        {/* 필터 섹션 */}
        <div style={{ padding: "0 18px 12px" }}>
          {/* 지역 필터 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#666", display: "flex", alignItems: "center", gap: 3 }}>
                📍 지역
              </span>
            </div>
            <div style={{ display: "flex", gap: 7, overflowX: "auto", scrollbarWidth: "none", alignItems: "center", flex: 1 }}>
              {REGIONS.map(r => (
                <button key={r} onClick={() => setRegion(r)} style={{
                  flexShrink: 0, padding: "6px 14px", borderRadius: 99,
                  fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer",
                  background: region === r ? `linear-gradient(135deg,${BRAND},${BRAND2})` : "#f3f4f6",
                  color: region === r ? "white" : "#6b7280", transition: "all 0.18s",
                  boxShadow: region === r ? `0 4px 12px ${BRAND}44` : "none",
                }}>{r}</button>
              ))}
              {region !== "전체" && (
                <button 
                  onClick={() => setRegion("전체")}
                  style={{ 
                    flexShrink: 0, background: "none", border: "none", padding: "4px 8px", cursor: "pointer", 
                    fontSize: 14, color: "#9ca3af", fontWeight: "bold",
                    display: "flex", alignItems: "center", gap: 2
                  }}
                >
                  <span style={{ fontSize: 16 }}>↺</span>
                </button>
              )}
            </div>
          </div>

          {/* 카테고리 필터 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#666", display: "flex", alignItems: "center", gap: 3 }}>
                🍴 분야
              </span>
            </div>
            <div style={{ display: "flex", gap: 7, overflowX: "auto", scrollbarWidth: "none", alignItems: "center", flex: 1 }}>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCat(c)} style={{
                  flexShrink: 0, padding: "5px 14px", borderRadius: 99,
                  fontSize: 11, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 4,
                  border: `1.5px solid ${cat === c ? BRAND : "#e5e7eb"}`,
                  background: cat === c ? "#fff5f3" : "white",
                  color: cat === c ? BRAND : "#9ca3af", transition: "all 0.18s",
                }}>
                  {CATEGORY_ICONS[c] && <span style={{ fontSize: 13 }}>{CATEGORY_ICONS[c]}</span>}
                  {c}
                </button>
              ))}
              {cat !== "전체" && (
                <button 
                  onClick={() => setCat("전체")}
                  style={{ 
                    flexShrink: 0, background: "none", border: "none", padding: "4px 8px", cursor: "pointer", 
                    fontSize: 14, color: "#9ca3af", fontWeight: "bold",
                    display: "flex", alignItems: "center", gap: 2
                  }}
                >
                  <span style={{ fontSize: 16 }}>↺</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 결과 수 */}
      <div style={{ padding: "8px 18px 4px", fontSize: 12, color: "#aaa" }}>
        총 <strong style={{ color: "#333" }}>{filtered.length}</strong>개
      </div>

      {/* 카드 그리드 */}
      <div style={{ padding: "4px 0 48px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🍽️</div>
            <p style={{ fontWeight: 700, color: "#374151", marginBottom: 4 }}>검색 결과가 없어요</p>
            <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 20 }}>다른 키워드나 필터를 써보세요</p>
            <button onClick={() => { setQuery(""); setCat("전체"); setRegion("전체"); setOnlyFav(false); }} style={{
              padding: "9px 22px", borderRadius: 99,
              background: `linear-gradient(135deg,${BRAND},${BRAND2})`,
              color: "white", fontWeight: 700, fontSize: 12, border: "none", cursor: "pointer",
            }}>필터 초기화</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filtered.map(place => (
              <PlaceCard key={place.id} place={place}
                isFav={favs.has(place.id)}
                onFav={() => toggleFav(place.id)}
                onClick={() => setDetail(place)}
                reviewCount={reviewCounts[place.id]}
              />
            ))}
          </div>
        )}
      </div>

      {/* 상세 슬라이드 패널 */}
      {detail && (
        <DetailPanel place={detail}
          isFav={favs.has(detail.id)}
          onFav={() => toggleFav(detail.id)}
          onClose={() => setDetail(null)}
          onReviewSubmit={() => incrementReviewCount(detail.id)}
        />
      )}
    </div>
  );
}
