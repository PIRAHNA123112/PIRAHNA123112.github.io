let health = document.getElementById('health');
let arm = document.getElementById('arm');
let cash = document.getElementById('cash');

cef.emit("game:hud:setComponentVisible", "interface", false);

cef.emit("game:data:pollPlayerStats", true, 50);


cef.on("game:data:playerStats", (hp, max_hp, arm, breath, wanted, weapon, ammo, max_ammo, money, speed) => {
    health.value = hp;
    arm.value = arm;
    cash.innerHTML = divideNumberByPieces(money, ".");

    function divideNumberByPieces(x, delimiter) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, delimiter || " ");
    }
});
