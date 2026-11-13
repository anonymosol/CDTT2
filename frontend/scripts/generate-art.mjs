// Original SVG artwork. No third-party image or commercial box art is copied.
import { mkdir, writeFile } from 'node:fs/promises';
const output = new URL('../public/games/', import.meta.url);
await mkdir(output, { recursive: true });
const covers = [
  ['dao-may', 'Đảo Mây', '#aabfbe', '#e8e7d5', 'cloud'],
  ['vuon-ky-uc', 'Vườn Ký Ức', '#c4ceb0', '#fcf4d8', 'garden'],
  ['mat-ma-pho-co', 'Mật Mã Phố Cổ', '#d0b796', '#f5e6c9', 'town'],
  ['chuyen-tau-hoang-hon', 'Chuyến Tàu Hoàng Hôn', '#d3a68a', '#f4dfbf', 'train'],
  ['rung-thi-tham', 'Rừng Thì Thầm', '#819b87', '#e7e8cc', 'forest'],
  ['bua-tiec-sao', 'Bữa Tiệc Sao', '#a6a5c0', '#f0e8cf', 'stars'],
  ['thuong-cang', 'Thương Cảng', '#9bb4ba', '#eee7cf', 'ship'],
  ['hanh-tinh-nho', 'Hành Tinh Nhỏ', '#b8c7b5', '#f2ead2', 'planet'],
  ['xuong-sac-mau', 'Xưởng Sắc Màu', '#d7b29f', '#f7edd7', 'shapes'],
  ['ban-do-kho-bau', 'Bản Đồ Kho Báu', '#c4ba94', '#f1e7c8', 'map'],
  ['mua-thu-hoach', 'Mùa Thu Hoạch', '#d0c18a', '#f3e8c5', 'garden'],
  ['dem-ke-chuyen', 'Đêm Kể Chuyện', '#8b9bac', '#ece7d6', 'stars'],
];
const leaf = (x, y, scale = 1, color = '#51745e') =>
  `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M0 60Q-70 20-10-40Q40-5 0 60" fill="${color}"/><path d="M-1 60L-8-22" fill="none" stroke="#eef0d9" stroke-width="2" opacity=".55"/></g>`;
const star = (x, y, size, color) =>
  `<path d="M${x} ${y - size}Q${x + size * 0.2} ${y - size * 0.2} ${x + size} ${y}Q${x + size * 0.2} ${y + size * 0.2} ${x} ${y + size}Q${x - size * 0.2} ${y + size * 0.2} ${x - size} ${y}Q${x - size * 0.2} ${y - size * 0.2} ${x} ${y - size}" fill="${color}"/>`;
