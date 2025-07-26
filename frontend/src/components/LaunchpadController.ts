import { createRef } from "react"

export const launchpadRef = createRef<{ show: () => void; hide: () => void; status: boolean }>()

let isAnimating = false

let locationBefore = ""

export function showLaunchpad() {
    if (isAnimating) return
    isAnimating = true

    document.getElementById("main-content")!.classList.add("main-panel-animation-out")
    document.getElementById("launchpad")!.classList.add("launchpad-animation-in")
    setTimeout(() => {
        document.getElementById("main-content")!.classList.remove("main-panel-animation-out")
        document.getElementById("launchpad")!.classList.remove("launchpad-animation-in")
        document.getElementById("main-content")!.style.display = "none"
        isAnimating = false
    }, 350)
    launchpadRef.current?.show()
    locationBefore = window.location.href
}

export function hideLaunchpad() {
    if (isAnimating) return
    isAnimating = true

    document.getElementById("main-content")!.classList.add("main-panel-animation-in")
    document.getElementById("launchpad")!.classList.add("launchpad-animation-out")
    setTimeout(() => {
        document.getElementById("main-content")!.classList.remove("main-panel-animation-in")
        document.getElementById("launchpad")!.classList.remove("launchpad-animation-out")
        launchpadRef.current?.hide()
        isAnimating = false
    }, 300)
    document.getElementById("main-content")!.style.display = "block"
}

export function getLaunchpadStatus() {
    return launchpadRef.current?.status
}