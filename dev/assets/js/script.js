let currentLanguage = 'ru';

const I18N = {
  'Определитель роста':'Height Predictor','Калькулятор роста':'Height Calculator',
  'Прогноз взрослого роста ребёнка':'Child Adult Height Prediction',
  'Выберите методику расчёта, затем введите пол, возраст и текущий рост — сайт восстановит предполагаемый взрослый рост.':'Select a calculation method, then enter sex, age, and current height to estimate adult height.',
  'Пол':'Sex','Мальчик':'Boy','Девочка':'Girl','Возраст, лет, месяцев':'Age (years and months)',
  '(введите сколько ЛЕТ и МЕСЯЦЕВ)':'(enter YEARS and MONTHS)','Лучше укажите костный возраст. Его можно определить по рентгену кисти у эндокринолога.':'Bone age is preferable. It can be determined from a hand X-ray by an endocrinologist.',
  'Методика расчёта':'Calculation method','Разброс методик':'Range across methods','Наименьшее значение':'Minimum value','Наибольшее значение':'Maximum value','Среднее арифметическое':'Arithmetic mean',
  'Для выбранной методики нет данных для указанного возраста.':'No data is available for the selected method and age.',
  'Текущий рост, см':'Current height, cm','Введите рост от 80 до 230 см.':'Enter a height between 80 and 230 cm.',
  'Средний рост мужчин, см':'Average male height, cm','Средний рост женщин, см':'Average female height, cm','Средний рост':'Average height','(В США  или в России)':'(in the US or Russia)',
  '178 см — мужчины':'178 cm — men','165 см — женщины':'165 cm — women',
  'После нажатия «Рассчитать» сайт использует новые значения.':'After clicking “Calculate”, the site will use the updated values.','Рассчитать':'Calculate','Результат':'Result',
  'Уже достигнуто':'Already reached','Прогноз взрослого роста':'Predicted adult height','Перцентиль взрослого роста':'Adult height percentile','(если ребёнок отстаёт по росту)':'(if the child is shorter than average)',
  'Пол':'Sex','Возраст':'Age','Рост':'Height','Осталось вырасти':'Growth remaining','Что означает перцентиль':'What the percentile means',
  'Источники методики:':'Methodology sources:','таблица IV':'Table IV','статьи  Flores-Olivares и соавт.':'Flores-Olivares et al. article',
  '(2019), показатель TW3 2012.':'(2019), TW3 2012 data.','В таблице написано - в каком возрасте - какой процент - от будущего взрослого роста - уже достигнут.':'The table shows what percentage of final adult height has been reached at each age.',
  'Перцентиль взрослого роста рассчитывается отдельно по опубликованным взрослым данным CDC/NHANES США 2021–2023':'Adult height percentiles are calculated separately using published US CDC/NHANES adult data from 2021–2023',
  'и линейно интерполируется между указанными в источнике перцентилями.':'and linearly interpolated between the percentiles listed in the source.',
  'Научные исследования и исходные данные':'Scientific studies and source data','Полная сравнительная таблица':'Full comparison table',
  'Сравнение четырёх исходных методик и рассчитанных по ним статистических показателей.':'Comparison of the four original methods and the statistical measures calculated from them.',
  'Таблица IV. Процент взрослого роста в зависимости от возраста и пола':'Table IV. Percentage of adult height by age and sex',
  'Наибольшее':'Maximum','Наименьшее':'Minimum','Среднее':'Mean','арифметическое':'arithmetic','Мужской':'Male','Женский':'Female',
  'Мужской пол':'Male','Женский пол':'Female','лет':'years','Источники методики:':'Methodology sources:',
  'BP 1952 — Bayley & Pinneau':'BP 1952 — Bayley & Pinneau','Процент взрослого роста по методике BP 1952':'Adult height percentage according to the BP 1952 method',
  'Источник данных: продольное исследование Berkeley Growth Study children.':'Data source: Berkeley Growth Study longitudinal study of children.',
  'TW 1965 — Tanner et al.':'TW 1965 — Tanner et al.','Процент взрослого роста по методике TW 1965':'Adult height percentage according to the TW 1965 method',
  'Источник данных: продольное исследование Child Study Centre in London.':'Data source: Child Study Centre in London longitudinal study.',
  'RWT 1983 — Roche et al.':'RWT 1983 — Roche et al.','Процент взрослого роста по методике RWT 1983':'Adult height percentage according to the RWT 1983 method',
  'Оценка методом RWT (Wainer et al., 1978).':'Estimate using the RWT method (Wainer et al., 1978).',
  'TW3 2012 — настоящее исследование':'TW3 2012 — present study','Процент взрослого роста по методике TW3 2012':'Adult height percentage according to the TW3 2012 method',
  'Результаты настоящего исследования, полученные методом TW3':'Results of the present study using the TW3 method',
  'ПОЯСНЕНИЯ И ИСТОЧНИК':'NOTES AND SOURCE','Расшифровка методик':'Method descriptions','Статистические показатели':'Statistical measures',
  'Мужской пол: P = 0,993.':'Male: P = 0.993.','Женский пол: P = 0,581.':'Female: P = 0.581.',
  'Примечание':'Note','Прочерк (—) в оригинальной таблице означает отсутствие значения.':'A dash (—) in the original table indicates that no value was available.',
  'Такие значения не восстанавливались и не заменялись предположительными числами.':'These values were not reconstructed or replaced with estimated numbers.',
  'Источник':'Source','7 лет':'7 years','8 лет':'8 years','9 лет':'9 years','10 лет':'10 years','11 лет':'11 years','12 лет':'12 years','13 лет':'13 years','14 лет':'14 years','15 лет':'15 years','16 лет':'16 years'
};

