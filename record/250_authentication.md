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