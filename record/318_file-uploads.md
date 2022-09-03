318_File Uploads & Downloads

Handling Files Correctly

파일 업로드 다운로드는 웹 사이트에서 자주 보이며 서버 측에서 처리하는 방법과 파일을 사용자에게 돌려주는 다양한 기회의 종류를 이해해야 한다.
========================================================================================
319_프론트엔드에 파일 피커 추가

새 제품을 추가하려면 지금은 image URL을 입력해야 한다. 이것은 비현실적인 설정으로 실제 앱에서 제품 판매를 원하는 사용자들은 웹 어딘가에 제품 사진을 저장해 둔 경우가 거의 없다. 따라서 사용자에게 이미지 업로드의 가능성을 열어주는 것이 필요하다.

파일 업로드 추가는 두 가지 작업을 의미한다.
첫 째로 이 페이지에서 형식을 조정하여 사용자들에게 파일 피커, 즉 컴퓨터 운영체제에서 파일을 선택하도록 돕는 도구를 보여주는 것이다.
두 번째로 그 파일을 우리가 처리할 장소 즉, 들어오는 요청을 처리하는 곳에서 수락할 수 있어야 한다.

먼저 파일 피커를 추가한다.
admin view에서 edit-product.ejs 파일에 이미지 URL 컨트롤이 있고 이 부분에서 이미지 URL이 파일 피커가 되어야 한다. 기존 div 블록을 주석처리하고 아래 코드로 변경한다.
    <div class="form-control">
        <label for="image">Image</label>
        <input 
            type="file" 
            name="image" 
            id="image" >
    </div>
type을 file로 변경한다. 항상 빈 파일 피커를 제시할 것이므로 value도 필요가 없다. 따라서 이걸 편집하고 새로운 파일을 보내지 않는 상황에서는 기존의 것을 유지하고 새것을 보내는 경우 덮어쓰면 된다.
이 자리에 파일 피커가 등장하고 이것은 기본 HTML 요소이다. 클릭하면 파일을 선택할 수 있다. 
========================================================================================
320_멀티파트 form 데이터 다루기

이제 백엔드를 다룬다. admin 라우트에서 imageUrl 유효성 검증을 제거한다. 왜냐하면 imageUrl이 URL이라야 하는데 명백하게 그렇지 않기 때문이다. 
그러나 유효성 검증을 지워도 오류 처리가 작동하는데 그 이유는 우리가 얻은 이미지를 올바르게 추출할 수 없기 때문이다. 

req.body에서 이미지를 추출하지 못했다. 들어오는 요청의 컨텐츠를 추출하기 위해 app.js에 bodyParser미들웨어를 설정했다. 이 미들웨어는 다양한 파서를 몇 가지 사용 내지는 노출하며 우리는 URL 인코딩된 파서를 사용한다. URL 인코딩된 데이터는 한 마디로 텍스트 데이터이다. 따라서 형식이 파일 없이 텍스트 필드만 제출된 경우 해당 텍스트 필드에 숫자, URL, 평문의 저장 여부를 불문하고 제출되는 시점에는 모두 텍스트에 인코딩된다. 이 형식은 이후 URL 인코딩되었다고 일컫게 되며 개발자 도구에서 확인할 수 있다. 
Network 탭에서 submit을 클릭하면 add product 요청에서 요청 헤더의 컨텐츠 유형이 application이며 x-www-form-urlencoded로 되어있다. 이 의미는 모든 데이터를 텍스트로 form 본문에 취합하려는 것이다. 아래쪽에 form data에서는 제목, 가격 등이 정상 전달되었으나 image은 그렇지 못하다. 왜냐하면 파일이란 binary data 이므로 파일을 텍스트로 추출할 수 없기 때문이다. 즉, 파일을 다른 방식으로 parse 해야한다.
bodyParser는 어떠한 파서도 제공하지 않는다. 파일 데이터를 처리하는 파서도 미포함이다. 새로운 패키지가 필요하다.

    npm install --save multer
