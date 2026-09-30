import utils from "@/static/utils.json"

import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import ComputingSign from "@/components/ComputingSign"

import { Helmet } from "react-helmet-async"
import { useEffect, useMemo, useRef, useState } from "react"


const ENCODINGS = [
    { name: "UTF-8", label: "utf-8" },
    { name: "GBK", label: "gbk" },
    { name: "Big5", label: "big5" },
    { name: "Shift_JIS", label: "shift_jis" },
    { name: "EUC-KR", label: "euc-kr" },
    { name: "Windows-1252", label: "windows-1252" },
] as const

type EncodingName = typeof ENCODINGS[number]["name"]
type Result = { text: string; bytes: Uint8Array } | null
type Row = { input: EncodingName; cells: Result[] }

// TextEncoder only supports UTF-8. Invert the browser's TextDecoder tables so that
// pasted mojibake can be converted back to its original bytes without a dependency.
const reverseMaps = new Map<EncodingName, Map<string, number[]>>()

function getReverseMap(name: EncodingName, label: string) {
    const cached = reverseMaps.get(name)
    if (cached) return cached

    const decoder = new TextDecoder(label, { fatal: true, ignoreBOM: true })
    const map = new Map<string, number[]>()
    const add = (bytes: number[]) => {
        try {
            const character = decoder.decode(new Uint8Array(bytes))
            if ([...character].length === 1 && !map.has(character)) map.set(character, bytes)
        } catch {
            // Invalid byte sequence for this encoding.
        }
    }

    for (let byte = 0; byte <= 0xff; byte++) add([byte])
    reverseMaps.set(name, map)
    return map
}

function findAndCache(character: string, name: EncodingName, label: string, map: Map<string, number[]>) {
    const decoder = new TextDecoder(label, { fatal: true, ignoreBOM: true })
    const tryBytes = (bytes: number[]) => {
        try {
            if (decoder.decode(new Uint8Array(bytes)) === character) {
                map.set(character, bytes)
                return bytes
            }
        } catch {
            // Invalid byte sequence for this encoding.
        }
        return null
    }
    if (name !== "Windows-1252") {
        for (let first = 0x80; first <= 0xff; first++) {
            for (let second = 0; second <= 0xff; second++) {
                const found = tryBytes([first, second])
                if (found) return found
            }
        }
    }
    return null
}

// Encoding a long pasted text can trigger tens of thousands of TextDecoder calls
// per input encoding (see findAndCache), which blocks the main thread. Yield to
// the event loop between characters so the UI stays responsive.
const YIELD_EVERY = 200

function nextTick() {
    return new Promise<void>(resolve => setTimeout(resolve, 0))
}

async function encodeAsync(text: string, name: EncodingName, label: string, isCancelled: () => boolean): Promise<Uint8Array | null> {
    if (name === "UTF-8") return new TextEncoder().encode(text)
    const reverse = getReverseMap(name, label)
    const bytes: number[] = []
    let processed = 0
    for (const character of text) {
        let encoded = reverse.get(character)
        if (!encoded) encoded = findAndCache(character, name, label, reverse) ?? undefined
        if (!encoded) return null
        bytes.push(...encoded)
        if (++processed % YIELD_EVERY === 0) {
            await nextTick()
            if (isCancelled()) return null
        }
    }
    return new Uint8Array(bytes)
}

function decode(bytes: Uint8Array, label: string) {
    try {
        return new TextDecoder(label, { fatal: true, ignoreBOM: true }).decode(bytes)
    } catch {
        return null
    }
}

function hex(bytes: Uint8Array) {
    return Array.from(bytes, byte => byte.toString(16).padStart(2, "0").toUpperCase()).join(" ")
}

