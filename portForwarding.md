# 🌐 192 대역에서 서버공유를 위한 포트포워딩 설정방법

WSL(Windows Subsystem for Linux) 환경에서 Node.js 서버가 `localhost:4000` 으로만 접근 가능한 경우,  
Windows 네트워크(192.168.x.x)에서도 접근 가능하도록 포트포워딩을 설정합니다.

---

## 1. WSL 내 로컬 IP 확인 (WSL 내부 콘솔)

```bash
hostname -I
```

예시 출력:
```
172.26.96.110
```

> 이 IP는 WSL을 재시작할 때마다 바뀔 수 있습니다..  
> 서버를 다시 실행할 때마다 `hostname -I` 로 확인 후 아래 명령의 IP를 갱신하세요.

---

## 2. Windows PowerShell (관리자 권한)에서 포트포워딩 설정

```powershell
netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=4000 connectaddress=172.26.96.110 connectport=4000
```

**옵션 설명**

| 옵션 | 설명 |
|------|------|
| `listenaddress=0.0.0.0` | 모든 외부 요청 허용 |
| `listenport=4000` | Windows에서 수신할 포트 |
| `connectaddress=172.26.96.110` | WSL 내부 IP (1단계에서 확인한 IP 입력) |
| `connectport=4000` | WSL에서 Node 서버가 사용하는 포트 |

**요약:**  
외부 기기 → `192.168.0.191:4000` → (자동 포워딩) → `172.26.96.110:4000`

---

## 3. Windows 방화벽 인바운드 규칙 추가

1. **제어판 → Windows Defender 방화벽 → 고급 설정**  
2. 좌측 메뉴에서 **인바운드 규칙 → 새 규칙** 선택  
3. **규칙 유형:** 포트  
4. **프로토콜:** TCP  
5. **포트 번호:** `4000`  
6. **연결 허용**  
7. **이름:** `WSL Node.js 4000` (예시임. 아무거나 해도 상관 X)

또는 PowerShell로 간단히 추가:

```powershell
netsh advfirewall firewall add rule name="WSL Node.js 4000" dir=in action=allow protocol=TCP localport=4000
```

---

## 4. 브라우저 접속 테스트

같은 네트워크(192.168.x.x 대역)의 다른 기기에서 브라우저로 다음 주소 입력:

```bash
http://192.168.0.191:4000/
```

또는 API 엔드포인트 예시:

```bash
http://192.168.0.191:4000/api/stores
```

> JSON 응답이 표시되면 외부에서 WSL 서버 접근이 성공적으로 이루어진 것입니다.

---

## 5️⃣ 참고 명령어

**현재 설정 확인**
```powershell
netsh interface portproxy show all
```

**설정 삭제**
```powershell
netsh interface portproxy delete v4tov4 listenport=4000 listenaddress=0.0.0.0
```

---
## 요약 표

| 단계 | 설명 | 명령어 |
|------|------|---------|
| 1 | WSL 내부 IP 확인 | `hostname -I` |
| 2 | 포트포워딩 등록 | `netsh interface portproxy add ...` |
| 3 | 방화벽 허용 | `netsh advfirewall firewall add rule ...` |
| 4 | 접속 테스트 | `http://192.168.0.191:4000` |
| 5 | 설정 확인/삭제 | `netsh interface portproxy show all` / `delete` |
---
