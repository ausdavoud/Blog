import Header from '../components/Header'

export default function Loading() {
    return <div className="flex flex-col items-center max-w-post w-[calc(100%-4rem)]">
        <Header sidebar={false} />
        <main role="status" aria-busy="true" className="flex-1 w-full py-8 text-center text-on-background-muted">
            Loading…
        </main>
    </div>
}
