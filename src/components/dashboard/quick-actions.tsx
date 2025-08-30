import Link from "next/link";

interface Action {
  label: string;
  href: string;
  onClick?: () => void;
}

const actions: Action[] = [
    { label: "Add New Book", href: "/" },
    { label: "Process Return", href: "/" },
    { label: "View All Borrowings", href: "/" },
    { label: "Manage Users", href: "/" },
];

export default function QuickActions() {
    const notifyClose = () => {
        document.dispatchEvent(new CustomEvent("closeQuickActions"));
    };

    return (
        <div className="bg-white p-2 rounded-md">
            <div className="flex flex-col">
                {actions.map((action, idx) => {
                    if (action.href) {
                        return (
                            <Link
                                key={idx}
                                href={action.href}
                                onClick={notifyClose}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 rounded-sm hover:text-[var(--main-theme)] hover:bg-[var(--main-theme)]/10 transition-colors">
                                {action.label}
                            </Link>
                        );
                    }
                })}
            </div>
        </div>
    )
}