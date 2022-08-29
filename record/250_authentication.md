250_User Authentication

What is Authentication?
    
                                    User
  Open to anyone!                    | Only available to logged-in users
 View all Products        Create & Manage Products     Place Orders
        |----------------------------|--------------------|
                                   Server
                                     |
                                  Database

앱을 사용해 뷰를 보는 사용자가 있고 서버뿐 아니라 서버와 함께 작동하는 DB가 있다. 
애플리케이션에는 다양한 라우트와 사용자가 실행할 수 있는 다양한 액션이 있다. 모든 제품 보기, 제품 생성 및 관리, 주문 접수 등. 인증에 관해 중요한 것은 애플리케이션 사용자가 모든 액션을 할 수는 없다는 것이다. 여기서 사용자란 로그인을 마친 사용자가 아니라 단순히 페이지를 방문한 사람을 뜻한다. 이 경우 localhost:3000을 방문하는 방문자 추후에는 배포에 사용한 도메인을 방문한 방문자일 것이다. 즉, 로그인하지 않은 익명의 사용자가 실행할 수 없는 액션이 있다. amazon.com에서 로그인하지 않아도 모든 제품을 볼 수 있는 것처럼 가능한 것도 있지만 제품 생성 및 관리, 주문 등의 액션은 로그인해야만 가능하다. 우리가 다루는 애플리케이션에서 제품과 로그인 사용자를 연결해야 하기 때문이다.

바로 이를 위해 인증 절차가 필요한데 로그인하지 않은 익명 사용자와 로그인 한 사용자를 구분할 수 있어야 한다. 따라서 알맞은 워크플로우와 뷰 그리고 백엔드 논리로 페이지에 방문한 사람들이 가입하고 로그인할 수 있게 해야한다. 그 다음으로 저번 강의에서 한 것처럼 세션에 사용자의 로그인 여부를 저장해 요청 간 여러 페이지와 상호 작용할 수 있다.
===========================================================================================
252_How is Authentication Implemented?

                   User    ------------------> Cookie
              |     ^    |                    Stores Session ID 
Login Request |  200|    |Request restricted     |
              |     |    |Resource               |
              ↓     |    ↓                       |
                  Server   ------------------> Session
                    |                      Stores info that User is
                  Database                      Authenticated
인증을 구현하기 위해 위와 같은 구성으로 사용자와 백엔드로 서버 측 코드와 데이터베이스가 있고 보통 사용자가 서버에 로그인 요청을 보낸다. 
방문자가 이전에 가입을 했다면 이메일과 비밀번호로 로그인할 것이다. 그럼 서버에서 이메일과 비밀번호 조합이 유효한지 데이터베이스에 해당 이메일과 비밀번호를 가진 사용자가 존재하는지 확인한다. 
만약 그렇다면 사용자에 대한 세션을 생성해 세션이 사용자를 인식한다. 세션이 없다면 자격 증명이 유효해도 요청 바로 다음에 사용자가 다시 로그아웃 될 것이다. 왜냐하면 요청이 단독적으로 실행되어 서로 알지 못하기 때문에 세션을 통해 요청을 연결하기 때문이다.

인증에 성공하면 200이라는 성공 응답을 보내며 응답과 함께 반환된 세션에 속한 쿠키를 클라이언트에 저장하고 나면 세션을 구축한 것이다. 그 후에는 사용자가 제한된 라우트에도 방문할 수 있다.
모든 요청과 쿠키가 함께 발송되는데 서버에서 쿠키와 세션을 연결해 세션에서 사용자의 로그인 여부를 확인하기 때문이다. 사용자가 로그인된 상태라면 특정 페이지에 접근할 수 있다. 

여기까지가 뷰를 렌더링하는 모든 웹 애플리케이션에서 인증을 구현하는 방법이다. 추후에 REST API, GraphQL API에 인증을 구현하는 방법도 배울 것이지만 지금 구축하는 것처럼 ejs나 handlebars 같이 템플릿 엔진을 통해 뷰를 렌더링하는 기존 웹 앱에서는 세션에 기반한 인증 방식을 사용하도록 한다. 
===========================================================================================
254_인증 플로우 구현

signup.ejs에서 signup 버튼과 라우트를 설정한다.

