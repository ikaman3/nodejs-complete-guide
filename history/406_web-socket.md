406_Web Socket

웹 소켓은 실시간 웹 서비스를 구현할 수 있게 하는 프로토콜의 일종이다. 이건 무슨 의미이고, Node App에 어떻게 실시간 통신을 추가할 수 있을까? 

How It Currently Works

             Client
   1.Requst |     ^ 2.Response 
            |     |
            |     |
            |     |
            |     |
            Server 

지금까지 구축한 앱은 어떻게 작동하는지 파악하자. 여기에는 REST API뿐만 아니라 그전에 구축했던 쇼핑몰도 포함이다. 일반적인 Node 혹은 Node Express 앱은 어떻게 작동할까?
클라이언트와 서버가 있다. 클라이언트는 브라우저나 휴대폰 등에 해당한다. 서버는 물론 우리가 구축하는 Node 앱이다. 지금까지 항상 클라이언트에서 요청을 발신했었다. 서버에서 이 요청을 기다리고 다양한 종류의 요청을 처리하기 위해 라우트를 설정했다. 서버에서 어떤 작업을 한 뒤에는 클라이언트로 응답을 돌려보냈다. 즉 먼저 요청한 뒤 응답이 이루어졌다. 
지금까지 이 앱, 그리고 대부분의 웹 앱이 작동한 방식이다. 인터넷에 존재하는 많은 리소스들이 이 풀 접근법을 통해 사용될 수 있으므로 이건 양호한 패턴에 해당한다. 즉, 클라이언트에서 정보를 당겨오는 것이다. 서버에 무언가를 원한다고 알리는 것이다. 매우 일반적인 접근법이다.

하지만 가끔은 다른 요구사항이 생긴다. 서버에서 클라이언트로 뭔가를 보내고 싶다면? 즉, 무슨 일이 생겨 클라이언트에게 알리고 싶다면 어떻게 해야할까. 채팅 앱을 구축하는 중에 사용자 A가 PC 내지는 휴대폰으로 사용자 B에게 메시지를 보낸다고 하자. 당연히 같은 기기를 공유하고 있지 않다. 완전히 동떨어진 두 장소에 존재할 수도 있다. A는 메시지를 저장하는 서버로 요청을 보내고, 서버는 DB에 메시지를 저장한 뒤 A에게 응답을 반환할 수 있다. 
그러나 A와 채팅 중인 B는 메시지를 받기 위해 서버에 요청을 보내지 않으며 그런 일이 발생할 가능성은 낮다. 매 초 새로운 메시지가 있는지 확인하는 요청을 보내는 등 몇 가지 패턴을 사용할 수는 있지만 그렇게 되면 대부분의 요청은 새로운 메시지를 담지 않는데도 서버에 요청으로 압박을 가하게 될 것이다. 
따라서 그 보다는 B에게 새 메시지를 푸시하는 방법이 나을 테고 그 내용을 배울 것이다.

WebSockets instead of Http

            Http   ===============>   WebSockets
                Established via Http
             Client                   Client
   1.Requst |     ^ 2.Response          ^
            |     |                     |
            |     |                     | Push data
            |     |                     |
            |     |                     |
            Server                    Server
    You can use both together in one and the same Node App

서버에서 뭔가 변경되어서 클라이언트에게 능동적으로 알리고 싶다면 어떻게 할까? 그럼 Http 대신 웹 소켓을 사용한다. 지금까지 Http라는 프로토콜로 요청을 전달하고 응답을 받았다. 웹 소켓은 Http를 토대로 구축된다. Http 프로토콜을 웹 소켓 프로토콜로 업그레이드 하는 Http 핸드셰이크를 사용한다. 그리고 웹 소켓 프로토콜은 단순히 데이터 교환에 대해 이야기할 뿐이다. 즉, 이 프로토콜은 능동적으로 관리할 필요가 없다. 브라우저와 서버는 프로토콜을 통해 통신하며 사용되는 프로콜이 통신의 방식을 정의한다. Http의 경우 요청과 응답이다. 웹 소켓은 푸시 데이터 내지는 둘 다에 해당한다. 
또한 클라이언트에서 서버로 데이터를 보내는 것도 여전히 가능하지만 가장 중요한 것은 서버에서 클라이언트로 데이터를 푸시할 수 있다는 점이다. 그리고 하나의 Node App에서 이 둘을 함께 사용하게 된다. 즉, 웹 소켓으로 앱을 구현할지 Http로 구현할지 결정하는 게 아니다. 요청 응답 패턴을 사용할 곳은 그 외에도 많이 존재하기 때문이다. 예를 들어 메시지를 발신하거나 사용자를 생성하는 경우 브라우저에서 서버로 정보를 보내는 연산에 해당한다. 따라서 이 경우에는 요청 응답 시나리오가 완벽히 적용된다. 그러나 사용자에게 알리고 싶은 능동적인 알림이 있다면 웹 소켓을 포함하면 좋을 것이다.
==========================================================================================
407_웹 소켓 솔루션-개요

