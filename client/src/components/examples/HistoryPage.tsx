import HistoryPage from "../../pages/HistoryPage";

export default function HistoryPageExample() {
  localStorage.setItem(
    "agriscan_history",
    JSON.stringify([
      {
        id: 1,
        date: new Date().toLocaleString(),
        produce: "banana",
        verdict: "ORGANIC",
        confidence: 0.95,
        plu: "94011",
        fullData: {
          produce_label: "banana",
          produce_confidence: 0.95,
          verdict: {
            verdict: "ORGANIC",
            verdict_confidence: 0.95,
            reliability: "very_high",
            reasoning: "Perfect match",
            recommendation: "Safe to consume",
          },
        },
      },
      {
        id: 2,
        date: new Date().toLocaleString(),
        produce: "apple",
        verdict: "NON_ORGANIC",
        confidence: 0.88,
        plu: "4131",
        fullData: {
          produce_label: "apple",
          produce_confidence: 0.88,
          verdict: {
            verdict: "NON_ORGANIC",
            verdict_confidence: 0.88,
            reliability: "high",
            reasoning: "Conventional produce",
            recommendation: "Wash thoroughly",
          },
        },
      },
    ])
  );

  return <HistoryPage />;
}
