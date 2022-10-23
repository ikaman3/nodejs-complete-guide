515_Deno

What is Deno?

Deno is a JavaScript Runtime based on Chrome's V8 JavaScript Engine
Allows you to run JavaScript outside of the browser
=> Deno supports JavaScript & TypeScript
=> Deno supports URL imports and modern JavaScript features(e.g. Promises)
=> Deno is "secure by default" and requires explicit execution permissions

Deno는 크롬의 V8 자바스크립트 엔진에 기반한 자바스크립트 런타임이다. Node.js의 설명과 동일하다. Deno는 자바스크립트 런타임이기 때문에 브라우저 밖에서 자바스크립트를 실행하도록 한다. Node에는 없는 몇 가지 핵심 기능이 있는데 자바스크립트 런타임과 동시에 타입스크립트 런타임이기도 하다. Node는 자바스크립트 코드만 실행할 수 있다. 반면 Deno는 컴파일하기 전 타입스크립트 코드도 실행 가능하다. Deno에는 타입스크립트 컴파일러가 내장되어 있기 때문이다. 
또한 Deno는 외부 URL 불러오기를 지원하고 프로미스 등의 최신 자바스크립트 기능을 포함한다. 
마지막 차이점 혹은 Deno의 핵심 기능은 기본적으로 보안이 확실하다는 점이다. 마치 Node는 안전하지 않다고 들리지만 그건 아니다. 있으면 좋은 기능 중에 하나일뿐이다.
===========================================================================================
516_Deno를 쓰는 이유

Deno: TypeScript support, modern JS features, URL imports, script permissions
Node.js: Only JS, modern JS features are missing, custom module system, no script permissions

BUT: You might not need all Deno enhancements

Deno: Pretty new, small ecosystem, not used in production by major companies yet, smaller base of maintainers, not really used in production yet
Node.js: Established, highly active ecosystem, used by thousands of(big) companies, huge base of maintainers, production-proven

Node를 만든 Ryan Dahl이 Deno를 만들었으며 이유는 Node가 더 이상 성에 차지 않았기 때문이다. 당연히 Node는 사라지지 않는다. Node는 오랜 시간 입지를 다진 소프트웨어로 수많은 개발자와 회사가 사용하고 있으므로 한순간에 사라지지 않을 것이다. 하지만 일부 작업을 다른 방식으로 이행한다는 점에서 Deno도 배워볼만 하다. Ryan이 Node에서 개선할 점을 찾아 개선한 결과물이 Deno라고 할 수 있다.
===========================================================================================
517_Deno 설정

deno.land에 들어가면 Deno 공식 문서를 볼 수 있다. 여러 환경에 따른 설치 과정과 방법이 나와있는데 그 중에서 macOS의 Homebrew 명령어를 사용한다.
    brew install deno

이후 터미널에서 deno 명령어를 입력하면 REPL에 진입한다.
===========================================================================================
518_Deno 기본 코드

Deno는 Node와 달리 기본적으로 타입스크립트를 지원하므로 타입스크립트로 진행해본다.
app.ts 파일을 생성하고
    let message: string;
    message = 'Hi there!';
    console.log(message);

터미널에서 deno run app.ts 명령어를 입력한다. Deno로 해당 파일을 실행할 건데 우선 타입스크립트에서 자바스크립트로 코드를 컴파일하고 Deno가 랩핑한 자바스크립트 엔진이 자바스크립트 코드를 실행해서 'Hi there!'을 출력한다. 다시 deno run app.ts를 실행하면 컴파일된 코드의 캐시가 남아 있어 컴파일 단계를 건너뛰는 걸 알 수 있다. 코드가 바뀐게 없다면 이미 컴파일된 코드로 스크립트를 다시 실행한다.
===========================================================================================
519_Deno 런타임(Namespace) API

Node의 경우 코어 노드 모듈이 있었다. 예를 들어 File System을 다루는 모듈이 있다. 일부 모듈에는 프로미스 기반 API 버전이 있다. 
Deno도 비슷한 개념으로 Runtime API가 있는데 네임스페이스 API라고도 부른다. Deno에 내장된 코어 API 및 핵심 기능으로 Deno 객체에 사용해서 실행 중인 Deno 코드 어디에서나 사용할 수 있다. 파일이나 요청을 다루는 코어 모듈도 있고 setTimeout, setInterval, clearTimeout 등의 핵심 기능도 있다. 네트워크 요청을 보낼 때는 fetch를 사용할 수 있다.
여기서 Node와의 차이점이 드러나는데 Node에서는 핵심 API나 핵심 기능을 각각의 코어 모듈에서 불러온 후에야 사용할 수 있다. 이때 setTimeout 같이 모든 환경에서 사용하는 스크립트도 있다. 하지만 API에 fetch를 사용하는 건 불가능하다. Deno의 핵심 철학은 브라우저를 최대한 호환 가능하게 만드는 것으로 브라우저 밖에서 실행할 수 있는 코드도 지원한다는 의미다. 예를 들어 HTTP 요청을 보내는 fetch API 등이 브라우저에만 국한되지 않았기 때문에 Deno에서도 사용 가능하다. 물론 자바스크립트로부터 HTTP 요청을 보낼 수도 있다.
그 외에도 파일 작성과 관련된 기능도 있는데 Deno가 브라우저 밖에서 실행되며 브라우저 안에 존재하지 않으므로 브라우저에서 사용할 수 있는 기능인 브라우저 DOM과 상호작용하는 기능은 지원하지 않는다. Node 또한 마찬가지인데 브라우저 내에서 실행되지 않으니 DOM도 없기 때문이다. 다시 말해 코어 API는 브라우저에서 할 수 있는 기능에서 브라우저에서만 가능한 기능을 제외하고 브라우저에서는 사용할 수 없지만 밖에서는 사용할 수 있는 기능을 포함한다. 예시로는 파일 작성이 있다. 
===========================================================================================
520_Deno 런타임 API 사용

