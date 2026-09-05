function enableLoading() {
    const loading = document.getElementById("dashboardSpinner")
    const content = document.getElementById("dashboardContent")
    const header = document.getElementsByTagName("header")[0]
    const footer = document.getElementsByTagName("footer")[0]

    content.style.display = "none"
    header.style.display = "none"
    footer.style.display = "none"

    loading.style.display = "flex"
}

function disableLoading() {
    const loading = document.getElementById("dashboardSpinner")
    const content = document.getElementById("dashboardContent")
    const header = document.getElementsByTagName("header")[0]
    const footer = document.getElementsByTagName("footer")[0]

    loading.style.display = "none"

    content.style.display = "flex"
    header.style.display = "flex"
    footer.style.display = "flex"
}

async function verify() {

    enableLoading()

    const verifyRequest = await fetch("https://api.danielle-and-callum.quintondev.com/v1/auth/verify", {
        method: "POST",
        credentials: "include",
        headers: {"Content-Type":"application/json"}
    })

    console.log(verifyRequest)

    if (verifyRequest.status === 500) {
        window.location.href = "./login.html"
    }  else if (verifyRequest.status === 401) {
        window.location.href = "./login.html"
    } else {
        disableLoading()
    }
}

verify()

async function exportToPDF() {
    enableLoading()

    const dataRequest = await fetch("https://api.danielle-and-callum.quintondev.com/v1/data", {
        method: "POST",
        credentials: "include",
        headers: {"Content-Type":"application/json"}
    })

    if (dataRequest.status === 401) {
        window.location.href = "./login.html"
    } else if (dataRequest.status === 500) {
        console.log(dataRequest)
        disableLoading()
    } else if (dataRequest.status === 200) {
        const data = await dataRequest.arrayBuffer()
        console.log(new Uint8Array(data))
        disableLoading()
    } else {
        console.log(dataRequest)
        disableLoading()
    }
}

const exportToPDFbtn = document.getElementById("exportToPDFbtn")

exportToPDFbtn.addEventListener("click", exportToPDF)
