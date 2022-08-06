Dynamic Content & Templates

지금까지는 정적인 html 페이지만을 전송하고 있었다. 일반적으로 실제 앱에서 하는 행동은 아닌데 왜냐하면 대부분 정적 html 코드만 존재하는 경우가
별로 없고, 서버에서 데이터를 관리하는 경우가 빈번하다. 사용자에게 다시 전달하는 html 코드에 동적으로 출력하길 원하는 데이터를 서버에 두는 것이다.

이번 섹션에서 배우는 것: 데이터베이스를 이용한 데이터 관리, 동적 콘텐츠 렌더링, 템플릿 엔진
=====================================================================================================================
80_Templating Engines

                    Node / Express Content
HTMLish Template ---------------------------> Replaces Placeholders / Snippets with HTML Content ====> HTML File
                    Templating Engine

HTMLish Template: 일단 HTML과 유사한 템플릿이 있고 여기에 일반적으로 코드, 많은 HTML을 포함하는 파일, HTML 구조와 마크업, 스타일 그리고 불러온 자바스크립트 등 일반적으로 포함된 모든 요소를 작성하는데 플레이스홀더에 해당하는 공백도 일부 있다.

Node / Express Content: 앱에 더비 배열과 같은 Node/Express 콘텐츠, 현재 사용하고 있는 제품층

Templating Engine: 특정 구문을 이해하며 이를 위해 HTML과 유사한 템플릿을 스캔한 뒤 사용하고 있는 엔진 종류에 따라 플레이스홀더나 특정 스니펫을 실제 HTML 콘텐츠로 교체한다.

Replaces Placeholders / Snippets with HTML Content: 그 콘텐츠가 거기에서 사용하는 이 HTML 콘텐츠는 상황에 따라 해당 동적 콘텐츠를 반영하는 템플릿 엔진을 통해 서버에 생성된다. 예를 들어 템플릿 엔진의 도움을 통해 Node/Express 앱에 있는 데이터에 대한 목록들이 포함된 순서 없는 목록을 생성할 수 있다. 최종적으로 동적으로, 상황에 따라 생성된
HTML 파일이 되고 이것이 사용자에게 전달될 것이다.

HTML File: 최종적으로 사용자에게 전달되는 결과. 따라서 사용자는 템플릿, 플레이스홀더, 서버에서 일어나는 일을 볼 수 없고 일반적인 HTML 페이지만 보게 된다.
=====================================================================================================================
Available Templating Engines

EJS: <p><%= name %></p> => 일반적인 HTML 구문을 사용하고 자바스크립트를 사용할 수 있게 하는 플레이스홀더가 있어 for 루프를 위해 if문도 작성할 수 있다.

Pug(jade): p #{name} => 최소 HTML 버전과 확장 가능하지만 일반적으로 일련의 요소나 작업 종류만을 제공하는 맞춤형 템플릿 언어를 사용하지만 if과 목록도 포함될 수 있고 반복문도 포함할 수 있다. 

Handlebars: <p>{{ name }}</p> => 일반 HTML을 사용하지만 동시에 제한된 기능의 맞춤형 템플릿 언어도 사용하고, if문이나 목록 등의 공통 요소들을 포함한다.

npm install --save ejs pug express-handlebars
=====================================================================================================================
81_Templating Engine 사용법

app.js 로 가서 ->
app.set('view engine', 'pug'); // ejs 등 다른 것으로 대체 가능
app.set('views', 'views');

템플릿 엔진을 사용하려면 Express에 알려야 한다. 참고로 Node가 아닌 Express의 기능으로  노드 단독으로는 이 과정을 전부 수동으로 해야해서 더 어려울 것이다.
위의 두 구문으로 Express를 준수하는 템플릿 엔진이 있다고 알리기만 하면 된다.

app.set() 은 Express 앱 전체에 어떤 값이든지 설정할 수 있으며 Express가 이해할 수 없는 키 등의 구성 항목도 포함한다. 
여기서 사용하는 것은 'view engine', 'views' 키 이다.

view engine: Express에게 우리가 렌더링 하려는 동적 템플링이 있고 이를 실시하기 위해 특별한 함수가 있으니 내가 등록한 이 엔진을 사용해 달라고 알린다.
view: Express에게 이러한 동적 view를 어디에서 찾을 수 있는지 알리는 기능
* view에 대한 기본값은 이미 메인 디렉터리와 views 폴더로 되어있다.

이제 views 폴더에 템플릿 파일을 추가한다
shop.pug

pug에서는 들여쓰기로 구분하므로 들여쓰기를 잘 작성해야 한다.

tag.className 을 입력하면 해당 HTML 태그를 작성해준다.
header.main-header
    nav.main-header__nav
        ul.main-header__item-list
            li.main-header__item
                a.active(href="/") Shop
            li.main-header__item
                a(href="/admin/add-product") Add Product

마지막으로 템플릿을 응답으로 전송하도록 변경해야 한다. shop.js =>
    res.render('shop');

=====================================================================================================================
82_Dynamic Content 

shop.js =>
    const products = adminData.products;
    res.render('shop', { prods: products, docTitle: 'Shop' });
admin 데이터를 템플릿 엔진에 넘기고 템플릿 파일에서 사용하고 출력하도록 만든다.
렌더링 메서드에 두 번째 인수로 넘길 수 있다. 이때 자바스크립트 객체 형태로 전달하며 이 객체를 키 이름에 맵핑한 뒤 템플릿 내부에서 전달하는 데이터를 참조하기 위해 사용한다.
이제 템플릿 내에서는 prods에만 접근할 수 있게 된다.

shop.pug =>
    title #{docTitle}
#{} 괄호안에 view로 전달하는 값을 넣는다. 따라서 위의 객체에 있는 모든 필드를 사용할 수 있다.

<article class="card product-item">
=>
article.card.product-item
다수의 클래스는 . 으로 결합하여 표현한다.

    each product in prods
pug 의 반복문

    if prods.length > 0
    else 
        h1 No Products

pug 의 조건문

* 템플릿 파일은 변경해도 nodemon에 의해 서버가 재시작되지 않거나 재시작하지 않아도 제대로 작동한다. 왜냐하면 템플릿은 Server side 코드에 포함되지 않기 때문이다.
단순히 상황에 따라 선정되는 요소에 불과하다. 따라서 다음번에 들어오는 요청을 위해 템플릿을 변경하는 경우 새로운 버전을 자동으로 받아들일 것이다.