웹 소켓 관련 패키지를 다양하다. 가장 유명한 패키지는 socket.io이다. socket.io는 웹 소켓을 사용하며 해당 프로토콜에 관한 많은 편의 기능을 제공하여 클라이언트가 서버에 들어간 웹 소켓 채널을 아주 쉽게 생성하고 사용할 수 있도록 돕는 패키지다. 즉, socket.io가 웹 소켓 기술과 프로토콜을 사용하고 배후에서 설정을 대신해 준다는 점을 파악하자. 그러나 웹 소켓의 사용에 있어 socket.io가 필수인 것은 아니다. 
==========================================================================================
408_서버에서 socket.io 설정

socket.io를 쓰려면 서버, 클라이언트 모두 추가해야 한다. 즉 Node App, React App 둘 다 올리는 이유는 클라이언트 서버가 웹 소켓을 통해 소통하므로 해당 커뮤니케이션을 양쪽 엔드에 구축해야 하기 때문이다. 
우선 백엔드에서 시작한다.
    npm install --save socket.io

그리고 app.js로 간다. 서버를 시작할 때 구동되는 첫 번째 파일에서 노출하고자 하는 socket.io 연결을 설정해야 한다. 일반 http 요청에 대해 라우트를 설정하는 것과 동일하게 socket.io 채널도 설정하는 것이 가능하다. socket.io는 웹 소켓이라는 다른 프로토콜을 사용하므로 웹 소켓 요청은 브라우저에서 기본값으로 보내는 일반 http 요청과 간섭하지 않는다는 것을 기억하자.
    mongoose.connect(MONGODB_URI).then(result => {
        const server = app.listen(8080);
        const io = require('socket.io')(server, {
            cors: {
              origin: '*',
              methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
              allowedHeaders: ['Content-Type', 'Authorization']
            }
        });
        io.on('connection', socket => {
            console.log('Client connected');
        });
    })
- DB에 접속해서 서버를 시작한 뒤에 socket.io 연결을 구축 내지는 설정하는 게 좋다.
- io라는 상수에 socket.io 패키지를 임포트한다. 이 패키지는 생성한 서버를 인수로 요구하는 함수를 노출시킨다. 위의 listen 메서드는 사실 새로운 노드 서버를 반환하여 상수에 저장할 수 있게 해준다. 이 서버를 받아서 패키지에 전달한다. 이렇게 하면 socket.io가 설정되고 이 서버가 http를 사용하므로 해당 http 서버를 사용해 http 프로토콜을 기반으로 하는 웹 소켓 연결을 구축하게 된다.
- 이제 웹 소켓을 배후에서 모두 설정해주는 io, socket.io 객체를 생성했고 이제 사용할 수 있다. 이걸 사용해서 몇몇 이벤트 리스너를 정의한다. 새로운 연결을 대기하여 새 클라이언트가 연결될 때마다 클라이언트를 가져오는 특정 함수, 소위 말하는 소켓을 실행할 수 있고 이 소켓은 인수로서 연결된다. 이 함수는 새로운 클라이언트가 연결할 때마다 실행되고 한 번이 아니라 필요한 횟수, 즉 클라이언트 연결 횟수만큼 실행된다. 
* 패키지 임포트 함수의 두 번째 인수로 CORS 에러를 해결하는 헤더를 설정해야 한다.

