const bcrypt = require('bcryptjs');

const generateHashes = async () => {
  const passwords = ['admin123', 'student123', 'instructor123'];
  
  for (const password of passwords) {
    const hash = await bcrypt.hash(password, 12);
    console.log(`${password}: ${hash}`);
  }
};

generateHashes();