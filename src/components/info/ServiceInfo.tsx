import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Cpu, Calendar, CreditCard, Search, MessageCircle } from "lucide-react";

/*
  EVServiceGuide.tsx (enhanced Tailwind skin)
  - Kept original structure; only Tailwind classes adjusted to add
    gradients, shadows, hover/focus states and improved contrast.
  - No code logic or component splitting changed — just styling.

  To tweak main color:
    change 'from-indigo-600 to-indigo-500' (cards/buttons) to other color pairs.
*/

type ServiceItem = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  icon: React.ReactNode;
};

const services: ServiceItem[] = [
  {
    id: "search",
    title: "충전소 검색 & 지도",
    subtitle: "위치 기반 탐색",
    description:
      "카카오맵/지도 연동으로 주변 충전소 실시간 검색 — 주소, 타입, 잔여대수, 운영시간 제공",
    icon: <MapPin className="w-6 h-6 text-white" />,
  },
  {
    id: "ai",
    title: "AI 상담/챗봇",
    subtitle: "충전소 추천 & 예약 도움",
    description:
      "사용자 문맥 기반 추천(차종, 잔여 배터리, 급속/완속 선호)을 제공하는 AI 챗봇",
    icon: <Cpu className="w-6 h-6 text-white" />,
  },
  {
    id: "reservation",
    title: "예약 서비스",
    subtitle: "시간 기반 예약",
    description:
      "원하는 시간대 예약 및 예약 확인/취소 기능. 예약 스케줄을 자동으로 관리합니다.",
    icon: <Calendar className="w-6 h-6 text-white" />,
  },
  {
    id: "payment",
    title: "결제 연동",
    subtitle: "간편 결제",
    description:
      "안전한 결제 플로우(카드/간편결제)와 결제 영수증 발행을 지원합니다.",
    icon: <CreditCard className="w-6 h-6 text-white" />,
  },
];

