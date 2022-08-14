149_Sequelize

MySQL을 그대로 사용하지만 작성하는 코드는 달라진다. 
SQL문 대신 외부 패키지를 통해 JavaScript 객체를 다루면 데이터베이스에 새 요소 생성, 삭제, 검색, 연결하는 데 편리해진다. SQL 데이터베이스는 보통 관계까지 처리하는데 현재 프로젝트는 그러한 것도 없으니 더욱 적합하다. 

What is Sequelize?

제 3자 외부 패키지로 Object-Relational Mapping Library 이다. 쉽게 말해서 백그라운드에서 실제로 SQL 코드를 처리하며 자바스크립트 객체로 맵핑해 SQL 코드를 실행하는 편리한 메서드를 제공하여 SQL 코드를 직접 작성하지 않아도 된다.

User 라는 객체에 name, age, email, password 정보가 있다고 가정하자. 객체가 Sequelize에 의해 데이터베이스에 맵핑되면 테이블을 자동으로 생성한다. 테이블뿐만 아니라 관계까지 자동으로 설정한다. 이때 새로운 사용자를 만들기 위해 User라는 객체에 메서드를 호출하면 Sequelize가 필요한 SQL 쿼리 및 명령을 실행한다. 즉, SQL 문을 직접 작성하지 않고 메서드에 정보를 매개변수로 넘기면 알아서 처리하는 것이다. 

Core Concepts
Models -> e.g. User, Product
- Sequelize는 위처럼 데이터베이스를 다루는 모델을 제공하며 모델을 정의할 수 있게 하는데 모델을 구성하는 데이터, 다시 말해 데이터베이스에 저장될 데이터를 정의하는 것이다.
Instances -> const user = User.build()
- 그다음 모델 즉 사용자, 제품같은 클래스를 실체화하려면 생성자 함수를 실행하거나 utility 메서드를 이용해 예를 들어 모델에 기반한 새로운 사용자 객체를 생성한다. 
Queries -> User.findAll()
- 또한, 쿼리를 실행한다. 새로운 사용자를 저장하는 경우도 있지만 모든 사용자를 찾는 경우도 있기 때문이다. 항상 Sequelize로 정의한 모델과 관련이 있을 것이다.
Associations -> User.hasMany(Product)
- 모델을 연관 지을 수 있다. 예를 들어 User 모델을 Product 모델과 연관시키는 것이다. 
======================================================================================================================================
151_Sequelize 사용법
    util/database.js =>
    const Sequelize = require('sequelize');
    const sequelize = new Sequelize('데이터베이스이름', '사용자이름', '비밀번호', {
        dialect: 'mysql',
        host: '127.0.0.1'
    });
    module.exports = sequelize;

models/product => 모든 코드를 지우고 Sequelize를 사용한 코드로 변경한다.
    코드는 파일 참조
    
테이블 생성
    app.js =>
        sequelize.sync()
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
- 앱을 시작할 때 이 파일에서 모든 모델이 테이블로 이동했는지 혹은 파일에 속한 테이블을 다 불러왔는지 확인한다. 만약 테이블이 이미 존재한다면 덮어쓰기 하지 않는다.
- sync() : sync 메서드는 정의한 모든 모델을 둘러본다.(sequelize는 models/product 에서 import 되었기 때문에 알 수 있다) 모든 모델을 인식하고 있기 때문에 대신 테이블 생성이 가능하다. sync 메서드의 역할은 모델을 데이터베이스로 동기화해 해당하는 테이블을 생성하고 관계가 있다면 관계도 생성한다. 
- 이때 then 을 실행하고 서버를 실행하도록 app.listen은 then 안쪽에 넣는다.

데이터 생성
controllers/admin => postAddProduct
    Product.create({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
    })
    .then(result => { 
        console.log('Created Product');
    })
    .catch(err => { console.log(err); });
- Product.create(): sequelize가 제공하는 메서드 중 하나이다. 모델에 기반한 새 요소를 생성한 후 즉시 데이터베이스에 저장한다. 반면 build는 모델에 기반해 새 자바스크립트 객체를 생성하며 직접 저장해야 한다.

데이터 검색
- findAll({where: ...}): sequelize가 제공하는 메서드 중 하나이다. 모델의 모든 레코드를 읽는다. result를 사용할 수 있는 Promise를 반환한다. 몇 가지 옵션을 객체로 넣을 수 있는데 where 조건을 정의하면 검색하는 데이터의 유형을 제한하게 된다. 아무것도 없으면 제한없이 모두 가져온다.
중요한 점은 findAll 함수는 요소의 개수와 관계없이 디폴트로 배열을 반환한다.
- findByPk(id): id 값으로 단 하나의 레코드를 반환한다. 상황에 따라 알맞게 사용한다.

