

console.log("--- Memulai Investigasi Paket @azure/openai ---");
try {
    //  mengimpor paketnya dan langsung melihat isinya.
    const openai_pkg = require("@azure/openai");

    console.log("\n1. Berhasil me-require('@azure/openai').");
    console.log("\n2. Tipe dari objek yang diimpor adalah:", typeof openai_pkg);
    console.log("\n3. Kunci/Properti yang tersedia di dalamnya:", Object.keys(openai_pkg));

    console.log("\n--- Detail Objek Lengkap ---");
    console.dir(openai_pkg, { depth: null }); // 'console.dir' untuk melihat struktur objek
    console.log("----------------------------");

    console.log("\n--- Pengecekan Spesifik ---");
    console.log("Apakah 'AzureKeyCredential' ada? ->", typeof openai_pkg.AzureKeyCredential);

} catch (e) {
    console.error("\n!!! GAGAL TOTAL saat me-require paket !!!");
    console.error(e);
}