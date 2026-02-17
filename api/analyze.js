export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    return res.status(200).json({
      ok: true,
      mensaje: "Imagen recibida correctamente"
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Error analizando imagen"
    });
  }
}
