const API_BASE = '/api';

export async function fetchCrops() {
  const res = await fetch(`${API_BASE}/crops`);
  if (!res.ok) throw new Error("Failed to fetch crops");
  return res.json();
}

export async function fetchMandis() {
  const res = await fetch(`${API_BASE}/mandis`);
  if (!res.ok) throw new Error("Failed to fetch mandis");
  return res.json();
}

export async function fetchPrediction(cropId, mandiId) {
  const res = await fetch(`${API_BASE}/predict?crop_id=${cropId}&mandi_id=${mandiId}`);
  if (!res.ok) throw new Error("Failed to fetch price predictions");
  return res.json();
}

export async function fetchMandiComparison(cropId, lat = 16.3067, lon = 80.4365, quantityKg = 500.0, freightRate = 12.0) {
  const res = await fetch(`${API_BASE}/compare-mandis?crop_id=${cropId}&lat=${lat}&lon=${lon}&quantity_kg=${quantityKg}&freight_rate=${freightRate}`);
  if (!res.ok) throw new Error("Failed to fetch mandi comparison");
  return res.json();
}

export async function synthesizeVoice(text, language = 'te') {
  const res = await fetch(`${API_BASE}/voice/synthesize?text=${encodeURIComponent(text)}&language=${language}`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error("Failed to synthesize voice");
  return res.json();
}
