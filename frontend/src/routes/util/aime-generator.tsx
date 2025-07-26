import utils from "@/static/utils.json"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"


export default function AimeGenerator() {
    const ID = "aime-generator"
    const UTIL = utils.find(u => u.id === ID)

    const [outputFull, setOutputFull] = useState("")
    const [copyIconFull, setCopyIconFull] = useState("content_copy")
    const [outputArray, setOutputArray] = useState("")
    const [copyIconArray, setCopyIconArray] = useState("content_copy")

    function genSingle() {

        const allchar = "0123456789"
        let length = 20
        let str1 = ""
        for (let i = 0; i < length; i++) {
            str1 += allchar[getRandomNumber(0, allchar.length - 1)]
        }
        setOutputFull(str1)

        let str2 = ""
        str2 += "{"
        for (let i = 0; i < 10; i++) {
            str2 += parseInt(str1[2 * i] + str1[(2 * i) + 1], 16)
            str2 += ","
        }
        str2 = str2.substring(0, str2.length - 1)
        str2 += "}"
        setOutputArray(str2)

        function getRandomNumber(min: number, max: number) {
            return Math.floor(Math.random() * (max - min + 1)) + min
        }

    }

    useEffect(() => {
        genSingle()
    }, [])

    if (!UTIL) { return null }

    return (
        <div className="mx-auto w-full max-w-screen-lg">

            <Helmet>
                <title>{UTIL.name} - Potato Utils</title>
                <meta name="description" content={UTIL.description} />
            </Helmet>

            <Card className="card mb-4">
                <h1 className="flex items-center">
                    <span className="material-symbols-outlined mr-2">{UTIL.icon}</span>
                    {UTIL.name}
                </h1>
                <div className="mt-2 opacity-75">
                    一键生成 AIME 卡号及其数组形式。
                </div>
            </Card>

            <Card className="card mb-4">
                <h2 className="flex items-center mb-8!">
                    <span className="material-symbols-outlined mr-2">controller_gen</span>
                    生成
                </h2>
                <Button variant="outline" className="mr-auto mb-6" onClick={() => { genSingle() }}>
                    <span
                        className="material-symbols-outlined"
                    >refresh</span>
                    重新生成
                </Button>
                <div className="flex items-center gap-2 mb-4">
                    <Button variant="outline" size="icon" className="material-symbols-animated-parent" onClick={() => {
                        navigator.clipboard.writeText(outputFull)
                        setCopyIconFull("check")
                        setTimeout(() => {
                            setCopyIconFull("content_copy")
                        }, 1000)
                    }}>
                        <span
                            className="material-symbols-outlined material-symbols-animated"
                        >{copyIconFull}</span>
                    </Button>

                    <code className="opacity-90 text-2xl ml-4">{outputFull}</code>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="material-symbols-animated-parent" onClick={() => {
                        navigator.clipboard.writeText(outputArray)
                        setCopyIconArray("check")
                        setTimeout(() => {
                            setCopyIconArray("content_copy")
                        }, 1000)
                    }}>
                        <span
                            className="material-symbols-outlined material-symbols-animated"
                        >{copyIconArray}</span>
                    </Button>

                    <code className="opacity-90 text-2xl ml-4">{outputArray}</code>
                </div>
            </Card>

        </div>

    )
}
