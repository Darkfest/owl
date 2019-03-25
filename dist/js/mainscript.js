"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function gimme(selector, all) {
  if (all === "all") return Array.prototype.slice.call(document.querySelectorAll(selector));
  return document.querySelector(selector);
}
/*# ========================================== Options ==========================================
### 1) shuffle(arr)
### 2) randNum(min, max, notThese)
### 3) persFromNum(pers, num)
### 4) saveGame(name, saveObj, days)
### 5) getSave(name)
### 6) Prompt(message, handler)
### 7) Alert(message)
#*/


var options = {
  shuffle: function shuffle(arr) {
    var randIndex,
        tempSlot,
        length = arr.length;

    for (var i = length - 1; i > 0; i--) {
      randIndex = this.randNum(i);
      tempSlot = arr[randIndex];
      arr[randIndex] = arr[i];
      arr[i] = tempSlot;
    }

    return arr;
  },
  randNum: function randNum(min, max, notThese) {
    if (arguments.length === 0) throw new Error("The random function expects one argument at least.");
    if (isNaN(Number(min)) || typeof min === "boolean" || _typeof(min) === "object") throw new Error("Unexpected type of first argument: \"".concat(_typeof(min), "\"."));

    if (arguments.length === 1) {
      if (min >= 0) {
        return Math.floor(Math.random() * ++min);
      } else {
        return Math.ceil(Math.random() * --min);
      }
    }

    if (isNaN(Number(max)) || typeof max === "boolean" || _typeof(max) === "object") throw new Error("Unexpected type of second argument: \"".concat(_typeof(max), "\"."));
    var result;
    max++;

    if (notThese == undefined) {
      result = Math.floor(Math.random() * (max - min)) + min;
    } else {
      if (typeof notThese === "number") {
        do {
          result = Math.floor(Math.random() * (max - min) + min);
        } while (notThese == result);
      } else if (Object.prototype.toString.call(notThese) === "[object Array]") {
        // Create Error: unique's error, more exceptions than possible results ?
        // notThese elems' types ?
        do {
          result = Math.floor(Math.random() * (max - min) + min);
        } while (notThese.indexOf(result) >= 0);
      } else {
        throw new Error("Unexpected type of third argument: \"".concat(Object.prototype.toString.call(notThese).slice(8, -1), "\"."));
      }
    }

    return result;
  },
  persFromNum: function persFromNum(pers, num) {
    return Math.round(num * pers / 100);
  },
  saveGame: function saveGame(name, saveObj, days) {
    var saveStr = JSON.stringify(saveObj),
        saveEncStr = encodeURIComponent(saveStr),
        cookieAge = 60 * 60 * 24 * days;
    document.cookie = "".concat(name, "=").concat(saveEncStr, "; max-age=").concat(cookieAge);
  },
  getSave: function getSave(name) {
    if (document.cookie == "") return null;
    var cookies = document.cookie.split("; ");
    var index;

    for (var i = 0; i < cookies.length; i++) {
      if (cookies[i].indexOf(name) >= 0) {
        index = i;
        break;
      }
    }

    if (index == null) {
      return null;
    } else {
      return JSON.parse(decodeURIComponent(cookies[index]).split("=")[1]);
    }
  },
  Prompt: function Prompt(message, handler) {
    var _this = this;

    var wrapperStyle = ["z-index: 999", "position: fixed", "overflow: hidden", "top: 0", "height: 100vh", "width: 100%", "background-color: rgba(0, 0, 0, 0.5)", "visibility: hidden", "opacity: 0", "transition: visibility .8s, opacity .8s", "perspective: 500px"].join("; ");
    var promptStyle = ["position: fixed", "height: 12rem", "width: 20rem", "background-color: #fff", "top: 50%", "left: 50%", "transform: translate(-50%, 80%) scale(0.7) rotateX(-30deg)", "visibility: hidden", "opacity: 0", "transition: visibility .8s ease, opacity .8s ease, transform .8s ease", "text-align: center", "font: 1.5rem Exo_2, calibri", "border-radius: 0.625rem", "color: black"].join("; ");
    var messageStyle = ["width: 100%", "position: absolute", "padding: 0.5rem", "top: 50%", "transform: translateY(calc(-50% - 2.5rem))"].join("; ");
    var buttonStyle = ["height: 4rem", "width: 8rem", "line-height: 4rem", "border-radius: 0.625rem", "cursor: pointer", "position: absolute", "bottom: 0.5rem", "box-shadow: 0 0 0.3rem #8e8e8e", "transition: background-color .5s"].join("; ");
    var acceptStyle = ["left: 0.5rem"].join("; ");
    var cancelStyle = ["right: 0.5rem"].join("; ");
    var wrapper = document.createElement("div");
    wrapper.setAttribute("style", wrapperStyle);
    var prompt = document.createElement("div");
    prompt.setAttribute("style", promptStyle);
    var msg = document.createElement("div");
    msg.innerHTML = message;
    msg.setAttribute("style", messageStyle);
    var accept = document.createElement("div");
    accept.innerHTML = "Yes";
    accept.setAttribute("style", buttonStyle + "; " + acceptStyle);

    accept.onclick = function () {
      _this.remove(true);

      accept.onclick = null;
      cancel.onclick = null;
    };

    var cancel = document.createElement("div");
    cancel.innerHTML = "No";
    cancel.setAttribute("style", buttonStyle + "; " + cancelStyle);

    cancel.onclick = function () {
      _this.remove(false);

      accept.onclick = null;
      cancel.onclick = null;
    };

    accept.onmouseover = cancel.onmouseover = function () {
      this.style.backgroundColor = "#90dff1";
    };

    accept.onmouseout = cancel.onmouseout = function () {
      this.style.backgroundColor = "";
    };

    prompt.appendChild(msg);
    prompt.appendChild(accept);
    prompt.appendChild(cancel);
    wrapper.appendChild(prompt);
    document.body.appendChild(wrapper);
    this.element = prompt;
    this.message = message;

    this.remove = function (accepted) {
      prompt.style.visibility = "hidden";
      prompt.style.opacity = "0";
      prompt.style.transform = "translate(-50%, -200%) scale(0.6) rotateX(30deg)";
      wrapper.style.visibility = "hidden";
      wrapper.style.opacity = "0";
      wrapper.style.pointerEvents = "none";
      if (accepted) handler();
      setTimeout(function () {
        document.body.removeChild(wrapper);
      }, 800);
    };

    this.show = function () {
      setTimeout(function () {
        prompt.style.visibility = "visible";
        prompt.style.opacity = "1";
        prompt.style.transform = "translate(-50%, -70%) scale(1) rotateX(0)";
        wrapper.style.visibility = "visible";
        wrapper.style.opacity = "1";
      }, 50);
    };
  },
  Alert: function Alert(message) {
    var _this2 = this;

    var wrapperStyle = ["z-index: 999", "position: fixed", "overflow: hidden", "top: 0", "height: 100vh", "width: 100%", "background-color: rgba(0, 0, 0, 0.5)", "visibility: hidden", "opacity: 0", "transition: visibility .8s, opacity .8s", "perspective: 500px"].join("; ");
    var alertStyle = ["position: fixed", "height: 12rem", "width: 20rem", "background-color: #fff", "top: 50%", "left: 50%", "transform: translate(-50%, 80%) scale(0.7) rotateX(-30deg)", "visibility: hidden", "opacity: 0", "transition: visibility .8s ease, opacity .8s ease, transform .8s ease", "text-align: center", "font: 1.5rem Exo_2, calibri", "border-radius: 0.625rem", "color: black"].join("; ");
    var messageStyle = ["width: 100%", "position: absolute", "padding: 0.5rem", "top: 50%", "transform: translateY(calc(-50% - 2.5rem))"].join("; ");
    var buttonStyle = ["height: 4rem", "width: 8rem", "line-height: 4rem", "border-radius: 0.625rem", "cursor: pointer", "position: absolute", "bottom: 0.5rem", "box-shadow: 0 0 0.3rem #8e8e8e", "transition: background-color .5s", "left: calc(50% - 4rem)"].join("; ");
    var wrapper = document.createElement("div");
    wrapper.setAttribute("style", wrapperStyle);
    var alert = document.createElement("div");
    alert.setAttribute("style", alertStyle);
    var msg = document.createElement("div");
    msg.innerHTML = message;
    msg.setAttribute("style", messageStyle);
    var accept = document.createElement("div");
    accept.innerHTML = "Okey";
    accept.setAttribute("style", buttonStyle);

    accept.onclick = function () {
      _this2.remove();

      accept.onclick = null;
    };

    accept.onmouseover = function () {
      this.style.backgroundColor = "#90dff1";
    };

    accept.onmouseout = function () {
      this.style.backgroundColor = "";
    };

    alert.appendChild(msg);
    alert.appendChild(accept);
    wrapper.appendChild(alert);
    document.body.appendChild(wrapper);
    this.element = alert;
    this.message = message;

    this.remove = function (accepted) {
      alert.style.visibility = "hidden";
      alert.style.opacity = "0";
      alert.style.transform = "translate(-50%, -200%) scale(0.6) rotateX(30deg)";
      wrapper.style.visibility = "hidden";
      wrapper.style.opacity = "0";
      wrapper.style.pointerEvents = "none";
      setTimeout(function () {
        document.body.removeChild(wrapper);
      }, 800);
    };

    this.show = function () {
      setTimeout(function () {
        alert.style.visibility = "visible";
        alert.style.opacity = "1";
        alert.style.transform = "translate(-50%, -70%) scale(1) rotateX(0)";
        wrapper.style.visibility = "visible";
        wrapper.style.opacity = "1";
      }, 50);
    };
  }
};
/* ========================================== Saves segment ==========================================*/