데이터 업데이트
    exports.postEditProduct = (req, res, next) => {
        const prodId = req.body.productId
        ...
        Product.findByPk(prodId)
        .then(product => {
            product.title = updatedTitle;
            ...
            return product.save();
        })
        .then(result => {
            console.log('UPDATED PRODUCT!!!');
            res.redirect('/admin/products');
        })
        .catch(err => { 
            console.log(err); 
        });
    };
- return product.save();: 바로 위에서 변경한 것은 자바스크립트 앱의 로컬 변수이므로 데이터베이스에 저장한 것이 아니다. 데이터베이스 업데이트는 sequelize가 제공하는 메서드인 save 를 사용한다. 만약 product가 존재하지 않는다면 새로 생성하고, 존재한다면 덮어쓰거나 업데이트 한다.
여기서 다시 then, catch를 중첩할 수 있으나 promise를 중첩하면 콜백 지옥처럼 구조가 복잡해진다. 
save를 통해 반환된 promise를 return할 수 있고 then 블록을 이전 then 블록에 이어준다. 맨 밑의 catch 블록은 첫 번째, 두 번째 promise에 대한 오류를 모두 잡아준다.
두 번째 then 블록은 위의 return product.save()에서 발생하는 모든 성공적인 응답을 처리하게 된다.
- redirect를 함수 바깥에 둔다면 업데이트가 되기 전에 리다이렉트 되버린다. 자바스크립트와 Node.js는 위에서 아래로 코드를 실행할 뿐이다. 하지만 이런 비동기적 코드는 등록을 거치고 시작된다. 그러므로 리다이렉트를 then 블록 안으로 옮겨야 한다. 
만약 이는 또한 오류가 발생할 경우 리다이렉트되지 않음을 의미한다. 이것은 추후에 에러 핸들링을 배울 것이다.

데이터 삭제하기
    Product.destroy({...});
- findAll 메서드처럼 제약 조건을 넣어서 삭제할 레코드를 찾아도 된다. 하지만 이 앱에서는 밑의 방식을 사용했다.

    Product.findByPk(prodId)
    .then(product => {
        return product.destroy();
    })
    .then(result => {
        console.log('DESTROYED PRODUCT!!!');
        res.redirect('/admin/products');
    })
    .catch(err => { 
        console.log(err); 
    });
- 삭제할 레코드의 ID를 찾고 그 레코드에 직접 destroy 메서드를 사용하는 방법이다.
- destroy 메서드 또한 promise를 반환하기 때문에 then 블록을 연결해준다.
======================================================================================================================================
162_Associations

Product <-------------------------------------User
   |               Has Many                      |
   |                                             |
   |                                             |
   | Belongs to Many            Has One          |
   |----------------> Cart  <--------------------|
   |----------------> Order <--------------------|
     Belongs to Many            Has Many

관계는 무엇을 의미하는가? 제품, 사용자, 장바구니, 주문 테이블이 존재한다고 가정하자.
한 제품은 다수의 장바구니에 속한다. 여러 사용자에게 장바구니가 있으니까. 다수의 사용자와 다수의 장바구니가 있으므로 다른 사용자가 같은 제품을 각자의 장바구니에 담을 수 있게 한 제품은 여러 장바구니에 소속될 수 있어야 한다. 각 사용자는 장바구니를 1개씩만 갖고 있다. 
제품은 여러 주문에 포함될 수 있고 한 사용자는 여러 개의 주문을 할 수 있다. 또한 여러 개의 제품을 보유할 수도 있다. 사용자가 제품을 생성했다는 것은 구매해서 보유하는게 아니라 상점에서 판매하기 위해 생성했다는 의미이다.

이것이 다양한 모델을 연관짓는 개요이다. 이를 Sequelize에도 반영할 수 있다.

app.js =>
    Product.belongsTo(User, { constranints: true, onDelete: 'CASCADE' });
- Product는 User에게 속한다. 즉, 사용자가 이 제품을 생성했다는 의미다. 
- 옵션으로 두 번째 인자를 넘기는 것도 가능하다. 이 관계가 어떻게 관리될지 정의한다. constraints를 true로 설정해야 한다. 
- onDelete: 'CASCADE': 사용자가 삭제되었을 때 연결된 제품도 연쇄적으로 삭제되는 키워드
    User.hasMany(Product);
- 이 구문은 선택사항이다. belongsTo는 hasMany 호출로 대체하는 것이 가능하다. 하지만 관계의 작용 방식을 분명히 하고자 양방향으로 정의하였다.

    sequelize
    .sync({ force: true })
