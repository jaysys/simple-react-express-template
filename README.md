Apple Silicon Mac (M1, M2 등)
맥에서 React.js를 사용하여 반응형 웹 애플리케이션을 만들고, Nginx를 웹 서버로 사용하며 별도의 WAS(Web Application Server)를 구성하는 방법을 단계별로 설명해 드리겠습니다.
1. React.js 프로젝트 설정:
   a. Node.js 설치 (없다면):
      ```
      brew install node
      ```
   b. React 프로젝트 생성:
      ```
      npx create-react-app my-responsive-app
      cd my-responsive-app
      ```
2. 반응형 웹 구현:
   a. src/App.js 파일을 수정하여 간단한 UI 구성:
   ```jsx
   import React, { useState } from 'react';
   import './App.css';
   function App() {
     const [inputValue, setInputValue] = useState('');
     const handleSubmit = (e) => {
       e.preventDefault();
       alert(inputValue);
     };
     return (
       <div className="App">
         <form onSubmit={handleSubmit}>
           <input
             type="text"
             value={inputValue}
             onChange={(e) => setInputValue(e.target.value)}
             placeholder="텍스트를 입력하세요"
           />
           <button type="submit">확인</button>
         </form>
       </div>
     );
   }
   export default App;
   ```
   b. src/App.css 파일에 반응형 스타일 추가:
   ```css
   .App {
     display: flex;
     flex-direction: column;
     justify-content: center;
     align-items: center;
     height: 100vh;
   }
   form {
     display: flex;
     flex-direction: column;
     width: 80%;
     max-width: 300px;
   }
   input, button {
     margin: 10px 0;
     padding: 10px;
     font-size: 16px;
   }
   @media (max-width: 600px) {
     form {
       width: 90%;
     }
   }
   ```
3. 프로젝트 빌드:
   ```
   npm run build
   ```
4. Nginx 설치 및 설정:
   a. Nginx 설치:
      ```
      brew install nginx
      ```
   b. Nginx 설정 파일 수정 (/opt/homebrew/etc/nginx/nginx.conf):
   ```nginx
   http {
     server {
       listen 80;
       server_name localhost;
       location / {
         root /path/to/your/react/build;
         index index.html;
         try_files $uri $uri/ /index.html;
       }
       location /api/ {
         proxy_pass http://localhost:3001;
       }
     }
   }
   ```
5. WAS 설정 (Node.js + Express):
   a. 새 디렉토리 생성 및 초기화:
      ```
      mkdir my-server
      cd my-server
      npm init -y
      npm install express
      ```
   b. server.js 파일 생성 및 편집:
   ```javascript
   const express = require('express');
   const app = express();
   const port = 3001;
   app.use(express.json());
   app.get('/api/hello', (req, res) => {
     res.json({ message: 'Hello from the server!' });
   });
   app.listen(port, () => {
     console.log(`Server running at http://localhost:${port}`);
   });
   ```
6. 서비스 시작:
   a. Nginx 시작:
      ```
      brew services start nginx
      ```
   b. WAS 시작:
      ```
      node server.js
      ```
추가 정보:
- Nginx 로그 파일 위치: /opt/homebrew/var/log/nginx/
- 서버 블록(가상 호스트) 설정 위치: /opt/homebrew/etc/nginx/servers/
- HTML 파일의 기본 위치: /opt/homebrew/var/www/
Nginx 설정을 변경한 후에는 항상 설정 파일의 문법을 체크하고, Nginx를 재시작해야 합니다:
```bash
nginx -t
brew services restart nginx
```
이제 브라우저에서 http://localhost로 접속하면 React 앱을 볼 수 있습니다. 
이 설정은 Apple Silicon Mac (M1, M2 등)을 기준으로 작성되었습니다. 

중요한 부분을 빠뜨렸네요.
/opt/homebrew/etc/nginx/nginx.conf 파일을 다음과 같이 수정해주세요:
```nginx
worker_processes  1;
events {
    worker_connections  1024;
}
http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;
    server {
        listen       80;
        server_name  localhost;
        location / {
            root   /Users/jaehojoo/dev/react/my-responsive-app/build;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
        }
        location /api/ {
            proxy_pass http://localhost:3001;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```
이 설정에는 다음과 같은 중요한 부분들이 포함되어 있습니다:
1. `events` 섹션: Nginx의 이벤트 처리 설정을 정의합니다.
2. `http` 섹션: HTTP 서버 설정을 포함합니다.
3. `server` 블록: 특정 도메인에 대한 설정을 정의합니다.
4. React 앱을 위한 `location /` 블록
5. API 서버로의 프록시를 위한 `location /api/` 블록
이제 다시 Nginx 설정을 테스트하고 재시작해보세요:
1. 설정 테스트:
   ```
   nginx -t
   ```
2. Nginx 재시작:
   ```
   brew services restart nginx
   ```
이제 오류 없이 Nginx가 시작되어야 합니다. http://localhost에 접속하면 React 앱이 표시되고, API 요청은 백엔드 서버로 올바르게 프록시될 것입니다.
만약 여전히 문제가 있거나 추가 설명이 필요하다면 말씀해 주세요.

