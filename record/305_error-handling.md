Error Handling

306_오류의 유형과 처리

How Bad Are Errors?

오류는 얼마나 나쁜 걸까? 사실 오류가 났다고 앱이 고장 나는 건 아니다. 오류를 복구할 수 있는 방법이 많다. 예를 들어 사용자에게 어디가 잘못됐는지 알려주고 다시 시도하라고 알리는 등 오류를 알맞게 처리하면 된다.

Different Types of Errors

오류에는 여러 유형이 있다. 기술적인 오류 혹은 네트워크 관련 오류는 우리가 시스템 관리자가 아닌 이상 큰 영향을 주지 않는다. "예견된" 오류도 있는데 공식 용어는 아니고 강의자가 임의로 지은 이름이다. 또한 코드에 일어나는 버그나 논리적 오류가 있다. 

1. Technical/Network Errors: e.g. MongoDB server is down -> Show error page to user

기술적 오류가 일어나서 MongoDB 서버가 다운되면 DB와의 어떤 상호 작용도 실패할 것이다. 이 경우 우리가 할 수 있는 게 얼마 없다. 가장 좋은 방법은 사용자에게 오류 페이지를 통해 서버 측에 문제가 생겼다는 사실을 알리고 문제를 해결하고 있다는 뜻을 전하는 것이다. 또 시스템 이면에서 관리자에게 이메일을 보내는 등의 조치를 취할 수 있다.

2. "Expected" Errors: e.g. File can't be read, database operation fails -> Inform user, possibly retry

예견된 오류는 특정 연상에 일어날 수 있다. 파일이나 DB와 상호 작용할 때도 흔하지 않고 문제가 있도록 예견된 정도는 아니지만 오류가 일어날 확률이 있다. 한 파일에 동시에 너무 많은 요청이 있다면 말이다. 이럴 때는 사용자에게 다시 시도해 보라고 알리는 것이 좋다. 예를 들어 바로 전 섹션에서 구현했던 유효성 검사 오류가 예견된 오류의 예시이다. 사용자가 유효하지 않은 데이터를 입력하는 경우 사용자에게 알리고 다시 시도하도록 만드는 것이다.

3. Bugs/Logical Errors: e.g. User object used when it doesn't exist -> Fix during development

마지막은 코드에 생기는 오류로 아예 존재할 수 없거나 적어도 모든 상황에 존재할 수 없는 사용자 객체를 사용하려는 경우가 있다. 이런 오류는 개발 중에 테스트를 거쳐 수정해야 하며 앱 가동 중에 처리하지 않아야 한다. 더불어 사용자나 네트워크의 책임이 아니므로 사용자에게 오류 메시지가 나타나지 않아야 한다.

Working with Errors

서로 다른 오류를 어떻게 처리할까?
           Error is thrown                         No error is thrown
           |            |                                   |
Synchronous Code:   Asynchronous Code:               Validate values
try-catch           then()-catch()                          |
    |-----------------------|                    |---------------------|
                |                           Throw error         Directly handle "error"
    |-----------------------|                    |                     |
Directly            Use Express error            |                     |
handle error        handling function            |                     |
    |                       |                    |                     |
    --------------------------------------------------------------------
                                |
    ---------------------------------------------------------------------------
    |                           |                                             |
Error Page(e.g. 500 page), Instended Page/Response with error information, Redirect

우선 노드 앱의 기술적 객체인 오류를 나타내는 경우가 있다. 즉, 나타낼 수 있는 내장된 오류 객체가 있다. 자바스크립트 언어의 기능이기도 한데 기본적으로 모든 프로그래밍 언어가 이 기능을 가지고 있다. 
반면 기술적 오류가 없는데도 코드를 이어갈 수 없는 경우가 있다. 예를 들어 존재하지 않는 이메일 주소로 사용자를 로그인하려고 하는 건 기술적 오류는 아니다. 즉, 오류가 나타나진 않지만 더 이어나갈 수 없기 때문에 검사를 해서 알맞게 처리해야 한다. 

