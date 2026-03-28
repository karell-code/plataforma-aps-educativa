// Script para generar 30 códigos de estudiante aleatorios seguros
// Ejecutar en Node.js o consola del navegador

function generateRandomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'EST-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Generar 30 códigos únicos
const codes = new Set();
while(codes.size < 30) {
  codes.add(generateRandomCode());
}

console.log("=== CÓDIGOS DE ESTUDIANTES PARA KKK ===\n");
console.log("Copia estos códigos en la hoja 'estudiantes' de tu Google Sheet:\n");
console.log("codigo,nombre,email,estado,fecha_registro");

let i = 1;
codes.forEach(code => {
  console.log(`${code},Estudiante ${i},estudiante${i}@email.com,active,${new Date().toISOString().split('T')[0]}`);
  i++;
});

console.log("\n=== FIN DE LA LISTA ===");