function t(text) {
  return currentLanguage === 'en' ? (I18N[text] || text) : text;
}

function applyLanguage(language) {
  currentLanguage = language === 'en' ? 'en' : 'ru';
  document.documentElement.lang = currentLanguage;
  document.title = t('Определитель роста');
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const original = node.__ruText ?? node.nodeValue;
    if (node.__ruText === undefined) node.__ruText = original;
    const trimmed = original.trim();
    if (!trimmed) continue;
    const translated = t(trimmed);
    if (translated !== trimmed) {
      const leading = original.match(/^\s*/)?.[0] || '';
      const trailing = original.match(/\s*$/)?.[0] || '';
      node.nodeValue = leading + translated + trailing;
    } else if (currentLanguage === 'ru') {
      node.nodeValue = original;
    }
  }
  document.querySelectorAll('.language-switch__button').forEach(button => {
    const active = button.dataset.lang === currentLanguage;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  if (typeof calculateGrowth === 'function') calculateGrowth();
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.language-switch__button').forEach(button => {
    button.addEventListener('click', () => applyLanguage(button.dataset.lang));
  });
});

let AHP;

const AHP_DATA = {
  BP1952: {
    male: [[7,69.1],[8,72.4],[9,75.6],[10,78.4],[11,81.3],[12,84.0],[13,87.3],[14,91.0],[15,94.6],[16,97.1]],
    female: [[7,74.3],[8,77.6],[9,81.2],[10,84.8],[11,88.7],[12,92.6],[13,96.0],[14,98.3],[15,99.3],[16,99.6]]
  },
  TW1965: {
    male: [[7,69.0],[8,72.2],[9,75.4],[10,78.3],[11,81.3],[12,84.1],[13,87.1],[14,92.0],[15,96.6],[16,98.8]],
    female: [[7,73.6],[8,77.1],[9,80.5],[10,83.8],[11,87.3],[12,92.2],[13,96.7],[14,98.9],[15,99.8],[16,100.0]]
  },
  RWT1983: {
    male: [[7,69.2],[8,72.5],[9,75.6],[10,78.6],[11,81.6],[12,84.9],[13,88.7],[14,92.7],[15,96.0]],
    female: [[7,74.0],[8,77.7],[9,81.0],[10,84.5],[11,88.1],[12,92.0],[13,95.4]]
  },
  TW32012: {
    male: [[7,69.4],[8,72.6],[9,75.6],[10,78.4],[11,80.8],[12,84.5],[13,88.2],[14,93.1],[15,96.5],[16,98.1]],
    female: [[7,74.2],[8,77.9],[9,81.2],[10,85.4],[11,88.8],[12,92.0],[13,96.2],[14,98.0],[15,99.0],[16,99.2]]
  }
};

const METHOD_LABELS = {
  BP1952: 'BP 1952',
  TW1965: 'TW 1965',
  RWT1983: 'RWT 1983',
  TW32012: 'TW3 2012',
  range: 'Разброс методик',
  max: 'Наибольшее значение',
  min: 'Наименьшее значение',
  average: 'Среднее арифметическое'
};

function getValue(rows, age) {
  const item = rows.find(([rowAge]) => rowAge === age);
  return item ? item[1] : null;
}

function getAHPRange(gender, age) {
  const values = Object.keys(AHP_DATA)
    .map(method => interpolate(AHP_DATA[method][gender], age))
    .filter(value => value !== null && value !== undefined);

  if (!values.length) return null;

  return {
    min: Math.min(...values),
    max: Math.max(...values)
  };
}

