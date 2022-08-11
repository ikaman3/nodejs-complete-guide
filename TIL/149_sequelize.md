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