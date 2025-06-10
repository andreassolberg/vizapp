import type { PageServerLoad } from "./$types";
// declare module 'lodash';
import _ from "lodash";
// import { processPartifordeling } from "./helpers";

export const load: PageServerLoad = async ({ fetch }) => {
  const response = await fetch("/feidenord/feidenord.json");
  const feidestats = await response.json();

  const mapF = await fetch("/kart/Fylker-S.geojson").then((res) => res.json());
  const mapK = await fetch("/kart/Kommuner-S.geojson").then((res) =>
    res.json()
  );

  const sortedFeidestats = _.orderBy(feidestats, ["Elever"], ["asc"]);
  const feidestatsWithPerElev = sortedFeidestats.map((stat) => ({
    ...stat,
    PerElev: stat.Innlogginger / stat.Elever,
    map: mapK.features.find((feature: any) =>
      feature.properties.kommunenavn.includes(stat.Kommune)
    ),
  }));
  console.log("mapK", mapK);

  return { feidestats: feidestatsWithPerElev, mapK, mapF };
};
