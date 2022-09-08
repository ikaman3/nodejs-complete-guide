370_REST API와 나머지 과정

Node + Express App Setup      =======> No changes
Routing / Endpoints           =======> No real changes, more Http methods
Handling Requests & Responses =======> Parse + Send JSON Data, no Views
Request Validation            =======> No changes
Database Communication        =======> No changes
Files, Uploads, Downloads     =======> No changes(only on client-side)
Sessions & Cookies            =======> No Session & Cookie Usage
Authentication                =======> Different Authentication Approach

지금까지 배운 지식은 필요 없는 내용이 아니다. REST API의 일반적인 설정에 대해서는 바꿀 점이 없다. 라우팅에 대해서도 큰 변경 사항은 없다. 더 많은 http 메서드와 용어를 사용할 뿐이다. 요청 및 응답 처리는 뷰 대신 JSON 데이터를 사용한다. 더 이상 뷰를 렌더링하지 않는다. 유효성 검사도 바꿀 것이 없다. 파일 업로드 및 다운로드는 서버 측은 변할게 없고 클라이언트 측 논리만 약간 달라진다.
세션 및 쿠키에는 변화가 있다. REST API에서는 더 이상 세션과 쿠키를 사용하지 않는다. 그 이유는 각 요청을 따로 다룬다는 원칙 때문이다. 각 요청은 이전 요청과 독립적으로 검토되며 클라이언트와 서버 사이에는 접점이 없다. 연결 히스토리가 없으므로 서버에서 세션을 관리하지 않고 클라이언트가 이전에 접속 기록이 있는지 신경 쓰지 않는다. 
따라서 인증 절차도 차이가 있다. 
=========================================================================================
371_프론트엔드 설정 이해

원활한 테스팅을 위해 리액트를 사용한 프론트엔드를 강의 자료에서 다운로드한다. React.js는 프론트엔트 자바스크립트 프레임워크다. 단일 페이지 앱을 제작할 수 있게 해준다. 
npm install로 프로젝트 의존성을 설치하는데 Node.js 프로젝트가 아니어도 npm을 사용하는 이유는 브라우저 측 프로젝트의 경우에도 자바스크립트 프로젝트의 디펜던시를 npm으로 관리하는 일이 흔하기 때문이다. 다만 여기서 설치하는 패키지는 브라우저에서 사용할 패키지 뿐이다. Node Express 와 같은 패키지는 없다. 
모두 설치되면 npm start 로 서버를 실행한다. 앱을 서비스할 Node.js 서버지만 구축할 노드 서버와는 관련이 없고 백엔드와 관련이 없다. 
public 폴더의 html 파일을 서비스하며 컨텐츠가 별로 없다. source 폴더에서 구축한 React 애플리케이션에서 사용되는 훅(Hook)이 몇 개 존재하는데 이 소스 코드가 브라우저에서 이 훅에 자동으로 탑재되어 앱으로 이어진다. 페이지 소스를 보면 이러한 훅이 있는 html 페이지를 볼 수 있고 아래에 몇 개의 스크립트 임포트가 있다. 
DOM을 보면 더 많은 HTML 요소가 있으며 전부 브라우저 측 자바스크립트 프레임워크인 리액트에 의해 동적으로 렌더링된다. 
=========================================================================================
373_게시물 목록 가져오기

프론트엔드 서버는 포트 3000, 백엔드는 8080을 사용한다. 앱의 두 엔드가 다른 서버에서 제공되는 상황을 상정하게 된다. 리액트와 같은 프론트엔드 전용 앱은 html, 자바스크립트, css로만 구성된 앱에 최적화된 정적 호스트라는 곳에서 서비스하는 경우가 많아 백엔드와 프론트엔드를 모두 제작했더라도 두 개의 다른 서버에 실행하는 일은 흔하다. 
포트가 다르기 때문에 도메인이 다르고 CORS 헤더 없이는 아무것도 작동하지 않는다. 

