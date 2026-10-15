/**
 * Image pipeline for Hotel Panorama.
 *
 * Reads the hotel's supplied camera originals (default: ../_source, i.e. the
 * extracted Google Drive folders), and writes web-ready JPEGs into
 * public/images/<category>/<id>.jpg plus a typed manifest at
 * src/content/images.json (dimensions, alt text, blur placeholder).
 *
 * Next.js <Image> then serves AVIF/WebP at responsive sizes from these masters.
 *
 *   npm run images              # process everything (skips files already done)
 *   npm run images -- --force   # re-encode everything
 *   SOURCE_DIR=/path npm run images
 *
 * Category/room assignments follow the hotel's own folder names and the
 * categorisation used on hotelpanorama.co.in (Royal Crest, Elegance,
 * Twin Elegance, Rivazz Hall, Horizon Hall).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_DIR = path.resolve(root, process.env.SOURCE_DIR ?? "../_source");
const MANIFEST = path.join(root, "src", "content", "images.json");
const MAX_EDGE = 2200;
const force = process.argv.includes("--force");

/** @type {{id:string, src:string, category:string, room?:string, alt:string}[]} */
const IMAGES = [
  // ── Exterior & views ────────────────────────────────────────────────
  { id: "ext-facade-dusk", src: "Exterior/_BHS1493.JPG", category: "exterior", alt: "Hotel Panorama's illuminated sign above the glass entrance at dusk" },
  { id: "ext-facade-upward", src: "Exterior/_BHS1490.JPG", category: "exterior", alt: "Upward view of the Hotel Panorama facade and its 'Rooms — Banquet' sign" },
  { id: "ext-entrance-angle", src: "Exterior/_BHS1491.JPG", category: "exterior", alt: "Glass-fronted entrance canopy of Hotel Panorama with lit signage" },
  { id: "ext-street-portrait", src: "Exterior/_BHS14881.jpg", category: "exterior", alt: "Hotel Panorama's facade seen from the street under an evening sky" },
  { id: "ext-street-portrait-day", src: "Exterior/_BHS1485.JPG", category: "exterior", alt: "Street view of Hotel Panorama between neighbouring buildings" },
  { id: "ext-night-aerial", src: "Exterior/DJI_0048.JPG", category: "exterior", alt: "Aerial night view of Hotel Panorama with its lit facade, Banquet and Hotel Panorama signs" },
  { id: "ext-night-wide", src: "Exterior/DJI_0041.JPG", category: "exterior", alt: "Hotel Panorama glowing at night beside the main road" },
  { id: "ext-night-city", src: "Exterior/DJI_0046.JPG", category: "exterior", alt: "Night-time aerial of the hotel and the Satellite skyline" },
  { id: "ext-night-skyline", src: "Exterior/DJI_0044.JPG", category: "exterior", alt: "Ahmedabad's evening skyline with Hotel Panorama lit in the foreground" },
  { id: "ext-entrance-aerial", src: "Exterior/DJI_0039.JPG", category: "exterior", alt: "Elevated view of the Hotel Panorama entrance and forecourt" },
  { id: "ext-facade-aerial", src: "Exterior/DJI_0020.JPG", category: "exterior", alt: "Drone view of the hotel facade with Banquet signage" },
  { id: "ext-street-aerial", src: "Exterior/DJI_0035.JPG", category: "exterior", alt: "Hotel Panorama seen from across the road" },
  { id: "ext-topdown", src: "Exterior/DJI_0032.JPG", category: "exterior", alt: "High aerial view of the hotel building and its approach" },
  { id: "ext-neighbourhood", src: "Exterior/DJI_0014.JPG", category: "exterior", alt: "Aerial view of Hotel Panorama within the Satellite neighbourhood" },
  { id: "ext-neighbourhood-wide", src: "Exterior/DJI_0005.JPG", category: "exterior", alt: "Wide aerial view of the hotel and surrounding Ahmedabad streets" },
  { id: "ext-road", src: "Exterior/DJI_0007.JPG", category: "exterior", alt: "Aerial view along the main road near the hotel" },

  // ── Lobby & reception ───────────────────────────────────────────────
  { id: "lobby-reception", src: "Reception Aeria/_BHS13861.jpg", category: "lobby", alt: "Reception desk beneath a crystal chandelier and the Hotel Panorama emblem" },
  { id: "lobby-reception-portrait", src: "Reception Aeria/_BHS13991.jpg", category: "lobby", alt: "Reception desk with marble feature wall and chandelier" },
  { id: "lobby-lounge", src: "Reception Aeria/_BHS13761.jpg", category: "lobby", alt: "Lobby lounge with leather sofas and timber-panelled walls" },
  { id: "lobby-lounge-reception", src: "Reception Aeria/_BHS13821.jpg", category: "lobby", alt: "Lobby lounge seating facing the reception desk" },
  { id: "lobby-lounge-detail", src: "Reception Aeria/_BHS14041.jpg", category: "lobby", alt: "Close view of the lobby sofas and patterned rug" },
  { id: "lobby-lounge-wide", src: "Reception Aeria/_BHS1401.JPG", category: "lobby", alt: "Wide view of the lobby lounge and glass entrance" },
  { id: "lobby-corridor", src: "Reception Aeria/_BHS1377.JPG", category: "lobby", alt: "Reception and lounge area with a lit ceiling" },
  { id: "lobby-seating", src: "Reception Aeria/_BHS1389.JPG", category: "lobby", alt: "Waiting lounge with dining tables and upholstered chairs" },
  { id: "lobby-seating-portrait", src: "Reception Aeria/_BHS13921.jpg", category: "lobby", alt: "Waiting lounge seating beside a glass partition" },
  { id: "lobby-lounge-portrait", src: "Reception Aeria/_BHS1396.JPG", category: "lobby", alt: "Lobby sofas beneath the ceiling coves" },

  // ── Restaurant ──────────────────────────────────────────────────────
  { id: "restaurant-dining-room", src: "Restaurant/_BHS1356.JPG", category: "restaurant", alt: "Hotel Panorama Restaurant with warm terracotta walls and a lit timber ceiling" },
  { id: "restaurant-ceiling", src: "Restaurant/_BHS1358.JPG", category: "restaurant", alt: "Restaurant dining room under a ceiling of glowing lamps" },
  { id: "restaurant-wide", src: "Restaurant/_BHS1360.JPG", category: "restaurant", alt: "Wide view of the restaurant tables and glass partitions" },
  { id: "restaurant-kitchen-door", src: "Restaurant/_BHS1361.JPG", category: "restaurant", alt: "Restaurant tables set beside the kitchen entrance" },
  { id: "restaurant-banquette", src: "Restaurant/_BHS1362.JPG", category: "restaurant", alt: "Banquette seating along the restaurant wall" },
  { id: "restaurant-buffet-view", src: "Restaurant/_BHS1364.JPG", category: "restaurant", alt: "Table settings looking toward the restaurant buffet counter" },
  { id: "restaurant-tables", src: "Restaurant/_BHS1366.JPG", category: "restaurant", alt: "Set tables in the Hotel Panorama Restaurant" },
  { id: "restaurant-portrait", src: "Restaurant/_BHS1367.JPG", category: "restaurant", alt: "Restaurant banquette beneath the lit ceiling" },
  { id: "restaurant-portrait-2", src: "Restaurant/_BHS1368.JPG", category: "restaurant", alt: "Restaurant tables and textured upholstered chairs" },
  { id: "restaurant-corner", src: "Restaurant/_BHS1369.JPG", category: "restaurant", alt: "Corner table with display shelving in the restaurant" },
  { id: "restaurant-buffet", src: "Restaurant/_BHS1371.JPG", category: "restaurant", alt: "Buffet counter with display niches in the restaurant" },
  { id: "restaurant-buffet-angle", src: "Restaurant/_BHS1372.JPG", category: "restaurant", alt: "Buffet counter and set tables in the restaurant" },

  // ── Rivazz Hall (banquet) ───────────────────────────────────────────
  { id: "rivazz-symmetry", src: "Baquet/_BHS1513.JPG", category: "rivazz", alt: "Rivazz Hall with crystal ceiling feature above rows of dressed chairs" },
  { id: "rivazz-aisle", src: "Baquet/_BHS1511.JPG", category: "rivazz", alt: "Central aisle of Rivazz Hall under a cascading crystal ceiling" },
  { id: "rivazz-theatre", src: "Baquet/_BHS1498.JPG", category: "rivazz", alt: "Rivazz Hall arranged in theatre-style seating" },
  { id: "rivazz-stage-end", src: "Baquet/_BHS1500.JPG", category: "rivazz", alt: "View toward the front of Rivazz Hall across the seating" },
  { id: "rivazz-seating-angle", src: "Baquet/_BHS1501.JPG", category: "rivazz", alt: "Angled view of the seating rows in Rivazz Hall" },
  { id: "rivazz-chandelier-rows", src: "Baquet/_BHS1502.JPG", category: "rivazz", alt: "Crystal ceiling and chair rows in Rivazz Hall" },
  { id: "rivazz-crystal-ceiling", src: "Baquet/_BHS1504.JPG", category: "rivazz", alt: "Sparkling crystal installation over Rivazz Hall" },
  { id: "rivazz-front", src: "Baquet/_BHS1506.JPG", category: "rivazz", alt: "Front of Rivazz Hall with draped walls and wall sconces" },
  { id: "rivazz-length", src: "Baquet/_BHS1507.JPG", category: "rivazz", alt: "Full length of Rivazz Hall looking toward the buffet" },
  { id: "rivazz-length-2", src: "Baquet/_BHS1508.JPG", category: "rivazz", alt: "Rivazz Hall's long aisle between dressed chairs" },
  { id: "rivazz-side", src: "Baquet/_BHS1510.JPG", category: "rivazz", alt: "Side view of Rivazz Hall seating and timber ceiling" },
  { id: "rivazz-open-floor", src: "Baquet/_BHS1515.JPG", category: "rivazz", alt: "Open marble floor of Rivazz Hall beside the buffet counter" },
  { id: "rivazz-full", src: "Baquet/_BHS1516.JPG", category: "rivazz", alt: "Rivazz Hall seen from the rear with seating set either side" },
  { id: "rivazz-buffet-wide", src: "Baquet/_BHS1494.JPG", category: "rivazz", alt: "Rivazz Hall buffet counter with brass chafing stations" },
  { id: "rivazz-buffet", src: "Baquet/_BHS1495.JPG", category: "rivazz", alt: "Buffet counter set with serving stations in Rivazz Hall" },
  { id: "rivazz-buffet-detail", src: "Baquet/_BHS1497.JPG", category: "rivazz", alt: "Detail of the buffet display in Rivazz Hall" },
  { id: "rivazz-buffet-long", src: "Baquet/_BHS1514.JPG", category: "rivazz", alt: "Long buffet counter running along Rivazz Hall" },

  // ── Horizon Hall ────────────────────────────────────────────────────
  { id: "horizon-overview", src: "Conference Hall/_BHS1605.JPG", category: "horizon", alt: "Horizon Hall set with dressed round tables and timber-panelled walls" },
  { id: "horizon-rounds", src: "Conference Hall/_BHS1607.JPG", category: "horizon", alt: "Round banquet tables in Horizon Hall" },
  { id: "horizon-arch", src: "Conference Hall/_BHS1608.JPG", category: "horizon", alt: "Horizon Hall with its lit arch detail and table settings" },
  { id: "horizon-rounds-2", src: "Conference Hall/_BHS1609.JPG", category: "horizon", alt: "Horizon Hall arranged with round tables and a buffet line" },
  { id: "horizon-rounds-3", src: "Conference Hall/_BHS1610.JPG", category: "horizon", alt: "Round tables beneath the chandeliers in Horizon Hall" },
  { id: "horizon-table-setting", src: "Conference Hall/_BHS1612.JPG", category: "horizon", alt: "Table set with notepads and water in Horizon Hall" },
  { id: "horizon-rounds-wide", src: "Conference Hall/_BHS1613.JPG", category: "horizon", alt: "Wide view of Horizon Hall's banquet layout" },
  { id: "horizon-round-table", src: "Conference Hall/_BHS1614.JPG", category: "horizon", alt: "Dressed round table and chairs in Horizon Hall" },
  { id: "horizon-buffet-counter", src: "Conference Hall/_BHS1615.JPG", category: "horizon", alt: "Buffet counter along the wall of Horizon Hall" },
  { id: "horizon-rounds-4", src: "Conference Hall/_BHS1617.JPG", category: "horizon", alt: "Horizon Hall tables beneath the ceiling lights" },
  { id: "horizon-buffet", src: "Conference Hall/_BHS1618.JPG", category: "horizon", alt: "Horizon Hall buffet set with serving stations" },
  { id: "horizon-table-detail", src: "Conference Hall/_BHS1620.JPG", category: "horizon", alt: "Close view of a meeting table setting in Horizon Hall" },
  { id: "horizon-classroom", src: "Conference Hall/_BHS1653.JPG", category: "horizon", alt: "Horizon Hall arranged with rectangular tables for a meeting" },
  { id: "horizon-podium", src: "Conference Hall/_BHS1654.JPG", category: "horizon", alt: "Lectern and meeting tables in Horizon Hall" },
  { id: "horizon-podium-2", src: "Conference Hall/_BHS1656.JPG", category: "horizon", alt: "Lectern at the side of Horizon Hall's meeting layout" },
  { id: "horizon-classroom-2", src: "Conference Hall/_BHS1657.JPG", category: "horizon", alt: "Meeting tables with notepads in Horizon Hall" },

  // ── Royal Crest ─────────────────────────────────────────────────────
  { id: "royal-crest-suite", src: "Rooms/7/_BHS1663.JPG", category: "rooms", room: "royal-crest", alt: "Royal Crest room with king bed, sofa and work desk" },
  { id: "royal-crest-window", src: "Rooms/7/_BHS1660.JPG", category: "rooms", room: "royal-crest", alt: "Royal Crest room with king bed and full-height curtains" },
  { id: "royal-crest-window-2", src: "Rooms/7/_BHS1661.JPG", category: "rooms", room: "royal-crest", alt: "Royal Crest room bathed in daylight through sheer curtains" },
  { id: "royal-crest-bed", src: "Rooms/7/_BHS1662.JPG", category: "rooms", room: "royal-crest", alt: "King bed facing the window in a Royal Crest room" },
  { id: "royal-crest-sofa", src: "Rooms/7/_BHS1664.JPG", category: "rooms", room: "royal-crest", alt: "Royal Crest room seen from the bed toward the sofa and desk" },
  { id: "royal-crest-tv", src: "Rooms/7/_BHS1665.JPG", category: "rooms", room: "royal-crest", alt: "Royal Crest room with wall-mounted TV and entrance" },
  { id: "royal-crest-wardrobe", src: "Rooms/7/_BHS1666.JPG", category: "rooms", room: "royal-crest", alt: "Royal Crest room with wardrobe and accent chair" },
  { id: "royal-crest-bath", src: "Rooms/7/_BHS1667.JPG", category: "rooms", room: "royal-crest", alt: "Royal Crest bathroom with glass shower and vessel basin" },
  { id: "royal-crest-bath-2", src: "Rooms/7/_BHS1668.JPG", category: "rooms", room: "royal-crest", alt: "Walk-in shower in a Royal Crest bathroom" },
  { id: "royal-crest-windows", src: "Rooms/3/_BHS1428.JPG", category: "rooms", room: "royal-crest", alt: "Royal Crest room with king bed and wide windows" },
  { id: "royal-crest-swans", src: "Rooms/3/_BHS1429.JPG", category: "rooms", room: "royal-crest", alt: "King bed with towel swans in a Royal Crest room" },
  { id: "royal-crest-lounge", src: "Rooms/3/_BHS1430.JPG", category: "rooms", room: "royal-crest", alt: "Royal Crest room with sofa and tea station" },
  { id: "royal-crest-door", src: "Rooms/3/_BHS1433.JPG", category: "rooms", room: "royal-crest", alt: "Royal Crest room seen toward the entrance and TV" },
  { id: "royal-crest-mirror", src: "Rooms/3/_BHS1435.JPG", category: "rooms", room: "royal-crest", alt: "Royal Crest room with mirrored wardrobe and window" },
  { id: "housekeeping-turndown", src: "Rooms/7/_BHS1669.JPG", category: "rooms", room: "royal-crest", alt: "Hotel Panorama housekeeping preparing a king bed" },
  { id: "housekeeping-bed", src: "Rooms/7/_BHS1671.JPG", category: "rooms", room: "royal-crest", alt: "Housekeeping smoothing the bed runner in a Royal Crest room" },

  // ── Elegance ────────────────────────────────────────────────────────
  { id: "elegance-sage", src: "Rooms/5/_BHS1465.JPG", category: "rooms", room: "elegance", alt: "Elegance room with queen bed, sage cushions and mirrored wardrobe" },
  { id: "elegance-sage-bed", src: "Rooms/5/_BHS1459.JPG", category: "rooms", room: "elegance", alt: "Queen bed with sage accents in an Elegance room" },
  { id: "elegance-sage-window", src: "Rooms/5/_BHS1458.JPG", category: "rooms", room: "elegance", alt: "Elegance room beside a curtained window" },
  { id: "elegance-sage-minibar", src: "Rooms/5/_BHS1460.JPG", category: "rooms", room: "elegance", alt: "Elegance room with tea station and refrigerator" },
  { id: "elegance-sage-light", src: "Rooms/5/_BHS1461.JPG", category: "rooms", room: "elegance", alt: "Daylit Elegance room seen from the bedside" },
  { id: "elegance-sage-tv", src: "Rooms/5/_BHS1462.JPG", category: "rooms", room: "elegance", alt: "Elegance room with wall-mounted TV and window" },
  { id: "elegance-sage-entrance", src: "Rooms/5/_BHS1463.JPG", category: "rooms", room: "elegance", alt: "Elegance room toward the entrance and TV wall" },
  { id: "elegance-sage-wide", src: "Rooms/5/_BHS1464.JPG", category: "rooms", room: "elegance", alt: "Wide view of an Elegance room and its window" },
  { id: "elegance-sage-desk", src: "Rooms/5/_BHS1467.JPG", category: "rooms", room: "elegance", alt: "Elegance room with desk and entrance" },
  { id: "elegance-terracotta", src: "Rooms/1/_BHS1409.JPG", category: "rooms", room: "elegance", alt: "Elegance room with queen bed, terracotta headboard and abstract art" },
  { id: "elegance-terracotta-tv", src: "Rooms/1/_BHS1408.JPG", category: "rooms", room: "elegance", alt: "Elegance room with TV and window" },
  { id: "elegance-terracotta-door", src: "Rooms/1/_BHS1410.JPG", category: "rooms", room: "elegance", alt: "Elegance room with tea station and wardrobe" },
  { id: "elegance-terracotta-angle", src: "Rooms/1/_BHS1411.JPG", category: "rooms", room: "elegance", alt: "Elegance room seen across the bed toward the entrance" },
  { id: "elegance-terracotta-window", src: "Rooms/1/_BHS1413.JPG", category: "rooms", room: "elegance", alt: "Elegance room with queen bed by the window" },
  { id: "elegance-terracotta-portrait", src: "Rooms/1/_BHS1416.JPG", category: "rooms", room: "elegance", alt: "Queen bed with rolled towels in an Elegance room" },
  { id: "elegance-bath", src: "Rooms/1/_BHS1417.JPG", category: "rooms", room: "elegance", alt: "Elegance bathroom with vessel basin and glass shower" },

  // ── Twin Elegance ───────────────────────────────────────────────────
  { id: "twin-sage", src: "Rooms/6/_BHS1470.JPG", category: "rooms", room: "twin-elegance", alt: "Twin Elegance room with two single beds and sofa" },
  { id: "twin-sage-beds", src: "Rooms/6/_BHS1468.JPG", category: "rooms", room: "twin-elegance", alt: "Two single beds with sage runners in a Twin Elegance room" },
  { id: "twin-sage-front", src: "Rooms/6/_BHS1469.JPG", category: "rooms", room: "twin-elegance", alt: "Twin Elegance room seen from the foot of the beds" },
  { id: "twin-sage-curtain", src: "Rooms/6/_BHS1471.JPG", category: "rooms", room: "twin-elegance", alt: "Twin Elegance room with patterned curtains" },
  { id: "twin-sage-portrait", src: "Rooms/6/_BHS1473.JPG", category: "rooms", room: "twin-elegance", alt: "Twin beds beneath framed arch artwork" },
  { id: "twin-sage-portrait-2", src: "Rooms/6/_BHS1474.JPG", category: "rooms", room: "twin-elegance", alt: "Twin Elegance room with sofa and mirrored wardrobe" },
  { id: "twin-terracotta", src: "Rooms/2/_BHS1423.JPG", category: "rooms", room: "twin-elegance", alt: "Twin Elegance room with two single beds and terracotta headboards" },
  { id: "twin-terracotta-window", src: "Rooms/2/_BHS1425.JPG", category: "rooms", room: "twin-elegance", alt: "Twin Elegance room by the window with wall-mounted TV" },
  { id: "twin-terracotta-wide", src: "Rooms/2/_BHS1426.JPG", category: "rooms", room: "twin-elegance", alt: "Twin Elegance room with wardrobe and window" },
  { id: "twin-terracotta-portrait", src: "Rooms/2/_BHS1418.JPG", category: "rooms", room: "twin-elegance", alt: "Twin Elegance room with timber floor" },
  { id: "twin-terracotta-chair", src: "Rooms/2/_BHS1419.JPG", category: "rooms", room: "twin-elegance", alt: "Single bed and accent chair in a Twin Elegance room" },
  { id: "twin-terracotta-curtain", src: "Rooms/2/_BHS1420.JPG", category: "rooms", room: "twin-elegance", alt: "Single bed beside sheer curtains" },
  { id: "twin-terracotta-art", src: "Rooms/2/_BHS1421.JPG", category: "rooms", room: "twin-elegance", alt: "Twin beds beneath framed seascape art" },
  { id: "twin-bath", src: "Rooms/2/_BHS1422.JPG", category: "rooms", room: "twin-elegance", alt: "Twin Elegance bathroom with lit mirror and vessel basin" },

  // ── Guest room (not assigned to a category by the hotel) ────────────
  { id: "room-guest", src: "Rooms/4/_BHS1438.JPG", category: "rooms", alt: "Guest room with double bed, terracotta headboard and reading lights" },
  { id: "room-guest-angle", src: "Rooms/4/_BHS1436.JPG", category: "rooms", alt: "Guest room with desk, accent chair and curtained wall" },
  { id: "room-guest-mirror", src: "Rooms/4/_BHS1439.JPG", category: "rooms", alt: "Guest room with mirrored wardrobe and houndstooth chair" },
  { id: "room-guest-wide", src: "Rooms/4/_BHS1441.JPG", category: "rooms", alt: "Wide view of a guest room and its lit curtain wall" },
  { id: "room-guest-tv", src: "Rooms/4/_BHS1442.JPG", category: "rooms", alt: "Guest room with TV, tea station and entrance" },
  { id: "room-guest-desk", src: "Rooms/4/_BHS1444.JPG", category: "rooms", alt: "Work desk and chairs in a guest room" },
  { id: "room-guest-bath", src: "Rooms/4/_BHS1446.JPG", category: "rooms", alt: "Guest bathroom with walk-in shower and lit mirror" },
];