cotrollers/auth => postSignup
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;
- 이렇게 세 가지 값이 라우트에 도달해야 한다. 보통은 이메일이 유효한지, 비밀번호가 일치하는지 검사하지만 일단 생략한다.
	User.findOne({ email: email })
		.then(userDoc => {
			if (userDoc) {
				return res.redirect('/signup');
			}
			const user = new User({
				email: email,
				password: password,
				cart: { items: [] }
			});
			return user.save();
		})
		.then(result => {...})
		.catch(...);
- 우선 DB에 중복된 이메일이 없도록 해당 이메일을 가진 사용자가 이미 있는지 알아봐야 한다.
- 첫 번째로 MongoDB에 이메일 필드를 생성하고 unique 속성을 주어 중복을 막는 방법이 있다. 
- 두 번째는 단순히 그 이메일을 가진 사용자를 검색하는 것이다. Mongoose의 user 모델을 이용한다. user 모델에서 email이 이미 있는지 찾고 하나라도 존재하면 /signup으로 리다이렉트한다. 없다면 user를 생성하고 save한다. 
===========================================================================================
255_비밀번호 암호화

위에서 사용자를 생성하는 논리를 작성하였으나 보안 문제가 있다. 비밀번호를 암호화하지 않고 평문으로 저장하여 보안 취약점으로 이어진다.
따라서 비밀번호를 유추할 수 없도록 단방향으로 해시화해서 저장해야 한다.

npm install --save bcryptjs

