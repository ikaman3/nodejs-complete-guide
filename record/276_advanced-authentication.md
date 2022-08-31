276_Advanced Authentication & Authorizaion

이메일 기능을 활용해 인증 기능을 개선한다. 앱의 보안 또는 인증 관련 사항을 전체적으로 개선하려 한다. 예를 들어 POST를 생성한 사용자만이 UPDATA할 수 있도록 하는 기능 등이다. 
============================================================================================
277_비밀번호 재설정

먼저 새로운 뷰와 라우트가 필요하다. views/auth 폴더에 reset.ejs를 추가하고 login.ejs의 form에서 email만 남긴다. 그리고 /reset으로 가는 링크를 만든다.
auth 라우트에 /reset, getReset을 추가한다.

278_토큰 논리 구현

비밀번호 재설정 링크가 포함된 이메일을 받을 예정이다. 그러려면 유효 기간이 있는 토큰을 생성해서 DB에 저장해야 한다. 그리고 우리가 클릭할 링크에 토큰이 들어있도록 해서 사용자가 해당 링크를 받았는지 확인한다. 토큰을 이메일에 넣어서 토큰이 포함된 이메일로만 비밀번호를 재설정할 수 있도록 한다.

토큰 생성부터 시작한다.
auth 컨트롤러에서 postReset 액션을 exports한다. Node.js에 내장된 암호 라이브러리가 있으므로 이를 사용한다. 
    const crypto = require('crypto');
- 안전하고 고유한 무작위 값을 생성할 수 있게 해주는 라이브러리이다.
    crypto.randomBytes(32, (err, buffer) => {})
- 무작위 바이트 값을 생성한다.
- 첫 번째 인수로 바이트의 개수를 지정한다. 
- 두 번째 인수로 완료 후 실행할 콜백함수를 입력한다. 이때 buffer는 이 바이트들의 버퍼이다. 
- 콜백함수 안에서 err를 체크하고 통과하면 유효한 버퍼를 가지게 된다.
    const token = buffer.toString('hex');
- 이 버퍼로부터 토큰을 생성할 수 있다. 버퍼가 16진수 값을 저장하므로 hex를 입력한다. 이것은 16진법 값을 일반 아스키 문자로 변환하는데 toString에서 필요한 정보이다.

이 토큰은 DB에 저장해야하고 사용자 객체에도 저장해야 한다. user 모델에서 resetToken, resetTokenExpriation 필드를 추가한다.
    resetToken: String,
    resetTokenExpriation: Date,
- 재설정을 요청한 경우에만 토큰이 필요하기 때문에 필수가 아니다. 

다시 auth로 돌아와서 이 토큰이 필요한 사용자에 저장한다. 먼저 사용자를 찾아야 하는데 Mongoose의 user 모델을 사용한다. 
    User.findOne({ email: req.body.email })
- email이 재설정하려는 이메일과 일치하는 user 하나를 찾는다. reset 뷰에 email 필드가 있으므로 request body에서 찾을 수 있다. 
then, catch를 추가하고 then에서 user를 얻는다. 존재하지 않는다면 undefined이다. 따라서 user가 있는지 체크하고 없다면 req.flash로 에러 메시지를 남기고 리다이렉트한다.
    user.resetToken = token;
    user.resetTokenExpriation = Date.now() + 3600000;
    return user.save();
- resetToken을 위에서 생성한 token으로 설정한다.
- resetTokenExpriation은 현재 시점에서 한 시간 뒤로 설정한다. 이때 ms 단위로 입력하기 때문에 3600000이면 1 시간이다.
- user.save를 호출하여 DB에 업데이트한다. 그리고 return하여 then 호출을 하나 더 연결한다.

그리고 리다이렉트와 이메일 발송을 진행한다.
    res.redirect('/');
    transporter.sendMail({
        to: req.body.email
        ...
        html: `
            <p>You requested a a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
        `
    });
- backtick 구문을 사용하고 있으므로 ${} 구문을 이용해 값을 동적으로 내장한다. 나중에 이 토큰을 DB에서 검색하여 이 링크가 우리가 보낸 것임을 확인할 예정이므로 url에 포함한다.

마지막으로 auth 라우트에 postReset을 추가한다.
============================================================================================
280_비밀번호 재설정 양식 작성

토큰을 만들었으니 사용자가 새 비밀번호를 입력할 수 있는 폼을 만든다. views/auth 폴더에 new-password.ejs를 생성하고 login.ejs의 form에서 password 필드만 남긴다. 

