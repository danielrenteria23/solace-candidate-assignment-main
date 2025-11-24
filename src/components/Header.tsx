"use client";

import { useState, useRef, useEffect } from "react";
import { FiSun, FiMoon, FiSettings, FiGithub } from "react-icons/fi";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  error: string | null;
  setError: (value: string | null) => void;
}

export default function Header({
  darkMode,
  setDarkMode,
  loading,
  setLoading,
  error,
  setError,
}: HeaderProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSettingsOpen(false);
      }
    }

    if (settingsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [settingsOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Solace Advocates
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-lg bg-gray-100 p-2 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <FiSun className="h-5 w-5" aria-hidden="true" />
              ) : (
                <FiMoon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="rounded-lg bg-gray-100 p-2 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                aria-label="Settings"
              >
                <FiSettings className="h-5 w-5" aria-hidden="true" />
              </button>

              {settingsOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                    Debug Settings
                  </h3>

                  <div className="space-y-3">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={loading}
                        onChange={(e) => {
                          setLoading(e.target.checked);
                          if (e.target.checked) {
                            setError(null);
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Loading State
                      </span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={error !== null}
                        onChange={(e) => {
                          setError(
                            e.target.checked ? "Debug error message" : null,
                          );
                          if (e.target.checked) {
                            setLoading(false);
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Error State
                      </span>
                    </label>

                    <hr className="border-gray-200 dark:border-gray-700" />

                    <a
                      href="https://github.com/danielrenteria23/solace-candidate-assignment-main/pulls?q=is%3Apr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      <FiGithub className="h-4 w-4" aria-hidden="true" />
                      View Pull Requests
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