loadPost는 마지막에 리액트가 호출하는 함수로 나중에 추가할 페이지화 기능도 있다. url을 http://localhost:8080/feed/posts 로 설정하고 접속해보면 에러가 나는데 더미 데이터를 추가하면 된다. React 코드에서 찾게 될 creator 객체를 생성한다. 
controllers/feed => getPosts
    res.status(200).json({
        posts: [
            _id: '1',
            title: ...
            content: ...
            ...
        ]
    })

페이지로 돌아가면 입력한 게시글이 보인다. 
=========================================================================================
374_Post 엔드 포인트 생성

finishEditHandler 함수는 유효한 title, content를 입력한 후 클릭한 경우를 처리하는 함수다. 프론트엔드 유효성 검사도 포함되어 있는데 노드와는 관련이 없다. 여기에 http://localhost:8080/feed/post URL을 추가한다. 그리고 fetch의 두 번쨰 인수로 객체를 전달하고 method 키에 POST를 입력한다. 
전송하려는 데이터인 body와 올바른 Content-Type을 지정하는 headers도 추가한다.
    fetch(url, {
        method: method,
        body: JSON.stringify({
            title: postData.title,
            content: postData.content
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }

컨트롤러의 createPost에서 필요한 필드를 추가한다.
    res.status(200).json({
        message: ...
        post: {
            _id: ...
            ...
        }
    })

이제 적어도 두 가지의 논리가 빠졌다. 첫 번째는 서버 측 유효성 검사다. 클라이언트 측 유효성 검사는 사용자가 자바스크립트 코드를 볼 수 있으므로 비활성화하거나 우회할 방법을 찾을 것이다. 따라서 안전하지 않으며 UX 개선에만 도움을 준다. 두 번째는 DB에 데이터를 저장해야 한다.
=========================================================================================
375_서버 측 유효성 검사 추가

express-validator 패키지를 사용하며 사용법은 이전과 같으므로 생략한다.

FeedEdit 컴포넌트를 보면 각 필드의 조건이 있다. 이것과 일치하도록 설정한다.

컨트롤러에서 유효성 검사 패키지가 모은 에러를 추출하고 errors를 검사하여 비어있지 않다면 유효성 검사 실패 상태 코드인 422를 return 한다.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: ...,
            errors: errors.array()
        });
    }
=========================================================================================
376_Post 모델 설정

MongoDB와 Mongoose 패키지를 사용한다. 설정법은 이전과 같다.
models 폴더에 post.js 모델을 생성한다. 
    const postSchema = new Schema(
        {
            ...
            creator: {
                type: Object,
                required: true
            }
        }, 
        { timestamps: true }
    );
- creator는 추후에 사용자 링크가 된다. 현재는 존재하지 않으므로 Object로 둔다.
- 이전과는 다르게 Schema 생성자에 option을 입력할 수 있다. 두 번째 인수에 객체로 timestamps 키를 추가하고 true로 둔다. 그러면 DB에 새로운 버전이나 객체가 추가될 때마다 Mongoose가 자동으로 타임스탬프를 추가한다. 따라서 자동으로 createAt, updatedAt 타임스탬프를 바로 사용할 수 있다.

설정이 끝나면 Schema에 기반한 모델을 export 한다.
    module.exports = mongoose.model('Post', postSchema);
=========================================================================================
377_DB에 게시물 저장

createPost에서 new Post 생성자로 한다. 타임스탬프 옵션 덕에 Mongoose가 자동으로 설정하므로 createdAt은 필요없다. _id도 알아서 설정한다. 
    const post = new Post({
        title: title, 
        ...
    });

post.save를 호출하고 then, catch를 연결한다.
=========================================================================================
378_정적 이미지 및 오류 처리

app.js =>
    app.use('/images', express.static(path.join(__dirname, 'images')));
- path 패키지를 사용해 /images로 가는 모든 요청에 대해 Express에 내장된 static 미들웨어를 사용한다.

이미지를 보려면 VIEW를 클릭해야 한다. 이를 위해 단일 게시물을 제공하는 라우트가 필요한데 일단 뒤로 미룬다. 

컨트롤러에서 일반 오류 처리 함수를 설정하여 에러 핸들링을 한다. 
    if (!errors.isEmpty()) {
        const error = new Error('...');
        error.statusCode = 422;
        throw error;
    }
