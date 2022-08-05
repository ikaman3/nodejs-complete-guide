POST 요청으로 미들웨어 실행 제한하기

이전에는 바디파서로 바디의 데이터를 추출할 수 있게되었다. 그러나 이 미들웨어가 POST 요청뿐만 아니라 GET 요청에도 작동한다는 문제점이 있었다.

app.use('/product',  (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

==>

app.get('/product',  (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

app.use 대신 app.get을 사용할 수 있다. 기본적으로 app.use와 동일하다. 경로를 사용하거나 사용하지 않을 수 있으나, GET 요청에만 작동한다.
이것은 경로 필터가 아닌 다른 형태의 필터라고 할 수 있다.

app.post('/product',  (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

또한, POST 요청만 걸러주는 app.post 가 있다. 이것은 POST 요청에만 작동한다.
추가적으로 delete, patch, put 등도 있고 추후 사용할 것이며, 일반적인 html 문서에서는 사용하기 어렵다.