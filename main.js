const MAX_ENEMY = 5;
let HEIGHT_ELEM = 100;
if (innerWidth <= 768) {
	HEIGHT_ELEM = 80;
}

const start = document.querySelector('.start');
const game = document.querySelector('.game');
const gameArea = document.querySelector('.gameArena');
// const score = document.querySelector('.score');
const startButtons = document.querySelectorAll('.btn');
const music = new Audio('audio.mp3');

const car = document.createElement('div');
car.classList.add('car');
const ball = document.createElement('div');
ball.classList.add('football__ball');
ball.classList.add('rotating');
car.append(ball);
const coveredBall = document.createElement('div');
coveredBall.classList.add('football__cover');
car.append(coveredBall);

document.body.style.height = window.innerHeight;
// document.body.addEventListener("touchstart", function (e) {
//   e.preventDefault();
// });
// document.body.addEventListener("touchmove", function (e) {
//   e.preventDefault();
// });

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);
gameArea.addEventListener('touchstart', TouchStart); //Начало касания
gameArea.addEventListener('touchmove', TouchMove); //Движение пальцем по экрану
//Пользователь отпустил экран
gameArea.addEventListener('touchend', TouchEnd);
//Отмена касания

const keys = {
	ArrowUp: false,
	ArrowDown: false,
	ArrowRight: false,
	ArrowLeft: false,
};

const mobileKeys = {
	up: false,
	down: false,
	right: false,
	left: false,
};

let distance = null;
let offsetY = null;
let offsetX = null;

const settings = {
	start: false,
	score: 0,
	speed: 3,
	traffic: 3,
	record: localStorage.getItem('best-record'),
};

let startSpeed = 0;

function changeLevel(lvl) {
	switch (lvl) {
		case '1':
			settings.traffic = 5;
			settings.speed = 3;
			break;
		case '2':
			settings.traffic = 4;
			settings.speed = 4;
			break;
		case '3':
			settings.traffic = 4;
			settings.speed = 5;
			break;
	}
	startSpeed = settings.speed;
}

function getQuantityElements(heightElement) {
	return gameArea.offsetHeight / heightElement + 1;
}

function getRandomEnemy(max) {
	return Math.floor(Math.random() * max + 1);
}

function startGame(e) {
	const target = e.target;

	if (!target.classList.contains('btn')) return;

	const levelGame = target.dataset.levelGame;

	changeLevel(levelGame);

	music.play();
	music.volume = 0.1;

	gameArea.style.minHeight =
		Math.floor(
			(document.documentElement.clientHeight - HEIGHT_ELEM) / HEIGHT_ELEM,
		) * HEIGHT_ELEM;

	startButtons.forEach((btn) => (btn.disabled = true));
	gameArea.innerHTML = `<div class="left__line"></div>
				<div class="right__line"></div>
				<div class="circle">
					<div class="center"></div>
				</div>
				<div class="finish__pitch">
					<div class="football__gate"></div>
				</div>
				`;
	// for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i += 1) {
	// 	const line = document.createElement('div');
	// 	line.classList.add('line');
	// 	line.y = i * HEIGHT_ELEM;
	// 	line.style.top = line.y + 'px';
	// 	line.style.height = HEIGHT_ELEM / 2 + 'px';
	// 	gameArea.append(line);
	// }

	const footballGate = document.querySelector('.finish__pitch');
	for (
		let i = 0;
		// i < getQuantityElements(HEIGHT_ELEM * settings.traffic) + 1;
		i < MAX_ENEMY;
		i += 1
	) {
		const enemy = document.createElement('div');
		enemy.classList.add('enemy');

		enemy.y = (-HEIGHT_ELEM + 20) * settings.traffic * (i + 1);
		enemy.style.left =
			Math.floor(Math.random() * (gameArea.offsetWidth - 70)) + 'px';
		enemy.style.top = enemy.y + 'px';
		if (i === MAX_ENEMY - 1) {
			footballGate.style.top = `${enemy.y - 400}px`;
		}
		enemy.style.background = `transparent url(./image/Mbappe1-removebg-preview.png) center / cover no-repeat`;
		gameArea.append(enemy);
	}

	// settings.score = 0;
	settings.start = true;
	gameArea.append(car);
	let carLeftSettings = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
	car.style.left = carLeftSettings + 'px';
	car.style.top = 'auto';
	if (innerWidth <= 768) {
		car.style.bottom = '50px';
	} else {
		car.style.bottom = '10px';
	}
	settings.x = car.offsetLeft;
	settings.y = car.offsetTop;
	requestAnimationFrame(playGame);
}