Multer는 제3자 패키지이다. 들어오는 요청을 분석하는데 파일에 대한 요청을 분석한다. 따라서 파일 요청도 처리할 수 있으며 텍스트와 파일 데이터가 혼합된 데이터의 요청도 처리할 수 있다. bodyParser는 그대로 유지한다. URL 인코딩된 데이터만을 제출하는 가입 형식도 포함하기 때문이다.

views의 edit-product.ejs의 form에 필드를 추가한다.
    <form class="..." action="..." method="POST" enctype="multipart/form-data">
- application/x-www-form-urlencoded이 기본값이지만 multipart/form-data로 변경한다. 이는 서버 측에 이 제출, 즉 요청이 평문이 아니라 혼합된 데이터, 텍스트 및 이진 데이터를 포함한다고 알리는 컨텐츠 유형이다.
==========================================================================================
321_Multer로 파일 업로드

admin 컨트롤러의 postAddProduct를 수정한다. multer는 여기에서 사용할 패키지는 아니고 bodyParser와 마찬가지로 들어오는 요청마다 실행하는 미들웨어의 일종이며 해당 요청이 Multipart form의 데이터인지 검토하고 해당하는 경우 파일의 추출을 시도한다. 우리가 추가하는 부수적인 미들웨어에 해당하며 따라서 app.js에 임포트한다.
app.js =>
    const multer = require('multer');
    ...
    app.use(
        multer({ dest: 'images' }).single('image')
    );
- bodyParser 이후에 사용한다.
- multer는 함수로 실행되어야 하며 다른 메서드를 뒤에 호출해야 한다. 단순히 파일을 1개 가져올지 여러 개 가져올지를 정의하며 이 앱은 1개를 가져오므로 single 메서드를 호출한다. 그리고 파일을 가지는 입력값 이름을 정의하는데 이 경우 'image'가 된다. 이 이름은 무작위 값이 아니라 views에서 가지는 입력값 즉, 파일 피커의 이름이 'image'이기 때문이다.
- multer를 설정할 때 함수에 객체를 전달할 수 있는데 몇 가지 옵션 중 하나가 dest이다. dest에 '/images' 또는 'images'를 명시한다. 
controllers/admin => postAddProduct
    const image = req.file;
multer에 설정을 하지 않은 상태에서 req.body.image 대신 req.file에 접근한다. image를 출력해보면 콘솔에 multer가 작업한 결과를 볼 수 있다. 추출한 필드의 이름, 파일 이름, mime type 즉, 파일 종류를 탐지했다. 그리고 버퍼는 노드가 이진 데이터를 처리하는 방식이다. 최종적으로 이것이 스트림된 데이터의 결과이다.
dest에 경로를 명시하면 출력값이 변경되는데 버퍼는 없고 multer가 버퍼를 사용해 작업할 수 있기 때문이다. 전부 메모리에 버퍼링하는 대신 그 버퍼를 이진 데이터로 변환하여 이 경로('images')에 저장할 수 있다. 그래서 폴더를 살펴보면 images 폴더가 생성되고 파일이 들어있어야 한다. 이 파일은 무작위 해시 이름을 가지며 파일 확장자는 가지지 않고 이미지로 인식되지 않는다. 그러나 원래 이미지 확장자를 붙여주면 잘 인식된다.
==========================================================================================
322_파일 이름 및 파일 경로 조정을 위한 Multer 구성

multer를 추가했고 multer는 들어오는 데이터를 수락하고 파일을 추출하여 저장하고 req.file 객체에 파일 업로드 관련 정보를 저장한다. 우린 데이터가 올바르게 저장되로록 신경 쓰기만 하면 된다. 따라서 목적지 폴더를 명시하는데 다른 작업도 가능하다. dest 옵션보다 더 많은 구성 옵션을 제공하는 저장소 키를 multer에 설정할 수 있다.
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
우선 저장소 구성을 위해 구성 객체를 위에서 생성한다. 이 객체의 이름은 뭐든 상관없다.
    const fileStorage = multer.diskStorage({ 
        destination: (req, file, cb) => {
            cb(null, 'images');
        },
        filename: (req, file, cb) => {
            cb(null, new Date().toISOString() + '-' + file.originalname);
        }
    });