- 여기서 throw가 하는 일은 (비동기식 코드 스니펫 같은 것이 아니므로) 자동으로 함수 실행을 종료하고 Express 앱에서 제공하는 다음 오류 처리 함수나 미들웨어로 향하려 할 것이다.
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }) 
- statusCode 필드를 확인할 필요는 없지만 error를 스스로 throw하는 복잡한 코드의 경우 드물게 오류가 발생할 수 있다. 이때는 서버 측 에러이므로 500으로 설정한다.
- 전에 배웠듯이 지금은 프로미스 체인, 즉 비동기 코드 스니펫 내부에 있으므로 error을 throw해도 다음 오류 처리 미들웨어로 넘어갈 수 없다. 대신 next()를 함수에 error을 입력한다.

마지막은 app.js에서 오류 처리 Express 미들웨어를 등록한다.
    app.use((error,  req, res, next) => {
        console.log(error);
        const status = error.statusCode || 500;
        const message = error.message;
        res.status(status).json({ message: message });
    });
=========================================================================================
379_단일 게시물 가져오기

feed 라우트에 새로운 get 라우트를 추가한다. 
    router.get('/post/:postId', isAuth, feedController.getPost);
컨트롤러에서 getPost 액션을 추가한다.
    const postId = req.params.postId;
    Post.findById(postId).then(post => {
        if (!post) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Post fetched.', post: post });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
- 쿼리 매개변수에서 postId를 추출하고 DB에서 검색한다.
- then 안에선 next를 사용해야 한다고 배워서 혼란스러울 수 있다. then 블록 안에서 throw하면 다음 catch 블록에 도달하며 그 error는 catch 블록에 error로 입력된다. 그곳에서 error를 next하게 되므로 정상적인 논리이다.

그리고 프론트엔드에서 실제 데이터를 가져오기 위해 DB에 액세스한다. getPosts의 코드를 변경한다.
    Post.find()
        .then(posts => {
            res.status(200).json({ message: ..., posts: posts });
        }).catch(...)

단일 게시물을 로드하도록 프론트엔드의 SinglePost.js 파일의 componentDidMount를 수정한다.
    'http://localhost:8080/feed/post/' + postId
- 올바른 url을 입력한다.
    image: 'http://localhost:8080/' + resData.post.imageUrl,
- resData로 image url을 서버에 정의한다. 게시물을 저장하는 데 사용하는 getPost에 게시물이 들어있는 post 속성을 사용한다. 이를 프론트엔드에서 액세스한다. DB에 저장된 키 이름은 imageUrl 이다.
=========================================================================================
380_이미지 이름 및 Windows

다음 강의에서는 REST에서 이미지를 업로드하는 방법을 배울 것이다. 그전에 Windows 사용자만을 위한 유의사항이 있다.
Windows에서 파일 이름에 날짜 문자열을 포함하면 CORS 오류가 나타날 건데 이런 오류를 방지하기 위해 코드를 수정해야 한다.

원래 버전
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'images');
        },
        filename: function(req, file, cb) {
            cb(null, new Date().toISOString() + file.originalname);
        }
    });
다음 강의에서 위 코드 대신, 아래와 같이 수정한다.
    const { v4: uuidv4 } = require('uuid');
    
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'images');
        },
        filename: function(req, file, cb) {
            cb(null, uuidv4())
        }
    });
이를 위해 uuid 패키지를 설치하도록 다음을 실행한다.

    npm install --save uuid

또, 이미지가 프론트엔드에 올바르게 로드되는지 확인하기 위해, feed.js 컨트롤러에 있는 논리도 수정한다.
createPosts에서, imageUrl 상수를 다음과 같이 바꾼다.
    exports.createPost = (req, res, next) => {
        ...
        const imageUrl = req.file.path.replace("\\" ,"/");
        ...
    }
그 외에도, 추후 추가하는 updatePost 는 다음과 같이 수정한다.
    exports.updatePost = (req, res, next) => {
        ...
        imageUrl = req.file.path.replace("\\","/");
    }

MacOS과 Linux의 경우, 본 유의사항을 무시하고 강의 중에 보여드리는 코드를 사용하시면 된다.
=========================================================================================
381_이미지 업로드