이제 대기 중인 소켓 연결 내지는 포트가 확보되었다.
==========================================================================================
409_클라이언트에서 연결 설정

프론트엔드 서버에서도 패키지를 설치한다.
    npm install --save socket.io-client

Feed.js에서 패키지를 임포트한다. 이름은 자유롭게 해도 된다.
    import openSocket from 'socket.io-client';
- 이 상수는 새 소켓을 여는 함수가 된다.

이로써 클라이언트에도 함수가 노출되며 이 함수를 통해 연결할 수 있다. componentDidMount 함수로 간다. 포스트들을 로드한 뒤에 openSocket 함수를 호출한다. 
    openSocket('http://localhost:8080');
- socket.io 서버를 구축했던 서버 url을 정의한다. 물론 백엔드 서버 주소이다. 웹 소켓이 토대로 사용했기 때문에 http를 사용한다는 걸 유의하자.
==========================================================================================
410_실시간 잠재적 오류 식별

A로 새 포스트를 생성했을 때 B도 즉시 확인할 수 있다면 좋을 것이다. 클라이언트와 백엔드에 코드를 좀 추가한다. 클라이언트의 compnentDidMount 함수 이후 loadPosts 이전에 새로운 함수인 addPost를 추가한다.
    addPost = post => {
        this.setState(prevState => {
            const updatedPosts = [...prevState.posts];
            if (prevState.postPage === 1) {
                if (prevState.posts.length >= 2) {
                    updatedPosts.pop();
                }
                updatedPosts.unshift(post);
            }
            return {
                posts: updatedPosts,
                totalPosts: prevState.totalPosts + 1
            };
        });
  };
- 게시물에 관한 데이터를 인수로 가져온다. 그리고 해당 포스트를 화면으로 렌더링한다. 리액트의 setState라는 기능을 활용해서 리액트 앱이 사용한 기존의 데이터를 새로운 포스트로 업데이트한다. 올바른 위치에 삽입하도록 페이지화도 신경쓴다.

리액트 기능을 사용하여 브라우저 페이지를 새로고침하지 않아도 된다. 기존의 DOM을 변경한 것이다. addPost는 만들었으나 호출하진 않는다. 다른 클라이언트에서 새 포스트를 생성할 때마다 호출할 수 있게 만들어야 한다. 
이를 위해 Node로 돌아가서 새 포스트가 생성될 때 실행하는 코드를 찾는다. feed 컨트롤러의 createPost 함수다. 여기서 socket.io를 사용하여 연결된 모든 클라이언트에게 새 포스트에 대해 알리도록 한다. 그러려면 app.js에 현재 설정한 연결을 공유해야 한다.
==========================================================================================
411_파일 간에 IO 인스턴스 공유

노출된 동일한 연결을 관리하는 하나의 동일한 io 객체의 재사용을 위해 루트 디렉토리에 socket.js 파일을 생성한다.
이 파일에서 io라는 변수를 생성하고 객체에 해당하는 exports 구문으로 내보낸다. 이 객체는 두 개의 메서드, 두 개의 함수를 갖는다.
    let io;
    module.exports = {
        init: httpServer => {
            io = require('socket.io')(httpServer, {
                cors: {
                origin: '*',
                methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
                allowedHeaders: ['Content-Type', 'Authorization']
                }
            });
            return io;
        },
        getIO: () => {
            if (!io) {
                throw new Error('Socket.io not initialized.');
            }
            return io;
        }
    };
- init 메서드는 Node.js 구문에서 함수를 정의할 때 일반 객체처럼 키를 왼쪽에 두고 콜론과 값을 입력하는데 값은 함수이며 httpServer를 인수로 수신한다. 이 화살표 함수 본문에서 socket.io를 app.js에서 한 것처럼 require한다. 결과물은 io 객체가 되며 io 변수에 저장된다. 그리고 io를 반환한다.
- 다른 함수도 추가한다. 이름은 상관없다. 인수는 필요없지만 io의 존재 여부를 확인한다.

이렇게 이 파일에서 연결을 관리하고 이 파일을 앱 내부에서 feed.js 컨트롤러를 비롯한 io와의 상호작용이 필요한 곳에 어디든지 임포트할 수 있다.

