420_What is GraphQL?

REST API: Stateless, client-independent API for exchanging data
GraphQL API: Stateless, client-independent API for exchanging data with higher query flexibility

REST API와 비교한다. REST API는 무상태(Stateless)로 클라이언트와 독립되어 데이터를 교환하는 API이다. Node Express 애플리케이션 혹은 데이터를 교환하기 위해 구축하는 프레임워크 애플리케이션이라고 할 수 있다. 뷰를 렌더링하거나 세션을 저장하지 않고 클라이언트를 고려하지 않으면서 오직 요청을 받고 데이터를 분석한 후 JSON 데이터와 함께 응답을 반환한다.
GraphQL API도 크게 다르지 않은데 무상태로 클라이언트와 독립되어 데이터를 교환하는 API이지만 더 중요한 점은 쿼리 유연성이 높다는 점이다. 

GET /post -> Fetch Post -> {id: '1', title: 'First Post', content: '...', creator: '...'}

What if we only need the title and id?

Solution 1: Create a new REST API Endpoint(e.g. GET /post-slim)
- Problem: Lots and lots of Endpoints & lots of Updating
Solution 2: Use Query Parameters (e.g. GET /post?data=slim)
- Problem: API becomes hard to understand
Solution 3: Use GraphQL
- Problem: None

REST API의 한계점을 이해해보자. REST API에 다음과 같은 엔드 포인트가 있다고 가정한다. /post로 GET 요청을 보내는 것이다. DB 혹은 파일로부터 게시물을 가져오고 클라이언트에 반환하는 것을 예상할 수 있다. 하지만 클라이언트에 title, id만 필요하고 다른 것은 필요없다면 어떨까. 물론 프론트엔드 앱에 하나의 엔드 포인트를 사용하는 시나리오는 많을 것이다. 즉, 단일 페이지 앱이나 모바일 앱의 특정 페이지에는 제목과 내용이 필요한 반면 다른 페이지에는 content와 creator이 필요할 수 있다. 
첫 번째 해결책은 다양한 유형의 데이터를 반환하는 엔드 포인트를 더 만드는 것이다. 새 REST API에 엔드 포인트를 생성하고 분석이나 필터링을 통해 프론트엔드에 필요한 데이터만 가질 수도 있지만 필요 이상으로 많은 데이터를 보내면 특히 모바일 기기를 다룰 때 문제가 생길 수 있다. 따라서 간단하게 엔드 포인트를 더 생성해서 각 엔드 포인트에 필요한 데이터를 반환하는 것이 좋다.
이때 엔드 포인트가 너무 많으면 지속적으로 업데이트하는 데 어려움이 있기 때문에 유연성이 떨어진다. 큰 프로젝트에서 여러 팀으로 나뉘어 작업하는 경우 프론트엔드 엔지니어가 새 페이지에 데이터가 필요할 때 백엔드 개발자에게 찾아가서 해당 데이터를 반환하는 엔드 포인드를 만들어달라고 할 것이다. 백엔드 개발자가 도움을 주기 전까지 프론트엔드 개발을 이어갈 수 없으므로 발 빠른 대응이 어려워진다. 동시에 백엔드에서는 지속적으로 프론트엔드 엔지니어의 요구에 따라 엔드 포인트를 추가해야 하니 이상적인 상황이 아니다. 
두 번째 해결책은 쿼리 매개변수를 사용하는 것이다. 기존 엔드 포인트에 data=slim 등의 쿼리 매개변수를 추가하는 방법이다. 하지만 첫 번째와 비슷하게 백엔드 개발자가 추가해야 프론트엔드 엔지니어가 작업을 진행할 수 있는 종속성이 있다. 또한 어떤 쿼리 매개변수에 어떤 값을 설정할 수 있는지 명확하지 않으면 API 이해가 어렵기 때문에 이상적인 방법이 아니다.
이처럼 여러 페이지에 다양한 데이터 요구사항이 있는 앱에 이상적인 해결책이 바로 GraphQL이다. GraphQL은 쿼리 언어가 있어서 프론트엔드에서 백엔드로 보내 분석하면서 필요한 데이터를 검색할 수 있다. 백엔드에서 사용하는 DB 쿼리 언어인 SQL, MongoDB 쿼리 언어가 프론트엔드에 있는 것과 다름없다. 백엔드로 보내는 요청에 쿼리 언어를 붙이는 것이다.

How does GraphQL Work?

           Post Request contains Query Expression(to define the Data that should be returned)
Client --> POST /graphql Server (Server-side Logic, Database Access etc.)
            One Single Endpoint

클라이언트와 서버가 있고 서버에는 대게 데이터베이스 및 파일과 연계된 논리가 있다. GraphQL에서 클라이언트는 오직 한 가지 /graphql에 POST 요청만 보내기 때문에 HTTP 요청을 보내는 하나의 엔드 포인트만 있다. 데이터를 받을 때도 마찬가지다. POST 요청에는 요청 본문을 추가할 수 있으며 요청 본문에 쿼리 표현을 포함하는데 GraphQL은 고유의 쿼리 언어를 정의할 수 있다. 이런 쿼리 언어를 요청 본문에 넣는다. 쿼리 언어 표현을 넣어서 요청 본문을 보내면 서버에서 분석 후에 원하는 데이터를 반환하는 게 GraphQL의 핵심 개념이다. 

A GraphQL Query

{
    query { // Operation type(Other types: mutation, subscription)
        user { // Operation "endpoint"
            name // Requested fields
            age
        }
    }
}

일반적인 GraphQL은 이런식으로 나타낸다. JSON 객체 구조와 비슷하게 연산 유형을 나타낸다. 여기서 query는 데이터를 받는 연산이다. 다른 유형으로는 데이터 편집, 삭제 및 삽입을 하는 mutation이나 웹 소켓으로 실시간 데이터 구독을 돕는 subscription이 있다. 
다음은 실행할 수 있는 명령어로 백엔드에서 사용 가능하다고 정의한 엔드 포인트이며 추출하고자 하는 필드로 이어진다. 이 부분은 유동성이 있다. 한 페이지에는 사용자의 이름만 필요하지만 다른 페이지에선 이름, 나이, 이메일을 받을 수도 있다. 이처럼 쿼리에 넣어 백엔드로 보내면 그에 따라 분석이 진행된다.

Operation Types

Query: Retrieve Data (GET)
Mutation: Manipulate Data(POST, PUT, PATCH, DELETE)
Subscription: Set up realtime connection via Websockets

Query의 경우 데이터를 검색하기 위해 POST 요청을 사용한다. 하지만 REST API와 비교하자면 일정 경로에 GET 요청을 보내는 것과 같다.
Mutation은 데이터를 변경하는 모든 경우에 사용된다. 전에 사용했던 POST, PUT, PATCH, DELETE 요청과 같다.
그 외의 Subscription은 웹 소켓을 통해 실시간 연결을 설정하는데 이 강의에서는 생략한다. GraphQL의 방대한 양에서 핵심 부분만 집중하기 위해서이다.

GraphQL Bic Picture

Client ===> Server | POST /graphql | Type Definition, Query Definitions(Like Routes), Mutation Definitions(Like Routes), Subscription Definitions(Like Routes) ===> Resolvers(contain your server-side logic, Like Controllers)

정리하자면 클라이언트에서 서버의 단일 GraphQL 엔드 포인트에 요청을 보내고 Query, Mutation, Subscription의 정의를 설정하며 이때 Type 정의를 사용하는데 GraphQL이 쿼리에 반환하는 데이터의 유형을 정의하는 쿼리 언어를 사용하기 때문이다. 따라서 여기서 정의하는 엔드 포인트 즉 Query, Mutation, Subscription는 서버 측 논리를 포함한 Resolvers(리졸버) 함수에 연결된다. REST API와 비교하면 Definition이 라우트와 같고 Resolver가 컨트롤러와 같다.