업로드된 파일에 액세스하기 위해 multer 를 이용한다. app.js에서 이전과 완전히 동일한 논리를 구현한다.

프론트엔드를 수정해야 하는데 Feed.js의 finishEditHandler로 간다. 지금은 컨텐츠 타입을 json으로 하지만 json은 텍스트로 표현 가능한 데이터에서만 사용 가능하다. 하지만 파일은 텍스트로 변환하기 어렵거나 불가능하고 파일 크기가 금방 커지게 되어 이런 방식으로 업로드할 수 없다. 즉, 파일과 일반 텍스트 데이터가 공존하면 json을 사용할 수 없다.
대신 form 데이터를 사용한다. 이전에는 뷰를 렌더링하며 자동으로 사용하였다. multipart/form type의 form을 html 요소에 추가했었다. 여기서도 fomr 데이터를 사용하는데 form 요소로 사용하지 않고 전부 자바스크립트로 한다.
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('image', postData.image);
    ...
    body: formData
- formData는 브라우저 측 자바스크립트가 제공하는 내장 객체다. 이 객체에 데이터를 첨부한다. 첫 번째 인수는 필드 이름, 두 번째 인수가 실제 데이터다.
- 이 form 데이터를 요청 본문으로 사용한다. 이때 헤더를 json으로 설정하면 안된다. form 데이터의 헤더는 자동으로 설정된다. body를 formData로 설정하면 헤더 설정은 자동으로 이루어진다.
=========================================================================================
382_게시물 업데이트

게시물을 편집하기 위해 사용한 적 없는 HTTP를 사용한다. 편집이란 기존 게시물을 새 게시물로 대체하는 것이다. 기존 ID는 유지하되 리소스를 대체하기 위해 PUT 메서드를 사용한다. 일반적인 브라우저 양식에서는 보낼 수 없지만 자바스크립트에 의해 유발된 비동기식 요청을 통해서는 가능하다. 
    router.put('/post/:postId', [...], feedController.updatePost);

중요한 것은 post 요청처럼 요청에 body가 있다는 것이다. 요청 본문에 기존 게시물을 대체할 데이터를 추가한다. updatePost 액션을 추가한다.
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if (req.file) {
        imageUrl = req.file.path;
    }
    if (!imageUrl) {
        const error = new Error('No file picked.');
        error.statusCode = 422;
        throw error;
    }

프론트엔드도 약간 수정한다. Feed.js의 loadPosts에서 resData에 접근하는 것은 맞지만 디폴트 자바스크립트 메서드인 map()을 사용해 다른 종류의 배열에 맵핑하거나 각 요소가 조금씩 바뀌어야 한다.
    posts: resData.posts.map(post => {
    return {
            ...post,
            imagePath: post.imageUrl
        };
    })
- map 함수는 배열의 모든 요소에 실행되어 요소를 가져오며 이 경우 인수는 post다. 그 다음 업데이트된 새 객체를 반환하는데 ...post로 post 객체의 모든 속성을 받고 imagePath 키에 post.imageUrl을 입력한다. 기존의 경로에 저장하는 이유는 예를 들어 SinglePage.js에 imageUrl을 추출해 URL을 도메인에 덧붙이기 때문이다. 여기서 경로는 도메인을 제외하고 그냥 경로여야 한다. 그래야 Feed.js에 저장되어 차후 편집 모드에서 다시 활용할 수 있다. 

다시 컨트롤러에서 DB에 업데이트한다. clearImage 라는 헬퍼 함수를 만들어서 업데이트한 게시물을 저장하기 직전에 새 이미지가 업로드 되면 기존 이미지를 삭제하기 위해 사용한다. 모든 액션 외부 맨 밑에 정의한다.
    const clearImage = filePath => {
        filePath = path.join(__dirname, '..', filePath);
        fs.unlink(filePath, err => console.log(err));
    };

프론트엔드에서 마무리한다. finishEditHandler 함수에서
    if (this.state.editPost) {
        url = 'http://localhost:8080/feed/post/' + this.state.editPost._id;
        method = 'PUT';
    }
