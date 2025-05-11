import { scaleOrdinal, scaleLinear, group } from "d3";

export function prepareSankeyData({
  fordeling,
  kategorier,
  partier,
  partimeta,
  catmeta,
  config,
}) {
  let markers = fordeling;
  let innerWidth = config.width - 2 * config.margin;
  let colWidth = Math.ceil(
    (innerWidth - config.colSpacing * (kategorier.length - 1)) /
      kategorier.length
  );
  let catScale = scaleOrdinal()
    .domain(kategorier)
    .range(
      kategorier.map(
        (_, i) => config.margin + i * (colWidth + config.colSpacing)
      )
    );
  let innerHeight =
    config.height -
    config.margin -
    config.marginTop -
    config.rowSpacing * (partier.length - 1);
  let yScale = scaleLinear()
    .domain([0, 1])
    .range([
      config.marginTop,
      config.height - config.margin - config.rowSpacing * (partier.length - 1),
    ]);
  let heightScale = scaleLinear().domain([0, 1]).range([0, innerHeight]);

  markers = markers.map((m) => {
    let y = yScale(m.fra) + m.rankIndex * config.rowSpacing;
    let height = heightScale(m.til - m.fra);
    let logoHeight = config.logoMaxHeight;
    if (height * config.logoMaxHeightP < config.logoMaxHeight) {
      logoHeight = height * config.logoMaxHeightP;
    }
    let yLogo = y;
    if (logoHeight < height) {
      yLogo = y + (height - logoHeight) / 2;
    }
    return {
      ...m,
      x: catScale(m.kategori),
      y,
      ymid:
        yScale(m.fra + (m.til - m.fra) / 2) + m.rankIndex * config.rowSpacing,
      height,
      logoHeight,
      yLogo,
      fill: partimeta[m.parti].fill,
    };
  });

  const nestedMap = group(
    markers,
    (d) => d.kategori,
    (d) => d.parti
  );
  let rays = [];
  let catcombos = [];
  for (let i = 0; i < kategorier.length - 1; i++) {
    catcombos.push([kategorier[i], kategorier[i + 1]]);
  }
  for (let [catfrom, catto] of catcombos) {
    for (let parti of partier) {
      let from = nestedMap?.get(catfrom)?.get(parti)?.[0];
      let to = nestedMap?.get(catto)?.get(parti)?.[0];
      if (from && to) {
        rays.push({
          from,
          to,
          parti,
          catfrom,
          catto,
          y0top: from.y + from.height,
          y0bottom: from.y,
          y1top: to.y + to.height,
          y1bottom: to.y,
          x0: from.x + colWidth,
          x1: to.x,
        });
      }
    }
  }
  return { markers, rays, colWidth, catScale };
}
