export const detectColors = async (images: File[]) => {
  const formData = new FormData();
  images.forEach((file, idx) => {
    if (file) {
      formData.append("images", file, file.name || `face${idx + 1}.jpg`);
    }
  });

  const response = await fetch("/api/detection", {
    method: "POST",
    body: formData,
  });
  const { results } = await response.json();

  return [
    results[0].grid,
    results[1].grid,
    results[2].grid,
    results[3].grid,
    results[4].grid,
    results[5].grid,
  ];
};
