115_동적 라우트 및 고급 모델

개요
지난번에는 지금까지 만든 앱을 다듬었다. 이제 라우트에 동적 데이터를 전달할 능력을 갖추어야 한다.
url에 정보를 인코딩해서 제품 ID와 같은 정보를 url의 일부로 입력하고자 한다.
이번 섹션에서는 실제로 url을 통해 데이터를 제출하거나 전송하는 방법과 요청 본문에 대신 넣어야 하는 경우에 대하여 배울 것이다. 
또한, 모델 작업도 이어갈 텐데 정확히는 라우트 매개변수를 입력하는 방법(Passing Route Params)과 쿼리 매개변수 사용법(Using Query Params)을 배울 것이다. 이 둘은 Express 라우터에서 지원하는 중요한 기능으로 단순히 정보를 입력하는 것만이 아니라 이번 섹션에서는 모델을 강화(Enhance our Models)하는데 활용할 것이다.
그 과정에서 더 많은 기능을 추가하고 새로운 모델을 추가한다.
======================================================================================================================================
118_경로에 제품 ID 추가

views/product-list.ejs =>
    <a href="/products/information" class="btn">Details</a>
Details는 그냥 /가 아니라 해당 제품의 세부 정보를 표시하는 페이지로 연결되어야 하는데 이는 경로의 일부로 추가 정보를 전달해야 하는 활용 사례에 해당한다. /products를 불러오고 이 특정 제품에 대한 /information을 불러오고 싶다면 이를 위해 고유 식별자가 필요하다. 그러므로 먼저 생성되는 모든 제품이 고유 ID를 가져야 한다.

models/product.js => save() 메서드
    this.id = Math.random().toString();
새로운 제품을 생성하거나 파일 또는 데이터베이스에 저장할 때 ID를 추가해야 한다. 이 앱에서는 save에서 추가한다.
- this.id: 작업 중인 제품 객체 전체에 새로운 속성을 추가한다. 


views/product-list.ejs =>
    <a href="/products/<%= product.id %>" class="btn">Details</a>
생성한 고유 ID를 이 경로에 입력한다. 여기 링크 또는 경로의 일부로 무언가 출력하도록 ejs를 활용한다. 
이제 이 링크는 products로 향하며 무작위 값을 쓸 수 있다.
ex) /products/0.6720501002256918
이제 이를 처리하여 라우트 파일의 경로에서 ID를 추출할 수 있는지 확인한다. 그래야 컨트롤러가 올바른 제품을 불러오고 해당하는 세부 정보를 표시할 수 있다.
이렇게 경로의 일부로써 정보를 전송하여 컨트롤러나 그 내부로부터 제품에 대한 모든 정보를 추출한다. product 전체를 URL의 일부로 보낼 수는 없지만 이 핵심 정보를 보낼 수는 있다.
======================================================================================================================================
119_동적 매개변수 추출하기

url에서 정보(id)를 추출해야 한다.
routes/shop.js => 
    router.get('/products/:productId', shopController.getProduct);
- 새로운 페이지를 표시하는 것이므로 get 라우트이다.
- 경로의 일부는 products 이지만 그것 뿐만은 아니다. Dynamic Segment인 ID가 있다. Express 라우터는 이를 지원한다. 콜론을 추가하고 productId 처럼 원하는 이름을 입력하여 변수 세그먼트가 있음을  Express 라우터에 알릴 수 있다. 이 이름으로 정보를 추출할 수 있다. 중요한 것은 콜론(:)이다. 콜론은 Express에게 productId와 같은 라우트를 탐색하지 말라는 신호를 보낸다. 대신 productId 부분에는 무엇이 와도 되는데, 그러면 단순히 라우팅하거나 이 경로에 대해 라우트를 불러올 것이다. 그 다음 이름을 통해 정보를 추출한다.
- router.get('/products/delete') 같은 일반 라우트가 있다고 가정하자. 이때 순서가 중요한데, 코드가 위에서부터 아래로 파싱되고 요청이 위에서 아래로 거쳐간다는 것을 기억하라.
    router.get('/products/:productId', shopController.getProduct);
    router.get('/products/delete');
