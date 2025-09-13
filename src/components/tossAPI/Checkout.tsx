import { loadTossPayments, TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";
import '../map/ReservationModal.css'; // 모달 스타일을 위한 CSS 파일
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "8IaYRnOelr82w70MVDr3t";

export function CheckoutPage({ value, onSuccess }: { value: number; onSuccess: (paymentData: any) => void; }) {
  const [amount, setAmount] = useState({
    currency: "KRW",
    value: value,
  });
  const payRandomNum = "f5gRsKqKxLZCzdK4EZQ42";
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const location = useLocation(); // 추가
  // const navigate = useNavigate(); // 추가
  useEffect(() => {
    async function fetchPaymentWidgets() {
      // ------  결제위젯 초기화 ------
      const tossPayments = await loadTossPayments(clientKey);
      // 회원 결제
      const widgets = tossPayments.widgets({
        customerKey,
      });
      // 비회원 결제
      // const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });

      setWidgets(widgets);
    }

    fetchPaymentWidgets();
    console.log(value)
  }, [clientKey, customerKey]);

  async function renderPaymentWidgets() {
    if (widgets == null) {
      return;
    }
    // ------ 주문의 결제 금액 설정 ------
    await widgets.setAmount(amount);

    await Promise.all([
      // ------  결제 UI 렌더링 ------
      widgets.renderPaymentMethods({
        selector: "#payment-method",
        variantKey: "DEFAULT",
      }),
      // ------  이용약관 UI 렌더링 ------
      widgets.renderAgreement({
        selector: "#agreement",
        variantKey: "AGREEMENT",
      }),
    ]);

    setReady(true);
  }
  useEffect(() => {
    renderPaymentWidgets();
  }, [widgets]);

  useEffect(() => {
    if (widgets == null) {
      return;
    }

    widgets.setAmount(amount);
  }, [widgets, amount]);

  return (
    <div className="wrapper">
      <div className="box_section">
        {/* 결제 UI */}
        <div id="payment-method" />
        {/* 이용약관 UI */}
        <div id="agreement" />
        {/* 쿠폰 체크박스 */}
        <div>
        </div>

        {/* 결제하기 버튼 */}
        <button
          className="submit-button"
          disabled={!ready}
          onClick={async () => {
            try {
              // 💡 매번 고유한 orderId를 생성
              const uniqueOrderId = `ev_${Date.now()}`;
              await widgets?.requestPayment({
                orderId: uniqueOrderId,
                orderName: "전기차 충전소 예약",
                // 💡 successUrl에 paymentKey와 orderId를 쿼리 파라미터로 포함
                successUrl: `${window.location.origin}/success`,
                failUrl: window.location.origin + "/fail",
                customerEmail: "customer123@gmail.com",
                customerName: "김토스",
                customerMobilePhone: "01012341234",
              });
            } catch (error) {
              console.error(error);
            }
          }}
        >
          결제하기
        </button>
      </div>
    </div>
  );
}