- fileStorage는 상수에 해당하며 값은 multer 패키지에서 가져온 diskStorage 함수가 된다.
- diskStorage는 multer가 사용할 수 있는 저장소 엔진이며 자바스크립트 객체를 전달하여 구성한다. 2개의 키, 즉 destination과 filename을 활용한다. 이후 들어오는 파일에 대해 multer가 호출하는 함수가 2개 있으며 해당 함수들은 파일의 저장 위치와 이름을 어떻게 처리할지를 제어한다. 따라서 destination는 함수가 되며 multer가 호출하게 되는 화살표 함수로 만드는데 이는 req와 file 객체 그리고 destination 설정이 완료된 뒤 호출하는 콜백을 수신한다. multer와 상호작용하기 위해 이 모든 것들이 필요하다. 
- 여기에서는 null을 첫 번째 인수로 하여 callback을 호출한다. 이건 들어오는 파일에 문제가 있어 저장해서는 안 된다고 multer에게 알리는 오류 메시지가 될 것이다. 그러나 null 값일 경우 multer에게 저장해도 좋다고 알린다.
- 두 번째 인수는 위치이며 images 폴더처럼 저장하고자 하는 위치를 뜻한다.
- filename 또한 함수이며 위와 동일한 구성을 한다. 이때 콜백의 두 번째 인수는 사용하려는 파일 이름이다. 파일을 추출하면 원본 파일 이름을 보유한 originalname 객체가 있다. 무작위 해시를 포함하는 filename 객체도 존재하므로 이걸 합쳐 동일한 이름인 이미지가 두 개가 있는 경우 절대로 서로 덮어쓰지 않도록 처리할 수 있다. 

이대로 제품을 업로드하면 이미지 이름이 undefined~가 될텐데 함수를 이용해 우리만의 파일명을 설정했기 때문에 multer가 해당 해시를 생성하지 않았기 때문이다. 하지만 현재 날짜를 사용하여 new Date를 toISOString에 넣어주면 현재 날짜가 적용되며 이 또한 유일성을 확보할 수 있다. 만약 필요하다면 고유한 해시를 제공하는 제3자 패키지를 사용할 수도 있다. 
==========================================================================================
323_mimetype 으로 파일 필터링

특정 종류의 파일만을 허용하도록 필터를 추가할 수도 있다. 이를 위해 multer를 구성하는 객체에 fileFilter 함수를 추가한다. 읽기 쉽도록 별도의 상수를 위쪽에 생성한다.
    const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    };
- fileStorage와 동일하게 화살표 함수를 사용하며 req, file 데이터와 호출할 콜백을 갖는다.
- null 값을 오류로 하여 콜백을 호출하고 해당 파일을 수락, 즉 저장할 경우 true로 호출하며 저장하지 않을 경우 false로 한다. 이때 원하는 논리를 자유롭게 입력한다. if 문에서 mimetype을 이용하여 원하는 확장자를 필터링한다.
==========================================================================================
324_DB에 파일 데이터 저장하기

우선 기존에 생성된 제품을 모두 지운다. 

    const image = req.file;
이제 admin 컨트롤러의 postAddProduct에서 파일을 다룬다. 먼저 image가 형식의 객체가 되며 파일에 대한 정보와 저장 위치 즉, 물리적 파일이 발견될 수 있는 곳을 담고 있으며 여기에 저장하고자 한다.
    if (!image) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: { 
                title: title,
                price: price,
                description: description
            },
            errorMessage: 'Attached file is not an image.',
            validationErrors: []
        });
    }