위의 관계가 설정된 상태에서 sequelize sync는 모델에 대한 테이블을 생성할 뿐만 아니라 여기에서 정의하는 관계들을 데이터베이스 내부에 정의해준다.
- 한 가지 문제점은 이 앱이 사용하는 데이터베이스에서 이미 products라는 테이블을 생성하였으므로 새 테이블로 덮어쓰기 하지 않는다. force를 true로 설정하여 새 테이블로 덮어쓰기 설정을 한다. 물론 실서비스 중인 앱에서는 사용하지 않을 것이다.
======================================================================================================================================
163_더미 사용자 생성 및 관리

    sequelize
    .sync()
    .then(result => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
           return User.create({ name: 'Max', email: 'test@test.com' });
        }
        return user;
    })
    .then(user => {
        app.listen(3000);
    })
- User.create({...}): 더미 사용자가 존재하는지 확인하고 없다면 생성하는 구문이다. consistence가 없어졌는데 이 
안의 익명 함수가 promise 또는 객체 중 어느 하나를 반환하기 때문이다.
- return user : 원칙적으로 then을 성공적으로 연결하기 위해 항상 동일한 값을 반환해야 한다. 즉, 
return Promise.resolve(user); 의 형태가 되어야 하지만 생략해도 된다. then 블록에 값을 반환하면 자동으로 새 promise에 포함되기 때문이다.

다음으로 새로운 미들웨어를 등록한다. 사용자를 요청에 저장하여 앱 내부 어디서든지 사용하기 위해서다.  
    app.use((req, res, next) => {
        User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
    });
- 이 부분의 app.use는 미들웨어를 등록할 뿐이라는 걸 기억하라. 따라서 들어오는 요청에 대해 이 함수를 실행한다. npm start를 통해 앱이 처음 실행되고 sequelize를 이 함수보다 밑에서 실행한다. 들어오는 요청의 경우 미들웨어를 통해서만 전달된다. 그래서 npm start가 sequelize 코드를 실행하고 DB를 설정하지만 app.use의 익명 함수는 절대 실행되지 않는다. 단지 들어오는 요청에 대해 미들웨어로 등록만 할 뿐이다. 즉, 이 코드는 들어오는 요청에 대해서만 실행되며 app.listen을 통해 서버를 성공적으로 시작했을 때만 접근 가능하다. 그리고 밑의 sequelize 초기 설정 코드를 끝냈을 때만 참에 해당할 것이므로 이 곳의 코드에서는 반드시 사용자를 찾을 수 있다. 
- req.user = user; : 요청 객체에 새 필드를 추가할 수 있다. 기존 필드를 덮어쓰는 것만 피하면 말이다. e.g. body
이제 DB에서 검색한 사용자를 저장했다. 
지금 DB에서 검색한 사용자는 단순히 DB에 있는 값을 포함하는 자바스크립트 객체가 아니라는 점에 주의하라. DB의 값을 포함하는 sequelize 객체이며, sequelize에서 추가한 destroy를 비롯한 기능성 메서드를 포함한다. 
따라서 이 구문은 sequelize 객체를 저장하게 된 것이다.
======================================================================================================================================
164_관계 설정 메서드 사용하기

기존의 코드를 수정하여 새 제품을 생성할 때 관련된 사용자에 대한 추가 정보를 저장할 수 있다.
constrollers/admin => exports.postAddProduct
     Product.create({
        title: title,
        ...
        userId: req.user.id
    }).then(result => { 
        ...
    })
- app.js에서 확보한 userId 필드를 활용한 방법이다. req.user는 sequelize의 user 객체이며 해당 사용자에 대한 DB 데이터와 헬퍼 메서드를 모두 보유한다는 점을 숙지하자.

     req.user.createProduct({
        title: title,
        ...
    }).then(result => { 
        ...
    })
- 위의 코드도 정상적으로 작동하지만 깔끔하게 개선할 수 있다. sequelize의 기능을 활용하여 요청에 저장된 user 객체를 사용하는 것이다. createProduct 메서드는 관계를 설정하면 sequelize가 특별한 메서드로 추가한 것이다.
모델 이름이 product이므로 createProduct로 생성됐다.
======================================================================================================================================
165_sequelize 메서드를 사용하여 관련 제품 가져오기

우선 사용자와 관련있는 컨트롤러를 찾아야 한다.
exports.getEditProduct =>
    req.user.getProducts({ where: {id: prodId} }).then(...)
