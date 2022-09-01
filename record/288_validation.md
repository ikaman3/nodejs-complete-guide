Forms, User Input & Validation

289_Why Validate?

                                    User <-------
                                     |          |
                                   <form>       | Reject Input
                                     |          |
       Controller / Middleware - Validation ----|
                                     |
                            <Your Node Code> (Model)
                                     |
                            Database / File

사용자 입력 유효성 검사는 매우 중요하다. 왜 앱에 데이터나 입력 유효성 검사를 해야할까?
웹 사이트와 상호작용하는 사용자가 있을 때 일반적인 웹 앱에는 많은 폼이 존재한다. 예를 들어 이 프로젝트에는 회원가입, 로그인, 상품 추가 폼이 있다. 앱이 커질수록 더 많은 사용자 데이터가 필요하고 사용자 또는 웹 사이트 방문자가 상호작용할 폼이 더 필요하게 된다. 
결국 이 폼이 get/post 요청으로 제출되면 폼에서 설정한 대로 백엔드로 요청이 전송된다. 백엔드, 즉 Node.js 코드에서 DB와 상호작용하거나 일반 파일에 데이터를 기록하게 된다. 그러나 최종적으로는 받은 데이터를 저장해야 하는데 이 과정에서 문제가 발생할 수 있다.
이 앱에는 데이터 유효성 검사 과정이 없고 따라서 유효하지 않은 이메일 주소로 로그인을 시도하더라도 허용된다. 사용자가 잘못된 정보를 입력하는 것을 막지 않는다. 다른 부분도 마찬가지다. 

서버에서 요청을 처리하기 시작하는 부분 즉, DB에 저장하기 이전에-Node.js 코드의 시작부분에- 유효성 검사 단계를 추가해야 한다. 이 검사에 성공하면 DB나 파일에 데이터를 기록할 수 있게 되고 Node 코드로 넘어갈 수 있게 되며 실패할 경우 입력을 거부하고 오류를 수정하라는 정보를 사용자에게 반환한다.
============================================================================================
290_How to Validate

Error Message + Keep old Input ---------> User Input(Form Input)
            ^                                   |
            |                                   |
    Validation Fails <--------------------- Validate on Client-Side(Optional)
            |                                   |
            |                               Validate On Server-Side(Required)
            |                                   |
    Validation Fails <--------------------- Server(Node App)
                                                |
                                            Database ----> Built-in Validation(Optional)

폼에 데이터를 입력하는 사용자가 있고 이를 처리하기 위한 서버가 있다. 이때 유효성 검사를 추가할 수 있는 몇몇 부분이 존재한다.
하나는 자바스크립트를 활용해 클라이언트 측에서 유효성 검사를 할 수 있다. 요청을 보내기 전에 입력에서 사용자의 타이핑 같은 키 이벤트를 감지해서 사용자가 폼을 작성하는 도중에 입력을 검사하는 자바스크립트 코드를 작성할 수 있다. 자바스크립트로 런타임에서 DOM을 변경할 수 있으니 오류를 표시할 수 있고 서버로 전송하기 전에 브라우저에서 바로 오류를 띄울 수 있다. 이는 사용자 경험을 크게 개선해준다. 이부분은 완전히 선택 사항이다. 사용자 경험을 개선해줘서 사용을 고려할만 하다. 그러나 클라이언트 측 자바스크립트를 사용해 브라우저에서 코드가 실행되므로 사용자가 코드를 볼 수 있다. 따라서 코드를 변경하거나 자바스크립트를 끌 수 있으므로 이는 어디까지나 선택 사항이다. 잘못된 데이터가 서버에 오는 것을 막아주는 보호 기능이라고 할 수 없다. 즉, 안전하다고 할 수 없다.
다음 선택지는 서버 측에서 유효성을 검사하는 것이다. 이 강의에서는 이부분에 초점을 맞춘다. 사용자가 코드를 보거나 수정할 수 없으므로 이렇게 해야 안전하다. 브라우저가 아니라 서버에서 진행되므로 사용자가 코드로 기능을 끌 수도 없다. 여기가 필수적으로 유효성 검사를 추가해야 하는 부분이며 유효하지 않은 값을 필터링하게 된다. 따라서 이는 필수이다. 이렇게 노드 앱에서 유효한 데이터만 처리하도록 할 수 있으며 최종적으로 저장할 때 올바른 데이터를 저장할 수 있다.
또 하나는, 거의 모든 DB 엔진에는 내장된 유효성 검사 기능이 있다. 이것은 최후의 수단으로 사용할 수 있지만 우수한 서버 측 유효성 검사 기능을 갖추었다면 필요하지 않으므로 선택사항이다. 서버 측에서 잘 필터링하면 잘못된 데이터가 DB에 도달하는 일은 없다.

