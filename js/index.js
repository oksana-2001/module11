// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета// поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления
const minWeightInput = document.getElementById('min-weight-input');
const maxWeightInput = document.getElementById('max-weight-input');

const minWeightFilterValue = parseInt(minWeightInput.value);
const maxWeightFilterValue = parseInt(maxWeightInput.value);

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  // TODO: очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из fruits
  fruitsList.innerHTML = '';
  for (let i = 0; i < fruits.length; i++) {
    // TODO: формируем новый элемент <li> при помощи document.createElement,
    // и добавляем в конец списка fruitsList при помощи document.appendChild
    const newListItem = document.createElement('li');
    newListItem.innerHTML = `
      <div class="fruit__item">
        <h2>${fruits[i].kind}</h2>
        <p>Цвет: ${fruits[i].color}</p>
        <p>Вес: ${fruits[i].weight} г</p>
      </div>
    `;
    fruitsList.appendChild(newListItem);
  }
};

// первая отрисовка карточек
display(fruits);

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];

  // ATTENTION: сейчас при клике вы запустите бесконечный цикл и браузер зависнет
  while (fruits.length > 0) {
    // TODO: допишите функцию перемешивания массива
    //
    // Подсказка: находим случайный элемент из fruits, используя getRandomInt
    // вырезаем его из fruits и вставляем в result.
    // ex.: [1, 2, 3], [] => [1, 3], [2] => [3], [2, 1] => [], [2, 1, 3]
    // (массив fruits будет уменьшатся, а result заполняться)
    const randomIndex = getRandomInt(0, fruits.length - 1);
    const randomFruit = fruits.splice(randomIndex, 1)[0];
    
    result.push(randomFruit);
  }

  fruits = result;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  const minWeightValue = parseInt(minWeightInput.value);
  const maxWeightValue = parseInt(maxWeightInput.value);

  if (isNaN(minWeightValue) || isNaN(maxWeightValue)) {
    alert('Некорректное значение веса');
    return;
  }

  const filteredFruits = [...fruits].filter((item) => {
    return item.weight >= minWeightValue && item.weight <= maxWeightValue;
  });

  fruits = filteredFruits;

  display();
};


filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  // TODO: допишите функцию сравнения двух элементов по цвету
  if (a.color === b.color) {
    return a.name.localeCompare(b.name); // сортировка по алфавиту
  } else {
    return a.color.localeCompare(b.color); // сортировка по цвету
  }
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    // TODO: допишите функцию сортировки пузырьком
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - 1 - i; j++) {
        if (comparation(arr[j], arr[j + 1]) > 0) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
  },

  quickSort(arr, comparation) {
    // TODO: допишите функцию быстрой сортировки
    if (arr.length <= 1) return arr;

    const pivotIndex = Math.floor(Math.random() * arr.length);
    const pivot = arr[pivotIndex];
    const less = [];
    const greater = [];

    for (let i = 0; i < arr.length; i++) {
      if (i === pivotIndex) continue;

      const element = arr[i];
      if (comparation(element, pivot) <= 0) {
        less.push(element);
      } else {
        greater.push(element);
      }
    }

    return [
      ...sortAPI.quickSort(less, comparation),
      pivot,
      ...sortAPI.quickSort(greater, comparation),
    ];
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    sortTime = 'sorting...';
    sortKindLabel.textContent = sortKind;
    const start = performance.now();
    sort(arr, comparation);
    const end = performance.now();
    const durationInMs = end - start;
    sortTime = durationInMs < 1 ? `${(durationInMs * 1000).toFixed(2)} µs` : `${durationInMs.toFixed(2)} ms`;
    sortTimeLabel.textContent = sortTime;
  }
};
// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  // TODO: переключать значение sortKind между 'bubbleSort' / 'quickSort'
  if (sortKind === 'bubbleSort') {
    sortKind = 'quickSort';
  } else {
    sortKind = 'bubbleSort';
  }
  sortKindLabel.textContent = sortKind; // обновляем текстовое содержимое элемента sortKindLabel
});

sortActionButton.addEventListener('click', () => {
  // TODO: вывести в sortTimeLabel значение 'sorting...'
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  // TODO: вывести в sortTimeLabel значение sortTime
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  // TODO: создание и добавление нового фрукта в массив fruits
  // необходимые значения берем из kindInput, colorInput, weightInput
  display();
});

