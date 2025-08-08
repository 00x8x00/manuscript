particlesJS("particles-js", {
  particles: {
    number: {
      value: 100,           // Кол-во частиц, доступно: любое число
      density: {
        enable: true,       // Вкл. плотность (true/false)
        value_area: 800     // Площадь распределения, число (чем больше — тем реже)
      }
    },
    color: {
      value: ["#FF6F61", "#6B5B93", "#88B04B", "#F7CAC9", "#92A8D1"] // Цвета, строка или массив цветов
    },
    shape: {
      type: "circle",       // Форма: "circle", "edge", "triangle", "polygon", "star", "image"
      stroke: {
        width: 0,           // Толщина обводки, число
        color: "#000000"    // Цвет обводки, строка
      },
      polygon: {
        nb_sides: 5         // Кол-во сторон многоугольника, число
      },
      image: {
        src: "img/github.svg", // Путь к изображению, строка
        width: 100,            // Ширина изображения, число
        height: 100            // Высота изображения, число
      }
    },
    opacity: {
      value: 0.5,           // Прозрачность, 0..1
      random: false,        // Случайная прозрачность (true/false)
      anim: {
        enable: false,      // Анимация прозрачности (true/false)
        speed: 1,           // Скорость анимации, число
        opacity_min: 0.1,   // Мин. прозрачность, 0..1
        sync: false         // Синхронизация анимации (true/false)
      }
    },
    size: {
      value: 4,             // Размер частиц, число
      random: true,         // Случайный размер (true/false)
      anim: {
        enable: false,      // Анимация размера (true/false)
        speed: 40,          // Скорость анимации, число
        size_min: 0.1,      // Мин. размер, число
        sync: false         // Синхронизация анимации (true/false)
      }
    },
    line_linked: {
      enable: true,         // Линии между частицами (true/false)
      distance: 150,        // Макс. расстояние для линии, число
      color: "#FF8C00",     // Цвет линий, строка
      opacity: 1,           // Прозрачность линий, 0..1
      width: 0.1            // Толщина линий, число
    },
    move: {
      enable: true,         // Движение частиц (true/false)
      speed: 1,             // Скорость движения, число
      direction: "top",     // Направление: "none", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left"
      random: false,        // Случайное направление (true/false)
      straight: false,      // Прямое движение (true/false)
      out_mode: "bounce",   // Поведение на границах: "out", "bounce"
      bounce: false,        // Отскок от границ (true/false)
      attract: {
        enable: false,      // Притяжение (true/false)
        rotateX: 600,       // Вращение по X, число
        rotateY: 1200       // Вращение по Y, число
      }
    }
  },
  interactivity: {
    detect_on: "canvas",    // Область событий: "canvas" или "window"
    events: {
      onhover: {
        enable: false,      // Взаимодействие при наведении (true/false)
        mode: "grab"        // Режим: "grab", "bubble", "repulse", "push", "remove"
      },
      onclick: {
        enable: false,      // Взаимодействие при клике (true/false)
        mode: "push"        // Режим: "push", "remove"
      },
      resize: true          // Адаптация к размеру окна (true/false)
    },
    modes: {
      grab: {
        distance: 200,      // Дальность захвата, число
        line_linked: {
          opacity: 1        // Прозрачность линий при захвате, 0..1
        }
      },
      bubble: {
        distance: 400,      // Дальность пузырька, число
        size: 40,           // Размер пузырька, число
        duration: 2,        // Длительность анимации, число
        opacity: 8,         // Прозрачность пузырька, 0..1+
        speed: 3            // Скорость анимации, число
      },
      repulse: {
        distance: 200,      // Дальность отталкивания, число
        duration: 1         // Время действия, число
      },
      push: {
        particles_nb: 4     // Кол-во частиц при добавлении, число
      },
      remove: {
        particles_nb: 4     // Кол-во частиц при удалении, число
      }
    }
  },
  retina_detect: true        // Поддержка Retina (true/false)
});
