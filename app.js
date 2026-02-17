import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json({ limit: "15mb" }));

const API_KEY = "AIzaSyCkTXQlnKA1ucOy77fvQ1S7s7tjBJxaqBM";

const PROMPTS = {
  llantas: "Analiza la llanta bajo Res 3768/2013 Colombia: profundidad, cortes, veredicto técnico.",
  humo: "Analiza humo de escape: color, causa probable y si es causal de rechazo RTM.",
  goteos: "Analiza fluido: tipo, gravedad y acción correctiva."
};

app.get("/", (req,res)=>{
res.send(`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>RTM Vision AI</title>
<script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-slate-950 text-white flex items-center justify-center min-h-screen">

<div class="w-96 space-y-4">

<h1 class="text-2xl font-black text-center">RTM Vision AI</h1>

<select id="cat" class="w-full p-3 rounded bg-slate-800">
<option value="">Seleccionar categoría</option>
<option value="llantas">Llantas</option>
<option value="humo">Humo</option>
<option value="goteos">Goteos</option>
</select>

<input type="file" id="file" class="w-full">

<button onclick="analyze()" class="w-full bg-blue-600 p-4 rounded font-bold">
Analizar Imagen
</button>

<div id="result" class="p-4 bg-slate-800 rounded hidden"></div>

</div>

<script>
async function analyze(){
 const file = document.getElementById("file").files[0];
 const cat = document.getElementById("cat").value;
 const result = document.getElementById("result");

 if(!file || !cat){
  alert("Sube imagen y selecciona categoría");
  return;
 }

 const reader = new FileReader();
 reader.onload = async e => {

  const base64 = e.target.result.split(",")[1];

  result.classList.remove("hidden");
  result.innerHTML="Analizando imagen...";

  const res = await fetch("/analyze",{
    method:"POST",
    headers:{ "Content-Type":"application/json"},
    body: JSON.stringify({ image: base64, category: cat, mime:file.type })
  });

  const data = await res.json();
  result.innerText = data.result || data.error;
 };

 reader.readAsDataURL(file);
}
</script>

</body>
</html>`);
});

app.post("/analyze", async (req,res)=>{
 try{
  const { image, category, mime } = req.body;

  const response = await fetch(
   "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key="+API_KEY,
   {
    method:"POST",
    headers:{ "Content-Type":"application/json"},
    body: JSON.stringify({
     contents:[{
      parts:[
       { text: PROMPTS[category] },
       { inlineData:{ mimeType: mime, data: image }}
      ]
     }]
    })
   }
  );

  const data = await response.json();

  const text =
   data.candidates?.[0]?.content?.parts?.[0]?.text ||
   "No se pudo analizar la imagen";

  res.json({ result:text });

 }catch(err){
  res.json({ error: err.message });
 }
});

app.listen(3000,()=>console.log("Servidor listo"));
