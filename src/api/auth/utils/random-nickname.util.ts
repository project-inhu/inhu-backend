const nameList: string[] = [
  '하늘', '구름', '바람', '태양', '달', '별', '은하', '우주', '빛', '어둠',
  '숲', '강', '바다', '산', '불꽃', '얼음', '폭풍', '천둥', '번개', '눈꽃',
  '소나기', '비', '무지개', '꿈', '행복', '슬픔', '희망', '운명', '용',
  '호랑이', '늑대', '사자', '독수리', '거북이', '펭귄', '물개', '코끼리',
  '여우', '곰', '고양이', '강아지', '토끼', '사막', '하늘빛', '노을',
  '밤하늘', '파도', '모래', '바위', '나무', '잎새', '꽃', '향기', '노래',
  '춤', '사랑', '전설', '미래', '과거', '여행', '모험', '전사', '마법사',
  '왕', '여왕', '기사', '영웅', '선비', '도깨비', '요정', '천사', '악마',
  '별빛', '달빛', '섬광', '폭발', '흐름', '강물', '하늘길', '바람길',
];

// 랜덤 닉네임 생성 후 return
export function generateRandomNickname(): string {
    const firstIndex = Math.floor(Math.random() * nameList.length);
    let secondIndex = Math.floor(Math.random() * nameList.length);
    
    while (secondIndex == firstIndex) {
        secondIndex = Math.floor(Math.random() * nameList.length);
    }

    return nameList[firstIndex] + nameList[secondIndex];
}
