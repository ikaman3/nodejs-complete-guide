Pagination

Fetching Data in Chunks

이제 파일을 다루고 즉시 서버에 생성할 수도 있으니 DB의 작업 내지는 데이터베이스와의 상호작용으로 돌아가보자. 지금은 제품 페이지를 표시할 때 모든 제품을 가져오고 있다. 이를 개선하기 위해 페이지화(Pagination)라는 기법을 알아볼텐데 데이터를 다수의 페이지에 걸쳐 분할할 수 있으며 많은 데이터를 다룰 때 일반적으로 사용하는 기법이다.
=========================================================================================
338_페이지화 링크 추가

페이지 아래쪽에 1, 2, next 또는 이전페이지로 이동하는 컨트롤이 있을 것이다. 바로 그 기능인 페이지화를 구현하려고 한다. 제3자 패키지를 사용할 수도 있지만 여기서는 직접 구현해본다. 

쿼리 매개변수를 추가하여 부차적 데이터를 명시한다. 첫 번째 페이지를 로드하려면 page=1, 두 번째 페이지를 로드하려면 page=2 등을 명시할 수 있고 추가한 컨트롤로 이 쿼리 매개변수를 변경할 수 있다.
views 폴더에서 루트 라우트의 / 요소를 다룬다. 즉, index.ejs 파일에서 제품 아래쪽, 제품이 있다는 걸 아는 부분에 새로운 섹션을 추가한다. 여기에 쿼리 매개변수의 값을 1 또는 2로 설정한다.
    <section class="pagination">
        <a href="/?page=1">1</a>
        <a href="/?page=2">2</a>
    </section>
그리고 간단한 스타일링을 한다. 
* CSS 파일 참조
=========================================================================================
339_데이터 청크 검색

쿼리 매개변수를 설정했으니 백엔드에 있는 데이터를 이용하기 위해 가져온다.
우선 상수에 페이지마다 얼마나 많은 항목이 보여야 할지 정의한다.
    const ITEMS_PER_PAGE = 2;
- 한 페이지당 2개의 아이템을 보여줄 것을 의미한다.

이제 DB로부터 검색하는 데이터의 양을 조절한다. find는 모든 제품을 주는데 사실 통제가 가능하다. MongoDB에서는 skip 함수를 쓸 수 있다. 따라서 Mongoose도 가능하다.
controllers/shop => getIndex
    const page = +req.query.page || 1;
    Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .then(...)
- req.query.page는 문자열이다. 따라서 그냥 계산하면 문자열 '1'에 숫자 1을 붙여 11로 연결된다. 앞에 + 기호를 붙여 숫자 형식으로 바꾼다. 또한 URL에서 쿼리 매개변수를 제거한 후 로드하면 NaN 버튼이 나타난다. page 매개변수가 없기 때문이다. 이 문제를 위해 ||를 추가하여 쿼리 매개변수가 정의되지 않거나 올바른 값이 아니면 기본값으로 1을 사용한다.
- 커서에 추가하면 find()가 커서를 반환해 결과 중 첫 X개의 데이터를 생략한다. 이 경우에는 (page - 1) 즉, 이전 페이지 번호 곱하기 ITEMS_PER_PAGE를 입력한다. 페이지 2에 있다면 현재 페이지에서 1을 뺀 1에 페이지당 항목을 곱한 만큼 생략하는 것이다. 페이지 2에 있고 페이지당 항목이 두 개니까 1 곱하기 2 즉, 첫 두 제품을 생략한다.
- 이때 생략뿐만 아니라 받게 되는 항목의 양도 제한해야 이전 페이지의 항목을 생략하고 현재 페이지에 보여줄 만큼의 항목만 가져올 수 있다. limit() 메서드를 사용한다. limit 메서드는 이름처럼 가져오는 데이터의 양을 지정한 숫자로 제한한다. ITEMS_PER_PAGE를 입력했으므로 2개의 데이터로 제한한다.
=========================================================================================
340_SQL에서 skip, limit

MongoDB 사용 시, 위에서 본 것처럼 skip()과 limit()을 사용할 수 있다.
그럼 SQL에서는 어떻게 작동할까?

다음 페이지에 SQL 코드에 페이지화(pagination)를 구현할 수 있는 방법이 나와 있다. 
- https://stackoverflow.com/questions/3799193/mysql-data-best-way-to-implement-paging