controllers/auth =>
	const bcrypt = require('bcryptjs');

	...

	User.findOne({ email: email })
		.then(userDoc => {
		...
		return bcrypt.hash(password, 12)
			.then(hashedPassword => {
				const user = new User({
				email: email,
				password: hashedPassword,
				cart: { items: [] }
			});
			return user.save();
		})
		...
- 사용자를 생성하기 바로 직전에 bcrypt 패키지의 hash 메서드를 호출한다.

bcrypt.hash()
- 첫 번째 값으로 해시화 하고 싶은 문자열을 가진다. 이 경우 password이다.
- 두 번째는 솔트 값으로 몇 차례의 해싱을 적용할지 지정한다. 솔트 값이 높을수록 오래 걸리지만 더 안전하다. 12 정도면 높은 보안 성능으로 간주된다.
- 결과로 해시화된 값을 반환하는데 비동기식 태스크이기 때문에 promise를 반환한다. 그러므로 return하여 then 블록을 연결하고 hashedPassword으로 결과를 받아서 DB에 저장한다. 
===========================================================================================
257_로그인 기능 추가

이제 디폴트 user를 찾는 접근법은 사용하지 않는다. 대신 user를 email로 찾는다. 
admin controller에서 req.body 에서 email, password를 추출한다.
- req.body.email; req.body.password;

그리고 findOne 메서드로 email을 검색한다.
- User.findOne({ email: email })

then 블록을 연결하고 우선 user가 없다면 login 페이지로 리다이렉트 시킨다.
이후 password를 검증해야 한다. 

bcrypt.compare(password, user.password).then().catch();
- password는 hash 형식으로 저장되어 있으므로 bcrypt 패키지를 이용한다. 해시화된 텍스트는 되돌릴 수 없으므로 bcrypt의 알고리즘이 적용된 메서드로 비교한다.
- 첫 번째 인자로 검증하려는 텍스트를 입력한다.
- 두 번째 인자로 DB 내 사용자 문서에 있는 password 필드에서 비교하려는 해시 값을 찾아 입력한다.
- promise를 반환하므로 then, catch 블록을 연결한다. compare에서는 password가 일치하지 않는 경우가 아니라 무언가 잘못되어 오류가 발생했을 때만 catch 블록으로 넘어간다. 즉, 일치와 불일치 모두 then 블록에 도달하고 password가 같다면 결과는 true라는 불리언 값이 된다. 같지 않다면 false가 된다.

성공한다면 이전의 세션 저장 코드를 사용하여 세션을 저장하고, 세션에서 리다이렉트 한다. 그리고 req.session.save()를 return 해서 밑의 password 실패 시 코드가 실행되지 않도록 해야한다.
===========================================================================================
258_라우트 보호 작업

이미 로그아웃된 사용자에게 메뉴 옵션은 숨겨진 상태다. 그러나 세션이 없어도 url을  수동으로 입력하여 접속할 수 있고 기능을 시도할 수도 있다. 이를 위해 라우트를 보호해야 한다. 

Add Product 같은 페이지를 렌더링하기 전에 사용자가 어디서 인증되었는지를 확인해야 한다. 따라서 해당 페이지를 불러오는 admin 컨트롤러의 getAddProduct에서 페이지 렌더링 전에 요청 세션이 isLoggedIn으로 설정되었는지 확인한다.
- if (!req.session.isLoggedIn) { return redirect }
- 여기서 return 했으므로 밑의 렌더링 코드는 실행되지 않고 Add Product 페이지가 로딩되지 않는다.

이제 보호하려는 모든 라우트에 이 코드를 추가하면 된다. 그러나 매우 번거롭다. 따라서 라우트를 보호하는 확장성 좋은 더 우수한 방법을 써야한다.  
===========================================================================================
259_미들웨어를 사용한 라우트 보호

모든 라우트에 추가할 수 있는 새로운 미들웨어를 만들어서 경로를 보호한다.
먼저 프로젝트 루트 경로에 middleware 폴더를 추가하고 is-auth.js 파일을 생성한다. 

그리고 밑의 코드를 작성하고 export 한다.
module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    next();
}
- 로그인이 완료된 경우 next를 호출해야 다음 미들웨어로 넘어갈 수 있다. 

이제 routes 폴더로 가서 원하는 라우트에 핸들러를 원하는 만큼 추가하면 된다. 라우트는 좌에서 우로 요청이 통과한다.
routes/admin => 
	const isAuth = require('../middleware/is-auth');
- isAuth 미들웨어를 임포트한다.	
	router.get('/add-product', isAuth, adminController.getAddProduct);
- isAuth를 get의 인수로 추가한다. 좌에서 우로 요청이 통과한다. 따라서 add-product에 도달하는 요청은 isAuth 미들웨어에 먼저 들어가고 isAuth 미들웨어에서는 리다이렉트 할 수는 있지만 next를 호출하지 않으므로 요청이 다음 컨트롤러 액션으로 넘어가지 않는다. 그러나 미들웨어의 검사를 통과하면 next를 호출한다. 

이제 이 isAuth 미들웨어를 필요한 모든 라우트에 입력한다.

그러면 라우트 보호 기능을 갖춤으로써 메뉴 항목을 숨기는 대신 서버 측 세션을 활용해 인증 상태를 검사할 수 있게 되었다. 이는 사용자가 조작할 방법이 없으므로 일부 라우트나 메서드는 로그인된 사용자만 사용할 수 있게 된다. 
===========================================================================================
260_CSRF Attacks

Cross-Site Request Forgery: 사이트 간 요청 위조
- 세션을 악용하고 앱 사용자를 속여서 악성코드를 실행하는 특수한 공격 방법 또는 접근법이다.

앱 사용자가 있고, 이 사용자가 로그인된 방문자라고 가정하자. 서버 측 코드가 있고 상호작용할 DB가 있을 것이다. 사용자는 프론트엔드 뷰, 즉 렌더링 되는 페이지와 상호작용하고 사용자 세션과 그에 대한 쿠키가 있다. 
사용자는 개발자가 의도한 작업을 할 수 있다. 예를 들어 인터넷 뱅킹 앱이라면 B라는 친구에게 돈을 보낼 수 있고 쇼핑몰이라면 배송 주소를 입력하고 상품을 주문할 수 있을 것이다. 

Fake Site <------------------- User
	|							|
Intended Request		   Frontend(Views) --------------> Cookie
(e.g. send money to C)			|                     
	|			Intended Request(e.g. send money to B)
	|							|                     
	|---------------->	Server(Node App) -------------> Session
								|
							 Database
CSRF 공격에서는 사용자를 속여서 가짜 사이트로 가도록 한다. 이는 이메일로 링크를 보내는 등의 방법으로 이루어진다. 해당 사이트는 원본 페이지처럼 보일 수 있지만 사실 다른 사이트다. 그 사이트에는 실제 페이지로 연결된 링크가 있고 거기로 요청을 보내게 된다. 예를 들어 실제 페이지, 즉 노드 서버로 POST 요청을 보내는 폼을 포함시켜서 B 대신 C에게 돈을 보내도록 하는 필드를 추가할 수도 있다. 사용자는 비슷한 페이지를 보았거나 링크를 클릭했기 때문에 알아채기 어렵다. 그러나 물밑에서 사용자가 원치않는 작업을 위한 데이터가 전송된다.

이 방법이 왜 통할까? 해당 유저에 대한 유효한 세션이 있으므로 사이트 서버에 무언가 보내게 되면 사용자에 대해 세션이 활용되는데 이는 사용자가 원하지 않는 방식으로, 송금이나 주문을 조작하는 물밑 데이터에 대해서도 마찬가지이다. 이 부분은 사용자에게 보이지 않지만 사이트 서버가 사용되므로 전송에 유효한 세션이 활용되고 요청이 받아들여진다. 

이것은 말하자면 세션을 훔치는 공격 방법으로 사용자가 로그인되어 있다는 사실을 악용해서 요청을 보내도록 한다.

당연히 우리는 이런 공격을 방어해야 한다. 기본 개념은 사람들이 원본 뷰, 즉 우리 앱이 렌더링한 뷰로 작업할 때에만 우리의 세션을 사용할 수 있도록 하는 것이다. 그러면 가짜 페이지에서 세션을 사용할 수 없다. 

이러한 기능을 추가하기 위해 CSRF 토큰을 추가한다.
===========================================================================================
261_CSRF 토큰 사용하기

npm install --save csurf
- csurf는 CSRF 토큰을 생성하게 해주는 Express.js용 패키지다. 
- 기본적으로 토큰, 즉 문자열 값으로 백엔드에서 실행되어 뭔가를 주문하는 등의 보호가 필요한 민감한 작업을 수행하고 사용자의 상태를 변경하는 모든 요청에 대해서 이를 폼이나 페이지에 내장한다. 이러한 토큰을 뷰와 서버에 포함하면 이 패키지가 들어오는 요청이 유효한 토큰을 가지고 있는지 검사한다.
- 가짜 사이트가 백엔드로 요청을 보내서 이론적으로 세션을 사용할 수 있지만 이러한 요청에는 토큰이 빠져있고 토큰은 무작위 해쉬 값이므로 토큰을 추측할 수도 없다. 그리고 서버에서 실행되는 패키지가 토큰이 유효한지 판별한다. 따라서 추측이 불가능하며 페이지를 렌더링할 때마다 새로운 토큰이 생성되므로 가로챌 수도 없다. 

app.js =>
	const csrf = require('csurf');
- csurf 패키지를 import한 csrf 상수 생성
	...
	const csrfProtection = csrf();
- 초기화를 위한 새로운 상수를 생성. csrf를 함수로 실행해서 csrfProduction을 초기화한다.
- 여기에 무언가를 설정할 객체를 입력할 수 있다. 예를 들어 토큰 할당 즉, 해시화하는데 사용되는 비밀 같은 것인데 이를 기본값인 세션 대신에 쿠키에 저장하거나 하는 식이다. 이 앱에서는 기 ㅇ본값으로 사용하며 다른 값들도 건드릴 필요는 없다.
	app.use(csrfProtection);
- 이제 csrfProtection 미들웨어를 얻었으니 미들웨어로 사용하면 된다. 주의할 점은 반드시 세션을 초기화하는 코드 다음에 사용해야 한다. csurf 패키지가 이 세션을 사용하므로 필수이다.

미들웨어 등록이 끝났으니 뷰에 추가해야 한다. 현재 로그인이나 로그아웃을 하려하면 토큰이 없다고 오류가 난다. 로그인이나 로그아웃 등의 POST 요청을하면 실패한다. 이 패키지는 일반적으로 POST 요청을 통해-데이터를 변경하는 get 이외의 모든 요청에 대해-뷰에 csrf 토큰이 있는지 확인한다. 요청 본문에 그런 토큰이 있는지 검증하려면 먼저 뷰에서 토큰에 접근해야한다. 이를 위해 뷰에 데이터를 입력한다.

우선 시작페이지에 왔다고 가정하자. 컨트롤러 액션에서는 getIndex 액션에 해당한다. 여기서 render 메서드에 새로운 정보를 입력한다.
controllers/shop => getIndex
	csrfToken: req.csrfToken()
- 우측의 csrfToken 메서드는 csrf 미들웨어가 제공한다. 이러면 좌측의 csrfToken에 토큰이 저장되고 뷰에서 사용할 수 있다. 

이제 뷰에서 hidden input을 추가한다. 
views/includes/navigation =>
	<input type="hidden" name="_csrf" value="<%= csrfToken %>">
- value가 csrf 토큰이다. csrfToken라는 이름은 위의 코드에서 뷰를 렌더링할 때 토큰을 저장했던 필드이다.
- csrf 패키지가 숨겨진 입력값의 토큰을 인식하기 위해 name이 필요하다. 반드시 _csrf 로 설정해야 한다.

이제 뷰에서 토큰을 추출하고 처리할 수 있다. 모든 라우트에 이게 필요하므로 모든 렌더링 함수에 추가할 수 있지만 역시나 번거롭다. 그러므로 데이터를 가져오거나 렌더링 할 모든 페이지에 토큰이나 isAuthenticated 필드를 추가하는 방법을 알아야 한다.

===========================================================================================
262_CSRF 방어 추가하기

토큰과 인증 상태를 렌더링할 모든 페이지에 추가하려 한다. 모든 페이지에 추가하려면 렌더링 함수에서 지우고 express.js로 간다. 이는 csrf와 전혀 관련이 없다. express.js에 이 데이터를 모든 렌더링할 뷰에 포함하라고 명령하면 된다.

app.js에서 하면 되는데 user을 추출하는 이 미들웨어와 전체 라우트 사이에 미들웨어를 하나 더 추가한다. 세 개의 인수를 가진 함수를 포함한 일반적인 미들웨어다. 

res.locals
- response에서 locals라는 특수한 필드를 액세스할 수 있는데 이는 뷰에 입력할 로컬 변수를 설정할 수 있도록 한다. 렌더링될 뷰에만 존재하게 되므로 로컬이라고 불린다.

app.js =>
	app.use((req, res, next) => {
		res.locals.isAuthenticated = req.session.isLoggedIn;
		res.locals.csrfToken = req.csrfToken();
		next();
	});
- 방금 모든 렌더링 함수에서 삭제한 isAuthenticated 속성을 추가해서 isLoggedIn 세션을 요청한다. 물론 req.csrfToken 함수에서 가져오는 csrfToken 변수도 추가한다. 
- 이렇게 하면 실행되는 모든 요청에 대해 렌더링되는 뷰에서 이 두 필드가 설정된다. 그 다음은 next를 호출해서 계속 진행되도록 한다. 

마지막으로 뷰에 입력한 토큰을 사용하도록 내비게이션에 추가한 hidden input 코드를 모든 form에 추가한다.

CSRF는 출시할 앱의 필수 요소이다. 없다면 큰 보안 취약점이 생기므로 반드시 추가하여 세션을 가로채지 못하게 해야한다.
===========================================================================================
264_사용자에게 피드백 제공 & connect-flash 

지금은 로그인할 때 잘못된 정보로 로그인을 시도해서 email이나 password를 찾지 못하거나, email이 이미 존재하는 사용자를 생성하려고 하는 경우 리다이렉트만 하고 있다. 여기서는 유효성 검사보다는 일반적으로 사용자에게 피드백 제공을 다루고 있다.

지금처럼 render 메서드를 통해 뷰와 페이지에 포함된 데이터를 렌더링하는 것은 간단하다. 데이터를 뷰에 넣는 것은 어려운 일이 아니다. 그러나 리다이렉트할 때 렌더링된 뷰에 데이터를 입력하는 것은 간단하지 않다.

리다이렉트는 엄밀하게 말하여 새로운 요청이 시작된다. res.redirect('/login') 이라고 작성했다면 /login으로 가는 새로운 요청인 것이다. 사용자가 잘못된 email 같은 정보를 입력했으므로 이 새로운 요청에서 무엇인지 알 수가 없다. 이 새로운 요청을 생성했을 때 메뉴에서 login 버튼을 누른 것과 같은 방식으로 처리한다. 따라서 오류 알림을 표시해야 하는지 알 방법이 없다. 그러므로 Login 페이지를 표시하는 getLogin의 render 메서드에 오류 알림이 포함돼야 하는지 알 수가 없다. 

이 문제를 해결하기 위해 리다이렉트하기 전에 데이터를 저장해서 리다이렉트로 생성된 새로운 요청에서 이를 사용하고자 한다. 요청 간에 데이터를 저장하려면 세션이 필요하다. 그러나 세션에 오류 알림을 영구적으로 저장하고 싶지 않다. 오류 알림에 뭔가를 추가해서 세션에 잠깐 표시되도록 하고 뭔가를 한 다음에는 세션에서 제거하여 이어지는 요청에서 오류 알림이 포함되지 않도록 해야한다. 이를 위해 새로운 패키지가 필요하다.

npm install --save connect-flash 

먼저 app.js 파일에서 초기화한다.
app.js =>
	const flash = require('connect-flash');
- 패키지 import 한다.
	...
	app.use(flash());
- 그 다음 세션을 초기화하는 미들웨어 다음에 flash를 등록 또는 초기화한다.
- 이제 flash 미들웨어를 애플리케이션이 request 객체에 사용 가능하다.

이제 auth 컨트롤러로 간다. 로그인할 때 해당 이메일을 찾지 못하는 문제가 발생했다고 하자. 세션에 오류 알림을 표시하려 한다. request로 할 수 있고 flash 메서드를 사용한다. 
controllers/auth => postLogin
	if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
	}
