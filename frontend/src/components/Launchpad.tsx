import React, { useImperativeHandle, forwardRef, useState } from "react"
import { hideLaunchpad } from "./LaunchpadController"
import { Card } from "./ui/card"
import { Toggle } from "./ui/toggle"
import { useNavigate } from "react-router-dom"

import tags from "../static/tags.json"
import utils from "../static/utils.json"

const Launchpad = forwardRef((_, ref) => {
    const [visible, setVisible] = useState(false)
    const [activeTag, setActiveTag] = useState("all")
    const navigate = useNavigate()

    useImperativeHandle(ref, () => ({
        show: () => setVisible(true),
        hide: () => setVisible(false),
        status: visible
    }))

    return (
        <div id="launchpad" style={{ display: visible ? "block" : "none" }} className="p-4 fixed inset-0 top-16 overflow-y-auto dark:bg-neutral-900 bg-neutral-50 z-50">
            <div className="mx-auto w-full max-w-screen-xl">
                <div className="flex flex-col md:flex-row w-full gap-4">

                    {/* 左侧侧边栏 */}
                    <div className="md:w-[25%]">
                        <div className="flex flex-col gap-4 sticky top-0">
                            <Card className="card-clickable text-center flex flex-row items-center justify-center" onClick={() => { hideLaunchpad() }}>
                                <span className="material-symbols-outlined mr-2">arrow_warm_up</span>
                                <div>返回</div>
                            </Card>

                            <Card className="p-7">
                                <h1 className="mb-4 flex items-center">
                                    <span className="material-symbols-outlined mr-2">filter_alt</span>
                                    筛选
                                </h1>
                                <div id="launchpad-tags" className="flex flex-wrap gap-2">
                                    {/* 默认“全部” */}
                                    <Toggle aria-label="All" data-state={activeTag === "all" ? "on" : "off"} onClick={() => { setActiveTag("all") }}>
                                        <span className="material-symbols-outlined">all_inclusive</span>
                                        全部
                                    </Toggle>

                                    {tags.map(tag => (
                                        <Toggle key={tag.id} aria-label={tag.name} data-state={activeTag === tag.id ? "on" : "off"} onClick={() => { setActiveTag(tag.id) }}>
                                            <span className="material-symbols-outlined">{tag.icon}</span>
                                            {tag.name}
                                        </Toggle>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* 右侧工具区 */}
                    <div className="w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {
                                utils.filter(util => {
                                    if (activeTag === "all") {
                                        return true
                                    }
                                    return util.tags.includes(activeTag)
                                }).map(util => (
                                    <Card
                                        key={util.id}
                                        className="p-7 card-clickable relative overflow-hidden button-card-bg-icon-rotate-parent"
                                        onClick={() => { navigate(`/util/${util.id}`); hideLaunchpad() }}
                                    >
                                        <h1 className="flex items-center">
                                            <span className="material-symbols-outlined mr-2">{util.icon}</span>
                                            {util.name}
                                        </h1>
                                        <div className="opacity-75 mb-6">{util.description}</div>
                                        <div className="launchpad-tool-card-tags mt-auto flex gap-2">
                                            {util.tags.map(tagId => {
                                                const tag = tags.find(t => t.id === tagId)
                                                return tag ? (
                                                    <Toggle key={tag.id} aria-label={tag.name}>
                                                        <span className="material-symbols-outlined">{tag.icon}</span>
                                                        {tag.name}
                                                    </Toggle>
                                                ) : null
                                            })}
                                        </div>
                                        <div className="absolute bottom-0 right-0 -mb-8 -mr-6">
                                            <span className="material-symbols-outlined button-card-bg-icon-rotate text-[128px] opacity-10">
                                                {util.icon}
                                            </span>
                                        </div>
                                    </Card>
                                ))
                            }
                        </div>
                        {
                            utils.filter(util => {
                                if (activeTag === "all") {
                                    return true
                                }
                                return util.tags.includes(activeTag)
                            }).length === 0 &&
                            (
                                <div className="mx-full text-center opacity-50 m-8">
                                    一切皆已遁入幻想
                                </div>

                            )
                        }
                    </div>

                </div>
            </div>
        </div>
    )
})

export default Launchpad