app.ts 의 기존 코드를 지우고 파일에 텍스트를 저장해본다. text 상수에 문장을 입력하는데 사용자 입력값에서 가져온 텍스트라고 가정해도 좋다. 이 텍스트를 파일에 저장하기 위해 모든 환경에서 사용 가능한 Deno 객체를 사용한다. 이를 위해 IDE의 Extension에서 deno를 검색하여 설치하고 setting.json 파일에 "deno.enable": true 옵션을 추가한다. Deno. 까지 입력하면 자동 완성이 나온다. 
Deno 객체와 Deno 객체에서 접근할 수 있는 모든 메서드는 Deno Executable로 파일을 실행할 때만 가능하다. Node 등으로 실행할 수 없다. 즉, Deno 객체는 추후에 Deno가 스크립트를 실행할 때만 사용할 수 있다.
    const text = 'This is a test - and it should be stored in a file.';
    const encoder = new TextEncoder();
- encoder를 생성해 Deno에서 사용 가능한 글로벌 함수인 new TextEncoder를 사용한다. 텍스트를 바이트로 변환하는 객체를 생성한다. 
    const data = encoder.encode(text);
    await Deno.writeFile('message.txt', data);
- 파일 작성을 위해 write 메서드를 호출한다. 이때 writeTextFile 메서드로 더 쉽게 작성할 수도 있지만 여러 기능을 보기위해 writeFile을 사용했다. 
- writeFile에는 두 개의 인수가 필요하다. 파일 이름을 포함한 경로와 파일에 쓰일 데이터로 데이터는 Uint8Array 유형이어야 한다. 자바스크립트에 내장된 핵심 데이터 타입으로 수많은 바이트로 구성된 배열이다.
- 같은 폴더에 파일을 생성하는 경우에는 파일 이름만 지정하면 된다. 두 번째 인수는 저장할 데이터이므로 Uint8Array여야 한다. 이때 미리보기 스니펫이 문자열을 바이트 배열로 바꾸는 방법을 제시하고 위의 코드와 같다.
- 두 번째 인수로 암호화 된 텍스트인 data를 전달한다.
    console.log('Wrote to file.');

Deno는 프로미스를 포함하므로 실행이 완료됐음을 알리기 위해 콜백을 가지지 않고 writeFile이 반환하는 프로미스에 then을 호출한다. 당연히 await을 사용할 수 있다.
파일을 저장하고 deno run 파일이름 으로 실행하면 허가 거부(Permission Denied)가 나온다. 이것도 Deno의 핵심 기능이다.
* 지금은 허가 거부가 아닌 허가를 할 것인지 물어본다.
===========================================================================================
521_Deno의 권한

앞서 내용에서 세 번째 기능으로 Deno의 기본적인 보안이 있었다. 이것은 우리가 작성하는 Deno 코드가 Node보다 더 안전하거나 덜 안전하다는 뜻이 아니다. 코드를 작성하는 것은 개발자이며 좋은 코드와 나쁜 코드를 작성할 수 있다. Deno코드를 쓰더라도 여전히 보안상 허점은 존재한다.
이 기능은 Deno로 스크립트를 실행하면 스크립트가 가능한 모든 권한을 기본값으로 지니지 않는다는 것을 뜻한다. 예를 들어 파일을 읽거나 쓰고 네트워크 요청을 발신하거나 수신하는 등 이런 작업은 Node에서는 모두 잠금 해제되어 실행 가능하다. 모든 Node 스크립트는 모든 작업을 할 수 있다. 해당 파일은 시스템의 모든 파일을 삭제할 수도 있고 그 작업을 막을 방법이 없다. 따라서 Node로 코드를 실행하면 해당 코드를 신뢰해야 하는데 잠재적으로 악성 작업이 이뤄질수도 있기에 직접 작성했거나 신뢰할 수 있는 제3자 라이브러리여야 한다.
Deno는 조금 다르게 접근한다. 기본값으로 권한이 제한되어 있어 Deno로 코드를 실행하면 파일에 쓰기가 불가능할 수 있다. 네트워크 작업도 마찬가지다. 따라서 파일쓰기를 하려면 적절한 권한을 설정해야 한다. 파일 이름을 명시하기 전에 플래그를 더할 수 있다. 보안 전용 플래그 옵션을 줄 수 있는데 --allow-write 등이 있다.
    deno run --allow-write app.ts
이 명령어로 실행하면 app.ts로 하여금 파일 쓰기를 진행할 수 있게 해준다. 또한 폭을 좁히는 것도 가능하다. 추가로 인수를 부여하여 이 앱이 쓰기를 진행할 수 있는 파일을 write가 명시하게 해줄 수 있다. 
    deno run --allow-write=message.txt app.ts
- 이때 , 로 여러 파일을 추가할 수 있다.
그러나 다른 파일에는 쓰기가 불가능해지니 선택은 개발자의 몫이다.

적절한 권한을 허가해서 코드를 실행하면 텍스트 파일이 생성된다.