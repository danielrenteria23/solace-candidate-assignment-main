"use client";

import { useEffect, useState } from "react";

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

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    console.log("filtering advocates...");
    const searchLower = searchTerm.toLowerCase();
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(searchLower) ||
        advocate.lastName.toLowerCase().includes(searchLower) ||
        advocate.city.toLowerCase().includes(searchLower) ||
        advocate.degree.toLowerCase().includes(searchLower) ||
        advocate.specialties.some((specialty) =>
          specialty.toLowerCase().includes(searchLower)
        ) ||
        advocate.yearsOfExperience.toString().includes(searchLower)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  if (loading) {
    return (
      <main className="m-6">
        <h1>Solace Advocates</h1>
        <p>Loading advocates...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="m-6">
        <h1>Solace Advocates</h1>
        <p className="text-red-600">Error: {error}</p>
      </main>
    );
  }

  return (
    <main className="m-6">
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>
          Searching for: <span>{searchTerm}</span>
        </p>
        <input
          className="border border-black"
          value={searchTerm}
          onChange={onChange}
        />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate) => {
            return (
              <tr key={advocate.id}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s, i) => (
                    <div key={i}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
