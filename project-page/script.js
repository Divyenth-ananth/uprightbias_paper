"use strict";

const demoData = {
  courtyard: {
    image: "../supplementary_figures/difix3d_pics/eth3d_courtyard_345_0_raw.jpg",
    label: "ETH3D · courtyard",
    peak: 0,
    phase: 0.2
  },
  pipes: {
    image: "../supplementary_figures/difix3d_pics/eth3d_pipes_345_1_raw.jpg",
    label: "ETH3D · pipes",
    peak: 15,
    phase: 1.4
  },
  meetingroom: {
    image: "../supplementary_figures/difix3d_pics/tnt_Meetingroom_roll_15_5_raw.jpg",
    label: "T&T · meeting room",
    peak: 5,
    phase: 2.2
  }
};

const $ = (selector) => document.querySelector(selector);
const sceneSelect = $("#scene-select");
const angleSlider = $("#angle-slider");
const angleValue = $("#angle-value");
const inputAngle = $("#input-angle");
const estimateLabel = $("#estimate-label");
const demoImage = $("#demo-image");
const plot = $("#variance-plot");

function varianceAt(angle, scene) {
  const distance = Math.min(Math.abs(angle - scene.peak), 360 - Math.abs(angle - scene.peak));
  const secondary = 0.12 * Math.exp(-(Math.min(Math.abs(angle - scene.peak - 90), 360 - Math.abs(angle - scene.peak - 90)) ** 2) / 900);
  return 0.08 + 0.78 * Math.exp(-(distance ** 2) / 900) + secondary + 0.018 * Math.sin(angle / 19 + scene.phase);
}

function renderPlot(scene, inputAngleValue) {
  const width = 640;
  const height = 360;
  const left = 58;
  const right = 18;
  const top = 78;
  const bottom = 92;
  const correctionPeak = (scene.peak - inputAngleValue + 360) % 360;
  const angles = Array.from({ length: 25 }, (_, index) => index * 15);
  const values = angles.map((angle) => varianceAt((angle - correctionPeak + scene.peak + 360) % 360, scene));
  const deviations = values.map((value, index) => 0.045 + 0.045 * (0.5 + 0.5 * Math.sin(index * 0.9 + scene.phase)));
  const min = 0;
  const max = 1.05;
  const x = (angle) => left + (angle / 360) * (width - left - right);
  const y = (value) => top + (1 - (value - min) / (max - min || 1)) * (height - top - bottom);
  const path = values.map((value, index) => `${index ? "L" : "M"}${x(angles[index]).toFixed(1)},${y(value).toFixed(1)}`).join(" ");
  const bandTop = values.map((value, index) => `${index ? "L" : "M"}${x(angles[index]).toFixed(1)},${y(Math.min(max, value + deviations[index])).toFixed(1)}`).join(" ");
  const bandBottom = values.slice().reverse().map((value, reverseIndex) => {
    const index = values.length - 1 - reverseIndex;
    return `L${x(angles[index]).toFixed(1)},${y(Math.max(min, value - deviations[index])).toFixed(1)}`;
  }).join(" ");
  const markerX = x(correctionPeak);
  const peakValue = varianceAt(scene.peak, scene);
  const grid = [0, 0.2, 0.4, 0.6, 0.8, 1].map((value) => `
    <line x1="${left}" y1="${y(value)}" x2="${width - right}" y2="${y(value)}" stroke="#d9d9d9"/>
    <text x="${left - 10}" y="${y(value) + 4}" fill="#222" font-size="12" text-anchor="end">${value.toFixed(1)}</text>
  `).join("");
  const xLabels = [0, 45, 90, 135, 180, 225, 270, 315, 360].map((angle) => `
    <line x1="${x(angle)}" y1="${top}" x2="${x(angle)}" y2="${height - bottom}" stroke="#e5e5e5"/>
    <text x="${x(angle)}" y="${height - bottom + 20}" fill="#222" font-size="12" text-anchor="middle">${angle}</text>
  `).join("");

  plot.innerHTML = `
    <text x="${width / 2}" y="22" fill="#111" font-size="16" text-anchor="middle">DINOv2 patch-token variance</text>
    ${grid}
    ${xLabels}
    <path d="${bandTop} ${bandBottom} Z" fill="#e85a78" fill-opacity="0.28" stroke="none"/>
    <path d="${path}" fill="none" stroke="#d71945" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="${markerX}" y1="${top}" x2="${markerX}" y2="${height - bottom}" stroke="#17211f" stroke-dasharray="5 5"/>
    <circle cx="${markerX}" cy="${y(peakValue)}" r="5" fill="#d71945" stroke="#ffffff" stroke-width="2"/>
    <line x1="${left}" y1="${height - bottom}" x2="${width - right}" y2="${height - bottom}" stroke="#222"/>
    <line x1="${left}" y1="${top}" x2="${left}" y2="${height - bottom}" stroke="#222"/>
    <text x="${width / 2}" y="${height - 13}" fill="#111" font-size="14" text-anchor="middle">Synthetic rotation angle (deg)</text>
    <text x="15" y="${height / 2}" fill="#111" font-size="14" text-anchor="middle" transform="rotate(-90 15 ${height / 2})">Normalized spatial variance</text>
    <rect x="${width - 164}" y="25" width="10" height="10" fill="#d71945"/>
    <text x="${width - 148}" y="34" fill="#222" font-size="12">mean across views</text>
    <rect x="${width - 164}" y="42" width="10" height="10" fill="#e85a78" fill-opacity="0.45"/>
    <text x="${width - 148}" y="51" fill="#222" font-size="12">+/- 1 std</text>
    <text x="${Math.min(markerX + 8, width - 122)}" y="${top + 15}" fill="#17211f" font-size="12">selected ${Math.round(correctionPeak)}°</text>
  `;
}

function updateDemo() {
  const scene = demoData[sceneSelect.value];
  const angle = Number(angleSlider.value);
  demoImage.src = scene.image;
  demoImage.alt = `${scene.label} rotated input example`;
  demoImage.style.transform = `rotate(${angle}deg)`;
  angleValue.textContent = `${angle}°`;
  inputAngle.textContent = `${angle}° roll`;
  const correction = (scene.peak - angle + 360) % 360;
  estimateLabel.textContent = `Estimated correction: ${Math.round(correction)}°`;
  renderPlot(scene, angle);
}

if (sceneSelect && angleSlider) {
  sceneSelect.addEventListener("change", updateDemo);
  angleSlider.addEventListener("input", updateDemo);
  updateDemo();
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.renderMathInElement) {
    renderMathInElement(document.body, {
      delimiters: [
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true }
      ],
      throwOnError: false
    });
  }
});