- 먼저 image가 설정되었는지 확인한다. 정의되지 않았다면 multer가 들어오는 파일을 거부했음을 뜻한다. 따라서 유효하지 않은 입력값이기 때문에 422 상태 코드를 반환한다. 
* imageUrl 필드는 더 이상 설정되지 않으므로 다른 render 호출에서도 제거해야 한다.

해당 파일은 이미 파일 시스템에 저장된다. DB에 저장하면 안된다. 파일은 크기가 너무 크기 때문에 DB에 저장하고 쿼리하는 경우 비효율적이다. 대신 DB에 파일로 연결되는 경로를 저장한다. req.file 객체에서 제공되는 정보로 구축할 수 있다. 그리고 해당 데이터를 DB에 전달하면 된다. 해당 객체는 image 상수에 저장해두었다.
따라서 전체 유효성 검사를 통과한 다음에 다시 imageUrl을 생성하고 multer에서 가져오는 file 객체인 image를 사용한다. 여기엔 파일 경로를 비롯한 정보들이 포함되어 있다.
    ...
    const imageUrl = image.path;
- 이 path는 흥미롭게도 운영 체제에 있는 파일의 경로이다. 따라서 나중에 해당 이미지를 가져올 때 사용하는 경로이다. 

    const product = new Product({
        ...
        imageUrl: imageUrl,
        ...
    });
- 위에서 imageUrl에 경로를 저장하고 다시 imageUrl을 DB에 저장한다. 

제품을 생성해보면 이미지를 렌더링하지 못했다. Network 탭에서는 이미지에 대한 요청에 404 에러가 났다. 

edit-product 라우트에서 imageUrl 검증자를 제거한다.

일단 제품 편집 기능 수정을 위해 edit-product로 간다. 궁극적으로 이 페이지에 새로운 파일 피커가 있고 아무 파일도 선택하지 않으면 기존의 것을 유지하고 새 파일을 선택했을 때만 덮어쓰도록 만들자.
    const image = req.file;
여기에도 image 상수에 req.file을 저장한다. 그리고 postAddProduct와 동일한 논리로 파일을 확인할 수 있는데 정의되지 않은 경우 저장된 파일이 없을 것이다. 즉, 기존 파일을 유지하겠다는 뜻이다. 참고로 허용된 확장자 이외에도 기존 파일을 유지한다는 것을 뜻한다. 따라서 오류를 출력하거나 메시지를 반환할 필요는 없다. 
이제 에러가 발생하여 렌더링하여도 imageUrl을 전달하지 않으니 제거한다. 대신 이걸 정말로 설정하는지 확인한다.
    Product.findById(prodId)
        .then(product => {
            ...
            if (image) {
                fileHelper.deleteFile(product.imageUrl);
                product.imageUrl = image.path;
            } 
            ...
        });
    })
- 따라서 이미지가 존재하고 정의되지 않았을 때 product.imageUrl을 image.path로 설정한다. postAddProduct와 동일한 논리지만 여기서는 조건부이다.
==========================================================================================
326_정적으로 이미지 서비스

이미지가 모두 다운로드 되어 클라이언트에게 보이도록 만들려면 어떻게 해야 할까?
파일을 제공하는 옵션은 다양하다. 첫 번째는 보통 제품 이미지처럼 공개적으로 모두가 사용 가능한 파일을 다루는 경우 정적인 방식으로 images 폴더를 제공하는 것이다. 
무슨 의미일까? app.js에 가보면 이미 정적으로 express.static 미들웨어와 함께 public 폴더를 제공하고 있다. 한편 정적으로 하나 이상의 폴더를 제공할 수 있는데 정적으로 폴더를 제공한다는 것은 해당 폴더에 있는 파일에 대한 요청이 자동으로 처리되어 파일이 반환된다는 뜻이다. Express가 배후에서 무거운 작업을 모두 처리한다. 미들웨어를 복사하여 images 폴더도 정적 서비스한다.
    app.use(express.static(path.join(__dirname, 'images')));