어떤 접근법을 선택하더라도 필수인 부분은 서버 측 유효성 검사이다. 또한, 무엇을 선택하더라도 검사에 실패할 수 있으므로 오류 알림을 준비해야 한다. 이때 절대 페이지를 새로 고침하지 않고 사용자가 입력한 데이터를 보존해야 한다. 잘못된 정보를 입력했을 때 이메일이나 비밀번호가 잘못되었다는 알림과 함께 전부 다시 입력해야 한다면 매우 끔찍한 사용자 경험이 된다.
============================================================================================
291_설정 및 기본 검증

유효성 검사를 추가할 만한 첫 예시로는 로그인 및 회원가입 페이지를 들 수 있다. 예를 들어 Signup 페이지에서 이메일 주소의 @ 기호가 있고 도메인명으로 끝나는 유효한 이메일 주소인지 검증한다. 비밀번호는 최소 6자리 이상이어야 한다거나 원하는 기준에 맞는지 검증하고 Confirm Password가 Password와 일치하는지도 검증한다.

유효성 검사를 위해 제3자 패키지를 사용한다.
    npm install --save express-validator

일반적으로 post 또는 get 이외의 라우트에 대해 유효성 검사를 하게 된다. 사용자가 데이터를 보낼 때 검사가 필요한데 get 라우트는 해당되지 않기 때문이다. 

routes/auth =>
    // const expValidator = require('express-validator/check');
    const { check } = require('express-validator');
- express-validator은 몇 개의 하위 패키지로 구성되어 있는데 이 중 유효성 검사 논리 추가에 사용할 check 패키지가 필요하므로 이 하위 패키지를 임포트한다.
* 해당 부분은 업데이트되었다. check 패키지를 임포트하면 콘솔에 require('express-validator')를 사용하라는 에러 메시지가 출력되므로 밑의 코드를 사용하면 된다.
- 이때 차세대 자바스크립트 구문을 사용할 수 있는데 임포트하려는 exp-validator은 자바스크립트 객체이므로 등호 왼쪽에 중괄호만 쓰는 구조 분해(Destructuring) 기능을 사용하면 된다. 그 다음 이 객체에서 추출하려는 속성의 이름을 입력한다. 여기서는 check이다. 결국 이 패키지에서 임포트한 check 함수를 얻게 된다.

라우트에 유효성 검사를 추가하는 방법은 해당 라우트에 미들웨어를 하나 만들면 된다. 
    router.post('/signup', check('email').isEmail(), authController.postLogin);
- check 함수는 최종적으로 미들웨어를 반환한다. 여기에 검사하려는 필드 이름 또는 필드 배열을 입력한다. signup 뷰에서 email 필드가 있으므로 받을 요청에서 이름이 email이 된다. 이렇게 하면 express-validator 미들웨어에 이 email 값의 유효성을 검사한다는 것을 알리게 된다.
- .isEmail(): 그 다음 Express.js에서 처리할 수 있는 미들웨어를 반환하는 메서드를 호출한다. 이 메서드는 이 패키지를 사용해서 들어오는 요청의 email 필드를 검사한다. body, query parameter, header, cookie에서 해당 필드를 찾고 그 값이 유효한 이메일 주소인지 검사한다. 