var saves = {
  hero: options.getSave("savedHero"),
  bestRun: options.getSave("bestRun")
  /* ========================================== Preloader segment ==========================================*/

};
var preloader = {
  container: gimme(".preloader"),
  imagesToLoad: ["main_menu_bg.png", "bg.png", "outro_bg.jpg", "artefact_damage.png", "artefact_health.png", "artefact_timer.png", "artefact_health_damage.png", "blood_1.png", "coins.png", "take_damage.png", "cobra.png", "scorpion.png", "werewolf.png", "cerberus.png", "phenix.png", "dragon.png", "gryphon.png", "manticore.png", "owl_outro.png", "cobra_outro.png", "scorpion_outro.png", "werewolf_outro.png", "cerberus_outro.png", "phenix_outro.png", "dragon_outro.png", "gryphon_outro.png", "manticore_outro.png"],
  loadResources: function loadResources() {
    var _this3 = this;

    var imageAmount = this.imagesToLoad.length;
    var imagesLoaded = 0;

    var handler = function handler() {
      imagesLoaded++;

      if (imagesLoaded >= imageAmount) {
        setTimeout(function () {
          if (!_this3.container.classList.contains("preloader_hidden")) _this3.container.classList.add("preloader_hidden");
        }, 500);
      }
    };

    this.imagesToLoad.forEach(function (item) {
      var image = new Image();
      image.src = "img/".concat(item);
      image.addEventListener("load", handler);
      image.addEventListener("error", handler);
    });
  }
};
/* ========================================== Control panel segment ==========================================*/

var controlPanel = {
  container: gimme(".control-panel"),
  backButton: gimme(".control-panel__back-button"),
  data: gimme(".control-panel__data"),
  listenToEvents: function listenToEvents() {
    this.backButton.addEventListener("click", function () {
      animations.toMainMenu();
    });
  }
  /* ========================================== Main menu segment ==========================================*/

};
var mainMenu = {
  location: "tutorial",
  container: gimme(".main-menu"),
  overlay: gimme(".main-menu__overlay"),
  links: {
    clickable: true,
    container: gimme(".main-menu__links"),
    startGame: gimme(".main-menu__start-game"),
    inventory: gimme(".main-menu__artefacts"),
    settings: gimme(".main-menu__settings")
  },
  listenToEvents: function listenToEvents() {
    var _this4 = this;

    this.links.container.addEventListener("click", function (e) {
      if (!_this4.links.clickable) return;

      if (e.target.classList.contains("main-menu__start-game")) {
        animations.toGameLevels();
      } else if (e.target.classList.contains("main-menu__artefacts")) {
        animations.toArtefacts();
      } else if (e.target.classList.contains("main-menu__statistic")) {
        animations.toStatistic();
      } else if (e.target.classList.contains("main-menu__tutorial")) {
        animations.toTutorial();
      }
    });
  }
};
/* ========================================== Artefacts segment ==========================================*/

