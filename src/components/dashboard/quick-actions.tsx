interface Action {
  label: string;
}

interface Prop {
  actions: Action[];
}

export default function QuickActions({ actions }: Prop) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
            <div className="flex flex-col justify-between">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        className="w-full py-3 px-4 bg-[var(--main-theme)] text-white rounded-lg hover:bg-[var(--main-theme)]/90 transition text-left">
                        {action.label}
                    </button>
                ))}
            </div>
        </div>
    )
}