It's a normal Node(+ Express) Server
ONE Single Endpoint(typically /graphql)
Uses POST because Request Body defines Data Structure of retrieved Data
Server-side Resolver analyses Request Body, Fetches and Prepares and Returns Data

일반적인 노드나 Express 서버라고 볼 수 있다. 당연히 어떠한 프로그래밍 언어와도 사용할 수 있다.
보통 /graphql 이라는 하나의 엔드 포인트가 있지만 원한다면 바꿀 수 있다.
한편 쿼리 표현을 요청 본문에 넣기 위해 POST 요청만 사용한다.
서버 측에 있는 Resolver가 요청 본문을 분석한 후 본문에 있는 쿼리 표현에 따라 데이터를 처리한다. 이때 분석에는 제3자 패키지를 사용한다.
===========================================================================================
421_설정 이해 및 예제 쿼리 작성

기존 서버에서 socket.js 파일, routes 폴더를 삭제한다. 라우트가 필요하지 않으니 app.js에서 라우트를 제거한다. Socket.io 연결을 설정하지 않으니 서버에 저장하는 코드도 제거한다. 이제 라우트 대신 GraphQL 엔드 포인트를 사용한다.

npm install --save graphql express-graphql
- graphql, express-graphql 패키지를 설치한다. graphql은 GraphQL 서비스의 스키마를 정의하는 데 필요한 패키지로 query, mutation 등의 정의를 허용한다. express-graphql은 서버가 들어오는 요청을 분석하도록 만든다.
- express-graphql 이외의 다른 프레임워크를 사용할 수 있다. 어느 노드 프레임워크에서나 사용할 수 있는 Apollo 등이 있다.

새 폴더 graphql을 생성하고 schema.js, resolvers.js 파일을 추가한다. schema에는 쿼리, 뮤테이션 등 GraphQL 서비스 유형을 정의한다. resolvers는 들어오는 쿼리를 위해 실행되는 논리를 정의한다. 
schema.js => 
    const { buildSchema } = require('graphql');
    module.exports = buildSchema(`
        type RootQuery {
            hello: String!
        }

        schema {
            query: RootQuery
        }
    `);
- graphql 패키지에서 buildSchema 함수를 임포트한다. graphql 및 express-graphql에 의해 분석될 수 있는 스키마를 구축할 수 있게 된다.
- buildSchema 함수를 호출하고 발생하는 스키마 객체를 반환하는데 스키마를 나타내는 문자열을 전달한다. 백틱을 사용해 문자열 및 템플릿 리터럴로 만든다. 그다음 query 필드를 정의한다. 이 필드가 모든 쿼리를 가진 객체가 된다. 이때 쿼리는 실질적으로 데이터를 받는 부분으로 허용하고자 하는 모든 쿼리를 의미한다. 가독성을 위해 type 키워드로 원하는 이름을 붙인다.
- RootQuery는 만들 수 있는 모든 유형의 쿼리를 갖는다. 예제는 hello 쿼리를 추가해 String을 반환한다. 유형 뒤에 느낌표를 붙이면 필수로 만든다. 문자열을 반환하지 않으면 오류가 날 것이다.

이렇게 하면 hello 쿼리를 보내서 텍스트를 받는 기본적인 스키마가 완성된다. 이때 텍스트는 리졸버에서 결정된다.
resolvers.js =>
    module.exports = {
        hello() {
            return 'Hell World!';
        }
    };
- resolver는 exports 된 객체로 hello 함수 및 메서드를 필요로 한다. 즉 스키마에 정의된 각 쿼리나 뮤테이션에 메서드가 필요하며 정의한 이름과 일치하는 이름을 입력해야 한다. 쿼리 이름이 hello이기 때문에 메서드 이름도 hello로 해야한다. schema의 query는 리졸버가 필요하지 않은데 스키마에 설정한 RootQuery가 서브 쿼리로 이루어져 있으며 서브 쿼리에 resolver가 필요하다. 

아주 간단한 GraphQL 서비스가 완성되었다. 테스트를 위해 좀 더 복잡하게 만들어본다.
schema.js =>
    module.exports = buildSchema(`
        type TestData {
            text: String!
            views: Int!
        }

        type RootQuery {
            hello: TestData!
        }

        schema {
            query: RootQuery
        }
    `);
resolvers.js =>
    module.exports = {
        hello() {
            return {
                text: 'Hell World!',
                views: 1245
            };
        }
    };

유효한 스키마와 리졸버가 있으니 express-graphql 패키지를 통해 공개할 차례이다. app.js에 graphqlHttp를 임포트한다. 그리고 아래의 에러 핸들링 미들웨어 위에 미들웨어를 추가한다. 경로는 원하는 대로 써도 되지만 보통 /graphql을 사용한다. 이때 고의적으로 POST 요청으로 제한하지 않고 app.use를 사용한다.
app.js =>
    const graphqlHttp = require('express-graphql').graphqlHTTP;
    const graphqlSchema = require('./graphql/schema');
    const graphqlResolver = require('./graphql/resolvers');
    ...
    app.use('/graphql', graphqlHttp({
        schema: graphqlSchema,
        rootValue: graphqlResolver
    }));
- express-graphql이 제공하는 graphqlHttp 메서드에 자바스크립트 객체를 전달하여 두 가지 항목을 구성한다. 첫 번째는 schema로 schema.js 파일에서 내보낸 스키마를 불러온다. 두 번째는 리졸버로 rootValue가 리졸버를 가리키도록 내보낸 resolvers를 불러온다.

이제 테스트를 위해 Postman으로 POST 요청을 보낸다. body에는 쿼리를 설명하는 JSON 데이터를 넣는다.
    {
        "query": "{ hello { text views } }"
    }
- query 키로 자바스크립트 객체를 보내는데 mutation이 아니라 query를 보낸다는 뜻이 아니고 express-graphql 패키지가 query를 찾을 거라는 뜻이다. 중괄호 안에 진짜 쿼리를 작성한다. 이 경우는 문자열이다. 큰 따옴표 안에 들어가는 값이 GraphQL 쿼리 표현이다.
- 큰 따옴표 안에 중괄호를 쓰고 그 안에 원하는 쿼리의 이름을 적는다. 작성한 스키마에 hello 쿼리가 있으므로 hello를 입력했다. text와 views가 있는 TestData를 반환할 테니 해당 쿼리로 받고자 하는 데이터를 정의한다. 따라서 쿼리 이름 다음에 중괄호를 추가하고 쿼리로 받고 싶은 필드 즉, 속성을 나열한다. 띄어쓰기로 분리한다. 이때 views는 적지않고 text만 받을 수도 있다.
result =>
    {
        "data": {
            "hello": {
                "text": "Hell World!",
                "views": 1245
            }
        }
    }

이런 식으로 유동성이 있다. 하나의 엔드 포인트지만 프론트엔드에 받고자 하는 데이터를 정의한다. 프론트엔드에서 데이터를 필터링하는 게 아니라 express-graphql에 의해 서버에서 필터링 된다는 점이 중요하다. 스키마와 리졸버만 정의하면 되는데 사실 리졸버에는 모든 데이터를 반환하지만 서버의 GraphQL이 작업을 책임지기 때문에 신경쓰지 않아도 된다.
===========================================================================================
422_뮤테이션 스키마 정의

