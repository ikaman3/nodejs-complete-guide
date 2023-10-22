488_Modern NodeJS

What are "ES Modules"?
=> Import/Export Syntax for modern JavaScript in the Browser
최종적으로는 브라우저 측 자바스크립트 코드에서 나온 개념으로 여기에서도 파일을 불러오기 및 내보내기 할 수 있다. 상대적으로 새로운 개념으로 몇 년 전에는 브라우저 측에서 진행될 만한 작업이 아니었으나 이제는 가능하다.

export const doSomething = () => {...};
===>
import { doSomething } from 'my-file';
최신 자바스크립트의 경우 브라우저에서 임포트/엑스포트 구문은 Node.js에서 사용하는 구문과 다른 형태이다. 대신 브라우저에서는 이 구문을 통해 한 파일에서 다른 파일로 엑스포트한다. 그리고 전달 대상인 파일에서 이 구문으로 임포트를 한다. 이 임포트/엑스포트 구문에는 다양한 변형이 존재한다. 

이제 강의 전반에서 사용했던 require과 module export 구문에서 벗어나 이 구문을 Node 프로젝트에서 어떻게 활용할 지를 알아보자. 그러나 중요한 점은 지금부터 배울 구문과 const, require, module export 등 지금까지 다뤘던 임포트 및 엑스포트 방식은 Node 프로젝트에 있어서 실질적인 표준에 해당한다. 지금부터 배울 새로운 구문으로 전환하는 것은 선택 사항으로 사용이 가능하지만 대다수의 프로젝트는 기존의 구문을 사용할 것이다. 그러니 이것은 필수가 아님을 기억하자.
===========================================================================================
489_ES 모듈 및 Node 작업

원활한 학습을 위해 새로운 레포지토리를 생성하고 간단한 프로젝트를 생성했다. 들어오는 get 요청에 html 파일을 읽은 내용을 send 메서드를 통해 클라이언트로 반환하는 앱이다.
루트 폴더에 response-handler.js 파일을 생성하고 resHandler 함수를 작성한다. app.js에는 이 파일을 임포트하는 구문을 작성하고 미들웨어에 resHandler 함수를 등록한다.
response-handler.js =>
    const fs = require('fs');
    const resHandler = (req, res, next) => {
        fs.readFile('my-page.html', 'utf8', (err, data) => {
            res.send(data);
        });
    };
    module.exports = resHandler;

여기까지가 기존에 사용하던 익숙한 구문이다. 이제 Node.js 공식 문서로 접속하여 새로운 구문을 배워보자.
ECMAScript Modules의 Enabling 태그로 이동하면 세 가지 방법이 있지만 세 번째는 무시해도 된다. 첫 번째는 .js 파일 확장자를 .mjs로 변경하는 것이다. m은 module을 뜻한다. .mjs로 변경하면 import 구문을 쓸 수 있지만 이 접근법은 사용하지 않을거니 되돌려 놓는다.
두 번째는 가장 가까운 package.json 파일에서 type 속성을 module로 설정한다.
package.json =>
    "type": "module"

이제 차세대 임포트 구문을 사용할 수 있다.
    import express from 'express';
- 뭔가를 임포트할 때 사용하는 ES 모듈 구문이다.

저장하고 파일을 실행하면 충돌(Crash)한다. 그 이유는 다른 임포트에서 아직 require를 사용하기 때문이다. type을 module로 설정했다면 새로운 구문을 모든 파일에서 사용해야 한다. 모든 require 구문을 바꿔준다.
엑스포트 방식도 변경해야 한다. 최신 자바스크립트에 존재하는 export 키워드로 엑스포트한다. 이때 두 가지 방법이 있다.
첫 번째는 엑스포트하고자 하는 함수나 변수를 정의하는 라인에 곧바로 추가한다.
    export const resHandler = (req, res, next) => {...};

두 번째는 파일 밑 부분에 export default를 사용한다.
    export default resHandler;
일단 두 번째 방법을 사용한다. 그렇지 않으면 지금의 import 구문이 작동하지 않는다. 

또한 import 구문을 사용한다면 파일 확장자를 반드시 추가해야 한다. 제3자 모듈은 상관없지만 직접 만드는 파일은 반드시 확장자를 추가해야 한다.
    import resHandler from './response-handler.js';

다시 실행하면 이제 정상 작동한다.

export.default는 파일 당 1번만 사용할 수 있어서 다수의 엑스포트를 하지 못한다. 즉, 엑스포트하려는 내용이 파일에 하나만 있으면 사용해도 되지만 다수의 요소가 있다면 첫 번째 방법을 사용해야 한다.
첫 번째 방법을 사용하기 위해서는 임포트 구문도 변경해야 한다. 
    import { resHandler } from './response-handler.js';
중괄호를 사용하고 안에 임포트하고자 하는 상수나 변수의 이름을 반복한다. 이 경우 resHandler라고 이름을 지었기 때문에 임포트하는 파일에서도 동일하게 resHandler로 해야한다. 두 번째 방법에서는 이름 설정이 자유로웠다.
===========================================================================================
490_ES 모듈에 대한 추가 정보

