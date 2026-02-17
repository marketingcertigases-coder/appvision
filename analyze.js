export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    return res.status(200).json({
      resultado: "Imagen recibida correctamente",
      categoria: req.body?.categoria || "No enviada"
    });
  } catch (error) {
    return res.status(500).json({ error: "Error al analizar imagen" });
  }
}
