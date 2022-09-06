358_REST APIs

Decoupling Frontend and Backend

지금까지 Node.js로 앱을 구축하고 Node.js를 구축하는 Express 프레임워크에 대해 배웠다. 또한 데이터베이스에 접근하고 요청을 처리할 뿐만 아니라 응답을 보내고 템플릿을 렌더링하며 파일을 작업하는 등 노드 앱을 구축하는데 필요한 것을 배웠다. 
여태까지 항상 EJS 템플릿을 렌더링했다면 이제 노드 앱에서 ejs 템플릿 렌더링만큼 많이 사용하는 대안을 사용해보자. 
===========================================================================================
359_REST API의 정의 및 사용 이유

Not every Frontend(UI) requires HTML Pages

Mobile Apps(e.g. Twitter) Single Page Web Apps(e.g. Udemy Course Player)  Service APIs(e.g. Google Maps API)
==> Frontend(UI) is decoupled the Backend(Server)

REST API를 사용하는 이유는 모든 프론트엔드 UI가 HTML 페이지를 사용하지 않기 때문이다. 혹은 모든 UI는 서버가 HTML 코드를 생성해서 UI로 사용하길 원하지 않는다. 예를 들어 Twitter 앱 같은 모바일 앱은 대개 서버 측에서 렌더링 된 HTML 코드를 사용하지 않는다. 즉, 서버에 템플릿 언어가 있어서 HTML 코드를 렌더링하지 않아도 되고 Android의 경우 Java를 통해, iOS의 경우 Swift 및 Object C를 통해 앱을 구축한다. 또는 미리 구축된 수많은 UI 위젯을 사용하거나 Apple이나 Google 등이 제공하는 UI 라이브러리를 사용할 수도 있다.

이런 라이브러리를 이용해 Android 개발을 위한 Android Studio 같은 프로그래밍 언어의 각 IDE에 맞는 UI를 구축한다. 이때 구축하는 UI는 서버로부터 완전히 분리되기 때문에 렌더링하지 않을 HTML 코드가 필요없는 것이다.
마찬가지로 모바일 브라우저의 경우 HTML 페이지를 렌더링하지만 App Store를 통해 설치하는 모든 앱은 대부분 인터페이스 구축에 HTML을 사용하지 않고 Apple 및 Google 등이 제공하는 툴을 사용하며 UI를 채울 데이터만 필요로 한다.

다른 예시로는 단일 페이지 웹 앱이 있다. Udemy 강의 비디오 플레이어가 좋은 예시이다. Course Content, Q&A 등 메뉴를 둘러볼 때 페이지 새로고침 없이 재렌더링 되는 것을 볼 수 있다. 바로 페이지 전체가 브라우저 측 자바스크립트를 통해 렌더링 되었기 때문이다. 이 자바스크립트는 DOM을 다룰 수 있으며 DOM은 간단히 말해 렌더링 된 HTML 코드이다. 따라서 Udemy 뿐만 아니라 많은 최신 웹 애플리케이션들은 많은 HTML 콘텐츠를 포함하지 않은 초기 HTML 페이지만 가져오는 대신 자바스크립트 스크립트 파일을 많이 로딩하며 스크립트 파일이 백엔드 API 즉, RESTful API에 도달해 UI에 재렌더링해야 하는 데이터만 가져온다. 즉, Q&A를 클릭하면 자바스크립트 코드가 Udemy 서버에 도달해 Q&A 항목을 표현하게끔 하는 것이다.
이런 웹 앱이 인기 있는 이유는 모바일 앱 같은 느낌을 주기 때문이다. 클릭만 하면 되고 새로고침을 기다릴 필요 없이 한 페이지에 머물면서 렌더링 되는 데이터만 배후에서 바꾸고 UI는 브라우저 측 자바스크립트를 통해 렌더링된다. 

