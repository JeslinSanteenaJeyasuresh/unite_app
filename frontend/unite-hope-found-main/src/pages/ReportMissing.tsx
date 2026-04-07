import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Upload, ArrowLeft } from "lucide-react";

const genders = ["Male", "Female", "Other"];

const indianStates = [
  "Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh",
  "Telangana", "Maharashtra", "Delhi"
];

export default function ReportMissing() {
  const { t, role, refreshCases } = useApp();
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    height: "",
    city: "",
    state: "Tamil Nadu",
    clothing: "",
    missingDate: ""
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please upload image");
      return;
    }

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("name", form.name);
    formData.append("age", form.age);
    formData.append("gender", form.gender);
    formData.append("height", form.height);
    formData.append("city", form.city);
    formData.append("state", form.state);
    formData.append("address", `${form.city}, ${form.state}`);
    formData.append(
      "identification_mark",
      `Clothing: ${form.clothing} | Height: ${form.height} | Missing since: ${form.missingDate}`
    );
    formData.append("blood_group", "-");

    const res = await fetch("http://localhost:8000/cases/create-case", {
      method: "POST",
      body: formData
    });

    if (res.ok) {
      await refreshCases();
      alert("Case submitted successfully!");
    } else {
      alert("Error submitting case");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="py-10 px-4 bg-blue-900 text-white">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex gap-2 mb-4">
            <ArrowLeft size={18} /> Back
          </button>
          <h1 className="text-3xl font-bold">Report Missing Person</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl shadow">

          {/* Upload */}
          <div>
            <label className="font-medium">Upload Photo</label>
            <div className="border-2 border-dashed p-6 rounded-lg text-center relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {imagePreview ? (
                <img src={imagePreview} className="w-24 h-24 mx-auto rounded" />
              ) : (
                <Upload className="mx-auto text-gray-400" size={40} />
              )}
            </div>
          </div>

          {/* Name + Age */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border p-3 rounded"
            />
            <input
              type="number"
              placeholder="Age"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              className="border p-3 rounded"
            />
          </div>

          {/* Gender + Height */}
          <div className="grid grid-cols-2 gap-4">
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="border p-3 rounded"
            >
              {genders.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Height (cm)"
              value={form.height}
              onChange={(e) => setForm({ ...form, height: e.target.value })}
              className="border p-3 rounded"
            />
          </div>

          {/* City + State */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="border p-3 rounded"
            />

            <select
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="border p-3 rounded"
            >
              {indianStates.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Clothing */}
          <textarea
            placeholder="Clothing description"
            value={form.clothing}
            onChange={(e) => setForm({ ...form, clothing: e.target.value })}
            className="border p-3 rounded w-full"
          />

          {/* Missing Date */}
          <input
            type="date"
            value={form.missingDate}
            onChange={(e) =>
              setForm({ ...form, missingDate: e.target.value })
            }
            className="border p-3 rounded w-full"
          />

          <button className="bg-blue-600 text-white p-3 rounded w-full">
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}
