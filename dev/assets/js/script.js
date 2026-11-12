let AHP;


// TW3 2012
/*
AHP = {
  male: [
    [7,69.4],[8,72.6],[9,75.6],[10,78.4],[11,80.8],
    [12,84.5],[13,88.2],[14,93.1],[15,96.5],[16,98.1]
  ],
  female: [
    [7,74.2],[8,77.9],[9,81.2],[10,85.4],[11,88.8],
    [12,92.0],[13,96.2],[14,98.0],[15,99.0],[16,99.2]
  ]
};*/


// 1965

AHP = {
  male: [
    [7,69.0],[8,72.2],[9,75.4],[10,78.3],[11,81.3],
    [12,84.1],[13,87.1],[14,92.0],[15,96.6],[16,98.8]
  ],
  female: [
    [7,73.6],[8,77.1],[9,80.5],[10,83.8],[11,87.3],
    [12,92.2],[13,96.7],[14,98.9],[15,99.8],[16,100.0]
  ]
};

// наибольшее

/*
AHP = {
  male: [
    [7,69.4],[8,72.6],[9,75.6],[10,78.4],[11,81.3],
    [12,84.5],[13,88.2],[14,93.1],[15,96.6],[16,98.8]
  ],
  female: [
    [7,74.2],[8,77.9],[9,81.2],[10,85.4],[11,88.8],
    [12,92.2],[13,96.7],[14,98.9],[15,99.8],[16,100.0]
  ]
};
*/

// наименьшее
/*
AHP = {
  male: [
    [7,69.0],[8,72.2],[9,75.4],[10,78.3],[11,80.8],
    [12,84.1],[13,87.1],[14,92.0],[15,96.5],[16,98.1]
  ],
  female: [
    [7,73.6],[8,77.1],[9,80.5],[10,83.8],[11,87.3],
    [12,92.0],[13,96.2],[14,98.0],[15,99.0],[16,99.2]
  ]
}; */


// CDC/NHANES US adults 20+ (2021–2023): percentile -> cm.
const ADULT_REF = {
  male: [
    [5,162.2],[10,165.2],[15,167.5],[25,170.0],
    [50,175.2],[75,180.1],[85,183.0],[90,184.8],[95,187.2]
  ],
  female: [
    [5,149.6],[10,152.0],[15,153.9],[25,156.4],
    [50,161.2],[75,166.1],[85,168.6],[90,170.4],[95,172.5]
  ]
};


// ================================================================
// ПОСТОЯННЫЕ СПРАВОЧНЫЕ ЗНАЧЕНИЯ
// ================================================================
// Эти значения относятся именно к блоку:
// «Средний рост (В США или в России)»
//
// Они НЕ должны изменяться при вводе пользователем
// своих значений среднего роста.

const AVG = {
  male: 178,
  female: 165
};


const genderEl = document.getElementById('gender');
const avgMaleEl = document.getElementById('avgMale');
const avgFemaleEl = document.getElementById('avgFemale');
const ageEl = document.getElementById('age');
const rangeEl = document.getElementById('ageRange');
const heightEl = document.getElementById('height');


rangeEl.addEventListener('input', () => {
  ageEl.value = rangeEl.value;

  console.log(ageEl.value);
  console.log(rangeEl.value);

  calculateGrowth();
});


ageEl.addEventListener('input', () => {
  rangeEl.value = Math.max(7, Math.min(16, Number(ageEl.value) || 7));

  calculateGrowth();
});


genderEl.addEventListener('change', calculateGrowth);
heightEl.addEventListener('input', calculateGrowth);

avgMaleEl.addEventListener('input', calculateGrowth);
avgFemaleEl.addEventListener('input', calculateGrowth);

document.getElementById('calc').addEventListener('click', calculateGrowth);


function fmt(n, digits = 1) {
  return n.toFixed(digits).replace('.', ',');
}


function interpolate(rows, age) {
  if (age <= rows[0][0]) return rows[0][1];

  if (age >= rows[rows.length - 1][0]) {
    return rows[rows.length - 1][1];
  }

  for (let i = 0; i < rows.length - 1; i++) {
    const [x1, y1] = rows[i];
    const [x2, y2] = rows[i + 1];

    if (age >= x1 && age <= x2) {
      return y1 + (age - x1) * (y2 - y1) / (x2 - x1);
    }
  }
}