function calculateAHPStatistics(type) {
  const result = { male: [], female: [] };
  for (const gender of ['male', 'female']) {
    for (let age = 7; age <= 16; age++) {
      const values = Object.keys(AHP_DATA)
        .map(method => getValue(AHP_DATA[method][gender], age))
        .filter(value => value !== null);
      if (!values.length) continue;
      const value = type === 'max' ? Math.max(...values)
        : type === 'min' ? Math.min(...values)
        : values.reduce((sum, item) => sum + item, 0) / values.length;
      result[gender].push([age, value]);
    }
  }
  return result;
}

function getAHP(type) {
  return AHP_DATA[type] || calculateAHPStatistics(type);
}

function methodsColumnIndex(method) {
  return ({
    range: 3,
    BP1952: 4,
    TW1965: 5,
    RWT1983: 6,
    TW32012: 7,
    max: 8,
    min: 9,
    average: 10
  })[method];
}


function renderResearchTable() {
  const table = document.querySelector(
    '.research-tables__table:not(.research-tables__table_compact)'
  );

  if (!table) return;

  // Столбец с разбросом четырёх методик.
  table.querySelectorAll('tbody tr[data-gender][data-age]').forEach(row => {
    const ageCell = row.querySelector('td');

    if (!ageCell || row.querySelector('.research-tables__cell_range')) {
      return;
    }

    const gender = row.dataset.gender;
    const age = Number(row.dataset.age);

    const values = Object.keys(AHP_DATA)
      .map(method => getValue(AHP_DATA[method][gender], age))
      .filter(value => value !== null);

    const cell = document.createElement('td');

    cell.className =
      'research-tables__cell research-tables__cell_range';

    cell.textContent = values.length
      ? `${fmt(Math.min(...values))} – ${fmt(Math.max(...values))}%`
      : '—';

    ageCell.after(cell);
  });

  // Статистические столбцы.
  ['max', 'min', 'average'].forEach(type => {
    table.querySelectorAll('tbody tr[data-gender][data-age]').forEach(row => {
      const value = getValue(
        getAHP(type)[row.dataset.gender],
        Number(row.dataset.age)
      );

      const cell = document.createElement('td');

      cell.textContent = value === null ? '—' : `${fmt(value)}%`;

      row.appendChild(cell);
    });
  });
}

function highlightResearchColumn(method) {
  const table = document.querySelector('.research-tables__table:not(.research-tables__table_compact)');
  if (!table) return;
  table.querySelectorAll('[data-method]').forEach(cell => {
    cell.classList.toggle('research-tables__cell_active', cell.dataset.method === method);
  });
  const column = methodsColumnIndex(method);
  table.querySelectorAll('tbody tr[data-gender][data-age]').forEach(row => {
    row.querySelectorAll('td').forEach((cell, index) => {
      cell.classList.toggle('research-tables__cell_active', index + 2 === column);
    });
  });
}

// CDC/NHANES US adults 20+ (2021 – 2023): percentile -> cm.
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
const researchMethodEl = document.getElementById('researchMethod');


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
researchMethodEl.addEventListener('change', calculateGrowth);
heightEl.addEventListener('input', calculateGrowth);

avgMaleEl.addEventListener('input', calculateGrowth);
avgFemaleEl.addEventListener('input', calculateGrowth);

document.getElementById('calc').addEventListener('click', calculateGrowth);


function fmt(n, digits = 1) {
  const value = n.toFixed(digits);
  return currentLanguage === 'en' ? value : value.replace('.', ',');
}


