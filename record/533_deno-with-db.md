534_CORS 에러 처리

프론트엔드 앱과 deno 백엔드 앱을 준비한다. 포트 넘버가 겹치지 않도록 한다.
서버를 실행하고 브라우저로 접속하면 CORS 에러가 발생할 것이다. 예전에도 배웠지만 다시 복습하자.

Understanding CORS

The server can set specific response headers to allow this kind of communication

Server A: some-page.com (Frontend App e.g. React SPA)  Server B: My-api.com (RESP API)
                                        -------------------->
                                By default, browsers prevent GET, POST, PATCH etc. if frontend and backend are not on the same server
Cross Origin Resource Sharing 의 약자로 보안 메커니즘이며 브라우저에 의해 서버 A가 서버 B에 요청만 보내면 데이터를 받기보다 서버 B가 우선 공유를 허락해야 한다.
서버 A에서 실행되는 프론트엔드 앱인 React 단일 페이지 앱이 localhost:3000에서 실행되고 백엔드 앱 REST API가 서버 B에서 실행 중일 때 A에서 B로의 통신이 직접적으로 이루어지지 않는다. 프론트엔드와 백엔드 서버가 다르다면 디폴트로 브라우저가 GET, POST, PATCH 등의 요청을 막는다. 이때 로컬 호스트에 포트 번호만 달라도 다른 서버로 간주된다.
각각의 서버가 데이터를 공유하는 것을 막는게 디폴드 보안 메커니즘이지만 브라우저에 접근을 허용한다고 알려줄 수 있다. 데이터를 호스트하는 서버에 해당하는 설정을 하면 된다. 즉, 백엔드인 REST API에 프론트엔드 앱에 보내는 응답에 특정 응답 헤더를 설정해서 프론트엔드 앱을 지원하는 브라우저에 해당 데이터를 받아도 된다고 알려주면 다음 단계로 진행된다.
단지 브라우저 보안 메커니즘이라 Postman 등으로 데이터를 가져오고 저장할 수 있다. CORS 문제와 관련이 없기 때문이다.

Deno에서 어떻게 요청을 보낼 수 있을까? 백엔드 코드에 새 미들웨어를 추가해서 나가는 모든 응답에 올바른 헤더가 부착되었는지 확인한다. ctx 객체의 response 객체에 접근해서 headers 객체에 접근한다. 이 객체는 set 메서드를 사용해 나가는 응답에 대해 새로운 헤더를 설정할 수 있다. 나가는 응답에 세 가지의 헤더를 설정해야 한다.
    app.use(async (ctx, next) => {
        ctx.response.headers.set('Access-Control-Allow-Origin', '*');
        ctx.response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        ctx.response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
        await next();
    });
- Access-Control-Allow-Origin: 리소스에 접근이 허용된 다른 도메인을 제어한다. *로 설정하면 모든 도메인이 리소스에 접근할 수 있다.
- Access-Control-Allow-Methods: 백엔드로 배는 요청에 사용할 HTTP 메서드를 제어한다.
- Access-Control-Allow-Headers: 프론트엔드가 데이터를 요청할 때 어떤 헤더를 설정할지 결정하니까 Content-Type 헤더를 허용한다. 프론트엔드 앱의 소스 코드를 보면 PUT, POST 요청에 Content-Type을 application/json으로 설정했었다. 이러면 Deno 서버로 보내는 요청에 있는 헤더를 보고 Deno와 Oak 프레임워크에 요청에 부착된 데이터가 JSON 형식임을 알 수 있다. 그러면 요청 본문에 접근할 때 백엔드의 Oak가 자동으로 분석할 것이다.
- 다음 미들웨어에 도달해야 하므로 next를 호출하는데 지난 번에 배웠듯이 await을 추가한다.
==========================================================================================
535_Deno와 MongoDB 연결

MongoDB 계정 생성은 생략한다.
Deno 앱에 연결해야 하는데 MongoDB용 제3자 모듈을 사용한다. mongo 모듈이 MongoDB DB에 연결하고 작업하는 걸 용이하게 만들어준다. 내장 Rust MongoDB 라이브러리이다. Rust는 프로그래밍 언어로 Deno가 베이스로 사용하는 언어다. 

URL을 복사해서 DB에 연결할 부분에 사용한다. helpers 폴더를 생성하고 db_client.ts 파일을 생성한다. 공식 Deno Style Guide는 파일 이름에 - 대신 _를 사용하기를 권장하고 있다. 사실상 별 다른 것은 없지만 가이드를 따라서 _를 사용했다.
    import { Database, MongoClient } from "https://deno.land/x/mongo/mod.ts";

    const client = new MongoClient();
    await client.connect(MONGODB.url);
    db = client.database('todos');
- 불러온 MongoClient를 생성하고 client 객체를 이용해 URL에 연결한다. URL에 username, password 부분을 채워넣고 dbname은 제거한다.
- 그럼 클라이언트가 해당 URL에 연결할 테니 client.database로 특정 데이터베이스에 연결한다. 여기선 todos 이다.

파일 밖에서 DB를 사용할 수 있게 해야한다. 새로운 function을 생성하고 return 한다.
    let db: Database;

    export async function connect() {
        const client = new MongoClient();
        await client.connect(MONGODB.url);
        db = client.database('todos');
    }

    export function getDb() {
        return db;
    }
