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