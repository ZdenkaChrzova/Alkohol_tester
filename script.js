document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('testerForm');
  const toggle = document.getElementById('darkModeToggle');

  // Přepínání tmavého režimu
  toggle.addEventListener('change', () => {
    document.body.classList.toggle('dark', toggle.checked);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Osobní údaje
    const gender = document.getElementById('gender').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const endTime = document.getElementById('endTime').value;
    const limit = parseFloat(document.getElementById('limit').value);

    // Pivo
    const beer10_count = parseInt(document.getElementById('beer10_count').value) || 0;
    const beer10_volume = parseInt(document.getElementById('beer10_volume').value) || 0;
    const beer11_count = parseInt(document.getElementById('beer11_count').value) || 0;
    const beer11_volume = parseInt(document.getElementById('beer11_volume').value) || 0;
    const beer12_count = parseInt(document.getElementById('beer12_count').value) || 0;
    const beer12_volume = parseInt(document.getElementById('beer12_volume').value) || 0;

    // Víno
    const whiteWine_count = parseInt(document.getElementById('whiteWine_count').value) || 0;
    const whiteWine_volume = parseInt(document.getElementById('whiteWine_volume').value) || 0;
    const redWine_count = parseInt(document.getElementById('redWine_count').value) || 0;
    const redWine_volume = parseInt(document.getElementById('redWine_volume').value) || 0;

    // Tvrdý alkohol
    const spirits38 = parseInt(document.getElementById('spirits38').value) || 0;
    const spirits40 = parseInt(document.getElementById('spirits40').value) || 0;

    // Výpočet alkoholu v gramech
    const alcoholGrams =
      (beer10_count * beer10_volume * 0.038 * 0.8) +
      (beer11_count * beer11_volume * 0.045 * 0.8) +
      (beer12_count * beer12_volume * 0.05 * 0.8) +
      (whiteWine_count * whiteWine_volume * 0.11 * 0.8) +
      (redWine_count * redWine_volume * 0.13 * 0.8) +
      (spirits38 * 50 * 0.38 * 0.8) +
      (spirits40 * 50 * 0.40 * 0.8);

    const r = gender === 'male' ? 0.7 : 0.6;
    const bacInitial = alcoholGrams / (weight * r);

    // Časový rozdíl od poslední skleničky
    const now = new Date();
    const [h, m] = endTime.split(':');
    let end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
    if (end > now) end.setDate(end.getDate() - 1);
    const hoursPassed = (now - end) / (1000 * 60 * 60);

    // Rychlost odbourávání alkoholu
    const eliminationRate = 0.15;

    // Výpočet aktuální hladiny
    let bacCurrent = bacInitial - (eliminationRate * hoursPassed);
    bacCurrent = Math.max(0, bacCurrent);
    const bacRounded = bacCurrent.toFixed(2);

    // Výstup
    let message = `Hladina alkoholu v době poslední skleničky: <strong>${bacInitial.toFixed(2)} ‰</strong><br>`;
    message += `Odhadovaná aktuální hladina alkoholu: <strong>${bacRounded} ‰</strong><br>`;
    message += `Rychlost odbourávání alkoholu: <strong>${eliminationRate.toFixed(2)} ‰ za hodinu</strong><br>`;

    if (bacCurrent > limit) {
      const hoursToSafe = (bacCurrent - limit) / eliminationRate;
      const minutesToSafe = Math.round(hoursToSafe * 60);
      const safeTime = new Date(now.getTime() + hoursToSafe * 60 * 60 * 1000);
      const safeHours = safeTime.getHours().toString().padStart(2, '0');
      const safeMinutes = safeTime.getMinutes().toString().padStart(2, '0');
      message += `Překročeno! Doporučeno počkat přibližně ${minutesToSafe} minut.<br>`;
      message += `Bezpečná hladina bude dosažena přibližně v <strong>${safeHours}:${safeMinutes}</strong>.`;
    } else {
      message += `Jste pod limitem.`;
    }

    document.getElementById('result').innerHTML = message;
  });
});