한편 특정 프론트엔드를 작업하지 않고 일반적인 Node.js 앱을 다루지만 Google Maps API 같이 특정 서비스 API를 사용할 수도 있다. 이때 프론트엔드를 위해 REST API를 직접 구축해야 하는 건 아니지만 이 경우에는 데이터만 필요하고 UI는 필요없다. 예를 들어 구글 맵스가 HTML 코드를 반환하기 보다 좌표를 알려주기만을 원하는 것처럼 데이터만 알고 싶은 경우도 흔하다. 프론트엔드 코드가 백엔드 혹은 구글 맵스 같은 특정 백엔드 논리로부터 분리되어 데이터만 교환하고 UI는 필요하지 않다. HTML 코드를 받지 않고 직접 구축할 것이므로 백엔드가 데이터만 제공하는 것이 REST API의 핵심 개념이다. 다른 종류의 응답이 필요한 것이다.

REpresentational State Transfer
Transfer Data instead of User Interfaces

Important: Only the response(and the request data) changes, NOT the general server-side logic

REST API는 Representational State Transfer 의 약자로 UI 대신 데이터 전송을 의미한다. HTML 대신 데이터만 전송하고 클라이언트 및 프론트엔드가 전송받은 데이터로 알아서 작업하게 한다. 지금까지는 서버에서 HTML 페이지를 렌더링했고 데이터와 UI도 포함했었다. 물론 이 방식이 나쁜건 아니다. 많은 웹 앱에서 흔히 사용하던 패턴이다. 하지만 분리된 프론트엔드가 필요한 일부 앱에서는 REST API가 좋은 솔루션이 될 것이다.
또 중요한 점은 응답과 요청 데이터만 바뀌고 전체적인 서버 측 논리를 바뀌지 않는다는 점이다. 흔히 REST API와 서버에서 뷰를 렌더링하는 기존의 웹 앱이 전혀 다른 것으로 간주되지만 사실은 응답이나 받는 데이터 측면에서만 다를 뿐 서버 측 논리는 다르지 않다. 뷰가 렌더링 되느냐의 차이를 제외하고 말이다. 
===========================================================================================
360_REST API로 데이터 액세스

REST API Big Picture

                        Client
            Mobile App   SPA     Any App
                |         |         |
                |         |         | <=== ONLY the Data, not the UI
                |         |         |
             App Backend API      Service API
                        Server
서버와 클라이언트가 있을 때 클라이언트는 모바일 앱이나 단일 페이지 애플리케이션이고 서버에 API를 구축한다. 이때 여러 클라이언트를 위해 하나의 API를 사용할 수 있다. 오늘날 웹 앱과 모바일 앱을 같이 만드는 것은 흔한 일이다. 모바일 앱과 웹 앱이 동일한 데이터를 사용한다. 물론 다르게 보여줄 수는 있다. 프론트엔드가 UI를 다르게 처리해 다르게 보여줄 수는 있지만 사실 같은 데이터를 다루는 것이다. 

이런 식으로 API를 구축하거나 기존 웹 앱 등 애플리케이션에 서비스 API를 추가하거나 서비스 판매를 위해 직접 서비스 API를 구축할 수도 있다. 어떤 애플리케이션이 데이터를 문의할 Stock API가 있는데 해당 API에 대한 접근 권한을 판매하는 비즈니스 모델인 것이다.

Data Formats

HTML: <p>Node.js</p> / Data + Structure / Contains User Interface / Unnecessarily difficult to parse if you just need the data
Plain Text: Node.js / Data / No UI Assumptions / Unnecessarily difficult to parse, no clear data structure
XML: <name>Node.js</name> / Data / No UI Assumptions / Muchine-readable but relatively verose; XML-parser needed
JSON: {"title": "Node.js"} / Data / No UI Assumptions / Muchine-readable and concise; Can easily be converted to JavaScript

