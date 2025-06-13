

import pembelajarSejatiIcon from '../assets/badges/pembelajar-sejati.png';
import kesejahteraanDigitalIcon from '../assets/badges/kesejahteraan-digital.png';
import pejuangPagiIcon from '../assets/badges/pejuang-pagi.png';
import ahliPerhatianDiriIcon from '../assets/badges/ahli-perhatian-diri.png';
import pakarFinansialIcon from '../assets/badges/pakar-finansial.png';
import jagoanSosislIcon from '../assets/badges/jagoan-sosial.png';
import selfCareIcon from '../assets/badges/self-care.png';
import momentumTerjagaIcon from '../assets/badges/momentum-terjaga.png';
import kreatifitasIcon from '../assets/badges/kreatifitas.png';


export const badgeList = {
  // Badge yang sudah ada
  //1
  pejuangPagi: { 
    name: 'Pejuang Pagi', 
    description: 'Menyelesaikan 1 challenge sebelum jam 9 pagi.', 
    imageUrl: pejuangPagiIcon
  },
  //
  mindfulnessMaster: { 
    name: 'Ahli Mindfulness', 
    description: 'Menyelesaikan 5 challenge dari kategori Mindfulness(Perhatian Diri).', 
    imageUrl: ahliPerhatianDiriIcon
  },
  //3
  socialConnector: {
    name: 'Jagoan Sosial',
    description: 'Menyelesaikan 3 challenge dari kategori Social.',
    imageUrl: jagoanSosislIcon
  },
  //4
  selfCareChampion: {
    name: 'Juara Self-Care',
    description: 'Menyelesaikan 5 challenge dari kategori Self-Care.',
    imageUrl: selfCareIcon
  },
  //5
  konsistenSeminggu: { 
    name: 'Momentum Terjaga', 
    description: 'Menyelesaikan challenge 7 hari berturut-turut.', 
    imageUrl: momentumTerjagaIcon
  },

  // --- 🏆 BADGE BARU YANG KITA TAMBAHKAN ---6
  digitalDetoxer: {
    name: 'Pendetoks Digital',
    description: 'Menyelesaikan 3 challenge kategori Digital Wellbeing atau Self-Reflection(Refleksi-Diri).',
    imageUrl: kesejahteraanDigitalIcon
  },

  //7
  creativeSoul: {
    name: 'Jiwa Kreatif',
    description: 'Menyelesaikan 3 challenge dari kategori Creativity.',
    imageUrl: kreatifitasIcon
  },
  //8
  trueLearner: {
    name: 'Pembelajar Sejati',
    description: 'Menyelesaikan tantangan dari 5 kategori yang berbeda.',
    imageUrl: pembelajarSejatiIcon
  },
  //9
  financialGuru: {
    name: 'Pakar Finansial',
    description: 'Menyelesaikan 2 challenge dari kategori Financial Wellness(Kesehatan Keuangan).',
    imageUrl: pakarFinansialIcon
  },
};