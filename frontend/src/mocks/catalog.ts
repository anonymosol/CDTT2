import type { Game, LearnMaterial, UserGame } from '../api/models';

// Original fictional concepts, not facts about commercially published games.
export const games: Game[] = [
  {
    id: 'dao-may',
    name: 'Đảo Mây',
    tagline: 'Cùng nhau đi tìm miền trời mới',
    minPlayers: 2,
    maxPlayers: 4,
    duration: 30,
    weight: 1.5,
    minAge: 8,
    genres: ['Hợp tác', 'Gia đình'],
    mechanics: ['Thu thập', 'Phối hợp'],
    color: '#adc3c0',
    featured: true,
    hasRules: true,
    description:
      'Kết nối những hòn đảo giữa tầng mây. Cả nhóm cùng chọn đường đi, chia sẻ tài nguyên và đưa con thuyền trở về trước cơn gió cuối mùa.',
  },
  {
    id: 'vuon-ky-uc',
    name: 'Vườn Ký Ức',
    tagline: 'Gieo một hạt, kể một câu chuyện',
    minPlayers: 2,
    maxPlayers: 5,
    duration: 25,
    weight: 1.2,
    minAge: 6,
    genres: ['Gia đình', 'Nhẹ nhàng'],
    mechanics: ['Ghép cặp', 'Ghi nhớ'],
    color: '#c9cfb3',
    featured: true,
    hasRules: true,
    description:
      'Một khu vườn nhỏ cất giữ những ký ức đẹp. Lật thẻ, tìm những cặp hoa và cùng nhau tạo nên khu vườn của riêng bạn.',
  },
  {
    id: 'mat-ma-pho-co',
    name: 'Mật Mã Phố Cổ',
    tagline: 'Mỗi con phố giấu một lời giải',
    minPlayers: 3,
    maxPlayers: 6,
    duration: 45,
    weight: 2.5,
    minAge: 12,
    genres: ['Suy luận', 'Hợp tác'],
    mechanics: ['Giải mã', 'Trao đổi'],
    color: '#d4bb99',
    featured: true,
    hasRules: true,
    description:
      'Những mảnh thư dẫn bạn qua một khu phố cổ tưởng tượng. Kết nối gợi ý và phối hợp suy luận để mở chiếc hộp bí mật.',
  },
  {
    id: 'chuyen-tau-hoang-hon',
    name: 'Chuyến Tàu Hoàng Hôn',
    tagline: 'Một hành trình đáng để chậm lại',
    minPlayers: 2,
    maxPlayers: 4,
    duration: 60,
    weight: 2.8,
    minAge: 10,
    genres: ['Chiến thuật', 'Gia đình'],
    mechanics: ['Xây tuyến', 'Quản lý tài nguyên'],
    color: '#d6a98d',
    featured: true,
    hasRules: false,
    description:
      'Lựa chọn những ga dừng và nối các thành phố. Mỗi hành trình mang về một câu chuyện và những điểm số khác nhau.',
  },
  {
    id: 'rung-thi-tham',
    name: 'Rừng Thì Thầm',
    tagline: 'Lắng nghe để tìm thấy nhau',
    minPlayers: 2,
    maxPlayers: 4,
    duration: 35,
    weight: 1.8,
    minAge: 8,
    genres: ['Hợp tác', 'Nhẹ nhàng'],
    mechanics: ['Khám phá', 'Phối hợp'],
    color: '#819b87',
    featured: true,
    hasRules: false,
    description:
      'Dõi theo dấu chân những người bạn nhỏ trong rừng. Kết hợp các manh mối và đưa tất cả trở về trước khi màn đêm buông xuống.',
  },
  {
    id: 'bua-tiec-sao',
    name: 'Bữa Tiệc Sao',
    tagline: 'Càng đông, càng nhiều tiếng cười',
    minPlayers: 4,
    maxPlayers: 8,
    duration: 20,
    weight: 1,
    minAge: 8,
    genres: ['Tiệc nhóm', 'Sáng tạo'],
    mechanics: ['Liên tưởng', 'Kể chuyện'],
    color: '#aaa8c4',
    featured: true,
    hasRules: false,
    description:
      'Những chủ đề bất ngờ và các câu trả lời không ai đoán trước. Một trò chơi tưởng tượng dành cho buổi gặp mặt đông người.',
  },
  {
    id: 'thuong-cang',
    name: 'Thương Cảng',
    tagline: 'Mỗi chuyến hàng là một lựa chọn',
    minPlayers: 2,
    maxPlayers: 4,
    duration: 90,
    weight: 3.5,
    minAge: 12,
    genres: ['Chiến thuật'],
    mechanics: ['Giao thương', 'Quản lý tài nguyên'],
    color: '#9db5bb',
    hasRules: false,
    description:
      'Xây dựng một thương cảng, thương lượng các chuyến hàng và cân bằng nguồn lực trong một thành phố bên biển.',
  },
  {
    id: 'hanh-tinh-nho',
    name: 'Hành Tinh Nhỏ',
    tagline: 'Xây một thế giới đủ chỗ cho tất cả',
    minPlayers: 1,
    maxPlayers: 4,
    duration: 40,
    weight: 2,
    minAge: 8,
    genres: ['Hợp tác', 'Gia đình'],
    mechanics: ['Xếp ô', 'Xây dựng'],
    color: '#b8c7b5',
    hasRules: false,
    description:
      'Ghép những mảnh đất, rừng và dòng sông thành một hành tinh sống động. Có thể chơi một mình hoặc cùng bạn bè.',
  },
  {
    id: 'xuong-sac-mau',
    name: 'Xưởng Sắc Màu',
    tagline: 'Tự do tạo nên điều khác biệt',
    minPlayers: 2,
    maxPlayers: 6,
    duration: 30,
    weight: 1.3,
    minAge: 6,
    genres: ['Sáng tạo', 'Gia đình'],
    mechanics: ['Vẽ', 'Liên tưởng'],
    color: '#d9b5a3',
    hasRules: false,
    description:
      'Kết hợp các hình khối và màu sắc để diễn tả những ý tưởng mới. Mỗi lượt chơi là một tác phẩm nhỏ.',
  },
  {
    id: 'ban-do-kho-bau',
    name: 'Bản Đồ Kho Báu',
    tagline: 'Điều quý giá nằm trên hành trình',
    minPlayers: 2,
    maxPlayers: 5,
    duration: 45,
    weight: 2,
    minAge: 8,
    genres: ['Chiến thuật', 'Suy luận'],
    mechanics: ['Khám phá', 'Ẩn thông tin'],
    color: '#c3b88e',
    hasRules: false,
    description:
      'Lần theo dấu những mảnh bản đồ và tìm đường qua các hòn đảo. Bạn sẽ chia sẻ gợi ý hay giữ bí mật cho riêng mình?',
  },
  {
    id: 'mua-thu-hoach',
    name: 'Mùa Thu Hoạch',
    tagline: 'Một mùa vui trên cánh đồng nhỏ',
    minPlayers: 2,
    maxPlayers: 4,
    duration: 30,
    weight: 1.5,
    minAge: 8,
    genres: ['Gia đình', 'Nhẹ nhàng'],
    mechanics: ['Thu thập', 'Xếp bộ'],
    color: '#d1c38a',
    hasRules: false,
    description:
      'Gieo trồng, chăm sóc và thu hoạch rau củ. Sắp xếp các bộ thẻ để có một mùa bội thu trong nông trại nhỏ.',
  },
  {
    id: 'dem-ke-chuyen',
    name: 'Đêm Kể Chuyện',
    tagline: 'Mỗi người một mảnh, cùng thành câu chuyện',
    minPlayers: 3,
    maxPlayers: 8,
    duration: 25,
    weight: 1,
    minAge: 8,
    genres: ['Tiệc nhóm', 'Sáng tạo'],
    mechanics: ['Kể chuyện', 'Liên tưởng'],
    color: '#8b9aab',
    hasRules: false,
    description:
      'Từ những thẻ hình ảnh ngẫu nhiên, cùng nối tiếp một câu chuyện. Không có đáp án chuẩn, chỉ có những bất ngờ.',
  },
].map((game) => ({ ...game, imageUrl: `/games/${game.id}.svg` }));