var artefacts = {
  container: gimme(".artefacts"),

  /*purchases: gimme(".artefacts__purchase-wrapper"),*/
  items: [{
    sold: false,
    damage: 5,
    cost: 20,
    icon: "artefact_damage.png"
  }, {
    sold: false,
    health: 10,
    cost: 30,
    icon: "artefact_health.png"
  }, {
    sold: false,
    timer: 1,
    cost: 60,
    icon: "artefact_timer.png"
  }, {
    sold: false,
    damage: 10,
    cost: 70,
    icon: "artefact_damage.png"
  }, {
    sold: false,
    health: 15,
    cost: 80,
    icon: "artefact_health.png"
  }, {
    sold: false,
    timer: 2,
    cost: 200,
    icon: "artefact_timer.png"
  }, {
    sold: false,
    health: 15,
    damage: 10,
    cost: 150,
    icon: "artefact_health_damage.png"
  }, {
    sold: false,
    health: 10,
    damage: 5,
    cost: 120,
    icon: "artefact_health_damage.png"
  }],
  createItems: function createItems() {
    var _this5 = this;

    this.items.forEach(function (item, index, arr) {
      if (hero.boughtItems[index] === true) {
        item.sold = true;
      }
    });
    this.items.sort(function (a, b) {
      return a.cost - b.cost;
    }).forEach(function (item, index) {
      var artefact = document.createElement("div");
      artefact.classList.add("artefact");
      var artefactDescription = document.createElement("div");
      artefactDescription.classList.add("artefact__description");
      artefact.appendChild(artefactDescription);
      var artefactBonus = document.createElement("div");
      artefactBonus.classList.add("artefact__bonus");
      var bonuses;

      if (item.health && item.damage) {
        bonuses = "+".concat(item.health, " health<br>+").concat(item.damage, " damage");
      } else if (item.health) {
        bonuses = "+".concat(item.health, " health");
      } else if (item.damage) {
        bonuses = "+".concat(item.damage, " damage");
      } else if (item.timer) {
        bonuses = "+".concat(item.timer, "s timer");
      }

      artefactBonus.innerHTML = bonuses;
      artefactDescription.appendChild(artefactBonus);
      var artefactCost = document.createElement("div");
      artefactCost.classList.add("artefact__cost");
      artefactCost.innerHTML = "".concat(item.cost, " coins");
      artefactDescription.appendChild(artefactCost);
      var artefactImage = document.createElement("div");
      artefactImage.classList.add("artefact__image");
      artefactImage.style.backgroundImage = "url(img/".concat(item.icon, ")");
      artefact.appendChild(artefactImage);
      var artefactBuy = document.createElement("div");
      artefactBuy.classList.add("artefact__buy");

      if (!item.sold) {
        artefactBuy.classList.add("artefact_not-sold");
      }

      ;
      artefactBuy.dataset.bonus = index;
      artefact.appendChild(artefactBuy);

      _this5.container.appendChild(artefact);
    });
    this.container.addEventListener("click", function (e) {
      if (e.target.classList.contains("artefact_not-sold")) {
        _this5.checkBuy(e.target);
      }
    });
  },
  buy: function buy(buyButton) {
    var bonus = Number(buyButton.dataset.bonus),
        item = this.items[bonus],
        bonusCost = item.cost;
    hero.coins -= bonusCost;
    hero.boughtItems[this.items.indexOf(item)] = item.sold = true;
    interfaceChanger.artefacts.setCoins();
    buyButton.classList.remove("artefact_not-sold");
    buyButton.parentNode.querySelector(".artefact__cost").innerHTML = "Sold";

    if (item.health && item.damage) {
      hero.maximumHp += item.health;
      hero.damage += item.damage;
    } else if (item.health) {
      hero.maximumHp += item.health;
    } else if (item.damage) {
      hero.damage += item.damage;
    } else if (item.timer) {
      hero.timerBonus += item.timer;
    }

    options.saveGame("savedHero", hero, 90);
    interfaceChanger.setHeroStatistic();
  },
  checkBuy: function checkBuy(buyButton) {
    var _this6 = this;

    var bonus = Number(buyButton.dataset.bonus),
        item = this.items[bonus],
        bonusCost = item.cost;

    if (hero.coins >= bonusCost && !item.sold) {
      new options.Prompt("Buy this artefact?", function () {
        _this6.buy(buyButton);
      }).show();
    } else {
      new options.Alert("Not enough coins.").show();
    }
  }
  /* ========================================== Game levels segment ==========================================*/

};
var gameLevels = {
  previewsClickable: false,
  container: gimme(".game-levels"),
  previews: [],
  createPreviews: function createPreviews() {
    var _this7 = this;

    var _loop = function _loop(i) {
      var enemy = new Enemy(i);
      var preview = document.createElement("div");
      preview.classList.add("level");

      if (!hero.complitedLevels[i - 1]) {
        preview.classList.add("level_not-complited");
      }

      preview.onclick = function () {
        if (!_this7.previewsClickable) return;
        _this7.previewsClickable = false;
        battleField.difficulty = i;
        var level = new Level(i);
        battleField.level = level;
        level.start();
      };

      var previewData = document.createElement("div");
      previewData.classList.add("level__data");
      preview.appendChild(previewData);
      var previewName = document.createElement("div");
      previewName.classList.add("level__name");
      previewName.innerHTML = "".concat(enemy.name);
      previewData.appendChild(previewName);
      var previewHp = document.createElement("div");
      previewHp.classList.add("level__health");
      previewHp.innerHTML = "Health: ".concat(enemy.maximumHp);
      previewData.appendChild(previewHp);
      var previewDamage = document.createElement("div");
      previewDamage.classList.add("level__damage");
      previewDamage.innerHTML = "Damage: ".concat(enemy.damage);
      previewData.appendChild(previewDamage);
      var previewImage = document.createElement("div");
      previewImage.classList.add("level__image");
      previewImage.style.backgroundImage = "url(img/".concat(enemy.descImage, ")");
      preview.appendChild(previewImage);

      _this7.container.appendChild(preview);

      _this7.previews.push(preview);
    };

    for (var i = 1; i <= Enemy.count; i++) {
      _loop(i);
    }
  }
  /* ========================================== Statistic segment ==========================================*/

};
var statistic = {
  container: gimme(".statistic"),
  wrapper: gimme(".statistic__wrapper"),
  health: gimme(".statistic__health"),
  damage: gimme(".statistic__damage"),
  timerBonus: gimme(".statistic__timer-bonus"),
  pureTime: gimme(".statistic__pure-time"),
  answers: gimme(".statistic__answers"),
  mistakes: gimme(".statistic__mistakes"),
  progress: gimme(".statistic__progress"),
  bestRun: gimme(".statistic__best-result"),
  logButton: gimme(".statistic__log-button"),
  restartButton: gimme(".statistic__restart-button"),
  listenToEvents: function listenToEvents() {
    this.logButton.addEventListener("click", function () {
      animations.toLog();
    });
    this.restartButton.addEventListener("click", function () {
      var message = "Do you want to restart the game?";

      var handler = function handler() {
        options.saveGame("savedHero", "delete", 0);
        location.reload();
      };

      var prompt = new options.Prompt(message, handler);
      prompt.show();
    });
  },
  log: {
    wrapper: gimme(".statistic__log-wrapper"),
    output: gimme(".output"),
    damageNote: function damageNote(target) {
      var note = document.createElement("div"),
          message,
          targetName,
          targetDamage,
          hpBefore,
          hpAfter;

      if (target === "enemy") {
        targetName = damageSystem.enemy.name;
        targetDamage = hero.damage;
        hpBefore = damageSystem.enemy.currentHp;
      } else {
        targetName = hero.name;
        targetDamage = damageSystem.enemy.damage;
        hpBefore = hero.currentHp;
      }

      hpAfter = hpBefore - targetDamage;
      if (hpAfter < 0) hpAfter = 0;
      message = "".concat(targetName, " takes ").concat(targetDamage, " damage. HP: ").concat(hpBefore, " &rarr; ").concat(hpAfter);
      note.innerHTML = message;
      this.output.appendChild(note);
      this.output.appendChild(document.createElement("br"));
    },
    gameNote: function gameNote(message, space) {
      var note = document.createElement("div");
      note.innerHTML = message;
      this.output.appendChild(note);
      if (space) this.output.appendChild(document.createElement("br"));
    },
    clear: function clear() {
      this.output.innerHTML = "";
    }
  }
  /* ========================================== Tutorial segment ==========================================*/

};
var tutorial = {
  container: gimme(".tutorial"),
  wrapper: gimme(".tutorial__wrapper"),
  controls: {
    skip: gimme(".page__skip-button"),
    play: gimme(".page__play-button"),
    next: gimme(".tutorial__next"),
    prev: gimme(".tutorial__prev")
  },
  pages: gimme(".page", "all"),
  currentPage: 0,
  refresh: function refresh() {
    this.currentPage = 0;
    this.pages.forEach(function (item, index) {
      if (item.classList.contains("page_hidden_zoom")) item.classList.remove("page_hidden_zoom");
      if (!item.classList.contains("page_hidden_away") && index !== 0) item.classList.add("page_hidden_away");
    });
  },
  listenToEvents: function listenToEvents() {
    var _this8 = this;

    this.controls.next.addEventListener("click", function () {
      if (_this8.currentPage === _this8.pages.length - 1) return;

      _this8.pages[_this8.currentPage++].classList.add("page_hidden_zoom");

      _this8.pages[_this8.currentPage].classList.remove("page_hidden_away");
    });
    this.controls.prev.addEventListener("click", function () {
      if (_this8.currentPage === 0) return;

      _this8.pages[_this8.currentPage--].classList.add("page_hidden_away");

      _this8.pages[_this8.currentPage].classList.remove("page_hidden_zoom");
    });
    this.controls.skip.addEventListener("click", function () {
      animations.toMainMenu();
    });
    this.controls.play.addEventListener("click", function () {
      animations.toMainMenu();
    });
  }
  /* ========================================== Battle field segment ==========================================*/

};
var battleField = {
  container: gimme(".battle-field"),
  woundScreen: gimme(".battle-field__wound"),
  battleWrapper: {
    container: gimme(".battle-field__wrapper"),
    timer: gimme(".timer"),
    task: gimme(".task"),
    spheresArea: gimme(".spheres-area")
  },
  level: null,
  taskTimerId: null,
  spheresClickable: false,
  difficulty: null,
  task: null,
  coins: 0,
  levelTime: null,
  listenToEvents: function listenToEvents() {
    var _this9 = this;

    this.battleWrapper.spheresArea.addEventListener("click", function (e) {
      if (_this9.spheresClickable && e.target.classList.contains("sphere__answer")) {
        _this9.spheresClickable = false;
        var impulse = e.target.parentNode.querySelector(".sphere__impulse");

        if (Number(e.target.innerHTML) === _this9.task.result) {
          impulse.style.animation = "impulse_right .4s linear";
          setTimeout(function () {
            impulse.style.animation = "";
          }, 400);
          statistic.log.gameNote("&uarr; Nice. The right answer was chosen: ".concat(e.target.innerHTML, " &darr;"));
          hero.answers++;
          damageSystem.takeDamage("enemy");
        } else {
          impulse.style.animation = "impulse_wrong .4s linear";
          setTimeout(function () {
            impulse.style.animation = "";
          }, 400);
          statistic.log.gameNote("&uarr; The wrong answer was chosen: ".concat(e.target.innerHTML, " &darr;"));
          hero.mistakes++;
          damageSystem.takeDamage("hero");
        }
      }
    });
  },
  addTask: function addTask() {
    var _this10 = this;

    var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.difficulty;
    var taskOuter = this.battleWrapper.task,
        timerOuter = this.battleWrapper.timer,
        spheres = this.level.spheres,
        task = new Task(level);
    statistic.log.gameNote("New Task created: ".concat(task.str));
    statistic.log.gameNote("Right answer: ".concat(task.result));
    statistic.log.gameNote("Fakes: ".concat(task.fakes.join(", ")));
    this.spheresClickable = true;
    this.task = task;
    damageSystem.task = task;
    if (this.taskTimerId != null) clearInterval(this.taskTimerId);
    timerOuter.innerHTML = task.timer;
    this.taskTimerId = setInterval(function () {
      if (!hero.isDead && !damageSystem.enemy.isDead) {
        timerOuter.innerHTML = --task.timer;
      }

      if (task.timer <= 0) {
        hero.mistakes++;
        statistic.log.gameNote("&uarr; Time is out &darr;");
        damageSystem.takeDamage("hero");

        if (hero.isDead || damageSystem.enemy.isDead) {
          clearInterval(_this10.taskTimerId);
        }

        ;
      }

      if (hero.isDead) {
        timerOuter.innerHTML = "";
        clearInterval(_this10.taskTimerId);
      } else if (damageSystem.enemy.isDead) {
        timerOuter.innerHTML = "";
        clearInterval(_this10.taskTimerId);
      }
    }, 1000);
    taskOuter.innerHTML = task.str;
    spheres.forEach(function (item, index) {
      item.querySelector(".sphere__answer").innerHTML = task.allResults[index];
    });
  }
};
/* ========================================== Level constructor ==========================================*/

