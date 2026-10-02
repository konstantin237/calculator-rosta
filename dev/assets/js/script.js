function calculateParents(){
    const dad=+document.getElementById('dad').value;
    const mom=+document.getElementById('mom').value;


    const avgMale=+document.getElementById('avgMale').value;
    const avgFemale=+document.getElementById('avgFemale').value;

    if(!dad||!mom)return;

    // Формула Джона Хокера.html.
    // Сын: (рост матери + рост отца) / 2 + 6,4.
    // Дочь: (рост матери + рост отца) / 2 - 6,4.
    const sonHeight=(mom+dad)/2+6.4;
    const daughterHeight=(mom+dad)/2-6.4;

    // Отдельные константы диапазона роста для мальчика и девочки.
    const SON_GROWTH_RANGE = 10;
    const DAUGHTER_GROWTH_RANGE = 10;

    const sonMinHeight = sonHeight - SON_GROWTH_RANGE;
    const sonMaxHeight = sonHeight + SON_GROWTH_RANGE;
    const daughterMinHeight = daughterHeight - DAUGHTER_GROWTH_RANGE;
    const daughterMaxHeight = daughterHeight + DAUGHTER_GROWTH_RANGE;

    document.getElementById('sonHeight').textContent=Math.round(sonHeight)+' см';
    document.getElementById('daughterHeight').textContent=Math.round(daughterHeight)+' см';

    const people=[
        ['Дочь',daughterHeight,'daughter'],
        ['Папа',dad,'dad'],
        ['Мама',mom,'mom'],
        ['Сын',sonHeight,'son']
    ];

    // Все реальные значения роста, используемые для построения ростомера.
    // Важно: этот массив должен быть создан ДО расчёта lo/hi.
    const all=[
        ...people.map(p=>p[1]),
        sonMinHeight, sonMaxHeight,
        daughterMinHeight, daughterMaxHeight
    ];

    // ================================================================
    // РОСТОМЕР: КООРДИНАТЫ ЦИФР = ОСНОВА ДЛЯ ВСЕХ ФИГУР
    // ================================================================
    const lo=Math.floor((Math.min(...all)-10)/5)*5;
    const hi=Math.ceil((Math.max(...all)+10)/5)*5;
    const H=535;

    /*
       Сначала физически создаём цифры ростомера.

       Для КАЖДОЙ цифры запоминаем:
         x  = её горизонтальная координата
         y  = НИЖНЮЮ координату цифры

       Именно эти координаты потом используются для фигур.
       Отдельной шкалы для фигур НЕТ.
    */

    const rulerCoords={};
    let ticks='';

    for(let h=lo;h<=hi;h+=5){
        const bottomY=H-(h-lo)*(H/(hi-lo));
        const topY=bottomY-14;

        // Пока только создаём цифры.
        // Реальные x/y будут считаны НИЖЕ, после вставки в DOM.
        ticks+=`<div class="tick" data-height="${h}" style="top:${topY}px">${h}</div>`;
    }

    const ruler=document.getElementById('ruler');
    ruler.innerHTML=ticks;

    /*
       Теперь цифры уже реально существуют на странице.
       Запоминаем ИХ ФАКТИЧЕСКИЕ координаты:
         x = offsetLeft
         y = offsetTop + offsetHeight = нижний край цифры

       Это именно та координата, которую потом используем
       для постановки линии роста.
    */

    ruler.querySelectorAll('.tick').forEach(el=>{
        const h=Number(el.dataset.height);

        rulerCoords[h]={
            x:el.offsetLeft,
            y:el.offsetTop+el.offsetHeight
        };
    });

    /*
       ГЛАВНАЯ ЛОГИКА.

       Если рост ровно кратен 5:
          170 -> берём НИЖНИЙ Y цифры 170.

       Если рост НЕ кратен 5:
          171, 172, 173, 174
          находятся в промежутке 170..175.

       Для ВСЕХ этих значений берём:
          (нижний Y цифры 170 + нижний Y цифры 175) / 2

       То есть они получают ОДИНАКОВУЮ горизонтальную линию,
       строго посередине между двумя ближайшими цифрами ростомера.

       Это специально НЕ является пропорциональной интерполяцией.
    */

    function growthLineY(height){
        const roundedHeight=Math.round(height);

        // Точное значение, кратное 5:
        if(roundedHeight % 5 === 0 && rulerCoords[roundedHeight]){
            return rulerCoords[roundedHeight].y;
        }

        // Нижняя и верхняя отметки, кратные 5.
        const lower=Math.floor(height/5)*5;
        const upper=lower+5;

        const lowerPoint=rulerCoords[lower];
        const upperPoint=rulerCoords[upper];

        if(lowerPoint && upperPoint){
            // СТРОГО СЕРЕДИНА между нижними Y двух цифр.
            return (lowerPoint.y + upperPoint.y) / 2;
        }

        // Запасной вариант только если значение вышло за созданный ростомер.
        return H-(height-lo)*(H/(hi-lo));
    }

    /*
       Фигура:

       ───────────────  <- горизонтальная линия роста
              ○         <- ВЕРХ круга совпадает с линией
             /|\
             / \

       Линия касается круга именно сверху.
       Тело начинается ниже головы.
    */

    // Голова должна занимать примерно 19 см по высоте.
    // Больший диаметр овала расположен вертикально.
    // Меньший диаметр = 45% от большего.

    // Высота ростомера H соответствует диапазону hi-lo сантиметров,
    // поэтому 19 см переводим в реальные пиксели этого ростомера.
    const headHeightCm=19;
    const headHeight=19*(H/(hi-lo));
    const headWidth=headHeight*0.45;
    const headBorder=3;
    const headTotal=headHeight+headBorder*2;
    const bodyGap=6;

    // В массиве people дочь находится слева, сын — справа.
    // Поэтому диапазон дочери рисуем в левой зоне,
    // а диапазон сына — в правой зоне.
    const rangeMarkers = [
        ['Минимум', daughterMinHeight, 'daughterMin', 'daughter'],
        ['Максимум', daughterMaxHeight, 'daughterMax', 'daughter'],
        ['Минимум', sonMinHeight, 'sonMin', 'son'],
        ['Максимум', sonMaxHeight, 'sonMax', 'son']
    ];

    const rangeMarkerHtml = rangeMarkers.map(([label, height, type, side]) => {
        const y = growthLineY(height);
        const sideStyle = side === 'daughter'
            ? 'left:0;width:37.5%;'
            : 'left:67%;width:33%;';

        return `<div class="rangeMarker ${type}" style="top:${y}px;${sideStyle}"><span>${label}</span><b>${Math.round(height)} см</b></div>`;
    }).join('');

    document.getElementById('people').innerHTML=rangeMarkerHtml + people.map(p=>{
        const growthY=growthLineY(p[1]);

        // ВЕРХ головы = линия роста.
        const headTop=growthY;

        // Тело начинается под кругом.
        const bodyTop=headTop+headTotal+bodyGap;
        const bodyHeight=Math.max(20,H-bodyTop);

        // Горизонтальная линия роста для каждой фигуры.
        const guide=
            `<div class="personGuide"
                  style="top:${growthY}px;
                         left:calc(50% - 32px);
                         width:64px"></div>`;

        return `<div class="person ${p[2]}">
            ${guide}
            <div class="personHead" style="top:${headTop}px;width:${headWidth}px;height:${headHeight}px"></div>
            <div class="personBody" style="top:${bodyTop}px;height:${bodyHeight}px"></div>
            <b style="top:${headTop-8}px">${p[0]}<span class="heightValue">${Math.round(p[1])} см</span></b>
        </div>`;
    }).join('');

    document.getElementById('advice').innerHTML=
        `<h3>Что показывает этот расчёт</h3><div class="comparison"><div class="comparisonRow"><div class="comparisonCell"><div class="comparisonLabel">Предполагаемый рост сына</div><div class="comparisonValue">${Math.round(sonHeight)} см</div></div><div class="comparisonCell"><div class="comparisonLabel">Предполагаемый рост дочери</div><div class="comparisonValue">${Math.round(daughterHeight)} см</div></div><div class="comparisonResult">Значения рассчитаны по формуле Джона Хокера.</div></div></div>`;


        const parentAdvice = document.getElementById('advice');

let adviceText = `
    <h3>Что показывает этот расчёт</h3>
    <div class="comparison">
        <div class="comparisonRow">
            <div class="comparisonCell">
                <div class="comparisonLabel">Предполагаемый рост сына</div>
                <div class="comparisonValue">${Math.round(sonHeight)} см</div>
            </div>

            <div class="comparisonCell">
                <div class="comparisonLabel">Предполагаемый рост дочери</div>
                <div class="comparisonValue">${Math.round(daughterHeight)} см</div>
            </div>

            <div class="comparisonResult">
                Значения рассчитаны по формуле Джона Хокера.
            </div>
        </div>
    </div>
`;


// СЫН
if (sonMaxHeight < avgMale - 2) {
    const deficit = avgMale - sonMaxHeight;

    adviceText += `
        <div class="comparisonResult advice percentileWarning">
            Прогнозируемый максимальный рост сына (${Math.round(sonMaxHeight)} см)
            на ${Math.round(deficit * 10) / 10} см ниже среднего роста мужчин
            (${Math.round(avgMale * 10) / 10} см).
            Сайт рекомендует посетить детского эндокринолога и обсудить,
            есть ли медицинские показания к лечению, в том числе гормоном роста.
        </div>
    `;
} else if (sonMaxHeight < avgMale) {
    const deficit = avgMale - sonMaxHeight;

    adviceText += `
        <div class="comparisonResult advice ">
            Прогнозируемый максимальный рост сына (${Math.round(sonMaxHeight)} см)
            на ${Math.round(deficit * 10) / 10} см ниже среднего роста мужчин
            (${Math.round(avgMale * 10) / 10} см), что не критично.
        </div>
    `;
}


// ДОЧЬ
if (daughterMaxHeight < avgFemale - 2) {
    const deficit = avgFemale - daughterMaxHeight;

    adviceText += `
        <div class="comparisonResult advice percentileWarning">
            Прогнозируемый максимальный рост дочери (${Math.round(daughterMaxHeight)} см)
            на ${Math.round(deficit * 10) / 10} см ниже среднего роста женщин
            (${Math.round(avgFemale * 10) / 10} см).
            Сайт рекомендует посетить детского эндокринолога и обсудить,
            есть ли медицинские показания к лечению, в том числе гормоном роста.
        </div>
    `;
} else if (daughterMaxHeight < avgFemale) {
    const deficit = avgFemale - daughterMaxHeight;

    adviceText += `
        <div class="comparisonResult advice">
            Прогнозируемый максимальный рост дочери (${Math.round(daughterMaxHeight)} см)
            на ${Math.round(deficit * 10) / 10} см ниже среднего роста женщин
            (${Math.round(avgFemale * 10) / 10} см), что не критично.
        </div>
    `;
}

parentAdvice.innerHTML = adviceText;
}

