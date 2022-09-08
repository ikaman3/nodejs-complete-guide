Asynchronous JavaScript Requests

지금까지는 특정 유형의 요청과 응답만 다뤘다. 요청은 항상 form을 채우거나 URL을 입력하거나 링크를 클릭했을 때 브라우저가 보내는 요청이었다. 응답은 리다이렉트 혹은 새 HTML 페이지였다.
이것만으로도 충분히 작업이 가능하지만 어떤 요청은 반드시 배후에서 일어나게 된다. 예를 들어 HTML 페이지를 받는 대신 서버와 일정 데이터만 교환하고 싶을 때 어떻게 해야할지 배운다.
=========================================================================================
347_What are Asynchronous Requests?

            |------ Client(Browser) <----------
            |       | Request    ^ Response   |
        Data(JSON)  |       HTML |         Data(JSON)
            |       |       Page |            |
            ------> Server(Node App) ---------|

이 강의를 통틀어 클라이언트와 서버, 즉 브라우저와 노드 애플리케이션이 있는 설정을 사용하고 있다. 오늘날 구축하는 웹 혹은 모바일 프로젝트는 이 설정을 사용한다. 바로 백엔드와 프론트엔드다.
보통 클라이언트가 서버로 요청을 보내고 응답을 받는다. 앞서 말했듯 이 강의에서 응답은 언제나 HTML 페이지이거나 HTML 페이지를 반환하기 위해 리다이렉트하는 라우트였다. 이게 문제가 있는 것은 아니지만 항목을 제거하는 등의 경우에는 페이지 새로고침이 필요없을 것이다. 
사실 요즘 웹 앱은 배후에서 처리하는 작업이 많아져서 브라우저에서 자바스크립트로 많은 일을 할 수 있으며 새 HTML 페이지를 가져오지 않아도 된다. 새 페이지를 로딩하지 않고 현재 페이지를 빠르게 바꾸는 것이다. 

비동기식 요청은 JSON이라는 특별한 형식의 데이터를 포함하는 요청을 의미한다. 데이터는 특정 URL이나 라우트로 서버에 보내진 후 허용된다. 논리는 동일하다. 그럼 서버가 데이터를 가지고 일정 작업을 한 후 응답을 보내는데 응답 역시 배후에서 반환된다. 즉, 응답으로 HTML 페이지를 렌더링하지 않는다. 보통 JSON 포맷이 돌아오는데 이렇게 클라이언트 서버가 새로 고침 및 페이지 렌더링으로 새 HTML 페이지를 반환하지 않고도 자바스크립트와 서버 측 논리를 통해 통신하는 것이다.

그러면 유저플로우를 방해하거나 페이지 새로 고침이 필요가 없어진다.
=========================================================================================
348_클라이언트 측 JS 코드 추가

현재 Delete를 클릭하면 서버에 요청을 보내고 해당 제품이 사라진 새로운 버전의 페이지가 나타난다. 해당 페이지에 계속 머무를 수 있다면 UX가 개선될 것이다. 
Delete 버튼을 눌러 배후에서 서버에 해당 항목을 제거하고 싶다고 정보를 보내면 서버가 작업을 거쳐 응답으로 JSON 데이터를 보낸다. 일종의 성공했다는 메시지다. 브라우저가 이 메시지를 받으면 해당 DOM 요소를 삭제할 수 있고 물건을 삭제하는 게 가능하다. 이것이 바로 비동기식 자바스크립트 요청이다.

일단 클라이언트 측에 논리를 조금 추가한다. public 폴더에 admin.js 파일을 생성한다. 이 파일은 서버가 아닌 클라이언트, 즉 브라우저에 실행되는 자바스크립트 코드이다. 이 자바스크립트 파일을 products.ejs에 불러온다. 파일 맨 아래 푸터(footer) 아래에 작성한다.
public/js/admin =>
    <script src="/js/admin.js"></script>

스크립트가 products.ejs 파일에 실행되며 파일의 마지막에 로드해서 자바스크립트를 실행한 후 전체 DOM이 렌더링 되며 분석되도록 해야한다. 

클라이언트 admin.js로 돌아가 논리를 작성한다. Delete 버튼을 누르면 반응이 있도록 해야한다. 따라서 Delete 버튼의 type을 submit이 아니라 button으로 변경한다. 그리고 form 태그를 제거한다. form은 브라우저를 통해 요청을 보낼 때 필요한데 xwww URL 암호화 데이터로 보내는 요청이다. 이걸 제거하고 대신 데이터를 수동으로 모은다. 즉, 버튼이 클릭되는지 듣고 클라이언트 측 자바스크립트를 통해 productId와 csrfToken을 받는다.