과연 데이터를 어떤 형식(format)으로 교환할까. 여때까지 배운 HTML 외에도 다양한 데이터 타입이 있다. 일반 텍스트, XML, JSON이 잘 알려진 데이터 형식이다.
HTML은 HTML 코드를 보내며 지금까지 다루었다. EJS 뷰를 렌더링할 때 브라우저에 HTML 코드를 보내 뷰가 서버에 렌더링 되도록 하고 렌더링 과정의 결과가 HTML 코드였다. 이처럼 HTML 코드는 데이터와 구조를 포함한다. 즉, UI가 어떻게 보일지 정의한다는 뜻이다. 문제는 데이터만 원하는데 HTML 컨텐츠까지 포함하면 쓸데없이 분석이 어려워진다.

일반 텍스트를 보낼 수도 있다. 일반 텍스트는 데이터만 포함하고 구조나 디자인 요소가 없으므로 UI를 정의할 수는 없다. 하지만 이것도 분석이 어려운데 텍스트는 사람이 이해하기 쉽지만 컴퓨터가 이해하기는 어렵기 때문이다. 텍스트는 명확한 패턴이 없으므로 데이터 교환에 가장 좋은 방법은 아니다.

XML은 HTML과 비슷해보이는데 사실 HTML이 XML의 한 유형이다. 차이점은 XML에는 아무 태그나 사용할 수 있으며 데이터를 전달할 수 있다. 역시 브라우저가 분석할 수 없으므로 UI를 가정할 수 없고 XML 요소는 전적으로 개발자의 손에 달렸다. 장점은 일반 텍스트보다는 기계가 읽기 쉽다. 명확한 구조 정의도 가능하지만 XML 파서가 필요하다. XML 노트 트리를 가로지르는 건 불가능하지는 않지만 어려워서 XML 파서가 필요하다. 또 이 같은 요소들이 전송하는 데이터에 일종의 오버헤드를 추가해 데이터를 읽기 위해 추가적으로 텍스트가 많이 필요하다.

마지막은 가장 훌륭한 JSON이다. 비동기식 요청에서 이미 사용했었다. JSON 역시 그냥 데이터이며 UI를 가정하지 않고 기계가 읽을 수 있다. XML보다 간결해서 자바스크립트로 변환하기 쉽다는 점이 서버에서 Node.js 작업이나 유일하게 브라우저에서 사용할 수 있는 프로그래밍 언어인 자바스크립트를 작업할 때 큰 이점이 된다. 따라서 데이터만 전송하고 싶을 때 가장 좋은 데이터 형식은 JSON이며 API와 커뮤니케이션하는데 흔히 사용한다.
===========================================================================================
361_라우팅과 HTTP Method 이해

Routing
                    
                     API Endpoints
                  |-> POST /post
Client  ------------> GET /posts          Server (Server-side Logic, Database Access etc.)
                  |-> GET /posts/:postId

클라이언트와 서버 간에 어떻게 소통할까. 클라이언트와 서버가 있을 떄 서버에는 서버 측 논리가 있다(DB에 접근 등). 기존의 웹 앱에서는 HTML에 링크를 추가하거나 form에 버튼을 추가한 뒤 액션과 메서드를 정의했다. 

REST API도 크게 다르지 않다. 여전히 요청과 함께 HTTP 메서드, 즉 HTTP 동사와 서버에 있는 경로를 보낸다. 
서버 측 라우팅에 경로를 정의하고 들어오는 요청을 기다리며 경로가 처리할 HTTP 메서드를 정의해서 모든 경로에 아무 요청이나 도달하지 않도록 한다. 브라우저 작업 시 요청은 클라이언트로부터 비동기식 자바스크립트를 통해 보내지는데 Fetch API, AJAX 등이다. 모바일 앱의 경우 특별한 클라이언트도 있다. 중요한 점은 일반 요청인데 HTML 응답을 바라지 않을 뿐이라는 것이다. 하지만 HTTP 메서드와 경로의 조합을 보내면서 서버와 소통하는 것이다.

REST 및 API에서 이들을 API 엔드 포인트라고 부른다. 앞으로 API 엔드 포인트는 GET, POST 같은 HTTP 메서드와 각 경로를 말하는 것이다. REST API에 엔드 포인트를 정의하고 요청이 엔드 포인트에 다다랐을 때 서버에서 실행할 논리를 정의한다. 

