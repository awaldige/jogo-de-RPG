let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const weapons = [
  { name: 'stick', power: 5 },
  { name: 'dagger', power: 30 },
  { name: 'claw hammer', power: 50 },
  { name: 'sword', power: 100 }
];

const monsters = [
  { name: "slime", level: 2, health: 15 },
  { name: "fanged beast", level: 8, health: 60 },
  { name: "dragon", level: 20, health: 300 }
];

const locations = [
  {
    name: "town square",
    "button text": ["Ir para a Loja", "Ir para a Caverna", "Lutar com Dragão"],
    "button functions": [goStore, goCave, fightDragon],
    text: "Você está na praça da cidade. Você vê uma placa que diz \"Loja\"."
  },
  {
    name: "store",
    "button text": ["Comprar 10 vida (10 gold)", "Comprar arma (30 gold)", "Voltar para a cidade"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "Você entrou na loja."
  },
  {
    name: "cave",
    "button text": ["Lutar com Slime", "Lutar com Besta", "Voltar para a cidade"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Você entrou na caverna. Você vê monstros!"
  },
  {
    name: "fight",
    "button text": ["Atacar", "Esquivar", "Fugir"],
    "button functions": [attack, dodge, goTown],
    text: "Você está lutando com um monstro."
  },
  {
    name: "kill monster",
    "button text": ["Voltar para cidade", "Voltar para cidade", "Voltar para cidade"],
    "button functions": [goTown, goTown, easterEgg],
    text: 'O monstro grita "Arg!" e morre. Você ganha XP e ouro.'
  },
  {
    name: "lose",
    "button text": ["REJOGAR?", "REJOGAR?", "REJOGAR?"],
    "button functions": [restart, restart, restart],
    text: "Você morreu. &#x2620;"
  },
  { 
    name: "win", 
    "button text": ["REJOGAR?", "REJOGAR?", "REJOGAR?"], 
    "button functions": [restart, restart, restart], 
    text: "Você derrotou o dragão! VOCÊ VENCEU O JOGO! &#x1F389;" 
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Voltar para cidade?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "Você achou um jogo secreto. Escolha um número acima. Dez números serão sorteados de 0 a 10. Se seu número estiver lá, você ganha!"
  }
];

// Inicializar botões
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTown() { update(locations[0]); }
function goStore() { update(locations[1]); }
function goCave() { update(locations[2]); }

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "Você não tem ouro suficiente.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "Agora você tem uma " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " Inventário: " + inventory;
    } else {
      text.innerText = "Ouro insuficiente para arma.";
    }
  } else {
    text.innerText = "Você já tem a melhor arma!";
    button2.innerText = "Vender arma por 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let soldWeapon = inventory.shift();
    text.innerText = "Você vendeu uma " + soldWeapon + ".";
    text.innerText += " Inventário: " + inventory;
  } else {
    text.innerText = "Não venda sua única arma!";
  }
}

function fightSlime() { fighting = 0; goFight(); }
function fightBeast() { fighting = 1; goFight(); }
function fightDragon() { fighting = 2; goFight(); }

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "O " + monsters[fighting].name + " ataca.";
  text.innerText += " Você ataca com seu " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " Você errou.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Sua " + inventory.pop() + " quebrou.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  return hit > 0 ? hit : 0;
}

function isMonsterHit() { return Math.random() > .2 || health < 20; }
function dodge() { text.innerText = "Você se esquivou do ataque de " + monsters[fighting].name; }

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() { update(locations[5]); }
function winGame() { update(locations[6]); }

function restart() {
  xp = 0; health = 100; gold = 50; currentWeapon = 0; inventory = ["stick"];
  goldText.innerText = gold; healthText.innerText = health; xpText.innerText = xp;
  goTown();
}

function easterEgg() { update(locations[7]); }

function pickTwo() { pick(2); }
function pickEight() { pick(8); }

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "Você escolheu " + guess + ". Números sorteados:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Acertou! Ganhou 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Errou! Perdeu 10 de vida!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) lose();
  }
}
