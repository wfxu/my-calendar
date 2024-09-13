export default function CalendarList() {
    return (
        <div className='w-1/5 overflow-y-auto bg-gray-500'>
                <ul className="h-full">
                    {Array.from({ length: 20 }, (_, i) => (
                        <li key={i} className="w-full p-4 bg-white shadow rounded">
                            <p>列表项 {i + 1}</p>
                        </li>
                    ))}
                </ul>
        </div>
    )
}