다음은 컨트롤러로 간다.
controllers/auth => 
    const { validationResult } = require('express-validator');
- validationResult: 이와 같은 유효성 검사 미들웨어에서 발생했거나 저장한 오류를 모두 모아주는 함수다. 
이제 미들웨어를 추가한 postSignup 라우트로 간다. 
auth => postSignup
    const errors = validationResult(req);
- request에서 validationResult를 호출하면 오류를 추출해서 errors 상수에 저장한다. 그리고 그 요청에서 라우트에서 추가한 express-validator 미들웨어가 오류를 불러올 수 있도록 저장한다. routes 폴더의 auth.js 파일의 check('email').isEmail() 미들웨어로 오류를 수집하게 된다. 이 미들웨어는 발견한 오류를 errors 객체에 저장한다. 이 validationResult 함수가 요청에서 관리하는 errors 객체를 수집해서 여기의 errors 상수에 모아준다.

이제 errors 상수를 사용해서 오류가 있는지 확인할 수 있다. 
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            ...
            errorMessage: errors.array()[0].msg
        });
    }
- errors.isEmpty(): 오류 유무 여부에 따라 true/false를 반환한다. 비었으면 true 아니면 false다.
- .status(422): 유효성 검사가 실패했음을 나타내는 일반 상태 코드 422를 상태 코드로 설정하는 응답을 반환한다. 에러 상태 코드이다.
- 오류도 추가한다. errors를 출력하되 array 함수를 호출하여 발생한 오류 배열을 반환한다. 이때 errors는 객체 배열이므로 첫 번째 요소의 msg를 추출한다. 

테스트를 위해 기본 브라우저 유효성 검사를 잠시 비활성화한다. 뷰에서 form 태그에 novalidate를 추가하면 검사가 비활성화된다. 사용자 경험을 개선하는 좋은 클라이언트 측 유효성 검사이므로 기본적으로는 추가하는게 좋다. 주의할 점은 input이 아니라 form에 추가해야 한다.
============================================================================================
292_검증 오류 메시지

오류 메시지의 커스터마이징도 가능하다. 미들웨어를 추가한 장소인 routes 파일에서 진행한다.
    ... .withMessage('Please enter a valid email.')
- .isEmail 다음에 .withMessage 함수를 추가하여 항상 바로 앞의 유효성 검사 논리를 참조한다. 다수의 확인을 이 뒤로 추가할 수 있다. isAlphanumeric으로 숫자와 문자만을 포함하는 검사도 가능하다. 여러 개를 추가할 수 있지만 message의 경우 바로 앞의 유효성 검사 메서드만을 참조한다. 
============================================================================================
293_빌트인 & 커스텀 검증자

isEmail 검증자 이외에도 선택할 수 있는 내장 검증자의 종류는 많은데 express-validator 공식 문서에서 확인할 수 있다. 커스텀 검증자도 사용할 수 있다. isEmail뿐만 아니라 특정 이메일을 검증하고 싶다고 하자.
    .custom((value, {req}) => {
        if (value === 'test@test.com') {
            throw new Error('...');
        }
        return true;
    })
- custom을 추가하면 검증자가 끝부분에서 함수로써 우리가 확인하는 필드의 값, 즉 이메일 필드의 값을 수신하는 함수로써 기능하며 부차적으로는 이것이 전달된 위치라던가 경로 또는 요청 객체 등을 추출할 수 있는 객체를 수신하여 필요한 경우 요청으로부터 더 많은 내용을 추출할 수 있다. 
- 이 함수에서 유효성 검사가 실패한 경우 오류를 출력한다. 따라서 if문을 설정하는 더미 논리를 추가한다. 이 if문은 해당 이메일 주소를 허용하지 않는 논리이다. 
- 성공한 경우 true를 반환해야 다음을 진행할 수 있다. 
============================================================================================
294_검증자 추가로 알아보기

