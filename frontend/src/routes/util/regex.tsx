import utils from "@/static/utils.json"

import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Helmet } from "react-helmet-async"

export default function Regex() {
    const ID = "regex"
    const UTIL = utils.find(u => u.id === ID)

    const [input, setInput] = useState("")
    const [output, setOutput] = useState("")
    const [highlighted, setHighlighted] = useState("")
    const [copyIconOutput, setCopyIconOutput] = useState("content_copy")

    const [searchPattern, setSearchPattern] = useState("")
    const [replacePattern, setReplacePattern] = useState("")

    const [flagG, setFlagG] = useState(false)
    const [flagI, setFlagI] = useState(false)
    const [flagM, setFlagM] = useState(false)
    const [flagS, setFlagS] = useState(false)

    const [isEditingInput, setIsEditingInput] = useState(true)

    const handleInputBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value)
        setIsEditingInput(false)
    }

    const buildFlags = () => {
        return `${flagG ? 'g' : ''}${flagI ? 'i' : ''}${flagM ? 'm' : ''}${flagS ? 's' : ''}`
    }

    useEffect(() => {
        try {
            const flags = buildFlags()
            const regex = new RegExp(searchPattern, flags)
            const replaced = input.replace(regex, replacePattern)
            setOutput(replaced)

            if (searchPattern) {
                const highlightRegex = new RegExp(searchPattern, flags.replace('g', 'g')) // always g for highlighting
                const html = input.replace(highlightRegex, match => `<mark class="bg-amber-100 ">${match}</mark>`)
                setHighlighted(html)
            } else {
                setHighlighted(input)
            }

        } catch (err) {
            setOutput("正则表达式无效")
        }
    }, [input, searchPattern, replacePattern, flagG, flagI, flagM, flagS])



    if (!UTIL) return null

    return (
        <div className="mx-auto w-full max-w-screen-lg">

            <Helmet>
                <title>{UTIL.name} - Potato Utils</title>
                <meta name="description" content={UTIL.description} />
            </Helmet>

            {/* Header */}
            <Card className="card mb-4">
                <h1 className="flex items-center">
                    <span className="material-symbols-outlined mr-2">{UTIL.icon}</span>
                    {UTIL.name}
                </h1>
                <div className="mt-2 opacity-75">{UTIL.description}</div>
            </Card>

            {/* 替换 */}
            <Card className="card mb-4">
                <h2 className="flex items-center mb-8!">
                    <span className="material-symbols-outlined mr-2">east</span>
                    替换
                </h2>

                <div className="min-h-30 mb-4">
                    {isEditingInput ? (
                        <Textarea
                            autoFocus
                            className="min-h-30"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onBlur={handleInputBlur}
                        />
                    ) : (
                        <div
                            className="text-sm p-3 border rounded min-h-30 whitespace-pre-wrap break-all cursor-text hover:bg-muted"
                            onClick={() => setIsEditingInput(true)}
                            dangerouslySetInnerHTML={{ __html: highlighted }}
                        />
                    )}
                </div>


                <div className="flex gap-4 mb-4">
                    <Input
                        className="flex-1"
                        placeholder="查找 (正则表达式)"
                        value={searchPattern}
                        onChange={(e) => {
                            setSearchPattern(e.target.value)
                        }}
                    />
                    <Input
                        className="flex-1"
                        placeholder="替换"
                        value={replacePattern}
                        onChange={(e) => {
                            setReplacePattern(e.target.value)
                        }}
                    />
                </div>

                <div className="mt-4 mb-8 flex justify-center gap-4">
                    <div className="flex gap-2">
                        <span className="material-symbols-outlined">arrow_downward</span>
                        输出
                    </div>
                </div>

                <Textarea
                    readOnly
                    className="opacity-75 min-h-30"
                    placeholder="输出"
                    value={output}
                />
                <Button variant="ghost" className="ml-auto mt-2 opacity-90 material-symbols-animated-parent" onClick={() => {
                    navigator.clipboard.writeText(output)
                    setCopyIconOutput("check")
                    setTimeout(() => setCopyIconOutput("content_copy"), 1000)
                }}>
                    <span className="material-symbols-outlined material-symbols-animated">{copyIconOutput}</span>
                    复制内容
                </Button>

            </Card>

            {/* Flags */}
            <Card className="card">
                <h2 className="flex items-center mb-8!">
                    <span className="material-symbols-outlined mr-2">settings</span>
                    选项
                </h2>

                <div className="mb-3 opacity-75">Flag</div>
                <div className="flex flex-col gap-3">
                    <div className="flex">
                        <Checkbox id="flagG" className="mr-3"
                            checked={flagG}
                            onCheckedChange={(checked) => {
                                setFlagG(!!checked)
                            }}
                        />
                        <Label htmlFor="flagG" className="opacity-60">Global 全局匹配</Label>
                    </div>
                    <div className="flex">
                        <Checkbox id="flagI" className="mr-3"
                            checked={flagI}
                            onCheckedChange={(checked) => {
                                setFlagI(!!checked)
                            }}
                        />
                        <Label htmlFor="flagI" className="opacity-60">IgnoreCase 忽略大小写</Label>
                    </div>
                    <div className="flex">
                        <Checkbox id="flagM" className="mr-3"
                            checked={flagM}
                            onCheckedChange={(checked) => {
                                setFlagM(!!checked)
                            }}
                        />
                        <Label htmlFor="flagM" className="opacity-60">Multiline 多行匹配</Label>
                    </div>
                    <div className="flex">
                        <Checkbox id="flagS" className="mr-3"
                            checked={flagS}
                            onCheckedChange={(checked) => {
                                setFlagS(!!checked)
                            }}
                        />
                        <Label htmlFor="flagS" className="opacity-60">DotAll 点通配符扩展</Label>
                    </div>
                </div>
            </Card>
        </div>
    )
}