/**
 * Focal points (CSS object-position) for photos that get cropped into
 * landscape frames — mostly portrait shots — so the subject stays in view.
 */
const FOCUS = {
  "ext-street-portrait": "50% 42%",
  "ext-street-portrait-day": "50% 42%",
  "lobby-reception-portrait": "50% 45%",
  "lobby-seating-portrait": "50% 62%",
  "lobby-lounge-portrait": "50% 68%",
  "restaurant-portrait": "50% 62%",
  "restaurant-portrait-2": "50% 62%",
  "restaurant-corner": "50% 58%",
  "royal-crest-bath": "50% 55%",
  "royal-crest-bath-2": "50% 50%",
  "elegance-bath": "50% 55%",
  "twin-bath": "50% 55%",
  "room-guest-bath": "50% 55%",
  "elegance-terracotta-portrait": "50% 62%",
  "twin-sage-portrait": "50% 68%",
  "twin-sage-portrait-2": "50% 68%",
  "twin-terracotta-portrait": "50% 66%",
  "twin-terracotta-chair": "50% 66%",
  "twin-terracotta-curtain": "50% 66%",
  "twin-terracotta-art": "50% 66%",
  "ext-facade-dusk": "50% 45%",
  "ext-night-aerial": "50% 60%",
};

function blurOf(buf) {
  return sharp(buf).resize(16, 16, { fit: "inside" }).webp({ quality: 40 }).toBuffer()
    .then((b) => `data:image/webp;base64,${b.toString("base64")}`);
}

