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
  console.log(results);

  return {
    U: results[0].grid,
    D: results[1].grid,
    F: results[2].grid,
    B: results[3].grid,
    L: results[4].grid,
    R: results[5].grid,
  };
};
