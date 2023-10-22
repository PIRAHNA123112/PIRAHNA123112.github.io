let health = document.getElementById('health');
let armour = document.getElementById('armour');
let moneys = document.getElementById('money');
let wanteds = document.getElementById('wanted');
let guns = document.getElementById('gunid');
let ammos = document.getElementById('ammo');
let backs = document.getElementById('backid');

cef.emit("game:hud:setComponentVisible", "interface", false);
cef.on("background:id", (back) => {
	backs.src = "../hud/image/background/" + back + ".png";
});

cef.on("game:hud:newVisibleState", (success) => {
	cef.hide(!success);
});

cef.emit("game:data:pollPlayerStats", true, 50);
cef.on("game:data:playerStats", (hp, max_hp, arm, breath, wanted, weapon, ammo, max_ammo, money, speed) => {
	health.value = hp;
	armour.value = arm;
	moneys.innerHTML = money;
	
	guns.src = "../hud/image/guns/" + weapon + ".png";
	
	if(wanted > 10) return;
	else wanteds.src = "../hud/image/wanted/wanted-" + wanted + ".png";
	
	if(weapon == 0)	ammos.innerHTML = "";
	else ammos.innerHTML = ammo + "/" + max_ammo;
});