- 프론트엔드에 구성한 논리로 if 문에 편집 모드가 설정되었다면 실행된다.
=========================================================================================
383_게시물 삭제

    router.delete('/post/:postId', isAuth, feedController.deletePost);
delete 메서드를 사용한다. delete 메서드는 body를 보낼 수는 없지만 URL에 데이터를 암호화할 수는 있다.

컨트롤러에서 deletePost를 작성한다. id를 사용하여 찾는 이유는 게시물을 삭제하기 전에 해당 사용자가 게시물을 생성했는지 확인할 수 있도록 모든 게시물을 찾고 오류가 있다면 에러 핸들링 코드를 사용하기 위함이다.

프론트엔드의 deletePostHandler에서 url을 수정한다.
    fetch('http://localhost:8080/feed/post/' + postId, {
        method: 'DELETE'
    })
=========================================================================================
384_페이지화(Pagination) 추가

프론트엔드의 Feed.js의 loadPosts 메서드에 이미 페이지화 논리가 있다. URL 뒤에 ?page=로 페이지 쿼리 매개변수를 추가한다.
    'http://localhost:8080/feed/posts?page=' + page
위에서 생성한 page 변수를 추가하면 프론트엔드 앱 내부적으로 관리되며 로드하려는 페이지에 따라 1, 2 등이 될 것이다. 

컨트롤러의 getPosts에 페이지화 코드를 추가한다. 전과 같은 논리이다.
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
    Post.find().countDocuments()
        .then(count => {
            totalItems = count;
            return Post.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
        })
    ...
    totalItems: totalItems
- 프론트엔드에 게시물의 총개수를 고려하는 논리를 만들어 다음 페이지 및 이전 페이지 버튼을 언제 넣을지 알 수 있어야 하므로 응답에 totalItems를 추가한다.
=========================================================================================
385_사용자 모델 추가

models에 user.js를 생성한다. 기존과 같은 방식이므로 생략한다.

새 라우트로 인증 관련된 auth.js를 추가한다. 사용자를 생성할 것이니 put 라우트로 진행한다.
    router.put('/signup', [...], authController.signup);

이 라우트에 도달하기 위해 app.js 파일에 ./routes/auth를 불러오는 상수로 설정한다.
    const authRoutes = require('./routes/auth');
파일의 막바지에 /auth로 시작하는 경로를 authRoutes로 전달한다.
    app.use('/auth', authRoutes);
=========================================================================================
386_회원 가입 검증 추가

auth 컨트롤러에서 signup 액션을 추가한다. DB에 새로운 사용자 생성을 위한 논리를 추가한다. 비밀번호를 DB에 저장하기 위해 해시화를 해야한다. bcryptjs 패키지를 이용한다. 

프론트엔드에서 signupHelper의 URL을 고친다. 백엔드에 put 요청을 정의했기 때문에 객체의 두 번째 인수로 PUT 메서드를 전달한다.

기존 내용과 동일한 논리이므로 생략
=========================================================================================
388_How Authentication Works

        Stores Token
Storage <------------ Client ------|
                      |    ^       |
       Send Auth Data |    | Token |
                      |    |       |
                      |    |       |
                      Server <-----|
    RESTful API is Stateless

전과 동일하게 클라이언트 및 서버가 있고 클라이언트는 서버에 인증 데이터로 이메일, 비밀번호를 보낸다. 예전에는 서버에서 데이터를 확인하고 유효하다면 세션을 설정했다. 하지만 REST API는 Stateless(무상태)이므로 세션을 사용하지 않는다. 클라이언트를 고려하지 않는다는 뜻이다. 각 요청이 인증에 필요한 데이터를 모두 가지고 있어야 한다. REST API에서는 세션을 저장하지 않는 다른 방식을 사용한다. 서버에 입력한 입력값은 여전히 확인해야 한다. 