더 많은 검증자를 추가하자. 예를 들어 암호는 6글자 이상으로 설정하고 싶다. 
이를 위해 위의 check 미들웨어 다음에 check 함수 호출을 추가한다. 이걸 배열로 감쌀 수도 있다. 이것은 선택 사항이지만 확인 사항들을 일종의 그룹으로 묶어주고 이 블록 전체가 유효성 검증에 관한 내용이라는 걸 더욱 분명하게 해준다.
    router.post('/signup', [ check('email').isEmail()..., check() ], ...);

check 대신 다른 함수도 사용할 수 있는데 check는 바디, 매개변수, 쿼리 매개변수 등을 확인하지만 body, param, query, cookie, header 등을 추가하여 들어오는 요청 중에서 특정 기능만 확인할 수 있다. 
따라서 check 대신 body를 확인하는 데 사용할 수도 있고 특정 필드를 찾는 것도 가능하나 request body에 추가되어야 한다.
    const { check, body } = require('express-validator');

check 함수는 모든 곳을 탐색하기 때문에 email은 쿠키, 헤더 등 어디에서든 추출할 수 있다. 암호의 경우 다른 접근법을 사용해보자. 요청의 바디에서 password를 확인하라고 지정할 수 있다. 이 경우 헤더에 password가 있더라도 그 부분은 무시한다. 이제 바디에서 암호를 확인하며 검증자를 추가할 수 있다.
    body('password', 'Error Message').isLength({ min: 5 }).isAlphanumeric()
- .isLength: 내장된 검증자로써 자바스크립트 객체의 형태로 일부 옵션을 구성해야 하고 최소/최대 길이 설정이 가능하다.
- .isAlphanumeric: 숫자와 문자만을 허용하는 검사
- withMessage를 사용하지 않는 경우 기본값의 오류 메시지를 사용한다. 동일한 오류 메시지를 모든 검증자에 출력하고 싶지만 기본 오류 메시지는 사용하고 싶지 않다면 withMessage을 삭제하고 body 또는 check 함수의 두 번째 인수로 추가하면 된다. 이러면 모든 검증자에 대한 기본 오류 메시지로 내가 입력한 값이 사용된다.
============================================================================================
295_필드 동일성 검사

signup view에서 confirmPassword 필드를 확인한다. auth 라우트에서 요청의 바디에 있는 내용, 즉 암호 확인 필드를 위한 새로운 검사를 추가한다. 여기서는 내 암호와 동등한지 확인할 것이기 때문에 커스텀 검증자를 사용한다. 
    body('confirmPassword').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Passwords have to match!');
        }
        return true;
    })
- value를 수신하고 destructuring 구문으로 request를 추출한다. 
- if문에서 만약 body에 confirmPassword 값이 존재하는 경우 req.body.password 값과 동등한지 확인한다. 이 때문에 request 객체로의 접근이 필요한데 여기에서는 password 즉, 사용자 정의한 검증자의 요청 바디에 있는 필드 값-body('password')-을 추출해야 하기 때문이다. 

여기서 눈여겨볼 점은 password처럼 isLength나 isAlphanumeric 같은 유효성 검증을 추가하지 않았다는 점이다. 추가하지 않아도 confirmPassword에 적용된다. 바로 이전의 메인 password에서 이미 확인을 하였고 그 다음으로 동등성을 확인하기 때문이다. 따라서 이것은 Confirm Password에 이미 포함된다. 왜냐하면 앞의 password와 동등해야 하는데 password는 이미 길이나 숫자 문자 검증을 마쳤기 때문이다.
============================================================================================
296_비동기 검증

지금 약간 이상한 방식으로 유효성 검증을 하는 부분이 있다. 이메일 중복 여부인데 이 작업을 auth 컨트롤러에서 하고 있으며 논리적으로는 유효성 검증의 일부로 확인하는 게 타당하다.