function playGame() {
	if (settings.start) {
		// settings.score += settings.speed;
		// score.innerHTML = `<p>SCORE: ${settings.score}</p>
		// ${settings.record ? `<p>Best record: ${settings.record}</p>` : ''}`;

		settings.speed = startSpeed + Math.floor(settings.score / 5000);

		moveRoad();
		moveEnemy();
		moveCarInMobile();
		if (keys.ArrowLeft && settings.x > 0) {
			settings.x -= settings.speed;
		}
		offsetX = gameArea.offsetWidth - car.offsetWidth;
		if (keys.ArrowRight && settings.x < offsetX) {
			settings.x += settings.speed;
		}

		if (keys.ArrowUp && settings.y > 0) {
			settings.y -= settings.speed;
		}
		offsetY = gameArea.offsetHeight - car.offsetHeight;
		if (keys.ArrowDown && settings.y < offsetY) {
			settings.y += settings.speed;
		}

		car.style.left = settings.x + 'px';
		car.style.top = settings.y + 'px';
		ball.style.top = `${Math.ceil(car.getBoundingClientRect().bottom - 70)}px`;
		ball.style.left = `${Math.ceil(car.getBoundingClientRect().right - 40)}px`;
		requestAnimationFrame(playGame);
	}
}

function startRun(e) {
	if (keys.hasOwnProperty(e.key)) {
		e.preventDefault();
		keys[e.key] = true;
	}
}

function stopRun(e) {
	if (keys.hasOwnProperty(e.key)) {
		e.preventDefault();
		keys[e.key] = false;
	}
}

function moveRoad() {
	// let lines = document.querySelectorAll('.line');
	// lines.forEach((line) => {
	// 	line.y += settings.speed;
	// 	line.style.top = line.y + 'px';

	// 	if (line.y > gameArea.offsetHeight) {
	// 		line.y = -HEIGHT_ELEM;
	// 	}
	// });
	let circle = document.querySelector('.circle');
	if (!circle.classList.contains('visible')) {
		circle.classList.add('visible');
	}
	circle.style.top = `${circle.offsetTop + settings.speed / 2}px`;
}

function moveEnemy() {
	let enemy = document.querySelectorAll('.enemy');
	enemy.forEach((item) => {
		let carRect = car.getBoundingClientRect();
		let enemyRect = item.getBoundingClientRect();

		if (
			carRect.top <= enemyRect.bottom &&
			carRect.right >= enemyRect.left &&
			carRect.left <= enemyRect.right &&
			carRect.bottom >= enemyRect.top
		) {
			settings.start = false;
			music.pause();
			TouchEnd();
			if (settings.score > settings.record) {
				localStorage.setItem('best-record', settings.score);
				alert(
					`Ура, новый рекорд! Вы набрали на ${
						settings.score - settings.record
					} очков больше!`,
				);
				settings.record = settings.score;
			}
			startButtons.forEach((btn) => (btn.disabled = false));
			alert(`Увы, мяч в Месси был отобран...`);
		}

		item.y += settings.speed / 2;
		item.style.top = item.y + 'px';
		// if (item.y >= gameArea.offsetHeight) {
		// 	item.y = -HEIGHT_ELEM * settings.traffic;
		// 	item.style.left =
		// 		Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
		// }
	});
	let gate = document.querySelector('.finish__pitch');
	let gateTarget = document.querySelector('.football__gate');
	let styleTop = gate.offsetTop + settings.speed / 2;
	gate.style.top = `${styleTop}px`;

	if (styleTop >= gameArea.offsetHeight / 8) {
		let leftToTheTarget = Math.ceil(
			gateTarget.getBoundingClientRect().left +
				gateTarget.getBoundingClientRect().width / 2,
		);
		let rightToTheTarget = Math.ceil(
			gateTarget.getBoundingClientRect().top +
				gateTarget.getBoundingClientRect().height / 2,
		);
		settings.start = false;
		music.pause();
		scoreGoal(leftToTheTarget, rightToTheTarget);
	}
}

