import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp, MissingPerson } from "@/context/AppContext";
import { ArrowLeft, X, AlertTriangle, Phone } from "lucide-react";

export default function ReportFound() {
  const { t, missingPersons } = useApp();
  const navigate = useNavigate();
  const [selectedPerson, setSelectedPerson] = useState<MissingPerson | null>(null);
  const [matchFound, setMatchFound] = useState(false);

  const handleMoreDetails = (person: MissingPerson) => {
    setSelectedPerson(person);
    // Mock AI match logic: show match for first person
    setMatchFound(person.id === "1" || person.id === missingPersons[0]?.id);
  };

  return (
    <div className="min-h-screen bg-background page-enter">
      <div className="py-10 px-4" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-6xl mx-auto">
          <button onClick={() => navigate("/admin-dashboard")} className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white">{t("reportFound")}</h1>
          <p className="text-white/70 mt-1">Review missing persons and check for AI matches</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold text-foreground">{t("missingPersonsList")}</h2>
          <span className="badge-emergency">{missingPersons.length} Records</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {missingPersons.map((person) => (
            <div key={person.id} className="card-unite">
              <div className="flex items-center gap-3 mb-4">
                <img src={person.imageUrl} alt={person.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-foreground">{person.name}</h3>
                  <p className="text-sm text-muted-foreground">Age: {person.age}</p>
                  {person.status === "missing" && <span className="badge-emergency mt-1">Missing</span>}
                  {person.status === "found" && <span className="badge-success mt-1">Found</span>}
                  {person.status === "cleared" && <span className="badge-success mt-1">Cleared</span>}
                </div>
              </div>
              <div className="space-y-1.5 text-sm text-muted-foreground mb-4">
                <p><span className="font-medium text-foreground">Address:</span> {person.address}</p>
                <p><span className="font-medium text-foreground">Blood:</span> {person.bloodGroup}</p>
                <p><span className="font-medium text-foreground">Reported:</span> {person.reportedAt}</p>
              </div>
              <button
                onClick={() => handleMoreDetails(person)}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-primary border-2 hover:bg-primary hover:text-white transition-all duration-200"
                style={{ borderColor: "hsl(var(--primary))" }}
              >
                {t("moreDetails")} →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl page-enter overflow-hidden">
            <div className="p-6 border-b border-border flex items-start justify-between">
              <h2 className="text-xl font-bold text-foreground">Person Details</h2>
              <button onClick={() => setSelectedPerson(null)} className="p-1 rounded-lg hover:bg-secondary transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {matchFound && (
              <div className="mx-6 mt-4 rounded-xl p-4 flex items-start gap-3 page-enter" style={{ background: "hsl(var(--emergency) / 0.1)", border: "1px solid hsl(var(--emergency) / 0.3)" }}>
                <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: "hsl(var(--emergency))" }} />
                <div>
                  <p className="font-bold text-lg" style={{ color: "hsl(var(--emergency))" }}>{t("matchFound")}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{t("matchDesc")}</p>
                </div>
              </div>
            )}

            <div className="p-6">
              <div className="flex items-center gap-4 mb-5">
                <img src={selectedPerson.imageUrl} alt={selectedPerson.name} className="w-20 h-20 rounded-xl object-cover" />
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedPerson.name}</h3>
                  <p className="text-muted-foreground">Age: {selectedPerson.age}</p>
                  {selectedPerson.status === "missing" && <span className="badge-emergency mt-1">Missing</span>}
                  {selectedPerson.status === "found" && <span className="badge-success mt-1">Found</span>}
                  {selectedPerson.status === "cleared" && <span className="badge-success mt-1">Cleared</span>}
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Address", value: selectedPerson.address },
                  { label: "Blood Group", value: selectedPerson.bloodGroup },
                  { label: "Identification Mark", value: selectedPerson.identificationMark },
                  { label: "Reported Date", value: selectedPerson.reportedAt },
                  { label: "Case ID", value: `UNITE-2024-${selectedPerson.id.padStart(4, "0")}` },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-start py-2 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{item.value}</span>
                  </div>
                ))}
              </div>

              {matchFound && (
                <a href="tel:1800-123-4567" className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90" style={{ background: "hsl(var(--emergency))" }}>
                  <Phone className="w-4 h-4" />
                  Call Emergency: 1800-123-4567
                </a>
              )}

              <button onClick={() => setSelectedPerson(null)} className="mt-3 w-full py-3 rounded-xl border border-border font-medium text-muted-foreground hover:bg-secondary transition-colors">
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