오류가 나타나게 되면 코드를 테스트해서 오류를 잡아낼 수 있는 특정 툴을 사용하여 오류를 처리한다. 동기식 코드의 경우 try-catch 블록을 사용하고 promise가 있는 비동기식 코드의 경우 then-catch 블록을 사용한다. 두 시나리오 모두 마지막에는 오류를 직접 처리할지 Express에 내장된 오류 처리 미들웨어 매커니즘을 사용할지 정할 수 있다.
오류가 나타나지 않은 경우 if 검사를 통해 값을 확인해서 오류로 나타낼지 정해야 한다. 오류를 나타내도록 결정하면 왼편에 있는 오류 처리 과정을 진행하고 기술적 오류가 아닌 "오류"를 직접 처리하고자 한다면 빠진 입력 데이터로 계속할 수 있는 코드를 추가한다.

두 경우 모두 사용자와 통신할 수 있는 여러 방법이 있다. 사용자에게 문제가 있음을 알리는 오류 페이지를 반환하는 건 최후의 수단으로 사용해야 하는데 사용자가 모든 입력값을 잃고 이어갈 수 없기 때문이다. 혹은 사용자가 있던 페이지를 반환하며 오류 정보를 줄 수도 있다. 유효성 검사 강의에서 한 것처럼 사용자가 있던 페이지를 반환할 때 입력값은 모두 유지하면서 오류 메시지만 추가하는 것이다.
리다이렉트하는 방법도 있다. 사용자가 방문 인증이 되지 않은 페이지에 접근하려고 하면 리다이렉트하는 것이다.
============================================================================================
307_현 프로젝트의 오류 처리 분석

사실 앱에 이미 오류 처리를 많이 하고 있다. app.js를 보자. 요청 초반 사용자를 찾는 부분에 세션으로부터 사용자를 가져오고 user 객체에 저장할 때 catch 블록이 있다.
컨트롤러에도 몇 가지 오류를 처리하고 있다. auth 파일에서 로그인 할 때 입력한 이메일 주소가 존재하는지 확인한다. 만약 없다면 오류 코드와 함께 같은 페이지를 반환하면서 입력값이 유효하지 않다는 정보를 전달한다. 유효성 검사 논리에서도 마찬가지다. routes에서 express-validator 패키지로 내장된 검증자 기능을 추가했다. 이때 패키지가 이면에서 오류를 나타내고 처리하며 기술적인 오류 문제가 아닌 오류를 모을 수 있도록 한다. 패키지가 관리하는 데이터인 오류를 모아서 직접 처리하였다. if 검사를 추가해 데이터를 그대로 이어갈 수 있는지 확인한다. 이때 기술적 오류는 없다. 이 경우에는 유효성 검사 코드를 직접 확인하고 진행한다. 
하지만 사용자 지정 검증자(Validator)를 살펴보면 비밀번호가 일치하지 않을 시 기술적 오류가 나타난다. 보통은 Express가 처리할 텐데 express-validator 패키지가 처리하기도 한다.
============================================================================================
308_오류 - 이론

위에서 살펴본 사용자 지정 검증자에 있는 오류는 express-validator 패키지에 의해 배후에서 처리될 것이다. 그럼 배후에서 처리되지 않은 코드를 추가해보자. 

error-playground.js 라는 임시 파일을 추가하고 상수 sum = (a, b)를 만든다. console.log에 인수를 하나만 전달하고 실행하면 숫자도 오류도 아닌 NaN이 나온다. 기술적 오류 객체가 아니다. 
if 문으로 둘 다 true라면 a+b를 반환하고 아니라면 내장된 키워드인 throw에 내장된 객체 new Error을 입력하고 Invalid arguments를 전달한다. 파일을 다시 실행하면 오류 메시지가 출력된다. 고유의 오류 메시지 아래에는 호출 스택이 있어서 오류가 어떤 코드 라인에 어떤 함수에서 일어났고 오류 전에 호출된 코드를 알려준다. 전에 봤던 처리되지 않은 오류다.
내장된 기능으로 오류를 throw하면 노드나 나양한 패키지 역시 배후에서 오류를 나타낸다. 이런 오류를 처리하지 않으면 앱이 충돌(Crash)하여 브라우저가 멈추고 새로 고침 아이콘이 계속 돌아가는데도 아무 일이 일어나지 않는다. 처리하지 않은 오류가 있어서 서버가 충돌한 것이다. 

