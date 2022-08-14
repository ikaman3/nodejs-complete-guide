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