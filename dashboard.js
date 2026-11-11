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

async function verify() {
    enableLoading()
    try {
        const verifyRequest = await fetch("https://api.danielle-and-callum.quintondev.com/v1/auth/verify", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        })
        if (verifyRequest.status === 200) {
            disableLoading()
            return
        }
        if (verifyRequest.status === 401) {
            window.location.href = "./login.html"
            return
        }
        console.error("Authentication verification failed:", verifyRequest.status)
        window.location.href = "./login.html"
    } catch (err) {
        console.error("Authentication verification failed:", err)
        window.location.href = "./login.html"
    }
}

async function exportToPDF() {
    enableLoading()
    try {
        const dataRequest = await fetch("https://api.danielle-and-callum.quintondev.com/v1/data", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        })
        if (dataRequest.status === 401) {
            window.location.href = "./login.html"
            return
        }
        if (!dataRequest.ok) {
            console.error("Failed to retrieve guest data:", dataRequest.status)
            return
        }
        const jsonData = await dataRequest.json()
        if (jsonData.status !== true || !Array.isArray(jsonData.data)) {
            console.error("API returned an invalid data response:", jsonData)
            return
        }
        sessionStorage.setItem("weddingGuestReportData", JSON.stringify(jsonData.data))
        window.location.href = "./report.html"
    } catch (err) {
        console.error("Guest data request failed:", err)
    } finally {
        disableLoading()
    }
}

function enableLoading() {
    const loading = document.getElementById("dashboardSpinner")
    const content = document.getElementById("dashboardContent")
    const header = document.getElementsByTagName("header")[0]
    const footer = document.getElementsByTagName("footer")[0]
    if (content) content.style.display = "none"
    if (header) header.style.display = "none"
    if (footer) footer.style.display = "none"
    if (loading) loading.style.display = "flex"
}

function disableLoading() {
    const loading = document.getElementById("dashboardSpinner")
    const content = document.getElementById("dashboardContent")
    const header = document.getElementsByTagName("header")[0]
    const footer = document.getElementsByTagName("footer")[0]
    if (loading) loading.style.display = "none"
    if (content) content.style.display = "flex"
    if (header) header.style.display = "flex"
    if (footer) footer.style.display = "flex"
}

const exportToPDFbtn = document.getElementById("exportToPDFbtn")
exportToPDFbtn?.addEventListener("click", exportToPDF)

const emailExportDialog = document.getElementById("emailExportDialog")
const emailExportForm = document.getElementById("emailExportForm")
const emailRecipient = document.getElementById("reportRecipient")
const emailExportStatus = document.getElementById("emailExportStatus")
const sendEmailExport = document.getElementById("sendEmailExport")
const cancelEmailExport = document.getElementById("cancelEmailExport")
const exportToEmailBtn = document.getElementById("exportToEmailBtn")

function openEmailExport() {
    if (!emailExportDialog) return
    emailExportStatus.textContent = ""
    emailExportStatus.className = "emailExportStatus"
    sendEmailExport.disabled = false
    sendEmailExport.textContent = "Send report"
    emailExportDialog.hidden = false
    emailRecipient?.focus()
}

function closeEmailExport() {
    if (!emailExportDialog) return
    emailExportDialog.hidden = true
    emailExportForm?.reset()
    emailExportStatus.textContent = ""
    emailExportStatus.className = "emailExportStatus"
}

exportToEmailBtn?.addEventListener("click", openEmailExport)
cancelEmailExport?.addEventListener("click", closeEmailExport)
emailExportDialog?.addEventListener("click", event => {
    if (event.target === emailExportDialog) closeEmailExport()
})

emailExportForm?.addEventListener("submit", async event => {
    event.preventDefault()
    const email = emailRecipient?.value.trim() ?? ""
    if (!email || !emailRecipient.checkValidity()) {
        emailRecipient?.reportValidity()
        return
    }

    sendEmailExport.disabled = true
    sendEmailExport.textContent = "Sending…"
    emailExportStatus.textContent = "Preparing the guest report and sending the email…"
    emailExportStatus.className = "emailExportStatus isPending"

    try {
        const response = await fetch("https://api.danielle-and-callum.quintondev.com/v1/email-results", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: { email } })
        })

        if (response.status === 401) {
            window.location.href = "./login.html"
            return
        }

        const result = await response.json().catch(() => null)
        if (!response.ok || result?.status !== true) {
            const message = result?.error || "The report could not be sent. Please try again."
            emailExportStatus.textContent = message
            emailExportStatus.className = "emailExportStatus isError"
            sendEmailExport.disabled = false
            sendEmailExport.textContent = "Try again"
            return
        }

        const count = result.data?.guestCount ?? 0
        emailExportStatus.textContent = "Report sent successfully to " + email + " (" + count + " guest entries)."
        emailExportStatus.className = "emailExportStatus isSuccess"
        sendEmailExport.textContent = "Sent"
    } catch (err) {
        console.error("Guest report email failed:", err)
        emailExportStatus.textContent = "Unable to contact the API. Check your connection and try again."
        emailExportStatus.className = "emailExportStatus isError"
        sendEmailExport.disabled = false
        sendEmailExport.textContent = "Try again"
    }
})

verify()