- 이 플래시 알림은 이제 알림이 저장될 key를 부여받는다. 이름은 'error'이다.
- 그리고 표시할 내용을 입력한다. 이 경우에는 'Invalid email or password.'이다. 

이렇게 하면 사용될 때까지 세션이 존재한다. Login 페이지를 렌더링할 때 사용하려 한다. 
contorllers/auth => getLogin
	res.render('auth/login', {
		...
		errorMessage: req.flash('error')
	});
- 여기에 errorMessage를 넣고 싶다면 이 변수는 req.flash를 사용해서 가져온다.
- 가져오려는 알림의 key를 액세스한다. 이 경우에는 'error'이다. error에 저장한 내용을 불러와서 errorMessage에 저장한다. 그리고 그 후에 이 정보는 세션에서 제거한다. 이제 세션에 error가 플래시된 경우에만 errorMessage가 설정되고 값을 가진다.

이제 login 뷰로 넘어가서 오류 알림을 보여주면 된다.
views/auth/login =>
	<% if (errorMessage) { %>
		<div class="user-message user-message--error"><%= errorMessage %></div>
	<% } %>

265_선택사항: 오류 메시지 스타일링

css file 참고

266_플래시 메시지 완성

알림이 플래시 되지 않아도 errorMessage가 undefined로 설정되지 않는 문제가 있다. auth 컨트롤러의 getLogin 액션에서 req.flash('error')를 출력해보면 [] 빈 배열이 출력된다. 만약 잘못된 email이나 password가 입력되면 [ 'error message...' ] 이처럼 메시지로 된 배열이 출력된다.

controllers/auth => getLogin
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/login', {
		...
		errorMessage: message
	});
- 먼저 message에 오류 메시지를 추출한다. 만약 메시지의 길이가 0보다 길다면 message가 있음을 의미한다.
===========================================================================================
267_플래시 메시지 추가

그럼 다른 곳에도 오류 메시지를 추가해보자. 위에서 존재하지 않는 이메일을 사용했을 때 플래시 알림을 추가했다. 비밀번호가 일치하지 않아서 Login으로 리다이렉트되는 경우에도 같은 메시지를 추가한다.

가입할 때 이메일 주소가 이미 존재하는지 확인하는 과정이 있으므로 회원가입에도 활용할 수 있다. postSignup 액션의 리다이렉션 위에 코드를 추가한다.
	if (userDoc) {
		req.flash('error', 'E-mail exists already, please pick a different one.');
		return res.redirect('/signup');
	}
그리고 login 뷰에서 한 것처럼 signup 뷰에서 알림을 출력하는 코드를 작성한다. 물론 이게 작동하려면 signup 페이지를 렌더링할 때 추출해야 한다. getLogin의 렌더링 코드를 복사하여 getSignup에 활용한다.
contollers/auth => getSignup
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/signup', {
		...
		errorMessage: message
	});