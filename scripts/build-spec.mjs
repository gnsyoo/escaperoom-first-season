import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sources = ['01_GAME_DESIGN.md','02_CHAPTER01_SPEC.md','03_ART_UI_GUIDE.md','04_TECH_SPEC.md','05_AI_IMPLEMENTATION_TASKS.md','06_QA_CHECKLIST.md','07_UI_IMPLEMENTATION.md','08_SEASON_CH02_CH10.md','09_STORY_UX_QUALITY.md','10_GRAPHICAL_MAP_MENU.md','11_PROLOGUE_FEEDBACK_VALVE.md','12_SHARED_EXPLORATION_UI.md', ...Array.from({length:9},(_,i)=>`chapters/CH${String(i+2).padStart(2,'0')}_STORY_PUZZLES_UI.md`)];
const parts = [
  '# 표류도 시즌 1 통합 개발 명세서',
  '웹에서 먼저 실행하고 모바일 앱으로 확장하는 미스터리 방탈출 게임의 제작 기준이다. 검은방 3의 전반적인 분위기만 참고하며 그래픽은 현대적인 고해상도 2D로 제작한다. 세계관과 인물, 10챕터 205단계, 그래픽과 UI, React 및 TypeScript 기술 구조, 개발 작업 및 검증 결과, 인트로와 두 퍼즐 JSON 원본을 포함한다. 작성 기준일은 2026년 10월 4일이다.',
  '현재 1장부터 10장과 세 엔딩, 대화·인벤토리·수첩·지도·설정·저장을 구현했다. 최신 기준은 08_SEASON_CH02_CH10.md, 09_STORY_UX_QUALITY.md, 10_GRAPHICAL_MAP_MENU.md, 11_PROLOGUE_FEEDBACK_VALVE.md, 12_SHARED_EXPLORATION_UI.md이며 01~07의 초기 계획 및 제작 이력보다 우선한다. 기존 구현을 읽고 후속 개발을 이어간다. 사용자 최신 지시와 원본 JSON이 우선이며 이 통합본은 읽기용 사본이다. 수정은 개별 문서와 data/prologue.json, data/ch01.puzzles.json, data/season.chapters.json에 적용하고 node scripts/build-spec.mjs로 다시 생성한다.',
  '## 원문 파일',
  sources.map(name => `- [${name}](${name})`).join('\n') + '\n- [인트로 JSON](../data/prologue.json)\n- [1장 퍼즐 JSON](../data/ch01.puzzles.json)\n- [2~10장 퍼즐 JSON](../data/season.chapters.json)',
];
for (const source of sources) {
  const body = readFileSync(resolve(root, 'docs', source), 'utf8').trim();
  parts.push(body.replace(/^(#{1,5}) /gm, '$1# '));
}
for (const file of ['prologue.json','ch01.puzzles.json','season.chapters.json']) parts.push(`## 기계 판독 콘텐츠 데이터: ${file}`, `다음 JSON은 data/${file}의 전체 내용이다. 원문을 import해 사용하고 정답이나 보상을 UI에 따로 복제하지 않는다.`, '```json\n' + readFileSync(resolve(root, 'data',file), 'utf8').trim() + '\n```');
const output = parts.join('\n\n') + '\n';
writeFileSync(resolve(root, 'docs/00_MASTER_SPEC.md'), output, 'utf8');
console.log(`Generated docs/00_MASTER_SPEC.md (${Buffer.byteLength(output)} UTF-8 bytes).`);
