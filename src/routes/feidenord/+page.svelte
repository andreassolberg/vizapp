<script>
  import FeideStats from "$lib/feidenord/FeideStats.svelte";
  //   import catmeta from "./catmeta.json";
  //   import partimeta from "./partimeta.json";
  export let data;
  // const { fordeling, kategorier, partier } = dataset[0];

  // console.log("DATA", data);

  let selectedFylke = "Troms"; // Default selected value

  let config = {
    margin: 40,
    marginTop: 60,
    height: 900,
    width: 1100,
    rowText: 250,
  };

  console.log("DATASETS", data.feidestats);
  $: data1 = data.feidestats.filter((d) => {
    const fylkeArray = selectedFylke.split("|");
    const isIncluded = fylkeArray.includes(d.Fylke);

    return isIncluded;
  });
</script>

<main>
  <p><a href="/">Main</a></p>
  <h1>Feide Nord</h1>
  <div>
    <label>
      <input
        type="radio"
        bind:group={selectedFylke}
        name="fylke"
        value="Troms"
      />
      Troms
    </label>
    <label>
      <input
        type="radio"
        bind:group={selectedFylke}
        name="fylke"
        value="Finnmark"
      />
      Finnmark
    </label>
    <label>
      <input
        type="radio"
        bind:group={selectedFylke}
        name="fylke"
        value="Telemark|Vestfold"
      />
      Telemark|Vestfold
    </label>
    <label>
      <input
        type="radio"
        bind:group={selectedFylke}
        name="fylke"
        value="Møre og Romsdal"
      />
      Digi Møre og Romsdal
    </label>
  </div>
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

  <FeideStats
    {config}
    markers={data1}
    label={selectedFylke}
    mapsK={data.mapK}
    mapsF={data.mapF}
  />
  <h3>Filtered Data (data1)</h3>
  <pre>{JSON.stringify(data1, null, 2)}</pre>
</main>