public/js/admin =>
    const deleteProduct = (btn) => {
        ...
    };
이 deleteProduct 함수는 HTML 파일 안에서 사용할 수 있는 함수이다. 
views/admin/products.ejs =>
    <button class="btn" type="button" onclick="deleteProduct(this)">Delete</button>
- 버튼에 onclick을 추가해 deleteroduct()를 입력하면 버튼을 클릭했을 때 해당 함수가 실행된다. 
- csrfToken, productId에 접근하려면 products.ejs에서 deleteProduct에 this를 전달한다. 이 경우 this 라는 키워드는 클릭한 요소인 button을 뜻한다.

    const deleteProduct = (btn) => {
        const prodId = btn.parentNode.querySelector('[name=productId]').value;
        const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
    };
-  this를 인수로 받게 되면서 admin.js에서 버튼에 접근할 수 있게 된다. 버튼에 접근할 수 있으니 주면 입력값에도 접근할 수 있다.
- btn.parentNode는 버튼의 부모 요소, 이 경우에는 div를 뜻한다.
- div에서 querySelector를 사용해 원하는 값을 추출한다.
=========================================================================================
349_JSON 데이터 형식

JSON은 JavaScript Object Notation의 약자로, 일반적인 JSON 데이터의 구조는 다음과 같다.
    {
        "name": "Your Name",
        "age": 29,
        "courses": [
            "angular-the-complete-guide",
            "react-the-complete-guide"
        ],
        "profile": {
            "joined": "2017-05-21",
            "courses": 2
        },
        "averageRating": 4.8,
        "active": true
    }
