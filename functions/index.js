const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldPath } = require("firebase-admin/firestore");
const cors = require("cors")({ origin: true });

initializeApp();
const db = getFirestore();

exports.processChallengeCompletion = onRequest({ cors: true, memory: "256MiB", region: "us-central1" }, async (request, response) => {
  cors(request, response, async () => {
    if (request.method !== "POST") {
      return response.status(405).send({ error: { message: "Method Not Allowed" } });
    }

    try {
      const { userId, challenge } = request.body;
      if (!userId || !challenge || !challenge.id) {
        return response.status(400).send({ error: { message: "Data tidak lengkap." } });
      }

      const userDocRef = db.collection("users").doc(userId);
      const userDoc = await userDocRef.get();
      const currentBadges = userDoc.data()?.badges || {};
      
      const challengesQuery = db
        .collectionGroup("challenges")
        .where(FieldPath.documentId(), ">=", `users/${userId}/`)
        .where(FieldPath.documentId(), "<", `users/${userId}~`);
      
      const challengesSnapshot = await challengesQuery.get();

      const challengeHistory = challengesSnapshot.docs
        .map((doc) => doc.data())
        .filter((ch) => ch.completed === true);

      challengeHistory.push({
        title: challenge.title,
        category: challenge.category,
      });

      const newBadges = { ...currentBadges };
      let aBadgeWasAwarded = false;

      // --- KUMPULAN LOGIKA BADGE SESUAI KONFIGURASI ANDA ---
      
      // Logika #1: pejuangPagi
      const wibHourString = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Jakarta', hour: '2-digit', hour12: false });
      const wibHour = parseInt(wibHourString, 10);
      if (!newBadges.pejuangPagi && wibHour < 9) {
          newBadges.pejuangPagi = true; aBadgeWasAwarded = true;
      }

      // Logika #2: mindfulnessMaster (menggunakan kategori "Perhatian diri")
      const mindfulnessCount = challengeHistory.filter((ch) => ch.category === "Perhatian diri").length;
      if (!newBadges.mindfulnessMaster && mindfulnessCount >= 5) {
          newBadges.mindfulnessMaster = true; aBadgeWasAwarded = true;
      }
      
      // Logika #3: socialConnector (menggunakan kategori "Sosial")
      const sosialCount = challengeHistory.filter((ch) => ch.category === "Sosial").length;
      if (!newBadges.socialConnector && sosialCount >= 3) {
        newBadges.socialConnector = true; aBadgeWasAwarded = true;
      }

      // Logika #4: selfCareChampion
      const selfCareCount = challengeHistory.filter(ch => ch.category === "Self-Care").length;
      if (!newBadges.selfCareChampion && selfCareCount >= 5) {
        newBadges.selfCareChampion = true; aBadgeWasAwarded = true;
      }
      
      // Logika #5: digitalDetoxer (menggunakan kategori "Kesejahteraan Digital" & "Refleksi-diri")
      const digitalWellnessCategories = ["Kesejahteraan Digital", "Refleksi-diri"];
      const digitalWellnessCount = challengeHistory.filter(ch => digitalWellnessCategories.includes(ch.category)).length;
      if (!newBadges.digitalDetoxer && digitalWellnessCount >= 3) {
        newBadges.digitalDetoxer = true; aBadgeWasAwarded = true;
      }

      // Logika #6: creativeSoul (menggunakan kategori "Kreatifitas")
      const kreatifitasCount = challengeHistory.filter(ch => ch.category === "Kreatifitas").length;
      if (!newBadges.creativeSoul && kreatifitasCount >= 3) {
        newBadges.creativeSoul = true; aBadgeWasAwarded = true;
      }

      // Logika #7: trueLearner
      const uniqueCategories = new Set(challengeHistory.map(ch => ch.category));
      if (!newBadges.trueLearner && uniqueCategories.size >= 5) {
        newBadges.trueLearner = true; aBadgeWasAwarded = true;
      }

      // Logika #8: financialGuru (menggunakan kategori "Kesehatan Keuangan")
      const keuanganCount = challengeHistory.filter(ch => ch.category === "Kesehatan Keuangan").length;
      if (!newBadges.financialGuru && keuanganCount >= 2) {
        newBadges.financialGuru = true; aBadgeWasAwarded = true;
      }

      // Logika untuk 'konsistenSeminggu' lebih kompleks dan tidak disertakan
      // untuk menjaga stabilitas kode saat ini.

      if (aBadgeWasAwarded) {
        await userDocRef.set({ badges: newBadges }, { merge: true });
        return response.status(200).send({ data: { success: true, message: "Selamat! Anda mendapatkan badge baru!" } });
      } else {
        return response.status(200).send({ data: { success: true, message: "Progres disimpan. Terus berjuang!" } });
      }

    } catch (error) {
      console.error("CRITICAL ERROR:", error);
      return response.status(500).send({ error: { message: "Terjadi kesalahan fatal di server." } });
    }
  });
});
