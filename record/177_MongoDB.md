177_What is MongoDB?

MongoDB는 회사명이기도 하지만 그 회사가 개발한 유명 제품인 데이터베이스 솔루션 혹은 데이터베이스 엔진의 이름이다.
효율적인 NoSQL 데이터베이스를 실행하는 툴이다. 'Humongous' 라는 단어에서 비롯된 주요 목적은 저장 및 작업이다.
여기서 작업이 중요한데 방대한 양의 데이터를 저장하고 작업할 수 있다. 규모가 큰 앱을 위해 구축된 것이다.
데이터 쿼리, 저장, 상호 작용 등을 아주 빠르게 처리하며 NoSQL 데이터베이스와 MongoDB가 기반한 데이터베이스 철학이다.

원리
MongoDB 서버를 가동하면 다수의 데이터베이스가 나타난다.

Database:                      |-------Shop-------|
Collections:                 Users              Orders
Documents:         { name: 'Max', age: 29 }      {...}
                       { name: 'Manu' }          {...}
                          
SQL의 경우 데이터베이스에 테이블이 여러 개 있었지만 MongoDB의 경우 컬렉션이 여러 개 있다.

각 컬렉션에는 레코드가 아닌 문서가 있는데 명칭만 다른게 아닌 이 데이터베이스의 핵심 철학에 큰 차이점이 있다. 
그 예로 MongoDB는 Schemaless로 컬렉션의 문서 즉, 데이터나 항목이 같은 구조를 가질 필요가 없다.
이러한 유연성 덕분에 시간이 지남에 따라 데이터베이스에 표현하기 어렵지 않게 애플리케이션의 데이터 요구사항을 변경할 수 있다.

JSON(BSON) Data Format
    {
        "name": "Max",
        "age": 29,
        "address": {
            "city": "Munich"
        },
        "hobbies": [
            { "name": "Cooking" },
            { "name": "Sports" }
        ]
    }

문서는 자바스크립트 객체 표기법과 유사하게 보인다. MongoDB는 JSON을 통해 컬렉션에 데이터를 저장한다. 즉 저장하는 문서 모두 이런식으로 보이며 자바스크립트 객체 표기법을 따른다. 엄밀히 말하면 MongoDB는 Binary JSON인 BSON을 이용하는데 파일에 저장하기 전에 이면에서 데이터를 변형한다는 뜻으로 신경 쓰지 않아도 된다.
중첩된 요소는 MongoDB에서 내장 문서로 불린다. 예시에서는 adress가 내장 문서를 가지고 있다. 또한 문서는 배열을 가질 수 있다. 배열 역시 다른 문서나 객체, 문자열, 숫자 등을 가질 수 있어 데이터에 유연성이 크다. 
======================================================================================================================================
178_MongoDB에서의 관계

    Orders
    {id: 'abc123', user: {id: 1, email: 'max@test.com'}, product: {id: 2, price: 10.99 } }
    {id: 'lddoa1', user: {id: 2, email: 'manu@test.com'}, product: {id: 1, price: 120.99 } }
                {id: 'nbax12', product: {id: 2, price: 10.99 } }
                                    {...}

    Users
    { id: 1, name: 'Max', email: 'max@test.com' }
    { id: 2, name: 'Manu', email: 'manu@test.com' }
    {...}

    Products
    {id: 1, title: 'Chair', price: 120.99 }
    {id: 2, title: 'Book', price: 10.99 }
    {...}

NoSQL에서는 다음과 같은 구조가 일반적으로 사용된다. 세 개의 컬렉션이 있고 그중 중복되는 데이터(Duplicate Data)가 있다.
- e.g. Orders 컬렉션의 {id: 1, email: 'max@test.com'} 와 Users 컬렉션의 { id: 1, name: 'Max', email: 'max@test.com' } 등
이때 Users 컬렉션에 사용자에 관한 세부 사항이 있지만 해당 데이터의 일부는 다른 컬렉션 문서에 중첩 혹은 내장될 수 있다.
따라서 SQL처럼 ID에 따라 맞추는게 아니라 다른 문서에 데이터를 내장하여 관계를 표현한다. 다른 문서를 가리키는 ID를 내장해서 두 문서를 직접 병합하는 것이다.
하지만 중점이 되는 정보만 가지고 다른 문서에 넣을 수 있다. 예를 들어 특정 사용자 데이터를 Orders에 넣으면 Orders를 검색할 때마다 해당 데이터도 같이 나올 것이다. 모든 주문을 검색하고 맞는 사용자를 찾아서 가져올 필요가 없는 것이다.
이 측면에서 NoSQL 특히 MongoDB가 빠르고 효율적인 것이다. 데이터가 필요한 형식으로 쿼리를 하도록 만들어 필요한 형식으로 데이터를 저장해서 추후에 병합하는 과정을 많이 거치지 않아도 즉, 서버의 백그라운드에서 여러 컬렉션을 합치지 않고도 필요한 형식의 데이터를 가져올 수 있다. 