만약 이런 순서로 배치한다면 절대 delete 라우트에 도달하지 못한다. 콜론은 어떤 값이든 처리하기 때문에 Express가 위의 라우트에서 처리해버린다. 이때 delete는 동적 세그먼트 취급을 받기 때문이고, 따라서 동적 세그먼트와 특정 라우트가 있으면 더 구체적인 라우트를 앞에 두어야 한다. 
    router.get('/products/delete');
    router.get('/products/:productId', shopController.getProduct);

controllers/shop.js =>
    exports.getProduct = (req, res, next) => {
        const productId = req.params.productId;
        console.log(productId);
        res.redirect('/');
    };
이제 url로부터 정보를 추출한다. 새 컨트롤러를 추가하는데 순서는 중요하지 않다.
- req.params.productId: 요청을 액세스할 수 있으며 Express.js는 이미 요청에 대한 params 객체를 제공한다. 
이 params 객체에서 productId에 접근할 수 있다. 이때 productId 이름은 routes/shop.js 에서 콜론 다음에 정의한 이름을 사용한다. 
======================================================================================================================================
121_제품 상세 보기 렌더링

뷰를 추가하거나 기존 뷰에 논리를 추가한다. 기본 템플릿을 복사하여 시작한다.
views/shop/product-detail.ejs =>
    <main class="centered">
        <h1><%= product.title %></h1>
        <hr>
        <div>
            <img src="<%= product.imageUrl %>" alt="<%= product.title %>">
        </div>
        <h2><%= product.price %></h2>
        <p><%= product.description %></p>
        <form action="/cart" method="POST">
            <button class="btn" type="submit">Add to Cart</button>
        </form>
    </main>

이제 detail 라우트에 대해 뷰를 렌더링하도록 설정한다.
controllers/shop.js => exports.getProduct
    const productId = req.params.productId;
    Product.findById(productId, product => {
        res.render('shop/product-detail', { 
            product: product,
            pageTitle: product.title,
            path: '/products'
        });
    });
- 콜론 오른쪽의 product는 데이터를 가져올 product이고, 왼쪽의 product는 단순히 key이며 이를 통해 뷰에서 액세스 한다. 
======================================================================================================================================
122_POST 요청으로 데이터 전달하기

Add to Cart는 POST 요청을 보낸다. 중요한 사실은 req.body를 통해 데이터를 전달할 수 있다는 점이다. get 요청에서는 불가능하다. 그러나 post 요청에서는 일반적으로 req.body를 사용한다. 이미 제품 추가에서 사용했었다.

form 태그는 자동으로 모든 입력 데이터가 body에 포함된 요청을 준다. 그러나 post 데이터만 가능하다. 데이터를 get 할 때는 사용할 수 없지만 post 할 때는 url에 정보를 추가할 필요가 없다. 정보를 post body에 넣으면 되기 때문이다. 
views/shop/product-list.ejs =>
    <input type="hidden" name="productId" value="<%= product.id %>">
input을 추가하고 타입은 히든으로 하면, 페이지에 표시되지 않지만 전송되는 요청에는 인코딩된다. 

routes/shop.js =>
    router.post('/cart', shopController.postCart);
라우트 추가

controllers/shop.js =>
    exports.postCart = (req, res, next) => {
        const productId = req.body.productId;
        console.log(productId);
        res.redirect('/cart');
    };
컨트롤러 추가

