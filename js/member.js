document.getElementById("signupBtn").addEventListener("click", async ()=>{
    const email=document.getElementById("email").value;
    const pwd=document.getElementById("pwd").value;
    const nickname=document.getElementById("nickname").value;

    const data={email,pwd,nickname};

    const response=await axios.post("http://localhost:8080/insertMember" , data);

    document.getElementById("effetMsg").innerHTML = response.data;
});

document.getElementById("loginBtn").addEventListener("click", async () => {  
    const email = document.getElementById("loginEmail").value;
    const pwd = document.getElementById("loginPwd").value;
    const data = {  email, pwd };
    const response=await axios.post("http://localhost:8080/login" , data);
    console.log(response.data);
    alert(response.data.nickname+"님 반갑습니다");
  });