Relations - Options

관계를 표현하기 위해 사용할 수 있는 중첩/내장 문서 외에도 References(참조)가 있다.
Nested / Embedded Documents
    Customers
    {
        userName: 'max',
        age: 29,
        address: {
            street: 'Second Street',
            city: 'New York'
        }
    }
- 내장 문서의 예시로 address가 Customers 문서의 일부이다. Customers 및 Addresses 컬렉션이 따로 있어 추후에 ID로 매칭하지 않아도 Customers에 address를 넣는다.

References

    Customers
    {
        userName: 'max',
        favBooks: [{...}, {...}]
    }
- Lots of data duplication: 중복되는 데이터가 아주 많으며 해당 데이터를 많이 다뤄야 해서 자주 변경되는 경우도 있는데 그럴 때마다 중복되는 자리에 직접 업데이트 한다면 내장 문서는 좋은 방법은 아니다. 예를 들어 고객마다 좋아하는 책이 있고 공통적으로 좋아하는 책이 같을 시 데이터가 중복되고 이 데이터는 자주 변경된다. 만약 새로운 버전이 출판된다면 이 책을 꼽은 모든 고객들의 항목을 업데이트 해야한다.

    Customers
    {
        userNmae: 'max',
        favBooks: ['id1', 'id2']
    }
    Books
    {
        _id: 'id1',
        name: 'Lord of the Rings 1'
    }
- 이와 같은 시나리오에서는 두 개의 컬렉션을 가지고 Customers 문서에 책에 대한 참조만 저장한 후 다른 컬렉션으로 관리하는 Books로 직접 병합하는 것이 좋다.

NoSQL Characteristics

가장 중요한 것은 스키마가 없기 때문에 특정 구조가 필요하지 않으면서 유연성이 향상된다. 
내장을 통해 관계를 지을 수 있어 데이터 관계는 줄어든다. 참조를 통해 관계를 직접 구축할 수도 있지만 상황에 따라 무엇이 이상적인 방식인지 판단해서 사용한다.
======================================================================================================================================
180_mongoDB 드라이버 설치

npm install --save mongodb

util/database => 기존 sequelize 코드는 전부 지운다.
    const mongodb = require('mongodb');
    const MongoClient = mongodb.MongoClient;
    const mongoConnect = (callback) => {
        MongoClient.connect(
            '...'
        )
        .then(client => {
            console.log('Connected!');
            callback(client);
        })
        .catch(err => {
            console.log(err);
        });
    }
    exports.mongoConnect = mongoConnect;
- 콜백을 호출하고 연결이 이루어지면 then 블록 내부로 결과를 전달하고 이 결과는 클라이언트다. 즉, 데이터베이스에 접근할 수 있게 하는 클라이언트 객체다. 
- mongoConnect: 이 함수는 MongoDB 내부에 연결하는 위치로 콜백을 전달한다. 그리고 콜백을 실행한 뒤 연결된 클라이언트를 반환하여 상호작용할 수 있도록 해준다.
- 그러나 이렇게 진행하려면 매 작업마다 MongoDB에 연결해야 하고 작업이 끝나고 연결을 해제하지도 못할 것이다. 따라서 이 방법은 MongoDB에 연결하기에 좋은 방법은 아니다. 앱의 다양한 위치에서 연결과 상호작용을 하려고 하기 때문이다.
그러니 데이터베이스의 한 연결을 처리하고 클라이언트로 접근을 반환한 뒤 거기서 설정하거나 앱의 접근이 필요한 다양한 위치로 반환시키는 것이 더 나을 것이다.

app.js =>
    const mongoConnect = require('./util/database').mongoConnect;

    mongoConnect((client) => {
        console.log(client);
        app.listen(3000);
    });
