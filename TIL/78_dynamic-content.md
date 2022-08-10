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
=====================================================================================================================
85_Layout

기존 템플릿에서 기본 구조를 이루는 코드가 계속 반복되고 있다. 이를 수동으로 진행하는 것은 귀찮은 일이다. 
이를 위해 레이아웃을 생성할 수 있다. 
views에 하위폴더 layouts 를 생성하고 그 안에 main-layout.pug 를 생성한다.

이 레이아웃은 다른 pug view의 내부로부터 확장할 수 있으며 플레이스홀더나 훅을 정의하여 다른 view의 콘텐츠를 유입시킬 수 있다.
doctype html
html(lang="kr")
    head
        ...
        block styles 
    body 
        ...       
        block content 
block: pug가 인식하는 키워드
styles: 개발자가 정의한 변수 이름

이제 레이아웃을 사용할 파일로 이동하여 레이아웃을 지정한다.
extends layouts/main-layout.pug

block styles 
        link(rel="stylesheet", href="/css/forms.css") <== 디폴트 레이아웃에 없는 추가하고 싶은 구문
        link(rel="stylesheet", href="/css/product.css")

block content
    h1 Page Not Found!
=====================================================================================================================
86_pug 템플릿 완성

admin.js =>
    res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product' });

main-layout.pug =>
    a(href="/admin/add-product", class=(path === '/admin/add-product' ? 'active' : '')) Add Product        
render에서 view로 넘기는 객체에 path 속성을 추가한다. 이때 실제 경로일 필요는 없고 단지 어디에서 호출된 것인지 구분하기 위한 것이다.

    title #{pageTitle}
템플릿에서 들여 쓴 후 title을 블록으로 만들거나 #{}을 사용해 동적 출력(Dynamic Output)으로 pageTitle을 추가할 수 있다.
이 앱에서는 후자의 방식을 사용했으므로 모든 render() 함수가 pageTitle을 지나도록 해야 한다.
    res.status(404).render('404', { pageTitle: 'Page Not Found!' });
=====================================================================================================================
87_handlebars

    const expressHbs = require('express-handlebars');
먼저 app.js에서 뷰 엔진을 변경해야 한다. 이때 handlebars는 Express에 의해 자동으로 설치되는 패키지는 아니라서 수동으로 등록해야 한다.
일단 위의 구문으로 Express에 이러한 엔진이 있다는 걸 알린다.

    app.engine('hbs', expressHbs()); 
내장되어 있지 않은 엔진 등록
* expressHbs() => 함수가 초기 설정된 뷰 엔진을 반환해서 engine에 넣는다.
    app.set('view engine', 'hbs');

views 폴더에 404.hbs 파일을 생성한다. 이때 확장자는 엔진 이름으로 정의한 hbs를 넣어야 한다. 만약 다른 이름으로 정의했다면 그것과 똑같이 한다.

문법
기본적으로 HTML과 똑같은 태그를 사용하여 복사-붙여넣기로 시작한다.
    <title>{{ pageTitle }}</title>
이때 pageTitle 처럼 템플릿에 데이터를 전달하는 방식은 엔진이 모두 동일하다. 객체에 키-값 쌍을 넣어서 템플릿에서 사용할 수 있다.

