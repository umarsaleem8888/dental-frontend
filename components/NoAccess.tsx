import { EyeOffIcon } from 'lucide-react'
import React from 'react'

const NoAccess = ({ module }: { module: string }) => {
    return (

        <>
            <div className="card-surface-transition rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8">

                    <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
                        <EyeOffIcon
                            size={30}
                            className="text-red-500"
                        />
                    </div>

                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                        You have no access to read {module}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        You don't have permission to view {module} records.
                    </p>

                </div>
            </div>
        </>


    )
}

export default NoAccess