Http Methods(Http Verbs)

GET: Get a Resource from the Server
POST: Post a Resource to the Server(i.e. create or append Resource)
PUT: Put a Resource onto the Server(i.e. create or overwrite a Resource)
PATCH: Update parts of an existing Resource on the Server
DELETE: Delete a Resource on the Server
OPTIONS: Determine whether follow up Request is allowed(sent automatically)

사실 HTTP 메서드는 GET, POST 이외에도 많다. 하지만 브라우저의 폼이나 링크만 다루고 브라우저에 있는 자바스크립트는 다루지 않는 경우에는 GET, POST만 사용할 수 있다. 브라우저 혹은 브라우저 HTML 요소가 기본적으로 알고 있는 두 가지 메서드이다. 자바스크립트를 통해 비동기식 요청을 처리할 때나 모바일 앱을 구축하며 각 HTTP 클라이언트를 사용하면 더 많은 HTTP 메서드를 사용할 수 있다. 

비동기식 요청에서 GET 메서드는 서버로부터 리소스를 얻고 POST 메서드 서버로부터 리소스를 보내서 서버에 생성하거나 기존 리소스 배열에 첨부한다. 
PUT 메서드는 리소스를 서버에 놓고 싶을 때 사용한다. 즉, 리소스를 생성하거나 기존 리소스를 덮어쓴다는 뜻인데 POST는 절대로 기존의 것을 덮어쓰지 않는다. 
또 기존 리소스의 일부분을 업데이트하는 PATCH가 있다. 전체적으로 덮어쓰는 게 아니라 일부분만 업데이트하는 것이다. 
DELETE는 서버에 있는 리소스를 삭제한다.
간접적으로 사용할 메서드도 있다. OPTIONS는 브라우저가 자동으로 보내는 메서드인데 간단히 말해 브라우저가 자동으로 요청을 보내 다음 요청을 알아보는 것이다. 예를 들어 다음 요청이 삭제 요청이라면 허용되는지 알아보는 것이다. 

특정 메서드가 있는 요청이 특정 경로에 도달했을 때 이론상 원하는 작업을 전부 할 수 있다. REST에서 리소스를 생성하거나 첨부할 때 POST 요청을 사용하는데 서버에서 무언가를 삭제하는 건 제한되지 않는다. 서버 측에 메서드-경로 쌍만 정의하면 원하는 코드 무엇이든 실행할 수 있으며 사용된 메서드는 코드가 실행하는 작업을 제한하지 않는다. 대신 스스로 제한하고 REST API를 실행하는 것이 좋은데 반드시 그래야 하는 것은 아니다. REST API를 사용하면 API를 사용하는 누구든 해당 메서드가 실행됐을 때 서버에 어떤 일이 생길지 예상할 수 있다.
===========================================================================================
362_REST API 핵심 원칙

REST Principles 

Uniform Interface: Clearly defined API endpoints with clearly defined request + response data structure
Stateless Interactions: Server and client don't store any connection history, every request is handled seperately

Cacheable: Servers may set caching headers to allow the client to cache responses
Client-Server: Server and client are separated, client is not concerned with persistent data storage
Layered System: Server may forward requests to other APIs
Code on Demand: Executable code may be transferred from server to client

