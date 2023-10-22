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
===========================================================================================
523_Deno 기능이 구성되는 방식

Deno Core, Standard Library & Third Party

Deno Namespace APIs(built-in utilities): Stable & Maintained by Core Team / Built-into Deno, no installation or imports required / Only a small set of low-level core functionalities
Standard Library(maintained by Deno team): Unstable & Maintained by Core Team / Needs to be imported into scripts to be used / Builds up on core, low-level functionalities to provide easier-to-use functionalities
Thrid Party Libraries(maintained by community): Stability differs & Maintained by community teams / Needs to be imported into scripts to be used / Builds up on core, low-level functionalities to provide easier-to-use functionalities

Namespace API 라고 하는 코어 API가 있는데 이것은 내장된 코어 기능과 setTimeout, writeFile 등 내장된 유틸리티 함수 등을 포함하며 이 모든 코어 API 들은 공식 문서에서 확인할 수 있다.
또한 Standard Library는 사용을 위해 파일에 임포트해야 하는 모듈이지만 Deno 팀에서 계속 관리하고 있다.
Third Party 라이브러리는 커뮤니티에서 관리한다.
Deno Namespace API는 안정적이라 더 이상 크게 변경되어서는 안되고 코어 팀에서 관리한다. Standard Library도 해당 팀에서 관리하지만 비교적 덜 안정적이다. 어떤 요소 내지는 기능들은 개선의 여지가 남아있다. 제3자 라이브러리는 이름처럼 공식 Deno 팀이 아닌 다양한 커뮤니티 팀에서 관리하며 안정성과 성숙도도 차이가 존재한다. 어떤 라이브러리는 역사가 짧고 어떤 라이브러리는 엄격하게 관리되어 꽤 안정적일 수 있다. 

Namespace API는 Deno에 내장되어 writeFile 처럼 기능을 사용하기 위해 설치나 임포트가 필요없다. 이는 Node 코어 API와의 차이점에 해당한다. Node는 파일 시스템 API처럼 Core API의 경우 임포트를 추가해야 사용할 수 있다.
Standard Library도 사용을 위해 모듈을 설치하거나 임포트할 필요는 없다. 어차피 Deno 스크립트에서 설치는 크게 의미 없지만 그래도 라이브러리를 쓰려면 임포트 해야한다. 여기서 Standard Library란 무엇일까? 최종적으로 코어 API에 구축되어 몇 가지 요소들의 사용이 더 간편하게 만들어 주는 일련의 패키지들이다. 코어 런타임 API만으로도 모든 종류의 앱을 구축할 수는 있으나 Standard Library, Third Party 등을 활용하여 코어 API에 구축시킴으로써 들어오는 요청을 수신하는 등의 작업을 더 간편하게 하면 일이 더욱 쉬워질 것이다. 즉, Standard Library는 코어 API에 구축되어 해당 API를 활용한 작업을 더 쉽게 만들어준다.
제3자 라이브러리도 같은 개념을 가진다. 마찬가지로 설치할 필요는 없지만 사용을 위해 임포트가 필요하며 코어 API에 구축된다. 
즉, Namespace나 런타임 API는 Deno 내부에 구축되는 것이다. 그리고 무엇이든 구축할 수 있는 low-level 코어 기능들도 일부 보유하지만 이를 직접 활용하기는 어렵다.
그런 이유로 Standard Library, Third Party가 존재한다. 코어 API에 구축되어 특정 기능의 통합을 더욱 간편하게 만들어준다.
===========================================================================================
524_표준 라이브러리 사용

표준 라이브러리 중에 HTTP 라이브러리를 다루어보자. 이 라이브러리는 웹 서버를 가동하는 것을 돕는다. 가장 먼저 보이는 차이점은 import 구문이다. 임포트하는 출처가 URL이다. 
    import { serve } from "https://deno.land/std/http/server.ts";
