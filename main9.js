/*
  Создайте скрипт приложения-секундомера.
  
  Изначально в HTML есть разметка:
  
  <div class="stopwatch">
    <p class="time js-time">00:00.0</p>
    <button class="btn js-start">Start</button>
    <button class="btn js-take-lap">Lap</button>
    <button class="btn js-reset">Reset</button>
  </div>
  <ul class="laps js-laps"></ul>
  
  Добавьте следующий функционал:
  
  - При нажатии на кнопку button.js-start, запускается таймер, который считает время 
    со старта и до текущего момента времени, обновляя содержимое элемента p.js-time 
    новым значение времени в формате xx:xx.x (минуты:секунды.сотни_миллисекунд).
    
    🔔 Подсказка: так как необходимо отображать только сотни миллисекунд, интервал
                  достаточно повторять не чаще чем 1 раз в 100 мс.
    
  - Когда секундомер запущен, текст кнопки button.js-start меняется на 'Pause', 
    а функционал при клике превращается в оставновку секундомера без сброса 
    значений времени.
    
    🔔 Подсказка: вам понадобится буль который описывает состояние таймера активен/неактивен.
  
  - Если секундомер находится в состоянии паузы, текст на кнопке button.js-start
    меняется на 'Continue'. При следующем клике в нее, таймер продолжает отсчет времени, 
    как будто паузы небыло, а текст меняется на 'Pause'. То есть если во время нажатия 
    'Pause' прошло 6 секунд со старта, при нажатии 'Continue' 10 секунд спустя, секундомер 
    продолжит отсчет времени с 6 секунд и дальше, а не с 16. 
    
    🔔 Подсказка: сохраните время секундомера на момент паузы и используйте его 
                  при рассчете текущего времени после возобновления таймера отнимая
                  это значение от времени запуска таймера.
    
  - Если секундомер находится в активном состоянии или в состоянии паузы, кнопка 
    button.js-reset должна быть активна (на нее можно кликнуть), в противном случае
    disabled. Функционал при клике - остановка таймера и сброс всех полей в исходное состояние.
    
  - Функционал кнопки button.js-take-lap при клике - сохранение текущего времени секундомера 
    в массив и добавление в ul.js-laps нового li с сохраненным временем в формате xx:xx.x
*/

/*
  ⚠️ ЗАДАНИЕ ПОВЫШЕННОЙ СЛОЖНОСТИ - ВЫПОЛНЯТЬ ПО ЖЕЛАНИЮ
  
  Выполните домашнее задание используя класс с полями и методами.
  
  На вход класс Stopwatch принимает только ссылку на DOM-узел в котором будет 
  динамически создана вся разметка для секундомера.
  
  Должна быть возможность создать сколько угодно экземпляров секундоментов 
  на странице и все они будут работать независимо.
  
  К примеру:
  
  new Stopwatch(parentA);
  new Stopwatch(parentB);
  new Stopwatch(parentC);
  
  Где parent* это существующий DOM-узел. 
*/

const startButton = document.querySelector('.js-start');
const lapButton = document.querySelector('.js-take-lap');
const resetButton = document.querySelector('.js-reset');
const timeOutput = document.querySelector('.js-time');
const laps_array = document.querySelector('.js-laps');
let li_array;
const timer = {
    startTime: null,
    deltaTime: null,
    pauseTime: 0,
    stopTime: 0,
    id: null,
    activity: false
  };
let laps = [];

function startTimer(){
    if(!timer.activity){
    resetButton.removeAttribute('disabled');
    timer.activity=!timer.activity;
    startButton.textContent='Pause'; 
    
    timer.startTime = new Date().getTime();
    timer.id = setInterval(()=>{
        timer.deltaTime=new Date().getTime();
        updateClockface(timeOutput, (timer.pauseTime+timer.deltaTime-timer.startTime))
    },100);
    } else{
        timer.activity=!timer.activity;
        startButton.textContent='Continue';
        timer.stopTime=timer.deltaTime;
        clearInterval(timer.id);
        updateClockface(timeOutput, (timer.pauseTime+timer.stopTime-timer.startTime))
        timer.pauseTime=timer.pauseTime+timer.stopTime-timer.startTime
    }
}
function resetTimer(){
  startButton.textContent='Start';
  resetButton.setAttribute('disabled', true)
  clearInterval(timer.id);
  timer.pauseTime = 0;
  timer.startTime = 0;
  timer.deltaTime = 0;
  updateClockface(timeOutput, (timer.pauseTime-timer.startTime))
  li_array=document.querySelectorAll('li');
  li_array.forEach(li=>li.remove());
  timer.activity=false;
  laps=[];
}

function lapTimer(){
  const lap = document.createElement('li');
  lap.textContent=timeOutput.textContent;
  laps_array.appendChild(lap);
  laps.push(timeOutput.textContent);
}
function getFormattedTime(time) {
    let date = new Date();
    date.setTime(time);
    let min = +date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
    let sec = +date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
    let ms = (date.getMilliseconds()+'')[0];
    return `${min}:${sec}.${ms}`;
  }

  function updateClockface(elem, time) {
    elem.textContent = getFormattedTime(time);
  }
  startButton.addEventListener('click', startTimer);
  resetButton.addEventListener('click', resetTimer);
  lapButton.addEventListener('click', lapTimer);