form 구문이 여러 파일에서 반복되므로 includes에 add-to-cart.ejs 템플릿 추가
이때 product-list.ejs 에서 에러가 발생하는데 
    <% for (let product of prods) { %>
        ...
    <%- include('../includes/add-to-cart.ejs', {product: product}) %>
    
product가 해당 루프에서만 사용 가능한 로컬 변수이기 때문이다. 따라서 루프에 포함된 include에서는 기본적으로 이 변수를 받지 못한다. 이를 위해 include 함수에 두 번째 인자로 객체를 입력하고 변수를 추가한다. 이때도 역시 오른쪽 product는 이 파일에서 사용 가능한 값이며, 왼쪽 product는 키 값이다.
======================================================================================================================================
123_Cart 추가하기, Model 추가 방법

models 폴더에 cart.js 파일을 생성한다. 장바구니는 이 프로젝트에서 독립된 대상으로 볼 수 있기 때문이다.
이제 cart를 어떻게 관리할 지 고민해야 한다. 
우선 cart에 추가한 제품이 모두 보관되어야 한다. 또한 제품을 ID로 묶어서 같은 제품을 하나 이상 추가할 경우 수량이 증가하도록 해야한다. 이를 구현하기 위해 먼저 새로운 cart를 생성하는 생성자를 쓸 수 있다.
    constructor() {
        this.products = [];
        this.totalPrice = 0;
    }
- this.products: 하나의 배열이며 이 안에 ID나 중요한 정보가 담긴 객체가 들어가며 제품의 수량도 들어간다.

이제 장바구니에 필요한 것은 제품을 추가/삭제할 수 있는 메서드다. 그러나 문제는 장바구니 자체가 계속해서 다시 생성할 객체는 아니라는 점이다. 새로운 제품을 추가할 때마다 새로운 cart를 만들지 않는다. 대신 앱 내에 하나의 장바구니가 있고 거기에서 제품을 관리하기를 원한다. 따라서 위의 생성자 대신 다른 접근법을 써본다.
    module.exports = class Cart {
        static addProduct(id, productPrice) {
            // Fetch the previous cart
            fs.readFile(p, (err, fileContent) => {
                let cart = { products: [], totalPrice: 0 };
                if (!err) {
                    cart = JSON.parse(fileContent);
                }
                // Analyze the cart => Find existing product
                const existingProductIndex = cart.products.findIndex(
                    prod => prod.id === id
                );
                const existingProduct = cart.products[existingProductIndex];
                let updatedProduct;
                // Add new product/ increase quantity
                if (existingProduct) { // 같은 제품이 이미 있는 경우
                    updatedProduct = { ...existingProduct };
                    updatedProduct.qty += 1;
                    cart.products = [...cart.products];
                    cart.products[existingProductIndex] = updatedProduct;
                } else { // 새로 추가하는 제품인 경우
                    updatedProduct = { id: id, qty: 1 };
                    cart.products = [...cart.products, updatedProduct];
                }
                cart.totalPrice += +productPrice;
                fs.writeFile(p, JSON.stringify(cart), err => {
                    console.log(err);
                });
            });
        }
    };
- id, productPrice: 추가하길 원하는 제품의 id, price
- updatedProduct = { ...existingProduct } : 차세대 자바스크립트의 객체 스프레드 연산자를 사용한다. existingProduct의 모든 속성을 새로운 객체에 추가한다.
- updatedProduct.qty += 1: 스프레드 연산자로 existingProduct의 모든 속성을 updatedProduct에 분배했으므로 updatedProduct는 qty 속성을 가지고 있다.
- cart.products = [...cart.products, updatedProduct]: 기존 cart를 갱신한다. 기존 cart + 새로 추가된 제품을 저장한다.
- cart.products = [...cart.products];
  cart.products[existingProductIndex] = updatedProduct;
만약 이미 추가된 제품이라면 새 제품을 등록하지 않고 기존 제품을 대체한다. 그러기 위해서 기존 제품이 저장된 인덱스가 필요하기 때문에 findIndex 메서드를 사용하여 일치하는 id 값을 가진 원소의 인덱스를 알아낸다. 그리고나서 해당 인덱스의 제품의 수량을 +1 한 제품을 덮어쓰기 한다. 따라서 기존 위치의 요소를 updatedProduct로 교체하게 된다.
- cart.totalPrice += +productPrice; : cart.js에서 추출하는 가격은 product 모델에 문자열 형태로 저장되어 있어 + 연산을 했을 때 문자열이 연결되어 버린다. 그러므로 productPrice를 다룰 때는 앞에 + 기호를 붙여서 문자열을 숫자로 변환한다. 
- fs.writeFile(p, JSON.stringify(cart), err => { ... }: 장바구니 추가를 완료했으니 이제 저장하면 된다.

controllers/shop.js =>
    const Cart = require('../models/cart');
    ...
    exports.postCart = (req, res, next) => {
        const productId = req.body.productId;
        Product.findById(productId, (product) => {
            Cart.addProduct(productId, product.price);
        });
        res.redirect('/cart');
    };
- Product.findById(productId, (product) => {...}: product를 가져올 콜백이 있다. 여기에는 products 데이터베이스 또는 products 파일에서 가져온 product가 있다. 이걸 얻으면 제품 정보를 사용해서 cart를 갱신할 수 있다. 
- Cart.addProduct(productId, product.price): cart 모델은 기본적으로 유틸리티 모델 역할을 한다. 인스턴스를 생성하는게 아닌 정적 함수를 사용한다.
======================================================================================================================================
124_Query parameter

edit-product에서 최종적으로 하고 싶은 것은 add-product와 동일한 형식을 렌더링 하는 것이다. 차이점은 이 형식을 내가 편집하고 싶은 제품의 값으로 미리 채우고 싶다는 점이다. 결과적으로 동일한 HTML 코드를 쓴다면 동일한 템플릿을 재사용하는게 효율적이므로 add-product 코드를 옮기고 삭제한다. 그리고 컨트롤러도 수정한다.

controllers/admin.js =>
    exports.getAddProduct = (req, res, next) => {    
        res.render('admin/edit-product', { 
            pageTitle: 'Add Product', 
            path: '/admin/add-product', 
        });
    };
밑의 경로는 add-product로 남겨놨는데 그 이유는 특정 내비게이션 항목을 강조할 때 사용하기 때문이다.

이제 편집 동작을 어떻게 구현할 지가 문제다. edit 버튼을 클릭하면 edit-product를 호출하는 대신 추가하고 싶은 상품의 ID 또한 덧붙이고자 한다. 그래서 데이터에서 실제 ID를 가져와 url에 반영하고 해당 상품에 대한 데이터로 형식을 미리 채우려 한다. 그리고 save 버튼을 누르면 생성이 아니라 편집한 내용을 저장하고 싶다. 
이를 위해 두 가지가 필요하다 전달해야 할 ID, 상품을 생성하는 대신 편집하고 싶다는 정보

일단 라우트를 추가한다.
routes/admin.js => 
    router.get('/edit-product/:productId', adminController.getEditProduct);

controllers/admin.js =>
    exports.getEditProduct = (req, res, next) => {    
        const editMode = req.query.edit;
        if (!editMode) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', { 
            pageTitle: 'Edit Product', 
            path: '/admin/edit-product',
            editing: editMode
        }); 
    };
- editing: 사용자가 편집을 원한다는 정보를 담을 속성. 이때 editMode는 String 값이다. 즉, true 가 아닌 "true"가 저장되니 주의할 것
URL에서 쿼리 매개변수를 사용자가 전달하도록 만듦으로써 추가 확인을 하고 싶다고 가정하자. 쿼리 매개변수는 ?를 추가하여 모든 URL에 추가할 수 있으며 edit=true를 비롯한 = 기호로 분할한 키-값 쌍을 넣으면 된다. & 기호로 분할하여 다수의 쿼리 매개변수를 넣을 수 있다. 
ex) http://localhost:3000/admin/edit-product/123323?edit=true&title=new
이것을 Optional Data 라고 한다. 도달하게 되는 이 라우트는 ? 표시의 앞 부분까지를 통해 결정된다. 따라서 routes 파일로 전달할 쿼리 매개변수에 대한 정보를 추가할 필요 없다. 라우트 파일의 경로는 영향을 받지 않는다. 그러나 컨트롤러에 있는 쿼리 매개변수는 확인해야 한다. 
- const editMode = req.query.edit : request 에서 쿼리 객체가 있는지 확인할 수 있다. Express에서 생성 및 관리해준다. URL에 쿼리 매개변수의 목록이 있고 이름이 일치하는 매개변수가 있는 경우에 정해진 값을 얻게 된다. 위의 예제의 경우 "true"를 얻을 것이다. 그리고 값이 없거나 찾을 수 없다면 undefined가 되고 이후 조건문에서 false 처리될것이다. 
사실 이 작업은 중복되는 느낌이다. 왜냐하면 우리는 이미 상품을 편집하고 싶다는 걸 알기 때문이다. 그러나 쿼리 매개변수로 
Optional Data를 설정하고 전달하면 사용자를 Tracking 하거나 사용자가 페이지에 적용한 특정 필터를 유지하기 위해 사용된다. (쇼핑몰의 검색 필터를 떠올리면 될 듯하다)
======================================================================================================================================
125_제품 편집 페이지를 데이터로 채우기, view에 데이터 채우기

