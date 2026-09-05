function disableLoading() {
    const loading = document.getElementById("dashboardSpinner")
    const content = document.getElementById("dashboardContent")

    loading.style.display = "none"
    content.style.display = "flex"
}

async function verify() {
    const verifyRequest = await fetch("https://api.danielle-and-callum.quintondev.com/v1/auth/verify", {
        method: "POST",
        credentials: "include",
        headers: {"Content-Type":"application/json"}
    })

    if (verifyRequest.status === 500) {
        // window.location.href = "./login.html"
        console.log(500)
    }  else if (verifyRequest.status === 401) {
        // window.location.href = "./login.html"
        console.log(400)
    } else {
        disableLoading()
    }
}

verify()