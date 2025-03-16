document.getElementById("signupBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const pwd = document.getElementById("pwd").value;
  const nickname = document.getElementById("nickname").value;

  const data = { email, pwd, nickname };

  const response = await axios.post("http://localhost:8080/insertMember", data);

  document.getElementById("effetMsg").innerHTML = response.data;
  const modal = bootstrap.Modal.getInstance(document.getElementById("signupModal"));
  document.getElementById("signupModal").setAttribute("aria-hidden", "true");
  modal.hide();
  //window.location.reload();
});

// document.getElementById("loginBtn").addEventListener("click", async () => {
//     const email = document.getElementById("loginEmail").value;
//     const pwd = document.getElementById("loginPwd").value;
//     const data = {  email, pwd };
//     const response=await axios.post("http://localhost:8080/login" , data);
//     console.log(response.data);
//     alert(response.data.nickname+"님 반갑습니다");
//   });

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value;
  const pwd = document.getElementById("loginPwd").value;
  const data = { email, pwd };
  const response = await axios.post("http://localhost:8080/tokenLogin", data);

  const token = response.data.Authorization;
  console.log("Authorization:", token);
  if (token && response.data.nickname) {
    sessionStorage.setItem("Authorization", token);
    sessionStorage.setItem("nickname", response.data.nickname);
    axios.defaults.headers.common["Authorization"] = token; // Authorization 헤더 설정
    // 모달 닫기
    const modal = bootstrap.Modal.getInstance(document.getElementById("loginModal"));
    loginModal.setAttribute("aria-hidden", "true");
    modal.hide();
    window.location.reload();
  } else {
    alert("다시 로그인 해주세요");
  }
});

let Authorization = sessionStorage.getItem("Authorization");
const nickname = sessionStorage.getItem("nickname");
let email;
if (Authorization && nickname) {
  axios.defaults.headers.common["Authorization"] = Authorization; // Authorization 헤더 설정
  document.getElementById("loginSpan").innerHTML = `${nickname}  
  <button class="btn btn-danger btn-sm" id="logoutBtn">Logout</button>`;
} else {
  Authorization = getCookie("Authorization");
  email = getCookie("email");
  if (Authorization && email) {
    axios.defaults.headers.common["Authorization"] = Authorization; // Authorization 헤더 설정
    document.getElementById("loginSpan").innerHTML = `${email}  
    <button class="btn btn-danger btn-sm" id="logoutBtn">Logout</button>`;
  }
}

document.getElementById("loginSpan").addEventListener("click", async (event) => {
  if (event.target.id == "logoutBtn") {
    await axios.post("http://localhost:8080/logout");
    sessionStorage.removeItem("nickname");
    sessionStorage.removeItem("Authorization");
    axios.defaults.headers.common["Authorization"] = ""; // Authorization 헤더에서 삭제

    // 쿠키 삭제
    removeCookie("Authorization");
    removeCookie("email");

    window.location.reload();
  }
});

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function removeCookie(cname) {
  document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
