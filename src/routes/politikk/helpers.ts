import _ from "lodash";

export function sankeyLinkPath({ x0, x1, y0top, y0bottom, y1top, y1bottom }) {
  const curvature = 0.5; // juster kurvaturen her
  const xi = (x0 + x1) / 2;

  return [
    `M ${x0},${y0top}`, // Startpunkt øverst
    `C ${xi},${y0top} ${xi},${y1top} ${x1},${y1top}`, // Øvre kurve
    `L ${x1},${y1bottom}`, // Linje ned
    `C ${xi},${y1bottom} ${xi},${y0bottom} ${x0},${y0bottom}`, // Nedre kurve tilbake
    `Z`, // Lukk path
  ].join(" ");
}

export function processPartifordeling(partifordeling: any[]) {
  let partier = _.uniq(partifordeling.map((d: any) => d.parti));
  let kategorier = _.uniq(partifordeling.map((d: any) => d.kategori));
  kategorier = ["redaktorer", "journalister", "befolkning"];
  console.log("Kategorier", kategorier);
  kategorier.forEach((kategori: any) => {
    let tot = _.sumBy(
      partifordeling.filter((d: any) => d.kategori === kategori),
      (d: any) => d.andel
    );
    let sorted = _.orderBy(
      partifordeling.filter((d: any) => d.kategori === kategori),
      ["andel"],
      ["desc"]
    );
    let cummulative = 0;
    let rankIndex = 0;
    sorted.forEach((d: any) => {
      d.fra = cummulative;
      cummulative += d.andel / tot;
      d.til = cummulative;
      d.rankIndex = rankIndex++;
    });
  });
  return {
    kategorier,
    partier,
    fordeling: partifordeling.filter((d) => kategorier.includes(d.kategori)),
  };
}