const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }
> = ({ children, variant = "primary", className = "", ...rest }) => (
  <button
    {...rest}
    className={
      `inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-sm text-sm font-medium transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 ` +
      (variant === "primary"
        ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-700 hover:to-indigo-600 focus:ring-indigo-400 active:scale-95"
        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-indigo-300") +
      ` ${className}`
    }
  >
    {children}
  </button>
);

export default function EVServiceGuide() {
  const [showChat, setShowChat] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  // Reservation form state (example)
  const [stationQuery, setStationQuery] = useState("");
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).kakao?.maps) {
      try {
        const container = document.getElementById("kakao-map");
        if (container && container.childElementCount === 0) {
          const kakao = (window as any).kakao;
          const map = new kakao.maps.Map(container, {
            center: new kakao.maps.LatLng(37.5665, 126.978),
            level: 6,
          });
          const marker = new kakao.maps.Marker({
            position: map.getCenter(),
          });
          marker.setMap(map);
        }
      } catch (e) {
        // silently fail; show placeholder
      }
    }
  }, []);

  async function handleReservationSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setSubmitting(true);
    setResultMessage(null);

    if (!reservationDate || !reservationTime) {
      setResultMessage("날짜와 시간을 선택해 주세요.");
      setSubmitting(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append("stationQuery", stationQuery);
      fd.append("date", reservationDate);
      fd.append("time", reservationTime);

      const res = await fetch("/api/reservations", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }
      const data = await res.json();
      setResultMessage("예약이 완료되었습니다. 예약번호: " + (data.id ?? "(서버응답)"));
    } catch (err: any) {
      setResultMessage("예약 중 오류가 발생했습니다: " + (err.message ?? err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="prose-invert max-w-6xl mx-auto px-4 py-10" style={{ marginTop: "100px" }}>
      {/* HERO */}
      <header className="grid gap-6 md:grid-cols-2 items-center">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-extrabold leading-tight text-gray-900"
          >
            더 쉽고 빠른 전기차 충전
          </motion.h1>
          <p className="mt-4 text-lg text-gray-600">
            주변 충전소 검색, AI 기반 추천, 실시간 예약과 간편 결제를 한 곳에서.
            지금 바로 가까운 충전소를 찾아 예약해보세요.
          </p>

          <div className="mt-6 flex gap-3">
            <Button onClick={() => setSelectedService("search")}>
              <Search className="w-4 h-4" /> 충전소 찾기
            </Button>
            <Button variant="ghost" onClick={() => setShowChat(true)}>
              <MessageCircle className="w-4 h-4" /> AI 상담 시작
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((s) => (
              <article
                key={s.id}
                onClick={() => setSelectedService(s.id)}
                className={
                  "p-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white cursor-pointer transform transition-all duration-200 hover:-translate-y-1 shadow-lg ring-1 ring-black/10"
                }
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/10 rounded-xl flex items-center justify-center ring-1 ring-white/10">
                    {s.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{s.title}</h3>
                    <p className="mt-1 text-sm text-white/80">{s.subtitle}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-white/90">{s.description}</p>
              </article>
            ))}
          </div>
        </div>

        {/* MAP & QUICK SEARCH */}
        <div className="rounded-2xl overflow-hidden p-4 bg-gradient-to-b from-gray-100 to-gray-200">
          {/* <div id="kakao-map" className="w-full h-64 rounded-lg bg-neutral-800 shadow-inner" /> */}
          <img src="images/map.png" alt="지도" />
          <form className="mt-4 flex gap-2" onSubmit={handleReservationSubmit}>
            <input
              className="flex-1 rounded-full px-3 py-2 bg-white border border-gray-200 placeholder-gray-400 shadow-sm"
              placeholder="예: '역삼동 충전소' 또는 충전소 ID"
              value={stationQuery}
              onChange={(e) => setStationQuery(e.target.value)}
            />
            <Button type="submit" className="flex-none">
              <Search className="w-4 h-4" /> 검색
            </Button>
          </form>

          <div className="mt-4 text-sm text-gray-500">
            <strong>지도 사용 팁:</strong> 충전하고 싶은 지역 이름을 검색해주세요.
          </div>
        </div>
      </header>

      {/* HOW IT WORKS */}
      <section className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="col-span-2">
          <h2 className="text-2xl font-bold">서비스가 동작하는 방식</h2>
          <ol className="mt-4 space-y-4">
            <li className="p-4 rounded-2xl bg-neutral-50/70">
              <strong>1. 검색 & 필터</strong>
              <p className="text-sm text-gray-600 mt-1">
                위치, 충전 타입(DC/AC), 이용 가능 여부 등으로 필터링해 빠르게 찾습니다.
              </p>
            </li>
            <li className="p-4 rounded-2xl bg-neutral-50/70">
              <strong>2. AI 상담</strong>
              <p className="text-sm text-gray-600 mt-1">
                차종/배터리 상태에 맞춘 충전소 추천, 예약 가능 시간 제안 등을 챗으로
                제공합니다.
              </p>
            </li>
            <li className="p-4 rounded-2xl bg-neutral-50/70">
              <strong>3. 예약 → 결제 → 이용</strong>
              <p className="text-sm text-gray-600 mt-1">
                예약은 실시간 충전소 스케줄과 동기화되고, 결제는 외부 PG사 연동으로
                안전하게 처리합니다.
              </p>
            </li>
          </ol>
        </div>

        {/* QUICK RESERVATION PANEL */}
        <aside className="p-4 rounded-2xl bg-white shadow-md">
          <h3 className="font-semibold">빠른 예약</h3>
          <form className="mt-3 flex flex-col gap-3" onSubmit={handleReservationSubmit}>
            <label className="text-sm text-gray-600">충전소 검색</label>
            <input
              value={stationQuery}
              onChange={(e) => setStationQuery(e.target.value)}
              placeholder="충전소 이름 또는 ID"
              className="px-3 py-2 rounded-2xl bg-gray-50 border border-gray-200"
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={reservationDate}
                onChange={(e) => setReservationDate(e.target.value)}
                className="px-3 py-2 rounded-2xl bg-gray-50 border border-gray-200"
              />
              <input
                type="time"
                value={reservationTime}
                onChange={(e) => setReservationTime(e.target.value)}
                className="px-3 py-2 rounded-2xl bg-gray-50 border border-gray-200"
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "예약 중..." : "예약 요청"}
            </Button>

            {resultMessage && <div className="mt-2 text-sm text-gray-700">{resultMessage}</div>}

            <div className="mt-3 text-xs text-gray-500">※ 예약 정책과 환불 규정은 약관을 따릅니다.</div>
          </form>
        </aside>
      </section>

      {/* DETAILED FEATURES */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold">주요 기능 요약</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="p-4 rounded-2xl bg-neutral-50/70">
            <h4 className="font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" /> 실시간 충전소 상태
            </h4>
            <p className="text-sm text-gray-600 mt-2">잔여 대수, 고장/사용중 상태 표시</p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50/70">
            <h4 className="font-semibold flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600" /> AI 기반 추천
            </h4>
            <p className="text-sm text-gray-600 mt-2">사용자 상황에 맞춘 근거리 추천</p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50/70">
            <h4 className="font-semibold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" /> 결제 & 영수증
            </h4>
            <p className="text-sm text-gray-600 mt-2">예약 시 결제와 영수증 자동 발행</p>
          </div>
        </div>
      </section>

      {/* INTEGRATION NOTES */}
      <section className="mt-12 p-4 rounded-2xl bg-neutral-50/70">
        <h3 className="font-semibold">통합 가이드 (개발자 참고)</h3>
        <ul className="mt-3 list-disc list-inside text-sm text-gray-600 space-y-2">
          <li>
            <strong>지도:</strong> 카카오맵 스크립트를 index.html에 추가하고, window.kakao 객체를
            이용해 맵을 초기화하세요.
          </li>
          <li>
            <strong>AI 챗봇:</strong> 서버사이드에서 대화 컨텍스트를 유지하는 엔드포인트를 마련하고,
            클라이언트에서 토큰 기반 인증으로 호출하세요.
          </li>
          <li>
            <strong>예약/결제:</strong> 예약 요청은 충전소 스케줄과 원자적으로 처리되어야 합니다.
            결제는 외부 PG와 연동해 결제 완료 콜백을 서버로 받아 처리하세요.
          </li>
        </ul>
      </section>

      {/* FAQ + CTA */}
      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-xl font-bold">자주 묻는 질문</h3>
          <dl className="mt-4 space-y-3 text-sm text-gray-600">
            <div>
              <dt className="font-semibold">예약 취소는 어떻게 하나요?</dt>
              <dd className="mt-1">마이페이지에서 예약 상세로 들어가 취소 버튼을 눌러주세요.</dd>
            </div>

            <div>
              <dt className="font-semibold">결제 실패 시 어떻게 되나요?</dt>
              <dd className="mt-1">
                결제 실패 시 예약이 자동 취소되며, 실패 사유를 이메일로 안내합니다.
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col justify-center items-start gap-4">
          <h3 className="text-xl font-bold">지금 바로 체험해보세요</h3>
          <p className="text-sm text-gray-600">가까운 충전소를 검색하거나, AI 상담으로 추천을 받아보세요.</p>
          <div className="flex gap-3">
            <Button onClick={() => setSelectedService("search")}>
              <Search className="w-4 h-4" /> 충전소 찾기
            </Button>
            <Button variant="ghost" onClick={() => setShowChat(true)}>
              <MessageCircle className="w-4 h-4" /> AI 상담
            </Button>
          </div>
        </div>
      </section>

      {/* CHAT MODAL (placeholder) */}
      {showChat && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowChat(false)} />
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative w-full md:w-3/4 lg:w-1/2 bg-white rounded-2xl p-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">AI 상담 챗봇</h4>
              <button className="text-sm text-gray-500" onClick={() => setShowChat(false)}>
                닫기
              </button>
            </div>
            <div className="mt-4 h-80 bg-neutral-100 rounded-lg p-3 text-sm text-gray-700 overflow-auto">
              {/* TODO: Replace this placeholder with your real Chat component. */}
              <p className="text-gray-500">
                (챗봇 UI 자리) 예시: "저는 전기차 충전 전문가입니다. 충전소를 추천해드릴게요."
              </p>
            </div>
          </motion.div>
        </div>
      )}

      <footer className="mt-12 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} EVCharge — 전기차 충전소 검색 · 예약 · 결제 통합 서비스
      </footer>
    </div>
  );
}
