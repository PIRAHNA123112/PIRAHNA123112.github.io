
cef.emit("game:hud:setComponentVisible", "interface", false);
cef.emit("game:hud:setComponentVisible", "radar", true);

cef.emit("game:data:pollPlayerStats", true, 50);

cef.on("data:hud:eat", (eat) => {
    document.getElementById('e').value = eat;
})

cef.on("data:hud:hp", (hp) => {
    document.getElementById('h').value = hp;
})

cef.on("data:hud:arm", (arm) => {
    document.getElementById('a').value = arm;
})

cef.on("data:hud:mon", (mon) => {
    document.getElementById('m').textContent = mon + "₽";
})

cef.on("data:hud:wanted", (w) => {
    SetWantedLevel(w);
})

cef.on("game:data:playerStats", (hp, max_hp, arm, breath, wanted, weapon, ammo, max_ammo, money, speed) => { 

    //оружия
    document.getElementById('ammo').src = "./img/weapons/" + weapon +".png";
    document.getElementById('weapon').textContent = ammo;
    document.getElementById('max-weapon').textContent = max_ammo;

    //хп 
    document.getElementById('h').value = hp;

    //броник
    document.getElementById('a').value = arm;

    //деньга
    document.getElementById('m').textContent = money + "₽";

    //уровень розыска
    SetWantedLevel(wanted);

} );

function SetWantedLevel(v)
{
    for( let i = 0; i < v; i++)
    {
        let w = document.getElementById('w' + i);
        w.style.display = "block";
    }

}