function percentile(height, gender) {
  const rows = ADULT_REF[gender];

  if (height < rows[0][1]) {
    return { value: 5, bound: '<' };
  }

  if (height > rows[rows.length - 1][1]) {
    return { value: 95, bound: '>' };
  }

  for (let i = 0; i < rows.length - 1; i++) {
    const [p1, h1] = rows[i];
    const [p2, h2] = rows[i + 1];

    if (height >= h1 && height <= h2) {
      const p = p1 + (height - h1) * (p2 - p1) / (h2 - h1);

      return { value: p, bound: '' };
    }
  }

  return { value: 50, bound: '' };
}


function calculateGrowth() {
  const gender = genderEl.value;
  let age = Number(ageEl.value);
  const height = Number(heightEl.value);

  // Значения, которые пользователь ввёл в поля:
  const avgMale = Number(avgMaleEl.value);
  const avgFemale = Number(avgFemaleEl.value);

  const err = document.getElementById('heightError');

  if (!Number.isFinite(age)) {
    age = 15;
  }

  age = Math.max(7, Math.min(16, age));
  rangeEl.value = age;

  if (!Number.isFinite(height) || height < 80 || height > 230) {
    err.hidden = false;
    return;
  }

  err.hidden = true;

  if (
    !Number.isFinite(avgMale) ||
    avgMale < 100 ||
    avgMale > 230 ||
    !Number.isFinite(avgFemale) ||
    avgFemale < 100 ||
    avgFemale > 230
  ) {
    return;
  }

  // ================================================================
  // ВАЖНО:
  // avgMale и avgFemale — пользовательские значения для расчёта.
  //
  // Мы НЕ делаем:
  // AVG.male = avgMale;
  // AVG.female = avgFemale;
  //
  // Поэтому постоянные значения 178 и 165
  // никогда не изменяются.
  // ================================================================

  const reached = interpolate(AHP[gender], age);
  const adult = height / (reached / 100);
  const remainingCm = adult - height;
  const remainingPct = 100 - reached;
  const perc = percentile(adult, gender);

  const pText =
    perc.bound === '<'
      ? `<${perc.value}-го`
      : perc.bound === '>'
        ? `>${perc.value}-го`
        : `≈${Math.round(perc.value)}-й`;

  const genderName = gender === 'male' ? 'Мальчик' : 'Девочка';

  // Средний рост, введённый пользователем, используется
  // только для расчёта текущего результата.

  const avg = gender === 'male' ? avgMale : avgFemale;


  // ================================================================
  // ЛОГИКА ОТОБРАЖЕНИЯ ИНФОРМАЦИИ
  //
  // 1. Прогноз >= среднего:
  //    дополнительная рекомендация не показывается.
  //
  // 2. Прогноз ниже среднего, но менее чем на 2 см:
  //    показываем спокойный информационный блок.
  //    Значение перцентиля скрываем.
  //
  // 3. Прогноз ниже среднего на 2 см или больше:
  //    показываем перцентиль, информацию о взрослых выше/ниже
  //    и рекомендацию обсудить ситуацию с детским эндокринологом.
  // ================================================================

  const deficitFromAverage = avg - adult;

  const needsMinorBelowAverageInfo =
    deficitFromAverage > 0 && deficitFromAverage < 2;

  const needsGrowthHormoneDiscussion =
    deficitFromAverage >= 2;


  // ================================================================
  // ВАЖНО:
  // Справочный блок «Средний рост (В США или в России)»
  // здесь НЕ изменяется.
  //
  // В HTML постоянно указано:
  // 178 см — мужчины
  // 165 см — женщины
  //
  // Эти значения не зависят от введённых пользователем
  // значений avgMale и avgFemale.
  // ================================================================

  document.getElementById('summary').textContent =
    `${genderName}, ${fmt(age, age % 1 ? 1 : 0)}лет, ${fmt(height)} см`;

  document.getElementById('pctReached').textContent =
    `${fmt(reached)}%`;

  document.getElementById('adultHeight').textContent =
    `${fmt(adult)} см`;

  document.getElementById('rgender').textContent =
    genderName;

  document.getElementById('rAge').textContent =
    `${fmt(age, age % 1 ? 1 : 0)} лет`;

  document.getElementById('rHeight').textContent =
    `${fmt(height)} см`;

  document.getElementById('rReached').textContent =
    `${fmt(reached)}%`;

  document.getElementById('rRemaining').innerHTML =
    `<strong class="prediction__highlight">${fmt(Math.max(0, remainingCm))} см / ${fmt(remainingPct)}%</strong>`;

  document.getElementById('rAdult').innerHTML =
    `<strong class="prediction__highlight">${fmt(adult)} см</strong>`;


  // Элементы блока перцентиля и рекомендации.

  const percentileMetric =
    document.getElementById('percentile');

  const percentileCell =
    document.getElementById('rPercentile').closest('td');

  const percentileHeader =
    document.querySelector('.prediction__table thead th:last-child');

  const percentileSection =
    document.getElementById('percentileText').closest('.prediction__section');

  const percentileText =
    document.getElementById('percentileText');

  const growthHormoneAdvice =
    document.getElementById('growthHormoneAdvice');


  // ================================================================
  // ПЕРЦЕНТИЛЬ
  //
  // Подпись метрики остаётся видимой всегда.
  // Скрывается только значение внутри #percentile.
  // ================================================================

  percentileMetric.hidden =
    !needsGrowthHormoneDiscussion;

  // В таблице скрываем ячейку и заголовок перцентиля,
  // если прогноз не ниже среднего на 2 см или больше.

  percentileCell.hidden =
    !needsGrowthHormoneDiscussion;

  if (percentileHeader) {
    percentileHeader.hidden = false;
  }


  // Раздел «Что означает перцентиль» всегда остаётся видимым.

  percentileSection.hidden = false;


  // Обновляем значение перцентиля.

  percentileMetric.textContent =
    `${pText}`;

  document.getElementById('rPercentile').innerHTML =
    `<strong class="prediction__highlight">${pText} перцентиль</strong>`;


  // Блок рекомендации всегда остаётся видимым.

  growthHormoneAdvice.hidden = false;
  growthHormoneAdvice.textContent = '';

  growthHormoneAdvice.classList.remove(
    'prediction__advice_warning',
    'prediction__comparison-result'
  );


  // ================================================================
  // СЛУЧАЙ 1:
  // Прогноз ниже среднего на 2 см или больше.
  //
  // Показываем:
  // - значение перцентиля;
  // - сколько взрослых выше;
  // - сколько ниже;
  // - рекомендацию обсудить ситуацию с эндокринологом.
  // ================================================================

  if (needsGrowthHormoneDiscussion) {

    const low =
      Math.max(0, Math.min(100, perc.value));

    const adultsAbove =
      Math.round(100 - low);

    const adultsBelow =
      Math.round(low);


    if (perc.bound === '<') {

      percentileText.textContent =
        `Прогноз ниже 5-го перцентиля используемой референсной выборки.`;

    } else if (perc.bound === '>') {

      percentileText.textContent =
        `Прогноз выше 95-го перцентиля используемой референсной выборки.`;

    } else {

      percentileText.textContent =
        `В США или в России ~${adultsAbove}% взрослых ${gender === 'male' ? 'мужчин' : 'женщин'} выше этого роста, а ~${adultsBelow}% — ниже.`;

    }


    growthHormoneAdvice.hidden = false;

    growthHormoneAdvice.classList.add(
      'prediction__advice_warning',
      'prediction__comparison-result'
    );

    growthHormoneAdvice.textContent =
      `Прогноз взрослого роста (${fmt(adult)} см) на ${fmt(deficitFromAverage)} см ниже среднего роста ${gender === 'male' ? 'мужчин' : 'женщин'} (${fmt(avg)} см).
      Сайт рекомендует посетить детского эндокринолога и обсудить, есть ли медицинские показания к лечению, в том числе гормоном роста.`;

  }


  // ================================================================
  // СЛУЧАЙ 2:
  // Прогноз ниже среднего, но менее чем на 2 см.
  //
  // Значение перцентиля скрыто.
  // Вместо этого показываем спокойный информационный текст.
  // ================================================================

  else if (needsMinorBelowAverageInfo) {

    percentileText.textContent =
      `Прогнозируемый взрослый рост на ${fmt(deficitFromAverage)} см ниже среднего (${fmt(avg)} см), что не критично.`;

    growthHormoneAdvice.hidden = false;
    growthHormoneAdvice.textContent = '';

  }


  // ================================================================
  // СЛУЧАЙ 3:
  // Прогноз равен среднему или выше него.
  //
  // Раздел остаётся видимым, но дополнительная рекомендация
  // не показывается.
  // ================================================================

  else {

    percentileText.textContent =
      `Прогнозируемый взрослый рост (${fmt(adult)} см) не ниже среднего (${fmt(avg)} см).`;

    growthHormoneAdvice.hidden = false;
    growthHormoneAdvice.textContent = '';

  }

}


calculateGrowth();