import ResultsCard from "../ResultsCard";

export default function ResultsCardExample() {
  return (
    <div className="p-8 max-w-2xl">
      <ResultsCard
        produceLabel="banana"
        produceConfidence={0.95}
        verdict="ORGANIC"
        verdictConfidence={0.95}
        reliability="very_high"
        detectedPLU="94011"
        pluMeaning="Organic banana - 5-digit code starting with 9 indicates organic"
        reasoning="✓ MATCH! Both model and PLU code (94011) confirm this is organic."
        recommendation="✓ Certified organic (PLU: 94011). Minimal pesticide residue. Simple water rinse recommended."
        nutrition="Excellent source of potassium (422mg per medium banana), vitamin B6, and vitamin C. Provides quick energy with natural sugars and resistant starch."
      />
    </div>
  );
}