가입을 통해 사용자를 생성하려면 뮤테이션을 이용해야 한다. 우선 프론트엔드를 조금 수정한다. 더 이상 Socket.io를 사용하지 않으니 Feed.js에서 import openSocket, componentDidMount 함수의 socket 연결 부분을 제거한다. addPost, updatePost도 제거한다. 
먼저 뮤테이션을 생성한다. 테스트용 리졸버와 스키마를 제거하고 뮤테이션을 추가한다. 
schema.js => 
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: String!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
    }

    schema {
        mutation: RootMutation
    }
- 쿼리를 만들 때처럼 type에 이름을 짓고 허용하고자 하는 여러 뮤테이션을 정의한다. 
- createUser에 뮤테이션 인수를 입력 값으로 요청하는데 쿼리 이름 다음에 괄호를 입력하면 리졸버에 넣고 추후에 실행될 인수를 지정한다. 콜론 다음에 데이터의 유형을 정의한다. title: String 처럼 하나씩 작성해도 되지만 하나의 객체 userInput으로 묶었다. 그리고 : 뒤에 반환할 값을 명시한다. 여기서는 User 이다.
- userInput 객체를 위해 새 타입을 만들 때는 type을 사용하지 않고 입력값 즉, 인수로 사용된 데이터를 위한 특별한 키워드인 input 키워드를 사용하고 UserInputData 라는 객체를 정의한다. 이름은 자유다.
- 사용자가 생성된 후에 사용자 객체를 받아야 하므로 input이 아닌 type으로 User를 추가한다. _id 필드를 ID! 타입으로 정의했는데 GraphQL이 제공하는 특별한 타입으로 ID로 취급된다는 의미이다.
- posts 배열에 게시물이 어떻게 보일지 정의해야 하므로 type 키워드로 Post를 정의한다. GraphQL은 날짜를 인식하지 못하므로 String을 사용한다. 마지막 두 개의 날짜 필드가 필요한 이유는 Mongoose 모델에서 타임스탬프를 활성화했기 때문이다.
===========================================================================================
423_뮤테이션 분석기 및 GraphiQL 추가하기

createUser 스키마를 정의했으니 사용자를 생성할 수 있게 리졸버가 필요하다. resolvers 파일에 createUser를 추가하고 몇 가지 인수를 입력한다. DB와 상호작용하기 위해 user 모델을 임포트한다.
resolvers.js =>
    const User = require('../models/user');

    module.exports = {
        createUser: async function({ userInput }, req) {
            // const email = args.userInput.email;
            const existingUser = await User.findOne({email: userInput.email});
            if (existingUser) {...}
            const hashedPw = await bcrypt.hash(userInput.password, 12);
            const user = new User({
                email: userInput.email,
                ...
            })
            const createdUser = await user.save();
            return {...createdUser._doc, _id: createdUser._id.toString()};
        }
    }
- async/await 구문을 사용하기 위해 메서드 작성 방식을 변경한다. then, catch를 써도 된다.
- 인수는 게시물 ID가 아니라 사용자 입력 데이터이므로 첫 번째 인수로 args 객체를 입력하고 두 번째 인수로 입력하는 req는 중요한 요소가 된다. 이때 들어오는 args 객체에는 스키마에 정의한 모든 데이터를 검색할 수 있다. email, name, password가 인수 데이터이기 때문에 args 객체로 검색할 수 있다. 하지만 args가 갖는 userInput 필드를 사용하는데 args는 이 함수에 전달된 모든 인수를 포함한 객체가 된다. 즉, args가 userInput 필드를 가지고 userInput에는 email, name, password가 있다. 이 방법 외에도 Destructuring을 통해 userInput만 받으면 코드를 줄일 수 있다.
- 사용자가 존재하는지 확인하는데 async/await을 사용하지 않을 경우 User.findOne 쿼리를 return하고 then 블록을 추가해야 한다. 리졸버에 프로미스를 반환하지 않으면 GraphQL이 결과를 기다리지 않기 때문이다. await을 사용하면 자동으로 반환된다. return 문이 보이지는 않아도 존재한다.
- 유저가 이미 존재한다면 에러다.
- bcryptjs로 비밀번호를 해시화하여 저장한다. 
- new User 객체를 생성하고 DB에 저장하려면 createdUser 상수를 만들어 await user.save()로 지정한다. 그럼 생성된 User 객체를 반환한다.
- 마지막으로 반환할 데이터는 스키마에 따라 User 객체이다. ...createdUser._doc으로 Mongoose가 추가할 메타데이터를 제외한 사용자 데이터를 포함하며 독립된 속성으로 _id 필드를 추가해서 ._doc을 덮어쓰도록 하는데 ID 필드에서 문자열 필드로 전환한다.

리졸버 정의가 끝났으니 프론트엔드에서 테스트해야 하는데 Postman 외에도 방법이 있다. 뮤테이션을 테스트하기 위해 app.js에서 GraphQL 엔드 포인트를 설정하는 부분에 graphiql을 true로 설정한다. 특정한 툴을 사용할 수 있게 하며 POST 요청만 듣지 않는 이유이기도 하다.
    app.use('/graphql', graphqlHttp({
        schema: graphqlSchema,
        rootValue: graphqlResolver,
        graphiql: true
    }));
현재 실행하고 있는 서버에서 localhost:8080/graphql을 방문하면 GET 요청을 보내게 된다. 그럼 테스트 화면이 나온다. 테스트를 위해 schema에서 query를 추가한다. 리졸버는 필요없고 쿼리만 있으면 된다.
    type RootQuery {
        hello: String
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
다시 브라우저로 돌아가 새로고침하면 창 오른편에 진행할 수 있는 연산이 나온다. RootMutation을 클릭하면 어떤 뮤테이션이 있고 어떤 데이터를 보내야 하는지 나온다. 왼쪽의 창에서 데이터를 보낼 수도 있다.
    mutation {
        createUser(userInput: {email: "...", name: "...", passoword: "..."}) {
            _id
            email
        }
    }
- createUser 뮤테이션을 실행하고 userInput에 해당 데이터를 포함한 객체를 입력한다.
- 중괄호를 추가해서 쿼리가 완료되면 반환할 데이터를 정의한다.

실행을 하면 _id, email이 반환되고 DB를 보면 새로운 사용자가 생성되어 있다.
===========================================================================================
424_입력 검증 추가

뮤테이션을 추가하여 DB에 데이터를 저장할 수 있게 됐다. 이때 저장하는 데이터가 유효한지 확인하는 과정이 필요하다. 뷰를 렌더링하는 일반 Node Express 앱과 REST API에서는 Express Validator를 라우트에 미들웨어로 추가했었다. 하지만 GraphQL에는 하나의 라우트만 있고 유일한 엔드 포인트인데 모든 요청을 같은 방식으로 검사하면 안 된다. 필요에 따라 조정할 수 있도록 리졸버에서 유효성 검사를 해야 한다. 리졸버에 엔드포인트가 있으니 들어오는 요청 데이터를 검사한다.
    npm install --save validator
Express Validator가 배후에서 사용했던 패키지를 이번에는 코드에 직접 사용한다. 
resolvers.js =>
    const validator = require('validator');
    ...
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
        errors.push({message: '...'});
    }
    if (validator.isEmpty(userInput.password) || !validator.isLength(userInput.password, { min : 5 })
    ) {
        errors.push({ message: '...' });
    }
    if (errors.length > 0) {
        const error = new Error('Invalid input.');
        throw error;
    }
- Express Validator와 동일한 메서드가 사용되는데 validator 패키지에 기반하기 때문이다. if 문이 true라면 오류를 저장하기 위한 errors 배열에 오류를 푸시한다. 이후에도 필요한 검증을 알맞게 추가한다.
- if 문을 모두 통과한 후 errors 배열의 길이가 0보다 큰지 확인하여 오류가 발생했는지 확인한다. 
===========================================================================================
425_Error Handling

