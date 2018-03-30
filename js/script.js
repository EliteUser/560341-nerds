/* Переключение слайдов */

var controls = document.querySelectorAll(".slider-controls button");
var slides = document.querySelectorAll(".slide-list li");
var slideButtons = document.querySelectorAll(".slide-about-btn");

var formWindow = document.querySelector(".form-window");
var formOpen = document.querySelector(".write-us-btn");
var formClose = document.querySelector(".form-close");
var popupForm = document.querySelector(".popup-form");
var popupSendBtn = document.querySelector(".popup-btn");

var map = document.querySelector("#map");

var sliderElem = document.querySelector("#slider");

var catalogList = document.querySelector(".catalog-list");

for (var i = 0; i < controls.length; i++) {
  clickControl(controls[i], slides[i]);
}

function clickControl(control, slide) {
  control.addEventListener("click", function () {
    toggleSlide(control, slide);
  });
}

function toggleSlide(control, slide) {
  for (var i = 0; i < controls.length; i++) {
    controls[i].classList.remove("checked");
    slides[i].classList.remove("show-slide");
  }

  control.classList.add("checked");
  slide.classList.add("show-slide");
}

/* Доступность слайдов по ТАВ'у*/

for (var i = 0; i < slideButtons.length; i++)(function (i) {
  slideButtons[i].addEventListener("focus", function (event) {
    toggleSlide(controls[i], slides[i]);
  });
})(i);

/* Добавление событий для всплывающих окон */

if (formOpen) {
  formOpen.addEventListener("click", function (event) {
    event.preventDefault();
    formWindow.classList.add("show");
    popupForm.elements[0].focus();
  });
}

if (formOpen) {
  formClose.addEventListener("click", function (event) {
    event.preventDefault();
    formWindow.classList.remove("show");
    formWindow.classList.remove("animate-invalid");
  });
}

/* Упрощенная валидация формы */

if (popupForm) {
  popupForm.addEventListener("submit", function (event) {
    var inputs = [popupForm.elements.name, popupForm.elements.email];

    for (var i = 0; i < inputs.length; i++) {
      if (!inputs[i].value || !inputs[i].validity.valid) {
        event.preventDefault();
        inputs[i].classList.add("input-invalid");
        formWindow.classList.remove("animate-invalid");
        formWindow.offsetWidth = formWindow.offsetWidth;
        formWindow.classList.add("animate-invalid");
      } else {
        inputs[i].classList.remove("input-invalid");
      }
    }
  });
}

/* Fallback для карты */

if (map) {
  map.onload = function () {
    map.style.zIndex = 2;
  };
}

/* СЛАЙДЕР В КАТАЛОГЕ */

if (sliderElem) {
  var dragElemLeft = document.querySelector(".drag-left");
  var dragElemRight = document.querySelector(".drag-right");
  var selectedArea = sliderElem.children[2];

  function getCoords(elem) {
    var box = elem.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset,
      right: box.right + pageXOffset
    };
  }

  dragElemRight.onmousedown = function (e) {
    var dragCoords = getCoords(dragElemRight);
    var shiftX = e.pageX - dragCoords.left;
    var sliderCoords = getCoords(sliderElem);

    document.onmousemove = function (e) {
      var newLeft = e.pageX - shiftX - sliderCoords.left;

      var dragLeftRightCoord = getCoords(dragElemLeft).right - sliderCoords.left;
      if (newLeft < dragLeftRightCoord) {
        newLeft = dragLeftRightCoord;
      }

      var rightEdge = sliderElem.offsetWidth - dragElemRight.offsetWidth / 2;
      if (newLeft > rightEdge) {
        newLeft = rightEdge;
      }

      selectedArea.style.left = dragLeftRightCoord - (dragElemLeft.offsetWidth / 2) + "px";
      selectedArea.style.width = newLeft - dragLeftRightCoord + dragElemLeft.offsetWidth + "px";

      dragElemRight.style.left = newLeft + "px";
    };

    document.onmouseup = function () {
      document.onmousemove = document.onmouseup = null;
    };

    return false;
  };

  dragElemRight.ondragstart = function () {
    return false;
  };

  //////////////////////////////////////////////////////////////////////

  dragElemLeft.onmousedown = function (e) {
    var dragCoords = getCoords(dragElemLeft);
    var shiftX = e.pageX - dragCoords.left;

    var sliderCoords = getCoords(sliderElem);

    document.onmousemove = function (e) {
      var newLeft = e.pageX - shiftX - sliderCoords.left;

      if (newLeft < -(dragElemLeft.offsetWidth / 2)) {
        newLeft = -(dragElemLeft.offsetWidth / 2);
      }

      var dragRightLeftCoord = getCoords(dragElemRight).left - sliderCoords.left - dragElemRight.offsetWidth;
      if (newLeft > dragRightLeftCoord) {
        newLeft = dragRightLeftCoord;
      }

      selectedArea.style.left = newLeft + (dragElemLeft.offsetWidth / 2) + "px";
      selectedArea.style.width = dragRightLeftCoord - newLeft + dragElemLeft.offsetWidth + "px";

      dragElemLeft.style.left = newLeft + "px";
    };

    document.onmouseup = function () {
      document.onmousemove = document.onmouseup = null;
    };

    return false;
  };

  dragElemLeft.ondragstart = function () {
    return false;
  };
}

/* Фокус на карточке товара в каталоге */

if (catalogList) {
  catalogList.addEventListener("focus", function (event) {
    var target = event.target;

    if (target.classList.contains("catalog-price-btn")) {
      target.parentNode.classList.add("hover-show");
    }
  }, true);

  catalogList.addEventListener("blur", function (event) {
    var target = event.target;

    if (target.classList.contains("catalog-price-btn")) {
      target.parentNode.classList.remove("hover-show");
    }
  }, true);
}