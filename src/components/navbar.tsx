export default function Navbar() {
    return (
        <header className="sticky flex items-center justify-between px-10 py-5 border-b bg-white border-gray-200">
            <h1 className="text-[var(--main-theme)] text-2xl">LibE</h1>
            <a href="/profile" className="">
                My Profile
            </a>
        </header>
    );
}