테스트에서 일부러 에러를 발생시켜보면 오류가 나온다. 돌려주는 데이터는 null이고 errors 키에는 모든 오류를 모아둔 배열이 포함되어 있다. 이것도 좋지만 더 자세한 정보를 추가하고 싶을 수도 있다. 이를 위해 GraphQL API를 구성한 app.js 파일에서 formatError라는 구성 옵션을 추가한다. 사실상 GraphQL이 감지한 오류를 받아 우리가 만든 포맷을 반환할 수 있게 해주는 메서드이다.
    app.use('/graphql', graphqlHttp({
        ...
        customFormatErrorFn(err) {
            if (!err.originalError) {
                return err;
            }
            const data = err.originalError.data;
            const message = err.message || 'An error occurred.';
            const code = err.originalError.code || 500;
            return { message: message, status: code, data: data };
        }
    }));
- 단순히 err를 return하기만 하면 기본값 포맷을 유지한다.
- originalError는 Express-GraphQL이 사용자나 다른 제3자 패키지의 오류를 감지했을 때 설정된다. 쿼리에 글자가 누락되는 등의 기술적인 오류가 생긴 경우에는 originalError를 갖지 않는다.
- 마지막으로 나만의 오류 객체를 반환할 수 있는데 여기에 필드를 추가하여 원하는 정보를 포함한다. 

originalError가 있다면 다른 곳에서도 사용할 수 있도록 유용한 정보를 추출할 수 있다. 이는 resolvers.js에서 할 수 있다.
resolvers.js => 
    if (errors.length > 0) {
        const error = new Error('Invalid input.');
        error.data = errors;
        error.code = 422;
        throw error;
    }
- 오류가 발생했다면 errors에 data 필드를 추가할 수 있는데 errors는 나의 검증 오류 메시지가 들어있는 오류 배열을 말한다. 또한 코드를 422로 설정하거나 고유의 코딩 시스템을 만들 수 있다.
===========================================================================================
426_프론트엔드를 GraphQL API에 연결

기존의 프론트엔드 App.js를 보면 REST API에서의 요청을 사용하고 있다. GraphQL에서는 모든 요청을 /graphql 만을 사용한다. body는 GraphQL 쿼리 언어로 구성되어야 한다. 새로운 상수를 생성하고 쿼리 키가 포함된 자바스크립트 객체로 한다. query는 백틱으로 감싸고 테스트로 전송했던 쿼리를 복사 붙여넣기하면 된다.
Frontend/App.js => signupHandler
    const graphqlQuery = {
        query: `
            mutation {
                createUser(userInput: {email: "${authData.signupForm.email.value}", name: "${...}", password: "${...}"}) {
                    _id
                    email
                }
            }
        `
    };
- 값을 사용자 입력에서 가져온 값으로 교체해야 한다. 백틱은 템플릿 리터럴이고 ${}로 값을 주입할 수 있다. 주입된 값에는 ""를 반드시 사용한다. 이 쿼리 언어에서는 문자열을 ""로 표기해야 하기 때문이다.
    ...
    fetch('http://localhost:8080/graphql', {
        ...
        body: JSON.stringify(graphqlQuery)
    })
- url을 변경하고, body에 들어갈 객체로 위에서 작성한 쿼리를 넣는다.
    .then(res => {
        return res.json();
    })
    .then(resData => {
        if (resData.errors && resData.errors[0].status === 422) {
            throw new Error(
                "Validation failed. Make sure the email address isn't used yet!"
            );
        }
        if (resData.errors) {
            throw new Error('User creation failed.');
        }
        ...
    })
- res를 인수로 갖는 첫 번째 then 블록에서 상태 코드는 설정하지 않을 것이므로 확인할 필요가 없다. 200이나 500이 될 것이다.
- 대신 다음 then 블록에 붙여넣는다. 응답의 바디를 분석할 곳이다. 여기에서 응답 데이터에 오류가 있는지 확인할 수 있는데 첫 오류에서 상태 필드를 확인할 수 있다. 그러므로 에러가 있는지 확인하고 첫 번째 요소에 대해 status 필드가 있는지 확인한다.

브라우저에서 회원가입을 해보면 Maethod Not Allowed 에러가 발생한다. 이 오류의 원인인 POST 요청이 아닌 OPTIONS 요청에 대한 응답으로 발생하는 오류이다. Express GraphQL이 POST, GET 요청이 아닌 모든 요청을 자동으로 거부한다. 해결을 위해 헤더를 설정한 백엔드의 app.js로 간다.
app.js =>
    app.use((req, res, next) => {
        ...
        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        }
        next();
    });
- 여기서 요청 메서드가 OPTIONS인지 확인하고 상태코드 200을 반환한다. 상태 코드 200으로 빈 응답을 전송하는 것이다. 밑의 코드(next())가 실행되지 않으므로 OPTIONS 요청은 GraphQL 엔드 포인트에 도달할 수 없지만 유효한 응답을 받게 된다.

다시 브라우저에서 이미 존재하는 이메일로 회원가입을 시도하면 User creation failed 에러가 뜬다. 사용되지 않은 유효한 이메일로 가입하면 성공한다.
===========================================================================================
427_로그인 쿼리 및 리졸버 추가

GraphQL의 인증은 어떨까? GraphQL API는 무상태이며 클라이언트 독립적이다. 따라서 대개 보호되는 리소스에 접근할 수 있는 모든 요청에 부착할 수 있는 토큰 등으로 인증하는 방식을 여전히 사용한다. 로그인 액션은 결국 사용자 데이터를 전송하고 토큰을 받기 원하는 일반적인 쿼리와 같다. 
schema.js에서 실제 쿼리를 정의한다.
schema.js => 
    type AuthData {
        token: String!
        userId: String!
    }
    ...
    type RootQuery {
        login(email: String!, password: String!): AuthData!
    }
- login 쿼리를 생성한다. 여러 인수를 사용하고 User가 아닌 데이터를 반환할건데 사용자 ID와 같은 토큰 등의 정보를 포함한 데이터를 반환하게 한다.

이제 리졸버가 필요하다. createUser 뒤에 login 리졸버를 추가한다. 이 리졸버의 목적은 당연히 올바른 email 주소를 가진 사용자를 찾아서 암호를 확인하는 것이다.
resolvers.js =>
    login: async function({ email, password }) {
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error('User not found.');
            error.code = 401;
            throw error;
        }
- 사용자를 인증하지 못했으니 401을 사용한다.
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            ...
        }
        const token = jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email
            }, 
            SECRET_KEY, 
            { expiresIn: '1h' }
        );
- 토큰 생성에 여전히 jsonwebtoken 패키지를 사용한다.
        return { token: token, userId: user._id.toString() };
    }

이제 로그인을 위한 get 요청처럼 전송할 로그인 쿼리가 생겼다.
===========================================================================================
428_로그인 기능 추가

프론트엔드에서 사용자를 로그인하게 해주는 loginHandler로 간다. signupHandler와 마찬가지로 url을 변경하고 POST 요청을 사용한다. 그리고 쿼리를 지정한다.
App.js => loginHandler
    const graphqlQuery = {
      query: `
        { 
            login(email: "${...}", password: "${...}") {
                token
                userId
            }
        }`
    };
    ...
    fetch('http://localhost:8080/graphql', {
        ...
        body: JSON.stringify(graphqlQuery)
    })
- 일반 쿼리에는 query를 입력할 필요없이 바로 시작해도 된다. { }로 바로 시작하면 된다.
- 이 쿼리에서 schema.js에 정의한 login 쿼리에 접근한다. login 쿼리에서 email, passowrd를 입력했으니 추출한 데이터를 입력한다.
- 중괄호 안에 포함시킨 데이터를 가져올 수 있는데 token, userId가 필요하니 표기한다.
- 이것이 실행하려는 쿼리이고 요청 바디의 JSON.stringify에 입력할 데이터이다.