var Level =
/*#__PURE__*/
function () {
  function Level(level) {
    _classCallCheck(this, Level);

    this.level = level;
    this.spheres = [];
  }

  _createClass(Level, [{
    key: "start",
    value: function start() {
      statistic.log.clear();
      statistic.log.gameNote("Start level ".concat(this.level, "."), true);
      animations.toBattleField();
      this.createBase();
    }
  }, {
    key: "createBase",
    value: function createBase() {
      var _this11 = this;

      hero.add();
      Enemy.add(battleField.difficulty);
      var spheresOuter = battleField.battleWrapper.spheresArea,
          task = new Task(battleField.difficulty);
      spheresOuter.innerHTML = "";
      task.allResults.forEach(function (item, index, arr) {
        var sphere = document.createElement("div");
        var sphereImpulse = document.createElement("div");
        sphereImpulse.classList.add("sphere__impulse");
        sphere.appendChild(sphereImpulse);
        var sphereAnswer = document.createElement("div");
        sphereAnswer.classList.add("sphere__answer");
        sphere.appendChild(sphereAnswer);
        sphere.classList.add("sphere");
        sphere.classList.add("sphere_for".concat(arr.length, "-s").concat(index + 1));
        spheresOuter.appendChild(sphere);

        _this11.spheres.push(sphere);
      });
      animations.liveSpheres();
      battleField.battleWrapper.task.innerHTML = "Click to start";

      battleField.battleWrapper.task.onclick = function () {
        battleField.addTask(battleField.difficulty);
        _this11.startTime = new Date();
        battleField.battleWrapper.task.onclick = null;
      };
    }
  }, {
    key: "end",
    value: function end(result) {
      if (result === "win") {
        hero.coins += battleField.coins;
        interfaceChanger.outro.setImage(hero.outroImage);
        interfaceChanger.outro.setCoins(result);
        statistic.log.gameNote("Earned ".concat(battleField.coins, " coins."), true);
        statistic.log.gameNote("Level ".concat(this.level, " complited."), true);
      } else if (result === "lose") {
        var loss = hero.loseCoins();
        interfaceChanger.outro.setImage(damageSystem.enemy.outroImage);
        interfaceChanger.outro.setCoins(result, loss);
        statistic.log.gameNote("Lost ".concat(loss, " coins."), true);
        statistic.log.gameNote("Defeat at level ".concat(this.level, "."), true);
      }

      this.endTime = new Date();
      battleField.levelTime = this.endTime - this.startTime;
      hero.pureTime += battleField.levelTime;
      interfaceChanger.artefacts.setCoins();

      if (!hero.gameComplited && Enemy.killedOnce.every(function (item) {
        return item === true;
      })) {
        if (!saves.bestRun || saves.bestRun > hero.pureTime) {
          saves.bestRun = hero.pureTime;
          options.saveGame("bestRun", hero.pureTime, 90);
          new options.Alert("Game complited! New best run: ".concat(Math.round(hero.pureTime / 100) / 10)).show();
        } else {
          new options.Alert("Game complited! Run time: ".concat(Math.round(hero.pureTime / 100) / 10)).show();
        }

        hero.gameComplited = true;
      }

      interfaceChanger.setGameStatistic();
      battleField.coins = 0;
      options.saveGame("savedHero", hero, 90);
      animations.levelFinished();
    }
  }]);

  return Level;
}();
/* ========================================== Task constructor ==========================================*/


