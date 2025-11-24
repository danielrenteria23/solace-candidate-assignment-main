import { useQuery } from "@tanstack/react-query";

export interface Advocate {
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

interface AdvocatesResponse {
  data: Advocate[];
}

interface UseAdvocatesParams {
  search?: string;
  degree?: string;
  city?: string;
  specialty?: string;
  experience?: string;
}

async function fetchAdvocates(): Promise<Advocate[]> {
  const response = await fetch("/api/advocates");

  if (!response.ok) {
    throw new Error("Failed to fetch advocates");
  }

  const jsonResponse: AdvocatesResponse = await response.json();
  return jsonResponse.data;
}

export function useAdvocates(params: UseAdvocatesParams = {}) {
  return useQuery({
    queryKey: [
      "advocates",
      params.search || "",
      params.degree || "",
      params.city || "",
      params.specialty || "",
      params.experience || "",
    ],
    queryFn: fetchAdvocates,
  });
}
