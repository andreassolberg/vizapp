<script lang="ts">
  import { prepareSankeyData } from "$lib/sankeyUtils";
  import { sankeyLinkPath } from "../routes/politikk/helpers";

  export let partimeta;
  export let catmeta;
  export let config;
  export let dataset;

  const { fordeling, kategorier, partier } = dataset;

  const { markers, rays, colWidth, catScale } = prepareSankeyData({
    fordeling,
    kategorier,
    partier,
    partimeta,
    catmeta,
    config,
  });
  console.log("CATEMETA", catmeta);
</script>

<svg
  width={config.width}
  height={config.height}
  viewBox={`0 0 ${config.width} ${config.height}`}
  xmlns="http://www.w3.org/2000/svg"
  style="shape-rendering: crispEdges"
>
  <!-- <text
    x={config.margin}
    y="20"
    font-family="sans-serif"
    font-size="22"
    fill="#000000"
    >Dersom det var stortingsvalg i morgen, hvilket parti ville du da stemme på?
  </text> -->
  {#each kategorier as kategori, i}
    <text
      x={catScale(kategori) + colWidth / 2}
      y={35}
      font-family="sans-serif"
      font-size="52"
      text-anchor="middle"
      dominant-baseline="middle"
      fill="#000000">{catmeta[kategori].label}</text
    >
  {/each}
  {#each markers as marker}
    <rect
      x={marker.x}
      y={marker.y}
      width={colWidth}
      height={marker.height}
      fill={marker.fill}
      stroke="none"
      stroke-width="0"
    />
    {#if partimeta[marker.parti].logo !== false}
      <image
        href={`/partilogoer/${marker.parti}.svg`}
        x={marker.x}
        y={marker.yLogo}
        width={colWidth}
        height={marker.logoHeight}
        preserveAspectRatio="xMidYMid meet"
      />
    {:else if marker.andel > 0.01}
      <text
        x={catScale(marker.kategori) + colWidth / 2}
        font-family="sans-serif"
        font-size="12"
        y={marker.ymid}
        text-anchor="middle"
        dominant-baseline="middle">{marker.parti}</text
      >
    {/if}
  {/each}
  {#each rays as ray}
    <path
      d={sankeyLinkPath(ray)}
      stroke="none"
      stroke-width="0"
      fill={partimeta[ray.parti]?.fill}
    />
  {/each}
  <text
    x={config.margin}
    y={config.height - 20}
    font-family="sans-serif"
    font-size="16"
    fill="#000000"
    >Kilde: Medieundersøkelsen, 28. februar - 18. mars 2024 (Respons Analyse)</text
  >
</svg>
