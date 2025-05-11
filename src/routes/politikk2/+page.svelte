<script>
  import PolitikkSankey from "$lib/PolitikkSankey.svelte";
  import catmeta from "./catmeta.json";
  import partimeta from "./partimeta.json";
  export let data;
  // const { fordeling, kategorier, partier } = dataset[0];

  let options = [
    { index: 0, label: "2024" },
    { index: 1, label: "2025" },
  ];
  let selectedOption = 0;

  let config = {
    margin: 40,
    marginTop: 60,
    height: 900,
    width: 1100,
    colSpacing: 80,
    rowSpacing: 10,
    logoMaxHeight: 70,
    logoMaxHeightP: 0.9,
  };
  console.log("DATASETS", data.datasets);

  $: currentDataset = data.datasets[selectedOption];
</script>

<p><a href="/">Main</a></p>
<h1>Politikk</h1>
<div>
  {#each options as option, i}
    <label>
      <input type="radio" value={option.index} bind:group={selectedOption} />
      {option.label}
    </label>
  {/each}
</div>
<p>Valgt år: {selectedOption}</p>
<button
  on:click={() => {
    const svg = document.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "visualization.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }}>Download SVG</button
>
<PolitikkSankey dataset={currentDataset} {partimeta} {catmeta} {config} />

<h3>Rå data (debug)</h3>
<pre>{JSON.stringify(currentDataset, null, 2)}</pre>