app.js에서는 socket.js 파일을 받고 방금 정의한 함수인 init을 호출한다. 이 함수에 서버를 전달해야 하므로 server는 여전히 전달한다.
    const io = require('./socket').init(server);
    io.on('connection', socket => {
         console.log('Client connected');
    });
==========================================================================================
412_POST 요청 추가 사항 동기화

io 연결 공유 방법을 확보했으니 백엔드의 컨트롤러에서 사용한다.
    const io = require('../socket');

createPost 내부에서 포스트 생성 이후에 사용한다. 즉, 응답을 보내기 직전이 될 테고 응답은 포스트를 생성한 사용자에게 돌아간다. 응답을 보내야 하니 이건 변하지 않는다. 추가로 모든 사용자에게 알리기 위해 io를 사용한다. 설정한 io 객체 내지 연결을 가져오기 위해 getIO를 호출한다.
        io.getIO().emit('posts', { 
            action: 'create', 
            post: {...post._doc, creator: {_id: req.userId, name: user.name}}
        });
- socket.io 패키지에서 제공하는 몇 가지 메서드가 있는데 emit, broadcast이다. 차이점은 emit은 연결된 모든 사용자에게 메시지를 발신하고 broadcast는 이 요청이 발신된 사용자 외의 모든 사용자에게 발신한다.
- 이벤트 이름은 자유롭게 정한다. 여기서는 'posts'이다.
- 다음으로 발신할 데이터를 정의한다. 이것도 자유롭다. 일반적으로 자바스크립트 객체다. 무슨 일이 일어났는지 클라이언트에게 알리기 위해 action 키를 정의한다. 그리고 생성된 포스트는 post 키에 저장하며 실제 포스트 데이터가 될 것이다. 이 포스트 객체를 posts 채널의 데이터 패키지로 발신하는 셈이다. 

이제 클라이언트 코드를 수정한다. componentDitMount에 socket.io에서 들어오는 데이터를 수신하는데 왜냐하면 이 앱에서 서버에 broadcast나 emit한 이벤트는 최종적으로 feed.js 파일에서 관리하는 포스트와 관련 있기 때문에 이 부분의 변경에 관심을 둔다.
소켓을 오픈한 뒤 openSocket이 반환한 것을 저장할텐데 이게 바로 오픈된 연결 소켓이다.
    const socket = openSocket('http://localhost:8080');

이 소켓에서 on 메서드를 사용해 특정 이벤트를 수신할 수 있다. 백엔드에 사용했던 동일한 이벤트 이름을 사용한다. 프론트엔드에서 posts 이벤트를 수신하게 되며 data를 얻게 된다.
    socket.on('posts', data => {
        if (data.action === 'create') {
            this.addPost(data.post);
        }
    });
- 여기서 사용한 action 키는 우리가 정의한 것이다. socket.io가 강요하는 것이 아님을 기억하자. 이 키값이 create인지 확인하고 맞다면 밑에 추가해둔 addPost 함수를 호출한다.

두 개의 브라우저를 이용해 테스트한다. 각각의 다른 사용자를 사용해서 포스트를 생성하면 건드리지 않은 다른 사용자의 브라우저에 포스트가 추가된다. 
다만 포스트를 생성한 사용자는 두 번 나오는데 내 소켓을 통해 생성된 포스트에 대한 알림을 받기 때문이며, 그 이유는 요청을 보낸 클라이언트에 이걸 발신하지 말라는 필터가 없어서이다. 또한 finishEditHandler에도 포스트 렌더링에 대한 코드가 있어서 포스트가 여길 통해서도 나타난다. 이걸 방지하기 위해 finishEditHandler의 else if 케이스를 제거한다.
==========================================================================================
413_버그 수정: 사용자 이름 누락

백엔드의 getPosts에서 .populate('creator') 를 추가하여 생성자 ID뿐만 아니라 전체 객체를 가져온다. 

