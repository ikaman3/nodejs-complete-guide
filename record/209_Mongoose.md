209_Mongoose

SQL에 Sequelize가 있었던 것처럼 MongoDB에는 Mongoose가 있다. 작업의 결과 측면에서 서로 비슷한데, 쿼리 대신 데이터를 다룰 수 있도록 만든다. 
========================================================================================
210_What is Mongoose?

A Object-Document Mapping Library
- Sequelize는 ORM(Object Relational Mapping Library)이다. 둘의 차이점은 MongoDB가 단순히 관계형 데이터베이스가 아니라 문서형 데이터베이스로 문서 관점으로 실행되는 ODM이란 것이다. 

하지만 둘 다 애플리케이션에 데이터와 사용자 개체가 있고 이를 컬렉션에 저장한다는 점은 같다. 
User                               Mapped        users
name, age, email, password --------------------> id(1), name('Max'), age(28), password('ds312')

지난 코드에서 했던 것처럼 직접 쿼리를 작성해도 되지만 
- db.collection('users').insertOne({name: 'Max', ...})
객체와 데이터에 초점을 맞춰 어떻게 보여야 하는지만 다루는 것이 더 쉽다. 결국 이게 최종 구문이 아니기도 하다. 
- const user = User.create({...})

Core Concepts

Schemas & Models => e.g. User, Product
- Mongoose의 핵심 개념은 스키마와 모델을 다뤄 데이터가 어떻게 보일지 정의한다는 것이다. 
Instances => const user = new User()
- 또 인스턴스로 모델에 예시를 제시해서 계획에 따라 자바스크립트 객체를 생성한다.
Queries => User.find()
- 여기까지 설정을 마치면 User 객체 및 모델을 통해 데이터베이스에 쿼리를 실행한다. 
========================================================================================
211_Mongoose로 MongoDB 서버에 연결

npm install --save mongoose
- 프로젝트에 설치한다.
util/database.js 삭제
app.js => const mongoose = require('mongoose');
- Mongoose가 배후에서 유틸리티 및 연결 관리를 관할하기 때문에 app.js 파일에서 Mongoose를 불러오면 된다.
mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
- 그리고 mongoConnect를 설정했던 부분을 지우고 mongoose.connect('백엔드 URL') 입력, then 블록을 연결해 들어오는 요청을 듣기 시작하고 에러처리를 한다. 
========================================================================================
212_제품 스키마 생성

우선 기존 DB에 저장된 컬렉션을 모두 삭제한다.

models/product => 
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
- mongoose를 불러오고 불러온 Mongoose 객체 중에 Schema 생성자를 사용해 새로운 스키마를 생성한다.
    const productSchema = new Schema({});
- 이 생성자에 자바스크립트 객체를 전달하고 제품이 어떻게 보여야 하는지 정의한다.
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
- 객체에 간단한 키-값 쌍으로 스키마를 정의한다. 이때 키만 정의하지 않고 키의 type도 정의한다. 
- _id는 ObjectId로 자동으로 추가되므로 생략한다.

MongoDB는 스키마리스인데 왜 스키마를 설정하는 것인가: 특정 스키마에 한정되지 않는 유연성이 있는 반병 다루는 데이터에는 특정 구조가 있다. 따라서 Mongoose는 사용자가 데이터에만 집중하도록 돕기 위해 사용자의 데이터가 어떻게 생겼는지 알아야 하고 이 때문에 데이터 구조에 대한 스키마를 정의한다. 물론 이것은 선택사항이다. 

module.exports = mongoose.model('Product', productSchema);
- 이제 Mongoose 모델을 내보낸다. model 함수는 Mongoose가 배후에서 이름이 붙은 청사진 혹은 스키마에 연결하는 걸 돕는다. 여기서 모델의 이름은 Product다. 보통 대문자로 시작하는 이름에 프로젝트나 앱의 개체를 나타내는 이름을 사용한다.
- 두 번째 인수는 스키마로, 위에서 정의한 productSchema이다. 
========================================================================================
213_Mongoose를 통한 데이터 저장