이론에 기반한 몇 가지 중요한 핵심 개념이 있다. RESTful API를 구축할 때 적어도 두 가지의 핵심 개념을 기억하자.
첫 번째는 일관된 인터페이스 원칙이다. 이는 API에 명확하게 정의된 API 엔드 포인트를 가져야 함을 의미한다. API는 예측 가능해야 하고 공개된 경우에는 문서화가 잘 되어있어야 한다.
두 번째는 무상태 상호작용 원칙이다. 인증에 있어 매우 중요한 개념이다. RESTful API 구축 시 클라이언트는 서버와 완전히 분리되어 히스토리를 공유하지 않는다. 따라서 연결 히스토리가 저장되지 않고 들어오는 모든 요청에 대해 사전 요청을 보내지 않은 것으로 처리하므로 어떤 세션도 사용하지 않는다. 서버가 각 요청을 직접 들여다보게 된다. 클라이언트를 위한 세션을 저장하지 않으며 클라이언트를 전혀 신경 쓰지 않는다. RESTful API를 구축하고 구글 지도 API 같이 공개하더라도 개별 클라이언트에 신경 쓰지 않아도 된다. 어떤 엔드 포인트가 있는지 제시하고 각 엔드 포인트에서 받는 데이터와 필요한 데이터를 제시하면 더 이상 신경 쓰지 않아도 된다. 세션 저장도 필요 없고 클라이언트와 서버가 확실하게 분리되어 있다. API를 프론트엔드에서 개발하기 위해 같은 서버에서 실행하더라도 둘은 분리된 상태로 따로 작동하여 데이터만 주고 받는다. 따라서 새로운 엔드 포인트를 설정할 때마다 이전 요청과 독립적으로 기능하는지 확인해야 한다. 이런 문제는 한번 로그인하면 향후 요청도 로그인 상태로 처리해야 하는 인증 과정에서 흔히 발생한다.

보다 덜 중요한 원칙도 몇 가지 있다. 첫 번째는 캐싱 가능 원칙이다. RESTful API에서 헤더를 전송해 클라이언트에게 응답의 유효 기간을 알려줌으로써 클라이언트가 응답을 캐싱 할 수 있도록 하는 기능이다.
다음은 클라이언트와 서버의 분리인데 클라이언트는 지속적인 데이터 저장에 신경 쓸 필요가 없다. 그건 서버의 역할이다.
계층형 시스템의 경우 클라이언트가 API에 요청을 보낼 때 해당 요청을 받은 서버가 요청을 즉시 처리하는 대신 다른 서버로 전달하거나 분배할 수 있다는 뜻이다.
마지막 원칙으로 주문형 코드이다. 일부 엔드 포인트에서 실행 가능한 코드를 전송할 수도 있음을 뜻한다. 이런 경우는 자주 보기 어렵다.
===========================================================================================
363_REST API 프로젝트 생성 및 라우트 설정 구현

routes 폴더에 feed.js 파일을 생성한다. 기존 라우트와 차이는 없다.
    router.get('/posts', feedController.getPosts);

364_요청 및 응답 보내기, Postman 사용법

controllers 폴더에 feed.js 파일을 생성하고 getPosts 액션을 내보낸다. 뷰를 렌더링하지 않으므로 res.render을 호출하지 않는다. 대신 json 응답을 반환한다. json은 Express에서 제공하는 메서드로 json 데이터 형태로 헤더 설정 등과 함께 응답을 편리하게 반환할 수 있다.
    res.status(200).json({
        posts: [{ title: 'First Post', content: 'This is the first post!' }]
    });
- json 응답을 보낼 때는 상태 코드를 명확하게 보내야 한다. 클라이언트가 응답을 기반으로 UI를 렌더링해야 하므로 올바른 상태 코드가 중요하다.

이제 브라우저에서 http://localhost:8080/feed/posts로 접속하면 요청이 보인다. 이렇게 데이터에 직접 액세스하는 것은 계획이 아니다. 다만 브라우저에 입력하지 않고 빠르고 쉽게 REST API를 테스트하기 위해 준비가 필요하다. 컨트롤러에 액션을 추가하고 라우트에 추가한다.
    exports.createPost = (req, res, next) => {
        const title = req.body.title;
        const content = req.body.content;
        console.log(title, content);
        // Create post in db
        res.status(201).json({
            message: 'Post created successfully!',
            post: { id: new Date().toISOString(), title: title, content: content }
        });
    };

데이터를 분석하는 방법이 필요하다. bodyParser를 이용한다. app.js에 바디파서를 임포트하고 기존과는 다르게 초기 설정한다.
    app.use(bodyParser.json()); // application/json
json 데이터 분석을 위해 json 메서드를 사용한다. 