- 해당 코드로 수정한 후 edit 버튼을 누르면 콘솔에 쿼리가 출력된다.
- get~s 메서드는 요소를 단 하나만 찾더라도 배열로 돌려받으므로 사용에 주의한다.
    SELECT `id`, `title`, `price`, `imageUrl`, `description`, `createdAt`, `updatedAt`, `userId` FROM `products` AS `product` WHERE (`product`.`userId` = 1 AND `product`.`id` = '2');
- 여기서 userId가 1인 제품을 검색하는 조건이 있는데 내가 작성한 조건이 아님을 알 수 있다. user에서 getProducs를 실행했기 때문에 sequelize가 추가한 부분이다.

postEditProduct는 그대로 둔다. 이 지점에 있는 경우 사용자에게 이미 제품이 있다는 것을 의미하기 때문이다.
======================================================================================================================================
166_일대다, 다대다 관계

장바구니 1개는 사용자 1명에게 속하고 1개의 장바구니는 많은 제품을 각각의 제품에 관련된 수량만큼 확보한다.
따라서 모델이 1개 이상 필요하다.

models/cart => 모든 코드를 지우고 sequelize로 다시 작성한다.

장바구니는 단일 사용자에게 속하지만 여러 제품이 들어갈 수 있다. 그러나 장바구니 테이블은 여러 사용자들의 장바구니를 포함한다. 
models/cart-item => cart와 같은 코드에 quantity를 추가한다.

app.js =>
    User.hasOne(Cart);
    Cart.belongsTo(User);
- 사용자 1명은 장바구니 1개를 지니며 1개의 장바구니는 사용자 1명의 소유이다.
- 밑의 코드는 hasOne 상관관계의 역에 해당하는 옵션 요소이다. 생략해도 된다.
    Cart.belongsToMany(Product, { through: CartItem });
    Product.belongsToMany(Cart, { through: CartItem });
- 장바구니는 다수의 제품에 속한다. 하나의 제품은 다수의 장바구니에 속한다. => 다대다 관계
- 이 관계는 제품 ID와 장바구니 ID의 조합을 저장하는 중개 테이블을 통해 이들이 연결되는 경우에만 작동한다. 이를 위해 cart-item 모델을 생성했다.
- through: 이 key는 sequelize에게 연결들의 저장 위치를 알려주어 CartItem 모델에 저장한다. 