이메일과 비밀번호 조합의 유효성도 확인하지만 대신 클라이언트에 토큰을 반환한다. 서버에서 생성되는 토큰은 서버만 인증할 수 있는 정보를 가지고 있으며 클라이언트에 저장된다. 브라우저에 이를 위한 특정 스토리지 매커니즘이 있다. 그 후 클라이언트가 서버에 보내는 다음 요청에 토큰을 부착하면 인증이 필요한 서버의 리소스로 향하는 모든 요청에 저장된 토큰이 부착된다. 
또 토큰을 생성한 서버만이 해당 토큰을 검증할 수 있다. 만약 프론트엔드에서 토큰을 변경하거나 인증 여부를 조작하면 서버가 알아차릴 수 있다. 서버에서 토큰을 생성할 때 특정 알고리즘을 사용하는데 생성할 때 사용하는 비공개 키를 모르면 조작이 불가능하기 때문이다. 

What's that Token?

JSON Data
    +
Signature ===> Can be verified by server(via secret key)
    |
JSON Web Token(JWT)

토큰에는 JSON 데이터나 자바스크립트 데이터에 서버에만 저장되는 비공개 키와 함께 생성되는 서명을 포함해 JSON Web Token 이 된다. 그럼 JWT가 클라이언트로 반환되어 클라이언트 상에서 토큰을 생성하거나 수정할 수 없다. 할 수야 있겠지만 서버가 감지하고 토큰을 무효화할 것이다.
=========================================================================================
389_사용자 로그인

auth 라우트에 /login 라우트를 추가한다.
    router.post('/login', authController.login);

auth 컨트롤러에 login 액션을 추가한다. 기본적인 논리는 이전과 같다. req.body.email에서 email을 검색하고 req.body.password에서 password를 검색한다. 그리고 이메일이 존재하고 일치하는지 검색한다.
실패한다면 전에 사용했던 핸들러 함수로 에러 처리한다. 네트워크나 데이터베이스 오류일 것이다. 
반면 then 블록까지 도달해서 user 객체를 가지더라도 사용자를 찾은것은 아니다. 사용자를 찾지 못해서 undefined 일수도 있다. 그저 오류가 없었기 때문에 then 블록에 도달한 것이다. 그러므로 if (!user)로 사용자가 저장되어있는지 확인하고 정의되지 않았다면 new Error 객체를 생성해 statusCode를 설정하는데 사용자를 찾지 못했다는 404를 사용하거나, 인증되지 않았음을 나타내는 401을 사용하고 throw error로 마무리한다.
찾았다면 비밀번호 유효성을 검증할 차례다. bcrypt 패키지의 compare 메서드를 사용해서 저장된 비밀번호와 입력한 비밀번호를 비교한다.
=========================================================================================
390_로그인 및 JSON Web Token(JWT) 생성

토큰 생성을 위해 새 패키지를 설치한다.
    npm install --save jsonwebtoken
JWT를 쉽게 생성하도록 돕는 패키지다. jwt 이름을 지은 상수에 패키지를 불러와 jsonwebtoken 패키지나 그에 따른 객체를 저장한다.
    const jwt = require('jsonwebtoken');

이제 비밀번호를 확인하고 일치하면 토큰을 생성한다.
controllers/auth => login
        const token = jwt.sign(
        { 
          email: loadedUser.email, 
          userId: loadedUser._id.toString() 
        }, 
        SECRET_KEY, 
        { expiresIn: '1h' }
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
token 이라는 상수를 저장하고 jwt 패키지의 sign 메서드를 사용해 새로운 서명을 만들고 새로운 JWT에 포함한다. 토큰에는 어떤 데이터는 포함할 수 있다. 이메일을 저장하거나 userId를 저장할 수도 있다(이때 MongoDB 객체를 문자열로 변환해야 한다).
두 번째 인수로 가입에 사용된 비공개 키를 입력하는데 서버에만 공개되어 있기 때문에 클라이언트에서 토큰을 조작할 수 없다. 보통 긴 문자열로 길게 입력한다. 
세 번째 인수로 expiresIn을 입력해 유효기간을 지정한다. 1h는 1시간 후에 토큰이 효력을 잃는다. 이렇게 보안 메커니즘을 추가하는 이유는 토큰이 클라이언트에 저장되기 때문이다. 토큰을 가진 클라이언트가 도용 당하는 경우도 있다. 사용자가 로그아웃을 하지 않아서 다른 사용자가 브라우저 스토리지에서 토큰을 복사해 자기 PC에서 사용할 수도 있다. 일반적으로 1시간 정도면 적당하다.
토큰을 만들었으니 클라이언트에 반환한다. 이때 React 앱에서 ID를 찾아 저장할 거라 userId가 필요하다.

이제 프론트엔드의 App.js에서 loginHandler의 URL을 고친다.
    'http://localhost:8080/auth/login'
두 번째 인수로 객체를 전달한다.
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            email: authData.email,
            password: authData.password
        })
    }