먼저 auth 라우트에서 user 모델을 임포트한다.
    const User = require('../models/user');
그리고 이메일 필드의 커스텀 검증자에 기존 코드를 가져온다.
    return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
            return Promise.reject(
                'E-mail exists already, please pick a different one.'
            );
        }
    })
- 해당 이메일 주소를 가진 사용자 1명을 찾는다. 여기에 만약 사용자 문서가 있다면 새로운 Promise.reject 호출을 반환한다. promise는 내장된 자바스크립트 객체이며 reject를 사용하여 promise 내부에 오류를 출력하고 이전에 사용했던 오류 메시지로 reject를 진행한다. 그 말은 바로 이 뒤에 then, catch를 연결할 수 있지만 여기서는 생략한다.
- User.findOne을 return한다. express-validator 패키지는 커스텀 검증자를 확인하여 true / false, 출력된 오류 혹은 promise를 반환한다. 여기서처럼 promise일 수 있는데 모든 then 블록이 암암리에 새 promise를 반환하므로 결국 promise를 반환한다. 따라서 promise를 반환하는 경우 express-validator는 이 promise가 충족되길 기다리며 만약 충족하는 경우 이 유효성 검증을 성공으로 취급한다. 하지만 마지막에 어떤 reject가 발생한다면 if 블록 내부로 이어질 경우 reject를 탐지해 오류로 저장하여 우리가 입력한 오류 메시지를 저장한다. 

이렇게 커스텀 비동기식 유효성 검증을 추가할 수 있는데 비동기식인 이유는 우리가 DB에 접근해야 하기 때문이고 express-validator가 기다려 줄 것이다. 
============================================================================================
297_사용자 입력 유지하기

현재는 가입을 위해 이메일과 비밀번호를 입력하는데 이미 사용중인 이메일이거나 비밀번호가 일치하지 않을 때 오류 메시지가 나타나지만 입력한 값이 모두 사라진다.

우선 가입 및 로그인을 다루는 컨트롤러 액션중 signup을 보면 틀린 데이터를 입력했을 때 다음 뷰를 렌더링할 때 오류 메시지를 포함한다. 이때 사용자가 입력한 데이터를 유지하려면 해당 데이터를 다시 보내야 한다. 오류 때문에 다시 렌더링 되는 페이지로 다시 보내 페이지에 출력한다.
    return res.status(422).render('auth/signup', {
        ...
        oldInput: { 
            email: email, 
            password: password, 
            confirmPassword: req.body.confirmPassword 
        }
    });

signup view로 가서 해당 데이터를 출력한다.
    <input ... value="<%= oldInput.email %>">
Signup 페이지를 들어가면 오류가 난다. 처음 페이지에 방문하면 oldInput을 렌더링하지 않기 때문이다. 따라서 getSignup 액션에 빈 oldInput을 추가한다.
    res.render('auth/signup', {
        ...
        oldInput: {
            email: '',
            password: '',
            confirmPassword: ''
        }
    });
- 즉 페이지를 처음 로딩하면 다음 필드의 값을 비워두고 인증 오류가 난다면 예전의 입력값이 나타나도록 하는 것이다.
============================================================================================
298_조건부 CSS 클래스

CSS 파일 참조
============================================================================================
299_로그인에 검증 추가

auth 컨트롤러에서 postLogin을 다룬다. 에러가 발생하면 기존 입력값을 각각의 키에 전달해 뷰로 보낸다.
signup과 한 가지 차이점은 사용자가 유효하지 않은 이메일과 비밀번호를 입력하는 경우도 오류가 나올것이다. DB 항목에 없는 사용자를 로그인하려고 하거나 비밀번호가 불일치하는 경우다. 이 경우 redirect만 하고 있으므로 똑같이 oldInput을 렌더링에 추가한다. 반면 validationErrors는 param 객체를 추가해야 한다. 
    return res.status(422).render('auth/login', {
        ...
        oldInput: { 
            email: email, 
            password: password
        },
        <!-- validationErrors: { param: 'email', param: 'password' } -->
        validationErrors: []
    });