- 조건문
    {{#if hasProducts }}
    <div class="grid">
        ...
    </div>
    {{else}}
        ...
    {{/if}}
조건문을 사용할 때 주의할 점은 products > 0 같은 구문을 지원하지 않고 true / false를 출력하는 키만 지원한다.
즉, 템플릿의 논리를 Express 코드로 옮겨서 확인하고 확인 결과를 템플릿에 넣어야 한다. 따라서 shop.js 파일에 템플릿에 넣을 키-값 쌍을 추가한다.
    res.render('shop', { prods: products, pageTitle: 'Shop', path: '/', hasProducts: products.length > 0 });
이 부분이 pug와 가장 다른 점이다. handlebars 템플릿은 논리를 실행할 수 없고 단일 속성, 단일 변수나 그 값만 출력할 수 있다.
복잡하게 보일 수도 있지만 모든 논리를 Express 코드에 넣도록 제한하여 템플릿을 깔끔하게 유지할 수 있다.
템플릿에 논리를 너무 많이 넣으면 코드를 이해하기 어려워질 수 있다.

- 반복문
    {{#each prods}}
        ...
    {{/each}}
안의 요소들이 각 배열의 원소마다 반복될 것이다. 즉, 반복문 안의 html 코드가 모든 제품에 반복될 것이다.
배열의 원소 각각에 접근하는 방법은 한 가지뿐이다. 배열의 요소 중에 현재 반복에 해당하는 키워드를 보여준다. 
    <h1 class="product__title">{{ this.title }}</h1>
이때 하나의 객체를 참조하는데 그 객체는 admin.js 파일에 있는 배열에 저장된 자바스크립트 객체이다. 바로 이 부분이다.
    // '/admin/add-product' POST
    router.post('/add-product',  (req, res, next) => {
        products.push({ title: req.body.title });
        res.redirect('/');
    });
=====================================================================================================================
90_handlebars Layout

핸들바에서 레이아웃을 사용하려면 app.js 의 엔진을 등록하는 곳에서 몇 가지 옵션을 전달해야 한다.
    app.engine('hbs', expressHbs({ 
        layoutsDir: 'views/layouts/', 
        defaultLayout: 'main-layout', 
        extname: 'hbs' 
    }));
- layoutDir: 레이아웃이 어디에 위치할지 즉, 레이아웃을 찾을 수 있는 폴더를 설정한다.
기본값은 view/layouts/ 이지만 기본값이므로 굳이 설정할 필요는 없다. 만약 폴더가 다른경우 설정해야 한다.

- defaultLayout: 모든 파일에 적용되는 기본 레이아웃을 정의한다.

- extname: 레이아웃은 디폴트로 파일 확장자를 .handlebars 으로 사용하므로 이 속성에 문자열로 원하는 확장자를 명시해야 한다. 

    {{{ body }}}
플레이스홀더를 설정한다. 레이아웃을 자동으로 확장하는 views에서 지정할 수 있는데 기본 레이아웃으로 설정해놨기 때문이다.
접속하는 페이지에 따라 일부 스타일링을 추가해야 하는 부분이 있는 경우 if문으로 추가할 수 있다. 더 다양한 기능이 있으므로 공식 문서를 참조한다.
main-layout.hbs =>
    {{#if formsCSS }}
    <link rel="stylesheet" href="/css/forms.css">
    {{/if}}
    {{#if productCSS }}
    <link rel="stylesheet" href="/css/product.css">
    {{/if}}

    ...

    <li class="main-header__item"><a class="{{#if activeShop}}active{{/if}}" href="/">Shop</a></li>
    <li class="main-header__item"><a class="{{#if activeAddProduct}}active{{/if}}" href="/admin/add-product">Add Product</a></li>
이 변수들은 .js에서 view로 전달해야 하고 만약 전달하지 않으면 항상 거짓으로 취급되므로 참으로 처리되길 원하는 경우에만 전달하면 된다.

shop.js =>
    res.render('shop', { 
        prods: products,
        pageTitle: 'Shop',
        path: '/', 
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true,
        // layout: false
    });
- layout: 핸들바가 인식하는 특별한 키에 해당하며 false일 경우 기본 레이아웃을 사용하지 않는다. 이 앱은 기본 레이아웃을 사용하므로 제외한다.

이제 레이아웃을 사용하길 원하는 템플릿 파일에서 중괄호 3개 안에 들어간 body 위치에 렌더링 되어야 하는 부분을 제외하고 모두 제거한다.
    <main>
        <form class="product-form" action="/admin/add-product" method="POST">
            <div class="form-control">
                <label for="title">Title</label>
                <input type="text" name="title" id="title">
            </div>

            <button class="btn" type="submit">Add Product</button>
        </form>
    </main>
=====================================================================================================================
91_EJS

    res.render('add-product', { 
        pageTitle: 'Add Product', 
        path: '/admin/add-product', 
    });
다른 템플릿 엔진처럼 템플릿에 데이터를 가진 객체를 정의할 수 있는데, 템플릿에 변수로 전달된다. 즉, 기존처럼 객체 전제가 전달되는 것이 아니라 템플릿에 pageTitle, path 각각의 변수로 전달되어 사용할 수 있다.

app.js =>
    app.set('view engine', 'ejs');
pug처럼 즉시 지원되는 템플릿 엔진이므로 등록 과정은 생략한다.


다음으로 views 에 사용할 페이지의 .ejs 템플릿 파일을 생성한다.

- 플레이스홀더
    <%= pageTitle %> 
<% %> : ejs의 플레이스홀더 표현식
= : 이 위치에 값을 출력할 것임을 명시

- if 조건문
    <% if (prods.length > 0) { %>
        ...
    <% } else { %>
        ...
    <% } %>
이 위치에 직접 값을 출력하지 않으므로 = 기호는 쓰지 않는다. 일정 코드를 랩, 즉 둘러싸는 방식으로 표현한다. 좋은 점은 Vanilla JavaScript 코드를 쓸 수 있다는 것이다.

- 반복문
    <% products.forEach(p => { %>
        <li><%= p.productData.title %>(<%= p.qty %>)</li>
    <% }) %>

    <% for (let product of prods) { %>
        ...
    <% } %>
반복문 역시 바닐라 자바스크립트 코드를 이용하여 다양한 방식으로 작성할 수 있다. 이 앱에서는 아래 방식을 사용한다.
    <%= product.title %>
객체이기 때문에 .title로 접근한다.
=====================================================================================================================
92_ejs layout

EJS에 레이아웃은 없지만 Partials 혹은 Includes를 지원한다. 이것은 pug, handlebars도 지원한다.
이 개념은 일부 코드 블록을 템플릿 내부의 다양한 부분들에서 재사용함으로써 템플릿에서 이들을 공유한다는 것이다. 어떻게 보면 레이아웃과 반대되는 개념인데,
하나의 마스터 레이아웃을 사용하여 각각의 view 부분을 입력하는 대신 공유된 view 부분들을 생성하고자 하는 view들에 통합시킬 수 있다는 것이다.

우선 views 폴더 안에 includes 폴더를 생성한다. 이름은 자유롭게 정하면 된다. 여기에 공유될 파일 내지는 공유될 코드 블록을 몇 개 생성한다.

    <%- include('includes/head.ejs') %>
이제 이 코드가 필요한 템플릿에 import 한다. include()는 ejs가 제공하는 키워드로 특정 요소를 이 페이지에 포함할 수 있게 한다.
경로는 들어와있는 파일에서 보이는 경로를 입력한다.
이때 - 기호를 붙이는데 이것은 Unescaped HTML Code를 출력할 때 사용하는 기호이다.
* Unescaped: 만약 = 기호가 있을 때 HTML 코드를 가진 문자열에 해당하는 변수를 렌더링하는 경우, 사이트 간 스크립팅 공격(CSS: Cross Site Scripting)을 피하기 위해 해당 HTML 코드가 렌더링되지 않으며 대신 텍스트로 렌더링 된다는 뜻이다. - 기호는 이러한 기능을 쓰지 않고 HTML 코드를 바로 렌더링할 수 있다.

    <li class="main-header__item"><a class="<%= path === '/' ? 'active' : '' %>" href="/">Shop</a></li>
HTML 태그의 속성의 값을 동적으로 변경하는 방법
=====================================================================================================================
93_템플릿 엔진 정리

최종적으로 브라우저에서 소스 코드 검사에 보이는 코드는 ejs 코드나 자바스크립트 코드가 아닌 일반 html 코드가 나온다는 걸 유념할 것
서버에 임의로 생성된 html 코드이며 브라우저에 생성된 코드는 아니다. 들어오는 요청에 따라 서버에 생성되는 것이다.

또한, 템플릿 엔진의 기능 중 투입된 데이터가 바뀌지 않을 경우 완성된 템플릿의 캐시를 저장하는데, 모든 요청에 따라 템플릿을 다시 구축하지 않으니 좀 더 빨리 반환할 수 있다.

하지만 모두 배후에서 일어나는 작업이며 이것을 이해하는 것이 중요하다.