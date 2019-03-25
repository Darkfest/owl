"use strict";

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

const options = {
	shuffle: function(arr) {
		let randIndex, tempSlot, length = arr.length;
		for (let i = length - 1; i > 0; i--) {
			randIndex = this.randNum(i); 
			tempSlot = arr[randIndex];
			arr[randIndex] = arr[i];
			arr[i] = tempSlot; 
		}
		return arr;
	},
	randNum: function(min, max, notThese) {

		if (arguments.length === 0) 
			throw new Error("The random function expects one argument at least.");

		if ( isNaN(Number(min)) || typeof(min) === "boolean" || typeof(min) === "object") 
			throw new Error(`Unexpected type of first argument: "${typeof(min)}".`); 

		if (arguments.length === 1) {
			if (min >= 0) {
				return Math.floor(Math.random() * ++min);
			} else {
				return Math.ceil(Math.random() * --min);
			}
		}
		
		if ( isNaN(Number(max)) || typeof(max) === "boolean" || typeof(max) === "object") 
			throw new Error(`Unexpected type of second argument: "${typeof(max)}".`);

		let result;
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
				throw new Error(`Unexpected type of third argument: "${Object.prototype.toString.call(notThese).slice(8, -1)}".`);
			}
		}
		return result;
	}, 

	

	persFromNum: function(pers, num) {
		return Math.round(num * pers / 100);
	},

	
	saveGame: function(name, saveObj, days) {
		let saveStr = JSON.stringify(saveObj),
			saveEncStr = encodeURIComponent(saveStr),
			cookieAge = 60 * 60 * 24 * days;

		document.cookie = `${name}=${saveEncStr}; max-age=${cookieAge}`;
	},
	getSave: function(name) {
		if (document.cookie == "") return null;
		let cookies = document.cookie.split("; ");
		let index;

		for(let i = 0; i < cookies.length; i++) {
			if (cookies[i].indexOf(name) >=0) {
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
	Prompt: function(message, handler) {
		let wrapperStyle = [
			"z-index: 999",
			"position: fixed",
			"overflow: hidden",
			"top: 0",
			"height: 100vh",
			"width: 100%",
			"background-color: rgba(0, 0, 0, 0.5)",
			"visibility: hidden",
			"opacity: 0",
			"transition: visibility .8s, opacity .8s",
			"perspective: 500px",
		].join("; ");
		let promptStyle = [
			"position: fixed",
			"height: 12rem",
			"width: 20rem",
			"background-color: #fff",
			"top: 50%",
			"left: 50%",
			"transform: translate(-50%, 80%) scale(0.7) rotateX(-30deg)",
			"visibility: hidden",
			"opacity: 0",
			"transition: visibility .8s ease, opacity .8s ease, transform .8s ease",
			"text-align: center",
			"font: 1.5rem Exo_2, calibri",
			"border-radius: 0.625rem",
			"color: black",
		].join("; ");
		let messageStyle = [
			"width: 100%",
			"position: absolute",
			"padding: 0.5rem",
			"top: 50%",
			"transform: translateY(calc(-50% - 2.5rem))"
		].join("; ");
		let buttonStyle = [
			"height: 4rem",
			"width: 8rem",
			"line-height: 4rem",
			"border-radius: 0.625rem",
			"cursor: pointer",
			"position: absolute",
			"bottom: 0.5rem",
			"box-shadow: 0 0 0.3rem #8e8e8e",
			"transition: background-color .5s"
		].join("; ");

		let acceptStyle = [
			"left: 0.5rem"
		].join("; ");
		let cancelStyle = [
			"right: 0.5rem"
		].join("; ");

		let wrapper = document.createElement("div");
		wrapper.setAttribute("style", wrapperStyle);


		let prompt = document.createElement("div");
		prompt.setAttribute("style", promptStyle);	

		let msg = document.createElement("div");
		msg.innerHTML = message;
		msg.setAttribute("style", messageStyle);

		let accept = document.createElement("div");
		accept.innerHTML = "Yes";
		accept.setAttribute("style", buttonStyle + "; " + acceptStyle);

		accept.onclick = ()=> {
				this.remove(true);
				accept.onclick = null;
				cancel.onclick = null;
		}

		let cancel = document.createElement("div");
		cancel.innerHTML = "No";
		cancel.setAttribute("style", buttonStyle + "; " + cancelStyle);

		cancel.onclick = ()=> {
				this.remove(false);
				accept.onclick = null;
				cancel.onclick = null;
		}

		accept.onmouseover = cancel.onmouseover = function() {
			this.style.backgroundColor = "#90dff1";
		}

		accept.onmouseout = cancel.onmouseout = function () {
			this.style.backgroundColor = "";
		}

		prompt.appendChild(msg);
		prompt.appendChild(accept);
		prompt.appendChild(cancel);
		wrapper.appendChild(prompt)
		document.body.appendChild(wrapper);



		this.element = prompt;
		this.message = message;
		this.remove = function(accepted) {
			prompt.style.visibility = "hidden";
			prompt.style.opacity = "0";
			prompt.style.transform = "translate(-50%, -200%) scale(0.6) rotateX(30deg)";

			wrapper.style.visibility = "hidden";
			wrapper.style.opacity = "0";
			wrapper.style.pointerEvents = "none";
			if (accepted) handler();
			setTimeout(()=>{
				
				document.body.removeChild(wrapper);
			}, 800);
		}
		this.show = function() {
			setTimeout(()=>{
				prompt.style.visibility = "visible";
				prompt.style.opacity = "1";
				prompt.style.transform = "translate(-50%, -70%) scale(1) rotateX(0)";

				wrapper.style.visibility = "visible";
				wrapper.style.opacity = "1";
			}, 50);
		}

	},

	Alert: function(message) {
		let wrapperStyle = [
			"z-index: 999",
			"position: fixed",
			"overflow: hidden",
			"top: 0",
			"height: 100vh",
			"width: 100%",
			"background-color: rgba(0, 0, 0, 0.5)",
			"visibility: hidden",
			"opacity: 0",
			"transition: visibility .8s, opacity .8s",
			"perspective: 500px", 
		].join("; ");
		let alertStyle = [
			"position: fixed",
			"height: 12rem",
			"width: 20rem",
			"background-color: #fff",
			"top: 50%",
			"left: 50%",
			"transform: translate(-50%, 80%) scale(0.7) rotateX(-30deg)",
			"visibility: hidden",
			"opacity: 0",
			"transition: visibility .8s ease, opacity .8s ease, transform .8s ease",
			"text-align: center",
			"font: 1.5rem Exo_2, calibri",
			"border-radius: 0.625rem",
			"color: black",
		].join("; ");
		let messageStyle = [
			"width: 100%",
			"position: absolute",
			"padding: 0.5rem",
			"top: 50%",
			"transform: translateY(calc(-50% - 2.5rem))"
		].join("; ");
		let buttonStyle = [
			"height: 4rem",
			"width: 8rem",
			"line-height: 4rem",
			"border-radius: 0.625rem",
			"cursor: pointer",
			"position: absolute",
			"bottom: 0.5rem",
			"box-shadow: 0 0 0.3rem #8e8e8e",
			"transition: background-color .5s",
			"left: calc(50% - 4rem)"
		].join("; ");

		let wrapper = document.createElement("div");
		wrapper.setAttribute("style", wrapperStyle);


		let alert = document.createElement("div");
		alert.setAttribute("style", alertStyle);	

		let msg = document.createElement("div");
		msg.innerHTML = message;
		msg.setAttribute("style", messageStyle);

		let accept = document.createElement("div");
		accept.innerHTML = "Okey";
		accept.setAttribute("style", buttonStyle);

		accept.onclick = ()=> {
				this.remove();
				accept.onclick = null;
		}

		accept.onmouseover = function() {
			this.style.backgroundColor = "#90dff1";
		}

		accept.onmouseout = function () {
			this.style.backgroundColor = "";
		}

		alert.appendChild(msg);
		alert.appendChild(accept);
		wrapper.appendChild(alert);
		document.body.appendChild(wrapper);



		this.element = alert;
		this.message = message;
		this.remove = function(accepted) {
			alert.style.visibility = "hidden";
			alert.style.opacity = "0";
			alert.style.transform = "translate(-50%, -200%) scale(0.6) rotateX(30deg)";

			wrapper.style.visibility = "hidden";
			wrapper.style.opacity = "0";
			wrapper.style.pointerEvents = "none";
			
			setTimeout(()=>{
				document.body.removeChild(wrapper);
			}, 800);
		}
		this.show = function() {
			setTimeout(()=>{
				alert.style.visibility = "visible";
				alert.style.opacity = "1";
				alert.style.transform = "translate(-50%, -70%) scale(1) rotateX(0)";

				wrapper.style.visibility = "visible";
				wrapper.style.opacity = "1";
			}, 50);
		}
	}

};

/* ========================================== Saves segment ==========================================*/

const saves = {
	hero: options.getSave("savedHero"),
	bestRun: options.getSave("bestRun"),
}


/* ========================================== Preloader segment ==========================================*/

const preloader = {
	container: gimme(".preloader"),
	imagesToLoad: [
		"main_menu_bg.png",
		"bg.png",
		"outro_bg.jpg",

		"artefact_damage.png",
		"artefact_health.png",
		"artefact_timer.png",
		"artefact_health_damage.png",

		"blood_1.png",
		"coins.png",
		"take_damage.png",

		"cobra.png",
		"scorpion.png",
		"werewolf.png",
		"cerberus.png",
		"phenix.png",
		"dragon.png",
		"gryphon.png",
		"manticore.png",

		"owl_outro.png",
		"cobra_outro.png",
		"scorpion_outro.png",
		"werewolf_outro.png",
		"cerberus_outro.png",
		"phenix_outro.png",
		"dragon_outro.png",
		"gryphon_outro.png",
		"manticore_outro.png",
	],
	loadResources: function() {
		let imageAmount = this.imagesToLoad.length;
		let imagesLoaded = 0;

		let handler = () => {
			imagesLoaded++; 
			if (imagesLoaded >= imageAmount) {
				setTimeout(()=>{
					if (!this.container.classList.contains("preloader_hidden")) this.container.classList.add("preloader_hidden");
				}, 500);
			}
		};

		this.imagesToLoad.forEach(item => {
			let image = new Image();
			image.src = `img/${item}`;
			image.addEventListener("load", handler);
			image.addEventListener("error", handler);
		});		
	},
};

/* ========================================== Control panel segment ==========================================*/

const controlPanel = {
	container: gimme(".control-panel"),
	backButton: gimme(".control-panel__back-button"),
	data: gimme(".control-panel__data"),

	listenToEvents: function() {
		this.backButton.addEventListener("click", ()=>{
			animations.toMainMenu();
		});
	}
}

/* ========================================== Main menu segment ==========================================*/

const mainMenu = {
	location: "tutorial",
	container: gimme(".main-menu"),
	overlay: gimme(".main-menu__overlay"),
	
	links: {
		clickable: true,
		container: gimme(".main-menu__links"),
		startGame: gimme(".main-menu__start-game"),
		inventory: gimme(".main-menu__artefacts"),
		settings: gimme(".main-menu__settings"),
	},
	listenToEvents: function() {
		
		this.links.container.addEventListener("click", (e)=>{
			if(!this.links.clickable) return;
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

		
	},
};

/* ========================================== Artefacts segment ==========================================*/

const artefacts = {
	container: gimme(".artefacts"),
	/*purchases: gimme(".artefacts__purchase-wrapper"),*/

	items: [
		{	
			sold: false,
			damage: 5,
			cost: 20,
			icon: "artefact_damage.png",
		}, {	
			sold: false,
			health: 10,
			cost: 30,
			icon: "artefact_health.png",
		}, {	
			sold: false,
			timer: 1,
			cost: 60,
			icon: "artefact_timer.png",
		}, {	
			sold: false,
			damage: 10,
			cost: 70,
			icon: "artefact_damage.png",
		}, {	
			sold: false,
			health: 15,
			cost: 80,
			icon: "artefact_health.png",
		}, {	
			sold: false,
			timer: 2,
			cost: 200,
			icon: "artefact_timer.png",
		}, {	
			sold: false,
			health: 15,
			damage: 10,
			cost: 150,
			icon: "artefact_health_damage.png",
		}, {	
			sold: false,
			health: 10,
			damage: 5,
			cost: 120,
			icon: "artefact_health_damage.png",
		},
	],
	createItems: function() {
		this.items.forEach((item, index, arr)=>{
			if (hero.boughtItems[index] === true) {
				item.sold = true;
			}
		});
		this.items.sort((a, b)=> a.cost - b.cost).forEach((item, index)=>{
			let artefact = document.createElement("div");
			artefact.classList.add("artefact");

			let artefactDescription = document.createElement("div");
			artefactDescription.classList.add("artefact__description");
			artefact.appendChild(artefactDescription);

			let artefactBonus = document.createElement("div");
			artefactBonus.classList.add("artefact__bonus");
			let bonuses;
			if (item.health && item.damage) {
				bonuses = `+${item.health} health<br>+${item.damage} damage`;
			} else if (item.health) {
				bonuses = `+${item.health} health`;
			} else if (item.damage) {
				bonuses = `+${item.damage} damage`;
			} else if (item.timer) {
				bonuses = `+${item.timer}s timer`;
			}
			artefactBonus.innerHTML = bonuses;
			artefactDescription.appendChild(artefactBonus);

			let artefactCost = document.createElement("div");
			artefactCost.classList.add("artefact__cost");
			artefactCost.innerHTML = `${item.cost} coins`;
			artefactDescription.appendChild(artefactCost);

			let artefactImage = document.createElement("div");
			artefactImage.classList.add("artefact__image");
			artefactImage.style.backgroundImage = `url(img/${item.icon})`;
			artefact.appendChild(artefactImage);

			let artefactBuy = document.createElement("div");
			artefactBuy.classList.add("artefact__buy");
			if (!item.sold) {
				artefactBuy.classList.add("artefact_not-sold");
			};
			artefactBuy.dataset.bonus = index;
			artefact.appendChild(artefactBuy);


			this.container.appendChild(artefact);
		});

		this.container.addEventListener("click", (e)=>{
			if (e.target.classList.contains("artefact_not-sold")) {

				this.checkBuy(e.target);

			}
		});
	},
	buy: function(buyButton) {
		let bonus = Number(buyButton.dataset.bonus),
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
	checkBuy: function(buyButton) {
		let	bonus = Number(buyButton.dataset.bonus),
			item = this.items[bonus],
			bonusCost = item.cost;
		if (hero.coins >= bonusCost && !item.sold) {

			new options.Prompt("Buy this artefact?", ()=>{
				this.buy(buyButton);
			}).show();

		} else {
			new options.Alert("Not enough coins.").show();
		}
	},
}

/* ========================================== Game levels segment ==========================================*/

const gameLevels = {
	previewsClickable: false,
	container: gimme(".game-levels"),
	previews: [],
	createPreviews: function() {
		for (let i = 1; i <= Enemy.count; i++) {
			let enemy = new Enemy(i);

			let preview = document.createElement("div");
			preview.classList.add("level");
			if (!hero.complitedLevels[i - 1]) {
				preview.classList.add("level_not-complited");
			}

			preview.onclick = ()=>{
				if (!this.previewsClickable) return;
				this.previewsClickable = false;
				battleField.difficulty = i;
				let level = new Level(i);
				battleField.level = level;
				level.start();
			};

			let previewData = document.createElement("div");
			previewData.classList.add("level__data");
			preview.appendChild(previewData);


			let previewName = document.createElement("div");
			previewName.classList.add("level__name");
			previewName.innerHTML = `${enemy.name}`;
			previewData.appendChild(previewName);

			let previewHp = document.createElement("div");
			previewHp.classList.add("level__health");
			previewHp.innerHTML = `Health: ${enemy.maximumHp}`;
			previewData.appendChild(previewHp);

			let previewDamage = document.createElement("div");
			previewDamage.classList.add("level__damage");
			previewDamage.innerHTML = `Damage: ${enemy.damage}`;
			previewData.appendChild(previewDamage);

			let previewImage = document.createElement("div");
			previewImage.classList.add("level__image");
			previewImage.style.backgroundImage = `url(img/${enemy.descImage})`;
			preview.appendChild(previewImage);

			this.container.appendChild(preview);
			this.previews.push(preview);

		}
	}
}

/* ========================================== Statistic segment ==========================================*/

const statistic = {
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

	listenToEvents: function() {
		this.logButton.addEventListener("click", ()=>{
			animations.toLog();
		});
		this.restartButton.addEventListener("click", ()=>{
			let message = "Do you want to restart the game?";
			let handler = () => {
				options.saveGame("savedHero", "delete", 0);
				location.reload();
			}
			let prompt = new options.Prompt(message, handler);
			prompt.show();
		});
	},

	log: {
		wrapper: gimme(".statistic__log-wrapper"),
		output: gimme(".output"),
		damageNote: function(target) {

			let note = document.createElement("div"),
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
			message = `${targetName} takes ${targetDamage} damage. HP: ${hpBefore} &rarr; ${hpAfter}`;


			note.innerHTML = message;
			this.output.appendChild(note);
			this.output.appendChild(document.createElement("br"));

		},
		gameNote: function(message, space) {
			let note = document.createElement("div");
			note.innerHTML = message;
			this.output.appendChild(note);
			if (space) this.output.appendChild(document.createElement("br"));
		},
		clear: function() {
			this.output.innerHTML = "";
		},
	}
}

/* ========================================== Tutorial segment ==========================================*/

const tutorial = {
	container: gimme(".tutorial"),
	wrapper: gimme(".tutorial__wrapper"),
	controls: {
		skip: gimme(".page__skip-button"),
		play: gimme(".page__play-button"),
		next: gimme(".tutorial__next"),
		prev: gimme(".tutorial__prev"),
	},
	
	pages: gimme(".page", "all"),
	currentPage: 0,
	refresh: function() {
		this.currentPage = 0;
		this.pages.forEach((item, index)=>{
			if (item.classList.contains("page_hidden_zoom")) item.classList.remove("page_hidden_zoom");
			if (!item.classList.contains("page_hidden_away") && index !== 0) item.classList.add("page_hidden_away");
		});
	},
	listenToEvents: function() {
		this.controls.next.addEventListener("click", ()=>{
			if (this.currentPage === this.pages.length - 1) return;
			this.pages[this.currentPage++].classList.add("page_hidden_zoom");
			this.pages[this.currentPage].classList.remove("page_hidden_away");
		});

		this.controls.prev.addEventListener("click", ()=>{
			if (this.currentPage === 0) return;
			this.pages[this.currentPage--].classList.add("page_hidden_away");
			this.pages[this.currentPage].classList.remove("page_hidden_zoom");
		});

		this.controls.skip.addEventListener("click", ()=>{
			animations.toMainMenu();
		});

		this.controls.play.addEventListener("click", ()=>{
			animations.toMainMenu();
		});
	}
}

/* ========================================== Battle field segment ==========================================*/

const battleField = {
	
	container: gimme(".battle-field"),
	woundScreen: gimme(".battle-field__wound"),
	
	battleWrapper: {
		container: gimme(".battle-field__wrapper"),
		timer: gimme(".timer"),
		task: gimme(".task"),
		spheresArea: gimme(".spheres-area"),
	},
	level: null,
	taskTimerId: null,
	spheresClickable: false,
	difficulty: null,
	task: null,
	coins: 0,
	levelTime: null,

	listenToEvents: function() {
		this.battleWrapper.spheresArea.addEventListener("click", (e) => {
			if (this.spheresClickable && e.target.classList.contains("sphere__answer") ) {
				this.spheresClickable = false;

				let impulse = e.target.parentNode.querySelector(".sphere__impulse");

				if (Number(e.target.innerHTML) === this.task.result) {

					
					impulse.style.animation = "impulse_right .4s linear";
					setTimeout(()=>{
						impulse.style.animation = "";
					}, 400);

					statistic.log.gameNote(`&uarr; Nice. The right answer was chosen: ${e.target.innerHTML} &darr;`);
					hero.answers ++;
					damageSystem.takeDamage("enemy");
					
				} else {

					
					impulse.style.animation = "impulse_wrong .4s linear";
					
					setTimeout(()=>{
						impulse.style.animation = "";
					}, 400);

					statistic.log.gameNote(`&uarr; The wrong answer was chosen: ${e.target.innerHTML} &darr;`);
					hero.mistakes ++;
					damageSystem.takeDamage("hero");
					
				}
			}
		});
	},
	addTask: function(level = this.difficulty) {
		let taskOuter = this.battleWrapper.task,
			timerOuter = this.battleWrapper.timer,
			spheres = this.level.spheres,
			task = new Task(level);

		statistic.log.gameNote(`New Task created: ${task.str}`);
		statistic.log.gameNote(`Right answer: ${task.result}`);
		statistic.log.gameNote(`Fakes: ${task.fakes.join(", ")}`);

		this.spheresClickable = true;

		this.task = task;
		damageSystem.task = task;


		if (this.taskTimerId != null) clearInterval(this.taskTimerId);
		timerOuter.innerHTML = task.timer;
		this.taskTimerId = setInterval(()=>{


			if (!hero.isDead && !damageSystem.enemy.isDead) {
				timerOuter.innerHTML = --task.timer;
			}


			if (task.timer <= 0) {
				hero.mistakes ++;
				statistic.log.gameNote("&uarr; Time is out &darr;");
				damageSystem.takeDamage("hero");
				if (hero.isDead || damageSystem.enemy.isDead) {
					clearInterval(this.taskTimerId);
				};
			}


			if (hero.isDead) {
				timerOuter.innerHTML = "";
				clearInterval(this.taskTimerId);
			} else if (damageSystem.enemy.isDead) {
				timerOuter.innerHTML = "";
				clearInterval(this.taskTimerId);
			}


		}, 1000);

		

		taskOuter.innerHTML = task.str;

		

		spheres.forEach((item, index)=>{

			item.querySelector(".sphere__answer").innerHTML = task.allResults[index];
		});

		
	}
};

/* ========================================== Level constructor ==========================================*/

class Level {
	constructor(level) {
		this.level = level;
		this.spheres = [];
	}

	start() {
		statistic.log.clear();
		statistic.log.gameNote(`Start level ${this.level}.`, true);
		animations.toBattleField();
		this.createBase()
	}
	createBase() {
		hero.add();
		Enemy.add(battleField.difficulty);


		let spheresOuter = battleField.battleWrapper.spheresArea,
			task = new Task(battleField.difficulty);

		spheresOuter.innerHTML = "";
			
		task.allResults.forEach((item, index, arr)=>{
			let sphere = document.createElement("div");

			let sphereImpulse = document.createElement("div");
			sphereImpulse.classList.add("sphere__impulse");
			sphere.appendChild(sphereImpulse);

			let sphereAnswer = document.createElement("div");
			sphereAnswer.classList.add("sphere__answer");
			sphere.appendChild(sphereAnswer);

			sphere.classList.add("sphere");
			sphere.classList.add(`sphere_for${arr.length}-s${index + 1}`);
			spheresOuter.appendChild(sphere);
			this.spheres.push(sphere);
		});

		animations.liveSpheres();

		battleField.battleWrapper.task.innerHTML = "Click to start"
		battleField.battleWrapper.task.onclick = () => {
			battleField.addTask(battleField.difficulty);
			this.startTime = new Date();
			battleField.battleWrapper.task.onclick = null;
		};
	}
	end(result) {
		if (result === "win") {
			hero.coins += battleField.coins;
			interfaceChanger.outro.setImage(hero.outroImage);
			interfaceChanger.outro.setCoins(result);
			statistic.log.gameNote(`Earned ${battleField.coins} coins.`, true);
			statistic.log.gameNote(`Level ${this.level} complited.`, true);
		} else if (result === "lose") {
			let loss = hero.loseCoins();
			interfaceChanger.outro.setImage(damageSystem.enemy.outroImage);
			interfaceChanger.outro.setCoins(result, loss);
			statistic.log.gameNote(`Lost ${loss} coins.`, true);
			statistic.log.gameNote(`Defeat at level ${this.level}.`, true);
		}

		this.endTime = new Date();
		battleField.levelTime = this.endTime - this.startTime;

		hero.pureTime += battleField.levelTime;

		
		interfaceChanger.artefacts.setCoins();
		if (!hero.gameComplited && Enemy.killedOnce.every(item => item === true)) {
			if (!saves.bestRun || saves.bestRun > hero.pureTime ) {
				saves.bestRun = hero.pureTime;
				options.saveGame("bestRun", hero.pureTime, 90);
				new options.Alert(`Game complited! New best run: ${Math.round(hero.pureTime / 100) / 10}`).show();
			} else {
				new options.Alert(`Game complited! Run time: ${Math.round(hero.pureTime / 100) / 10}`).show();
			}
			
			hero.gameComplited = true;
		}
		interfaceChanger.setGameStatistic();

		battleField.coins = 0;

		options.saveGame("savedHero", hero, 90);

		animations.levelFinished();
	}
}

/* ========================================== Task constructor ==========================================*/

class Task {
	constructor(level) {
		let parts, str, result, fakes, allResults;
		this.level = level;

		if (level === 1) {
			parts = [
					options.randNum(1, 9),
					Task.randOper("ease"),
					options.randNum(1, 9)
					],
			str = parts.join(" "),
			result = eval(str),
			fakes = Task.getFakes(result, "ease"),
			allResults = options.shuffle(fakes.concat(result));
			

		} else if (level === 2) {
			parts = [
					options.randNum(10, 30),
					Task.randOper("ease"),
					options.randNum(10, 30)
					],
			str = parts.join(" "),
			result = eval(str),
			fakes = Task.getFakes(result, "ease"),
			allResults = options.shuffle(fakes.concat(result));
			

		} else if (level === 3) {
			parts = [
					options.randNum(20, 50),
					Task.randOper("ease"),
					options.randNum(20, 50)
					],
			str = parts.join(" "),
			result = eval(str),
			fakes = Task.getFakes(result, "ease"),
			allResults = options.shuffle(fakes.concat(result));
			

		} else if (level === 4) {
			parts = [
					options.randNum(40, 100),
					Task.randOper("ease"),
					options.randNum(40, 100)
					],
			str = parts.join(" "),
			result = eval(str),
			fakes = Task.getFakes(result, "normal"),
			allResults = options.shuffle(fakes.concat(result));
			

		} else if (level === 5) {
			parts = [
					options.randNum(20, 50),
					Task.randOper("ease"),
					options.randNum(20, 50),
					Task.randOper("ease"),
					options.randNum(20, 50)
					],
			str = parts.join(" "),
			result = eval(str),
			fakes = Task.getFakes(result, "normal"),
			allResults = options.shuffle(fakes.concat(result));
			

		} else if (level === 6) {
			parts = [
					options.randNum(30, 100),
					Task.randOper("ease"),
					options.randNum(30, 100),
					Task.randOper("ease"),
					options.randNum(30, 100)
					],
			str = parts.join(" "),
			result = eval(str),
			fakes = Task.getFakes(result, "normal"),
			allResults = options.shuffle(fakes.concat(result));
			

		} else if (level === 7) {
			parts = [
					options.randNum(50, 130),
					Task.randOper("ease"),
					options.randNum(50, 130),
					Task.randOper("ease"),
					options.randNum(50, 130)
					],
			str = parts.join(" "),
			result = eval(str),
			fakes = Task.getFakes(result, "hard"),
			allResults = options.shuffle(fakes.concat(result));
			

		} else if (level === 8) {
			parts = [
					options.randNum(80, 200),
					Task.randOper("ease"),
					options.randNum(80, 200),
					Task.randOper("ease"),
					options.randNum(80, 200)
					],
			str = parts.join(" "),
			result = eval(str),
			fakes = Task.getFakes(result, "hard"),
			allResults = options.shuffle(fakes.concat(result));

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

	static randOper(level) {
		if (level === "ease") {
			return ["+", "-"][options.randNum(1)];
		} else {
			throw new Error("Incorrect Operator's difficulty");
		}
	}

	static getRange(level) {
		let range = [];
		if (level === "ease") {
			for (let i = 0; i < 3; i++) {
				range.push( options.randNum(-3, 3, range.concat(0)) );
			}
			return range;

		} else if (level === "normal") {
			for (let i = 0; i < 4; i++) {
				range.push( options.randNum(-10, 10, range.concat(0)) );
			}
			return range;

		} else if (level === "hard") {

			for (let i = 0; i < 5; i++) {
				range.push( options.randNum(-20, 20, range.concat(0)) );
			}
			return range;
		} else {
			throw new Error("Have no range for this Level yet.");
		}
	}

	static getFakes(result, level) {
		let fakes = [],
			range = this.getRange(level);

		range.forEach((item, index, arr) => {
			fakes.push(result + item);
		});
		return fakes;
	}

}	

/* ========================================== Hero segment ==========================================*/

const hero = saves.hero || {
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
	gameComplited: false,
};

Object.defineProperties(hero, {
	isDead: {
		value: false, 
		writable: true, 
		enumerable: false, 
		configurable: true,
	},
	outroImage: {
		value: "owl_outro.png", 
		writable: true, 
		enumerable: false, 
		configurable: true,
	},
});

hero.refresh = function() {
	this.isDead = false;
	this.currentHp = this.maximumHp;
	interfaceChanger.hero.bars.change();

};

hero.add = function() {
	this.refresh();

}

hero.loseCoins = function() {
	if (this.coins === 0) return 0;

	let loss = options.persFromNum(15, this.coins);
	if (loss === 0) loss = 1;
	this.coins -= loss;

	return loss;
}


hero.killed = function() {
	this.isDead = true;
	battleField.coins = 0;
	battleField.level.end("lose");
}

/* ========================================== Enemy constructor ==========================================*/

class Enemy {
	constructor(level) {
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
			this.outroImage = "manticore_outro.png"
		} else {
			throw new Error("Incorrect Enemy's level");
		}
	}

	killed() {
		this.isDead = true;
		battleField.coins = this.coins;
		if (!Enemy.killedOnce[this.level - 1]) {
			Enemy.killedOnce[this.level - 1] = true;
			gameLevels.previews[this.level - 1].classList.remove("level_not-complited");
		}
		battleField.level.end("win");
	}

	static add(difficulty) {
		let enemy = new Enemy(difficulty);
		interfaceChanger.enemy.bars.change(enemy);
		damageSystem.enemy = enemy;
	}
}

Enemy.count = 8;

if (!hero.complitedLevels) {
	Enemy.killedOnce = [];
	for (let i = 0; i < Enemy.count; i++) {
		Enemy.killedOnce.push(false);
	}
	
	hero.complitedLevels = Enemy.killedOnce;
} else {
	Enemy.killedOnce = hero.complitedLevels;
}


/* ========================================== Damage System ==========================================*/

const damageSystem = {
	enemy: null,
	takeDamage: function(target) {

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

		
	},
};

/* ========================================== Interface Changer ==========================================*/

const interfaceChanger = {
	hero: {
		bars: {
			currentHp: gimme(".hp-bar_bind_hero .hp-bar__current"),
			textHp: gimme(".hp-bar_bind_hero .hp-bar__text"),


			change: function() {
				this.textHp.innerHTML = `${hero.currentHp}/${hero.maximumHp}`;
				this.currentHp.style.width = Math.round(hero.currentHp / hero.maximumHp * 100) + "%";
			},
		},
	},
	enemy: {
		bars: {
			currentHp: gimme(".hp-bar_bind_enemy .hp-bar__current"),
			textHp: gimme(".hp-bar_bind_enemy .hp-bar__text"),

			change: function(enemy) {
				this.textHp.innerHTML = `${enemy.currentHp}/${enemy.maximumHp}`;
				this.currentHp.style.width = Math.round(enemy.currentHp / enemy.maximumHp * 100) + "%";
			},
		},
	},

	startPosition: function() {
		this.hero.bars.textHp.innerHTML = `${hero.currentHp}/${hero.maximumHp}`;
	},

	outro: {
		container : gimme(".outro"),
		coins: gimme(".outro__coins"),
		image: gimme(".outro__image"),
		stains: gimme(".outro__stains"),

		setCoins: function(result, loss) {
			if (result === "win") {
				this.coins.innerHTML = `Coins earned: ${battleField.coins}`;
			} else if (result === "lose") {
				this.coins.innerHTML = `Coins lost: ${loss}`;
			}
		},
		setImage: function(image) {
			this.image.style.backgroundImage = `url(img/${image})`;
		},
	},
	artefacts: {
		container: controlPanel.data,
		setCoins: function() {
			this.container.innerHTML = `Coins: ${hero.coins}`;
		},
	},
	setHeroStatistic: function() {
		statistic.health.innerHTML = `Health: ${hero.maximumHp}`;
		statistic.damage.innerHTML = `Damage: ${hero.damage}`;
		statistic.timerBonus.innerHTML = `Timer bonus: ${hero.timerBonus}s`;
	},
	setGameStatistic: function() {
		let time = Math.round(hero.pureTime / 100) / 10;
		let bestRun = saves.bestRun ? (Math.round(saves.bestRun / 100) / 10) + "s" : "--";
		statistic.pureTime.innerHTML = `Pure time: ${time}s`;
		statistic.answers.innerHTML = `Answers: ${hero.answers}`;
		statistic.mistakes.innerHTML = `Mistakes: ${hero.mistakes}`;
		statistic.progress.innerHTML = `Progress: ${this.getGameProgress()}%`;
		statistic.bestRun.innerHTML = `Best run: ${bestRun}`;
	},
	getGameProgress: function() {
		let killedEnemies = Enemy.killedOnce.reduce((result, currentItem) => {
			if (currentItem === true) return result + currentItem;
			else return result;
		}, 0);
		let progress = Math.round(killedEnemies / Enemy.killedOnce.length * 100);
	
		return progress;


	},
	showStartData: function() {
		this.artefacts.setCoins();
		this.setHeroStatistic();
		this.setGameStatistic();
	},
};


/* ========================================== Animations ==========================================*/

const animations = {
	levelFinished: function() {
		this.hideBattleField()
		.then(this.showOutro)
		.then(this.hideOutro)
		.then(this.showOverlay)
		.then(this.showMainMenu)
		.then(this.showControlPanel)
		.then(this.showGameLevels);
	},
	toMainMenu: function() {
		

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


	toLog: function() {
		mainMenu.location = "log";
		this.hideStatisticWrapper();
		this.showLog();
	},
	toGameLevels: function() {
		mainMenu.location = "levels";
		this.hideLinks().then(this.showGameLevels).then(this.showControlPanel);
	},
	toArtefacts: function() {
		mainMenu.location = "artefacts";
		this.hideLinks().then(this.showArtefacts).then(this.showControlPanel);
	},
	toStatistic: function() {
		mainMenu.location = "statistic";
		this.hideLinks().then(this.showStatistic).then(this.showControlPanel);
	},
	toTutorial: function() {
		mainMenu.location = "tutorial";
		this.hideLinks().then(this.showTutorial);
	},


	hideTutorial: function() {
		tutorial.pages[tutorial.currentPage].classList.add("page_hidden_zoom");
		tutorial.container.style.visibility = "hidden";
		tutorial.container.style.opacity = "0";

		return new Promise((resolve)=>{
			setTimeout(()=>{
				resolve();
			}, 500);
		});
	},
	showTutorial: function() {
		tutorial.refresh();
		tutorial.container.style.visibility = "visible";
		tutorial.container.style.opacity = "1";
	},
	hideLog: function() {
		statistic.log.wrapper.style.transform = "";
	},
	showLog: function() {
		statistic.log.wrapper.style.transform = "translateX(0)";
	},
	hideStatisticWrapper: function() {
		statistic.wrapper.style.transform = "translateX(-100%)";
	},
	showStatisticWrapper: function() {
		statistic.wrapper.style.transform = "";
	},
	
	showStatistic: function() {
		statistic.container.style.visibility = "visible";
		statistic.container.style.opacity = "1";
	},
	hideStatistic: function() {
		statistic.container.style.visibility = "hidden";
		statistic.container.style.opacity = "0";

		return new Promise((resolve)=>{
			setTimeout(()=>{
				resolve();
			}, 500);
		});
	},
	showArtefacts: function() {
		artefacts.container.style.visibility = "visible";
		artefacts.container.style.opacity = "1";


		let time = 0,
			items = Array.prototype.slice.call(gimme(".artefact", "all"));

		items.forEach(item => {
			setTimeout(()=>{
				item.style.transform = "translate(0, 0)";
				item.style.opacity = "1";
			}, time += 80);
		});
	},
	hideArtefacts: function() {
		artefacts.container.style.visibility = "hidden";
		artefacts.container.style.opacity = "0";

		let time = 0,
			items = Array.prototype.slice.call(gimme(".artefact", "all")).reverse();

		items.forEach(item => {
			setTimeout(()=>{
				item.style.transform = "translate(100%, 100%)";
				item.style.opacity = "0";
			}, time += 80);
		});

		return new Promise((resolve)=>{
			setTimeout(()=>{
				resolve();
			}, 500);
		});
	},
	showLinks: function() {
		mainMenu.links.container.style.opacity = "1";
		mainMenu.links.container.style.visibility = "visible";

		mainMenu.links.clickable = true;

		let time = 150,
			items = Array.prototype.slice.call(mainMenu.links.container.children),
			final = 150 * items.length;

		items.forEach(item => {
			setTimeout(()=>{
				item.style.transform = "";
			}, time += 150);
		});
	},
	hideLinks: function() {
		let time = -150,
			items = Array.prototype.slice.call(mainMenu.links.container.children),
			final = 150 * items.length;

		mainMenu.links.clickable = false;
		
		this.showOverlay();
		
		items.forEach(item => {
			setTimeout(()=>{
				item.style.transform = "rotateY(90deg)";
			}, time += 150);
		});

		return new Promise((resolve)=>{
			setTimeout(()=>{
				mainMenu.links.container.style.opacity = "0";
				mainMenu.links.container.style.visibility = "hidden";
				resolve();
			}, final);
		});
	},
	showGameLevels: function() {
		gameLevels.container.style.visibility = "visible";
		gameLevels.container.style.opacity = "1";

		gameLevels.previewsClickable = true;

		let time = 0,
			items = Array.prototype.slice.call(gameLevels.container.children).reverse();

		items.forEach(item => {
			setTimeout(()=>{
				item.style.transform = "translateX(0)";
				item.style.opacity = "1";
			}, time += 60);
		});

	},
	hideGameLevels: function() {

		gameLevels.previewsClickable = false;

		let time = 0,
			items = Array.prototype.slice.call(gameLevels.container.children);

	

		items.forEach(item => {
			setTimeout(()=>{
				item.style.transform = "translateX(-100%)";
				item.style.opacity = "0";
			}, time += 60);
		});
		
		return new Promise((resolve)=>{
			setTimeout(()=>{
				gameLevels.container.style.visibility = "hidden";
				gameLevels.container.style.opacity = "0";
				resolve();
			}, 60 * items.length);
		});
	},
	showControlPanel: function() {
		controlPanel.container.style.transform = "translateX(0)";
	},
	hideControlPanel: function() {
		controlPanel.container.style.transform = "";
	},
	showOverlay: function() {
		mainMenu.overlay.style.visibility = "visible";
		mainMenu.overlay.style.opacity = "1";
	},
	hideOverlay: function() {
		mainMenu.overlay.style.visibility = "hidden";
		mainMenu.overlay.style.opacity = "0";
	},
	toBattleField: function() {
		this.hideControlPanel();
		return this.hideGameLevels().then(this.hideMainMenu).then(this.showBattleField);
	},
	showBattleField: function() {
		battleField.container.style.visibility = "visible";
		battleField.container.style.opacity = "1";
	},
	hideBattleField: function() {
		battleField.container.style.visibility = "hidden";
		battleField.container.style.opacity = "0";
		return new Promise((resolve)=>{
			setTimeout(()=>{
				resolve();
			}, 2000);
		});
	},
	showMainMenu: function() {
		mainMenu.container.style.visibility = "visible";
		mainMenu.container.style.opacity = "1";
	},
	hideMainMenu: function() {
		mainMenu.container.style.visibility = "hidden";
		mainMenu.container.style.opacity = "0";
		return new Promise((resolve)=>{
			setTimeout(()=>{
				resolve();
			}, 1500);
		});
	},
	showOutro: function() {
		interfaceChanger.outro.container.style.visibility = "visible";
		interfaceChanger.outro.container.style.opacity = "1";
		interfaceChanger.outro.image.style.transform = "translateX(15%)";
		interfaceChanger.outro.stains.style.transform = "translateX(5%)";
		animations.stainGenerator(12, interfaceChanger.outro.stains);
		return new Promise((resolve)=>{
			setTimeout(()=>{
				resolve();
			}, 3000);
		});
	},
	hideOutro: function() {
		interfaceChanger.outro.container.style.visibility = "hidden";
		interfaceChanger.outro.container.style.opacity = "0";
		return new Promise((resolve)=>{
			setTimeout(()=>{
				interfaceChanger.outro.image.style.transform = "translateX(-5%)";
				interfaceChanger.outro.stains.style.transform = "translateX(-5%)";
				resolve();
			}, 1000);
		});
	},
	liveSpheres: function() {
		let spheres = gimme(".sphere", "all");


		spheres.forEach((item)=>{
			setInterval(()=>{
				let x = options.randNum(-50, 50),
				y = options.randNum(-50, 50);
				item.style.transform = `translate(${x}%, ${y}%)`;
			}, options.randNum(1200, 1800));
		});
		
	},
	stainGenerator: function(amount, container) {
		container.innerHTML = "";
		let biggerSize = container.offsetWidth >= container.offsetHeight ? container.offsetWidth : container.offsetHeight,
			stainSize = options.persFromNum(15, biggerSize),
			stainBigest = options.persFromNum(130, stainSize),
			stainLeast = options.persFromNum(70, stainSize),
			stains = [];

		for (let i = 0; i < amount; i++) {
			let rotation = options.randNum(0, 360),
				randSize = options.randNum(stainLeast, stainBigest),
				x = options.randNum(0, container.offsetWidth - randSize),
				y = options.randNum(0, container.offsetHeight - randSize);


			let div = document.createElement("div");
			div.classList.add("outro__stain");
			div.style.width = randSize + "px";
			div.style.height = randSize + "px";
			div.style.transform = `rotate(${rotation}deg)`;
			div.style.top = y + "px";
			div.style.left = x + "px";

			container.appendChild(div);
			stains.push(div);
		}
		return stains;
	},
	woundFlesh: function() {
		battleField.woundScreen.style.visibility = "visible";
		battleField.woundScreen.style.opacity = "1";
		setTimeout(()=>{
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

gimme(".test-button").addEventListener("click", ()=>{
	
});