또한 createPost에서 socket.io를 통해 발신하는 포스트에 사용자ID는 추가했으나 다른 데이터는 없는 포스트 객체인게 문제다. 전체 post_doc 데이터, 즉 포스트에 대한 모든 데이터를 발신하고 creator는 _id, 즉 req.userId를 가지는 객체와 동일하게 설정한다. 이 때 user.name인 name 필드도 설정하는데 user.name를 사용할 수 있는 이유는 위에서 가져오는 user 또한 name을 지닌 객체이기 때문이다.
        io.getIO().emit('posts', { 
            action: 'create', 
            post: {...post._doc, creator: {_id: req.userId, name: user.name}}
        });
==========================================================================================
414_연결된 모든 클라이언트에게 게시물 업데이트

백엔드의 컨트롤러에서 updatePost 메서드에 업데이트가 끝나면 이벤트가 발생하도록 result를 받고 post.save 이후 res를 보내기 전에 io.getIO()로 설정했던 IO 연결에 접근하고 전처럼 posts 채널에서 데이터를 발생시킨다. 
    io.getIO().emit('posts', { action: 'update', post: result });
- 이번 액션은 update이며 post는 result, 즉 저장 작업의 결과이다.
전과 같이 사용자 데이터를 포함하기 위해 게시물을 찾는 코드에 populate('creator')를 추가한다.
    const post = await Post.findById(postId).populate('creator');

프론트엔드의 addPost 함수 뒤에 updatePost를 추가한다. 
    updatePost = post => {
        this.setState(prevState => {
            const updatedPosts = [...prevState.posts];
            const updatedPostIndex = updatedPosts.findIndex(p => p._id === post._id);
            if (updatedPostIndex > -1) {
                updatedPosts[updatedPostIndex] = post;
            }
            return {
                posts: updatedPosts
            };
        });
  };
그리고 finishEditHandler에 있는 게시물을 편집하는 논리를 제거하여 중복을 막는다. 더 이상 여기서 업데이트하지 않고 업데이트를 보낸 클라이언트를 포함해 연결된 모든 클라이언트에 이벤트를 발생시키기 때문이다. 따라서 리스너를 설정해 updatePost 함수를 사용한다. post 이벤트에 리스너를 설정한 부분에 else if 블록을 추가하고 updatePost를 호출한다.
    socket.on('posts', data => {
        if (data.action === 'create') {
            this.addPost(data.post);
        } else if (data.action === 'update') {
            this.updatePost(data.post);
        }
    });

백엔드의 updatePost 함수 안에서 게시물을 찾을 때 populate('creator')를 했기 때문에 if 문에서 creator 객체가 req.userId와 같은지 확인하면 실패한다. 대신 creator 뒤에 _id를 입력한다. creator 필드를 사용자 데이터로 채우고 있으며 더이상 그냥 ID가 아니기 때문이다.
    if (post.creator._id.toString() !== req.userId) {
        ...
    }
==========================================================================================
415_정렬

현재 새 게시물을 생성하면 처음엔 맨 위에 나오고 새로고침하면 가장 뒤로 간다. 백엔드 feed 컨트롤러의 getPosts에서 게시물을 찾을 때 .sort()를 추가한다.
    const posts = await Post.find().populate('creator').sort({ createdAt: -1 })
    ...
- -1은 내림차순이다.

이제 프론트엔드를 새로고침하면 가장 최근 게시물이 위에 나온다. 앱의 취지에 맞도록 조정하자.
==========================================================================================
416_클라이언트 간에 게시물 삭제

백엔드의 deletePost 메서드로 간다. 삭제하면 이벤트를 발생하도록 응답을 보내기 직전에 코드를 추가한다.
    io.getIO().emit('posts', { action: 'delete', post: postId });

프론트엔드에서 게시물을 삭제했을 때 일어날 일을 정의해야 한다. 간단하게 페이지를 새로고침하도록 한다. 해당 게시물을 찾아 삭제하는 코드를 구현할 수도 있지만 여기선 간단하게 새로고침을 선택한다.
deletePostHandler에 원래 있던 코드를 지우고 this.loadPosts를 호출해 페이지가 아닌 게시물을 새로 고침하면 페이지화도 적절히 바뀐다.
    .then(resData => {
        this.loadPosts();
    })

그 다음 Socket.io의 다른 리스너가 있는 곳에 delete 리스너를 추가한다.
    socket.on('posts', data => {
        ...
        } else if (data.action === 'delete') {
            this.loadPosts();
        }
    });