controllers/admin.js =>
    const prodId = req.params.productId;
- URL에서 제품 ID를 받는다.

views/admin/edit-product.ejs =>
    <button class="btn" type="submit"><% if (editing) { %>Update Product<% } else { %>Add Product<% } %></button>
    <form class="product-form" action="/admin/<% if (editing) { %>edit-product<% } else { %>add-product<% } %>" method="POST"></form>

- ejs의 문법을 이용하여 동적으로 뷰에 보여줄 콘텐츠를 변경한다. form 태그의 action 속성처럼 url에 세그먼트를 주입할 수 있는데 결국에는 텍스트로 변환되기 때문이다. 이것은 모든 템플릿 엔진의 공통점이다. 이를 활용하여 editing 변수의 값에 따라 보이는 뷰를 동적으로 제공한다.
======================================================================================================================================
127_제품 데이터 편집하기, 데이터 업데이트 방법

이미 확보한 기능을 업데이트에 활용할 수 있다.
models/products.js => save()
    getProductsFromFile(products => {
        if (this.id) {
            const existingProductIndex = products.findIndex(
                prod => prod.id === this.id
                );
                const updatedProduct = [...products];
                updatedProduct[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
                    console.log(err);
                });
        } else {
            this.id = Math.random().toString();
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        }
    });