어떻게 테스트할 수 있을까? 제출할 form을 생성하는 방법은 쓸 수 없다. 그렇게 하면 x-www-form-urlencoded 데이터로 돌아가게 되고 REST API에서는 이러한 form을 사용하지 않으므로 현실적인 테스트 방법이 아니다. 대신 Postman이라는 툴을 사용한다. 

Postman에서 http://localhost:8080/feed/post 로 json 형식으로 데이터를 작성한다. 
    {
        "title": "My second Post!",
        "content": "This is the content of my second post."
    }
요청을 보내면 응답을 받게 된다.
===========================================================================================
365_REST API, 클라이언트 및 CORS 오류

프론트엔드 시뮬레이션을 위해 CodePen을 사용한다. 
HTML
    <button id="get">Get Posts</button>
    <button id="post">Create a Post</button>
JS
    const getButton = document.getElementById('get');
    const postButton = document.getElementById('post');

    getButton.addEventListener('click', () => {
    fetch('http://localhost:8080/feed/posts')
        .then(res => res.json())
        .then(resData => console.log(resData))
        .catch(err => console.log(err));
    });
- 기본적으로 fetch 메서드를 사용하면 get 요청이다.
- then 블록에서는 응답 객체를 돌려받게 되는데 스트림되어 들어오는 본문이 완료되기를 기다려야 한다. 따라서 res.json에서는 이를 기다린 다음 자동으로 json 컨텐츠나 자바스크립트 객체로 변환할 수 있다. 그 다음 해당 자바스크립트 객체가 있는 then 블록을 연결한다. 

codepen에서 요청을 보내면 No 'Access-Control-Allow-Origin' headers is present 오류가 발생한다. 최신 웹 앱이나 단일 페이지 애플리케이션 구축에서 흔히 보이는 오류이다. CORS 오류라고 불리며 뒤쪽에 표시된다.

CORS

Cross-Origin Resource Sharing: 교차 출처 리소스 공유

서버에 클라이언트가 있고 같은 도메인에서 실행 중이고 localhost:3000이라고 한다. 포트도 도메인의 일부이므로 중요하다. 같은 서버에서 실행한다면 문제없이 요청과 응답을 전송할 수 있다. 이전까지 문제가 없던 이유가 이것이다. 
그러나 클라이언트 서버가 localhost:4000 같이 다른 도메인에서 실행 중이라면 문제가 발생한다. 도메인 간, 서버 간 그리고 출처 간 리소스 공유를 막는 브라우저 보안 장치 때문에 CORS 오류가 발생한다. 일부 앱에 대해서는 이 보안 장치가 합리적이지만 REST API에서는 일반적으로 그렇지 않으므로 이를 덮어써야 한다. 즉, 서버가 데이터를 공유할 수 있게 하는 것이다.
다양한 클라이언트에게 서버의 데이터를 제공할 것이며 이러한 클라이언트들은 API가 실행 중인 서버와 다른 서버를 사용한다. 프론트엔드와 백엔드를 모두 만든 뒤에도 프론트엔드 코드 처리에 최적인 서버에서 프론트엔드를 서비스하고 서버 측 노드 코드를 다른 서버에서 서비스하는 식으로 두 엔드를 다른 서버에서 서비스하는 경우가 자주 있다. 

