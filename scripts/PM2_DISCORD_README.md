# PM2 Discord Monitor

PM2에서 발생하는 에러, 프로세스 상태 변화 등을 Discord로 실시간 알림받는 모듈입니다.

## 동작 방식

- PM2가 관리하는 프로세스들을 모니터링
- 에러, 시작/중지, 재시작 등의 이벤트 감지
- Discord Embed 형태로 예쁘게 포맷하여 알림 전송
- 메시지 큐와 속도 제한으로 스팸 방지

## 현재 설정

```javascript
// 기본 활성화된 이벤트들
- error: true      // 에러 로그 (🚨)
- exception: true  // 예외 발생 (🚨)
- kill: true       // PM2 종료 (🔴)

// 기본 비활성화된 이벤트들
- stop: true       // 프로세스 중지 (🔴)
- log: false       // 일반 로그 (📝)
- start: false     // 프로세스 시작 (🟢)
- online: false    // 프로세스 온라인 (🟢)
- restart: false   // 프로세스 재시작 (🔄)
- delete: false    // 프로세스 삭제 (❌)

// 큐 설정
- buffer_seconds: 1초   // 메시지 버퍼링 시간
- queue_max: 100개      // 최대 큐 크기 (초과시 속도제한)
```

> ⚠️ **참고**: 설정을 바꾸게 된다면 반드시 팀원과 상의를 해야 됩니다.

## 간단한 사용법

1. **Discord Webhook URL 설정**

```bash
pm2 set pm2-discord:discord_url https://discord.com/api/webhooks/your-webhook-url
```

2. **필요한 이벤트만 켜기** (선택사항)

```bash
pm2 set pm2-discord:log true        # 일반 로그도 받고 싶다면
pm2 set pm2-discord:start true      # 프로세스 시작 알림도 받고 싶다면
```

3. **모듈 설치 및 시작**

```bash
pm2 install pm2-discord
```

## 프로젝트 정책

**✨ PM2가 모든 에러와 프로세스 상태를 자동으로 Discord에 알림합니다.**

- 프로세스 크래시/예외 → 자동으로 Discord 전송
- 프로세스 시작/중지/재시작 → 자동으로 Discord 전송
- **별도의 Discord 알림 코드 작성 불필요**

> ⚠️ **참고**: 향후 더 나은 에러 처리 및 모니터링 방식이 도입되면 이 정책은 변경될 수 있습니다.

## Discord에서 보이는 형태

````
# **🚨 ERROR**

Error in **your-process-name**

┌─ Error Message
│ ```
│ Your error message here
│ ```
├─ Time: 2025-01-09 14:30:25
└─ Process: your-process-name
````

---

_자동으로 PM2 프로세스 상태를 모니터링하고 Discord로 알림을 보냅니다._
