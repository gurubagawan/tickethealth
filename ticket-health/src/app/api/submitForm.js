export async function submitForm(data) {
  const res = await fetch("http://localhost:3000/api/submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ submission: data }),
  });

  if (!res.ok) throw new Error("Failed to submit");
  return res.json();
}