signupHandler에서 배운것처럼 상태 코드를 확인하는 처리를 작성한다.
브라우저로 GraphiQL에 접속하여 테스트 쿼리를 작성한다.
    {
        login(email:"...", password:"...") {
            token
            userId
        }
    }
Result =>
    {
        "data": {
            "login": {
                "token": "...",
                "userId": "..."
            }
        }
    }
- 항상 GraphQL을 통해 추가되는 data 필드를 지니는 객체에도 데이터를 얻는다. 여기에는 쿼리 이름인 login과 응답 데이터가 들어있다. 이 전체 객체는 react 코드의 resData에 해당한다. 그러므로 토큰을 얻고 싶다면 resData.data.login.token으로 접근해야 한다. resData에서 무언가를 검색하는 모든 부분에 똑같이 적용한다.
===========================================================================================
429_Post 뮤테이션 생성

이제 사용자가 생겼으니 게시물 작업을 한다. 백엔드의 schema.js에서 시작한다. createPost 뮤테이션을 추가한다.
schema.js =>
    input PostInputData {
        title: String!
        content: String!
        imageUrl: String!
    }

    type RootMutation {
        ...
        createPost(postInput: PostInputData): Post!
    }
- User는 관련 있는 토큰에서 검색할 수 있고 이미지 업로드는 나중에 따로 살펴볼 것이다. 따라서 여기서는 PostInputData를 얻고 생성된 Post를 반환한다.

resolvers.js => 
    createPost: async function({ postInput }, req) {
        const errors = [];
        if (validator.isEmpty(postInput.title) || 
        !validator.isLength(postInput.title, { min : 5 })) {
            ...
        }
        if (validator.isEmpty(postInput.content) || 
        !validator.isLength(postInput.content, { min : 5 })) {
            ...
        }
        if (errors.length > 0) {
            ...
        }

        const user = await User.findById(req.userId);
        if (!user) {
            ...
        }
        const post = new Post({
            title: postInput.title,
            ...
        });
        const createdPost = await post.save();
        user.posts.push(createdPost);
        await user.save();
        return { 
            ...createdPost._doc, 
            _id: createdPost._id.toString(),
            createdAt: createdPost.createdAt.toISOString(), 
            updatedAt: createdPost.updatedAt.toISOString() 
        };
    }
- req는 userData를 구하는데 필요하다.
- 입력에 대한 검증을 추가한다. 사용자를 생성하거나 로그인할 때 사용했던 접근법과 같다. 이 if 문들을 통과했다면 유효한 입력이므로 새로운 Post를 작성할 수 있다. 
- return의 데이터들이 새로운 post를 추가할 때 반환할 데이터이다.

GraphiQL로 뮤테이션을 입력하면 잘 작동한다.
===========================================================================================
430_인증 토큰에서 사용자 데이터 추출

이제 토큰을 검증하고 사용자를 추출해야 한다. 우선 들어오는 요청의 헤더에서 토큰을 확실히 전송해야 한다. 그리고 프론트엔드에서 나가는 요청에 실제 토큰을 부착한다. 이전의 REST API에서는 isAuth 미들웨어를 사용해 토큰을 획득하여 검증했고 사용자 데이터를 추출하여 사용자 데이터를 요청 객체에 부착했었다. 지금 하려는 작업도 매우 유사하다.
middleware 폴더의 is-auth.js 파일을 auth.js로 변경한다. 검증뿐만 아니라 사용자 데이터 또한 주기 때문인데 필수는 아니다. 

middleware/auth.js =>
module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    ...
    try {
        decodedToken = jwt.verify(token, SECRET_KEY);
    } catch (err) {
        req.isAuth = false;
        return next();
    }
    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }
    req.userId = decodedToken.userId;
    req.isAuth = true;
    next();
};
- 여기에서도 authHeader를 가져야 한다. 설정이 안 됐으면 오류를 띄우지 않고 req.isAuth를 false로 설정한다. 이러면 리졸버에서 처리할 수 있다. 그리고 next를 호출해서 다음 미들웨어로 이어지게 한다.
- 이후 논리는 이전과 동일하다. 에러가 발생하면 이번에도 req.isAuth를 false로 설정하고 next를 호출한다.
- 모든 검사를 통과하면 복호화한 토큰에서 userId를 얻는데 이 새로운 속성을 요청에 추가하여 isAuth를 true로 설정하고 next를 호출한다.

수정한 auth.js 파일을 app.js에 임포트하고 GraphQL 엔드포인트 앞에 추가한다.
app.js =>
    const auth = require('./middleware/auth');
    ...
    app.use(auth);
- 이 미들웨어는 GraphQL 엔드 포인트에 도달하는 모든 요청에서 실행되며 토큰이 없어도 요청을 거부하지 않는다. 다만 isAuth를 false로 할뿐이다. 그리고 지속 여부를 리졸버에서 결정한다.

이제 리졸버로 간다. createUser에서는 인증 여부를 고려하지 않는다. 그러므로 여기선 아무 작업도 하지 않는다. createPost는 요청이 isAuth인지 확인하고 true가 아닌 경우 게시물 작성에 대한 접근을 막는다.
resolvers.js => createPost
    if (!req.isAuth) {
        const error = new Error('Not authenticated.');
        error.code = 401;
        throw error;
    }
    ...
    const user = await User.findById(req.userId);
    if (!user) {
        ...
    }
    ...
    user.posts.push(createdPost);
- 게시물을 작성하기 전에 DB에서 사용자를 가져오는데 auth 미들웨어에서 userId를 요청에 저장했으므로 findOne이 아니라 findById를 사용할 수 있다.
===========================================================================================
431_'게시물 작성' 쿼리 전송

프론트엔드의 Feed.js 파일에 있는 finishEditHandler 함수에서 이제 GraphQL 엔드 포인트에 도달해 새로운 사용자를 생성하려고 한다. 우선 기존의 url을 설정하고 다른 메서드를 설정하는 부분을 제거한다.
Feed.js =>
    let graphqlQuery = {
        query: `
            mutation {
                createPost(postInput: {title: "${postData.title}", content: "${postData.content}", imageUrl: "some url") {
                _id
                title
                content
                imageUrl
                creator {
                    name
                }
                createdAt
            }
          }
        `
    };

    fetch('http://localhost:8080/post-image', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + this.props.token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(graphqlQuery)
    })
    ...
    const post = {
        _id: resData.data.createPost._id,
        ...
    };
    user.posts.push(createdPost);
    await user.save();
    return {...};
- 브라우저의 로그를 보면 data가 추출한 데이터를 표시하는 형식이다. 데이터 필드가 있는 data 객체와 쿼리 이름인 createPost가 있고 중첩된 또 다른 객체에는 해당 쿼리에 대한 필드가 있다. 이제 res.data가 아니라 resData.data.createPost로 접근하여 생성된 게시물의 필드에 접근한다. 
- user에 저장하여 각 사용자가 작성한 게시물 배열이 저장되도록 해야한다.

게시물을 생성하면 이미지 업로드를 제외한 기능이 작동한다.
===========================================================================================
433_'게시물 가져오기' 쿼리 및 리졸버 추가

모든 게시물을 가져올 수 있도록 작업한다. 백엔드의 schema.js에 쿼리를 추가한다.
schema.js =>
    type PostData {
        posts: [Post!]!
        totalPosts: Int!
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData!
        posts(page: Int): PostData!
    }