async function main() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Source folder not found: ${SOURCE_DIR}\nExtract the supplied photo archives there or set SOURCE_DIR.`);
    process.exit(1);
  }
  const prev = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : {};
  const manifest = {};
  const ids = new Set();
  let done = 0;

  for (const img of IMAGES) {
    if (ids.has(img.id)) throw new Error(`Duplicate id ${img.id}`);
    ids.add(img.id);
    const input = path.join(SOURCE_DIR, img.src);
    if (!fs.existsSync(input)) throw new Error(`Missing source ${input}`);
    const rel = `/images/${img.category}/${img.id}.jpg`;
    const out = path.join(root, "public", rel);
    fs.mkdirSync(path.dirname(out), { recursive: true });

    let entry = prev[img.id];
    if (force || !entry || !fs.existsSync(out)) {
      const buf = await sharp(input, { failOn: "none" })
        .rotate()
        .resize(MAX_EDGE, MAX_EDGE, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 80, mozjpeg: true, progressive: true })
        .toBuffer({ resolveWithObject: true });
      fs.writeFileSync(out, buf.data);
      entry = { width: buf.info.width, height: buf.info.height, blurDataURL: await blurOf(buf.data) };
    }
    manifest[img.id] = {
      id: img.id,
      src: rel,
      width: entry.width,
      height: entry.height,
      alt: img.alt,
      category: img.category,
      ...(img.room ? { room: img.room } : {}),
      position: FOCUS[img.id] ?? "50% 50%",
      blurDataURL: entry.blurDataURL,
      original: img.src,
    };
    done++;
    process.stdout.write(`\r${done}/${IMAGES.length} ${img.id.padEnd(32)}`);
  }

  // Social sharing card from the hero photograph.
  const og = path.join(root, "public", "og-image.jpg");
  if (force || !fs.existsSync(og)) {
    await sharp(path.join(SOURCE_DIR, "Exterior/_BHS1493.JPG")).rotate()
      .resize(1200, 630, { fit: "cover", position: "centre" })
      .jpeg({ quality: 82, mozjpeg: true }).toFile(og);
  }

  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\nWrote ${Object.keys(manifest).length} images → public/images, manifest → src/content/images.json`);
}

main().catch((e) => { console.error(e); process.exit(1); });