Node 또한 import from 구문은 지원하지만 URL 임포트는 지원하지 않는다. 여기에선 로컬 파일이나 모듈 대신 다른 서버에 있는 파일을 지정하여 해당 파일을 임포트한다. 이건 Deno의 기능이기도 하다. 
Deno의 개념은 사용할 모든 것을 다운로드해서 로컬에 저장하는 게 아니라 서버에서 자바스크립트나 타입스크립트 파일을 임포트하여 엑스포트된 기능들을 파일에서 사용할 수 있도록 하는 것이다. 이것이 Deno의 핵심 철학이며 Node와의 큰 차이점이다.

serve는 HTTP 서버를 가동하도록 허용하는 Deno 함수다. serve를 호출하여 해당 서버를 가동하며 serve를 통해 객체를 전달하여 구성한다.
    serve((_req) => new Response("Hello World\n"), { port: 3000 });
* 현재 함수와 객체 두 개의 전달 필요
이 객체에서 수신하려는 포트를 지정할 수 있다. 개발을 위해 3000을 사용했다. 이 서버는 물론 들어오는 요청을 보유할 수 있다. 
    const server = serve({ port: 3000 });
    for await (const req of server) {
        req.respond({ body: "Hell World\n" });
    }
- 기존의 예시. 현재 위의 코드로 간결해졌다.
- for await of는 자바스크립트 기능이며 Deno의 기능이 아니다. async iterable라고 하는 자바스크립트의 기능이다. 서버는 비동기식 반복이라고 일컫는 요소에 해당하는데. 이건 단순히 프로미스로 가득한 배열과 같으며 무한한 배열이다.
- 즉, 이 서버는 이렇게 기다릴 수 있는 새 프로미스들을 생성하며 리졸브되는 새로운 프로미스는 모든 들어오는 요청에 대해 생성된다. 이것이 Deno 서버의 배경에서 이루어지는 작업이다.

모든 들어오는 요청에 대해 생성되는 요청 객체를 대상으로 Deno가 응답을 보내는 방식이다.

파일을 실행해보면 뭔가 많이 다운로드를 받는데 임포트 때문에 일어난 일이다. URL에서 임포트하게 되면 코드를 실행할 때 Deno가 해당 서버로 접근하여 파일과 해당 파일의 디펜던시를 다운로드한다. 즉, 해당 파일에 의해 임포트되는 모든 파일도 포함한다. 이 파일들을 로컬 머신에 다운로드하고 로컬에 캐시하여 그 후 스크립트를 실행하게 되면 다시 다운로드가 필요 없도록 해준다. 실행 시간을 단축하고 대역폭을 소진하지 않기 위해서이다. 
그러나 그냥 실행은 허용하지 않는다. 네트워크 접근 권한을 허용해야 하는데 당연히 Deno의 권한 모델 중 일부로 기본값으로 차단되어 있다. 따라서 이 코드를 실행하려면 --allow-net 을 추가해야 한다. 네트워크 권한을 허용하는 플래그다.
===========================================================================================
526_Deno와 Oak 프레임워크

Two Kinds of Web Apps

APIs: Provide "endpoints" (URLs + Http Methods) which return data (JSON format) / Requires standalone frontend apps(mobile apps, single page web apps) that query the API
Server-side Rendered Views: Provide "endpoints" (URLs + Http Methods) which return views (HTML content) / Frontend + Backend are "one unit"

강의 전반에 걸쳐 Node.js로 요청을 처리하는 방법을 배웠다. 이걸 별도의 프레임워크 없이 혼자 진행한다면 재미가 없다는 것도 알았다. Deno도 비슷하다.
다른 건 손대지 않고 코어 API와 표준 라이브러리만 사용하면 요청 처리와, 응답, 바디 처리 등등을 진행해야 하는데 일반적으로 이 작업을 직접 하고 싶지는 않다는 것이다. 개발자로 하여금 핵심 비즈니스 논리에 집중하게 도와주는 프레임워크를 사용하는 게 좋을 것이다.
이건 구축하려는 웹 앱의 종류와 무관하게 성립하다. 물론 크게 두 가지 웹 앱을 구축할 수 있을텐데 API와 서버 측 렌더링 뷰 기반 웹 앱이 될 것이다. 예를 들어 REST, GraphQL API 앱들은 엔드포인트와 독자적인 프론트엔드가 있어 API와 소통한다. 템플릿 엔진을 토대로 서버에 HTML을 생성하여 다시 전달하는 서버 측 렌더링 뷰도 있다.
Deno도 서버 측 템플릿을 렌더링할 수 있고 API 구축도 가능하다. 이번에는 API를 구축해보자.