- 게시물 배열인 Posts를 예상할 수 있지만 새로운 타입을 만든다. REST API에서 작업했다시피 게시물 배열의 반환뿐만 아니라 DB의 게시물 개수를 나타내는 숫자도 반환해야 하기 때문이다. PostData 타입을 만들고 게시물 배열인 posts 필드와 개수를 나타낼 totalPost 필드를 만든다.

쿼리를 추가했으니 리졸버를 만든다. 인증 코드는 위에서 복사한다.
resolvers.js =>
    posts: async function(args, req) {
        ...
        const totalPosts = await Post.find().countDocuments();
        const posts = await Post.find().sort({ createdAt: -1 }).populate('creator');
        return { posts: posts.map(p => {
            return { 
                ...p._doc, 
                _id: p._id.toString(), 
                createdAt: p.createdAt.toISOString(), 
                updatedAt: p.updatedAt.toISOString() 
            };
        }), totalPosts: totalPosts };
    }
- 첫 인수는 신경쓰지 않으므로 args만 입력한다. 인증된 사용자인지 확인하는 req 코드는 작성해야 한다.
- return할 객체는 schema에 정의한 객체와 같아야 한다. 이때 posts는 GraphQL이 읽지 못하는 데이터 포맷인 id, createdAt과 같은 필드이므로 그냥 반환할 수는 없다. map으로 배열 안의 모든 요소를 변환한다.
- 모든 게시물에 대해 동일한 새 객체를 반환하기로 하고 p._doc를 이용해 요소를 가져온다. _id는 p._id로 문자열로 덮어쓴다. 이렇게 각 게시물을 게시물 배열로 변환할 수 있다.

GraphiQL에서 테스트한다.
query {
    posts {
        posts {
            _id
            title
            content
        }
        totalPosts
    }
}
결과로 인증되지 않았다는 에러 메시지가 나오는데 토큰이 없으므로 정상이다.
===========================================================================================
434_'게시물 작성' 및 '게시물 가져오기' 쿼리 전송

프론트엔드의 Feed.js 파일의 loadPosts로 간다. 
Feed.js => loadPosts
    const graphqlQuery = {
      query: `
        {
          posts {
            posts {
              _id
              title
              content
              imageUrl
              creator {
                name
              }
              createdAt
            }
            totalPosts
          }
        }
      `
    };
- 위쪽의 posts가 쿼리 이름이다.
    fetch('http://localhost:8080/graphql', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + this.props.token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(graphqlQuery)
    };
- 이후 에러 핸들링도 기존 코드와 동일하게 맞춰준다.
    ...
    .then(resData => {
        if (resData.errors) {
          ...
        }
        this.setState({
          posts: resData.data.posts.posts.map(post => {
            return {
              ...post,
              imagePath: post.imageUrl
            };
          }),
          totalPosts: resData.data.posts.totalPosts,
          postsLoading: false
        });
    })
- 최종 게시물은 resData.data.posts.posts에서 확인할 수 있다. 왼쪽의 posts가 쿼리, 오른쪽은 쿼리의 반환 데이터에서 posts 필드임을 기억하자

해당 작업을 하며 GraphQL의 유연성이 제 역할을 하고 있음을 느낄 수 있다. 필요 없는 작성자 이메일 같은 정보는 제외하고 지금 필요한 게시물 데이터만 가져오고 있다. 
===========================================================================================
435_페이지화 추가

GraphQL의 페이지화는 어떻게 작동할까? posts 쿼리의 코드를 바꿔야하므로 schema.js에서 시작한다. 모든 게시물을 페이지화할 거니까 posts 쿼리에 인수가 필요하다. 접속한 페이지를 정의할 인수의 이름을 page라고 정한다. 타입은 Int이다.
schema.js =>
    type RootQuery {
        login(email: String!, password: String!): AuthData!
        posts(page: Int): PostData!
    }

resolver에서 페이지화를 실행할 수 있다. posts 리졸버에서 args를 page 속성으로 변경한다. 
resolvers.js =>
    posts: async function({ page }, req) {
        if (!req.isAuth) {
            ...
        }
        if (!page) {
            page = 1;
        }
        const perPage = 2;
        const totalPosts = await Post.find().countDocuments();
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate('creator');
        return { posts: posts.map(p => {
            return {...};
        }), totalPosts: totalPosts };
    }
- 먼저 page를 확인해 페이지 설정 여부를 확인한다. 페이지를 설정하지 않은 경우 page=1로 정의하고 특정 페이지를 지정하지 않으면 항상 페이지 1에서 시작한다.
- perPage 변수를 2로 정의한다. 이론적으로 이 부분을 인수로 가져올 수 있지만 하드코딩 한다. 대개 프론트엔드 상에서 다양한 페이지 크기 등을 제공하는 드롭다운으로 관리할 때의 작업을 간편하게 하기 위함이다. 
- 이제 skip, limit으로 페이지화를 설정할 수 있다.

이제 프론트엔드에서 페이지화 작업을 한다. 예제에 이미 작성되어있으므로 page 변수가 존재한다. 쿼리를 이용해 이 변수를 보내야 한다.
Feed.js => loadPosts
    const graphqlQuery = {
        query: `
            {
                posts(page: ${page}) {
                    ...
                }
            }
        `
    };
- page 값은 숫자이기 때문에 큰따옴표("")로 감쌀 필요가 없다.
    ...
    this.setState(prevState => {
        ...
        if (prevState.editPost) {
            ...
        );
        updatedPosts[postIndex] = post;
        } else {
            updatedPosts.pop();
            updatedPosts.unshift(post);
        }
        return {...};
    });
- 게시물이 두 개만 있을 때 새 게시물을 추가할 경우 세 번째 요소로 뜨지 않도록 하기 위해 updatedPosts.pop()을 추가한다. 요소 하나를 제거하고 새로운 요소를 앞에 띄울 것이다.
===========================================================================================
436_이미지 업로드

GraphQL은 JSON 데이터로만 작업할 수 있다. GraphQL을 통해 데이터를 가져올 수 있는 아티클이나 제3자 패키지는 몇 가지가 있다. 하지만 가장 깔끔한 방법은 이미지를 보낼 REST 엔드 포인트 등의 전형적인 엔드 포인트를 이용해 해당 엔드 포인트가 이미지를 저장하고 경로를 반환되게 하는 것이다. 그리고 이미지에 대한 경로로 또 다른 요청을 보내고 나머지 데이터는 GraphQL 엔드 포인트에 요청하는 코드를 app.js에 구현한다. 이 파일을 개별 파일로 아웃소싱할 수 있기 때문이다. 하지만 추가할 라우터는 하나뿐이므로 app.js에서 PUT 요청을 위한 라우터를 만들 것이다.
app.js => 
    app.put('/post-image', (req, res, next) => {
        if (!req.isAuth) {
            throw new Error('Not authenticated.');
        }
        if (!req.file) {
            return res.status(200).json({ message: 'No file povided.' });
        }
        if (req.body.oldPath) {
            clearImage(req.body.oldPath);
        }
        return res.status(201).json({ message: 'File stored.', filePath: req.file.path });
    });
    ...
- auth 미들웨어보다 아래에 작성해야 한다.
- multer를 사용하여 모든 파일을 추출하고 추출한 파일 정보로 파일 객체를 채워 넣는다. 만약 파일이 없다면 상태코드를 200으로 설정하고 메시지를 띄운다. 이것은 괜찮은 방법이다. 나중에 게시물을 편집할 때 새 이미지를 추가하거나 기존 이미지를 유지할 수 있는데 두 경우를 모두 다룰 수 있다.
- 기존 이미지가 있다면 지워야하므로 새 함수가 필요하다. feed.js에서 사용했던 clearImage 함수를 복사하여 util의 file.js에 붙여넣는다. 

