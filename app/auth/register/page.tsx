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
    latitude: "",
    longitude: "",
  });

  const [stations, setStations] = useState<Station[]>([]);
  const [locationError, setLocationError] = useState<string | null>(null);
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

  useEffect(() => {
    if ((form.role === "OFFICER" || form.role === "POLICE_STATION") && !form.latitude && !form.longitude) {
      getLiveLocation();
    }
  }, [form.role]);

  const getLiveLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }));
          setLocationError(null);
        },
        (error) => {
          setLocationError("Unable to retrieve live location. Please enter manually.");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(form.latitude);
    const lon = parseFloat(form.longitude);
    if (!form.latitude || !form.longitude || isNaN(lat) || isNaN(lon)) {
      setLocationError("Please provide valid latitude and longitude.");
      return;
    }
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setLocationError("Latitude must be between -90 and 90, longitude between -180 and 180.");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        router.push("/auth/login");
      } else {
        const errorData = await response.json();
        setLocationError(errorData.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setLocationError("An unexpected error occurred during registration");
    }
  };

  const renderLocationFields = () => (
    <>
      <div>
        <p className="text-sm text-gray-600">
          Current Location: {form.latitude && form.longitude ? `${form.latitude}, ${form.longitude}` : "Fetching..."}
        </p>
        {locationError && <p className="text-red-500 text-sm mt-1">{locationError}</p>}
        <button
          type="button"
          onClick={getLiveLocation}
          className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 mt-2"
        >
          Refresh Live Location
        </button>
      </div>
      <div>
        <input
          name="latitude"
          type="number"
          step="any"
          onChange={handleChange}
          value={form.latitude}
          placeholder="Latitude"
          required
          className="w-full p-2 border border-red-300 rounded"
        />
      </div>
      <div>
        <input
          name="longitude"
          type="number"
          step="any"
          onChange={handleChange}
          value={form.longitude}
          placeholder="Longitude"
          required
          className="w-full p-2 border border-red-300 rounded"
        />
      </div>
    </>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 border border-red-200 shadow-md rounded">
      <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">Register</h2>

      <input
        name="email"
        type="email"
        onChange={handleChange}
        value={form.email}
        placeholder="Email"
        required
        className="w-full p-2 border border-red-300 rounded"
      />
      <input
        name="password"
        type="password"
        onChange={handleChange}
        value={form.password}
        placeholder="Password"
        required
        className="w-full p-2 border border-red-300 rounded"
      />
      <select
        name="role"
        onChange={handleChange}
        value={form.role}
        className="w-full p-2 border border-red-300 rounded"
      >
        <option value="OFFICER">Police Officer</option>
        <option value="POLICE_STATION">Police Station</option>
      </select>

      {form.role === "OFFICER" && (
        <>
          <input
            name="phone"
            onChange={handleChange}
            value={form.phone}
            placeholder="Phone"
            required
            className="w-full p-2 border border-red-300 rounded"
          />
          <input
            name="badge_number"
            onChange={handleChange}
            value={form.badge_number}
            placeholder="Badge Number"
            required
            className="w-full p-2 border border-red-300 rounded"
          />
          <select
            name="station_id"
            onChange={handleChange}
            value={form.station_id}
            required
            className="w-full p-2 border border-red-300 rounded"
          >
            <option value="">Select Police Station</option>
            {stations.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name}
              </option>
            ))}
          </select>
          {renderLocationFields()}
        </>
      )}

      {form.role === "POLICE_STATION" && (
        <>
          <input
            name="name"
            onChange={handleChange}
            value={form.name}
            placeholder="Station Name"
            required
            className="w-full p-2 border border-red-300 rounded"
          />
          <input
            name="contact_number"
            onChange={handleChange}
            value={form.contact_number}
            placeholder="Contact Number"
            required
            className="w-full p-2 border border-red-300 rounded"
          />
          <input
            name="address"
            onChange={handleChange}
            value={form.address}
            placeholder="Address"
            required
            className="w-full p-2 border border-red-300 rounded"
          />
          {renderLocationFields()}
        </>
      )}

      <button
        type="submit"
        className="w-full p-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700"
      >
        Register
      </button>
    </form>
  );
}
