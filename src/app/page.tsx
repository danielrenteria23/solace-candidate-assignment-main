"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FiX,
  FiMeh,
  FiChevronDown,
  FiCopy,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import Header from "@/components/Header";
import TableSkeleton from "@/components/TableSkeleton";

interface Advocate {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
  createdAt: string;
}

const experienceRanges = [
  { label: "0-2 years", value: "0-2", min: 0, max: 2 },
  { label: "3-5 years", value: "3-5", min: 3, max: 5 },
  { label: "6-10 years", value: "6-10", min: 6, max: 10 },
  { label: "10+ years", value: "10+", min: 10, max: Infinity },
];

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [selectedDegree, setSelectedDegree] = useState(
    searchParams.get("degree") || "",
  );
  const [selectedCity, setSelectedCity] = useState(
    searchParams.get("city") || "",
  );
  const [selectedSpecialty, setSelectedSpecialty] = useState(
    searchParams.get("specialty") || "",
  );
  const [selectedExperience, setSelectedExperience] = useState(
    searchParams.get("experience") || "",
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        console.log("fetching advocates...");
        const response = await fetch("/api/advocates");

        if (!response.ok) {
          throw new Error("Failed to fetch advocates");
        }

        const jsonResponse = await response.json();
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching advocates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvocates();
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (selectedDegree) params.set("degree", selectedDegree);
    if (selectedCity) params.set("city", selectedCity);
    if (selectedSpecialty) params.set("specialty", selectedSpecialty);
    if (selectedExperience) params.set("experience", selectedExperience);

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : "/";
    router.replace(newUrl, { scroll: false });
  }, [
    searchTerm,
    selectedDegree,
    selectedCity,
    selectedSpecialty,
    selectedExperience,
    router,
  ]);

  // Extract unique filter options
  const filterOptions = useMemo(() => {
    const degrees = Array.from(new Set(advocates.map((a) => a.degree))).sort();
    const cities = Array.from(new Set(advocates.map((a) => a.city))).sort();
    const specialties = Array.from(
      new Set(advocates.flatMap((a) => a.specialties)),
    ).sort();

    return { degrees, cities, specialties };
  }, [advocates]);

  // Apply all filters
  useEffect(() => {
    const applyFilters = () => {
      const searchLower = searchTerm.toLowerCase();

      const filtered = advocates.filter((advocate) => {
        const matchesSearch =
          !searchTerm ||
          advocate.firstName.toLowerCase().includes(searchLower) ||
          advocate.lastName.toLowerCase().includes(searchLower) ||
          advocate.city.toLowerCase().includes(searchLower) ||
          advocate.degree.toLowerCase().includes(searchLower) ||
          advocate.specialties.some((specialty) =>
            specialty.toLowerCase().includes(searchLower),
          ) ||
          advocate.yearsOfExperience.toString().includes(searchLower);

        const matchesDegree =
          !selectedDegree || advocate.degree === selectedDegree;

        const matchesCity = !selectedCity || advocate.city === selectedCity;

        const matchesSpecialty =
          !selectedSpecialty ||
          advocate.specialties.includes(selectedSpecialty);

        let matchesExperience = true;
        if (selectedExperience) {
          const range = experienceRanges.find(
            (r) => r.value === selectedExperience,
          );
          if (range) {
            matchesExperience =
              advocate.yearsOfExperience >= range.min &&
              advocate.yearsOfExperience <= range.max;
          }
        }

        return (
          matchesSearch &&
          matchesDegree &&
          matchesCity &&
          matchesSpecialty &&
          matchesExperience
        );
      });

      setFilteredAdvocates(filtered);
    };

    applyFilters();
  }, [
    searchTerm,
    selectedDegree,
    selectedCity,
    selectedSpecialty,
    selectedExperience,
    advocates,
  ]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedDegree("");
    setSelectedCity("");
    setSelectedSpecialty("");
    setSelectedExperience("");
  };

  const formatPhoneNumber = (num: number): string => {
    const str = num.toString();
    return `(${str.slice(0, 3)}) ${str.slice(3, 6)}-${str.slice(6)}`;
  };

  const copyUrlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  if (error) {
    return (
      <div className={darkMode ? "dark" : ""}>
        <div className="min-h-screen bg-gray-50 transition-colors dark:bg-gray-900">
          <Header
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            loading={loading}
            setLoading={setLoading}
            error={error}
            setError={setError}
          />
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <p className="mb-6 text-xl text-gray-600 dark:text-gray-400">
              Find the right imaginary advocate for your needs.
            </p>
            <div
              className="rounded-lg border border-red-200 bg-white p-12 text-center shadow-sm dark:border-red-900 dark:bg-gray-800"
              role="alert"
              aria-live="assertive"
            >
              <FiAlertCircle
                className="mx-auto h-12 w-12 text-red-500 dark:text-red-400"
                aria-hidden="true"
              />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                Something went wrong
              </h3>
              <p className="mt-2 text-red-600 dark:text-red-400">{error}</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 transition-colors dark:bg-gray-900">
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          loading={loading}
          setLoading={setLoading}
          error={error}
          setError={setError}
        />

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Page Subtitle */}
          <p className="mb-6 text-xl text-gray-600 dark:text-gray-400">
            Find the right imaginary advocate for your needs.
          </p>

          <div className="mb-8">
            {/* Search and Filters */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <div className="mb-4">
                <label
                  htmlFor="search-input"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Search
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="search-input"
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, city, degree, or specialty..."
                    disabled={loading}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-400"
                    aria-label="Search advocates by name, city, degree, or specialty"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={resetFilters}
                      disabled={loading}
                      className="flex-1 rounded-lg border border-gray-300 bg-gray-100 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 sm:flex-none"
                      aria-label="Reset all filters"
                    >
                      Reset All Filters
                    </button>

                    <div className="relative">
                      <button
                        onClick={copyUrlToClipboard}
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        disabled={loading}
                        className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-3 text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        aria-label="Copy URL to clipboard"
                      >
                        {copied ? (
                          <FiCheck
                            className="h-6 w-6 text-green-600 dark:text-green-400"
                            aria-hidden="true"
                          />
                        ) : (
                          <FiCopy className="h-6 w-6" aria-hidden="true" />
                        )}
                      </button>
                      {showTooltip && !copied && (
                        <div className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white shadow-lg dark:bg-gray-700">
                          Copy URL to easily share filtered results
                          <div className="absolute left-1/2 top-full -mt-1 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                        </div>
                      )}
                      {copied && (
                        <div className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white shadow-lg dark:bg-green-500">
                          Copied!
                          <div className="absolute left-1/2 top-full -mt-1 -translate-x-1/2 border-4 border-transparent border-t-green-600 dark:border-t-green-500"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="degree-filter"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Degree
                    </label>
                    <div className="relative">
                      <select
                        id="degree-filter"
                        value={selectedDegree}
                        onChange={(e) => setSelectedDegree(e.target.value)}
                        disabled={loading}
                        className="w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-gray-900 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400"
                        aria-label="Filter by degree"
                      >
                        <option value="">All Degrees</option>
                        {filterOptions.degrees.map((degree) => (
                          <option key={degree} value={degree}>
                            {degree}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="city-filter"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      City
                    </label>
                    <div className="relative">
                      <select
                        id="city-filter"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        disabled={loading}
                        className="w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-gray-900 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400"
                        aria-label="Filter by city"
                      >
                        <option value="">All Cities</option>
                        {filterOptions.cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="specialty-filter"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Specialty
                    </label>
                    <div className="relative">
                      <select
                        id="specialty-filter"
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        disabled={loading}
                        className="w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-gray-900 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400"
                        aria-label="Filter by specialty"
                      >
                        <option value="">All Specialties</option>
                        {filterOptions.specialties.map((specialty) => (
                          <option key={specialty} value={specialty}>
                            {specialty}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="experience-filter"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Years of Experience
                    </label>
                    <div className="relative">
                      <select
                        id="experience-filter"
                        value={selectedExperience}
                        onChange={(e) => setSelectedExperience(e.target.value)}
                        disabled={loading}
                        className="w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-gray-900 transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400"
                        aria-label="Filter by years of experience"
                      >
                        <option value="">All Experience Levels</option>
                        {experienceRanges.map((range) => (
                          <option key={range.value} value={range.value}>
                            {range.label}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Filters Display */}
              {(searchTerm ||
                selectedDegree ||
                selectedCity ||
                selectedSpecialty ||
                selectedExperience) && (
                <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Active filters:
                    </span>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 transition-colors hover:bg-blue-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                        aria-label="Clear search filter"
                      >
                        Search: {searchTerm}
                        <FiX className="h-3 w-3" />
                      </button>
                    )}
                    {selectedDegree && (
                      <button
                        onClick={() => setSelectedDegree("")}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-md bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 transition-colors hover:bg-purple-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-purple-900 dark:text-purple-200 dark:hover:bg-purple-800"
                        aria-label={`Clear degree filter: ${selectedDegree}`}
                      >
                        {selectedDegree}
                        <FiX className="h-3 w-3" />
                      </button>
                    )}
                    {selectedCity && (
                      <button
                        onClick={() => setSelectedCity("")}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-md bg-green-100 px-3 py-1 text-xs font-medium text-green-800 transition-colors hover:bg-green-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
                        aria-label={`Clear city filter: ${selectedCity}`}
                      >
                        {selectedCity}
                        <FiX className="h-3 w-3" />
                      </button>
                    )}
                    {selectedSpecialty && (
                      <button
                        onClick={() => setSelectedSpecialty("")}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-md bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 transition-colors hover:bg-orange-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-orange-900 dark:text-orange-200 dark:hover:bg-orange-800"
                        aria-label={`Clear specialty filter: ${selectedSpecialty}`}
                      >
                        {selectedSpecialty}
                        <FiX className="h-3 w-3" />
                      </button>
                    )}
                    {selectedExperience && (
                      <button
                        onClick={() => setSelectedExperience("")}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-md bg-pink-100 px-3 py-1 text-xs font-medium text-pink-800 transition-colors hover:bg-pink-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-pink-900 dark:text-pink-200 dark:hover:bg-pink-800"
                        aria-label={`Clear experience filter: ${
                          experienceRanges.find(
                            (r) => r.value === selectedExperience,
                          )?.label
                        }`}
                      >
                        {
                          experienceRanges.find(
                            (r) => r.value === selectedExperience,
                          )?.label
                        }
                        <FiX className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div
            className="mb-4"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {loading ? (
                "Loading advocates..."
              ) : (
                <>
                  Showing {filteredAdvocates.length}{" "}
                  {filteredAdvocates.length === 1 ? "advocate" : "advocates"}
                </>
              )}
            </p>
          </div>

          {/* Table Data*/}
          {loading ? (
            <TableSkeleton />
          ) : filteredAdvocates.length === 0 ? (
            <div
              className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800"
              role="status"
              aria-live="polite"
            >
              <FiMeh
                className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                aria-hidden="true"
              />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                No advocates found
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Try adjusting your search criteria or filters
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="overflow-x-auto">
                <table
                  className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                  aria-label="List of available advocates"
                >
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white"
                      >
                        First Name
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white"
                      >
                        Last Name
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white"
                      >
                        City
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white"
                      >
                        Degree
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white"
                      >
                        Specialties
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white"
                      >
                        Experience
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white"
                      >
                        Phone
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                    {filteredAdvocates.map((advocate) => (
                      <tr
                        key={advocate.id}
                        className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-750"
                      >
                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {advocate.firstName}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {advocate.lastName}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {advocate.city}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {advocate.degree}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                          <div className="flex flex-wrap gap-1">
                            {(() => {
                              const isExpanded = expandedRows.has(advocate.id);
                              const visibleSpecialties = isExpanded
                                ? advocate.specialties
                                : advocate.specialties.slice(0, 3);
                              const remainingCount =
                                advocate.specialties.length - 3;

                              return (
                                <>
                                  {visibleSpecialties.map((s, i) => (
                                    <button
                                      key={i}
                                      onClick={() => setSelectedSpecialty(s)}
                                      className="inline-flex cursor-pointer items-center rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                                      aria-label={`Filter by ${s} specialty`}
                                    >
                                      {s}
                                    </button>
                                  ))}
                                  {remainingCount > 0 && (
                                    <button
                                      onClick={() => {
                                        const newExpanded = new Set(
                                          expandedRows,
                                        );
                                        if (isExpanded) {
                                          newExpanded.delete(advocate.id);
                                        } else {
                                          newExpanded.add(advocate.id);
                                        }
                                        setExpandedRows(newExpanded);
                                      }}
                                      className="inline-flex cursor-pointer items-center rounded-md bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                      aria-label={
                                        isExpanded
                                          ? "Show less specialties"
                                          : `Show ${remainingCount} more specialties`
                                      }
                                    >
                                      {isExpanded
                                        ? "Show less"
                                        : `+${remainingCount} more`}
                                    </button>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {advocate.yearsOfExperience}{" "}
                          {advocate.yearsOfExperience === 1 ? "year" : "years"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                          <a
                            href={`tel:${advocate.phoneNumber}`}
                            className="text-blue-600 transition-colors hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                            aria-label={`Call ${formatPhoneNumber(
                              advocate.phoneNumber,
                            )}`}
                          >
                            {formatPhoneNumber(advocate.phoneNumber)}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