그럼 오류를 어떻게 핸들링할까?
코드를 한 줄씩 바로 실행하는 동기식 코드를 위한 해결책이 있다. 파일과 상호 작용하지 않거나 요청을 발송하지 않는 경우 내장 언어 기능인 try-catch로 코드를 랩핑한다. try에 어떤 코드를 입력하고 catch로 나타나는 오류를 잡는다. catch 다음에는 오류를 처리하는데 console.log('Error occurred!')나 console.log(error)를 실행할 수 있다.
충돌하지 않고 자동으로 로그를 남기는데 이러면 다름 코드를 이어갈 수 있다. 따라서 오류를 핸들링하여 다음 코드를 이어가는 데 도움을 주는 것이 좋다. 
Node Express 앱에서는 오류 응답을 보내 충돌 없이 유효한 페이지를 렌더링하지만 사용자에게 뭔가 잘못됐다고 알릴 수 있다. express-validator 패키지가 오류를 throw 하기 때문이다. auth 파일에서 throw new Error를 하면 express-validator이 오류를 잡고 오류 배열에 추가해 잡아낸 오류 리스트를 보여준다. 

비동기식 연산의 경우 then()-catch() 프로미스로 오류를 처리한다. catch는 그 블록 전에 나타난 모든 올를 모으기 때문에 한 체인 안에 then 블록 이외에도 다른 블록이 있다면 어느 then 블록이던 then 블록에서 실행된 어느 연산이던 모든 오류를 잡아낸다.
============================================================================================
309_코드에 오류 만들기

app.js에서 기술적 오류 객체는 다루지 않고 있지만 session.user가 있는지 확인하고 있으며 없는 경우에 대한 해결책도 가지고 있다. 만약 if문이 없었다면 세션 객체 없이 사용자를 찾을 테고 그러면 앱이 충돌할 것이다. 

세션에 사용자가 저장되었어도 찾지 못할 수도 있다. 데이터베이스 중간에서 사용자가 삭제되었을 수 있다. 
    if (!user) {
        return next();
    }
그러므로 if로 사용자의 존재 유무를 확인하여 만약 존재하지 않는다면 req.user를 저장하지 않고 다음으로 넘어간다. user 객체에 undefined 객체를 저장하는 것을 방지하고 사용자 없이 다음 코드를 진행하기 위함이다.
catch 블록에 로깅은 별로 유용하지 않다. throw new Error로 err 객체를 랩핑하는 것이 더 낫다.
    .catch(err => {
        throw new Error(err);
    });
============================================================================================
310_오류 페이지 반환

app.js에 추가한 throw new error의 기능을 알아보자. 컨트롤러 admin에서 코드를 변경한다. 제품을 새로 생성할 떄 _id를 추가하여 DB에 저장된 제품 ID를 입력한다.
    _id: new mongoose.Types.ObjectId('630f18086a916046de70a573'),
new 키워드를 추가하면 이미 존재하는 ID의 새 제품을 생성하기 때문에 이건 반드시 실패한다. 실행하면 MongoDB가 중복 키 문제로 오류를 도출하여 앱이 충돌하였다. 

해당 catch 블록에서 에러를 출력하고 'An error occurred'를 출력해보면 콘솔에 출력된다. 즉 catch 블록이 실행됨을 뜻하는데 오류를 처리할 가능성이 생겼으므로 좋은 것이다. 여기에 500 오류 페이지를 반환할 수 있다. 또한 사용자를 다른 페이지로 리다이렉트하거나 Add Product 페이지를 렌더링하고 기존 입력값을 유지할 수 있는데 이게 일시적인 문제라면 타당한 방법이 될 수 있다.
    return res.status(500).render('admin/edit-product', {
        ...
        errorMessage: 'Database operation failed, please try again.',
        ...
    });

사용자에게 오류 메시지를 전달하고 사용자는 다시 시도할 수 있기 때문에 확실히 더 나은 오류 처리이다. 하지만 이 부분도 계속 실패할 텐데 코드에 본질적인 문제가 있기 때문이다. 임시 네트워크 문제였다면 이정도로 충분할 것이다. 종종 더 큰 문제에서 동일한 페이지를 또다시 반환하는 이 솔루션은 사용하지 않는다.

