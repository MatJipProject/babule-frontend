"use client";

import { HEADER_HEIGHT } from "@/components/Header";
import { useState, useEffect } from "react";
import { fetchPlaces, Place, postReview, searchRestaurants, fetchReviews, Review } from "@/lib/api";

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

// ── 카드 ──────────────────────────────────────────
function PlaceCard({ place, isFav, onFav, onClick, reviewCount }: { 
  place: Place; 
  isFav: boolean; 
  onFav: () => void; 
  onClick: () => void;
  reviewCount: number;
}) {
  const [hov, setHov] = useState(false);
  
  const backgroundStyle = place.grad?.startsWith('url') 
    ? { backgroundImage: place.grad, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: place.grad || "#eee" };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 24, overflow: "hidden", cursor: "pointer", background: "white",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hov ? "0 12px 30px rgba(0,0,0,0.08)" : "0 2px 10px rgba(0,0,0,0.04)",
        transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div style={{
        position: "relative", 
        width: "100%",
        height: 200, 
        overflow: "hidden",
        ...backgroundStyle,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {!place.grad?.startsWith('url') && (
          <span style={{
            fontSize: 56,
            transform: hov ? "scale(1.1)" : "scale(1)",
            transition: "transform 0.4s ease",
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
          }}>{place.emoji || "🍴"}</span>
        )}

        <span style={{
          position: "absolute", top: 12, left: 12,
          fontSize: 10, fontWeight: 700, color: "white",
          background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)",
          padding: "4px 10px", borderRadius: 99,
          border: "1px solid rgba(255,255,255,0.2)",
        }}>{place.category}</span>

        <button onClick={e => { e.stopPropagation(); onFav(); }} style={{
          position: "absolute", top: 10, right: 10,
          width: 32, height: 32, borderRadius: "50%",
          background: "rgba(255,255,255,0.9)", border: "none",
          cursor: "pointer", fontSize: 14,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}>{isFav ? "❤️" : "🤍"}</button>
      </div>

      <div style={{ padding: "16px 18px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{
          fontSize: 16, fontWeight: 800, color: "#111", marginBottom: 6,
          display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden"
        }}>{place.name}</h3>
        
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: 12, color: "#fbbf24" }}>★</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#333" }}>{place.rating}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 11, color: "#aaa" }}>💬</span>
            <span style={{ fontSize: 12, fontWeight: 500, color: "#777" }}>{reviewCount}</span>
          </div>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "#999", fontWeight: 500 }}>📍 {place.region}</span>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: "auto" }}>
          {place.tags?.slice(0, 3).map(t => (
            <span key={t} style={{
              fontSize: 10, padding: "3px 9px", borderRadius: 8,
              background: "#f8f9fa", color: "#666", fontWeight: 600,
              border: "1px solid #f0f0f0"
            }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 상세 팝업 패널 ───────────────────────────────
function DetailPanel({ place, isFav, onFav, onClose, onReviewSubmit }: {
  place: Place;
  isFav: boolean;
  onFav: () => void;
  onClose: () => void;
  onReviewSubmit: () => void;
}) {
  const [view, setView] = useState("info"); // "info" | "review" | "reviews"
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const isValid = comment.length >= 5;

  const RATING_TEXTS = ["최악이에요", "별로예요", "보통이에요", "맛있어요", "최고예요!"];

  useEffect(() => {
    if (view === "reviews") {
      setLoadingReviews(true);
      fetchReviews(place.id).then(data => {
        setReviews(data);
        setLoadingReviews(false);
      });
    }
  }, [view, place.id]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 10) {
      alert("사진은 최대 10장까지 등록 가능합니다.");
      return;
    }
    setPhotos([...photos, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPhotoPreviews([...photoPreviews, ...newPreviews]);
  };

  const removePhoto = (idx: number) => {
    setPhotos(photos.filter((_, i) => i !== idx));
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== idx));
  };

  const handleSubmitReview = async () => {
    if (!isValid) return;
    try {
      await postReview(place.id, { rating, content: comment }, photos);
      alert("리뷰가 등록되었습니다!");
      setView("info");
      setComment("");
      setPhotos([]);
      setPhotoPreviews([]);
      onReviewSubmit();
    } catch (e) {
      alert("리뷰 등록에 실패했습니다.");
    }
  };

  const backgroundStyle = place.grad?.startsWith('url') 
    ? { backgroundImage: place.grad, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: place.grad || "#eee" };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      <div onClick={onClose} style={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)",
        animation: "fadeIn 0.2s ease",
      }} />

      <div style={{
        position: "relative", width: "100%", background: "white",
        display: "flex", flexDirection: "column",
        maxHeight: "92vh",
        maxWidth: 400,
        animation: "scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        boxShadow: "0 30px 100px rgba(0,0,0,0.4)",
        borderRadius: 36, overflow: "hidden",
      }}>
        {/* 상단 핸들 바 */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 6px", background: "white", position: "absolute", top: 0, left: 0, right: 0, zIndex: 20 }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: "#e5e7eb" }} />
        </div>

        <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "0 0 24px" }}>
          {view === "info" ? (
            <>
              {/* 이미지 헤더 */}
              <div style={{ position: "relative", height: 220, ...backgroundStyle, display: "flex", alignItems: "center", justifyContent: "center", margin: "14px 14px 0", borderRadius: 28 }}>
                {!place.grad?.startsWith('url') && <span style={{ fontSize: 80, filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.15))" }}>{place.emoji || "🍴"}</span>}
                
                {/* 하트 버튼 */}
                <button onClick={onFav} style={{ position: "absolute", top: 16, left: 16, width: 36, height: 36, borderRadius: "50%", background: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                  {isFav ? "💜" : "🤍"}
                </button>

                {/* 닫기 버튼 */}
                <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.4)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "white" }}>✕</button>

                {/* 카테고리 뱃지 */}
                <div style={{ position: "absolute", bottom: 16, left: 16 }}>
                  <span style={{ background: BRAND, color: "white", padding: "4px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>{place.category}</span>
                </div>
              </div>

              {/* 기본 정보 */}
              <div style={{ padding: "20px 24px" }}>
                <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12, color: "#111" }}>{place.name}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 16 }}>
                  {Array.from({ length: 5 }, (_, i) => (<span key={i} style={{ fontSize: 16, color: i < Math.round(place.rating) ? "#fbbf24" : "#e5e7eb" }}>★</span>))}
                  <span style={{ fontWeight: 800, fontSize: 16, color: "#333", marginLeft: 4 }}>{place.rating}</span>
                  <button onClick={() => setView("reviews")} style={{ background: "none", border: "none", padding: 0, color: "#aaa", fontSize: 13, marginLeft: 10, cursor: "pointer" }}>
                    리뷰 {place.review_count}개 &gt;
                  </button>
                </div>

                {/* 태그 */}
                <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                  {place.tags?.map(t => (
                    <span key={t} style={{ background: "#fff5f3", color: BRAND, padding: "5px 14px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>{t}</span>
                  ))}
                </div>

                {/* 한줄 평 */}
                <div style={{ background: "#f8f9fa", borderRadius: 20, padding: "16px 20px", marginBottom: 28, display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 16 }}>💬</span>
                  <span style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.5 }}>{"홍대 골목 깊숙이 숨어있는 진짜배기 삼겹살집"}</span>
                </div>

                {/* 상세 리스트 */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 20, color: "#E8513D" }}>📍</span>
                    <div>
                      <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>주소</p>
                      <p style={{ fontSize: 14, color: "#374151", fontWeight: 500, lineHeight: 1.4 }}>{place.road_address}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 20, color: "#E8513D" }}>📞</span>
                    <div>
                      <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>전화</p>
                      <p style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>{place.phone || "02-333-1234"}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 20, color: "#9ca3af" }}>🕐</span>
                    <div>
                      <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>영업시간</p>
                      <p style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>{"11:30 ~ 23:00"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단 버튼 */}
              <div style={{ padding: "0 24px", display: "flex", gap: 12 }}>
                <button onClick={() => setView("review")} style={{ flex: 1, padding: "16px", background: "white", color: BRAND, fontWeight: 800, borderRadius: 18, border: `1.5px solid ${BRAND}33`, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  ✍️ 리뷰 등록
                </button>
                <button style={{ flex: 1.5, padding: "16px", background: `linear-gradient(135deg,${BRAND},${BRAND2})`, color: "white", fontWeight: 800, borderRadius: 18, border: "none", cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: `0 8px 24px ${BRAND}44` }}>
                  🗺️ 지도에서 보기
                </button>
              </div>
            </>
          ) : view === "review" ? (
            <div style={{ padding: "40px 24px 20px" }}>
              <button onClick={() => setView("info")} style={{ background: "none", border: "none", fontSize: 14, cursor: "pointer", color: "#999", marginBottom: 20, display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>← 돌아가기</button>
              <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24, color: "#111" }}>리뷰 작성</h3>
              
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 10 }}>
                  {[1, 2, 3, 4, 5].map(v => (
                    <button key={v} onClick={() => setRating(v)} style={{ background: "none", border: "none", fontSize: 40, cursor: "pointer", color: v <= rating ? "#fbbf24" : "#eee", transition: "transform 0.2s" }} onPointerDown={e => e.currentTarget.style.transform="scale(0.9)"} onPointerUp={e => e.currentTarget.style.transform="scale(1)"}>★</button>
                  ))}
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: BRAND }}>{RATING_TEXTS[rating - 1]}</p>
              </div>

              <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="솔직한 리뷰를 들려주세요 (5자 이상)" style={{ width: "100%", height: 160, padding: 20, borderRadius: 24, background: "#f8f9fa", border: "1px solid #f1f3f5", fontSize: 14, outline: "none", resize: "none", boxSizing: "border-box", marginBottom: 12, lineHeight: 1.6 }} />
              <p style={{ fontSize: 11, color: comment.length >= 5 ? "#10b981" : "#aaa", textAlign: "right", marginBottom: 20 }}>{comment.length}자 입력됨</p>

              {/* 사진 등록 */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "#333" }}>사진 등록 ({photos.length}/10)</p>
                <div className="hide-scrollbar" style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
                  {photos.length < 10 && (
                    <label style={{ flexShrink: 0, width: 70, height: 70, borderRadius: 14, background: "#f3f4f6", border: "1.5px dashed #d1d5db", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 20, color: "#9ca3af" }}>
                      +
                      <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
                    </label>
                  )}
                  {photoPreviews.map((src, i) => (
                    <div key={i} style={{ position: "relative", flexShrink: 0 }}>
                      <img src={src} alt="preview" style={{ width: 70, height: 70, borderRadius: 14, objectFit: "cover" }} />
                      <button onClick={() => removePhoto(i)} style={{ position: "absolute", top: -4, right: -4, width: 20, height: 20, borderRadius: "50%", background: "rgba(0,0,0,0.5)", color: "white", border: "none", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>✕</button>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={handleSubmitReview} disabled={!isValid} style={{ width: "100%", padding: "20px", background: isValid ? `linear-gradient(135deg,${BRAND},${BRAND2})` : "#f1f3f5", color: isValid ? "white" : "#adb5bd", fontWeight: 800, borderRadius: 20, border: "none", cursor: isValid ? "pointer" : "not-allowed", fontSize: 16, transition: "all 0.3s" }}>리뷰 등록 완료</button>
            </div>
          ) : (
            <div style={{ padding: "40px 24px 20px" }}>
              <button onClick={() => setView("info")} style={{ background: "none", border: "none", fontSize: 14, cursor: "pointer", color: "#999", marginBottom: 20, display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>← 돌아가기</button>
              <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24, color: "#111" }}>리뷰 목록</h3>
              {loadingReviews ? (
                <p style={{ textAlign: "center", padding: "40px 0", color: "#aaa" }}>불러오는 중...</p>
              ) : reviews.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa" }}>
                  <span style={{ fontSize: 40, display: "block", marginBottom: 10 }}>💬</span>
                  등록된 리뷰가 없습니다.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {reviews.map(rev => (
                    <div key={rev.id} style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#333", marginRight: 8 }}>사용자</span>
                          <span style={{ fontSize: 11, color: "#fbbf24" }}>★ {rev.rating}</span>
                        </div>
                        <span style={{ fontSize: 11, color: "#9ca3af" }}>{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.6 }}>{rev.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── 메인 ───────────────────────────────────────────
export default function ListPage() {
  const [places, setPlaces]     = useState<Place[]>([]);
  const [loading, setLoading]   = useState(true);
  const [favs, setFavs]         = useState<Set<string>>(new Set());
  const [cat, setCat]           = useState("전체");
  const [region, setRegion]     = useState("전체");
  const [query, setQuery]       = useState("");
  const [onlyFav, setOnlyFav] = useState(false);
  const [detail, setDetail]   = useState<Place | null>(null);
  const [reviewCounts, setReviewCounts] = useState<Record<string, number>>({});

  useEffect(() => { loadInitialPlaces(); }, []);

  const loadInitialPlaces = async () => {
    setLoading(true);
    try {
      const data = await fetchPlaces();
      setPlaces(data);
      const counts: Record<string, number> = {};
      data.forEach(p => counts[p.id] = p.review_count);
      setReviewCounts(counts);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) { loadInitialPlaces(); return; }
    setLoading(true);
    try {
      const results = await searchRestaurants(query);
      const mappedResults: Place[] = results.map(p => ({
        ...p,
        id: p.id.toString(),
        road_address: p.road_address || p.address,
        review_count: p.review_count || 0,
        rating: p.rating || 0,
        region: (p.road_address || p.address || "").split(' ')[1] || "전체",
        grad: p.thumbnail ? `url(${p.thumbnail})` : "linear-gradient(135deg,#74b9ff,#a29bfe)",
        emoji: "🍴"
      }));
      setPlaces(mappedResults);
    } catch (e) { alert("검색 실패"); }
    finally { setLoading(false); }
  };

  const toggleFav = (id: string) => setFavs(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const filtered = places.filter(p => (cat === "전체" || p.category === cat) && (region === "전체" || (p.region && p.region.includes(region))) && (!onlyFav || favs.has(p.id)));

  return (
    <div style={{ background: "#f5f4f2", minHeight: "100vh" }}>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .responsive-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(1, minmax(0, 1fr));
        }
        
        @media (min-width: 640px) {
          .responsive-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        
        @media (min-width: 1024px) {
          .responsive-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        .main-container {
          max-width: 1200px;
          margin: 0 auto;
        }
      `}</style>
      <div style={{ background: "white", padding: "18px 18px 0", position: "sticky", top: HEADER_HEIGHT, zIndex: 30, boxShadow: "0 1px 0 #eeebe6", margin: "0 -1rem" }}>
        <div className="main-container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, padding: "0 18px" }}>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: "#111" }}>🍽️ <span style={{ color: BRAND }}>맛집</span> 목록</h1>
            <button onClick={() => setOnlyFav(!onlyFav)} style={{ padding: "5px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700, border: `1.5px solid ${onlyFav ? "#fca5a5" : "#e5e7eb"}`, background: onlyFav ? "#fef2f2" : "white", color: onlyFav ? "#ef4444" : "#9ca3af", cursor: "pointer" }}>{onlyFav ? "❤️ 즐겨찾기" : "🤍 즐겨찾기"}</button>
          </div>
          
          <form onSubmit={handleSearch} style={{ position: "relative", marginBottom: 12, padding: "0 18px" }}>
            <span style={{ position: "absolute", left: 34, top: "50%", transform: "translateY(-50%)", color: "#aaa", fontSize: 14 }}>🔍</span>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="맛집 이름을 검색하세요" style={{ width: "100%", padding: "12px 16px 12px 42px", background: "#f3f4f6", border: "none", borderRadius: 24, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </form>

          <div style={{ padding: "0 18px 12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#666" }}>📍 지역</span>
              <div className="hide-scrollbar" style={{ display: "flex", gap: 7, overflowX: "auto", flex: 1 }}>
                {REGIONS.map(r => (<button key={r} onClick={() => setRegion(r)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 99, fontSize: 11, fontWeight: 700, border: "none", background: region === r ? `linear-gradient(135deg,${BRAND},${BRAND2})` : "#f3f4f6", color: region === r ? "white" : "#6b7280" }}>{r}</button>))}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#666" }}>🍴 분야</span>
              <div className="hide-scrollbar" style={{ display: "flex", gap: 7, overflowX: "auto", flex: 1 }}>
                {CATEGORIES.map(c => (<button key={c} onClick={() => setCat(c)} style={{ flexShrink: 0, padding: "5px 14px", borderRadius: 99, fontSize: 11, fontWeight: 700, border: `1.5px solid ${cat === c ? BRAND : "#e5e7eb"}`, background: cat === c ? "#fff5f3" : "white", color: cat === c ? BRAND : "#9ca3af" }}>{CATEGORY_ICONS[c]} {c}</button>))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-container" style={{ padding: "24px 18px 48px" }}>
        {loading && places.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#9ca3af" }}>
            <div className="animate-bounce" style={{ fontSize: 40, marginBottom: 16 }}>🍲</div>
            <p style={{ fontSize: 14, fontWeight: 700, color: BRAND }}>맛집을 불러오고 있어요...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", background: "white", borderRadius: 24, border: "1px dashed #e5e7eb" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
            <p style={{ fontWeight: 800, color: "#111", marginBottom: 6 }}>찾으시는 맛집이 아직 없어요</p>
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 24, lineHeight: 1.5 }}>
              다른 지역이나 카테고리를 선택하거나<br />
              상호명을 다시 검색해보세요!
            </p>
            <button 
              onClick={() => { setQuery(""); setCat("전체"); setRegion("전체"); setOnlyFav(false); loadInitialPlaces(); }}
              style={{
                padding: "10px 24px", borderRadius: 12, background: BRAND, color: "white",
                fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer",
                boxShadow: `0 4px 12px ${BRAND}44`
              }}
            >
              필터 초기화하기
            </button>
          </div>
        ) : (
          <div className="responsive-grid">
            {filtered.map(p => (
              <PlaceCard 
                key={p.id} 
                place={p} 
                isFav={favs.has(p.id)} 
                onFav={() => toggleFav(p.id)} 
                onClick={() => setDetail(p)} 
                reviewCount={reviewCounts[p.id] || 0} 
              />
            ))}
          </div>
        )}
      </div>

      {detail && <DetailPanel place={detail} isFav={favs.has(detail.id)} onFav={() => toggleFav(detail.id)} onClose={() => setDetail(null)} onReviewSubmit={() => setReviewCounts(prev => ({...prev, [detail.id]: (prev[detail.id]||0)+1}))} />}
    </div>
  );
}