for (const [id, title, bg, cream, scene] of covers) {
  let art = '';
  if (scene === 'cloud')
    art = `<circle cx="445" cy="105" r="40" fill="#e9ce87"/><path d="M100 230Q180 160 270 225T540 200L540 265H100Z" fill="#73999a"/><path d="M140 210Q150 165 190 175Q215 125 255 175Q300 155 315 210Z" fill="${cream}"/><path d="M330 175Q355 130 385 150Q405 115 440 155Q470 145 485 175Z" fill="${cream}"/><path d="M215 210Q225 255 247 269L272 210Z" fill="#b4a177"/><path d="M388 175L414 236L444 175Z" fill="#a79c76"/><path d="M310 257L350 257L342 270H318Z" fill="#455f57"/><path d="M329 249V216L348 249Z" fill="#eee6c8"/>`;
  if (scene === 'garden' || scene === 'forest') {
    art = `<circle cx="435" cy="106" r="36" fill="#e4d8a6"/><path d="M70 271Q190 170 320 247Q450 170 580 267V300H70Z" fill="#6f8b64" opacity=".6"/>`;
    for (let i = 0; i < 7; i++)
      art += leaf(
        115 + i * 67,
        167 + (i % 2) * 37,
        0.8 + (i % 3) * 0.15,
        scene === 'forest'
          ? ['#3d6855', '#55795b', '#66895e'][i % 3]
          : ['#7d9367', '#9aab75', '#536e50'][i % 3],
      );
    if (scene === 'garden')
      for (let i = 0; i < 4; i++)
        art += `<path d="M${185 + i * 75} 270V${176 + (i % 2) * 20}" stroke="#5a7750" stroke-width="4"/><circle cx="${185 + i * 75}" cy="${176 + (i % 2) * 20}" r="17" fill="${i % 2 ? '#deaa8d' : '#eee0a2'}"/><circle cx="${185 + i * 75}" cy="${176 + (i % 2) * 20}" r="6" fill="#b39054"/>`;
  }
  if (scene === 'town') {
    art = `<circle cx="430" cy="90" r="34" fill="#e9d4a0"/><path d="M110 284Q300 220 535 284" fill="none" stroke="#efe2c8" stroke-width="19"/>`;
    for (let i = 0; i < 5; i++) {
      const x = 108 + i * 84,
        y = 155 + (i % 2) * -27;
      art += `<path d="M${x} ${y}L${x + 38} ${y - 36}L${x + 75} ${y}V275H${x}Z" fill="${['#ae886d', '#ba9775', '#8d8d72'][i % 3]}"/><path d="M${x - 4} ${y}L${x + 38} ${y - 36}L${x + 79} ${y}" fill="none" stroke="#725d4e" stroke-width="9"/><rect x="${x + 28}" y="${y + 24}" width="21" height="36" rx="10" fill="#e6d9b6"/>`;
    }
    art += `<path d="M308 272Q360 240 430 266" fill="none" stroke="#6f7460" stroke-width="2" stroke-dasharray="4 6"/>`;
  }
  if (scene === 'train' || scene === 'ship') {
    art = `<circle cx="420" cy="101" r="50" fill="#eed2a1"/><path d="M60 230L195 140L315 229L425 170L580 245V295H60Z" fill="#a28e70" opacity=".55"/><path d="M70 258Q300 215 570 275" fill="none" stroke="#f1d9b8" stroke-width="28"/>`;
    if (scene === 'train') {
      for (let i = 0; i < 3; i++)
        art += `<rect x="${184 + i * 80}" y="185" width="75" height="53" rx="4" fill="#6d7763"/><rect x="${194 + i * 80}" y="195" width="20" height="18" fill="#e7d3a4"/><rect x="${220 + i * 80}" y="195" width="20" height="18" fill="#e7d3a4"/><circle cx="${201 + i * 80}" cy="240" r="9" fill="#4d5a4e"/><circle cx="${242 + i * 80}" cy="240" r="9" fill="#4d5a4e"/>`;
    } else
      art += `<path d="M210 245H440L405 279H245Z" fill="#466b6b"/><path d="M315 239V111L244 232H309M324 127L415 235H324" fill="#eee5ca" stroke="#5b7370" stroke-width="3"/>`;
  }
  if (scene === 'stars' || scene === 'planet') {
    art = `<circle cx="325" cy="180" r="91" fill="${scene === 'planet' ? '#799b7c' : '#7c839f'}"/><path d="M254 147Q310 100 346 145T393 175Q370 220 338 205T281 250Q237 210 254 147" fill="${scene === 'planet' ? '#c6d1a9' : '#a4adc4'}"/><ellipse cx="325" cy="185" rx="145" ry="38" fill="none" stroke="${cream}" stroke-width="8" transform="rotate(-20 325 185)"/>`;
    for (const [x, y, s] of [
      [165, 113, 14],
      [475, 190, 20],
      [420, 65, 9],
      [180, 258, 8],
      [510, 100, 7],
    ])
      art += star(x, y, s, cream);
  }
  if (scene === 'shapes')
    art = `<circle cx="220" cy="185" r="69" fill="#d3876d"/><path d="M310 89L420 264H200Z" fill="#6d8877" opacity=".9"/><rect x="355" y="145" width="118" height="118" rx="10" transform="rotate(15 414 204)" fill="#e7c37f"/><circle cx="405" cy="178" r="20" fill="${cream}"/>${star(160, 90, 20, cream)}`;
  if (scene === 'map')
    art = `<path d="M150 110L260 80L370 118L480 86V270L370 294L260 258L150 290Z" fill="${cream}"/><path d="M260 80V258M370 118V294" stroke="#b5ad85" stroke-width="2"/><path d="M190 230Q280 120 315 215T430 155" fill="none" stroke="#8c9a72" stroke-width="4" stroke-dasharray="7 7"/><path d="M418 144L444 168M442 144L418 168" stroke="#b47b5d" stroke-width="6"/><path d="M177 152L202 112L227 152Z" fill="#8fa079"/>`;
  const titleSize = title.length > 20 ? 29 : title.length > 15 ? 34 : 40;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="440" viewBox="0 0 640 440"><defs><pattern id="grain" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="2" cy="4" r=".6" fill="#243f36" opacity=".08"/><circle cx="9" cy="11" r=".5" fill="#fff" opacity=".3"/></pattern></defs><rect width="640" height="440" fill="${bg}"/><rect x="27" y="25" width="586" height="390" rx="2" fill="none" stroke="${cream}" opacity=".45"/><text x="320" y="58" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" font-size="10" letter-spacing="4" fill="#354c40" opacity=".7">B O A R D G A M E   S T U D I O</text>${art}<text x="320" y="352" text-anchor="middle" fill="#304b3f" font-family="Cambria,Georgia,serif" font-size="${titleSize}" letter-spacing="1">${title}</text><path d="M280 372H360" stroke="#3c5844" opacity=".5"/><text x="320" y="396" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" font-size="9" letter-spacing="3" fill="#3b5443">MỘT VÁN CHƠI · NHIỀU KẾT NỐI</text><rect width="640" height="440" fill="url(#grain)"/></svg>`;
  await writeFile(new URL(`${id}.svg`, output), svg);
}
await writeFile(
  new URL('../public/favicon.svg', import.meta.url),
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#234e40"/><g fill="#f1edda"><circle cx="19" cy="19" r="5"/><circle cx="45" cy="19" r="5"/><circle cx="32" cy="32" r="5"/><circle cx="19" cy="45" r="5"/><circle cx="45" cy="45" r="5"/></g></svg>',
);
console.log(`Created ${covers.length} original game illustrations.`);
