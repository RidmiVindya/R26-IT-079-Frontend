const BASE_URL = "http://127.0.0.1:8002/api/iot";

export const getLiveSensorData = async () => {
  const response = await fetch(`${BASE_URL}/live`);
  if (!response.ok) throw new Error("Failed to fetch live sensor data");
  return await response.json();
};

export const heaterOn = () =>
  fetch(`${BASE_URL}/command`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command: "heater_on" }),
  });

export const heaterOff = () =>
  fetch(`${BASE_URL}/command`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command: "heater_off" }),
  });
export const dryAirOn = () =>
  fetch(`${BASE_URL}/command`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command: "dry_air_on" }),
  });

export const dryAirOff = () =>
  fetch(`${BASE_URL}/command`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command: "dry_air_off" }),
  });

export const exhaustOn = () =>
  fetch(`${BASE_URL}/command`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command: "exhaust_on" }),
  });

export const exhaustOff = () =>
  fetch(`${BASE_URL}/command`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command: "exhaust_off" }),
  });
  export const lightOn = () =>
  fetch(`${BASE_URL}/command`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command: "light_on" }),
  });

export const lightOff = () =>
  fetch(`${BASE_URL}/command`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command: "light_off" }),
  });