export const genres = [
  'Hợp tác',
  'Gia đình',
  'Chiến thuật',
  'Tiệc nhóm',
  'Suy luận',
  'Nhẹ nhàng',
  'Sáng tạo',
];
export const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
export function filterGames(catalog: Game[], params: URLSearchParams) {
  let result = catalog.filter((game) => {
    const players = Number(params.get('players')),
      time = Number(params.get('time')),
      weight = Number(params.get('weight'));
    return (
      (!players ||
        (game.minPlayers !== undefined &&
          game.maxPlayers !== undefined &&
          game.minPlayers <= players &&
          game.maxPlayers >= players)) &&
      (!time || (game.duration !== undefined && game.duration <= time)) &&
      (!weight || (game.weight !== undefined && game.weight <= weight)) &&
      (!params.get('genre') || game.genres?.includes(params.get('genre')!)) &&
      (!params.get('q') ||
        normalize(`${game.name} ${game.description ?? ''}`).includes(normalize(params.get('q')!)))
    );
  });
  if (params.get('sort') === 'name')
    result = [...result].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  if (params.get('sort') === 'duration')
    result = [...result].sort((a, b) => (a.duration ?? Infinity) - (b.duration ?? Infinity));
  return result;
}
export function mergeRecords(account: UserGame[], guest: UserGame[]): UserGame[] {
  const result = new Map(account.map((record) => [record.gameId, record]));
  for (const incoming of guest) {
    const saved = result.get(incoming.gameId);
    result.set(
      incoming.gameId,
      saved
        ? {
            ...saved,
            played: saved.played || incoming.played,
            owned: saved.owned || incoming.owned,
            wishlist: saved.wishlist || incoming.wishlist,
            disliked: saved.disliked || incoming.disliked,
            rating: saved.rating ?? incoming.rating,
            notes: saved.notes || incoming.notes,
          }
        : incoming,
    );
  }
  return [...result.values()];
}
export function sampleRecommendations(query: string, excludedIds: string[]) {
  const normalized = normalize(query);
  const players = normalized.match(/(\d+)\s*(nguoi|ban)/)?.[1];
  const minutes = normalized.match(/(\d+)\s*phut/)?.[1];
  const hours = normalized.match(/(\d+(?:[.,]\d+)?)\s*(tieng|gio)/)?.[1];
  const genre = normalized.includes('hop tac')
    ? 'Hợp tác'
    : normalized.includes('chien thuat')
      ? 'Chiến thuật'
      : normalized.includes('gia dinh')
        ? 'Gia đình'
        : normalized.includes('tiec')
          ? 'Tiệc nhóm'
          : undefined;
  const params = new URLSearchParams();
  if (players) params.set('players', players);
  if (minutes || hours)
    params.set('time', minutes ?? String(Number(hours!.replace(',', '.')) * 60));
  if (normalized.includes('nguoi moi') || normalized.includes('de choi')) params.set('weight', '2');
  if (genre) params.set('genre', genre);
  const matches = filterGames(games, params)
    .filter((game) => !excludedIds.includes(game.id))
    .slice(0, 5);
  const interpretation = [...params.entries()]
    .map(([key, value]) =>
      key === 'players'
        ? `${value} người`
        : key === 'time'
          ? `tối đa ${value} phút`
          : key === 'weight'
            ? 'dễ làm quen'
            : value,
    )
    .join(' · ');
  return {
    mode: 'demo' as const,
    interpretation:
      interpretation || 'Chưa nhận diện điều kiện cụ thể; đây là các game mẫu để khám phá.',
    items: matches.map((game) => ({
      game,
      reason: `${game.name} dành cho ${game.minPlayers}–${game.maxPlayers} người, khoảng ${game.duration} phút; phù hợp trải nghiệm ${(game.genres ?? []).join(', ').toLowerCase()}.`,
    })),
  };
}
export const learning: Record<string, LearnMaterial> = {
  'dao-may': {
    title: 'Làm quen với Đảo Mây',
    source: 'Luật minh họa do nhóm tự biên soạn, phiên bản 0.1 (2026). Đây là game mẫu.',
    setup: [
      'Đặt 9 thẻ đảo thành lưới 3 × 3.',
      'Đặt thuyền ở đảo góc trái và 6 thẻ gió ở cạnh bàn.',
      'Mỗi người nhận 2 thẻ tài nguyên.',
    ],
    sections: [
      {
        heading: 'Mục tiêu chung',
        text: 'Cả nhóm cùng đưa thuyền đến đảo đích ở góc đối diện trước khi dùng hết 6 thẻ gió.',
      },
      {
        heading: 'Một lượt chơi',
        text: 'Đến lượt, chọn lấy 1 tài nguyên hoặc dùng 2 tài nguyên để di chuyển thuyền sang một đảo kề cạnh. Sau mỗi vòng, lật 1 thẻ gió.',
      },
      {
        heading: 'Kết thúc',
        text: 'Thuyền đến đảo đích: cả nhóm thắng. Hết thẻ gió khi chưa đến đích: cả nhóm cùng thử lại. Luật mẫu này không có cơ chế loại người chơi.',
      },
    ],
  },
  'vuon-ky-uc': {
    title: 'Làm quen với Vườn Ký Ức',
    source: 'Luật minh họa do nhóm tự biên soạn, phiên bản 0.1 (2026). Đây là game mẫu.',
    setup: [
      'Trộn 24 thẻ gồm 12 cặp hoa.',
      'Úp thành lưới 4 × 6.',
      'Chọn người bắt đầu và chơi theo chiều kim đồng hồ.',
    ],
    sections: [
      { heading: 'Mục tiêu', text: 'Tìm được nhiều cặp hoa giống nhau nhất.' },
      {
        heading: 'Một lượt chơi',
        text: 'Lật 2 thẻ. Nếu giống nhau, giữ cặp thẻ và kết thúc lượt. Nếu khác nhau, cho mọi người nhìn rồi úp lại đúng vị trí.',
      },
      {
        heading: 'Kết thúc',
        text: 'Khi hết thẻ trên bàn, mỗi cặp có giá trị 1 điểm. Người có nhiều điểm nhất thắng; bằng điểm thì cùng thắng.',
      },
    ],
  },
  'mat-ma-pho-co': {
    title: 'Làm quen với Mật Mã Phố Cổ',
    source: 'Luật minh họa do nhóm tự biên soạn, phiên bản 0.1 (2026). Đây là game mẫu.',
    setup: [
      'Chuẩn bị 6 thẻ câu đố do cả nhóm thống nhất trước.',
      'Đặt 6 token thời gian giữa bàn.',
      'Chọn một người đọc gợi ý.',
    ],
    sections: [
      {
        heading: 'Mục tiêu',
        text: 'Cả nhóm giải đúng 6 câu đố trước khi dùng hết token thời gian.',
      },
      {
        heading: 'Một lượt chơi',
        text: 'Người đọc đưa ra một câu đố. Cả nhóm thảo luận rồi chốt một đáp án. Sai đáp án sẽ mất 1 token thời gian; đúng thì chuyển câu tiếp theo.',
      },
      {
        heading: 'Kết thúc',
        text: 'Giải đủ 6 câu thì cả nhóm thắng. Khi không còn token, nhóm kết thúc và xem lại lời giải. Đây chỉ là kịch bản minh họa giao diện.',
      },
    ],
  },
};