일반적인 JavaScript 객체와 비슷하다. 한 가지 다른 점은 모든 키 이름이 큰따옴표(") 안에 있다.
그 외에도, 텍스트 (문자열), 숫자 (정수와 실수), 불리언 데이터뿐만 아니라 중첩된 객체 및 배열을 저장할 수 있다.
더 자세히 알아보려면, 다음 페이지를 참고하자. 
- https://www.json.org/
=========================================================================================
350_백그라운드 요청 전송 및 처리

백엔드에 자바스크립트 요청을 보낼 수 있게 라우트를 추가한다. routes/admin 파일을 보면 이미 /delete-product 라우트가 있는데 이걸 토대로 라우트를 구축해도 되지만, 이 경우 자바스크립트를 통해 직접 요청을 보내기 때문에 HTTP 메서드를 사용할 수 있다. 이 경우에 사용할 delete는 HTTP 메서드의 일종으로 삭제를 위해 사용한다. 사실 post를 사용해도 된다. 보통 서버 측 논리로 무엇이 일어날지 정의하기 때문에 아무 HTTP 메서드를 사용해도 되지만 의도록 분명히 하기 위해 delete를 사용한다.

    router.delete('/product/:productId', isAuth, adminController.deleteProduct);
라우트는 /product에 동적 매개변수 productId를 추가한다. 컨트롤러 액션은 그대로 둘거지만 이제 POST 요청이 아니므로 deleteProduct로 변경한다. admin 컨트롤러에서도 같은 이름으로 바꾼다.
또한 prodId를 더 이상 req.body에서 추출하지 않는다. 삭제 요청에 req.body를 가질수 없기 때문이다. 대신 URL 매개변수인 productId를 통해 ID를 추출한다.
controllers/admin => deleteProduct
    const prodId = req.params.productId;

나머지는 전부 그대로 사용할 수 있다. 마지막으로 반환하는 응답만 변경한다. 새 페이지를 로딩하지 않으므로 redirect는 아니다. 현재 페이지를 유지하기 위해 JSON 데이터를 보낸다.
    .then(() => {
        console.log('DESTROYED PRODUCT');
        res.status(200).json({
            message: 'Success!'
        });
    })
    .catch(err => {
        res.status(500).json({
            message: 'Deleting product failed.'
        });
    });
- .json(): Express.js에서 제공하는 helper 메서드를 사용해 JSON 데이터를 쉽게 반환한다. 자바스크립트 객체와 비슷하게 키-값 쌍으로 나타낸다. 다만 "" 큰따옴표를 사용한다. 
- json 전에는 status로 상태 코드 200을 전달한다. JSON 데이터도 디폴트로 상태 코드 200을 받는데 이 경우 리다이렉트를 통해 자동으로 상태 코드를 받지 않으니 명시하는게 좋다. 마찬가지로 에러 핸들러도 변경한다.
- json에 자바스크립트 객체를 전달하면 자동으로 JSON으로 변환된다. 일반 자바스크립트 객체를 작성할 때는 key에 큰따옴표를 사용하지 않아도 된다.

이제 클라이언트 측에서 요청을 보내야 한다. 이때 HTTP 요청을 보낼 때 브라우저가 제공하는 fetch 메서드를 사용할 수 있는데 이름처럼 단순히 데이터를 가져오는 것 뿐만아니라 데이터를 보내는 데도 사용된다. 
public/js/admin => 
    fetch('/admin/product/' + prodId, {
        method: 'DELETE',
        headers: {
        'csrf-token': csrf
        }
    })
    .then(result => {
        return result.json();
    })
    .then(data => {
        productElement.parentNode.removeChild(productElement);
    })
- 첫 번째 인수로 URL을 전달해 요청을 보내는데 http://를 사용해 호스트를 지정하지 않는 이상 같은 서버로 요청이 보내진다.
- 두 번째 인수로 fetch 요청을 구성할 수 있는 객체를 지정한다. req.body를 추가할 수도 있지만 삭제 요청에서는 하지 않고 POST 요청에서는 가능하다.
- 먼저 요청이 delete임을 정의하기 위해 method='DELETE'를 설정한다. 꼭 대문자일 필요는 없지만 컨벤션이므로 따르도록 하자.
- csrfToken을 부착해야 하는데 삭제 요청에는 body가 없어서 req.body에 보낼 수는 없지만 서버에 사용하고 있는 CSRF 패키지가 req.body뿐만 아니라 쿼리 매개변수도 검토하기 때문에 헤더에 추가해도 된다. 이때 키는 'csrf-token'을 사용하여 찾을 수 있게 하자. CSRF 패키지의 공식 자료에 패키지가 검토하는 모든 키를 볼 수 있다.
- 요청을 보낸 후 프로미스를 반환해 응답을 듣도록 한다.

이때 POST 본문이 없는 삭제 요청이기 때문에 JSON 데이터를 보내지 않고 있다. JSON 데이터는 백엔드에서 분석한다. 현재 app.js에 두 개의 파서가 있다. 하나는 JSON 데이터에 사용하지 않는 urlencoded이고 다른 하나는 마찬가지로 가지고 있지 않은 멀티 파트 데이터이다. 따라서 들어오는 요청에서 JSON 데이터를 추출하려면 새로운 bodyParser가 필요하다. 당장은 필요없으니 나중에 추가한다.

delete 버튼을 눌러보면 에러가 발생하는데 /product/:productId 라우트가 admin 라우트에 있기 때문이다. 요청 경로가 app.js 파일에 구성한 대로 /admin으로 시작해야 한다.

    fetch('/admin/product/' + prodId, { ... }

버튼을 누르고 새로 고침하면 제품이 사라졌다. 이제 새로 고침이 필요없도록 만들자.
=========================================================================================
351_DOM 조작

결과를 받는 것까지 하였다. 결과에는 읽기 가능한 스트림인 cryptic body가 있다. 그럼 then 블록에 result.json을 반환해 새로운 프로미스를 반환하도록 하고 또 다른 then 블록을 추가해 응답 본문을 넣는다. 중요한 것은 두 then 블록 모드 응답으로 서버에서 항목이 삭제될 것이기 때문에 DOM에서도 삭제되도록 해야 한다.
클릭한 버튼에 대한 접근은 만들었었다. 이 버튼은 결국 삭제하고자 하는 DOM 요소 안에 있으며 삭제하려는 것은 article 이다. 따라서 이 버튼에 따라 요소를 찾는다.
    
    const productElement = btn.closest('article');
- closest는 자바스크립트가 제공하는 메서드로, 선택자를 전달하면 선택자와 가장 가까운 조상 요소(Ancestor element)를 준다. 이 요소가 삭제하려는 요소이다.

    fetch('/admin/product/' + prodId, {
        ...
    })
    .then(result => {
        return result.json();
    })
    .then(data => {
        productElement.parentNode.removeChild(productElement);
    })
그리고 부모 요소에 접근하여 자식 요소를 삭제한다.