var Task =
/*#__PURE__*/
function () {
  function Task(level) {
    _classCallCheck(this, Task);

    var parts, str, result, fakes, allResults;
    this.level = level;

    if (level === 1) {
      parts = [options.randNum(1, 9), Task.randOper("ease"), options.randNum(1, 9)], str = parts.join(" "), result = eval(str), fakes = Task.getFakes(result, "ease"), allResults = options.shuffle(fakes.concat(result));
    } else if (level === 2) {
      parts = [options.randNum(10, 30), Task.randOper("ease"), options.randNum(10, 30)], str = parts.join(" "), result = eval(str), fakes = Task.getFakes(result, "ease"), allResults = options.shuffle(fakes.concat(result));
    } else if (level === 3) {
      parts = [options.randNum(20, 50), Task.randOper("ease"), options.randNum(20, 50)], str = parts.join(" "), result = eval(str), fakes = Task.getFakes(result, "ease"), allResults = options.shuffle(fakes.concat(result));
    } else if (level === 4) {
      parts = [options.randNum(40, 100), Task.randOper("ease"), options.randNum(40, 100)], str = parts.join(" "), result = eval(str), fakes = Task.getFakes(result, "normal"), allResults = options.shuffle(fakes.concat(result));
    } else if (level === 5) {
      parts = [options.randNum(20, 50), Task.randOper("ease"), options.randNum(20, 50), Task.randOper("ease"), options.randNum(20, 50)], str = parts.join(" "), result = eval(str), fakes = Task.getFakes(result, "normal"), allResults = options.shuffle(fakes.concat(result));
    } else if (level === 6) {
      parts = [options.randNum(30, 100), Task.randOper("ease"), options.randNum(30, 100), Task.randOper("ease"), options.randNum(30, 100)], str = parts.join(" "), result = eval(str), fakes = Task.getFakes(result, "normal"), allResults = options.shuffle(fakes.concat(result));
    } else if (level === 7) {
      parts = [options.randNum(50, 130), Task.randOper("ease"), options.randNum(50, 130), Task.randOper("ease"), options.randNum(50, 130)], str = parts.join(" "), result = eval(str), fakes = Task.getFakes(result, "hard"), allResults = options.shuffle(fakes.concat(result));
    } else if (level === 8) {
      parts = [options.randNum(80, 200), Task.randOper("ease"), options.randNum(80, 200), Task.randOper("ease"), options.randNum(80, 200)], str = parts.join(" "), result = eval(str), fakes = Task.getFakes(result, "hard"), allResults = options.shuffle(fakes.concat(result));
    } else {
      throw new Error("Incorrect Task's level");
    }

    this.parts = parts;
    this.str = str;
    this.result = result;
    this.fakes = fakes;
    this.allResults = allResults;
    this.timer = 5 + hero.timerBonus;
  }

  _createClass(Task, null, [{
    key: "randOper",
    value: function randOper(level) {
      if (level === "ease") {
        return ["+", "-"][options.randNum(1)];
      } else {
        throw new Error("Incorrect Operator's difficulty");
      }
    }
  }, {
    key: "getRange",
    value: function getRange(level) {
      var range = [];

      if (level === "ease") {
        for (var i = 0; i < 3; i++) {
          range.push(options.randNum(-3, 3, range.concat(0)));
        }

        return range;
      } else if (level === "normal") {
        for (var _i = 0; _i < 4; _i++) {
          range.push(options.randNum(-10, 10, range.concat(0)));
        }

        return range;
      } else if (level === "hard") {
        for (var _i2 = 0; _i2 < 5; _i2++) {
          range.push(options.randNum(-20, 20, range.concat(0)));
        }

        return range;
      } else {
        throw new Error("Have no range for this Level yet.");
      }
    }
  }, {
    key: "getFakes",
    value: function getFakes(result, level) {
      var fakes = [],
          range = this.getRange(level);
      range.forEach(function (item, index, arr) {
        fakes.push(result + item);
      });
      return fakes;
    }
  }]);

  return Task;
}();
/* ========================================== Hero segment ==========================================*/


