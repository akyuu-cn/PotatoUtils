import utils from "@/static/utils.json"

import { Card } from "@/components/ui/card"


export default function RenameMe() {
    const ID = ""
    const UTIL = utils.find(u => u.id === ID)

    //

    if (!UTIL) { return null }

    return (
        <div className="mx-auto w-full max-w-screen-lg">

            <Card className="card mb-4">
                <h1 className="flex items-center">
                    <span className="material-symbols-outlined mr-2">{UTIL.icon}</span>
                    {UTIL.name}
                </h1>
                <div className="mt-2 opacity-75">

                </div>
            </Card>

            <Card className="card mb-4">

            </Card>

        </div>
    )
}