export default function EncodingMapper() {
    const ID = "encoding-mapper"
    const UTIL = utils.find(u => u.id === ID)
    const [text, setText] = useState("")
    const emptyRows = () => ENCODINGS.map<Row>(input => ({ input: input.name, cells: ENCODINGS.map(() => null) }))
    const [rows, setRows] = useState<Row[]>(emptyRows)
    const [computing, setComputing] = useState(false)
    const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null)
    const [fileName, setFileName] = useState("")
    const [dragging, setDragging] = useState(false)
    const [copiedKey, setCopiedKey] = useState<string | null>(null)
    const copiedTimerRef = useRef<number | null>(null)
    const runIdRef = useRef(0)

    const copyResult = async (value: string, key: string) => {
        try {
            await navigator.clipboard.writeText(value)
        } catch {
            // Fallback for browsers without the async clipboard API.
            const area = document.createElement("textarea")
            area.value = value
            area.style.position = "fixed"
            area.style.opacity = "0"
            document.body.appendChild(area)
            area.select()
            document.execCommand("copy")
            document.body.removeChild(area)
        }
        setCopiedKey(key)
        if (copiedTimerRef.current !== null) window.clearTimeout(copiedTimerRef.current)
        copiedTimerRef.current = window.setTimeout(() => setCopiedKey(null), 1200)
    }

    useEffect(() => () => {
        if (copiedTimerRef.current !== null) window.clearTimeout(copiedTimerRef.current)
    }, [])

    // When a file is loaded we operate on its raw bytes directly, which preserves
    // information that an incorrect decode-and-paste would otherwise destroy.
    const usingFile = fileBytes !== null
    const bytes = usingFile ? fileBytes : null

    // Debounce the pasted text and encode it asynchronously so typing stays smooth
    // and long inputs do not block the main thread.
    useEffect(() => {
        if (usingFile) return
        if (!text) {
            setRows(emptyRows())
            setComputing(false)
            return
        }

        setComputing(true)
        const runId = ++runIdRef.current
        const isCancelled = () => runIdRef.current !== runId

        const timer = setTimeout(() => {
            void (async () => {
                const computed: Row[] = []
                for (const input of ENCODINGS) {
                    if (isCancelled()) return
                    const rowBytes = await encodeAsync(text, input.name, input.label, isCancelled)
                    if (isCancelled()) return
                    computed.push({
                        input: input.name,
                        cells: ENCODINGS.map(output => {
                            if (!rowBytes) return null
                            const decoded = decode(rowBytes, output.label)
                            return decoded === null ? null : { text: decoded, bytes: rowBytes }
                        }),
                    })
                }
                if (isCancelled()) return
                setRows(computed)
                setComputing(false)
            })()
        }, 250)

        return () => clearTimeout(timer)
    }, [text, usingFile])

    // In file mode the raw bytes are decoded by every encoding at once, so the
    // input encoding column is meaningless and the table collapses to one row
    // per encoding.
    const fileResults = useMemo(() => ENCODINGS.map(encoding => {
        if (!bytes) return { encoding, text: null }
        return { encoding, text: decode(bytes, encoding.label) }
    }), [bytes])

    const hexBytes = bytes ?? new TextEncoder().encode(text)

    const loadFile = async (file: File | undefined) => {
        if (!file) return
        const buffer = await file.arrayBuffer()
        setFileBytes(new Uint8Array(buffer))
        setFileName(file.name)
        setText("")
    }

    if (!UTIL) return null

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
                <div className="mt-2 opacity-75">{UTIL.description}</div>
            </Card>

            <Card className="card mb-4">
                <h2 className="flex items-center mb-8!">
                    <span className="material-symbols-outlined mr-2">input</span>
                    输入
                </h2>
                <label
                    onDragOver={event => {
                        event.preventDefault()
                        setDragging(true)
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={event => {
                        event.preventDefault()
                        setDragging(false)
                        void loadFile(event.dataTransfer.files[0])
                    }}
                    className={`text-center p-4 py-12 rounded-md text-muted-foreground flex items-center justify-center border-dashed border-2 cursor-pointer transition-colors ${dragging ? "bg-primary/10 border-primary" : "bg-muted hover:bg-muted/70"}`}>
                    <input
                        type="file"
                        className="hidden"
                        onChange={event => {
                            void loadFile(event.target.files?.[0])
                            event.target.value = ""
                        }} />
                    <span className="material-symbols-outlined mr-1">upload</span>
                    {fileName ? `已选择：${fileName}` : "点击上传或拖拽文件至此（推荐）"}
                </label>
                <div className="text-center my-6 text-muted-foreground">
                    或
                </div>
                <Textarea
                    className="min-h-30"
                    placeholder="粘贴乱码文本（部分编码可能丢失信息）"
                    value={text}
                    onChange={event => {
                        setText(event.target.value)
                        setFileBytes(null)
                        setFileName("")
                    }} />
            </Card>

            <Card className="card mb-4">
                <h2 className="flex items-center mb-8!">
                    <span className="material-symbols-outlined mr-2">table</span>
                    编码映射表
                    {computing && <ComputingSign />}
                </h2>
                <div className="overflow-x-auto">
                    {usingFile ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="whitespace-nowrap">编码</TableHead>
                                    <TableHead className="whitespace-nowrap">结果</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fileResults.map(({ encoding, text: resultText }) => {
                                    const copyKey = `file-${encoding.name}`
                                    const canCopy = resultText !== null
                                    return <TableRow key={encoding.name}>
                                        <TableCell className="text-muted-foreground whitespace-nowrap">{encoding.name}</TableCell>
                                        <TableCell className="min-w-48 max-w-180 p-1">
                                            <button
                                                type="button"
                                                disabled={!canCopy}
                                                title={resultText ?? "无法转换"}
                                                onClick={() => canCopy && void copyResult(resultText, copyKey)}
                                                className={`w-full rounded p-2 text-left truncate ${!canCopy ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}>
                                                {copiedKey === copyKey ? <span className="text-muted-foreground">已复制结果</span> : canCopy ? resultText || "（空）" : "-"}
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                })}
                            </TableBody>
                        </Table>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="whitespace-nowrap">输入 / 输出</TableHead>
                                    {ENCODINGS.map(encoding => <TableHead className="whitespace-nowrap" key={encoding.name}>{encoding.name}</TableHead>)}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map(row => <TableRow key={row.input}>
                                    <TableCell className="text-muted-foreground whitespace-nowrap">{row.input}</TableCell>
                                    {row.cells.map((result, index) => {
                                        const output = ENCODINGS[index].name
                                        const copyKey = `${row.input}-${output}`
                                        const canCopy = !!text && !!result
                                        return <TableCell key={output} className="min-w-32 max-w-32 p-1">
                                            <button
                                                type="button"
                                                disabled={!canCopy}
                                                title={result?.text ?? "无法转换"}
                                                onClick={() => canCopy && void copyResult(result!.text, copyKey)}
                                                className={`w-full rounded p-2 text-left truncate ${!canCopy ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}>
                                                {copiedKey === copyKey ? <span className="text-muted-foreground">已复制结果</span> : result ? result.text || "（空）" : "-"}
                                            </button>
                                        </TableCell>
                                    })}
                                </TableRow>)}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </Card>

            <Card className="card mb-4">
                <h2 className="flex items-center mb-8!">
                    <span className="material-symbols-outlined mr-2">data_object</span>
                    HEX 值
                </h2>
                <code className="opacity-90 text-2xl ml-4">{usingFile || text ? hex(hexBytes) : "..."}</code>
            </Card>
        </div>
    )
}





