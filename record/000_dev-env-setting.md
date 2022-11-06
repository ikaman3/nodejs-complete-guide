VSC를 이용한 Node.js 개발 환경 설정

사용툴

<homebrew>
visual-studio-code
node
google-chrome
mysql
gh

========================================================================
사용법 및 설명

<npm>
npm init : npm 초기화하여 package.json 생성
npm install : 필요한 의존성을 모두 설치

package.json의 scripts에 추가
"start": "node ap p.js",       // npm start 
// 개별 설정된 이름이 있는 일반 스크립트
"start-server": "node app.js" // npm run start-server : 기본으로 존재하지 않는 스크립트는 run 키워드 이용

<nodemon>
노드 애플리케이션을 실행하고 파일들의 변경 내역을 확인하여 무언가 변경하는 경우 프로세스를 재시작 한다.
"start": "node app.js", -> "start": "nodemon app.js",
이때 터미널에서 "nodemon app.js" 명령어를 사용하려면 nodemon을 전역으로 설치해야 한다.
로컬로 실행하려면 "npm start" 사용
추후 디버깅에서 사용할 것이므로 전역으로 설치할 것

<Debug>
"app.js" 파일 선택 후 메뉴바-Run-"Start Debugging" or F5 
Break point를 설정하여 원하는 위치에서 정지

우측상단에 생긴 디버그 메뉴 바의 버튼: (왼쪽부터)1.시작 및 일시정지 2.다음 코드 3.다음 함수 4.이전 함수 5.재시작 6.정지

자주 확인해야 하는 변수는 WATCH에 등록하여 항상 볼 수 있음
Debug Console에서 런타임에 변수의 값을 확인할 수 있다. 콘솔에 변수 이름 입력 시 자동으로 출력
디버그 콘솔을 활용하여 런타임에 콘솔로그 이외의 기능도 테스트할 수 있음. 실제 코드에 영향을 주지않고 코드를 이해하는데 도움을 준다.

nodemon으로 디버거 자동 재시작
파일 변경 시 디버거도 재시작 해줘야 제대로 작동한다.
메뉴바-Run-Add Configuration-Node.js 선택 -> .vscode 폴더와 launch.json 파일이 추가되어 프로젝트에 디버깅을 구성할 수 있다.
"program": "...", 다음에 입력
"restart": true,
"runtimeExecutable": "nodemon", // Default: node / nodemon을 사용하여 프로그램이 변경되면 디버그 프로세스도 재시작한다.
"console": "integratedTerminal"

여기서 nodemon을 로컬로 설치했다면 오류가 발생한다 => 전역 nodemon을 사용하려고 하기 때문이다.
이제부터 콘솔은 터미널과 디버그 콘솔로 나뉘는데 터미널에서 실행해야 한다. 변경사항이 생기면 디버거와 노드가 각각 재시작하는데
디버거를 중단할 시 Ctrl+C 를 눌러서 nodemon을 따로 종료해야 하는데 디버그 콘솔에서는 할 수 없기때문이다.
디버그 프로세스를 종료하려면 터미널에서 할 수 있다.

디버깅 도중 변수 변경: 디버깅 메뉴에서 변경하고 싶은 변수를 더블클릭 or Enter 해서 런타임에 영향을 줄 수 있다.

더 많은 디버깅 기능
https://code.visualstudio.com/docs/nodejs/nodejs-debugging 