대신 진짜 오류 페이지를 출력하여 사용자에게 문제가 있음을 알린다. 404.ejs 파일 옆에 500.ejs 파일을 추가한다. 이제 발견되지 않은 라우트보다 더 큰 기술적 문제에 대한 오류 메시지를 렌더링하는 페이지를 만들 것이다. 코드는 404.ejs 뷰에서 복사해온다.
    ...
    <p>We're working on fixing this, sorry for the inconvenience!</p>
    ...
이제 500.ejs 라우트가 있고 이 페이지를 반환하기 위해 error 컨트롤러에 get500 액션을 추가한다. 
    exports.get500 = (req, res, next) => {
        ...
    };

그 다음 app.js에 라우트를 추가한다. app.js에는 미리 처리되지 않는 모든 미들웨어들에 대한 모든 페이지에 get404를 사용하므로 404 라우트 이전에 추가해야 한다.
    app.get('/500', errorController.get500);

그리고 admin 컨트롤러의 catch 블록에 리다이렉트를 추가한다.
    res.redirect('/500');
이제 500 오류가 발생하는 경우 해당 라우트로 리다이렉트 된다.
============================================================================================
311_Express.js 오류 처리 미들웨어 사용

위에서 500 오류 페이지로 리다이렉트하는 코드를 사방에 복제하는 방식은 거의 하지 않는다. 그보다는 내장된 throw 함수 내지는 키워드로 오류 객체를 사용해 새로운 오류를 출력한다. catch 블록 내부에서 실시하고 이 경우 postAddProduct가 해당된다. 먼저 error 객체를 new Error로 생성하고 나서 오류 메시지를 전달하여 더 자세하게 오류를 출력할 수 있다. 아니면 오류 객체 자체를 담아도 좋다.
    const error = new Error(err);
여기에 새로운 필드를 추가한다. httpStatusCode를 500으로 설정한다.
    error = httpStatusCode = 500;
- next를 반환하는데 오류를 next의 인수로 전달하는 것이 가능하다.
    return next(error);

전에는 app.js에서 next를 호출했을 때는 다음 미들웨어가 대체할 수 있도록 하는 인수 없이 그냥 호출했었다. 오류를 인수로서 전달한 next를 호출한 경우 express에게 오류가 발생했음을 알리고 이로써 다른 모든 미들웨어를 건너 뛰고 오류 처리 미들웨어로 이동한다. 
이제 미들웨어를 정의한다. app.js에서 서버 시작 바로 전에 미들웨어를 추가한다.
    app.use((error, req, res, next) => {
        // res.status(error.httpStatusCode).render(...);
        // res.redirect('/500');
        res.status(500).render('500', {
            ...
        });
    });
- error.httpStatusCode: 여기에서 상태 코드의 역할은 이 시나리오에서는 항상 500으로 리아디렉트하고 있지만 리다이렉트하는 대신 페이지를 렌더링하는 시나리오도 가능하다. 아니면 JSON 데이터를 반환할 수도 있다. 그 때를 위해 응답 코드로서 설정할 수 있다. 
일반적으로 여긴 절대로 도달할 수 없는데 catchAll 미들웨어(get404)가 먼저 있기 때문이다. 지금까지 사용한 미들웨어는 3가지 인수(req, res, next)를 사용한다. Express는 4개의 인수를 가진 미들웨어, 소위 오류 처리 미들웨어도 알고 있으며 첫 번째 인수는 error가 된다. 이후 세 인수가 따라온다. 
Express는 이것이 특별한 미들웨어라는 것을 충분히 탐지하며 오류가 전달된 next를 호출하는 경우 다른 모든 미들웨어를 건너뛰고 이 오류 처리 미들웨어로 곧바로 이동한다. 따라서 이제 500 페이지를 렌더링하거나 간단히 /500로 리다이렉트할 수 있다.
* 하나 이상의 오류 처리 미들웨어가 존재한다면 일반 미들웨어처럼 위에서 아래로 순서대로 실행한다.

이제 postAddProduct의 catch 블록 내부 코드를 복사하여 어느 함수로든 리팩터할 수 있다.

이 에러 핸들러는 404 오류에 대해 실행되지 않는다. 해당 상황은 수동으로 처리하는데 엄밀히 말하면 404 오류는 단지 유효 URL이며 catchAll 핸들러로 캐치하여 404 페이지를 렌더링하는 것뿐이다. 이쪽 지점에서 생성되는 기술적 오류 객체가 아닌 것이다.

