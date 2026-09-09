export type PortfolioPhoto = {
  state: 'before' | 'after';
  angle: number;
  width: number;
  height: number;
  alt: string;
  caption: string;
};

export type PortfolioRepair = {
  repairId: string;
  slug: string;
  vehicle: string;
  title: string;
  summary: string;
  photos: PortfolioPhoto[];
};

export const galleryImage = (repair: PortfolioRepair, photo: PortfolioPhoto, width: 720 | 1200, format: 'avif' | 'webp' | 'jpg') =>
  `/media/portfolio/${repair.repairId}/${photo.state}-angle-${photo.angle}${width === 720 ? '-720' : ''}.${format}`;

export const portfolioRepairs: PortfolioRepair[] = [
  {
    repairId: '2013-silverado',
    slug: '2013-silverado-paintless-dent-repair',
    vehicle: '2013 Chevrolet Silverado',
    title: '2013 Chevrolet Silverado — Paintless Dent Repair',
    summary: 'Three paired views document visible door and side-panel dent damage before repair and the panel appearance afterward.',
    photos: [
      { state:'before', angle:1, width:1200, height:900, alt:'Dent damage on a 2013 Chevrolet Silverado door before paintless dent repair', caption:'Before · Angle 1 — visible door-panel dent damage.' },
      { state:'after', angle:1, width:1200, height:900, alt:'2013 Chevrolet Silverado door panel after paintless dent repair', caption:'After · Angle 1 — the same repair area after PDR.' },
      { state:'before', angle:2, width:1200, height:1600, alt:'Second angle of dent damage on a 2013 Chevrolet Silverado before PDR', caption:'Before · Angle 2 — an overhead view of the damaged panel.' },
      { state:'after', angle:2, width:1200, height:1600, alt:'Second angle of the 2013 Chevrolet Silverado panel after PDR', caption:'After · Angle 2 — the corresponding overhead view after repair.' },
      { state:'before', angle:3, width:1200, height:900, alt:'Third angle of 2013 Chevrolet Silverado side-panel dent damage before PDR', caption:'Before · Angle 3 — a wider view of the damaged side panel.' },
      { state:'after', angle:3, width:1200, height:900, alt:'Third angle of the 2013 Chevrolet Silverado side panel after PDR', caption:'After · Angle 3 — the corresponding wider view after repair.' },
    ],
  },
  {
    repairId: 'toyota-4runner',
    slug: 'toyota-4runner-paintless-dent-repair',
    vehicle: 'Toyota 4Runner',
    title: 'Toyota 4Runner — Paintless Dent Repair',
    summary: 'Two paired views show visible dent damage on the rear liftgate before repair and the panel appearance afterward.',
    photos: [
      { state:'before', angle:1, width:1200, height:900, alt:'Dent damage on a Toyota 4Runner rear liftgate before paintless dent repair', caption:'Before · Angle 1 — visible dent damage on the rear liftgate.' },
      { state:'after', angle:1, width:1200, height:900, alt:'Toyota 4Runner rear liftgate after paintless dent repair', caption:'After · Angle 1 — the same liftgate area after PDR.' },
      { state:'before', angle:2, width:1200, height:900, alt:'Second angle of Toyota 4Runner liftgate dent damage before PDR', caption:'Before · Angle 2 — a second view of the damaged liftgate.' },
      { state:'after', angle:2, width:1200, height:900, alt:'Second angle of the Toyota 4Runner liftgate after PDR', caption:'After · Angle 2 — the corresponding view after repair.' },
    ],
  },
  {
    repairId: 'nissan-murano',
    slug: 'nissan-murano-paintless-dent-repair',
    vehicle: 'Nissan Murano',
    title: 'Nissan Murano — Paintless Dent Repair',
    summary: 'Two before-and-after views document rear quarter-panel dent damage, with a third before image retained as additional visual context.',
    photos: [
      { state:'before', angle:1, width:1200, height:1600, alt:'Dent damage on a Nissan Murano rear quarter panel before paintless dent repair', caption:'Before · Angle 1 — reflection lighting makes the panel distortion visible.' },
      { state:'after', angle:1, width:1200, height:1600, alt:'Nissan Murano rear quarter panel after paintless dent repair', caption:'After · Angle 1 — the same quarter-panel area after PDR.' },
      { state:'before', angle:2, width:1200, height:900, alt:'Second angle of Nissan Murano quarter-panel dent damage before PDR', caption:'Before · Angle 2 — a wider view of the damaged quarter panel.' },
      { state:'after', angle:2, width:1200, height:900, alt:'Second angle of the Nissan Murano quarter panel after PDR', caption:'After · Angle 2 — the corresponding wider view after repair.' },
      { state:'before', angle:3, width:1200, height:900, alt:'Additional view of Nissan Murano quarter-panel dent damage before PDR', caption:'Before · Angle 3 — an additional context view of the original damage.' },
    ],
  },
  {
    repairId: 'lexus-rx',
    slug: 'lexus-rx-paintless-dent-repair',
    vehicle: 'Lexus RX',
    title: 'Lexus RX — Paintless Dent Repair',
    summary: 'A paired view documents visible rear-hatch dent damage before repair and the panel appearance afterward. A second before photograph provides a closer context view.',
    photos: [
      { state:'before', angle:1, width:1200, height:920, alt:'Dent damage on a Lexus RX rear hatch before paintless dent repair', caption:'Before · Angle 1 — visible dent damage on the rear hatch.' },
      { state:'after', angle:1, width:1200, height:1095, alt:'Lexus RX rear hatch after paintless dent repair', caption:'After · Angle 1 — the same hatch area after PDR.' },
      { state:'before', angle:2, width:1200, height:1492, alt:'Closer view of Lexus RX rear-hatch dent damage before PDR', caption:'Before · Angle 2 — an additional close context view of the original damage.' },
    ],
  },
];