- 이 방식을 이용하는 이유는 function connect에 다른 기능을 랩핑할 예정이기 때문이다. 예를 들어 connect()와 getDb() 둘 다 내보내서 app.ts에서 connect()를 호출하고 todos.ts에서 getDb()를 호출해 DB에 접근하기 위함이다.
- 해당 패턴을 사용하려면 db라는 변수를 생성하고 Database 유형으로 지정하고 MongoDB 라이브러리인 mod.ts에서 불러오는 코드에도 Database 타입을 지정한다.

이제 app.ts에서 connect를 호출한다.
    import { connect } from './helpers/db_client.ts';
    connect();
todos.ts에서는 getDb를 불러온다.
    import { getDb } from "../helpers/db_client.ts";

이제 getDb 함수를 호출해서 DB에 접근하거나 데이터를 저장하고 가져오는 작업을 할 수 있다.
==============================================================================================
536_MongoDB 클라이언트 모듈 사용

    import { ObjectId } from "https://deno.land/x/mongo/mod.ts";

    router.get('/todos', async (ctx) => {
        const todos = await getDb().collection('todos').find().toArray();
        const transformedTodos = todos.map(
            (todo) => {
                return { id: todo._id.toString(), text: todo.text };
            }
        );
        
        ctx.response.body = { todos: transformedTodos };
    });
- find 메서드를 호출하여 todos 컬렉션에 있는 모든 요소를 찾는다. find는 프로미스를 반환하므로 await할 수 있고 todos를 전달받는다. 이 todos는 특정 MongoDB 형식으로 존재한다. 객체이지만 최종적으로는 _id 필드를 가지는 객체이며 MongoDB에 의해 자동으로 추가되고 MongoDB에서 사용하는 특별한 타입인 ObjectId 타입이 될 것이다. 또한 우리가 설정한 text 필드를 갖는다. 그렇게 생긴 개별 문서의 배열을 받게 된다. { _id: ObjectId(), text: '...' }[]
- 이를 사용하기 위해 변형하는 편이 좋다. transformedTodos는 map을 호출하는 todos가 된다. 이는 각 todo에 대해 함수를 실행하며 이후 모든 todo를 새로운 객체로 변형한다. return에서 이후 새로 변형된 객체를 반환한다. 
* 강의에서는 find()만 호출하였으나 에러를 해결하지 못하여 변경
* map 메서드에서 todo의 타입을 지정하면 에러가 발생하여 toArray()를 호출해서 배열로 받고 타입을 지정하지 않음
* 현재 _id.$oid 필드가 존재하지 않고 toString()으로 대체된 것으로 보임
- 마지막으로 client에 todos를 반환한다.

    interface Todo {
        id?: string;
        text: string;
    }

    router.post('/todos', async (ctx) => {
        const value = await ctx.request.body().value;
        const newTodo: Todo = {
            text: value.text,
        };

        const id = await getDb().collection('todos').insertOne(newTodo);
        newTodo.id = id.toString();

        ctx.response.body = { message: 'Created todo!', todo: newTodo };
    });
- 더 이상 id 필드를 직접 생성하지 않으므로 interface에서 id 뒤에 ?를 붙여 선택적 요소로 변경한다. id 없이 todo 객체를 생성해도 TS가 에러로 탐지하지 않는다.

* 이후 실행하면 실행을 위해 많은 권한을 필요로 하는 명령어들이 나오지만 현재는 전부 필요가 없다. --allow-net 으로 네트워크 작업만 허용해준다.
==============================================================================================
537_Deno, MongoDB CRUD 작업 마무리

    router.put('/todos/:todoId', async (ctx) => {
        const tid = ctx.params.todoId!;
        const value = await ctx.request.body().value;

            await getDb()
                .collection('todos')
                .updateOne({ _id: ObjectId(tid) }, { $set: { text: value.text } });

        ctx.response.body = { message: 'Updated todo' };
    });

    router.delete('/todos/:todoId', async (ctx) => {
        const tid = ctx.params.todoId!;
        
        await getDb().collection('todos').deleteOne({ _id: ObjectId(tid) });

        ctx.response.body = { message: 'Deleted todo' };
    });
- 업데이트, 삭제하고자 하는 문서의 식별을 위해 id가 필요하다. 이때 id는 MongoDB에서 내부적으로 사용하는 ObjectId가 되어야 하므로 mongo 모듈에서 임포트한 ObjectId에 문자열 id를 전달하여 객체로 변환한다.
* 현재는 에러가 발생하여 수정이 필요함
- 이때 ObjectId는 항상 스트링을 원하며 tid는 정의되지 않을 수 있다. TS는 params에서 todoId를 찾을 수 있을지 확실하게 알지 못하기 때문이다. 우리는 코드를 작성했으니 라우트에 접근하면 todoId가 있다는 사실을 알고 있으므로 todoId에 !를 추가하여 undefined로 설정되지 않도록 한다.
- 두 번쨰 인수로 업데이트 지침을 추가한다. $set으로 새 값을 설정하려고 하는 키-값 쌍을 정의한다.

이렇게 Deno의 mongo 제3자 모듈의 도움을 받아 DB에 연결하는 방법을 배웠다.