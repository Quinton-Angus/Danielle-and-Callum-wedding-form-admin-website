const hamburgerMenuOpenBtn = document.getElementById("headerMobileHamburger")
const headerMobile = document.getElementById("headerMobile")
const headerMobileHamburgerClose = document.getElementById("headerMobileHamburgerClose")

hamburgerMenuOpenBtn?.addEventListener("click", () => {
    headerMobile?.classList.remove("headerMobileDeactivated")
    headerMobile?.classList.add("headerMobileActivated")
})

headerMobileHamburgerClose?.addEventListener("click", () => {
    headerMobile?.classList.remove("headerMobileActivated")
    headerMobile?.classList.add("headerMobileDeactivated")
})

const submitBtn = document.getElementById("submitBtn")
const loadingTxt = document.getElementById("submitTxt")
const loadingSpinner = document.getElementById("submitSpinner")

function enableLoading() {
    if (loadingTxt) loadingTxt.style.display = "none"
    if (loadingSpinner) loadingSpinner.style.display = "flex"
    if (submitBtn) {
        submitBtn.style.cursor = "wait"
        submitBtn.style.pointerEvents = "none"
    }
}

function disableLoading() {
    if (loadingTxt) loadingTxt.style.display = "flex"
    if (loadingSpinner) loadingSpinner.style.display = "none"
    if (submitBtn) {
        submitBtn.style.cursor = "pointer"
        submitBtn.style.pointerEvents = "auto"
    }
}

function logError(code, message) {
    const error = document.getElementById("error")
    if (error) error.textContent = `Error ${code} - ${message}`
}

function disableInputs() {
    document.getElementById("emailInput")?.setAttribute("disabled", "true")
    document.getElementById("passwordInput")?.setAttribute("disabled", "true")
}

function enableInputs() {
    document.getElementById("emailInput")?.removeAttribute("disabled")
    document.getElementById("passwordInput")?.removeAttribute("disabled")
}

submitBtn?.addEventListener("click", async () => {
    const email = document.getElementById("emailInput")?.value.trim() ?? ""
    const password = document.getElementById("passwordInput")?.value ?? ""

    if (!email || !password) {
        logError(400, "Please enter your email and password.")
        return
    }

    disableInputs()
    enableLoading()

    try {
        const authRequest = await fetch("https://api.danielle-and-callum.quintondev.com/v1/auth/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: { email, password } })
        })

        if (authRequest.status === 200) {
            window.location.href = "./dashboard.html"
            return
        }

        if (authRequest.status === 400) {
            logError(400, "Invalid login request, check your details and try again.")
        } else if (authRequest.status === 401) {
            logError(401, "Invalid login credentials, check your details and try again.")
        } else {
            logError(authRequest.status, "Unable to sign in right now, please try again later.")
        }
    } catch (err) {
        console.error("Login failed:", err)
        logError("NETWORK", "Unable to contact the server, please check your connection and try again.")
    } finally {
        disableLoading()
        enableInputs()
    }
})
