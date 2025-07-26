import React from "react"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

// 可选：自定义进度条样式
NProgress.configure({ showSpinner: false })

export function lazyWithProgress<T extends React.ComponentType<any>>(importFn: () => Promise<{ default: T }>) {
    return React.lazy(() => {
        NProgress.start()
        return importFn()
            .then((module) => {
                NProgress.done()
                return module
            })
            .catch((error) => {
                NProgress.done()
                throw error
            })
    })
}