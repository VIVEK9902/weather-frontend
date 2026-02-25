import React from "react";
import Chart from "react-apexcharts";

export default function TrendChart({
  series = [],
  categories = [],
  height = 320,
  theme = "dark",
  condition = "",
}) {
  const isDark = theme === "dark";

  /* ===============================
     🎨 Dynamic color by condition
  =============================== */
  const getColors = () => {
    const c = condition?.toLowerCase() || "";

    if (c.includes("rain") || c.includes("drizzle") || c.includes("storm"))
      return ["#3b82f6", "#60a5fa"]; // blue

    if (c.includes("cloud"))
      return ["#6b7280", "#9ca3af"]; // gray

    if (c.includes("snow"))
      return ["#67e8f9", "#22d3ee"]; // icy cyan

    if (c.includes("night"))
      return ["#6366f1", "#818cf8"]; // indigo

    // default sunny/warm
    return ["#f59e0b", "#fbbf24"]; // orange/yellow
  };

  const colors = getColors();

  const options = {
    chart: {
      type: "area",
      height,
      toolbar: { show: false },
      background: "transparent",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
      foreColor: isDark ? "#e5e7eb" : "#374151",
    },

    stroke: {
      curve: "smooth",
      width: 4,
      lineCap: "round",
    },

    colors, // ✅ dynamic colors here

    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.6,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 95, 100],
      },
    },

    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },

    yaxis: {
      labels: {
        formatter: (val) => `${Math.round(val)}°`,
      },
    },

    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val) => `${val}°`,
      },
    },

    markers: {
      size: 5,
      strokeWidth: 3,
      hover: { size: 8 },
    },

    grid: {
      borderColor: isDark
        ? "rgba(255,255,255,0.05)"
        : "rgba(0,0,0,0.05)",
      strokeDashArray: 4,
    },

    legend: {
      position: "top",
      horizontalAlign: "right",
    },

    dataLabels: { enabled: false },
  };

  return (
    <div
      className="
        rounded-2xl
        p-4
        backdrop-blur-xl
        bg-white/10
        border border-white/10
        shadow-2xl
      "
    >
      <Chart options={options} series={series} type="area" height={height} />
    </div>
  );
}
