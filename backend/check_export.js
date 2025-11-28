(async () => {
  try {
    const module = await import('./src/controllers/ongs.controller.js');
    console.log('Module loaded successfully');
    console.log('postOng:', module.postOng);
  } catch (e) {
    console.error('Import failed:', e);
  }
})();
