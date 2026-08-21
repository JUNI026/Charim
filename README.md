# CHARIM · 차림

> 가지고 있는 재료로 오늘의 한 끼를 차리다.

CHARIM은 냉장고 속 재료를 바탕으로 지금 만들기 좋은 한식을 제안하는 반응형 웹앱입니다. 2021년 팀 프로젝트 **Ghost CookKing**에서 얻은 문제의식을 바탕으로, 제품 구조와 코드, 디자인을 새롭게 작성하는 개인 리뉴얼 프로젝트입니다.

## 주요 기능

- 보유 재료 선택 및 브라우저 기반 레시피 추천
- 재료 일치율과 부족한 재료 계산
- 요리 종류·검색어 필터
- 단계별 조리법과 영양정보
- 즐겨찾기와 재료 목록 로컬 저장
- GitHub Pages 자동 배포

## 시작하기

```bash
npm install
npm run dev
```

테스트와 프로덕션 빌드:

```bash
npm test
npm run build
```

## 데이터 출처

레시피 데이터는 [식품의약품안전처 공공데이터](https://www.foodsafetykorea.go.kr/apiMain.do)를 웹 환경에 맞게 정제해 사용합니다. 초기 아이디어의 출처인 [Bulgogi-Warriors](https://github.com/alws78/Bulgogi-Warriors) 저장소의 공동 작업 이력은 원본에서 확인할 수 있습니다.