페이지를 새로 고침해보면 실패했다. Network에서 실패한 요청을 보면 이미지를 admin/images에서 가져오려고 했다는 것을 알 수 있다. 현재 admin Products 페이지에 있기 때문에 경로의 마지막 부분만 이미지 URL로 대체된 것이다. 이런 경우 해결책은 간단하다. views 폴더 products.ejs에 이미지를 보여줄 때 보이는 것처럼 앞부분에 /를 추가해 절대 경로로 만들면 현재 경로에 덧붙여지지 않고 도메인만 있는 새 경로를 생성하며 이 경로로 렌더링된다.
    <img src="/<%= product.imageUrl %>" alt="...">
products.ejs 외에도 기본적으로 이미지를 렌더링하는 모든 곳에 /를 추가한다. 

그러나 여전히 실패하는데 이번에는 다른 이유 때문이다. 경로는 정확하지만 images 폴더에 이미지가 잘못 전달된 것이다. 정적 미들웨어를 설정한 app.js로 가보자. public이나 images 같이 특정 폴더를 입력하고 Express에게 파일이 마치 root 폴더에 있는 것처럼 해당 폴더로부터 파일을 제공하라고 알린다. 
페이지에 돌아가서 이미지를 찾으려고 했던 경로를 새로운 탭에 열어보려고 하면 당연히 찾을 수 없지만 URL에서 images를 지우면 찾을 수 있게 된다. Express가 images 폴더 안에 있는 파일을 root 폴더에서 제공한다고 가정하여 images 없이 /만 입력해야 하는 것이다.
이미지를 images 폴더에 유지하고 경로도 그대로 냅두기 위해서 미들웨어를 조정하여 요청이 /images로 시작한다면 다음과 같은 파일이 정적으로 제공한다.
    app.use('/images', express.static(path.join(__dirname, 'images')));
이때 /images를 정적 제공을 위한 폴더로 가장한다. 
==========================================================================================
327_인증한 사용자만 파일 다운로드

지난번에는 이미지를 정적 서비스하는 법을 배웠다. 항상 이미지나 공개 파일만 제공하지는 않을 것이다. 예를 들어 인보이스(거래 명세서)는 당사자만 접근할 수 있어야 한다. 
data 폴더 안에 invoices 폴더를 만든다. images나 invoices 폴더 등을 모두 root 레벨에 두지 않기 위해 data 같은 하나의 상위 폴더에 두는 것이 좋다. images 폴더는 특수한 경우로 root 레벨에 두지만 개인 데이터는 다른 곳에 있어야 하므로 data 폴더에 넣는다. 이 안에 invoice-<orderId>.pdf를 만들어 준비한다.

우선 orders.ejs 뷰에 인보이스에 대한 링크를 갖는다. 
    <h1>Order - # <%= order._id %> - <a href="/orders/<%= order._id %>">Invoice</a></h1>
    
인보이스는 개인적으로 처리해야 하므로 인보이스에 특정된 라우트를 설정하여 사용자 인증 여부를 확인한다. routes/shop.js로 가서 새 라우트를 추가한다.
    router.get('/orders/:orderId', isAuth, shopController.getInvoice);
- '/orders/:'에 invoiceId 혹은 orderId를 입력한다. 결국 invoiceId가 orderId와 같을 것이다. 
- isAuth로 인증된 사용자만 볼 수 있도록 라우트를 보호한다.

그리고 컨트롤러에 액션을 추가한다.
controllers/shop => getInvoice
    exports.getInvoice = (req, res, next) => {
        const orderId = req.params.orderId;
        const invoiceName = 'invoice-' + orderId + '.pdf';
    };
- req.params.orderId는 라우트에서 지정한 이름과 일치해야 한다.
- invoiceName에 pdf 파일의 이름을 저장한다.

