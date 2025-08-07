# Scripts

이 디렉토리는 프로젝트의 다양한 환경별 스크립트들을 포함합니다.

## 디렉토리 구조

```
scripts/
├── apps/                  # 로컬 개발용 애플리케이션별 스크립트
│   ├── admin-server/      # Admin Server 로컬 개발 스크립트
│   │   ├── dev/          # 로컬 개발 환경 설정
│   │   └── e2e-test/     # 로컬 E2E 테스트 환경 설정
│   └── user-server/       # User Server 로컬 개발 스크립트
│       ├── dev/          # 로컬 개발 환경 설정
│       └── e2e-test/     # 로컬 E2E 테스트 환경 설정
├── rdb/                   # 데이터베이스 관련 스크립트
│   ├── ddl.sql           # 데이터베이스 스키마 정의
│   └── default-seed.sql  # 기본 시드 데이터
└── dev-infra/            # 개발 서버(라즈베리파이) 통합 배포용
    ├── docker-compose.yml # 통합 서비스 Docker Compose 설정
    └── init/
        └── init.sql      # 데이터베이스 초기화 스크립트
```

## 환경별 구성

### �️ 로컬 개발 환경 (`apps/`)

로컬에서 개별 서버를 실행하고 테스트하기 위한 스크립트들

#### 📁 apps/admin-server/

- **dev/**: Admin Server만 로컬에서 실행하기 위한 설정
- **e2e-test/**: Admin Server E2E 테스트를 위한 독립적인 환경 설정

#### 📁 apps/user-server/

- **dev/**: User Server만 로컬에서 실행하기 위한 설정
- **e2e-test/**: User Server E2E 테스트를 위한 독립적인 환경 설정

### 🍓 개발 서버 환경 (`dev-infra/`)

라즈베리파이 개발 서버에 Admin Server와 User Server를 통합 배포하기 위한 설정

- **docker-compose.yml**: Admin Server + User Server + 데이터베이스를 함께 실행하는 통합 구성
- **init/init.sql**: 개발 서버 데이터베이스 초기화 스크립트

### 🗄️ 데이터베이스 (`rdb/`)

모든 환경에서 공통으로 사용하는 데이터베이스 스크립트

- **ddl.sql**: 테이블 스키마 정의
- **default-seed.sql**: 기본 마스터 데이터 (장소 타입, 키워드 등)

## 사용법

### 🖥️ 로컬 개발

개별 서버를 로컬에서 실행하고 테스트할 때

```bash
# Admin Server 로컬 개발 환경
npm run admin-server:dev:infra:up
npm run admin-server:dev

# User Server 로컬 개발 환경
npm run user-server:dev:infra:up
npm run user-server:dev

# 로컬 E2E 테스트
npm run admin-server:test:infra:up
npm run admin-server:test:e2e
npm run admin-server:test:infra:down

npm run user-server:test:infra:up
npm run user-server:test:e2e
npm run user-server:test:infra:down
```

### 🍓 개발 서버 통합 배포

라즈베리파이에 Admin Server + User Server를 함께 배포할 때

```bash
# dev-infra의 docker-compose.yml 사용
docker-compose -f scripts/dev-infra/docker-compose.yml up -d

# 또는 npm 스크립트가 있다면
npm run dev-infra:up
```

### 🗄️ 데이터베이스 관리

```bash
# 시드 데이터 주입
npm run seed
```

## 주의사항

- **로컬 개발**: `apps/` 내의 스크립트는 개별 서버 개발 시에만 사용
- **개발 서버**: `dev-infra/`는 라즈베리파이에 통합 배포용으로 설계 (Docker 기반)
- **운영 환경**: PostgreSQL, Redis는 서버에 직접 설치하여 사용 (Docker 사용 안 함)
- **데이터베이스**: 스키마 변경 시 신중하게 실행