로그인을 하고 개발자 도구의 Application 탭에 가보면 클라이언트에서 생성한 expiryData로 토큰이 만료되어 제거될 시점을 알 수 있고 token이 바로 서버에서 생성한 토큰이다.
이 토큰을 복사하여 jwt.io에 붙여넣고 분석할 수 있다. 비공개 키를 입력하면 복사한 토큰과 동일한 토큰이 나온다. 또한 서버 측에서 추가한 페이로드 데이터도 보이는데 이렇게 추출할 수 있으므로 토큰에 민감한 데이터는 넣으면 안 된다.
한편 페이로드 데이터를 수정하면 즉, 정보를 변경하면 토큰도 변경된다. 비공개 키를 변경해도 서버에서 만든 토큰과 달라진다.
=========================================================================================
391_토큰 사용 및 검증

토큰을 생성해 클라이언트에 전달했으니 클라이언트에서 백엔드로 토큰을 전달할 수 있어야 한다. 먼저 토큰의 유효성을 확인하고 요청을 이어나가야 한다. 새로운 미들웨어를 추가하기 위해 middleware 폴더에 auth.js 파일을 추가한다.

우선 들어오는 요청에서 토큰을 추출해야 한다. 프론트엔드 Feed.js의 loadPosts에 부착해보자. 몇 가지 옵션이 있다.
첫 번째는 쿼리 매개변수로 token=을 추가하고 또 다른 쿼리 매개변수를 덧붙이는 게 한 가지 방법이다.
요청 본문에 포함하는 방법도 있는데 이상적인 방법은 아니다. GET 요청에 본문이 없을 수도 있기 때문이다. 인증이 완료된 GET 요청이 없는 이상 사용하지 않는 것이 좋다.
훌륭한 해결책은 headers를 사용하는 것이다. URL을 깔끔하게 유지할 수 있고 header는 모든 요청에 포함된다. loadPosts 함수의 fetch 메서드에 두 번째 인수로 headers를 추가한다. 데이터를 보내지 않으므로 컨텐츠 유형 대신 'Authorization' 헤더를 추가한다.
    headers: {
        Authorization: 'Bearer ' + this.props.token
    }
- 이론상 원하는 헤더를 추가할 수 있지만 Authorization이 공식적으로 백엔드에 인증 정보를 전달할 때 사용하는 헤더이다. 백엔드 app.js 파일에 헤더를 추가할 때 Authorizaion 헤더를 허용했듯이 꼭 사용 전에 활성화해야 한다.
- Bearer 다음 공백에 토큰을 입력한다. Bearer는 가지고 있는 토큰의 유형을 구분할 때 흔하게 사용하며 Bearer 토큰은 인증 토큰과 같다. 보통 JWT에 Bearer를 사용한다. 꼭 그래야 하는 것은 아니지만 거의 관례이기 때문에 사용한다.

middleware/is-auth.js =>
    const jwt = require('jsonwebtoken');

    module.exports = (req, res, next) => {
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            const error = new Error('Not authenticated.');
            error.statusCode = 401;
            throw error;
        }
        const token = authHeader.split(' ')[1];
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, SECRET_KEY);
        } catch (err) {
            err.statusCode = 500;
            throw err;
        }
        if (!decodedToken) {
            const error = new Error('Not authenticated.');
            error.statusCode = 401;
            throw error;
        }
        req.userId = decodedToken.userId;
        next();
    };
