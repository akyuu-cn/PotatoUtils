import { Search } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useTheme } from "@/components/theme-provider"
import { showLaunchpad, hideLaunchpad, getLaunchpadStatus } from './LaunchpadController'
import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import utils from "@/static/utils.json"
import { match } from 'pinyin-pro'


export default function TopBar() {
    const { toggleTheme } = useTheme()
    const navigate = useNavigate()

    const [showSearchResult, setShowSearchResult] = useState(false)
    const [searchKeyword, setSearchKeyword] = useState("")
    const [utilsFiltered, setUtilsFiltered] = useState(utils)

    const searchRef = useRef<HTMLDivElement>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)

    const [activeIndex, setActiveIndex] = useState(-1)

    // 点击外部关闭
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowSearchResult(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // 聚焦搜索框
            if (e.key === "/") {
                e.preventDefault()
                setShowSearchResult(true)
                searchInputRef.current?.focus()
                return
            }

            // 关闭
            if (e.key === "Escape") {
                setShowSearchResult(false)
                return
            }

            if (!showSearchResult) return
            if (utilsFiltered.length === 0) return

            if (e.key === "ArrowDown") {
                e.preventDefault()
                setActiveIndex(prev =>
                    prev + 1 >= utilsFiltered.length ? 0 : prev + 1
                )
            } else if (e.key === "ArrowUp") {
                e.preventDefault()
                setActiveIndex(prev =>
                    prev - 1 < 0 ? utilsFiltered.length - 1 : prev - 1
                )
            } else if (e.key === "Enter") {
                e.preventDefault()
                const util = utilsFiltered[activeIndex]
                if (util) {
                    searchInputRef.current?.blur()
                    navigate(`/util/${util.id}`)
                    setShowSearchResult(false)
                    setSearchKeyword("")
                    setActiveIndex(-1)
                }
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [utilsFiltered, showSearchResult, activeIndex])

    useEffect(() => {
        if (!searchKeyword.trim()) {
            setUtilsFiltered(utils)
            setActiveIndex(0)
            return
        }

        const ranked = utils
            .map(u => {
                let score = -1

                if (match(u.name, searchKeyword)) score = 1
                else if (match(u.description, searchKeyword)) score = 2
                else if (u.tags.some(tag => match(tag, searchKeyword))) score = 3
                else if (match(u.id, searchKeyword)) score = 4

                return { util: u, score }
            })
            .filter(item => item.score !== -1)       // 剔除不匹配的
            .sort((a, b) => a.score - b.score)       // score小的排前面
            .map(item => item.util)

        setUtilsFiltered(ranked)
        setActiveIndex(0)
    }, [searchKeyword])



    return (
        <nav className="h-16 p-2 px-6 flex rounded-b-lg items-center">
            <div onClick={() => { navigate("/dashboard"); hideLaunchpad() }} className='flex h-full gap-3 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 pr-2 rounded-md text-neutral-800 dark:text-neutral-200'>
                <div className="w-12 h-12 p-1.5 rounded-sm -mr-1">
                    <img className="w-full h-full object-contain opacity-80" src="/logo.ico" alt="logo" />
                </div>
                <div className='font-mono'>
                    <div className='text-xl font-semibold text-nowrap'>
                        Potato Utils
                    </div>
                    <div className='flex items-center gap-2'>
                        <Badge variant='secondary' className='bg-neutral-200 dark:bg-neutral-700 px-1 -py-1 rounded-full text-xs opacity-80'>
                            Reborn
                        </Badge>
                        <Badge variant='secondary' className='bg-neutral-200 dark:bg-neutral-700 px-1 -py-1 rounded-full text-xs opacity-80'>
                            1.1.0
                        </Badge>
                    </div>
                </div>
            </div>
            <div className='hidden sm:block border-l-neutral-300 dark:border-l-neutral-700 border-1 h-8/10 mx-3'>
            </div>


            <div className="hidden sm:block relative w-50 max-w-sm ml-2" ref={searchRef}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none border-1 rounded-sm text-[10px] flex items-center justify-center">
                    /
                </div>

                <Input
                    placeholder="搜索..."
                    className="pl-9 h-10 bg-neutral-100 placeholder:text-xs"
                    onFocus={() => setShowSearchResult(true)}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    value={searchKeyword}
                    ref={searchInputRef}
                />

                {/* 搜索结果面板 */}
                {showSearchResult && (
                    <div className="absolute mt-2 w-80 bg-white dark:bg-neutral-800 rounded-md border shadow-lg p-2
                        z-1000">
                        {searchKeyword.trim() === "" && (
                            <div className="flex flex-col gap-1">
                                <div className="px-2 py-2 text-sm opacity-75">
                                    在 {utils.length} 个实用工具中检索...
                                </div>
                            </div>
                        )}

                        {searchKeyword.trim() != "" &&
                            utilsFiltered.slice(0, 10).map((util, i) => (
                                <div
                                    key={util.id}
                                    className={
                                        "flex items-center gap-2 px-2 py-2 cursor-pointer rounded-md " +
                                        (activeIndex === i
                                            ? "bg-neutral-200 dark:bg-neutral-700"
                                            : "hover:bg-neutral-100 dark:hover:bg-neutral-800")
                                    }
                                    onMouseEnter={() => setActiveIndex(i)}
                                    onClick={() => {
                                        searchInputRef.current?.blur()
                                        setActiveIndex(-1)
                                        setShowSearchResult(false)
                                        setSearchKeyword("")
                                        navigate(`/util/${util.id}`)
                                    }}
                                >
                                    <span className="material-symbols-outlined text-sm text-muted-foreground">
                                        {util.icon}
                                    </span>
                                    <div className="flex flex-col gap-1">
                                        <div className="text-sm font-medium">{util.name}</div>
                                        <div className="text-xs text-muted-foreground">{util.description}</div>
                                    </div>
                                </div>
                            ))
                        }

                        {
                            searchKeyword.trim() != "" && utilsFiltered.length === 0 && (
                                <div className="px-2 py-2 text-sm opacity-75">
                                    没有符合搜索关键词的工具
                                </div>
                            )
                        }

                    </div>
                )}
            </div>

            <div className='ml-auto flex items-center gap-2'>
                <Button variant="ghost" size="icon" className='material-symbols-animated-parent' onClick={() => { getLaunchpadStatus() ? hideLaunchpad() : showLaunchpad() }}>
                    <span
                        className="material-symbols-outlined material-symbols-animated"
                    >grid_view</span>
                </Button>

                <Button variant="ghost" size="icon" className='material-symbols-animated-parent' onClick={() => { toggleTheme() }}>
                    <span
                        className="material-symbols-outlined material-symbols-animated"
                    >dark_mode</span>
                </Button>

                <Button variant="ghost" size="icon" className='material-symbols-animated-parent mr-2'>
                    <span
                        className="material-symbols-outlined material-symbols-animated"
                    >settings</span>
                </Button>
            </div>
        </nav >
    )
}