- if (this.id) ~ else : id가 이미 있다면 기존 제품을 업데이트(덮어쓰기)하고, id가 없다면(null) 새로운 제품을 생성하는 로직이다. 그래도 어차피 모든 제품은 알아야하므로 콜백 안에서 업데이트 한다.
- const existingProductIndex = products.findIndex(prod => prod.id === this.id);
: products는 배열에 해당하고 임시 prod 인수 또는 익명 함수의 prod 임수에 저장되어 있는 모든 제품에 액세스하고 이 배열에 찾는 제품의 ID가 this.id와 같은지 확인한다. 달리 말하면 편집하려는 제품을 현재 보고 있다면(찾았다면) 그 제품의 인덱스를 저장한다.
- updatedProduct[existingProductIndex] = this : 클래스 내부에 있는 this는 이미 업데이트된(사용자가 편집한 값이 생성자를 통해 들어온 상황) 제품이며 새로운 제품 인스턴스를 생성하고 기존 제품에 관한 정보로 채울 것이다.
즉, save() 메서드를 호출한 시점에서 사용자의 입력 값은 받은 상태이고 이것을 기존 데이터에 덮어쓰기하면 되는 것이다.

이렇게 save 함수로 새 제품을 추가할 수도 있고, 기존 제품을 편집할 수도 있게 되었다. 그러므로 새 제품을 추가하는 컨트롤러에 argument를 추가해야 한다.
controllers/admin.js => exports.postAddProduct
    const product = new Product(null, title, imageUrl, description, price);
exports.postEditProduct =>
    const prodId = req.body.productId
    ...
    const updatedProduct = new Product(
        prodId, 
        updatedTitle, 
        updatedImageUrl, 
        updatedDesc, 
        updatedPrice
    );
    updatedProduct.save();
    res.redirect('/admin/products');
- POST 요청이기 때문에 Request body에서 해당 정보를 가져올 수 있다. 이를 위해 view에서 제품 ID를 전송하는 hidden input을 추가한다.
    <% if (editing) { %>
        <input type="hidden" value="<%= product.id %>" name="productId">
    <% } %>
======================================================================================================================================
128_제품 삭제 기능