새로운 임포트/엑스포트 구문은 Node.js 전역(글로벌, Global)을 사용하면 흥미로운 점이 있다. 
이 앱은 my-page.html 파일의 콘텐츠를 다시 돌려보내는데 파일 시스템이 읽어서 진행하게 된다. 그러나 다른 방식으로도 가능하다. express에서 노출한 response 객체에도 sendFile 메서드가 있다. 여기에는 돌려보낼 파일을 입력해야 하는데 파일 이름만 입력해서는 작동하지 않는다. 왜냐하면 절대 경로를 사용해야 하기 때문이다.
    // 잘못된 코드
    res.sendFile('my-page.html');

path 코머 모듈을 임포트하고 다양한 경로 세그먼트를 결합하여 절대 경로를 구축한다. 일반적으로 dirname으로 시작해서 이동할 폴더를 지정한다. 지금은 이동할 폴더가 없으므로 파일 이름을 지정한다. 중요한 것은 맨 먼저 현재 작업 중인 디렉터리 즉, 앱 파일들이 있는 디렉터리의 경로인 dirname이 와야 한다는 것이다. 
    res.sendFile(path.join(__dirname, 'my-page.html'));

실행하면 dirname이 정의되지 않았다(not defined). 이 __dirname은 전역 변수이다. 그러나 모던 ES 모듈 구문에서는 구문에 전역 부분이 존재하지 않는다. 즉 dirname, fileName이나 require 함수처럼 다른 임포트/엑스포트 구문에서 사용하던 전역 변수들은 여기에 없는 것이다. 
이건 잘 알려진 문제이고 공식 문서에도 해당 태그가 존재한다(No require, __dirname, ...). 그러나 dirname을 확보할 대안이 있다. 코어 Node 모듈에서 임포트를 더 가져오고 우리가 접근할 수 있는 특별한 가상 전역 변수(Sudo global variable)를 토대로 진행한다.
먼저 임포트를 추가한다.
    import { fileURLToPath } from 'url';
    import { dirname } from 'path';
이미 path에서 뭔가 임포트하고 있는 중인데 최종적으로 임포트하게 되는 것은 모든 메서드를 노출시키는 path 객체이다. 즉, path 모듈은 두 가지 작업을 할 수 있다. 하나는 전체 path 객체를 엑스포트하여 default로 임포트할 수 있다. 하나는 독립적으로 이름이 지정된 함수들로서 path에 호출할 수 있는 모든 메서드를 엑스포트하기도 한다. 따라서 이런식으로 작성할 수도 있다.
    import { join, dirname } from 'path';
또는 이렇게 path를 임포트하고 추가로 이름이 지정된 다른 임포트도 포함할 수 있다.
    import path, { dirname } from 'path';
이 구문을 앱에서 사용하도록 하겠다.

이제 변수를 추가한다.
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
- import.meta.url은 일종의 전역에서 존재하는 변수이며 현재 파일(response-handler.js) 파일명에 경로를 제공한다.
- fileURLToPath는 이 URL을 변환하여 path 패키지가 작업할 수 있는 경로로 바꿔준다. 
- path 패키지가 제공하는 dirname() 함수는 경로를 현재 파일로 가져다가 이 파일이 존재하는 현재 폴더로의 경로를 제공한다.

이를 바탕으로 전역에는 존재하지 않지만 __dirname 변수를 다시 구축할 수 있다. 서버를 재시작해보면 잘 작동한다.
===========================================================================================
491_Node core module 및 Promise

Node.js에서 사용할 수 있는 최신 기능 중에 사용하지 않았던 기능이 코어 API의 프로미스이다.
fs 모듈에서 파일을 읽는 등의 작업에 콜백을 사용하는 이유는 단순하다. Node.js가 처음 생겼을 때는 프로미스가 없었다. 자바스크립트의 주류에 속하지 못했기 때문에 Node.js나 코어 API가 콜백 기반인 것이다. 
프로미스를 사용하기 위해 파일을 읽는 부분을 원래의 코드로 돌려놓는다.
    fs.readFile('my-page.html', 'utf8', (err, data) => {
        res.send(data);
    });

다행인 것은 Node에 내장된 코어 API 대부분이 이제 프로미스를 지원한다. 공식 문서의 File System을 찾아보면 fs promise API가 나온다. 
이때 파일 시스템을 불러오는 방식이 조금 다르다. 'fs' 대신 'fs/promises'에서 불러온다.
    import fs from 'fs/promises';
만약 기존의 require 구문을 사용한다면 이렇게 한다.
    const fs = require('fs').promises;
- 불러온 fs 객체에서 promises 속성에 접근하면 promises 속성이 fs 객체와 관련 메서드를 노출한다.

이렇게 파일 시스템을 불러오고 readFile 메서드를 호출하면 프로미스를 반환하여 돌려받는 err나 data에 리졸브(Resolve)된다. 그럼 콜백 부분과 세 번째 인수를 제거하고 then, catch나 async/await 등 원하는 키워드를 사용한다.
    fs.readFile('my-page.html', 'utf8')
        .then((data) => {
            res.send(data);
        })
        .catch((err) => { 
            console.log(err);
        });
- 이때 프로미스를 사용하므로 then 메서드에 err를 받지않고 data만 받는다. err는 catch 메서드를 추가하여 에러 핸들링한다.

새로운 불러오기 구문과 마찬가지로 100% 선택사항이다. 프로미스 사용을 선호하거나 특히 여러 프로미스를 중첩할 때 이 방식이 좋을 수 있기 때문에 알아두도록 하자.