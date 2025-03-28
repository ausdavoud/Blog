'use client'
import { SidebarData } from "@/app/types";
import { useContext, useState } from "react";
import SidebarContext from "./providers/sidebar";
import { X, ChevronRight } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function Sidebar({ data }: { data: SidebarData[] }) {
    const context = useContext(SidebarContext)
    return <>
        <div className='my-20 top-8 self-start sticky max-h-screen overflow-scroll no-scrollbar w-full max-w-[280px] hidden xl:block'>
            <Main data={data} />
        </div>
        <div className={clsx("fixed top-0 lef-0 transition-opacity duration-300",
            context.isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none')}>
            <div className="fixed inset-0 bg-black/50 transition-opacity duration-300"
                onClick={() => context.close()}></div>
            <div className={clsx(context.isOpen ? 'translate-x-0' : '-translate-x-full',
                "fixed top-0 left-0 z-10 h-screen max-h-screen overflow-scroll no-scrollbar w-full max-w-[320px] xl:hidden bg-background px-4 pb-8 pt-4 transform transition-transform duration-300")}>
                <button className="block ml-auto mb-6 text-on-background-muted" onClick={() => context.close()}>
                    <X />
                </button>
                <Main data={data} />
            </div>
        </div>
    </>
}

function Main({ data }: { data: SidebarData[] }) {
    return <div className="flex flex-col gap-2 text-body font-medium text-on-background-muted">
        {data.map((item: SidebarData) => {
            return <SidebarItem key={item.name} item={item}
                render={(children) => {
                    return <div className="ml-4 -mt-1 mb-2 border-l py-1 px-2 gap-1 border-outline text-label flex flex-col text-on-background-muted">
                        {children}
                    </div>
                }} />
        })}
    </div>
}

function SidebarItem({ item, render }: { item: SidebarData, render: (children: React.ReactNode) => React.ReactNode }) {
    const pathname = usePathname()
    const [open, setOpen] = useState(pathname.startsWith(item.url))
    return <>
        <div className={clsx("w-[280px] py-2 px-4 rounded",
            pathname === item.url && "bg-surface text-primary cursor-default")}>
            <div className="flex justify-between items-center">
                <Link href={item.url} className="grow">{item.name}</Link>
                {item.children &&
                    <button className="border-l pl-3 border-outline cursor-pointer"
                        onClick={() => setOpen(prev => !prev)}>
                        <ChevronRight width={20} height={20}
                            className={clsx("transition-transform duration-300", open && "rotate-90")} />
                    </button>
                }
            </div>
        </div>
        {open && item.children &&
            render(item.children.map((item) => {
                return <SidebarItem key={item.name} item={item}
                    render={(children) => {
                        return <div className="text-label pl-2">
                            {children}
                        </div>
                    }} />
            }))
        }
    </>
}