var hero = saves.hero || {
  gameVersion: 1,
  pureTime: 0,
  answers: 0,
  mistakes: 0,
  progress: 0,
  timerBonus: 0,
  name: "Owl",
  currentHp: 50,
  maximumHp: 50,
  damage: 10,
  coins: 0,
  boughtItems: [],
  gameComplited: false
};
Object.defineProperties(hero, {
  isDead: {
    value: false,
    writable: true,
    enumerable: false,
    configurable: true
  },
  outroImage: {
    value: "owl_outro.png",
    writable: true,
    enumerable: false,
    configurable: true
  }
});

hero.refresh = function () {
  this.isDead = false;
  this.currentHp = this.maximumHp;
  interfaceChanger.hero.bars.change();
};

hero.add = function () {
  this.refresh();
};

hero.loseCoins = function () {
  if (this.coins === 0) return 0;
  var loss = options.persFromNum(15, this.coins);
  if (loss === 0) loss = 1;
  this.coins -= loss;
  return loss;
};

hero.killed = function () {
  this.isDead = true;
  battleField.coins = 0;
  battleField.level.end("lose");
};
/* ========================================== Enemy constructor ==========================================*/


var Enemy =
/*#__PURE__*/
function () {
  function Enemy(level) {
    _classCallCheck(this, Enemy);

    this.level = level;
    this.isDead = false;

    if (level === 1) {
      this.name = "Cobra";
      this.damage = 5;
      this.currentHp = 40;
      this.maximumHp = 40;
      this.coins = options.randNum(18, 22);
      this.descImage = "cobra.png";
      this.outroImage = "cobra_outro.png";
    } else if (level === 2) {
      this.name = "Scorpion";
      this.damage = 10;
      this.currentHp = 55;
      this.maximumHp = 55;
      this.coins = options.randNum(27, 33);
      this.descImage = "scorpion.png";
      this.outroImage = "scorpion_outro.png";
    } else if (level === 3) {
      this.name = "Werewolf";
      this.damage = 15;
      this.currentHp = 70;
      this.maximumHp = 70;
      this.coins = options.randNum(36, 44);
      this.descImage = "werewolf.png";
      this.outroImage = "werewolf_outro.png";
    } else if (level === 4) {
      this.name = "Cerberus";
      this.damage = 20;
      this.currentHp = 95;
      this.maximumHp = 95;
      this.coins = options.randNum(45, 55);
      this.descImage = "cerberus.png";
      this.outroImage = "cerberus_outro.png";
    } else if (level === 5) {
      this.name = "Phenix";
      this.damage = 25;
      this.currentHp = 110;
      this.maximumHp = 110;
      this.coins = options.randNum(54, 66);
      this.descImage = "phenix.png";
      this.outroImage = "phenix_outro.png";
    } else if (level === 6) {
      this.name = "Dragon";
      this.damage = 30;
      this.currentHp = 125;
      this.maximumHp = 125;
      this.coins = options.randNum(63, 77);
      this.descImage = "dragon.png";
      this.outroImage = "dragon_outro.png";
    } else if (level === 7) {
      this.name = "Gryphon";
      this.damage = 35;
      this.currentHp = 150;
      this.maximumHp = 150;
      this.coins = options.randNum(72, 88);
      this.descImage = "gryphon.png";
      this.outroImage = "gryphon_outro.png";
    } else if (level === 8) {
      this.name = "Manticore";
      this.damage = 40;
      this.currentHp = 200;
      this.maximumHp = 200;
      this.coins = options.randNum(81, 99);
      this.descImage = "manticore.png";
      this.outroImage = "manticore_outro.png";
    } else {
      throw new Error("Incorrect Enemy's level");
    }
  }

  _createClass(Enemy, [{
    key: "killed",
    value: function killed() {
      this.isDead = true;
      battleField.coins = this.coins;

      if (!Enemy.killedOnce[this.level - 1]) {
        Enemy.killedOnce[this.level - 1] = true;
        gameLevels.previews[this.level - 1].classList.remove("level_not-complited");
      }

      battleField.level.end("win");
    }
  }], [{
    key: "add",
    value: function add(difficulty) {
      var enemy = new Enemy(difficulty);
      interfaceChanger.enemy.bars.change(enemy);
      damageSystem.enemy = enemy;
    }
  }]);

  return Enemy;
}();

Enemy.count = 8;

if (!hero.complitedLevels) {
  Enemy.killedOnce = [];

  for (var i = 0; i < Enemy.count; i++) {
    Enemy.killedOnce.push(false);
  }

  hero.complitedLevels = Enemy.killedOnce;
} else {
  Enemy.killedOnce = hero.complitedLevels;
}
/* ========================================== Damage System ==========================================*/


var damageSystem = {
  enemy: null,
  takeDamage: function takeDamage(target) {
    statistic.log.damageNote(target);

    if (target === "enemy") {
      this.enemy.currentHp = this.enemy.currentHp - hero.damage;

      if (this.enemy.currentHp <= 0) {
        battleField.spheresClickable = false;
        this.enemy.currentHp = 0;
        this.enemy.killed();
      } else {
        battleField.addTask();
      }

      interfaceChanger.enemy.bars.change(this.enemy);
    } else if (target === "hero") {
      animations.woundFlesh();
      hero.currentHp = hero.currentHp - this.enemy.damage;

      if (hero.currentHp <= 0) {
        battleField.spheresClickable = false;
        hero.currentHp = 0;
        hero.killed();
      } else {
        battleField.addTask();
      }

      interfaceChanger.hero.bars.change();
    }
  }
};
/* ========================================== Interface Changer ==========================================*/