백엔드에 추가한 경로를 이용해 프론트엔드에서 이 REST API 엔드포인트를 사용할 수 있다. finishEditHandler를 보면 기존 formData가 있는데 image만 남기고 제거한다.
Feed.js => finishEditHandler
    const formData = new FormData();
    formData.append('image', postData.image);
    if (this.state.editPost) {
        formData.append('oldPath', this.state.editPost.imagePath);
    }
    fetch('http://localhost:8080/post-image', {
        method: 'PUT',
        headers: {
            Authorization: 'Bearer ' + this.props.token
        },
        body: formData
    }).then(res => res.json())
    .then(fileResData => {
        const imageUrl = fileResData.filePath;
        ...
        const post = {
            ...
            imagePath: resData.data.createPost.imageUrl
        };
    })
- 편집 모드인지 확인하기 위해 if문을 사용한다.
- formData 설정을 완료했으니 graphqlQuery를 보내기 전에 /post-image로 또 다른 쿼리를 보낸다. 백엔드에서 PUT 메서드를 사용했으므로 맞춰준다. 기존 이미지를 대체하니까 PUT이 적합하다. 헤더에서 Content-Type을 설정하지 않아야 바이너리 데이터를 자동으로 전송할 수 있다.
- 모든 게시물을 로드할 때도 imagePath를 설정했었다. 그러므로 게시물을 편집할 때도 imagePath 필드를 설정해야 한다.
- 이 fetch 요청이 먼저 이뤄질 것이고 완료되면 응답을 받는다. res.json으로 body를 분석하고 then에는 fileResData에서 filePath를 추출한다. 엔드 포인트에서 filePath 키를 설정했기 때문에 가능하다. 이후 then 블록 전까지 코드를 이 then 블록 안으로 옮긴다.
===========================================================================================
438_단일 게시물 보기

스키마에서 새로운 쿼리를 생성한다.
schema.js =>
    type RootQuery {
        ...
        post(id: ID!): Post!
    }
- 가져올 게시물의 id에 ID를 입력해서 Post로 게시물을 반환한다.

리졸버를 추가한다.
resolvers.js =>
    post: async function({ id }, req) {
        if (!req.isAuth) {
            ...
        }
        const post = await Post.findById(id).populate('creator');
        if (!post) {
            ...
        }
        return {
            ...post._doc,
            _id: post._id.toString(),
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString()
        }
    }
- populate를 입력해 ID가 아닌 사용자 데이터도 확인한다.

프론트엔드의 SinglePost.js 파일로 간다.
SinglePost.js =>
    const graphqlQuery = {
      query: `{
          post(id: "${postId}") {
            ...
          }
        }
      `
    };
    fetch('http://localhost:8080/graphql', {
        ...
    })
    .then(res => {
        return res.json();
    })
    .then(resData => {
        if (resData.errors) {
            throw new Error('Fetching post failed.');
        }
        this.setState({
            title: resData.data.post.title,
            author: resData.data.post.creator.name,
            image: 'http://localhost:8080/' + resData.data.post.imageUrl,
            date: new Date(resData.data.post.createdAt).toLocaleDateString('en-US'),
            content: resData.data.post.content
        });
    })
- 기존의 논리와 동일하게 작성한다. 확인하려는 필드인 creator.name, title, imageUrl 뿐만 아니라 createdAt, content까지 작성한다.
- 응답을 위해 스키마를 구조를 맞춰야 한다. data가 있고 쿼리 이름인 post가 있다. 그리고 post가 가진 다양한 속성에 접근했으므로 resData.data.post.title 등으로 접근한다.
===========================================================================================
439_게시물 업데이트

백엔드의 스키마에서 새 뮤테이션을 추가한다. 게시물 편집은 명백한 뮤테이션이다.
schema.js =>
    type RootMutation {
        ...
        updatePost(id: ID!, postInput: PostInputData): Post!
    }

이어서 리졸버를 추가한다.
resolvers.js =>
    updatePost: async function({id, postInput}, req) {
        if (!req.isAuth) {
            ...
        }
        const post = await Post.findById(id).populate('creator');
- updatePost를 반환할 때 populate('creator')를 작성해서 사용자 전체 데이터를 확인한다.
        if (!post) {
            ...
        }
        if (post.creator._id.toString() !== req.userId.toString()) {
            ...
            error.code = 403;
            throw error;
        }
- 게시물을 만든 사람과 편집하려는 사람이 일치하는지 확인한다.
        const errors = [];
        if (validator.isEmpty(postInput.title) || 
        !validator.isLength(postInput.title, { min : 5 })) {
            ...
        }
        if (validator.isEmpty(postInput.content) || 
        !validator.isLength(postInput.content, { min : 5 })) {
            ...
        }
        if (errors.length > 0) {
            ...
        }
- 입력 데이터 검증도 수행한다.
        post.title = postInput.title;
        post.content = postInput.content;
        if (postInput.imageUrl !== 'undefined') {
            post.imageUrl = postInput.imageUrl;
        }
- 사용자가 새 이미지를 선택했는지 확인한다. 
        const updatedPost = await post.save();
        return {...};
    }
- 클라이언트에게 보내는 응답 코드 작성도 완료한다.

프론트엔드의 finishEditHandler로 간다.
Feed.js => finishEditHandler
    const imageUrl = fileResData.filePath || 'undefined';
- filePath가 설정되지 않았다면(새 이미지를 선택하지 않았다면) undefined로 설정한다. undefined일 경우 이전 파일 경로를 유지하는 방법을 써도 된다. 백엔드에서 텍스트 형태의 'undefined'를 검사하고 있기 때문에 필요하다.
    if (this.state.editPost) {
        graphqlQuery = {
            query: `
                mutation {
                    updatePost(id: ${...}, postInput: {title: ${...}, content: ${...}, imageUrl: ${...}}) {
                        ...
                    }
                }
            `
        };
    }
    ...
    let resDataField = 'createPost';
    if (this.state.editPost) {
        resDataField = 'updatePost'
    }
    const post = {
        _id: resData.data[resDataField]._id,
        title: resData.data[resDataField].title,
        content: resData.data[resDataField].content,
        creator: resData.data[resDataField].creator,
        createdAt: resData.data[resDataField].createdAt,
        imagePath: resData.data[resDataField].imageUrl
    };
- createPost가 아닌 editPost로 보낼 수도 있으므로 편집 모드를 확인한다. 이때 updatePost 뮤테이션이 타깃이다.
- 응답으로부터 데이터를 추출하는 방법을 변경해야 한다. 기존에는 createPost에 접근하지만 updatePost에 요청을 보내기 때문에 응답 데이터를 저장하는 필드의 이름은 updatePost가 되어야 한다. 그러므로 새로운 변수를 추가해서 편집 모드를 확인하고 업데이트 모드라면 데이터를 추출하는 필드는 updatePost가 되도록 한다.
- resDataField의 값을 사용해 data 객체에 있는 해당 값의 이름으로 속성에 동적으로 접근한다.
===========================================================================================
440_게시물 삭제

역시나 스키마에서 뮤테이션을 추가한다. 
schema.js =>
    type RootMutation {
        ...
        deletePost(id: ID!): Boolean
    }
- 삭제해야 하는 게시물의 id를 얻고 성공 여부를 나타내는 불리언을 반환한다.

리졸버를 추가한다.
resolvers.js =>
    deletePost: async function({ id }, req) {
        if (!req.isAuth) {
            ...
        }
        const post = await Post.findById(id);
        if (!post) {
            ...
        }
        if (post.creator.toString() !== req.userId.toString()) {
            ...
        }
- 중요한 부분이다. populate로 creator 필드를 채우지 않아서 creator는 _id를 가진 객체가 아니라 그 자체가 id이다. 작성자를 변경하려면 populate를 호출해야 한다.
        clearImage(post.imageUrl);
- post.imageUrl이 서버에서 이미지 경로이다.
        await Post.findByIdAndRemove(id);
        const user = await User.findById(req.userId);
        user.posts.pull(id);
        await user.save();
        return true;
    }