function scoreGoal(left, top) {
	anime({
		targets: '.gameArena .football__ball',
		left: `${left}px`,
		top: `${top}px`,
		easing: 'easeInOutQuad',
		duration: 750,
	});
	ball.classList.remove('rotating');
	setTimeout(() => {
		startButtons.forEach((btn) => (btn.disabled = false));
		alert(`Ура, Вы победили и забили гол!`);
	}, 1000);
}

// MOBILE

let touchStart = null;
let touchPosition = null;

function TouchStart(e) {
	// e.preventDefault();
	//Получаем текущую позицию касания;
	touchStart = {
		x: e.changedTouches[0].clientX,
		y: e.changedTouches[0].clientY,
	};
	touchPosition = { x: touchStart.x, y: touchStart.y };
}

function TouchMove(e) {
	// e.preventDefault();
	//Получаем новую позицию
	touchPosition = {
		x: e.changedTouches[0].clientX,
		y: e.changedTouches[0].clientY,
	};
	CheckAction(); //Определяем, какой жест совершил пользователь
}

function TouchEnd() {
	//Очищаем позиции
	if (settings.start) {
		touchStart = {
			x: touchPosition.x,
			y: touchPosition.y,
		};
	}
	touchPosition = null;
	distance = null;

	mobileKeys.left = false;
	mobileKeys.right = false;
	mobileKeys.up = false;
	mobileKeys.down = false;
}

function CheckAction() {
	if (settings.start) {
		distance = {
			x: touchStart.x - touchPosition.x,
			y: touchStart.y - touchPosition.y,
		};

		if (Math.floor(distance.x < 0) && Math.floor(distance.y < 0)) {
			mobileKeys.left = false;
			mobileKeys.right = true;
			mobileKeys.up = false;
			mobileKeys.down = true;
		} else if (Math.floor(distance.x < 0) && Math.floor(distance.y > 0)) {
			mobileKeys.left = false;
			mobileKeys.right = true;
			mobileKeys.up = true;
			mobileKeys.down = false;
		} else if (Math.floor(distance.x > 0) && Math.floor(distance.y > 0)) {
			mobileKeys.left = true;
			mobileKeys.right = false;
			mobileKeys.up = true;
			mobileKeys.down = false;
		} else if (Math.floor(distance.x > 0) && Math.floor(distance.y < 0)) {
			mobileKeys.left = true;
			mobileKeys.right = false;
			mobileKeys.up = false;
			mobileKeys.down = true;
		} else if (Math.floor(distance.x < 0) && Math.floor(distance.y === 0)) {
			mobileKeys.left = false;
			mobileKeys.right = true;
			mobileKeys.up = false;
			mobileKeys.down = false;
		} else if (Math.floor(distance.x > 0) && Math.floor(distance.y === 0)) {
			mobileKeys.left = true;
			mobileKeys.right = false;
			mobileKeys.up = false;
			mobileKeys.down = false;
		} else if (Math.floor(distance.y < 0) && Math.floor(distance.x === 0)) {
			mobileKeys.up = false;
			mobileKeys.down = true;
			mobileKeys.left = false;
			mobileKeys.right = false;
		} else if (Math.floor(distance.y > 0) && Math.floor(distance.x === 0)) {
			mobileKeys.up = true;
			mobileKeys.down = false;
			mobileKeys.left = false;
			mobileKeys.right = false;
		}
	}
}

function moveCarInMobile() {
	if (mobileKeys.left && settings.x > 0) {
		settings.x -= Math.abs(distance.x / 15);
	}
	offsetX = gameArea.offsetWidth - car.offsetWidth;
	if (mobileKeys.right && settings.x < offsetX) {
		settings.x += Math.abs(distance.x / 15);
	}

	if (mobileKeys.up && settings.y > 0) {
		settings.y -= Math.abs(distance.y / 15);
	}
	offsetY = gameArea.offsetHeight - car.offsetHeight;
	if (mobileKeys.down && settings.y < offsetY) {
		settings.y += Math.abs(distance.y / 15);
	}
}