var interfaceChanger = {
  hero: {
    bars: {
      currentHp: gimme(".hp-bar_bind_hero .hp-bar__current"),
      textHp: gimme(".hp-bar_bind_hero .hp-bar__text"),
      change: function change() {
        this.textHp.innerHTML = "".concat(hero.currentHp, "/").concat(hero.maximumHp);
        this.currentHp.style.width = Math.round(hero.currentHp / hero.maximumHp * 100) + "%";
      }
    }
  },
  enemy: {
    bars: {
      currentHp: gimme(".hp-bar_bind_enemy .hp-bar__current"),
      textHp: gimme(".hp-bar_bind_enemy .hp-bar__text"),
      change: function change(enemy) {
        this.textHp.innerHTML = "".concat(enemy.currentHp, "/").concat(enemy.maximumHp);
        this.currentHp.style.width = Math.round(enemy.currentHp / enemy.maximumHp * 100) + "%";
      }
    }
  },
  startPosition: function startPosition() {
    this.hero.bars.textHp.innerHTML = "".concat(hero.currentHp, "/").concat(hero.maximumHp);
  },
  outro: {
    container: gimme(".outro"),
    coins: gimme(".outro__coins"),
    image: gimme(".outro__image"),
    stains: gimme(".outro__stains"),
    setCoins: function setCoins(result, loss) {
      if (result === "win") {
        this.coins.innerHTML = "Coins earned: ".concat(battleField.coins);
      } else if (result === "lose") {
        this.coins.innerHTML = "Coins lost: ".concat(loss);
      }
    },
    setImage: function setImage(image) {
      this.image.style.backgroundImage = "url(img/".concat(image, ")");
    }
  },
  artefacts: {
    container: controlPanel.data,
    setCoins: function setCoins() {
      this.container.innerHTML = "Coins: ".concat(hero.coins);
    }
  },
  setHeroStatistic: function setHeroStatistic() {
    statistic.health.innerHTML = "Health: ".concat(hero.maximumHp);
    statistic.damage.innerHTML = "Damage: ".concat(hero.damage);
    statistic.timerBonus.innerHTML = "Timer bonus: ".concat(hero.timerBonus, "s");
  },
  setGameStatistic: function setGameStatistic() {
    var time = Math.round(hero.pureTime / 100) / 10;
    var bestRun = saves.bestRun ? Math.round(saves.bestRun / 100) / 10 + "s" : "--";
    statistic.pureTime.innerHTML = "Pure time: ".concat(time, "s");
    statistic.answers.innerHTML = "Answers: ".concat(hero.answers);
    statistic.mistakes.innerHTML = "Mistakes: ".concat(hero.mistakes);
    statistic.progress.innerHTML = "Progress: ".concat(this.getGameProgress(), "%");
    statistic.bestRun.innerHTML = "Best run: ".concat(bestRun);
  },
  getGameProgress: function getGameProgress() {
    var killedEnemies = Enemy.killedOnce.reduce(function (result, currentItem) {
      if (currentItem === true) return result + currentItem;else return result;
    }, 0);
    var progress = Math.round(killedEnemies / Enemy.killedOnce.length * 100);
    return progress;
  },
  showStartData: function showStartData() {
    this.artefacts.setCoins();
    this.setHeroStatistic();
    this.setGameStatistic();
  }
};
/* ========================================== Animations ==========================================*/

