// file: backend/test-import.js

// Kita akan mencoba mengimpor paketnya dan langsung melihat isinya.
try {
  console.log("Mencoba mengimpor @azure/openai...");
  const AzureOpenAI_Package = require("@azure/openai");

  console.log("\n--- ISI PAKET @azure/openai ---");
  console.log(AzureOpenAI_Package);
  console.log("---------------------------------");

  console.log("\nApakah 'OpenAIClient' ada di dalamnya?");
  console.log("AzureOpenAI_Package.OpenAIClient ->", AzureOpenAI_Package.OpenAIClient);

} catch (e) {
  console.error("\n!!! GAGAL MENGIMPOR PAKET !!!");
  console.error(e);
}