문제 해결을 위해 CodePen에서 실행되는 이 브라우저에 서버에서 전송하는 응답을 받아도 괜찮다고 알려야 한다. 브라우저에 이를 알리려면 서버에서 무언가 변경해야 하는데 여기서 실수를 많이 한다. 브라우저 측 자바스크립트 코드를 해결하려 하지만 이는 불가능하고 서버 측에서만 가능하다. 서버 측 app.js로 돌아가서 헤더를 설정한다.
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });
- 서버에서 나가는 모든 응답에 대해 헤더를 설정한다.
- setHeader로 응답에 헤더를 추가할 수 있는데 아직 응답을 보내는 건 아니다. setHeader는 전송 기능이 없다. json, render에는 있다.
- 'Access-Control-Allow-Origin'은 이 서버에 액세스를 허용할 url을 설정한다. *는 와일드 카드로 모든 것을 허용하겠다는 의미이다. 원한다면 특정 도메인으로 제한할 수도 있고 다수의 도메인이 있다면 쉼표(,)로 구분한다.
- 'Access-Control-Allow-Methods'은 특정 HTTP 메서드를 허용한다. 클라이언트, 즉 출처에 어떤 메서드가 허용되는지 알려주어야 한다. 전부 허용할 수도 있고 그럴 필요는 없다. 외부에서 사용할 수 있게 하려는 메서드만 허용하면 된다. 
- 'Access-Control-Allow-Headers'은 클라이언트가 요청에 설정할 수 있는 헤더를 정한다. 항상 허용되는 기본 헤더도 있지만 Content-Type, Authorization 두 가지는 반드시 추가해야 한다. 그래야 클라이언트가 요청의 콘텐츠 유형을 정의하거나, 헤더에 추가 인증 데이터를 포함한 요청을 보낼 수 있다.
- 마지막으로 next를 호출하여 요청이 계속해서 라우트에서 처리되도록 한다.

이제 서버를 재시작하고 요청을 보내면 잘 작동한다.
===========================================================================================
366_POST 요청 보내기

CodePen의 JS에 코드를 추가한다.
    postButton.addEventListener('click', () => {
    fetch('http://localhost:8080/feed/post', {
        method: 'POST',
        body: JSON.stringify({
            title: 'A Codepen Post',
            content: 'Created via Codepen'
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(resData => console.log(resData))
        .catch(err => console.log(err));;
    });
- body에 데이터를 담아서 보낸다. 이때 그냥 보내면 Request Headers의 Content-Type이 text/plain이다. application/json이 되어야 하며 Request Payload에서는 JSON 데이터가 되어야 한다. 자바스크립트 객체는 전송이나 처리가 불가능하다.
- JSON.stringify는 자바스크립트에서 기본으로 제공하는 메서드로 자바스크립트 객체를 json으로 변환한다. 사용하면 Payload가 json 포맷으로 바뀐걸 볼 수 있다.
- 본문 설정 외에도 클라이언트에 headers를 추가하여 Content-Type이 application/json임을 서버에 알린다. 

설정을 마치면 형식을 설정했고 콘텐츠 유형을 서버에 통보했으므로 데이터가 제대로 전송 및 추출되어 생성된 게시물에 title, content가 표시된다. 
'Access-Control-Allow-Headers'를 주석처리 해보면 Content-Type 설정이 허용되지 않으므로 실패하게 된다.

이것이 클라이언트와 서버 간의 소통 방법이다. 물론 클라이언트 코드는 클라이언트에 따라 다르다. 이것은 fetch API를 사용한 자바스크립트 코드이다. 비동기식 요청을 보내는 다른 방법으로 Axios와 같은 라이브러리로 AJAX 요청을 보낼 수 있다. 모바일 앱을 개발한다면 Android나 Swift에서 이러한 요청을 전송할 때 완전히 다른 헬퍼 메서드를 사용할 수도 있다.

POST 요청을 보내면 실제로 두 개의 요청을 보내고 있음을 알 수 있다. 두 번째 요청이 우리가 명시한 POST 요청이다. 첫 번째 POST 요청은 무엇일까? 들여다보면 응답이 그냥 POST이고 헤더는 General 부분에 메서드가 OPTIONS임을 알 수 있다. 브라우저가 자동으로 전송한 것이다.
이 요청의 역할은 브라우저에서 우리가 전송하려는 요청이 POST 요청인지 확인한다. 허용된 메서드에 OPTIONS를 명시해도 되지만 자동으로 전송하므로 필수는 아니다.

- OPTIONS 요청을 받은 서버가 응답 헤더에 허용하는 옵션('Access-Control-Allow-')을 포함해서 전송한다. 브라우저는 응답 헤더의 옵션을 확인해 허용되지 않은 요청은 504 에러 발생, 허용된 요청은 전송한다.