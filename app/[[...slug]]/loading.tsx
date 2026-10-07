import Header from '../components/Header'

export default function Loading() {
    return <div className="flex flex-col items-center grow max-w-post w-full">
        <Header sidebar={false} />
        <main role="status" aria-busy="true" className="flex-1 w-full px-4 md:px-1 py-8 text-center text-on-background-muted">
            Loading…
        </main>
    </div>
}