controllers/admin => postAddProduct
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    });
- Product 생성자에 전처럼 여러 인수가 아닌 하나의 자바스크립트 객체만 전달해 스키마에서 정의한 값을 맵핑한다. 스키마에서 정의한 모든 필드를 입력한다. 자바스크립트 객체에 있기 때문에 순서는 상관없다.
- 참고로 : 의 오른쪽에 있는 것이 컨트롤러 액션에서 받는 데이터를 의미하고 왼쪽은 스키마에서 정의한 키를 의미한다.

.save()
- 모델에 기반해 새 제품이 생성되었고 Mongoose에 의해 관리되는데 즉, 제품 혹은 모델에 Mongoose가 제공하는 save 메서드를 사용할 수 있다. 프로그래머가 정의하는 게 아닌 Mongoose 관할이므로 product 모델에 save를 정의하지 않는다.

이후 실행해보면 DB에 products 컬렉션이 생성되고 입력한 제품 데이터가 저장되었다. Mongoose가 모델 이름인 Product를 소문자로 바꾸고 복수형으로 만들어 컬렉션 이름으로 사용한다. 
========================================================================================
214_모든 제품 가져오기

.find()
- MongoDB 드라이버에서 사용했던 메소드인데 Mongoose에서는 조금 다르다. cursor 대신 products를 반환한다. .cursor()를 호출하여 커서에 접근하고 eachAsync()로 루핑을 생성하거나 next()로 다음 요소를 받을 수도 있다. then 블록을 연결할 수 있다.
========================================================================================
215_단일 제품 가져오기 

.findById(prodId)
- Mongoose에 의해 정의된 메서드다. 편리한 점은 문자열을 전달하면 Mongoose가 알아서 ObjectId로 변환한다. then 블록을 연결할 수 있다.
========================================================================================
216_product 업데이트

controllers/admin => getEditProduct
- findById 메서드를 사용해 제품 정보를 가져와 렌더링한다.
 => postEditProduct
    Product.findById(prodId)
        .then(product => {
            product.title = updatedTitle;
            ...
            return product.save();
        })
        .then(result => {
            ...
        })
- new Product를 생성해서 save()를 호출하는 대신 prodId를 통해 제품을 가져오고 then 블록을 추가하여 DB에서 가져온 product에 접근한다.
- save 메서드를 then 함수 안에 넣어서 product에 save를 호출한다. 이때 product가 데이터를 가진 자바스크립트 객체가 아니라 Mongoose 객체이므로 save 같은 Mongoose 메서드를 사용할 수 있다. 기존 객체에 save를 호출하면 새로운 객체로 저장하지 않고 변경 사항을 저장한다. 
- 그리고 return하여 save가 끝나면 리다이렉트 한다.
========================================================================================
217_product 삭제

.findByIdAndRemove(prodId)
- Mongoose 내장 메서드로 문서를 제거하는 메소드다.
========================================================================================
218_User 모델 추가 및 사용하기

user 모델에 name, email, cart 등 필요한 필드를 정의한다.
models/user =>
    cart: {
        items: [{
            productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
            },
            quantity: { type: Number, required: true }
        }
    ]}
- productId의 유형은 스키마로부터 가져와야 하는데 여기엔 Types 필드가 있으며 ObjectId 등 특별한 유형도 있다. 즉, Mongoose에게 이 필드에서는 product의 참조를 저장하기 위해 ObjectId를 저장한다고 알리는 것이다.

app.js =>
    const User = require('./models/user');
- user 모델을 임포트한다.
=> mongoose.connect().then()
    const user = new User({...})
    user.save();
- 간단히 new User를 호출하여 새 사용자를 생성한다. 이 작업은 서버를 시작할 때 완료된다.     
=> app.use()
    User.findById(userId).then(user => { req.user = user; next() })
- 사용자를 찾는 미들웨어를 작성한다. 생성된 사용자의 ID를 입력한다. then 블록에서 사용자를 가져오고 요청에 저장한다. 그리고 이건 전체가 Mongoose 모델이므로 메서드를 전부 user 객체에 호출할 수 있다. 

