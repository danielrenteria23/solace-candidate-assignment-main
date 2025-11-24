export default function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                First Name
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                Last Name
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                City
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                Degree
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                Specialties
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                Experience
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                Phone
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="animate-pulse">
                <td className="whitespace-nowrap px-4 py-4">
                  <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-700"></div>
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-1">
                    <div className="h-5 w-16 rounded-md bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-5 w-20 rounded-md bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-5 w-14 rounded-md bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-700"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