- 콜백, 즉 연결한 뒤에 실행될 함수를 전달해야 하므로 클라이언트 객체로 접근할 권한을 얻는다.
======================================================================================================================================
181_데이터베이스 연결 생성

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let _db;
const mongoConnect = (callback) => {
    MongoClient.connect(
        '...'
    )
    .then(client => {
        console.log('Connected!');
        _db = client.db();
        callback();
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
}
const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!';
}
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
- callback()에서 클라이언트를 반환하는 대신 _db라는 변수를 추가하는데 이 underbar는 이 변수가 파일 내부에서만 사용됨을 알리는 용도이므로 필수는 아니다. 
- _db = client.db(): 기본값으로는 테스트 데이터베이스에 연결하게 될 텐데 연결 문자열에서 .net/ 다음을 shop 등의 원하는 데이터베이스로 설정한다. SQL과는 다르게 미리 데이터베이스나 테이블 또는 컬렉션을 생성할 필요는 없다. 처음 접근하면 자동으로 생성된다.
- getDb: 우선 _db가 설정되었는지 확인하고 설정되었다면 반환한다.
- 이제 두 개의 메서드를 exports하게 되었다. 연결을 위한 것과 데이터베이스로의 연결을 저장하는 용도다. 따라서 _db = client.db() 이 부분은 계속 실행될 것이고 연결된 데이터베이스로의 접근이 존재하는 경우 접근을 반환하는 메서드가 있는 것이다. MongoDB는 뒤에서 연결 풀링이라는 방법으로 이 과정을 관리하는데 데이터베이스와 동시 상호작용을 다수 진행하기에 충분한 연결을 제공한다. 

app.js => 
    mongoConnect(() => {
        app.listen(3000);
    });
- 콜백으로 더 이상 반환하지 않으므로 연결되어 있다는 것은 알지만 더 이상 할 게 없다.

models/product => class Product
    const mongodb = require('mongodb');
    const getDb = require('../util/database').getDb;
- 이제 getDB를 호출하여 데이터베이스로 접근할 수 있다. getDB는 우리가 연결되어 있는 데이터베이스 인스턴스를 반환한다. 

    constructor(title, price, description, imageUrl) {
        ...
    }

    save() {
        const db = getDb();
        return db.collection('products')
        .insertOne(this)
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(err));
    }
- collection('products').insertOne(this): products라는 컬렉션에 데이터 하나를 입력한다. 컬렉션이 존재하지 않으면 자동으로 생성한다. 여러 개를 입력할 때는 insertMany를 사용하며 자세한 것은 공식 문서를 참조할 것
insertMany는 입력을 원하는 자바스크립트 객체의 배열을 취한다. 지금은 하나만 입력하니 객체를 인자로 전달한다. 
e.g. {name: 'A book', price: 12.99}
- JSON이 아니라 자바스크립트 객체지만 MongoDB가 알아서 변환한다.
- 그러나 우리가 원하는 것은 product의 정보이므로 this를 입력한다. 
- insertOne은 이후 promise를 반환하여 then, catch가 존재한다. 

모든 제품 가져오기
    static fetchAll() {
        const db = getDb();
        return db.collection('products')
        .find()
        .toArray()
        .then(products => {
            console.log(products);
            return products;
        })
        .catch(err => {
            console.log(err);
        });
    }
- find: MongoDB의 데이터 탐색을 위한 메서드. 필터를 사용하여 원하는 것만 가져올 수 있다.
- 중요한 것은 find가 promise를 즉시 반환하는 대신 커서라는 것을 반환한다.
- 커서는 MongoDB가 제공하는 객체로, 단계별로 요소와 문서를 탐색한다. 왜냐하면 이론적으로 컬렉션에서 수백만 개의 문서를 반환할 수도 있지만 그만한 분량을 한꺼번에 전달하고 싶지는 않을 것이다. 대신 find는 MongoDB에게 다음 문서를 순차적으로 요청할 수 있는 일종의 손잡이를 제공하는 것이다. 
- toArray: MongoDB에게 모든 문서를 받아서 자바스크립트 배열로 바꾼다. 하지만 수십 개에서 백 개 정도의 문서가 있는 경우에 사용한다. 그렇지 않다면 추후 배울 페이지네이션을 사용하는 것이 낫다.

단일 제품 가져오기
     static findById(prodId) {
        const db = getDb();
        return db
        .collection('products')
        .find({ _id: new mongodb.ObjectId(prodId) })
        .next()
        .then(product => {
            console.log(product);
            return product;
        })
        .catch(err => console.log(err));
    }