function interpolate(rows, age) {
  if (age <= rows[0][0]) return rows[0][1];

  if (age > rows[rows.length - 1][0]) {
    return null;
  }

  if (age === rows[rows.length - 1][0]) {
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
  const selectedMethod = researchMethodEl.value;
  const isRange = selectedMethod === 'range';

  AHP = isRange ? null : getAHP(selectedMethod);

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


const rangeValues = isRange
  ? getAHPRange(gender, age)
  : null;

const reached = isRange
  ? (rangeValues ? (rangeValues.min + rangeValues.max) / 2 : null)
  : interpolate(AHP[gender], age);

const methodError = document.getElementById('methodError');

if (reached === null) {
  methodError.hidden = false;
  return;
}


  methodError.hidden = true;


const adultRange = isRange
  ? {
      min: height / (rangeValues.max / 100),
      max: height / (rangeValues.min / 100)
    }
  : null;

// Для существующей логики рекомендаций используем середину интервала.
const adult = isRange
  ? (adultRange.min + adultRange.max) / 2
  : height / (reached / 100);

const remainingCm = adult - height;
const remainingPct = 100 - reached;

const perc = percentile(adult, gender);

// Интервалы оставшегося роста.
const remainingRange = isRange
  ? {
      min: Math.max(0, adultRange.min - height),
      max: Math.max(0, adultRange.max - height),
      pctMin: 100 - rangeValues.max,
      pctMax: 100 - rangeValues.min
    }
  : null;



  const ordinal = value => {
    const n = Math.round(value);
    const mod100 = n % 100;
    const suffix = mod100 >= 11 && mod100 <= 13 ? 'th' : ({1:'st', 2:'nd', 3:'rd'}[n % 10] || 'th');
    return `${n}${suffix}`;
  };

  const pText = currentLanguage === 'en'
    ? (perc.bound === '<' ? '<5th' : perc.bound === '>' ? '>95th' : `≈${ordinal(perc.value)}`)
    : (perc.bound === '<' ? `<${perc.value}-го` : perc.bound === '>' ? `>${perc.value}-го` : `≈${Math.round(perc.value)}-й `);

const formatPercentile = value => currentLanguage === 'en'
  ? (value.bound === '<' ? '<5th' : value.bound === '>' ? '>95th' : `≈${ordinal(value.value)}`)
  : (value.bound === '<' ? `<${value.value}-го` : value.bound === '>' ? `>${value.value}-го` : `≈${Math.round(value.value)}-й `);

const pTextRange = isRange
  ? `${formatPercentile(percentile(adultRange.min, gender))}   –   ${formatPercentile(percentile(adultRange.max, gender))}`
  : pText;


  const genderName = t(gender === 'male' ? 'Мальчик' : 'Девочка');

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
    deficitFromAverage > 0 && deficitFromAverage < 4;

  const needsGrowthHormoneDiscussion =
    deficitFromAverage >= 4;


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

  document.getElementById('methodBadge').textContent = t(METHOD_LABELS[selectedMethod]);
  highlightResearchColumn(selectedMethod);

  document.getElementById('summary').textContent =
    `${genderName}, ${fmt(age, age % 1 ? 1 : 0)} ${t('лет')}, ${fmt(height)} ${currentLanguage === 'en' ? 'cm' : 'см'}`;

    
document.getElementById('pctReached').textContent = isRange
  ? `${fmt(rangeValues.min)} – ${fmt(rangeValues.max)}%`
  : `${fmt(reached)}%`;

document.getElementById('adultHeight').textContent = isRange
  ? `${fmt(adultRange.min)} – ${fmt(adultRange.max)} ${currentLanguage === 'en' ? 'cm' : 'см'}`
  : `${fmt(adult)} ${currentLanguage === 'en' ? 'cm' : 'см'}`;
  

  document.getElementById('rgender').textContent =
    genderName;

  document.getElementById('rAge').textContent =
    `${fmt(age, age % 1 ? 1 : 0)} ${t('лет')}`;

  document.getElementById('rHeight').textContent =
    `${fmt(height)} ${currentLanguage === 'en' ? 'cm' : 'см'}`;



document.getElementById('rReached').textContent = isRange
  ? `${fmt(rangeValues.min)} – ${fmt(rangeValues.max)}%`
  : `${fmt(reached)}%`;

document.getElementById('rRemaining').innerHTML = isRange
  ? `<strong class="prediction__highlight">${fmt(remainingRange.min)} – ${fmt(remainingRange.max)} ${currentLanguage === 'en' ? 'cm' : 'см'} / ${fmt(remainingRange.pctMin)} – ${fmt(remainingRange.pctMax)}%</strong>`
  : `<strong class="prediction__highlight">${fmt(Math.max(0, remainingCm))} ${currentLanguage === 'en' ? 'cm' : 'см'} / ${fmt(remainingPct)}%</strong>`;

document.getElementById('rAdult').innerHTML = isRange
  ? `<strong class="prediction__highlight">${fmt(adultRange.min)} – ${fmt(adultRange.max)} ${currentLanguage === 'en' ? 'cm' : 'см'}</strong>`
  : `<strong class="prediction__highlight">${fmt(adult)} ${currentLanguage === 'en' ? 'cm' : 'см'}</strong>`;



    
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

percentileMetric.textContent = isRange
  ? pTextRange
  : pText;

document.getElementById('rPercentile').innerHTML = isRange
  ? `<strong class="prediction__highlight">${pTextRange} </strong>`
  : `<strong class="prediction__highlight">${pText} </strong>`;

  
  // Блок рекомендации всегда остаётся видимым.

  growthHormoneAdvice.hidden = true;
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

  const adultsPercentileText = (heightValue, percentileValue) => {
    const low = Math.max(0, Math.min(100, percentileValue.value));
    const adultsAbove = Math.round(100 - low);
    const adultsBelow = Math.round(low);
    const percentileLabel = formatPercentile(percentileValue);
    const adults = currentLanguage === 'en' ? (gender === 'male' ? 'men' : 'women') : (gender === 'male' ? 'мужчин' : 'женщин');

    if (percentileValue.bound === '<') {
      return currentLanguage === 'en' ? `Predicted height of ${fmt(heightValue)} cm: below the 5th percentile of the reference sample.` : `Прогнозируемый рост ${fmt(heightValue)} см: ниже 5-го перцентиля используемой референсной выборки.`;
    }

    if (percentileValue.bound === '>') {
      return currentLanguage === 'en' ? `Predicted height of ${fmt(heightValue)} cm: above the 95th percentile of the reference sample.` : `Прогнозируемый рост ${fmt(heightValue)} см: выше 95-го перцентиля используемой референсной выборки.`;
    }

    return currentLanguage === 'en' ? `Predicted height of ${fmt(heightValue)} cm is at the ${percentileLabel} percentile. Approximately ${adultsAbove}% of adults ${adults} in the US or Russia are taller, and ${adultsBelow}% are shorter.` : `Прогнозируемый рост ${fmt(heightValue)} см — ${percentileLabel} перцентиль. В США или в России ~${adultsAbove}% взрослых ${adults} выше этого роста, а ~${adultsBelow}% — ниже.`;
  };

  if (isRange) {
    const minPercentile = percentile(adultRange.min, gender);
    const maxPercentile = percentile(adultRange.max, gender);

    percentileText.textContent =
  `${adultsPercentileText(adultRange.min, minPercentile)} \n\n ${adultsPercentileText(adultRange.max, maxPercentile)}`;

  
  } else if (perc.bound === '<') {
    percentileText.textContent =
      (currentLanguage === 'en' ? 'The prediction is below the 5th percentile of the reference sample.' : 'Прогноз ниже 5-го перцентиля используемой референсной выборки.');

  } else if (perc.bound === '>') {
    percentileText.textContent =
      (currentLanguage === 'en' ? 'The prediction is above the 95th percentile of the reference sample.' : 'Прогноз выше 95-го перцентиля используемой референсной выборки.');

  } else {
    const low = Math.max(0, Math.min(100, perc.value));
    const adultsAbove = Math.round(100 - low);
    const adultsBelow = Math.round(low);

    percentileText.textContent =
      currentLanguage === 'en' ? `Predicted adult height percentile: ${pText} (${fmt(adult)} cm). Approximately ${adultsAbove}% of adults ${gender === 'male' ? 'men' : 'women'} in the US or Russia are taller, and ${adultsBelow}% are shorter.` : `Перцентиль прогнозируемого взрослого роста: ${pText} (${fmt(adult)} см). В США или в России ~${adultsAbove}% взрослых ${gender === 'male' ? 'мужчин' : 'женщин'} выше этого роста, а ~${adultsBelow}% — ниже.`;
  }

  growthHormoneAdvice.hidden = false;

  growthHormoneAdvice.classList.add(
    'prediction__advice_warning',
    'prediction__comparison-result'
  );

  growthHormoneAdvice.innerHTML =
    currentLanguage === 'en' ? `Predicted adult height (${fmt(adult)} cm) is ${fmt(deficitFromAverage)} cm below the average height for ${gender === 'male' ? 'men' : 'women'} (${fmt(avg)} cm).

The website recommends:

Discussing growth hormone treatment with an endocrinologist.` : `Прогноз взрослого роста (${fmt(adult)} см) на ${fmt(deficitFromAverage)} см ниже среднего роста ${gender === 'male' ? 'мужчин' : 'женщин'} (${fmt(avg)} см).

Сайт рекомендует:

назначение Гормона Роста (у эндокринолога).`;

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
      currentLanguage === 'en' ? `Predicted adult height is ${fmt(deficitFromAverage)} cm below average (${fmt(avg)} cm), which is not critical.` : `Прогнозируемый взрослый рост на ${fmt(deficitFromAverage)} см ниже среднего (${fmt(avg)} см), что не критично.`;

    growthHormoneAdvice.hidden = true;
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
      currentLanguage === 'en' ? `Predicted adult height (${fmt(adult)} cm) is at or above average (${fmt(avg)} cm).` : `Прогнозируемый взрослый рост (${fmt(adult)} см) не ниже среднего (${fmt(avg)} см).`;

    growthHormoneAdvice.hidden = true;
    growthHormoneAdvice.textContent = '';

  }

}
renderResearchTable();
calculateGrowth();