이제 Node.js의 파일 시스템으로 해당 파일을 찾는다. fs 내장 모듈을 이용한다. 
    const fs = require('fs');
    const path = require('path');
    ...
    const invoicePath = path.join('data', 'invoices', invoiceName);
    fs.readFile(invoicePath, (err, data) => {

    };
- fs.readFile에 data 폴더에서 파일을 찾는데 모든 운영체제에서 작동하도록 path 코어 모듈로 구축한다. 
- path.join으로 생성하고 data 폴더에서 찾을 것이니 첫 번째 요소로 data를 입력한다. 다음은 invoices 폴더와 invoiceName을 입력하면 파일을 읽고자 하는 경로이다.
- readFile의 두 번째 인수로 파일 읽기가 끝난 후 실행할 콜백 함수를 준다. 이때 data는 버퍼 형식이다. 오류가 없다면 data는 파일이 될 것이다.
- Express 미들웨어가 제공하는 res.send를 호출하여 data를 전달한다.

이제 링크를 클릭해 다운로드하면 이름도 이상하고 확장자도 없다.
==========================================================================================
328_파일 형식 헤더 설정

브라우저에 추가적인 정보를 전달해 다른 파일 이름을 사용하고 올바른 확장자를 가지게 한다. getInvoice의 send 메서드 전에 설정한다.
controllers/shop => getInvoice
    res.setHeader('Content-Type', 'application/pdf');

코드를 추가하고 링크를 눌러보면 브라우저에 pdf가 열렸다. 대부분의 브라우저는 PDF 파일을 인라인 즉, 브라우저에 연다. 여기에 더 정보를 전달해보자.
    res.setHeader('Content-Disposition', 'inline');
- 기본값으로 변화하는게 없다.
    res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
- 인라인으로 열릴때는 변화가 없다.
    res.setHeader('Content-Disposition', 'attachment; filename="' + invoiceName + '"');
- 다운로드 메뉴가 나타나고 올바른 파일 이름과 확장자로 나타난다.
==========================================================================================
329_파일 액세스 제한

라우트에 isAuth 미들웨어가 있기 때문에 인증된 사용자만 인보이스에 접근할 수 있다. 다만 해당 주문을 한 사용자가 아니어도 모든 사용자가 볼 수 있다. 주문에는 userId가 있으니 getInvoice에 사용자를 확인하는 논리를 작성하자. 
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return next(new Error('No order found.'));
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Unauthorized'));
            }
            const invoiceName = 'invoice-' + orderId + '.pdf';
            ...
        }
    })
- 주문의 userId와 현재 로그인한 userId가 같다면 접근 권한이 있다는 뜻이다. 이 두 개의 조건문을 통과하면 파일을 읽고 출력하도록 코드를 옮긴다.
==========================================================================================
330_프리로드 데이터 vs 스트리밍 데이터

파일을 제공하는 방식을 개선하자. 현재는 파일을 읽고 읽기가 끝나면 반환하는데 크기가 작다면 괜찮지만 이런 식으로 파일을 읽으면 노드가 파일에 접근해 컨텐츠 전체를 메모리로 읽고 응답과 함께 반환한다는 뜻이다. 즉, 파일의 크기가 크다면 응답을 보내는 데 오래 걸리며 서버의 메모리가 어느 시점에 오버플로우 되어버린다. 들어오는 요청이 많아지면 모든 데이터를 메모리로 읽어오는데 한계가 있다. 다시 말해 파일 데이터를 읽어서 응답으로 제공하는 것은 좋은 방법이 아니다. 그 대신 데이터를 스트리밍 하는 방법을 사용하자.
우선 기존 readFile 코드를 모두 주석 처리한다.

    const file = fs.createReadStream(invoicePath);
- fs을 이용해 데이터를 읽어 들이기 위해 createReadStream를 사용한다. 여전히 파일 경로를 입력한다. 이렇게 하면 노드가 ReadStream을 통해 데이터 청크를 차례로 읽는다.
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(...);
- 헤더를 설정했던 응답 코드를 복사해 응답 객체에 넣는다.
    file.pipe(res);
