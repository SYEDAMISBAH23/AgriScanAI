import ResultsPage from "../../pages/ResultsPage";

export default function ResultsPageExample() {
  sessionStorage.setItem(
    "current_scan_results",
    JSON.stringify({
      produce_label: "banana",
      produce_confidence: 0.95,
      detected_plu: "94011",
      plu_meaning: "Organic banana - 5-digit code starting with 9 indicates organic",
      verdict: {
        verdict: "ORGANIC",
        verdict_confidence: 0.95,
        reliability: "very_high",
        reasoning: "✓ MATCH! Both model and PLU code (94011) confirm this is organic.",
        recommendation: "✓ Certified organic (PLU: 94011). Minimal pesticide residue. Simple water rinse recommended.",
      },
      automatic_advice: "Excellent source of potassium (422mg per medium banana), vitamin B6, and vitamin C. Provides quick energy with natural sugars and resistant starch.",
    })
  );

  return <ResultsPage />;
}
