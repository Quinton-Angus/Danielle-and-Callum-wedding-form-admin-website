const hamburgerMenuOpenBtn = document.getElementById("headerMobileHamburger")
const headerMobile = document.getElementById("headerMobile")
const headerMobileHamburgerClose = document.getElementById("headerMobileHamburgerClose")

hamburgerMenuOpenBtn.addEventListener('click', () => {
    console.log("ok")
    headerMobile.classList.remove("headerMobileDeactivated")
    headerMobile.classList.add("headerMobileActivated")
    console.log(headerMobile.classList)
})

headerMobileHamburgerClose.addEventListener("click", () => {
    headerMobile.classList.remove("headerMobileActivated")
    headerMobile.classList.add("headerMobileDeactivated")
})

const submitBtn = document.getElementById("submitBtn")

const loadingTxt = document.getElementById("submitTxt")
const loadingSpinner = document.getElementById("submitSpinner")

function enableLoading() {
    loadingTxt.style.display = "none"
    loadingSpinner.style.display = "flex"
    submitBtn.style.cursor = "wait"
}

function disableLoading() {
    loadingTxt.style.display = "flex"
    loadingSpinner.style.display = "none"
    submitBtn.style.cursor = "pointer"
}

function logError(code, message) {
    const error = document.getElementById("error")

    error.innerHTML = `Error ${code} - ${message}`
}

function disableInputs() {

    const email = document.getElementById("emailInput")
    const password = document.getElementById("passwordInput")

    email.disabled = true
    password.disabled = true

}

function enableInputs() {

    const email = document.getElementById("emailInput")
    const password = document.getElementById("passwordInput")

    email.disabled = false
    password.disabled = false

}

submitBtn.addEventListener("click", async () => {

    disableInputs()
    enableLoading()

    const email = document.getElementById("emailInput")
    const password = document.getElementById("passwordInput")

    const authRequest = await fetch("https://api.danielle-and-callum.quintondev.com/v1/auth/login", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            data: {
                email: email.value,
                password: password.value
            }
        })
    })

    if (authRequest.status === 500) {
        logError(500, "Internal server error, try again later.")
        enableInputs()
        disableLoading()
    } else if (authRequest.status === 400) {
        logError(400, "Invalid login request, check your details and try again.")
        enableInputs()
        disableLoading()
    } else if (authRequest.status === 401) {
        logError(401, "Invalid login credentials, check your details and try again.")
        enableInputs()
        disableLoading()
    } else {
        window.location.href = "./dashboard.html"
    }
})