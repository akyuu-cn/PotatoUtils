import { Route, Routes, Navigate, useLocation, BrowserRouter } from "react-router-dom"
import { launchpadRef } from "./components/LaunchpadController"
import { LegacyRedirect } from "./components/LegacyRedirect"
import { NotFound } from "./components/NotFound"

import TopBar from "./components/TopBar"
import Dashboard from "./routes/Dashboard"
import Launchpad from "./components/Launchpad"
import { Suspense } from "react"

import { lazyWithProgress } from "./lib/lazyWithProgress"
import { Loading } from "./components/Loading"
import Crontab from "./routes/util/crontab"
import Welcome from "./components/Welcome"
import { usePageTracker } from "./hooks/usePageTracker"
import Stats from "./routes/Stats"

const CpsTester = lazyWithProgress(() => import("./routes/util/cps-tester"))
const McColorGen = lazyWithProgress(() => import("./routes/util/mc-color-gen"))
const UuidGen = lazyWithProgress(() => import("./routes/util/uuid-gen"))
const JaKanaQuiz = lazyWithProgress(() => import("./routes/util/ja-kana-quiz"))
const Spg = lazyWithProgress(() => import("./routes/util/spg"))
const RandGen = lazyWithProgress(() => import("./routes/util/rand-gen"))
const AimeGenerator = lazyWithProgress(() => import("./routes/util/aime-generator"))
const BpmTapper = lazyWithProgress(() => import("./routes/util/bpm-tapper"))
const A1z26 = lazyWithProgress(() => import("./routes/util/a1z26"))
const Base64 = lazyWithProgress(() => import("./routes/util/base64"))
const Timestamp = lazyWithProgress(() => import("./routes/util/timestamp"))
const Hash = lazyWithProgress(() => import("./routes/util/hash"))
const Regex = lazyWithProgress(() => import("./routes/util/regex"))

function App() {
    usePageTracker()
    return (
        <>
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-foreground overflow-x-hidden">
                <TopBar />
                <main id="main-content" className="p-4 fixed inset-0 top-16 overflow-y-auto">
                    <Suspense fallback={<Loading />}>
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/stats" element={<Stats />} />


                            {/* 向后兼容 */}
                            <Route path="/utils/*" element={<LegacyRedirect />} />

                            <Route path="/util/cps-tester" element={<CpsTester />} />
                            <Route path="/util/mc-color-gen" element={<McColorGen />} />
                            <Route path="/util/uuid-gen" element={<UuidGen />} />
                            <Route path="/util/ja-kana-quiz" element={<JaKanaQuiz />} />
                            <Route path="/util/spg" element={<Spg />} />
                            <Route path="/util/rand-gen" element={<RandGen />} />
                            <Route path="/util/aime-generator" element={<AimeGenerator />} />
                            <Route path="/util/bpm-tapper" element={<BpmTapper />} />
                            <Route path="/util/a1z26" element={<A1z26 />} />
                            <Route path="/util/base64" element={<Base64 />} />
                            <Route path="/util/timestamp" element={<Timestamp />} />
                            <Route path="/util/hash" element={<Hash />} />
                            <Route path="/util/regex" element={<Regex />} />
                            <Route path="/util/crontab" element={<Crontab />} />

                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Suspense>
                </main>
                <Launchpad ref={launchpadRef} />
            </div>
            <Welcome />
        </>
    )
}

export default App