- 상수 token을 생성해 req에 접근하고 get 메서드로 헤더 값을 받는다. 이때 토큰에만 관심이 있기 때문에 공백을 기준으로 나누어서 두 번째 값인 토큰만 받는다.
- 토큰을 받으면 해독(decode)로 넘어간다. 실패할 경우를 대비해 try 블록을 사용한다. decodedToken 상수에 jwt의 verify 메서드를 이용하면 토큰 해독과 확인 과정까지 거친다. decode 메서드도 있지만 해독만 하고 유효한지 확인하지 않으므로 반드시 verify 메서드를 사용해야 한다. 이후 비공개 키를 입력하는데 가입 시 만든 토큰의 비공개 키와 같아야 한다. auth 컨트롤러에서 사용한 비공개 키를 사용해야 한다. 
- 에러가 있었다면 catch 블록으로 갈 것이고 상태 코드는 500이다. 실패하지 않았다면 해독이 진행되었다는 뜻이며 if 문에서 정의되지 않았다면 실패는 하지않았으나 토큰을 확인할 수 없다는 의미다. 상태 코드는 401로 설정한다.
- 토큰으로부터 userId 정보를 추출하여 req에 저장해 요청이 도달하는 라우트에서 사용하도록 한다. 토큰을 해독했기 때문에 토큰에 저장된 필드에 접근할 수 있는 것이다.

이제 feed 라우트에 /posts 라우트에 isAuth 미들웨어를 추가한다.
    router.get('/posts', isAuth, feedController.getPosts);

392_모든 라우트에 인증 미들웨어 추가

서버에 추가한 isAuth 미들웨어로 feed 라우트를 보호한다. 모든 라우트의 첫 번째 라우트에 추가한다. 첫 번째 미들웨어에서 토큰이 없다면 그 뒤는 볼 필요도 없다.

프론트엔드의 몇몇 곳에도 추가해야 한다. finishEditHandler, deletePostHandler의 fetch 요청에 headers를 추가해 Authorizaion 토큰을 포함한다. SinglePost 파일의 componentDidMount에도 추가한다.
=========================================================================================
393_게시물과 사용자 관계 연결

post 모델에 생성한 creator 객체는 임시방편이었다. 이제 type을 제대로 변경하고 사용자에 대한 참조를 저장한다.
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
feed 컨트롤러도 수정한다. createPost에서 post를 생성하기 전 사용자 ID를 받는다.
    const post = new Post({
        ...
        creator: req.userId
    });
- is-auth 파일에서 decodedToken.userId로 req.userId에 저장해두었으므로 사용할 수 있다.
- 객체 Id가 아닌 문자열이지만 mongoose가 알아서 전환할 것이다.

post.save 다음에 바로 응답을 보내지 않고 우선 해당 사용자의 게시물 리스트에 게시물을 추가한다.
    post.save()
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            creator = user;
            user.posts.push(post);
            return user.save();
    })
    ...
- User 모델의 posts 속성에 post를 push 한다.
=========================================================================================
394_권한 확인 추가

사용자가 자신이 만들지 않은 게시물을 편집 및 삭제하려고 하는지 확인한다. feed 컨트롤러에서 updatePost로 간다.
    if (post.creator.toString() !== req.userId) {
        const error = new Error('Not authrorized.');
        error.statusCode = 403;
        throw error;
    }
- creator ID가 현재 로그인 중인 사용자의 ID 즉, 받은 토큰이 속한 ID와 같은지 확인한다.
- 상태 코드는 인증 문제와 관련된 403을 사용한다.

deletePost에도 동일한 논리를 추가한다. 

프론트엔드에서 권한이 없으면 버튼이 보이지 않도록 만들 수 있지만 백엔드에서 보호할 수 있는 방법을 알아보았다.
=========================================================================================
395_사용자 관계 지우기

게시물을 삭제하고 사용자와 게시물 간의 관계도 제거해야 한다. 지금 사용자의 DB를 보면 삭제된 게시물의 ID가 남아있다.
    .then(result => {
        return User.findById(req.userId);
    })
    .then(user => {
        user.posts.pull(postId);
        return user.save();
    })
    ...
- Mongoose가 제공하는 pull 메서드를 사용한다. 삭제하려는 게시물의 ID를 전달한다. 게시물은 삭제되었지만 postID는 변수에 남아있으므로 사용할 수 있다.