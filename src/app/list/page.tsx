"use client";

import { HEADER_HEIGHT } from "@/components/Header";
import { useState, useEffect } from "react";
import { fetchPlaces, Place, postReview, searchRestaurants } from "@/lib/api";

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
        borderRadius: 18, overflow: "hidden", cursor: "pointer", background: "white",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hov ? "0 12px 30px rgba(0,0,0,0.13)" : "0 2px 10px rgba(0,0,0,0.07)",
        transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      <div style={{
        position: "relative", height: 118, overflow: "hidden",
        ...backgroundStyle,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {!place.grad?.startsWith('url') && (
          <span style={{
            fontSize: 48,
            transform: hov ? "scale(1.15)" : "scale(1)",
            transition: "transform 0.35s ease",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
            display: "block",
          }}>{place.emoji || "🍴"}</span>
        )}

        <span style={{
          position: "absolute", top: 8, left: 8,
          fontSize: 9, fontWeight: 700, color: "white",
          background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)",
          padding: "2px 7px", borderRadius: 99,
          border: "1px solid rgba(255,255,255,0.25)",
        }}>{place.category}</span>

        <button onClick={e => { e.stopPropagation(); onFav(); }} style={{
          position: "absolute", top: 6, right: 6,
          width: 26, height: 26, borderRadius: "50%",
          background: "rgba(255,255,255,0.88)", border: "none",
          cursor: "pointer", fontSize: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
        }}>{isFav ? "❤️" : "🤍"}</button>
      </div>

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
          {place.tags?.slice(0, 2).map(t => (
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
  const [view, setView] = useState("info"); // "info" | "review" | "reviews"
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const isValid = comment.length >= 5;

  const handleSubmitReview = async () => {
    if (!isValid) return;
    try {
      await postReview(place.id, { rating, comment });
      alert("리뷰가 등록되었습니다!");
      setView("info");
      setComment("");
      onReviewSubmit();
    } catch (e) {
      alert("리뷰 등록에 실패했습니다.");
    }
  };

  const backgroundStyle = place.grad?.startsWith('url') 
    ? { backgroundImage: place.grad, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: place.grad || "#eee" };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "flex-end" }}>
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes dimIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      <div onClick={onClose} style={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.42)", backdropFilter: "blur(3px)",
        animation: "dimIn 0.25s ease",
      }} />

      <div style={{
        position: "relative", width: "100%", background: "white",
        display: "flex", flexDirection: "column",
        maxHeight: "88vh",
        animation: "slideUp 0.32s cubic-bezier(0.32,0.72,0,1)",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.18)",
        borderRadius: "24px 24px 0 0", overflow: "hidden",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px", flexShrink: 0 }}>
          <div style={{ width: 40, height: 4, borderRadius: 99, background: "#e5e7eb" }} />
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 110px" }}>
          {view === "info" ? (
            <>
              <div style={{ position: "relative", height: 200, ...backgroundStyle, borderRadius: 20, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {!place.grad?.startsWith('url') && <span style={{ fontSize: 80 }}>{place.emoji || "🍴"}</span>}
              </div>
              <h2 style={{ fontSize: 21, fontWeight: 900, marginBottom: 10 }}>{place.name}</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 20 }}>
                {Array.from({ length: 5 }, (_, i) => (<span key={i} style={{ fontSize: 15, color: i < Math.round(place.rating) ? "#fbbf24" : "#e5e7eb" }}>★</span>))}
                <span style={{ fontWeight: 800, fontSize: 14 }}>{place.rating}</span>
              </div>
              <div style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.8, marginBottom: 20, padding: "14px", background: "#f9f9f9", borderRadius: 14 }}>
                📍 {place.road_address}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setView("review")} style={{ flex: 1, padding: "15px", background: "#fff5f3", color: BRAND, fontWeight: 800, borderRadius: 14, border: `1px solid ${BRAND}44`, cursor: "pointer" }}>✍️ 리뷰 등록</button>
                <button style={{ flex: 1.5, padding: "15px", background: `linear-gradient(135deg,${BRAND},${BRAND2})`, color: "white", fontWeight: 800, borderRadius: 14, border: "none", cursor: "pointer" }}>🗺️ 지도에서 보기</button>
              </div>
            </>
          ) : (
            <div>
              <button onClick={() => setView("info")} style={{ background: "none", border: "none", fontSize: 16, cursor: "pointer", color: "#666", marginBottom: 20 }}>← 뒤로</button>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>{place.name} 리뷰 작성</h3>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20 }}>
                {[1, 2, 3, 4, 5].map(v => (<button key={v} onClick={() => setRating(v)} style={{ background: "none", border: "none", fontSize: 40, cursor: "pointer", color: v <= rating ? "#fbbf24" : "#eee" }}>★</button>))}
              </div>
              <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="솔직한 리뷰를 들려주세요 (5자 이상)" style={{ width: "100%", height: 120, padding: 16, borderRadius: 16, background: "#f9f9f9", border: "1px solid #eee", fontSize: 14, outline: "none", resize: "none", boxSizing: "border-box", marginBottom: 20 }} />
              <button onClick={handleSubmitReview} disabled={!isValid} style={{ width: "100%", padding: "16px", background: isValid ? `linear-gradient(135deg,${BRAND},${BRAND2})` : "#eee", color: isValid ? "white" : "#999", fontWeight: 800, borderRadius: 14, border: "none", cursor: isValid ? "pointer" : "not-allowed" }}>리뷰 등록 완료</button>
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
      `}</style>
      <div style={{ background: "white", padding: "18px 18px 0", position: "sticky", top: HEADER_HEIGHT, zIndex: 30, boxShadow: "0 1px 0 #eeebe6", margin: "0 -1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, padding: "0 18px" }}>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: "#111" }}>🍽️ <span style={{ color: BRAND }}>맛집</span> 목록</h1>
          <button onClick={() => setOnlyFav(!onlyFav)} style={{ padding: "5px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700, border: `1.5px solid ${onlyFav ? "#fca5a5" : "#e5e7eb"}`, background: onlyFav ? "#fef2f2" : "white", color: onlyFav ? "#ef4444" : "#9ca3af", cursor: "pointer" }}>{onlyFav ? "❤️ 즐겨찾기" : "🤍 즐겨찾기"}</button>
        </div>
        
        <form onSubmit={handleSearch} style={{ position: "relative", marginBottom: 12, padding: "0 18px" }}>
          <span style={{ position: "absolute", left: 34, top: "50%", transform: "translateY(-50%)", color: "#aaa", fontSize: 14 }}>🔍</span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="맛집을 검색하세요" style={{ width: "100%", padding: "12px 16px 12px 42px", background: "#f3f4f6", border: "none", borderRadius: 24, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
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

      <div style={{ padding: "12px 18px 48px" }}>
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
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
