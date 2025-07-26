import utils from "@/static/utils.json"

import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"

export default function UuidGen() {
    const ID = "uuid-gen"
    const UTIL = utils.find(u => u.id === ID)

    const [count, setCount] = useState(10)

    const [outputSingle, setOutputSingle] = useState(crypto.randomUUID())
    const [outputMulti, setOutputMulti] = useState("")

    const [copyIconSingle, setCopyIconSingle] = useState("content_copy")
    const [copyIconMulti, setCopyIconMulti] = useState("content_copy")

    const genSingle = () => {
        setOutputSingle(crypto.randomUUID())
    }

    const genMulti = () => {
        if (count <= 0) {
            setOutputMulti("")
        } else if (count > 1000) {
            setOutputMulti("diannaobaozhale")
        } else {
            setOutputMulti(Array.from({ length: count }).map(() => crypto.randomUUID()).join("\n"))
        }
    }

    useEffect(() => {
        genMulti()
    }, [count])

    if (!UTIL) { return null }

    return (
        <div className="mx-auto w-full max-w-screen-lg">

            <Card className="card mb-4">
                <h1 className="flex items-center">
                    <span className="material-symbols-outlined mr-2">{UTIL.icon}</span>
                    {UTIL.name}
                </h1>
                <div className="mt-2 opacity-75">
                    UUID V4（随机 UUID）在线生成器
                </div>
            </Card>

            <Card className="card mb-4">
                <h2 className="flex items-center mb-8!">
                    <span className="material-symbols-outlined mr-2">looks_one</span>
                    单个 UUID 生成
                </h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="" onClick={() => { genSingle() }}>
                        <span
                            className="material-symbols-outlined"
                        >refresh</span>
                    </Button>
                    <Button variant="outline" size="icon" className="material-symbols-animated-parent" onClick={() => {
                        navigator.clipboard.writeText(outputSingle)
                        setCopyIconSingle("check")
                        setTimeout(() => {
                            setCopyIconSingle("content_copy")
                        }, 1000)
                    }}>
                        <span
                            className="material-symbols-outlined material-symbols-animated"
                        >{copyIconSingle}</span>
                    </Button>
                    
                    <code className="opacity-90 text-2xl ml-4">{outputSingle}</code>
                </div>
            </Card>

            <Card className="card">
                <h2 className="flex items-center mb-8!">
                    <span className="material-symbols-outlined mr-2">list_alt</span>
                    批量 UUID 生成
                </h2>
                <div className="flex items-center gap-2 mb-4">


                    <Button variant="outline" size="icon" className="" onClick={() => { genMulti() }}>
                        <span
                            className="material-symbols-outlined"
                        >refresh</span>
                    </Button>

                    <Button variant="outline" size="icon" className="material-symbols-animated-parent" onClick={() => {
                        navigator.clipboard.writeText(outputMulti)
                        setCopyIconMulti("check")
                        setTimeout(() => {
                            setCopyIconMulti("content_copy")
                        }, 1000)
                    }}>
                        <span
                            className="material-symbols-outlined material-symbols-animated"
                        >{copyIconMulti}</span>

                    </Button>


                    <div className="opacity-75 ml-4">
                        生成
                    </div>
                    <Input
                        className="w-30 opacity-75"
                        type="number"
                        value={count}
                        onChange={e => {
                            setCount(parseInt(e.target.value))
                        }}
                    />
                    <div className="opacity-75">
                        个
                    </div>
                </div>
                <Textarea readOnly className="font-mono" value={outputMulti}>
                </Textarea>
            </Card>

        </div>
    )
}