간단히 정리하자면 LIMIT 명령어를 사용해 가져오는 데이터의 양을 제한한다. limit() 과 같은 역할을 한다. OFFSET 명령어(skip() 대체)와 함께 사용하면, 가져오는 항목의 개수와 생략하는 항목의 개수를 정할 수 있다.

Sequelize 사용 시, 다음 공식 참고자료를 참고해서 페이지화를 추가하자. 
https://sequelize.org/master/manual/model-querying-basics.html
=========================================================================================
341_서버에서 페이지화 데이터 준비

쿼리 매개변수를 통해 가져오는 항목을 생략, 제한하는 법을 배웠다. 페이지 버튼은 아직 하드코딩 되어 있는데 현재 페이지를 표시하고 이전 페이지와 다음 페이지를 표시하기 위해 더 많은 정보를 준비한다.
contollers/shop => getIndex
    let totalItems;

    Product.find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts
            return Product.find()
                .skip(...)
                .limit(...);
        })
        .then(products => {
            res.render('shop/index', {
                ...
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
        })
- 모든 제품을 검색하지 않고 숫자만 검색하기 위해 then 블록 함수에 numProducts를 입력하고 모든 데이터를 가져오는 요청을 내부로 옮긴다. 정리하자면 총계를 찾고 제품의 개수를 받아 일반적인 find 메서드로 항목을 가져온 후 생략하고 제한한다.
- 이후 인덱스 페이지를 렌더링하는 코드에 해당 정보를 반환한다. 
- lastPage는 가장 높은 페이지 번호를 나타내는데, 11개의 제품이 있고 페이지당 두 개의 제품을 보인다면 계산한 값이 5.5이므로 Math.ceil()이 6을 반환한다.
=========================================================================================
342_동적 페이지화 버튼 추가

백엔드로부터 받은 정보를 이용해 index.ejs 페이지를 렌더링한다.
views/shop/index =>
    <% if (currentPage !== 1 && previousPage !== 1) { %>
        <a href="?page=1">1</a>
    <% } %>
- 현재 페이지가 1이 아닌 경우에만 렌더링 된다.
    <a href="?page=<%= currentPage %>" class="active"><%= currentPage %></a>
- class에 active를 추가하여 마우스 커서를 올렸을 때와 같은 스타일로 만든다.
    <% if (hasNextPage) { %>
        <a href="?page=<%= nextPage %>"><%= nextPage %></a>
    <% } %>
    <% if (lastPage !== currentPage && nextPage !== lastPage) { %>
        <a href="?page=<%= lastPage %>"><%= lastPage %></a>
    <% } %>
- 다음 페이지가 마지막 페이지가 아니어야 한다. 다음 페이지가 마지막 페이지라면 이미 링크가 렌더링 됐을 테고 nextPage와 lastPage가 겹치기 때문이다.
=========================================================================================
343_페이지화 논리 및 컨트롤 재사용

Shop 페이지에 페이지화를 완성했으니 Products 페이지에도 적용한다. 위에서 작성한 section을 잘라내서 새로운 템플릿을 작성한다.
views/includes/pagination.ejs =>
    <section>...</section>

pagination.ejs 파일에 데이터를 전달해야 한다.
views/shop/index =>
    <%- include('../includes/pagination.ejs', {
        currentPage: currentPage, 
        nextPage: nextPage, 
        previousPage: previousPage, 
        lastPage: lastPage, 
        hasNextPage: hasNextPage, 
        hasPreviousPage: hasPreviousPage
    })%>

같은 코드를 product-list.ejs에도 추가한다. 그리고 getIndex의 컨트롤 논리도 getProducts에 덮어쓰기 한다.
controllers/shop => getProducts
    const page = +req.query.page || 1;
    let totalItems;

    Product.find()
        .countDocuments()
        .then(numProducts => {
            ...
        })
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Products',
                path: '/products',
                ...
            });
        })

pagination.ejs 파일에 절대 경로로 / 다음 쿼리 매개변수를 사용하는데 /를 제거하고 쿼리 매개변수만 남겨야 현재 URL과 경로를 갖게 된다.
즉, /products를 입력해도 페이지가 나타나고 /뒤에 아무것도 입력하지 않아도 페이지가 나타나야 한다. 다시 말해 /로 끝나는 URL로 접근하면 페이지와 쿼리 매개변수가 /뒤에 바로 붙지만 /products로 접근하면 그 뒤에 쿼리 매개변수가 추가돼 /product?page=1 등이 된다.