Node에 Express가 있듯이 Deno에는 Oak 프레임워크가 있다. Express 보단 Node.js의 프레임워크인 Koa의 영향을 많이 받은 프레임워크이다. 

기본 코드 스니펫을 복사하여 Oak 모듈로 들어오는 요청을 처리하고 응답을 보낼 수 있다. Node와의 차이점은 package.json과 npm 등의 디펜던시 관리 도구가 없다는 것이다. Deno는 웹 서버 상에 있는 파일로 접근해서 설치한다. 임포트하는 URL에 포함하여 일부 버전들은 관리할 수 있지만 전용 패키지 관리 파일은 없다. 어느 쪽을 선호할지는 자유이다.

    import { Application } from "https://deno.land/x/oak/mod.ts";
    const app = new Application();

    app.use((ctx) => {
        ctx.response.body = "Hell World!";
    });
    await app.listen({ port: 3000 });
- Application 생성자 함수 또는 클래스를 URL에서 임포트한다. 이를 생성하여 새로운 앱을 생성한다.
- use 메서드를 사용하는 것은 express와 유사하지만 미들웨어 함수는 조금 다른 형태다. req, res, next를 가져오는 대신 ctx(context)와 next를 가져온다. ctx를 가져오면 req, res 객체도 참조하게 된다. 즉, req, res는 하나의 ctx 객체에 요약되어 있다.
- res 객체를 사용하여 응답의 바디를 설정하고 이후 자동으로 다시 전달되도록 한다.
- 전체를 listen하여 해당 서버를 가동하고 최상위 단계의 await을 설정한다.

파일을 실행하고 서버의 URL로 접속하면 Hell World!가 보인다.
===========================================================================================
527_모듈 URL에 대한 추가 정보

Deno에서 불러오기를 하려면 ES 모듈에 불러오고자 하는 파일의 URL을 사용한다.
로컬 파일이 될 수도 있고 (import something from './my_file.ts';) 원격 파일이 될 수도 있다. (import { serve } from 'https://deno.land/std/http/server.ts';).

다음은 원격 임포트에 관한 정보이다.
IDE에서 자동 완성을 개선하려면, 코드를 한 번 실행해서 Deno가 원격 파일을 로컬에 다운로드하고 캐시를 저장하도록 만든다. 그 다음부터는 자동 완성이 더 잘 작동할 것이다.

로컬 캐시를 정리하기 위해 Deno가 원격 파일을 다시 가져오게 하려면, --reload 플래그를 포함한 스크립트를 실행하면 된다. 예를 들어 deno run --reload my_file.ts 가 될 것이다.

원격 파일의 특정 버전을 유지하려면: import { serve } from 'https://deno.land/std@0.51.0/http/server.ts';
===========================================================================================
529_Deno로 REST API 구축

기존에 배운 내용을 이용한 간단한 Todo List 앱이므로 코드는 생략.

routes 메서드를 추가해서 미들웨어를 등록한다. 또한 allowedMethods도 미들웨어로 등록해야 한다.
    app.use(todosRoutes.routes());
    app.use(todosRoutes.allowedMethods());

Oak는 response.body를 객체로 설정하면 알아서 JSON으로 추가한다. 즉, 자동으로 JSON으로 분석하거나 변환해서 알맞은 응답 헤더를 설정하며 응답을 보내주니 body만 설정하면 된다.
    ctx.response.body = { todos: todos };

* 이후 body에서 내용을 추출하는 것은 변경된 것이 있는지 에러가 발생하여 일단 생략.

