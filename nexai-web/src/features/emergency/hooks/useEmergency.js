import { useState, useCallback } from 'react';

export function useEmergency() {
  const [isLocating, setIsLocating] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const requestLocation = useCallback(() => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by this browser.");
        resolve(null);
        return;
      }

      setIsLocating(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          setLocation(loc);
          setIsLocating(false);
          resolve(loc);
        },
        (err) => {
          console.error("Location error:", err);
          setError("Failed to get location. Proceeding without GPS.");
          setIsLocating(false);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }, []);

  const triggerSOS = useCallback(async (patientProfile, latestMeasurements = []) => {
    const loc = await requestLocation();
    
    // Construct SOS Message
    const name = patientProfile?.name || "A NexAI Patient";
    const weeks = patientProfile?.pregnancy_week ? `${patientProfile.pregnancy_week} weeks pregnant` : "pregnant";
    
    let msg = `🚨 EMERGENCY: ${name} (${weeks}) needs immediate medical assistance.\n`;
    
    if (loc) {
      msg += `\n📍 Location: https://maps.google.com/?q=${loc.lat},${loc.lng}\n`;
    }

    // Append latest critical vitals if available
    const criticalVitals = [];
    latestMeasurements.forEach(m => {
      if (m.type === 'blood_pressure') criticalVitals.push(`BP: ${m.value}`);
      if (m.type === 'heart_rate') criticalVitals.push(`HR: ${m.value} bpm`);
    });

    if (criticalVitals.length > 0) {
      msg += `\nLatest Vitals: ${criticalVitals.join(', ')}`;
    }

    // Trigger local SMS intent (Zero-Trust Fallback)
    const encodedMsg = encodeURIComponent(msg);
    // In a real app, this might go to an emergency contact or 911/112 equivalent
    // We use a generic dialer format for the hackathon
    const emergencyNumber = patientProfile?.emergency_contact || "911";
    
    // Attempt to open the native SMS app
    window.location.href = `sms:${emergencyNumber}?body=${encodedMsg}`;

  }, [requestLocation]);

  return {
    triggerSOS,
    isLocating,
    location,
    error
  };
}
