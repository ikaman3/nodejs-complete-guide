CSS 관련 팁 모아두는 파일

이미지 사이즈 조절
    <div class="image">
        <img src="<%= product.imageUrl %>" alt="<%= product.title %>">
    </div>

    .image {
    height: 20rem;
    }

    .image img {
    height: 100%;
    }

265_오류 메시지 스타일링

    <% if (errorMessage) { %>
            <div class="user-message user-message--error"><%= errorMessage %></div>
    <% } %>
- CSS 클래스를 부여한다. 이름은 user-message와 user-message--error 인데 BEM 스타일링을 사용한 것이다. 전자는 전체적인 알림의 모습, 후자는 오류에 대한 클래스이다.
- BEM 스타일링: CSS 스타일링 또는 클래스 이름에 대한 컨벤션이다. 

main css 아래쪽에 코드를 추가한다.
public/css/main =>
    .user-message {
        margin: auto; 
- user-message를 가운데로 오게 한다.
        width: 90%;
        border: 1px solid #4771fa;
        padding: 0.5rem;
        border-radius: 3px;
        background: #b9c9ff;
- 일반 정보 알림은 푸른색 계열의 중립적인 색으로 한다. 
        text-align: center;
    }

    .user-message--error {
        border-color: red;
        background: rgb(255, 176, 176);
        color: red;
    }
    ...
    @media (min-width: 768px) {
        ...
        .user-message {
            width: 30rem;
        }
- 큰 화면에서 볼 때를 고려한 스타일링
    }
============================================================================================
298_조건부 CSS 클래스

프로트엔드 측에서 더 많은 작업을 할 수 있다. 예를 들어 유효하지 않은 값 주의에 빨간 경계선을 나타내는 등이다. 받은 정보를 뷰로 전달해 정보에 따라 다르게 렌더링하면 된다. 
postSignup 액션에서 errors 배열을 출력하고 있다. 이 배열은 문제 되는 모든 필드를 포함한다. 다른 키를 전달해 errors.array()로 설정한다.
    res.render('auth/signup', {
        ...
        validationErrors: errors.array()
    });
- render 함수 안에 전체 배열이 반환된다. 오류 메시지뿐만 아니라 전체 오류 배열도 반환되는 것이다.

getSignup에는 에러가 없기 때문에 빈 배열을 입력한다.
    validationErrors: []

이제 프론트엔드에서 오류 유무에 따라 스타일링을 변경한다. class 속성에 ejs 구문을 이용한다.
    class="<%= validationErrors.find(e => e.param === 'email') ? 'invalid' : '' %>"
- 방금 다뤘던 validationErrors에 배열에 호출할 수 있는 내장 자바스크립트 메서드인 find를 호출한다. e 객체 안에는 문제 있는 입력값의 이름을 가진 param 필드가 있다. 

그럼 forms.css에 스타일링을 추가한다. CSS의 작동 방식 때문에 form-control input이 invalid 클래스를 가질 때라고 정확히 입력해야 한다.
    .form-control input.invalid, 
    .form-control textarea.invalid {
        border-color: red;
    }

나머지 input도 동일한 방식으로 개선한다.