모든 라우트를 작성한 후에 app.ts에서 다른 미들웨어를 실행하려면 Node Express처럼 Oak에게 코드를 진행하겠다고 알려야 한다. Oak는 자동으로 응답을 보낸다. 어느 미들웨어든 실행을 마치면 응답을 보낸다. 하지만 모든 미들웨어가 아니라는 것이 차이점인데 예를 들어 아래의 미들웨어가 있다고 가정하자.
    app.use((ctx, next) => {
        console.log('Middleware!');
        next();
    });
이 미들웨어 실행을 마치면 응답을 보내야 하는데 next 함수를 실행했기 때문에 아래 라우트 미들웨어까지 실행되고 나서야 라우트가 끝날 것이라고 생각할 수 있다.
next 함수로 라우트 미들웨어 실행을 시작하지만 next 함수만으로는 기다리지 않는다. 한편 라우트 미들웨어에서 request.body 의 분석을 위해 async 키워드를 추가하여 비동기 작업을 했었다. 즉, 라우트 미들웨어는 프로미스를 반환해 비동기식 작업이 끝난 후에야 끝난다는 것이다. next 함수는 실행이 끝나기를 기다리지 않는다. 따라서 지금 시나리오는 라우트가 요청을 처리하기 전에 응답을 너무 빨리 보내버리는 것이다.
일부 미들웨어가 비동기식 작업을 포함한다면 모든 미들웨어에 async를 추가하고 next 전에 await을 추가한다. 그러면 Oakㅇ게 다음 미들웨어를 시작하라고 알리고 자동으로 생성된 응답을 보내기 전에 다음 미들웨어 실행이 끝나기를 기다리라고 알리게 된다.
    app.use(async (ctx, next) => {
        console.log('Middleware!');
        await next();
    });
===========================================================================================
530_Node에서 Deno로 전환은 필요한가?

Deno vs Node

Deno: Supports TypeScript and JavaScript / Based on Modern JS Features (e.g. Promises) / Support URL Imports / Execution Permissions (--allow-read etc) / Very New, Will have Bugs, No big Ecosystem
Node: Supports only JS (custom TS compiler possible) / Uses older JS in some of its core Modules / Brings its own Modules System / No Execution Permissions / Mature & Established, No Major Bugs, Strong Ecosystem

두 방식으로 더미 API를 구축해본 결과 차이점이 크지는 않았지만 작은 차이점이 있어서 결정하기 어렵다. 코드만 보면 크게 다르지 않기에 변환하기 용이하다. 
물론 둘의 철학에 중요한 차이점이 있다. 허가와 관련된 차이점 외에도 Deno는 최신 자바스크립트와 타입스크립트를 포함해서 추가적인 도구나 옵션으로 넣을 필요가 없다. 즉 Deno는 아직까지 새로운 기술이라고 볼 수 있다.
Deno에는 새로운 기능이 많이 내장되어 있지만 동시에 아직 큰 생태계가 없다는 뜻이 된다. 일부 코어 라이브러리에 변경 사항이 생기면 분명 버그가 나타날 텐데 제3자 모듈 중 어떤 게 작동하고 작동하지 않을지 모른다. 따라서 아직까지는 큰 회사나 생산 앱에서 많이 사용하지 않는다.
반면 Node는 새로운 기능이 내장되어 있지 않지만 허가와 관련해 다른 철학이 있으며 모든 것을 로컬 환경에 저장하는 모듈 시스템이 다른데 무엇을 선호하느냐에 따라 다를 것이다. 또한 오랜 기간 안정적이라 큰 버그가 없고 강력한 생태계가 있으며 제3자 패키지가 풍부하여 작업 중에 생기는 문제점의 해결과 수많은 회사, 개발자들이 사용한다는 강점이 있다. 

Which One?

Which features matter to you? Which "style" do you prefer? + Maturity & An active ecosystem is extremely important

=> Use Deno for side-projects
=> Node is established and not going to go anywhere!