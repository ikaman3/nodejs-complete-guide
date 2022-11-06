라우트 사용법

밑의 '/' 경로보다 위에 작성해야 한다. 파일의 위에서 아래로 내려오며 URL이 일치한 경로를 찾는데 모든 경로는 '/'로 시작하기 때문에
상세한 페이지를 루트보다 위에 두어야 add-product에 먼저 도달하고 이 미들웨어와 일치하게 된다.
또한 next를 호출하지 않아야 다음 미들웨어로 넘어가는 것을 막을 수 있다.

app.use('/', (req, res, next) => {
    console.log('This always runs!!!');
    next();
});

app.use('/add-product', (req, res, next) => {
    console.log('In another middleware!');
    res.send('<h1>The add product page');
});

app.use('/', (req, res, next) => {
    console.log('In another middleware!');
    res.send('<h1>Hello from Express!!');
});

실행결과: localhost:3000/ => 
콘솔 =>
This always runs!!!
In another middleware!
브라우저 =>
Hello frome Express!!

localhost:3000/add-product =>
콘솔 =>
This always runs!!!
In another middleware!
브라우저 =>
The add product page

이것이 미들웨어를 활용해 무엇이 표시되는지 제어하는 방법이고, next 호출여부와 함께 순서도 중요하다.
만약 응답을 보내려고 한다면 next를 호출하지 않는 것이 좋다. 바닐라 Node.js 에서처럼 다른 응답 관련 코드를 실행하면 안 되기 때문이다.
하나 이상의 응답을 보내려하면 에러가 난다.