- pipe 메서드를 사용해 읽어 들인 데이터를 res로 전달한다.
- 사실 res는 쓰기 가능한 스트림(Writeable Stream)이라 읽기 가능한 스트림(Readable Stream: createReadStream)을 사용해 출력값을 쓰기 스트림으로 전달한다. 모든 객체가 쓰기 가능한 스트림은 아닌데 응답은 쓰기 가능한 스트림 중 하나이다.

이렇게 읽기 가능 스트림인 파일 스트림을 응답으로 전달하면 응답이 데이터를 가지고 브라우저로 스트리밍 되며 데이터는 브라우저에 의해 차근차근 다운로드 된다. 크기가 큰 파일일수록 이점이 있을 것이다. 노드가 모든 데이터를 메모리로 읽지 않고 그때그때 클라이언트로 스트리밍해서 한 청크의 데이터만 저장하면 된다.

스트림과 버퍼를 다룰 때는 청크과 연관이 있다. 청크에 접근 권한을 주는 게 버퍼이다. 이 경우에는 모든 청크가 한 번에 들어오기를 기다려서 한 객체로 결합시키기보다 브라우저에 전달해 브라우저가 들어오는 데이터 조각을 하나의 최종 파일로 결합하도록 한다. 

인보이스는 전과 동일하게 보이지만 큰 파일을 전달할 때 효율적인 방법이다.
==========================================================================================
331_PDFkit을 사용한 pdf 생성

서버에서 즉시 PDF를 생성하는 보너스 방법을 알아보자. 하드코딩된 PDF 제공 대신 즉시 생성해본다.

이번에도 해당 주문이 존재하는지와 사용자의 접근이 허가되었는지 확인한다. 
Node.js 서버에서 PDF를 생성할 때 자주 사용하는 PDFkit을 설치한다. 강력한 도구이므로 공식 문서를 확인해 보는 것을 권장한다. 다만 문서에서 커피스크립트를 사용하는데 자바스크립트의 슈퍼셋과 같다. 노드에서 지원하는 것이 아니라 코드 작성의 한 도구이다. 일반 자바스크립트로 컴파일되고 읽기 어려울 수 있다.
    npm install --save pdfkit

    const PDFDocument = require('pdfkit');
- 이름은 자유롭게 해도 되지만 패키지의 실제 기능과 더 가깝다.

getInvoice에서 작업을 계속한다.
    const pdfDoc = new PDFDocument();
- pdfDoc은 읽을 수 있는 스트림에 해당한다. 
그리고 헤더를 설정한다.
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(...);

pdfDoc으로 두 가지를 할 수 있다. 먼저 결괏값을 작성 가능한 파일 스트림으로 보내기 위해 pipe 한다.
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
- createWriteStream은 파일 시스템 패키지에 호출할 수 있는 함수이다.
- 입력할 경로를 전달하는데 인보이스의 경로가 될 것이다.
이로써 우리가 생성하는 PDF가 클라이언트에게만 제공하지 않고 서버에도 저장한다. 물론 클라이언트에도 반환해야 하므로 결괏값을 response에도 pipe한다.
    pdfDoc.pipe(res);
- 응답은 쓰기 가능한 읽기 스트림이고 pdfDoc은 읽기 가능하므로 진행할 수 있다.

이렇게 설정한 상태에서 즉시 생성될 파일로 문서가 전달되도록 추가하면서 응답에도 전달하도록 한다.
    pdfDoc.text('Hell World!');
    pdfDoc.end();
- 다음으로 스트림에 쓰기가 끝났을 때 pdfDoc이 노드에 알리도록 호출한다. 
end를 호출했을 때 파일 생성과 응답 전송에 대한 이 쓰기 가능한 스트림들은 닫힘 내지는 쓰기의 완료를 파악하게 되고 파일이 저장된 뒤 응답이 전송될 것이다. 
==========================================================================================
332_주문 데이터가 있는 pdf 생성

쓸만한 pdf를 생성해 보자 

    pdfDoc.fontSize(26).text('Invoice', {
        underline: true
    });
