import type { PageServerLoad } from "./$types";
// declare module 'lodash';
import _ from "lodash";
import { processPartifordeling } from "./helpers";

export const load: PageServerLoad = async ({ fetch }) => {
  const filenames = ["/politikk-data24.json", "/politikk-data25.json"];
  let allData: any[] = [];

  for (const filename of filenames) {
    const response = await fetch(filename);
    const data = await response.json();
    allData.push(processPartifordeling(data.partifordeling));
  }

  return { datasets: allData };
};