- find는 여전히 커서를 제공한다. MongoDB는 한 개의 값만 받는다는 걸 모르기 때문이다. next 함수를 사용하여 find를 통해 반환된 다음 내지는 마지막 문서를 확보한다. 이제 then에는 product 한 개가 존재하고 이를 반환한다.
- 버튼을 눌러보면 에러가 나오는데 views/shop/index에 문제가 있다. product.id에 접근하는데 MongoDB에서는 _id라야 한다. 이것은 product-list 등 다른 페이지에서도 마찬가지다. 
- 그래도 null이 출력되는데 MongoDB의 id는 약간 다른 방식으로 저장하기 때문이다. Compass에서 볼 수 있듯이 ID는 사실 ObjectId다. MongoDB는 데이터를 BSON 형식으로 저장하고 이 JSON의 Binary 형식은 단지 작업 속도가 빨라서 사용하는 건 아니고 MongoDB가 내부에 특별한 유형의 데이터를 저장할 수 있기 때문이다. ObjectId는 자바스크립트에는 없고 MongoDB가 사용하는 객체다. ObjectId를 생성하여 안에 포함된 문자열을 전달한다.
* 이 부분에서 BSONTypeError: Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer 에러가 발생하는데 나중에 해결할 것

188_편집, 삭제 버튼 다시 작동하게 만들기

view에서 _id를 전달하는 것이 중요하다

189_업데이트를 위한 product 모델 수정

getEditproduct에서 이제 배열이 아닌 하나의 제품을 반환받을 것이므로 배열에서 추출할 필요가 없다.
이제 데이터베이스에 저장된 제품을 업데이트 하기 위해 모델에 _id 인수를 추가한다.
    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            // Update the product
            dbOp = db
            .collection('products')
            .updateOne({ _id: this._id }, { $set: this });
        } else {
            dbOp = db.collection('products').insertOne(this);
        }
        return dbOp
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(err));
    }
- 이제 this._id를 확인해서 이미 존재한다면 업데이트하고 없다면 새로 삽입하도록 한다.
- dbOp: dbOpertion을 뜻함
- updateOne에는 적어도 두 개의 인수를 넣어야 한다. 첫 번째는 어떤 요소 혹은 어떤 문서를 업데이트하는지 정의하는 필터이다. 자바스크립트 객체를 전달해 Equality로 필터를 적용한다. 두 번째 인수는 문서를 업데이트하는 방식을 지정한다.
자바스크립트 객체를 전달하는데 this를 입력하면 기존의 문서를 대체하게 되므로 입력하면 안된다. MongoDB의 속성인 $set에 this를 입력하면 객체에 있는 key-value 필드를 데이터베이스에서 찾은 문서에 설정한다. 더 정확하게 작성하자면
 {set: {title: this.title, ...}} 처럼 업데이트할 모든 필드를 입력해도 되지만 이 앱에서는 모든 필드를 업데이트하니까 this만 입력하면 된다.

업데이트 수정 사항

- admin 컨트롤러에서 ObjectId를 Product 생성자에 전달했었다. 이때 prodId를 문자열로 전달하고 product 모델에서 생성자로 전달한 ObjectId에 전달한다. 즉, id를 컨트롤러에서는 문자열로 전달하고 모델에서 생성자에 값을 넣을 때 ObjectId 객체로 전달하는 것이다. 이렇게 컨트롤러 파일에서 변환하는 것보다 모델에서 변환하는 것이 더 좋은 방법이다.

제품 삭제

- class에 메서드를 추가해 새 product 객체를 생성하고 delete를 호출할 수도 있느나 정적 메서드를 사용할 수도 있다.
    static deleteById(prodId) {
        const db = getDb();
        return db.collection('products')
        .deleteOne({ _id: new mongodb.ObjectId(prodId) })
        .then(result => {
            console.log('Deleted');
        })
        .catch(err => console.log(err));
    }
- deleteOne으로 요소 하나를 삭제한다. 이번에도 _id: 으로 시작하는데 prodId는 인수이기 때문에 ObjectId로 변환하려면 ObjectId 생성자에 전달해야 한다. 그럼 MongoDB가 이 조건을 충족하는 요소를 찾고 그 중에서 첫 번째 요소를 제거한다. 그리고 return으로 반환하여 then, catch 블록을 추가한다. 
    exports.postDeleteProduct = (req, res, next) => {
        const prodId = req.body.productId;
        Product.deleteById(prodId)
        .then(() => {
            console.log('DESTROYED PRODUCT');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
    }
- 그리고 컨트롤러에서 deleteById를 호출하여 삭제한다.

제품 생성 기능 수정하기

product 모델의 생성자에서 this._id = new mongodb.ObjectId(id); 로 항상 _id를 초기 설정했기 때문에 ID를 전달하지 않아서 undefined가 되어도 이 부분에서 객체를 생성해 저장하므로 save 메서드의 _id가 언제나 정의되어 있다.
이때 ObjectId가 비어있거나 자동 생성된 객체라면 오류가 발생한다. 
이걸 해결하기 위해 삼항 조건 연산자를 이용하여 id가 있는지 확인하고 없다면 null을 저장한다.
    this._id = id ? new mongodb.ObjectId(id) : null;
