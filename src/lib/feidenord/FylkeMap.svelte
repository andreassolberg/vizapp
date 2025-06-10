<script lang="ts">
  import * as d3 from "d3";
  import { geoTransverseMercator } from "d3-geo";

  import { rewind } from "@turf/turf";

  export let x;
  export let y;
  export let mapF;
  export let mapK;
  export let width = 200;
  export let height = 200;
  export let center = [42, 63];
  export let scale = 700;

  console.log("FyleMap mapF, mapK", mapF, mapK);

  $: mapFr = rewind(mapF, { reverse: true });
  $: mapKr = rewind(mapK, { reverse: true });

  // Compute centroid from properly rewound geometry
  $: autoCenter = mapFr ? d3.geoCentroid(mapFr) : [15, 65];
  
  $: {
    if (mapFr) {
      console.log(
        `FylkeMap auto-center for ${mapF.properties?.fylkesnavn}:`
      );
      console.log(`  - Auto center:     [${autoCenter[0].toFixed(2)}, ${autoCenter[1].toFixed(2)}]`);
      console.log(`  - Manual center:   [${center[0]}, ${center[1]}]`);
      console.log(`  - Difference:      [${Math.abs(autoCenter[0] - center[0]).toFixed(2)}, ${Math.abs(autoCenter[1] - center[1]).toFixed(2)}]`);
    }
  }

  $: projectionUTM = geoTransverseMercator()
    .scale(scale)
    .translate([0, 0])
    .rotate([-autoCenter[0], -autoCenter[1], 0]);

  $: pathUTM = d3.geoPath().projection(projectionUTM);

  // console.log("projectionUTM", geoTransverseMercator, "center", center);
</script>

<g transform="translate({x}, {y})">
  <path d={pathUTM(mapFr)} fill="#cccccc" stroke="none" stroke-width="0.5"
  ></path>
  <path d={pathUTM(mapKr)} fill="red" stroke="none" stroke-width="0.5"></path>
</g>