삭제 기능 구현 과정은 업데이트와 거의 동일하다. 뷰에서 id를 hidden으로 전달하고 라우트를 거치고 삭제 컨트롤러를 만든다. 컨트롤러에서는 models의 클래스에 정의된 delete 메서드를 호출할 것이니 product 클래스에 delete 메서드를 작성한다. 이때 객체를 생성하려는 게 아니므로 정적 메서드로 정의한다.

models/product.js => static deleteById
    static deleteById(id) {
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            const updatedProducts = products.filter(prod => prod.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                if (!err) {
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }
- filter: 익명 함수 중 하나이다. 함수의 반환 기준에 맞지 않는 모든 요소를 새로운 배열로 반환한다. 즉, () 안의 조건을 부합한다면 true를 반환하고 요소가 유지된다. 그럼 삭제하려는 ID와 다른 ID를 가진 모든 요소를 유지해서 파일에 새로운 배열에 쓰이게끔 하면 된다. 

제품이 삭제되었으니 장바구니에서 해당 제품도 삭제되어야 한다.
models/cart.js => static deletePrduct
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            return;
        }
        const updatedCart = { ...JSON.parse(fileContent) };
        const product = updatedCart.products.find(prod => prod.id === id);
        const productQty = product.qty;

        updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
        updatedCart.totalPrice -= productPrice * productQty;

        fs.writeFile(p, JSON.stringify(updatedCart), err => {
            console.log(err);
        });
    });
- if (err) : 삭제할 장바구니가 없으니 그냥 무시하는 구문이다.
======================================================================================================================================
130_장바구니 항목 표시하기

우선 장바구니에 있는 모든 제품을 가져올 준비를 한다. 제품을 읽은 후 호출하는 콜백도 있어야 한다.
models/cart.js => static getCart(callback)
    fs.readFile(p, (err, fileContent) => {
        const cart = JSON.parse(fileContent);
        if (err) {
            callback(null);
        } else {
            callback(cart);
        }
    });

그 다음 cart 모델을 호출하는 shop.js 컨트롤러에 추가한다.
controllers/shop.js => exports.getCart
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty });
                }
            }
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            });
        });
    });
- 콜백이 여러번 사용되는데 추후에 많은 비동기 액션을 다루는 다른 방법을 알아본다.
- cart에는 제품의 데이터뿐만 아니라 수량도 저장되는데 루핑을 생성한 product는 products.js 파일에 저장한 products만 가리킨다. 따라서 이 파일에 수량도 넣어야 한다. product 모델로부터 productData의 원본을 저장하고 cartProductData로부터 qty를 넣는다면 수량과 제품 데이터 모두 cartProducts에 push 하게 된다.
- cartproducts를 뷰로 반환한다.

이제 view에서 데이터를 표시한다.
    <main>
        <% if (products.length > 0) { %>
            <ul>
                <% products.forEach(p => { %>
                    <li><%= p.productData.title %>(<%= p.qty %>)</li>
                <% }) %>
            </ul>
        <% } else { %>
            <h1>No Products in Cart!</h1>
        <% } %>
    </main>
- 이때 p는 cartProducts 배열에 넘긴 객체이다. 
======================================================================================================================================
131_Cart 항목 삭제하기

우선 뷰를 수정한다.
shop/cart.ejs =>
    <li>
        <p><%= p.productData.title %>(<%= p.qty %>)</p>
        <form action="/cart-delete-item" method="POST">
            <input type="hidden" value="<%= p.productData.id %>" name="productId">
            <button class="btn" type="submit">Delete</button>
        </form>
    </li>

장바구니에 있는 제품을 삭제하는 컨트롤러를 추가한다
cart => exports.postCartDeleteProduct
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    });
- hidden input으로 price를 백엔드로 전달할 수도 있지만 요청을 통해 ID를 전달하려면 Node Express 코드 백엔드에서 모든 데이터를 검색해야 하므로 이게 더 깔끔한 방법이다.

이제 라우트를 연결한다.

======================================================================================================================================
132_삭제 버그 수정

장바구니에 제품이 아예 없거나 삭제하려는 제품이 없다면 오류가 생긴다.

models/cart.js => static deleteProduct(id, productPrice)
    if (!product) {
        return;
    }
- 제품이 없다면 return으로 무시한다.