312_앱 개선

이제 postAddProduct의 catch 블록을 모든 catch 블록에 적용할 것이다. 리다이렉트가 필요한 일부를 제외하고 실질적으로 콘솔로 로그를 기록하는 모든 catch 블록에 적용한다.
next문을 쓰고 이후 다른 코드가 실행되지 않도록 next(error)를 return 하는게 핵심이다.
이건 사실상 모든 방법이 시래했을 때 최후의 수단이다. 최소한 앱이 충돌하였을 때 사용자에게 아무것도 알리지 않는 상황보다는 낫기 때문이다.
============================================================================================
313_오류 처리 미들웨어의 올바른 사용

app.js 파일의 미들웨어의 catch 블록에 있는 throw new Error는 어떤 기능을 할까? 새로운 더미 에러로 에러를 얻어보자.
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
  .then(user => {
      throw new Error('Dummy!');
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});
로그인을 해보면 무한히 로드하며 앱이 충돌 중이다. 중요한 점은 여기서 에러가 발생해도 호출되는 일반 오류 처리 미들웨어로 이어지지 않는다. 이것이 올바른 이유는 비동기식 코드 내지는 promise 내부에 있기 때문이다. 우린 then이나 catch 블록 안에 있고 여기로 오류를 보내게 되면 Express 오류 처리 미들웨어에 접근하지 않는다. 

흥미로운 점은 비동기 코드 외부 즉, 코드가 동기적으로 실행되는 promise, then이나 catch 블록 또는 callback 외부에서 오류를 출력한다. 
app.use((req, res, next) => {
    throw new Error('Sync Dummy');
    if (!req.session.user) {
    ...
});
즉 이렇게 동기식 코드를 보내면 어떤 것 promise나 callback 등 내부에도 중첩되지 않은 일반 함수를 보내고 새로 고침하면 500 페이지를 로드하려고 했으나 실패한다. 이유는 단순하다.
미들웨어를 사용자를 검색하는 곳에 배치했는데 여기서 오류를 보내지만 이것은 모든 들어오는 요청마다 실행된다. 
app.use((error, req, res, next) => {
    // res.status(error.httpStatusCode).render(...);
    res.redirect('/500');
});
여기로 리다이렉트하면 새로운 요청을 발송하기 때문에 무한 루프에 들어오는 것이다. 여기서 다시 실행하면 오류를 보내고 오류 처리 미들웨어로 가서 새 요청을 작동시킨다.

솔루션은 /500으로 리다이렉트하지 않고 렌더링 코드를 즉시 실행하는 것이다.
res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
});
즉 get500 컨트롤러 액션의 코드를 사용하여 오류를 렌더링한다. 이 상태에서 새로 고침하면 csrf 토큰 에러가 생긴다. 이건 들어오는 요청을 기반으로 생성될 수 없기 때문이다. 왜냐하면 csrfToken을 설정하기 전에 요청이 미들웨어에서 문제가 있기 때문이다. 순서를 변경하여 사용자와 뭔가 작업하기 전에 반드시 이 토큰을 설정하도록 한다.

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});
- 이 미들웨어를 user를 저장하는 미들웨어 위에 작성한다.

또한 주목할 점은 throw new Error('Sync Dummy'); 여기서 에러를 보내는데 여전히 맨 밑에 있는 전역 오류 처리 미들웨어에 접근한다는 것이다. 그 이유는 동기식 위치 즉, callback과 promise 외부에서 오류를 보내면 Express가 탐지하고 다음 오류 처리 미들웨어를 실행한다. 그러나 비동기식 코드 즉, then/catch/callback 내부에서는 이게 작동하지 않는다. 이 내부에서는 오류가 포함된 next를 사용해야 한다.
app.use((req, res, next) => {
    throw new Error('Sync Dummy');
    ...
    .catch(err => {
        next(new Error(err));
    });
});
비동기식 코드 스니펫 내부에서는 next를 통해 해당 오류를 감싸고 외부에서는 그냥 오류를 보내면 된다. 

숙지할 점은 먼저 오류 처리 미들웨어를 통해 무한 루프가 발생하는 상황을 피해야 한다는 점이다.
두 번째로 동기식 코드에는 오류를 출력할 수 있지만 promise, then, catch, callback 내부에서는 오류 주변의 next를 사용해야 한다.
============================================================================================
314_Errors & Http Response Codes

