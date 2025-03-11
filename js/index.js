window.onload = async () => {
 

  let response = await axios.get("http://localhost:8080/getAllProducts");
  console.log(response);
  let productList = response.data;
  let productListDiv = ``;

  productList.forEach((item) => {
    productListDiv += `<div class="card m-3" style="width: 10rem;">
        <img src="img/${item.pimg}" class="card-img-top" alt="...">
       
        <div class="card-body">
          <b class="card-title">${item.prodname}</b>
          <a href="#" class="review-link" data-product-id="${item.prodcode}" 
          data-bs-toggle="modal" data-bs-target="#commentModal"> 
            <img src="img/review.png" alt="review"> 
          </a>
          <p class="card-text text-danger">${item.price}원</p>   
          <a href="#" class="btn btn-outline-info">장바구니 담기</a>
        </div>
      </div>`;
  });

  document.getElementById("productListDiv").innerHTML = productListDiv;

  // 모달 열기 이벤트 리스너
  let prodcode;
  const reviewLinks = document.querySelectorAll(".review-link");
  reviewLinks.forEach((link) => {
    link.addEventListener("click", async (event) => {
      prodcode = link.getAttribute("data-product-id"); // 클릭한 제품의 ID 가져오기
      try {
        const reviewsResponse = await axios.post(
          "http://localhost:8080/getRecentReviews",
          { prodcode }
        );
        const reviews = reviewsResponse.data;
        console.log(reviews);

        // 모달 본문에 리뷰 표시
        let reviewListDiv = `<ul>`;
        reviewListDiv += reviews
          .map((item) => `<li>${item.review}</li>`)
          .join("");
        reviewListDiv += `</ul>`;
        document.getElementById("commentModalBody").innerHTML = reviewListDiv;
      } catch (error) {
        console.error("리뷰를 가져오는 데 오류가 발생했습니다:", error);
        document.getElementById("commentModalBody").innerHTML =
          "리뷰를 불러오는 데 오류가 발생했습니다.";
      }
    });
  });

  // 댓글 남기기 버튼 클릭 시 처리
  document
    .getElementById("submitComment")
    .addEventListener("click", async () => {
      const review = document.getElementById("commentTextarea").value;
      const nickname = sessionStorage.getItem("nickname");
      console.log(nickname, prodcode, review);
      if (review && prodcode) {
        try {
          await axios.post("http://localhost:8080/insertReview", {
            nickname,
            prodcode,
            review,
          });
          document.getElementById("commentTextarea").value = ""; // 댓글 입력창 초기화
          alert("후기가 등록되었습니다!");
          // 모달 닫기
          const modal = bootstrap.Modal.getInstance(
            document.getElementById("commentModal")
          );
          modal.hide();
        } catch (error) {
          console.error("후기를 등록하는 데 오류가 발생했습니다:", error);
          alert("후기를 등록하는 데 오류가 발생했습니다.");
        }
      } else {
        alert("후기를 입력해주세요.");
      }
    });
};
