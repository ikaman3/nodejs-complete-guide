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