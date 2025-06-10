<script lang="ts">
  //   import { prepareSankeyData } from "$lib/sankeyUtils";
  // import { sankeyLinkPath } from "../routes/politikk/helpers";
  import FylkeMap from "./FylkeMap.svelte";
  import * as d3 from "d3";

  export let config;
  export let markers;
  export let mapsK;
  export let mapsF;

  export let label = "NA";

  console.log("MapsK", mapsK);
  console.log("MapsF", mapsF);

  let centers: any = {
    Troms: [41, 62.5],
    Finnmark: [47, 63.1],
    Telemark: [9, 59.2],
    Vestfold: [10.2, 59.2],
  };

  let scales: any = {
    Troms: 700,
    Finnmark: 650,
    Telemark: 1100,
    Vestfold: 1350,
  };

  // Parse label to get array of fylker
  $: selectedFylker = label.split("|");

  // Get center based on label (supports both single and multiple fylker)
  $: center = centers[label] || [20, 69];

  // Create a map of fylke name to fylke GeoJSON feature
  $: fylkeFeatureMap = selectedFylker.reduce((acc, fylkeName) => {
    const feature = mapsF.features.find((d) =>
      d.properties.fylkesnavn.includes(fylkeName.trim())
    );
    if (feature) {
      acc[fylkeName.trim()] = feature;
    }
    return acc;
  }, {});

  console.log(`Fylke features for label ${label}:`, fylkeFeatureMap);

  class SBox {
    height: number;
    interval: number;

    constructor(height: number, interval: number = 5) {
      this.height = height;
      this.interval = interval;
    }
    dx(j) {
      return Math.floor(j / this.height);
    }
    dy(j) {
      return j % this.height;
    }
    y(dy) {
      let half = (this.height * this.interval) / 2;
      return dy * this.interval - half;
    }
  }
  let sbox = new SBox(4);

  let colors = [
    ["#1F4698", "#1F4698"],
    ["#5accb9", "#5accb9"],
    ["#f47878", "#f47878"],
  ];
  let dark = (i) => colors[i % colors.length][0];
  let light = (i) => colors[i % colors.length][1];

  console.log("MARKERS IN", markers);

  $: smarkers = markers.flatMap((marker, i) => {
    return Array.from({ length: marker.Tjenester }, (_, j) => ({
      markerIndex: i,
      tjenesteIndex: j,
      dx: sbox.dx(j),
      dy: sbox.dy(j),
    }));
  });
  console.log("Smarkers", smarkers);
  $: legendmarkers = [50, 100, 200].map((d, i) => ({
    index: i + markers.length,
    r: circleAreaScale(d),
    label: d + " innlogginger per elev",
  }));

  let rowHeaders = config.marginTop + 30;
  let rowMain = rowHeaders + 30;
  let colKommune = config.margin + 100;
  let colSbox = colKommune + 100;
  let colPr = colSbox + 130;
  let colInnlogginger = colPr + 40;

  let yScale = (i) => {
    return i * 30 + rowMain;
  };
  let colorHeader = "#767676";
  // let xScale = d3
  //   .scaleLinear()
  //   .domain([0, d3.max(markers, (d: any) => d.Innlogginger)])
  //   .range([50, config.width - config.margin - colInnlogginger - 50]);
  $: x2Scale = d3
    .scaleLog()
    .domain([
      d3.min(markers, (d) => d.Innlogginger),
      d3.max(markers, (d) => d.Innlogginger),
    ])
    .range([50, config.width - config.margin - colInnlogginger - 50]);
  $: circleAreaScale = d3
    .scaleSqrt()
    .domain([0, d3.max(markers, (d) => d.PerElev)])
    .range([0, 16]);
</script>

<svg
  width={config.width}
  height={config.height}
  viewBox={`0 0 ${config.width} ${config.height}`}
  xmlns="http://www.w3.org/2000/svg"
  style="shape-rendering: crispEdges; border: 1px solid #eee; font-family: IBM Plex Sans"
>
  <text
    x={config.margin}
    y={config.marginTop}
    font-family="IBM Plex Sans"
    font-size="36"
    fill="#062356">Bruk av Feide i {label}</text
  >

  <text
    x={colKommune - 10}
    y={rowHeaders}
    text-anchor="end"
    alignment-baseline="middle"
    font-size="16"
    fill={colorHeader}>Elever</text
  >

  <text
    x={colKommune}
    y={rowHeaders}
    alignment-baseline="middle"
    font-size="16"
    fill={colorHeader}>Kommune</text
  >
  <text
    x={colSbox}
    y={rowHeaders}
    alignment-baseline="middle"
    font-size="16"
    fill={colorHeader}>Tjenester</text
  >
  <text
    x={colPr}
    y={rowHeaders}
    alignment-baseline="middle"
    text-anchor="middle"
    font-size="16"
    fill={colorHeader}>Pr.elev</text
  >
  <text
    x={colInnlogginger}
    y={rowHeaders}
    alignment-baseline="middle"
    font-size="16"
    fill={colorHeader}>Antall innlogginger siste år</text
  >

  {#each smarkers as smarker}
    <circle
      cx={colSbox + 3 + smarker.dx * 5}
      cy={yScale(smarker.markerIndex) + sbox.y(smarker.dy)}
      r="2"
      fill={light(smarker.markerIndex)}
    />
  {/each}
  {#each markers as marker, i}
    {#if marker.map && fylkeFeatureMap[marker.Fylke]}
      <FylkeMap
        x={config.margin + 5}
        y={yScale(i)}
        center={centers[marker.Fylke] || [20, 69]}
        scale={scales[marker.Fylke] || 700}
        mapF={fylkeFeatureMap[marker.Fylke]}
        mapK={marker.map}
      />
    {/if}
    // Antall elever
    <text
      x={colKommune - 10}
      y={yScale(i)}
      alignment-baseline="middle"
      font-size="16"
      text-anchor="end"
      fill={dark(i)}>{marker.Elever.toLocaleString()}</text
    >
    // Kommune
    <text
      x={colKommune}
      y={yScale(i)}
      alignment-baseline="middle"
      font-size="16"
      fill={dark(i)}>{marker.Kommune}</text
    >
    <circle
      cx={colPr}
      cy={yScale(i)}
      r={circleAreaScale(marker.PerElev)}
      fill={light(i)}
    />

    // Antall innlogginger
    <circle
      cx={colInnlogginger + x2Scale(marker.Innlogginger)}
      cy={yScale(i)}
      r="5"
      fill={light(i)}
    />
    <text
      x={colInnlogginger + x2Scale(marker.Innlogginger) - 8}
      y={yScale(i) + 1}
      alignment-baseline="middle"
      text-anchor="end"
      font-size="12"
      fill={dark(i)}>{marker.Innlogginger.toLocaleString()}</text
    >
  {/each}
  {#each legendmarkers as marker}
    <circle cx={colPr} cy={yScale(marker.index)} r={marker.r} fill="#CCCCCC" />
    <text
      x={colPr + 30}
      y={yScale(marker.index) + 1}
      alignment-baseline="middle"
      font-size="12"
      fill="#767676">{marker.label}</text
    >
  {/each}
</svg>

<link
  href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans&display=swap"
  rel="stylesheet"
/>