var animations = {
  levelFinished: function levelFinished() {
    this.hideBattleField().then(this.showOutro).then(this.hideOutro).then(this.showOverlay).then(this.showMainMenu).then(this.showControlPanel).then(this.showGameLevels);
  },
  toMainMenu: function toMainMenu() {
    if (mainMenu.location === "levels") {
      this.hideControlPanel();
      this.hideOverlay();
      this.hideGameLevels().then(this.showLinks);
      mainMenu.location = "main-menu";
    } else if (mainMenu.location === "artefacts") {
      this.hideControlPanel();
      this.hideOverlay();
      this.hideArtefacts().then(this.showLinks);
      mainMenu.location = "main-menu";
    } else if (mainMenu.location === "statistic") {
      this.hideControlPanel();
      this.hideOverlay();
      this.hideStatistic().then(this.showLinks);
      mainMenu.location = "main-menu";
    } else if (mainMenu.location === "log") {
      this.hideLog();
      this.showStatisticWrapper();
      mainMenu.location = "statistic";
    } else if (mainMenu.location === "tutorial") {
      this.hideOverlay();
      this.hideTutorial().then(this.showLinks);
      mainMenu.location = "main-menu";
    }
  },
  toLog: function toLog() {
    mainMenu.location = "log";
    this.hideStatisticWrapper();
    this.showLog();
  },
  toGameLevels: function toGameLevels() {
    mainMenu.location = "levels";
    this.hideLinks().then(this.showGameLevels).then(this.showControlPanel);
  },
  toArtefacts: function toArtefacts() {
    mainMenu.location = "artefacts";
    this.hideLinks().then(this.showArtefacts).then(this.showControlPanel);
  },
  toStatistic: function toStatistic() {
    mainMenu.location = "statistic";
    this.hideLinks().then(this.showStatistic).then(this.showControlPanel);
  },
  toTutorial: function toTutorial() {
    mainMenu.location = "tutorial";
    this.hideLinks().then(this.showTutorial);
  },
  hideTutorial: function hideTutorial() {
    tutorial.pages[tutorial.currentPage].classList.add("page_hidden_zoom");
    tutorial.container.style.visibility = "hidden";
    tutorial.container.style.opacity = "0";
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, 500);
    });
  },
  showTutorial: function showTutorial() {
    tutorial.refresh();
    tutorial.container.style.visibility = "visible";
    tutorial.container.style.opacity = "1";
  },
  hideLog: function hideLog() {
    statistic.log.wrapper.style.transform = "";
  },
  showLog: function showLog() {
    statistic.log.wrapper.style.transform = "translateX(0)";
  },
  hideStatisticWrapper: function hideStatisticWrapper() {
    statistic.wrapper.style.transform = "translateX(-100%)";
  },
  showStatisticWrapper: function showStatisticWrapper() {
    statistic.wrapper.style.transform = "";
  },
  showStatistic: function showStatistic() {
    statistic.container.style.visibility = "visible";
    statistic.container.style.opacity = "1";
  },
  hideStatistic: function hideStatistic() {
    statistic.container.style.visibility = "hidden";
    statistic.container.style.opacity = "0";
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, 500);
    });
  },
  showArtefacts: function showArtefacts() {
    artefacts.container.style.visibility = "visible";
    artefacts.container.style.opacity = "1";
    var time = 0,
        items = Array.prototype.slice.call(gimme(".artefact", "all"));
    items.forEach(function (item) {
      setTimeout(function () {
        item.style.transform = "translate(0, 0)";
        item.style.opacity = "1";
      }, time += 80);
    });
  },
  hideArtefacts: function hideArtefacts() {
    artefacts.container.style.visibility = "hidden";
    artefacts.container.style.opacity = "0";
    var time = 0,
        items = Array.prototype.slice.call(gimme(".artefact", "all")).reverse();
    items.forEach(function (item) {
      setTimeout(function () {
        item.style.transform = "translate(100%, 100%)";
        item.style.opacity = "0";
      }, time += 80);
    });
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, 500);
    });
  },
  showLinks: function showLinks() {
    mainMenu.links.container.style.opacity = "1";
    mainMenu.links.container.style.visibility = "visible";
    mainMenu.links.clickable = true;
    var time = 150,
        items = Array.prototype.slice.call(mainMenu.links.container.children),
        final = 150 * items.length;
    items.forEach(function (item) {
      setTimeout(function () {
        item.style.transform = "";
      }, time += 150);
    });
  },
  hideLinks: function hideLinks() {
    var time = -150,
        items = Array.prototype.slice.call(mainMenu.links.container.children),
        final = 150 * items.length;
    mainMenu.links.clickable = false;
    this.showOverlay();
    items.forEach(function (item) {
      setTimeout(function () {
        item.style.transform = "rotateY(90deg)";
      }, time += 150);
    });
    return new Promise(function (resolve) {
      setTimeout(function () {
        mainMenu.links.container.style.opacity = "0";
        mainMenu.links.container.style.visibility = "hidden";
        resolve();
      }, final);
    });
  },
  showGameLevels: function showGameLevels() {
    gameLevels.container.style.visibility = "visible";
    gameLevels.container.style.opacity = "1";
    gameLevels.previewsClickable = true;
    var time = 0,
        items = Array.prototype.slice.call(gameLevels.container.children).reverse();
    items.forEach(function (item) {
      setTimeout(function () {
        item.style.transform = "translateX(0)";
        item.style.opacity = "1";
      }, time += 60);
    });
  },
  hideGameLevels: function hideGameLevels() {
    gameLevels.previewsClickable = false;
    var time = 0,
        items = Array.prototype.slice.call(gameLevels.container.children);
    items.forEach(function (item) {
      setTimeout(function () {
        item.style.transform = "translateX(-100%)";
        item.style.opacity = "0";
      }, time += 60);
    });
    return new Promise(function (resolve) {
      setTimeout(function () {
        gameLevels.container.style.visibility = "hidden";
        gameLevels.container.style.opacity = "0";
        resolve();
      }, 60 * items.length);
    });
  },
  showControlPanel: function showControlPanel() {
    controlPanel.container.style.transform = "translateX(0)";
  },
  hideControlPanel: function hideControlPanel() {
    controlPanel.container.style.transform = "";
  },
  showOverlay: function showOverlay() {
    mainMenu.overlay.style.visibility = "visible";
    mainMenu.overlay.style.opacity = "1";
  },
  hideOverlay: function hideOverlay() {
    mainMenu.overlay.style.visibility = "hidden";
    mainMenu.overlay.style.opacity = "0";
  },
  toBattleField: function toBattleField() {
    this.hideControlPanel();
    return this.hideGameLevels().then(this.hideMainMenu).then(this.showBattleField);
  },
  showBattleField: function showBattleField() {
    battleField.container.style.visibility = "visible";
    battleField.container.style.opacity = "1";
  },
  hideBattleField: function hideBattleField() {
    battleField.container.style.visibility = "hidden";
    battleField.container.style.opacity = "0";
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, 2000);
    });
  },
  showMainMenu: function showMainMenu() {
    mainMenu.container.style.visibility = "visible";
    mainMenu.container.style.opacity = "1";
  },
  hideMainMenu: function hideMainMenu() {
    mainMenu.container.style.visibility = "hidden";
    mainMenu.container.style.opacity = "0";
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, 1500);
    });
  },
  showOutro: function showOutro() {
    interfaceChanger.outro.container.style.visibility = "visible";
    interfaceChanger.outro.container.style.opacity = "1";
    interfaceChanger.outro.image.style.transform = "translateX(15%)";
    interfaceChanger.outro.stains.style.transform = "translateX(5%)";
    animations.stainGenerator(12, interfaceChanger.outro.stains);
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, 3000);
    });
  },
  hideOutro: function hideOutro() {
    interfaceChanger.outro.container.style.visibility = "hidden";
    interfaceChanger.outro.container.style.opacity = "0";
    return new Promise(function (resolve) {
      setTimeout(function () {
        interfaceChanger.outro.image.style.transform = "translateX(-5%)";
        interfaceChanger.outro.stains.style.transform = "translateX(-5%)";
        resolve();
      }, 1000);
    });
  },
  liveSpheres: function liveSpheres() {
    var spheres = gimme(".sphere", "all");
    spheres.forEach(function (item) {
      setInterval(function () {
        var x = options.randNum(-50, 50),
            y = options.randNum(-50, 50);
        item.style.transform = "translate(".concat(x, "%, ").concat(y, "%)");
      }, options.randNum(1200, 1800));
    });
  },
  stainGenerator: function stainGenerator(amount, container) {
    container.innerHTML = "";
    var biggerSize = container.offsetWidth >= container.offsetHeight ? container.offsetWidth : container.offsetHeight,
        stainSize = options.persFromNum(15, biggerSize),
        stainBigest = options.persFromNum(130, stainSize),
        stainLeast = options.persFromNum(70, stainSize),
        stains = [];

    for (var _i3 = 0; _i3 < amount; _i3++) {
      var rotation = options.randNum(0, 360),
          randSize = options.randNum(stainLeast, stainBigest),
          x = options.randNum(0, container.offsetWidth - randSize),
          y = options.randNum(0, container.offsetHeight - randSize);
      var div = document.createElement("div");
      div.classList.add("outro__stain");
      div.style.width = randSize + "px";
      div.style.height = randSize + "px";
      div.style.transform = "rotate(".concat(rotation, "deg)");
      div.style.top = y + "px";
      div.style.left = x + "px";
      container.appendChild(div);
      stains.push(div);
    }

    return stains;
  },
  woundFlesh: function woundFlesh() {
    battleField.woundScreen.style.visibility = "visible";
    battleField.woundScreen.style.opacity = "1";
    setTimeout(function () {
      battleField.woundScreen.style.visibility = "hidden";
      battleField.woundScreen.style.opacity = "0";
    }, 400);
  }
};
/* ========================================== Activate app ==========================================*/

gameLevels.createPreviews();
artefacts.createItems();
mainMenu.listenToEvents();
controlPanel.listenToEvents();
statistic.listenToEvents();
tutorial.listenToEvents();
battleField.listenToEvents();
interfaceChanger.showStartData();
preloader.loadResources();
/* ========================================== TEST zone ==========================================*/

gimme(".test-button").addEventListener("click", function () {});