이제 auth 컨트롤러에 getNewPassword 액션을 만든다. 플래시 메시지를 추출하고 뷰를 렌더링하는 것은 다른 액션과 같다. 다만 토큰이 있는 url에 대해 로딩할 페이지이기 때문에 토큰을 확인한다.
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpriation: {$gt: Date.now()} })
- 토큰에 맞는 사용자를 찾는다. 토큰은 추측 불가능하도록 무작위로 생성되므로 아무 토큰이나 입력하여 다른 사용자의 비밀번호를 편집할 수는 없다. 설령 알아낸다 해도 그에 맞는 이메일 주소를 알 수 없다.
- resetToken과 token이 같은 경우를 찾는다. 
- 그리고 데이터 관점에서도 여전히 유효한지 확인하기 위해 resetTokenExpriation를 오늘 날짜와 시간보다 높은지 비교한다. 중괄호로 둘러싸인 특별한 연산자를 사용한다. $gt는 크다는 뜻(greater)이고 이를 now와 비교한다.
- 두 조건을 합치면 토큰이 일치하고 토큰의 유효기간이 현재보다 큰 경우 즉, 토큰 만료 시점이 미래인 경우에만 원하는 사용자를 찾는다. 

    userId: user._id.toString(),
이후 새로운 비밀번호를 저장할 post 요청에 필요할 userId를 뷰에 전달한다.

    router.get('/reset/:token', authController.getNewPassword);
- auth 라우트에 getNewPassword 컨트롤러 액션을 추가한다. 이때 경로는 reset이며 token이 있어야 한다. 따라서 url이 재설정되며 동적 매개변수인 token이 오게 된다. 
============================================================================================
281_비밀번호 업데이트 논리 추가

    User.findOne({ 
        resetToken: passwordToken, 
        resetTokenExpriation: {$gt: Date.now()}, 
        _id: userId 
    })
auth 컨트롤러에 postNewPassword 액션을 추가한다. req.body에서 새로운 비밀번호와 userId 그리고 토큰을 추출한다. 그리고 위에서 한 것과 같은 논리로 사용자를 찾는데 추가로 _id가 userId와 같아야 한다.

then 블록에서 user를 얻고 새로운 비밀번호를 해시화한다. 그리고 return하고 then 블록을 추가하는데 user는 첫 번째 then 함수의 인수이고 다음 함수에서도 액세스가 가능하려면 PostNewPassword 자체에 resetUser 변수가 필요하다.
    let resetUser;
    ...
    resetUser = user;

그리고 새로운 비밀번호를 DB에 저장하고 resetToken과 유효 기간은 undefined로 저장한다. 
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpriation = undefined;

save를 호출하고 return하여 다음 then 블록에서 리다이렉트 한다. 원한다면 재설정되었음을 확인하는 메일을 보내도 좋다.
============================================================================================
282_권한이 필요한 이유

권한을 부여한다는 것은 인증된 모든 사용자가 모든 일을 할 수 있게 하지는 않겠다는 뜻이다. 지금 앱에서 A와 B 사용자가 있다고 가정하자. 현재 A가 생성한 제품을 B가 편집, 삭제할 수 있는데 반대도 가능하다. 

283_권한 추가

권한은 어떻게 부여할까? 등록된 상품을 다른 계정으로 편집 및 삭제하지 못하게 하려 한다. 상품에는 중요한 정보가 저장되어 있는데 바로 생성한 사용자이다. 따라서 최종적으로는 편집 및 삭제를 허용하기 전에 현재 로그인한 사용자가 상품을 생성한 사용자가 맞는지 확인하는 것이 목표이다. 

admin 컨트롤러의 getProducts 액션에서 현재 사용자가 생성하지 않은 상품을 표시하는 것은 말이 안되고 로그인된 사용자만 상품 관리 페이지를 봐야 한다. 권한 부여는 반환하는 데이터를 제한하는 식으로 구현할 수 있다. 
    Product.find({ userId: req.user._id })
- app.js에서 별도의 미들웨어로 user을 추출했기 때문에 req.user가 존재함을 기억하자. 

============================================================================================
284_액션에 보호 추가

이제 자신의 상품이 아니면 admin 페이지에서 볼 수 없다. 그러나 여전히 새로운 페이지를 생성해 요청을 보냄으로써 다른 상품을 삭제하려는 시도가 가능하다. 따라서 postEditProduct나 postDeleteProduct 같은 post 액션에 보호를 추가해야 한다.  

controllers/admin => postEditProduct
    if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');   
    }
- 여기서 return하고 리다이렉트하여 밑의 코드가 실행되지 못하도록 한다. 
    ...
    return product.save().then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
    });
- 위에서 리다이렉트하더라도 다음 then 블록이 실행되므로 save에 then을 연결한다. 중첩 then 블록으로 의도하지 않은 코드 실행을 막는다.

postDeleteProduct에도 작업을 해야한다. findByIdAndRemove를 deleteOne을 사용하면 된다. _id가 prodI와 같고, userId가 req.user._id와 같으면 삭제한다.