.findOne()
- User.findOne()으로 사용자가 있는지 확인하고 생성한다. findOne에 인수를 제공하지 않으면 발견하는 첫 사용자를 반환한다. 
========================================================================================
219_Mongoose에서 관계 사용

user 모델과 product 모델을 함께 사용한다. 물론 모든 제품을 사용자에게 할당되어야 한다. 먼저 productSchema를 변경한다.
models/product =>
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
- userId는 사용자에 대한 참조 필드이므로 Schema.Types.ObjectId로 유형을 정의한다.
- ref는 문자열을 가져다가 Mongoose에게 해당 필드의 데이터에 실제로 연관된 다른 Mongoose 모델이 무엇인지 알려준다. 즉, user 모델을 참조하게 된다. 

models/user =>
    cart: {
        items: [{
            productId: {
            ...
            ref: 'Product',
            ...
            },
- 또한 제품 ID를 저장하는 user 모델에 참조를 추가하고 제품을 참조할 수도 있다는 의미다. 장바구니 품목의 모든 사용자에 대해 ID를 참조하는 제품을 저장하고 이 ID는 product 모델을 통해 저장 또는 정의된 제품을 참조한다.

controllers/product => postAddProduct
    const product = new Product({
        ...
        <!-- userId: req.user_id -->
        userId: req.user
    });
- 스키마를 조정했으니 코드를 조정한다. 새로운 제품을 생성할 때 userId를 저장한다. 제품 생성자로 전달하는 객체의 필드에 userId를 추가한다. 
- req.user_id로 id만 접근할 수 있고, Mongoose의 기능으로 전체 user 객체도 저장할 수 있다. req.user는 사실상 ID 뿐만아니라 전체 사용자 객체인 셈이다. Mongoose는 해당 객체에서 ID만 가져온다. 
========================================================================================
220_관계 가져오기에 대한 중요한 사항

admin 컨트롤러의 getProducts에서 find를 사용하는 경우처럼 모든 제품을 가져온다고 가정하자. 이때 ID뿐만 아니라 관련된 사용자의 모든 데이터를 가져온다. 이건 모든 상황에 필요한 건 아니다. products가 들어간 then에서 제품들을 루프하고 findById와 받은 ID로 사용자를 가져오는 쿼리를 입력할 수 있지만 좀 번거롭다.

.populate('userId', 'name')
- Mongoose에서 find 다음에 추가할 수 있는 유틸리티 메서드다. Mongoose에게 특정 필드에 ID뿐만 아니라 모든 세부 정보를 채우도록 알리는 기능을 한다. 따라서 find 뒤에 populate를 추가하고 채우길 원하는 경로를 먼저 입력한다. 이건 데이터를 가져올 때 매우 유용한데 직접 중첩된 쿼리를 작성하는 대신 한 번에 모든 데이터를 얻을 수 있다.
- 두 번째 인수로 가져올 필드만 명시하여 원하는 데이터만 가져올 수도 있다.

.select('title price -_id')
- find 다음에 select를 호출할 수 있다. 이건 선택하거나 제외할 필드 즉, 데이터베이스에서 실제로 검색할 필드를 정의하도록 돕는다. 인수로 문자열을 전달하는데 product의 경우 title, price는 가져오고 - 기호를 붙여서 _id는 제외한다. _id는 명시적으로 제외하지 않으면 항상 가져온다.
========================================================================================
221_cart create

user 모델에서 addToCart 같은 유틸리티 메서드로 해당 사용자의 장바구니에 제품을 추가했다. 이런 메서드를 작성하면 컨트롤러의 논리를 이동시켜 데이터에 관련된 논리가 일반적으로 존재할 모델 내부로 끌어올 수 있다. 

models/user => 
    userSchema.methods.addToCart = function(prodId) {...};
- 스키마를 작업하여 메서드를 추가한다. methods는 독자적인 메서드를 추가할 수 있게 하는 객체다. 뒤에 원하는 이름을 작성하고 이 부분은 함수가 되어야 한다. 중요한 것은 function() 으로 작성된 함수 형태를 취해서 내부의 this 키워드가 계속해서 스키마를 참조하도록 한다. 

이후 기존 코드를 복사하여 productId: product._id로 변경한다. Mongoose가 문자열을 ObjectId에 자동으로 포함시킨다.

return this.save();
- DB에 접근하는 부분을 지우고 save를 호출하여 저장한다.
========================================================================================
222_cart load

기존 getCart는 직접 논리를 작성하였다. Mongoose를 사용하면 더 쉽게 할 수 있다.
controllers/shop => getCart
    req.user.populate('cart.items.productId').then(user => {
        const products = user.cart.items;
        ...
    })
- 강의에서는 populate가 Promise를 반환하지 않아서, then을 사용할 수 없어 execPopulate를 추가하였으나 변경된 것으로 보인다. 그냥 populate만 사용해야 한다.
- 이제 반환된 값을 보면 전체 사용자 객체를 가져오고 있다. 그러므로 변수 이름을 user로 변경한다.
- 이후 products는 사실 user.cart.items이다. 이걸 view로 전달할텐데 구조가 바뀌었으므로 view를 수정한다.
========================================================================================
223_cart delete

기존에는 메서드를 정의하여 사용했었다. 

models/user =>
    userSchema.methods.removeFromCart = function(productId) {...}
- 메서드를 추가하고 삭제할 item을 제외한 배열을 생성하는 filter 구문을 작성한다. 그리고 this.cart.items에 updatedCart를 대입하고 return this.save()를 호출하여 저장한다.

컨트롤러에서는 메서드 이름을 맞춰주면 작동한다.
========================================================================================
224_order 생성 및 받기

이전 코드에서 새로운 컬렉션을 다루었으므로 새로운 모델이 필요할 것이다. models/order.js 파일을 추가하여 주문 컬렉션에 데이터를 저장한다.
models/order =>
    products: [{
        product: { type: Object, required: true },
        quantity: { type: Number, required: true }
        }],
- products는 문서들의 배열이며, 모든 문서는 제품의 데이터를 가지고 객체 타입이다.
- 이후 user에 대한 속성도 추가한다.

controllers/shop => postOrder
  req.user
    .populate('cart.items.productId')
    .then(user => {
- 모든 제품을 가져오고 then 블록 내부에서 주문을 생성한다. 
        const products = user.cart.items.map(i => {
            return { quantity: i.quantity, product: i.productId };
        }); ... }
- 품목을 그냥 추출하는게 아니라 품목들을 맵핑함으로써 변경된 품목들을 products 배열에 저장한다.

마지막으로 order.save()를 호출하여 DB에 저장한다. 

225_논리 수정

위의 코드에서 user.cart.items를 출력해보면 productId에 ID만 저장되지 않고 객체를 가지고 있다. 
    return { quantity: i.quantity, product: { ...i.productId._doc } };
- product에 자바스크립트 객체를 넣는데 Mongoose의 특별한 필드인 _doc을 사용한다. 메타 데이터를 지닌 객체인 producId에서 접근할 수도 있지만 _doc을 사용하여 그 안에 있는 데이터에만 접근할 수 있다. 새 객체 안에 있는 스프레드 연산자는 가져온 문서의 모든 데이터를 뽑아내서 새 객체 product로 저장한다.
========================================================================================
226_cart 비우기

user 모델에 clearCart 메서드를 추가한다.

    userSchema.methods.clearCart = function() {
        this.cart = { items: [] };
        return this.save();
    };

그리고 컨트롤러에서 order가 완료되면 clearCart를 호출하여 장바구니를 비운다.
========================================================================================
227_order 가져오고 표시하기

shop 컨트롤러에서 getOrders 에서 Order.find()를 사용한다.
    Order.find({ 'user.userId': req.user._id })
- find로 주문 데이터를 찾는데 Order 모델의 user, userId 같은 중첩된 키가 로그인한 사용자의 ID와 일치하는지 확인한다. find에 인수로 {}를 입력한다. 즉, user.userId가 req.user._id와 일치하는지 검사한다.

이후 기존 코드를 재사용하여 렌더링하고 orders.ejs 뷰를 데이터 구조에 맞춘다.