만약 어떤 필드에서 오류가 났는지 보여주지 않으려면 param 객체를 제거해 메시지만 나타나게 한다. 예전 입력값은 유지하되 빨간 경계선 표시는 생략하여 어디서 에러가 났는지 알려주지 않는 것이다.

로그인 뷰에서 예전 값을 value에 표시한다.
============================================================================================
300_데이터 살균(Sanitize)

여기서는 보안 관련이 아닌 시각적 살균에 초점을 맞춘다. 입력값 살균은 라우트에서 유효성 검사와 함께 하면 된다.
    .normalizeEmail()
- 유효성 검사의 맨 뒤에 추가한다. email이 정규화된 방식으로 저장되도록 한다. 즉, 이메일이 소문자로 시작하고 빈 공백도 없어야 한다.
    .trim()
- 빈 공백을 제거하는 메서드다. 비밀번호 검증에 추가한다.

데이터 살균은 데이터가 균일한 형식으로 저장되도록 도움을 준다.
============================================================================================
301_제품 추가 검증

admin 라우트에 유효성 검사를 추가한다.
    const { body } = require('express-validator');
    ...
    [
        body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
        body('imageUrl').isURL(),
        body('price').isFloat(),
        body('description')
        .isLength({ min: 5, max: 400 })
        .trim()
    ],
- isString: 문자열을 확인한다. isAlphanumeric과는 다르게 공백이 포함되어도 상관없다. 
- isURL: 유효한 URL인지 확인한다. 입력값이 URL의 특성을 띄고 있는지 확인한다.
- isFloat: 소수점 이하를 가지게 한다. isNumeric을 검사하여 정수나 부동소수점 숫자를 허용하는 방식도 있다.

admin 컨트롤러에 검증자를 불러오고 validationResult 함수를 불러온다.
    const { validationResult } = require('express-validator');
그럼 제품을 생성하기 전에 validationResult에 req를 전달해 모든 errors를 모으고 if문으로 오류가 있는지 검사한다.
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            ...
            editing: false,
            hasError: true,
            product: {
                title: title,
                imageUrl: imageUrl,
                price: price,
                description: description
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }   
- 이때 edit-product의 뷰를 보면 Title의 value에 if (editing)이 true라면 product.title, product.imageUrl을 출력하도록 설정되어 있다. 아직 편집 전이고 다른 부분은 바꾸지 않을 거니 editing을 false로 설정한다. product는 객체로 설정하고 title 등의 필드를 가져온 입력값과 같다고 한다.
- hasError 필드를 추가하는데 페이지를 렌더링하는 코드인 getAddProduct 등에는 false로 설정디어야 한다. postAddProduct만 true다.

이제 뷰에서 hasError 필드를 활용해 if (editing || hasError)일때 기존 제품 값을 출력하도록 한다.

밑의 코드가 실행되어 에러가 발생하지 않도록 return 한다.
    return res.status(422).render(...)
============================================================================================
302_제품 편집 검증

postEditProduct 액션에 검증 논리를 추가한다.
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            ...
            editing: true,
            hasError: true,
            product: {
                ...
                _id: prodId
            },
            ...
        });
    }

뷰도 알맞게 수정한다.

그러나 업데이트 버튼을 눌러도 Cast to ObjectId failed for value 에러가 나온다. 
처음 페이지를 렌더링 할 때 hidden input에 있는 productId를 로딩한다. 하지만 유효성 검사 오류로 인해 페이지를 재렌더링하면 if문에 있는 render 함수에 _id도 추가해야 한다. 설정하지 않으면 페이지는 렌더링 되지만 양식을 제출할 때 위에서 추출한 제품 ID가 빠질 것이다. 