- 게시물을 삭제하면 사용자의 게시물 목록에서도 삭제해야 한다.
- true를 return 하는 이유는 스키마에서 불리언을 반환한다고 정의했기 때문이다. try-catch 문으로 랩핑해서 실패하면 false를 반환할 수 있는데 코드를 단순히 하기 위해 하지 않았다.

프론트엔드로 간다.
Feed.js => deletePostHandler
    deletePostHandler = postId => {
        this.setState({ postsLoading: true });
        const graphqlQuery = {
        query: `
            mutation {
                deletePost(id: "${postId}")
            }
        `
        }
        fetch('http://localhost:8080/graphql', {
        method: 'POST',
            ...
        })
        .then(res => {
            return res.json();
        })
        .then(resData => {
            if (resData.errors) {
                throw new Error('Deleting the post failed.');
            }
            this.loadPosts();
        })
    };
- 중첩된 객체가 없으므로 자세한 데이터를 얻을 수는 없다.
- url을 설정하고 메서드는 항상 POST, 토큰과 헤더를 추가하고 쿼리를 입력한 JSON 데이터를 body로 설정한다.
- 이전처럼 오류를 처리하지 않고 분석한 응답에서 처리하는데 오류가 발생하면 응답에서 오류 객체를 가지기 때문이다.
===========================================================================================
442_사용자 상태 관리

쿼리와 뮤테이션이 필요하다. 쿼리는 상태 획득을 위해 추가한다.
schema.js =>
    type RootMutation {
        ...
        updateStatus(status: String): User!
    }

    type RootQuery {
        ...
        user: User!
    }
- 현재 로그인한 사용자에 인수 없이 일반적인 user 쿼리를 추가한다. 그리고 User 객체를 반환한다.
- 뮤테이션에 updateStates를 추가할건데 사용자 변경을 신경 쓰지 않으면 updateUser 뮤테이션을 추가할 수 있다. 앱에 이런 기능을 설계하지 않아서 상태에만 특별 뮤테이션을 추가할 수 있다. 기능이 있다면 제네릭 접근법을 사용할 수 있다. 지금은 문자열인 상태를 얻고 업데이트된 사용자를 반환한다.

리졸버를 추가한다.
resolvers.js =>
    user: async function(args, req) {
        if (!req.isAuth) {
            ...
        }
        const user = await User.findById(req.userId);
        if (!user) {
            ...
        }
        return { ...user._doc, _id: user._id.toString() };
    },
- 이론적으로 관심 있는 사용자의 모든 데이터를 가져올 수 있지만 상태만 가져오는 방법으로 구현하였다.
    updateStatus: async function({status}, req) {
        if (!req.isAuth) {
            ...
        }
        const user = await User.findById(req.userId);
        if (!user) {
            ...
        }
        user.status = status;
        await user.save();
        return { ...user._doc, _id: user._id.toString() };
    }
- 사용자가 있으면 인수로 갖는 새로운 상태에 user.status를 설정하고 갱신한 사용자를 저장하기 위해 user.save를 await 한다. 그리고 프론트엔드에 return 한다.

프론트엔드로 간다.
Feed.js => componentDidMount
    const graphqlQuery = {
        query: `
            {
                user {
                    status
                }
            }
        `
    };
    fetch('http://localhost:8080/graphql', {
        ...
    })
    .then(res => {
        return res.json();
    })
    .then(resData => {
        if (resData.errors) {
            ...
        }
        this.setState({ status: resData.data.user.status });
    })
- data가 있고 쿼리 이름인 user가 있다는 것을 명심하자. 쿼리 이름은 항상 데이터가 저장된 곳이다. 그 이후에 status 필드가 있다.
Feed.js => statusUpdateHandler
    event.preventDefault();
    const graphqlQuery = {
        query: `
            mutation {
                updateStatus(status: ${this.state.status}) {
                    status
                }
            }
        `
    };
    fetch('http://localhost:8080/graphql', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + this.props.token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
         return res.json();
      })
      .then(resData => {
            if (resData.errors) {
                ...
            }
            console.log(resData);
      })

===========================================================================================
443_변수 사용하기

한 가지 최적화 방법이 있다. GraphQL 쿼리에 동적 값을 입력할 때마다. 예를 들어 page 처럼 현재 보간 구문을 사용하고 있다. ${}를 이용해 문자열 리터럴에 값을 주입하고 있다. 하지만 변수를 GraphQL 쿼리에 추가하는 게 추천 방식은 아니다. 
Feed.js => loadPosts
    const graphqlQuery = {
        query: `
            query FetchPosts($page: Int) {
                    posts(page: $page) {
                        ...
                    }
                }
            `,
            variables: {
                page: page
            }
    };
뮤테이션은 mutation을 추가해야 했다. 쿼리는 추가할 필요가 없는데 만약 query를 추가했다면 오류가 생겼을 것이다. 이제 다른 것도 추가할 것이므로 query를 추가한다. 이 쿼리에 이름을 부여한다. 여기선 FetchPosts이다.
이제 이 이름으로 쿼리가 사용할 변수를 지정하기 위해 쿼리 뒤에 소괄호를 추가한다. 변수를 $로 생성하는데 {}는 필요없다. 그리고 변수 이름도 원하는대로 정한다.
중요한 것은 query FetchPosts($page: Int) 이것은 GraphQL 구문으로, 서버에서 분석된다. 클라이언트에서 실행하는 자바스크립트가 아니다. GraphQL 서버에 내부 변수를 사용하는 쿼리가 있음을 말해준다.
자바스크립트의 변수를 GraphQL의 변수에 넣기 위해 쿼리 객체에 두 번째 속성을 추가한다. 위의 쿼리 이름이 query인 것처럼 variables 이름을 정확히 써야 한다. 위의 query는 쿼리 표현이고 variables는 쿼리에 입력한 변수에 값을 할당하는 객체이다.
page가 두 개인데 콜론 왼쪽의 page는 GraphQL에서 사용하는 내부 변수를 가리킨다. 오른쪽의 page는 자바스크립트 변수를 가리킨다.

새 게시물을 추가하면 정상적으로 작동한다. 이제 모든 쿼리를 같은 방식으로 대체할 수 있다.
===========================================================================================
444_페이지화 버그 수정

게시물이 2개만 있을 때 새로운 게시물을 추가하면 Next 버튼이 보이지 않는다. Node.js와는 관계 없지만 고쳐본다. 새로운 게시물을 생성하고 기존 게시물에 추가하는 코드로 간다. else 블록을 보면 최종적으로 한 번에 2개의 항목만 렌더링하고 리스트 초반부에 새 게시물을 추가한다. 여기에서 전체 게시물의 개수를 증가시키도록 처리해야 한다.
Feed.js => finishEditHandler
    this.setState(prevState => {
          let updatedPosts = [...prevState.posts];
          let updatedTotalPosts = prevState.totalPosts;
          if (prevState.editPost) {
                const postIndex = prevState.posts.findIndex(
                p => p._id === prevState.editPost._id
                );
                updatedPosts[postIndex] = post;
          } else {
                updatedTotalPosts++;
                if (prevState.posts.length >= 2) {
                updatedPosts.pop();
                }
                updatedPosts.unshift(post);
          }
          return {
            ...
            totalPosts: updatedTotalPosts
          };
    });
- updatedTotalPosts를 추가한다. 그리고 else 블록의 논리를 변경한다.