controllers/cart => getCart가 동작하지 않을 것이다.
    req.user.getCart()
    .then(cart => {
        return cart.getProducts()
        .then(products => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
- console.log를 이용해 출력해보면 cart를 속성으로써(req.user.cart) 접근할 수는 없지만 getCart를 통해 다룰 수 있다는 걸 알 수 있다. 
- return cart.getProducts()를 통해 장바구니 안에 있는 제품을 가져올 수 있다. app.js 파일에서 belongsToMany를 통해 제품과 연결되었다. 이때 sequelize가 CartItem 테이블, 즉 중간 테이블을 살펴본다.
======================================================================================================================================
168_새 상품 생성

controllers/shop => postCart
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart()
    .then(cart => {
        fetchedCart = cart;
        return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
        let product;
        if (products.length > 0) {
            product = products[0];
        }
        if (product) {
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity + 1;
            return product;
        }
        return Product.findByPk(prodId)
    })
    .then(product => {
        return fetchedCart.addProduct(product, {
            through: { quantity: newQuantity }
        }); 
    })
    .then(() => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
- return cart.getProducts({ where: { id: prodId } }); : where 조건을 추가해 검색하는 제품을 prodId를 가진 제품으로 제한하여 해당 제품만 검색한다. 반환된 배열에는 최대 한 개의 제품만 있을 것이다. 
- return fetchedCart.addProduct(product, { through: { quantity: newQuantity }});
: sequelize가 추가한 다대다 관계 메서드 중 하나로 ID를 통해 하나의 제품을 중간 테이블에 추가할 수 있다. 
cartItem에 추가한 필드를 설정해야 한다. 중간 테이블에 입력하는 항목마다 quantity 데이터도 가져서 두 개 이상의 일치하는 ID가 있을 때 설정할 필드가 하나 더 있음을 sequelize에 알려야 한다. 
- through: 어떤 모델을 중간 모델, 테이블로 쓸지 알리기 위해 사용했었다. 이번에는 sequelize에 중간 테이블의 값을 설정하기 위해 추가적인 정보를 알린다. 따라서 또 다른 객체에 중간 테이블에 설정할 키 혹은 필드를 입력한다. 여기서는 quantity를 설정했다.
======================================================================================================================================
169_장바구니 항목 검색

DB에는 장바구니 제품이 추가되지만 브라우저에서는 에러가 발생한다. 
views/shop/cart.ejs =>
    <h1><%= p.title %></h1>
    <h2>Quantity: <%= p.cartItem.quantity %></h2>
- cart.ejs에서 로딩하는 제품마다 prductData에 접근하고 있는데 사실 여기에 있는 제품은 DB에만 있다. prductData에 접근할 필요가 없는 것이다.
- 반면 p.qty는 루핑을 적용한 제품이 아니라 sequelize가 cartItem 키를 만들어 중간 테이블에 대한 정보와 해당 제품에 대한 항목을 저장할 수 있게 한다.
======================================================================================================================================
170_장바구니 항목 삭제

    const prodId = req.body.productId;
    req.user.getCart()
    .then(cart => {
        return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
        const product = products[0];
        return product.cartItem.destroy();
    })
    .then(result => {
        res.redirect('/cart');
    })
- req.user.getCart(): 사용자의 장바구니에 접근, then 블록에서 해당 사용자의 제품을 찾는다. 
- return product.cartItem.destroy(): 해당 제품을 products 테이블이 아니라 장바구니와 제품을 연결하는 cartItem의 중간 테이블(in-between table)에서만 제거하기 위해 cartItem 다음 destroy를 입력한다. 그리고 return 하고 then 블록을 추가하여 리다이렉트한다.
======================================================================================================================================
171_주문 모델 추가

주문 버튼을 누르면 장바구니가 비워지고 제품과 사용자와 연관된 주문을 생성한다.
주문은 결국 주문을 한 사용자와 주문의 일부인 다수의 제품 사이의 중간 테이블이니깐 이때 제품에는 수량 데이터가 있다. 
장바구니를 위한 cart-item이 있는 것처럼 order-item이 필요하다.

하지만 관계에 관해서는 cart와 큰 차이가 있다. 
app.js =>
    Order.belongsTo(User);
- 하나의 주문은 다수의 사용자가 아닌 주문한 한 명의 사용자에게 속한다.
    User.hasMany(Order);
- 반면 사용자는 이와 같은 주문을 다수 가질 수 있다.  
- 즉, 일대다 관계이다.
    Order.belongsToMany(Product, { through: OrderItem });
- 하나의 주문은 다수의 제품에 속할 수 있다. 중간 테이블로 OrderItem을 지정한다.
- 반대로 한 제품이 다수의 주문에 속할 수 있는데 생략해도 된다.

172_주문 버튼 추가

주문 버튼을 cart.ejs에 추가한다. 이 버튼을 누르면 장바구니에 있는 모든 제품을 주문으로 이동해야 한다.
controllers/shop => postOrder
    req.user.getCart()
    .then(cart => {
        return cart.getProducts();
    })
    .then(products => {
        return req.user.createOrder()
        .then(order => {
            return order.addProducts(products.map(product => {
                product.orderItem = { quantity: product.cartItem.quantity };
                return product;
            }));
        })
        .catch(err => console.log(err));
    })
    .then(result => {
        res.redirect('/orders');
    })
    .catch(err => console.log(err));
- return cart.getProducts(): 여기서 반환된 products의 요소들은 공통적으로 cartItem이라는 속성을 가지고 있어 중간 테이블에 있는 장바구니 제품에 대한 정보를 준다. 
- 다음 then 블록에서 Order 모델에 접근하기 위해 Order를 import 해야할지도 모른다. 하지만 cart 모델에 직접 접근하지 않고 User 모델을 통해 접근한 것처럼 Order 모델도 불러올 필요가 없다. 
Cart처럼 Order도 사용자와 연관되어 있다. 새로운 주문은 사용자와 관련되어 생성될 것이다.
그러므로 app.js에서 createCart를 호출한 것처럼 User 모델에서 createOrder를 호출한다.
- return order.addProducts: 기존의 through에 quantity를 지정하는 것과는 다른 방식을 써야한다. 각각의 제품이 모두 다른 수량 정보를 가지고 있으면 이 방식은 사용할 수 없다. products를 전달하여 제품을 추가하지만 각각의 제품이 특수 키 혹은 필드를 가져 Sequelize가 이해하도록 해야한다. 
- map: 배열에 실행되며 조금 수정된 요소와 함께 새로운 배열을 반환하는 기본 자바스크립트 메서드다. 배열 안에 있는 모든 요소를 입력값으로 가져 조금 수정된 버전을 반환한다.
- product.orderItem = { quantity: product.cartItem.quantity } : 여기서 orderItem 부분에 정확한 이름을 써야한다. order-item 모델에 정의한 이름을 그대로 사용해야 한다. 
======================================================================================================================================
