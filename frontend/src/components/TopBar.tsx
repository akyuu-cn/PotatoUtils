import { Search } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useTheme } from "@/components/theme-provider"
import { showLaunchpad, hideLaunchpad, getLaunchpadStatus } from './LaunchpadController'
import { useNavigate } from 'react-router-dom'


export default function TopBar() {
    const { toggleTheme } = useTheme()
    const navigate = useNavigate()
    return (
        <nav className="h-16 p-2 px-6 flex rounded-b-lg items-center">
            <div onClick={() => { navigate("/dashboard"); hideLaunchpad() }} className='flex h-full gap-3 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 pr-2 rounded-md text-neutral-800 dark:text-neutral-200'>
                <div className="h-full p-1.5 rounded-sm -mr-1">
                    <img className="h-full opacity-80" src="/logo.ico"></img>
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
                            1.0.0
                        </Badge>
                    </div>
                </div>
            </div>
            <div className='hidden sm:block border-l-neutral-300 dark:border-l-neutral-700 border-1 h-8/10 mx-3'>
            </div>
            <div className="hidden sm:block relative w-50 max-w-sm ml-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                    placeholder="搜索... [WIP]"
                    className="pl-9 h-10 bg-neutral-100 placeholder:text-xs"
                />
            </div>

            {/* <Link to="/app1" className={cn("hover:underline", pathname === "/app1" && "font-bold")}>
                App1
            </Link>
            <Link to="/app2" className={cn("hover:underline", pathname === "/app2" && "font-bold")}>
                App2
            </Link> */}

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