calculateParents();


const AHP = {
  male: [
    [7,69.4],[8,72.6],[9,75.6],[10,78.4],[11,80.8],[12,84.5],[13,88.2],[14,93.1],[15,96.5],[16,98.1]
  ],
  female: [
    [7,74.2],[8,77.9],[9,81.2],[10,85.4],[11,88.8],[12,92.0],[13,96.2],[14,98.0],[15,99.0],[16,99.2]
  ]
};


// CDC/NHANES US adults 20+ (2021–2023): percentile -> cm.
const ADULT_REF = {
  male: [[5,162.2],[10,165.2],[15,167.5],[25,170.0],[50,175.2],[75,180.1],[85,183.0],[90,184.8],[95,187.2]],
  female: [[5,149.6],[10,152.0],[15,153.9],[25,156.4],[50,161.2],[75,166.1],[85,168.6],[90,170.4],[95,172.5]]
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


function fmt(n, digits=1) {
  return n.toFixed(digits).replace('.', ',');
}


function interpolate(rows, age) {
  if (age <= rows[0][0]) return rows[0][1];
  if (age >= rows[rows.length-1][0]) return rows[rows.length-1][1];

  for (let i=0;i<rows.length-1;i++) {
    const [x1,y1] = rows[i], [x2,y2] = rows[i+1];

    if (age >= x1 && age <= x2) {
      return y1 + (age-x1)*(y2-y1)/(x2-x1);
    }
  }
}


function percentile(height, gender) {
  const rows = ADULT_REF[gender];

  if (height < rows[0][1]) return { value: 5, bound: '<' };
  if (height > rows[rows.length-1][1]) return { value: 95, bound: '>' };

  for (let i=0;i<rows.length-1;i++) {
    const [p1,h1] = rows[i], [p2,h2] = rows[i+1];

    if (height >= h1 && height <= h2) {
      const p = p1 + (height-h1)*(p2-p1)/(h2-h1);
      return { value:p, bound:'' };
    }
  }

  return { value:50, bound:'' };
}


function calculateGrowth() {
  const gender = genderEl.value;
  let age = Number(ageEl.value);
  const height = Number(heightEl.value);

  // Значения, которые пользователь ввёл в поля:
  const avgMale = Number(avgMaleEl.value);
  const avgFemale = Number(avgFemaleEl.value);

  const err = document.getElementById('heightError');

  if (!Number.isFinite(age)) age = 15;

  age = Math.max(7, Math.min(16, age));
  rangeEl.value = age;

  if (!Number.isFinite(height) || height < 80 || height > 230) {
    err.hidden=false;
    return;
  }

  err.hidden=true;

  if (!Number.isFinite(avgMale) || avgMale < 100 || avgMale > 230 ||
      !Number.isFinite(avgFemale) || avgFemale < 100 || avgFemale > 230) {
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
  const adult = height / (reached/100);
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
    `${genderName}, ${fmt(age, age % 1 ? 1 : 0)} лет, ${fmt(height)} см`;

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
    `<strong class="highlight">${fmt(Math.max(0,remainingCm))} см / ${fmt(remainingPct)}%</strong>`;

  document.getElementById('rAdult').innerHTML =
    `<strong class="highlight">${fmt(adult)} см</strong>`;


  // Элементы блока перцентиля и рекомендации.
  const percentileMetric =
    document.getElementById('percentile');

  const percentileCell =
    document.getElementById('rPercentile').closest('td');

  const percentileHeader =
    document.querySelector('table thead th:last-child');

  const percentileSection =
    document.getElementById('percentileText').closest('.section');

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
    `<strong class="highlight">${pText} перцентиль</strong>`;


  // Блок рекомендации всегда остаётся видимым.
  growthHormoneAdvice.hidden = false;
  growthHormoneAdvice.textContent = '';
  growthHormoneAdvice.classList.remove('percentileWarning');


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

    growthHormoneAdvice.classList.add('percentileWarning');

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