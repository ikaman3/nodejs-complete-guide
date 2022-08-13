수신 요청 분석 

들어오는 요청을 처리하고 데이터를 추출하는 방법: POST 요청을 처리할 수 있어야 한다.

원래는 html, body 태그로 감싸야 한다.
app.use('/add-product', (req, res, next) => {
    res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
});

app.use('/product',  (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

경로에 공통점이 없기 때문에 두 미들웨어 끼리는 서로 어디에 두어도 충돌하지 않는다.
리다이렉트는 express에서 추가된 유틸리티 함수인 redirect() 메소드를 사용한다. 수동으로 상태 코드를 설정하고 위치 헤더를 설정하는 방법도 있다.
req.body는 express에서 추가된 새로운 필드이다. 기본적으로 req. 는 들어오는 요청의 본문을 분석하지 않기때문에 undifined가 출력된다.


app.use(bodyParser.urlencoded());

이를 위해 Parser(분석기)를 등록해야 하는데 또 다른 미들웨어인 body-parser를 주로 이용한다. express에 기본적으로 포함되어 있지만
일부 기능의 부재와 의존성 문제로 body-parser 설치를 권장한다.
일반적으로 라우팅 미들웨어 이전에 작성하는데, 요청이 어디로 향하든 body parsing 을 하기위함이다.