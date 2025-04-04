"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Station {
  id: string;
  name: string;
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "OFFICER",
    phone: "",
    badge_number: "",
    station_id: "",
    name: "",
    contact_number: "",
    address: "",
  });

  const [stations, setStations] = useState<Station[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchStations() {
      try {
        const res = await fetch("/api/stations");
        if (!res.ok) throw new Error("Failed to fetch stations");
        const data: Station[] = await res.json();
        setStations(data);
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    }
    fetchStations();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) router.push("/auth/login");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" onChange={handleChange} placeholder="Email" required />
      <input name="password" type="password" onChange={handleChange} placeholder="Password" required />
      <select name="role" onChange={handleChange}>
        <option value="OFFICER">Police Officer</option>
        <option value="POLICE_STATION">Police Station</option>
      </select>

      {form.role === "OFFICER" && (
        <>
          <input name="phone" onChange={handleChange} placeholder="Phone" required />
          <input name="badge_number" onChange={handleChange} placeholder="Badge Number" required />
          <select name="station_id" onChange={handleChange} required>
            <option value="">Select Police Station</option>
            {stations.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name}
              </option>
            ))}
          </select>
        </>
      )}

      {form.role === "POLICE_STATION" && (
        <>
          <input name="name" onChange={handleChange} placeholder="Station Name" required />
          <input name="contact_number" onChange={handleChange} placeholder="Contact Number" required />
          <input name="address" onChange={handleChange} placeholder="Address" required />
        </>
      )}
      <button type="submit">Register</button>
    </form>
  );
}