- fontSize는 폰트 크기를 설정한다. 이후 text를 연결하여 문자열을 전달하면 해당 텍스트는 앞에서 설정한 폰트 크기를 따른다. 
- text의 두 번째 인수로 객체를 전달하고 underline 옵션을 true로 설정하면 밑줄이 그어진다.

이제 주문에 포함된 모든 제품을 루프해서 지나가게 된다.
    let totalPrice = 0;
    order.products.forEach(prod => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
            .fontSize(14)
            .text(
                prod.product.title + 
                ' - ' + 
                prod.quantity + 
                ' x ' + 
                '$' + 
                prod.product.price
            );
    });
    pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);
- for 루프를 추가하거나 간단히 액세스해도 좋다. DB에서 then 블록에 order를 가져왔기 때문에 이미 주문에 액세스하고 있으니 이걸 이용한다.
- order.products에 액세스할 수 있고 products는 배열에 해당한다. 객체들의 배열인데 이때 각 개체는 각각의 수량과 상세한 정보를 포함하는 제품 키를 갖는다. 따라서 forEach 메서드로 제품들을 루프하여 지나갈 수 있다. forEach는 자바스크립트 내장 메서드이다.
- 차세대 자바스크립트 구문의 역 따옴표(Backtick)을 사용하여 가독성 좋게 작성할 수도 있다. 여기서는 하드코딩된 값과 동적 값을 어떻게 결합하는지 이해하기 위해 기존 방식을 사용했다.
==========================================================================================
333_파일 삭제

이미지를 변경하거나 제품을 삭제할 경우 해당 제품에 속하는 파일이나 이미지는 그대로 남아있다. 물론 파일 시스템 패키지를 이용하여 지우면 되고 파일 삭제에 관한 여러 옵션도 있다. 

이를 위해 util 폴더에 file.js 파일을 생성한다.
    const fs = require('fs');
    const deleteFile = (filePath) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                throw (err);
            }
        });
    };
    exports.deleteFile = deleteFile;
- 파일 시스템 패키지를 사용하고 unlink 메서드를 사용한다. 이건 이름과 해당 이름에 연결된 파일을 삭제하므로 이 경로에 있는 파일을 삭제한다. 실패하는 경우 오류를 통해 알 수 있는 콜백이 들어온다.
- 이건 마치 파일 경로를 전달하여 파일을 삭제하게 호출하는 메서드와 같다.

이제 admin 컨트롤러에서 사용한다.
    const fileHelper = require('../util/file');
    ...
    if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
    }
- 업데이트할 이미지가 있다면 기존 imageUrl을 대체할 텐데 그 전에 기존 이미지를 삭제한다.
- 완료될 때까지 기다릴 필요 없고 다른 작업들을 진행한다. 발사 후 망각 방식(F&F)이라고 한다. 즉, 이 함수를 발동하고는 결과에 대해 신경 쓰지 않는 방식이다. 원한다면 deleteFile의 두 번째 인수로 콜백을 전달하여 이 함수의 나머지 부분이 진행되도록 할 수도 있다. 그러나 이정도만 해도 동일하다. 

제품을 삭제하는 postDeleteProduct에도 추가한다. 제품이 삭제될 때 해당 이미지를 먼저 삭제한다.
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return next(new Error('Product not found.'));
            }
            fileHelper.deleteFile(product.imageUrl);
            return Product.deleteOne({ _id: prodId, userId: req.user._id });
    }).then(...).catch(...);
- 제품 검색이 성공하고 나서 제품을 삭제하도록 해야 한다. 그렇지 않으면 검색이 끝나기도 전에 삭제가 진행되어 경쟁 상태가 일어난다. deleteOne을 검색 함수 안으로 이동하고 return하여 deleteOne이 반환하는 promise를 반환한다.

이제 제품을 삭제해보면 해당하는 제품의 이미지도 폴더에서 삭제된다. 물론 청구서를 가져오거나 주문 내역을 보는 것은 가능하다. 제품이 삭제되어도 스냅샷이 DB에 남아있기 때문이다.