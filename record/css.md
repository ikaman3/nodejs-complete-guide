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