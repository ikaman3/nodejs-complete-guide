Express Router 사용

지금까지 앱은 하나의 파일에 몰아두어 크기가 커지고 있다. 이에 따라서 라우팅 코드를 여러 파일로 나누는 것이 좋다.
로직을 여러 파일로 내보내서 app.js 파일로 import 하면 된다.

routes 폴더를 생성한다. 이름은 달라도 되지만 개발자들의 관행에 따른 것이다. 다양한 경로와 http 메소드에 대해 실행할 라우팅 관련 코드를 파일에 담아서 routes 폴더에 저장한다.

Express.js에서 제공하는 기능을 사용하기 위해 두 구문을 추가한다.
const express = require('express');
const router = express.Router();

그리고 다른 Express 앱처럼 내보내기 한다.
module.exports = router;

그리고 기존에 만든 라우트 코드를 잘라내서
router.get('/add-product', (req, res, next) => {...});
router.post('/product',  (req, res, next) => {...});

app -> router 로 변경한다.

app.js 파일에서 두 구문을 추가한다.
const adminRoutes = require('./routes/admin');
app.use(adminRoutes);

괄호 없이 객체 자체를 입력한다.

루트 라우트도 똑같이 분리하면 된다.
===================================================================================================================
'/' 라우트의 순서

router.use('/',  (req, res, next) => {...});
만약 이 라우터처럼 모든 http 메서드를 처리하는 use를 사용했다면 순서가 중요하다.
그러나 get 메서드를 사용하면 순서에 상관없이 쓸 수 있다.
router.get 은 GET 메서드임을 확인할 뿐만 아니라 정확한 경로임을 확인하기 때문이다. 따라서 이제 무작위 경로를 입력하면 에러가 난다.
이제 이를 처리할 단일 미들웨어가 존재하지 않기 때문이다.

=================================================================================================================
68_Route filtering

Express Router의 기능 중 하나이다.

app.use(adminRoutes);
app.use(shopRoutes);
위의 구문처럼 app.js 에 추가한 아웃소싱 라우트들이 있는데 이러한 아웃소싱 라우트들은 시작경로를 공유하는 경우가 많다.

router.get('/admin/add-product', (req, res, next) => {...});
router.post('/admin/add-product',  (req, res, next) => {...});
모든 admin 라우트가 admin/add-product 로 트리거된다고 가정하자
메서드가 get, post 로 다르기 때문에 같은 경로를 사용해도 된다. 이 둘은 서로 다른 라우트가 된다. 즉, 메서드가 다르면 같은 경로를 사용할 수 있다

이러한 라우터 파일의 경로가 같은 구간에서 시작하는 경우 해당 구간을 app.js 에 추가하여 필터로 추가할 수 있다.
app.use('/admin', adminRoutes);
/admin 으로 시작하는 라우트만 adminRoutes 파일로 들어간다. 또한, express에서 라우트를 매칭하려 할 때 URL에서 이 /admin 부분을 생략하거나 무시할 수 있다.
요청할 때는 /admin/add-product 로 요청해야 한다.