http 상태 코드는 왜 사용하는 것일까? 
이 코드들은 브라우저로 전달하는 추가 정보로서 작동의 성공 여부를 브라우저가 이해하는 것을 돕는다. 클라이언트 측 자바스크립트는 많은 앱이나 모바일 앱을 작성하는데 완성된 HTML 페이지 대신 데이터만을 가져오는 경우 상태코드는 어떤 종류의 오류가 발생했는지 이해할 수 있도록 돕는다. 특정 종류의 오류를 특정 종류의 상태 코드로 맵핑하기 때문이다.
예를 들어 2xx 상태코드는 항상 성공 상태 코드이다. 작동이 성공했음을 나타낸다.
3xx은 리다이렉션 발생, 4xx은 뭔가 일어났음을 보여주는데 클라이언트의 오류, 예를 들면 잘못된 데이터가 형식에 입력된 경우가 그것이다. 
5xx는 서버 측 오류 발생을 나타낸다.
성공적 사례의 경우 200, 201이 있는데 차이점은 일반적으로 DB에 리소스를 생성한 경우 201을 사용한다. 필수는 아니지만 사용 가능한 패턴이고 자주 볼 수 있다. 300, 301은 리다이렉션에서 사용되는 코드인데 이 리소스가 영구적으로 혹은 임시로 이동했는지 알려준다. 
이것 외에도 많은 상태 코드가 있고 문서에서 확인할 수 있다.

이 앱에서는 유효성 검증에 422를 사용하고 다른 부분도 괜찮은 코드를 반환하고 있다. 최소한 좋은 관행을 유지하고 있다.
is-auth.js에서는 로그인하지 않은 상태에서 뭔가 작업하려고 할 때 리다이렉트하는 곳이다. 마찬가지로 리다이렉트하기 때문에 300 코드를 보내지만 status(401)도 추가하여 무엇이 문제인지 분명이 해 주돼 리다이렉트로 인해 300 코드로 덮어씌우게 된다. 일단 이대로 둬도 좋고 추후에 RESTful API의 경우 서버 주변으로 돌아가지 않으므로 리다이렉트하지 않는데 그 때는 400 코드를 사용한다.

핵심 내용은 상태 코드가 앱의 충돌을 의미하는 것은 아니다. 뭔가 잘못됐기 때문에 추가 정보를 전달할 뿐이다. 브라우저도 이 사실을 알고 있다.
============================================================================================
315_사용 가능한 상태 코드

자세한 내용은 MDN에서 확인할 수 있다.
https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

짧게 요약한 것

1×× 정보전달

100 Continue

101 Switching Protocols

102 Processing

2×× 성공

200 OK

201 Created

202 Accepted

203 Non-authoritative Information

204 No Content

205 Reset Content

206 Partial Content

207 Multi-Status

208 Already Reported

226 IM Used

3×× 리디렉션

300 Multiple Choices

301 Moved Permanently

302 Found

303 See Other

304 Not Modified

305 Use Proxy

307 Temporary Redirect

308 Permanent Redirect

4×× 클라이언트 오류

400 Bad Request

401 Unauthorized

402 Payment Required

403 Forbidden

404 Not Found

405 Method Not Allowed

406 Not Acceptable

407 Proxy Authentication Required

408 Request Timeout

409 Conflict

410 Gone

411 Length Required

412 Precondition Failed

413 Payload Too Large

414 Request-URI Too Long

415 Unsupported Media Type

416 Requested Range Not Satisfiable

417 Expectation Failed

418 I'm a teapot

421 Misdirected Request

422 Unprocessable Entity

423 Locked

424 Failed Dependency

426 Upgrade Required

428 Precondition Required

429 Too Many Requests

431 Request Header Fields Too Large

444 Connection Closed Without Response

451 Unavailable For Legal Reasons

499 Client Closed Request

5×× 서버 오류

500 Internal Server Error

501 Not Implemented

502 Bad Gateway

503 Service Unavailable

504 Gateway Timeout

505 HTTP Version Not Supported

506 Variant Also Negotiates

507 Insufficient Storage

508 Loop Detected

510 Not Extended

511 Network Authentication Required

599 Network Connect Timeout Error