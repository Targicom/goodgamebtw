var List = [];
var WaitTime = 150;

// Use this for text
function customizeText(text, color)
{
    var result = text.bold();
    if (color != "")
        result = text.fontcolor(color);

    return result;
}

// ALL Cards/Tactics
// Terra [0,14]
var GSlam =
{
    name: "Ground Slam",
    description: customizeText("ON USE: ", "darkred") + "Damages the enemy by smashing the ground, resulting in 5 damage. If your armor is more or equal to 1, then deal " + customizeText("double damage", "darkred") + " and grant yourself the " + customizeText("Overgrown", "green") + " for 2 turns.",
    TYPE: customizeText("Terra", "sandybrown"),
    BGColor: "sandybrown",
    power: 0,
    spellpower: 5,
    Defensive: false,
    movePriority: 0,
    essenceRequired: 0,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "", 
    locked: false,
    OnUse: function (me, opp, sp)
    {
        if (me.armor >= 1)
            return [function () { me.ChangeStatus(me,3,"overgrown") }]
    },
    OnEffect: function (me,opp) { return; },
    OnAfterAttack: function (me, opp, mod) { return },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp)
    {
        let dmg = this.spellpower;
        if (me.armor >= 1)
            dmg *= 2;

        return dmg;
    }
}
var SolidRock =
{
    name: "Solid Rock",
    description: customizeText("ON USE: ", "darkred") + "Grants spiky rock armor to it's user. Armor +1. Also,if you take damage from a non-spell card, repel 40% of the damage taken",
    TYPE: customizeText("Terra", "sandybrown"),
    BGColor: "sandybrown",
    power: 0,
    spellpower: 0,
    Defensive: true,
    movePriority: 1,
    essenceRequired: 1,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "armor",
    potentiallyAggresive: false,
    locked: false,
    ShouldUse: function (me, opp)
    {
        if (me.armor < me.maxarmor)
            return true;
        else
            return false;
    },
    OnUse: function (me, opp,sp)
    {
        return [function () { me.AffectStat(this, "armor", 1) }];
    },
    OnEffect: function (me,opp) { return; },
    OnAfterAttack: function (me, opp, mod) { return },
    OnAfterTakeDmg: function (me, opp,mod)
    {
        var Repel = Math.floor(mod * .40);
        return [function () { me.DealSpellDamage(Repel, opp, me.name + "'s spiky armor hurt the opponent!")}]
    },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp) { return}
}
var NatureMadness =
{
    name: "Nature's Madness",
    description: customizeText("ON USE ", "darkred") + "+" + customizeText(" COUNTDOWN", "lightblue") + " : Nature claims your opponents life in 7 turns. Takes up the active spell slot.",
    TYPE: customizeText("Terra", "sandybrown"),
    BGColor: "green",
    power: 0,
    spellpower: 0,
    Defensive: false,
    movePriority: 0,
    essenceRequired: 3,
    OGcountdownSize: 8,
    countdownSize: 8,
    healing: false,
    takesSlot: true,
    ClearSlot: false,
    status: "none",
    buffs: "",
    locked: false,
    potentiallyAggresive: true,
    OnUse: function (me, opp, sp)
    {
        // If there isn't any spell active
        if (sp == null)
        {
            this.countdownSize = this.OGcountdownSize;
            return true;
        }
        else
            return false;
    },
    OnEffect: function (me,opp) { return; },
    OnAfterAttack: function (me, opp, mod) { return },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp)
    {
        if (this.countdownSize > 0)
            return [this.name + " has " + this.countdownSize + " turns till it takes effect!"];
        else
            return [function () { me.DealSpellDamage(opp.hp, opp, opp.name + " has been engulfed in the nature's wrath! ")}]
    },
    SpellCH: function (me, opp, sp) { return}
}
var PiercingSpear =
{
    name: "Piercing Spear",
    description: customizeText("ON ATTACK: ", "darkred") + "Forge a spear out of blue meteorite, dealing damage. If the opponent has the " + customizeText("Cleansed", "lightseagreen") + " status, " + customizeText("deal double damage and remove their status.", "darkred"),
    TYPE: customizeText("Terra", "sandybrown"),
    BGColor: "sandybrown",
    power: 2,
    spellpower: 0,
    Defensive: false,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 0,   
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "",
    locked: false,
    OnUse: function (me, opp, sp) { return;},
    OnEffect: function (me, opp)
    {
        if (opp.status == "cleansed")
            me.attackMod *= 2;
    },
    OnAfterAttack: function (me, opp, mod)
    {
        if (opp.status == "cleansed")
            return [function () { me.RemoveStatus(opp)}]
    },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp) { return }
}
var Foresting =
{
    name: "Foresting",
    description: customizeText("ON USE: ", "darkred") + "If your previously used card was of type " + customizeText("Hydro", "blue") + " then afflict " + customizeText("Overgrown", "green") + " to your opponent for 4 turns. Else, afflict for 2 turns.",
    TYPE: customizeText("Terra", "sandybrown"),
    BGColor: "green",
    power: 0,
    spellpower: 0,
    Defensive: false,
    movePriority: 0,
    essenceRequired: 1,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "overgrown",
    buffs: "",
    locked: false,
    ShouldUse: function (me, opp)
    { 
        if (opp.status == "none")
            return true;
        else
            return false;
    },
    OnUse: function (me, opp, sp)
    {
        if (me.prevUsedMove == undefined)
            return [function () { me.ChangeStatus(opp, 3, "overgrown") }]

        if (me.prevUsedMove.TYPE == "Hydro")
            return [function () { me.ChangeStatus(opp, 5, "overgrown") }]
        else
            return [function () { me.ChangeStatus(opp, 3, "overgrown") }]
        
    },
    OnEffect: function (me,opp) { return; },
    OnAfterAttack: function (me, opp, mod) { return },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp) { return }
}
var TribalStrength =
{
    name: "Tribal Strength",
    description: customizeText("ON ATTACK: ", "darkred") + "The damage output of this card is boosted depending on the amount of armor you have. If armor is 0 then the boost doesn't occur. This card also ignores all stat changes.",
    TYPE: customizeText("Terra", "sandybrown"),
    BGColor: "green",
    power: 2,
    spellpower: 0,
    Defensive: false,
    IgnoreLoweredSt: true,
    movePriority: 0,
    essenceRequired: 1,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "",
    locked: false,
    OnUse: function (me, opp, sp) { return; },
    OnEffect: function (me,opp)
    {
        if (me.armor <= 0)
            return;

        let amount = ((me.armor * 10) + 150) / 100;
        me.attackMod *= amount;
    },
    OnAfterAttack: function (me, opp, mod) { return },
    AfterAttack: function (me, opp, mod, sp) { return },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp) { return }
}
var DwarvenUnit  =
{
    name: "Dwarven Unit",
    description: "Gain assistance from a Dwarven unit, attacking your enemy. If your previous card used is the " + customizeText("Tavernkeep", "yellow") + " card, then deal 1.5 damage.",
    TYPE: customizeText("Terra", "sandybrown"),
    BGColor: "sandybrown",
    power: 2,
    spellpower: 0,
    Defensive: false,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 0,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "",
    locked: false,
    OnUse: function (me, opp, sp) { return; },
    OnEffect: function (me, opp)
    {
        if (me.prevUsedMove == undefined)
            return;

        if (me.prevUsedMove.name == "Tavernkeep")
            me.attackMod *= 1.5;
    },
    OnAfterAttack: function (me, opp,mod) { return },
    AfterAttack: function (me, opp, mod, sp) { return },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp) { return }
}
var LastStand =
{
    name: "Last Stand",
    description: customizeText("ON ATTACK: ", "darkred") + " If HP(Health Points) is less than 25% of it's max value, then this attack's power is multiplied by 2 and your opponent's armor is reduced by 1 and stat changes are ignored for this attack.",
    TYPE: customizeText("Terra", "sandybrown"),
    BGColor: "sandybrown",
    power: 2,
    spellpower: 0,
    Defensive: false,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 0,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "",
    locked: false,
    OnBeforeUse: function (me, opp, sp)
    {
        if (me.hp < Math.floor(me.maxhp * .25)) 
            this.IgnoreLoweredSt = true;
    },
    OnUse: function (me, opp, sp) { return; },
    OnEffect: function (me,opp)
    {
        if (me.hp < Math.floor(me.maxhp * .25))
            me.attackMod *= 2;
    },
    OnAfterAttack: function (me, opp, mod)
    {
        if (me.hp < Math.floor(me.maxhp * .25))
        {
            this.IgnoreLoweredSt = false;
            return [function () { opp.AffectStat(this,"armor",-1)}]
        }
    },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp) { return }
}
var HeartOfStone =
{   
    name: "Heart Of Stone",
    description: customizeText("ON USE ", "darkred") + " + " + customizeText("SELF - STATUS: ", "dodgerblue") + "Grants you a heart of stone, giving you " + customizeText("Cleansed","lightseagreen") + " status for 2 turns.",
    TYPE: customizeText("Terra", "sandybrown"),
    BGColor: "sandybrown",
    power: 0,
    spellpower: 0,
    Defensive: true,
    movePriority: 0,
    essenceRequired: 1,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "cleansed",
    buffs: "",
    potentiallyAggresive: false,
    locked: false,
    ShouldUse: function (me, opp)
    {
        if (me.status != "cleansed")
            return true;
        else
            return false;
    },
    OnUse: function (me, opp, sp)
    {
        return [function () { me.ChangeStatus(me, 3, "cleansed") }]
    },
    OnEffect: function (me,opp) { return },
    OnAfterAttack: function (me, opp, mod) { return },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp) { return}
}
var Tavernkeep =    
{
    name: "Tavernkeep",
    description: customizeText("ON AFTER ATTACK: ", "red") + " The local dwarven tavernkeep gives you a bottle of wine to smash into your opponents. Heal 40% of the total damage dealt.",
    TYPE: customizeText("Terra", "sandybrown"),
    BGColor: "sandybrown",
    power: 2,
    spellpower: 0,
    Defensive: false,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 0,
    countdownSize: 0,
    healing: true,
    takesSlot: false,
    status: "none",
    buffs: "",
    locked: false,
    OnUse: function (me, opp, sp) { return; },
    OnEffect: function (me,opp) { return },
    OnAfterAttack: function (me, opp, mod)
    {
        let healingamount = Math.floor((40 / 100) * mod);
        return [function () { me.Heal(healingamount) }];
    },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp) { return }
}
var StewOftheLocals =
{
    name: "Stew of the locals",
    description: customizeText("ON USE: ", "darkred") + " The locals of the village of Iki make a delicious stew as offering to their gods. Armor +1 && Attack +1. If you have used a card of type " + customizeText("Hydro", "blue") + " then gain the " + customizeText("Cleansed", "lightseagreen") + " status.",
    TYPE: customizeText("Terra", "sandybrown"),
    BGColor: "sandybrown",
    power: 0,
    spellpower: 0,
    Defensive: true,
    movePriority: 0,
    essenceRequired: 2,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "armor & attack",
    potentiallyAggresive: false,
    locked: false,
    ShouldUse: function (me, opp)
    {
        if (me.attack < 10 || me.armor < me.maxarmor)
            return true;
        else
            return false;
    },
    OnUse: function (me, opp, sp)
    {
        if (!me.usedHydro)
            return [function () { me.AffectStat(this, "armor", 1) }, function () { me.AffectStat(this, "attack", 1) }]
        else
            return [function () { me.AffectStat(this, "armor", 1) }, function () { me.AffectStat(this, "attack", 1) }, function () { me.ChangeStatus(me, 3, "cleansed") }]
    },
    OnEffect: function (me, opp) { return },
    OnAfterAttack: function (me, opp, mod) { return },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp) { return 2}
}
var WillEnhance =
{
    name: "Will Enhancement",
    description: customizeText("ON USE: ", "darkred") + "Through intense mental training, increase your attack stat by 1.",
    TYPE: customizeText("Terra", "sandybrown"),
    BGColor: "sandybrown",
    power: 0,
    spellpower: 0,
    Defensive: true,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 1,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "a",
    locked: false,
    ShouldUse: function (me, opp)
    {
        if (me.attack < 10)
            return true;
        else
            return false;
    },
    OnUse: function (me, opp, sp) { return [function () { me.AffectStat(this,"attack", 1) }] },
    OnEffect: function (me, opp) { return; },
    OnAfterAttack: function (me, opp, mod) { return; },
    OnAfterTakeDmg: function (me, opp) { return },
    AfterAttack: function (me, opp, mod, sp) { return },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp) { return }
}
var BerrySupply =
{
    name: "Berry Supply",
    description: customizeText("ON USE ", "darkred") + "+" + customizeText(" COUNTDOWN: ", "lightblue") + "Heal 25% of your max health at the end of the turn when 2 turns have passed. If you (have) used/(use) a card of type " + customizeText("Hydro","blue") + " in the duration of this game,then you heal 15% of your max health at the end of the turn and the countdown immediately ends. Takes up active spell slot.",
    TYPE: customizeText("Terra", "sandybrown"),
    BGColor: "green",
    power: 0,
    spellpower: 0,
    Defensive: true,
    movePriority: 0,
    essenceRequired: 3,
    OGcountdownSize: 3,
    countdownSize: 3,
    healing: true,
    takesSlot: true,
    ClearSlot: false,
    specificBoost: 1,
    status: "none",
    buffs: "",
    potentiallyAggresive: false,
    locked: false,
    OnBeforeUse: function (me, opp, sp) { if (me.usedHydro) { this.countdownSize = 0; } },
    OnUse: function (me, opp, sp)
    {
        // If there isn't any spell active
        if (sp == null)
        {
            this.countdownSize = this.OGcountdownSize;
            return true;
        }
        else
            return false;
    },
    OnEffect: function (me, opp) { return; },
    OnAfterAttack: function (me, opp, mod) { return; },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp)
    {
        var instance = me;
        let healAM = Math.floor(me.maxhp * .25 * this.specificBoost)
        if (instance.usedHydro)
        {
            healAM = Math.floor(me.maxhp * .15 * this.specificBoost);
            this.countdownSize = 0;
            return [function () { GenerateText("The harvest is faster due to a card of type Hydro being used!!", () => setTimeout(CombatLoop, WaitTime)) }, function () { instance.Heal(healAM) }]
        } 

        if (this.countdownSize > 0)
            return [this.name + " has " + this.countdownSize + " turn till it takes effect!"];
        else
        {
            this.specificBoost = 1;
            return [function () { me.Heal(healAM, me.name + " recovered HP with Berry Supply!") }]
        }
    },
    SpellCH: function (me, opp, sp)
    {
        let healAM = Math.floor(me.maxhp * .25 * this.specificBoost);
        if (me.usedHydro)
            healAM = Math.floor(me.maxhp * .15 * this.specificBoost);
         
        return healAM;
    }
}
var WeaponProduction =
{
    name: "Weapon Production",
    description: customizeText("ON USE: ", "darkred") + "The local blacksmith has started heating his forge, granting yourself "+ customizeText("Overheated", "orangered") + " for 1 turn." + ". If you have used a card of type " + customizeText("Pyro", "mediumvioletred") + " in the duration of this game,you also reduce your opponents attack by 1.",
    TYPE: customizeText("Terra", "sandybrown"),
    BGColor: "sandybrown",
    power: 1.5,
    spellpower: 0,
    Defensive: false,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 1,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "",
    WeakenStats: "",
    locked: false,
    OnBeforeUse: function (me, opp, sp) { if (me.usedPyro) { this.WeakenStats = "attack" } },
    OnUse: function (me, opp, sp)
    {
        let secondaryBoost = false;
        if (me.usedPyro)
            secondaryBoost = true;


        if (secondaryBoost)
        {
            this.WeakenStats = "";
            return [function () { me.ChangeStatus(me, 3, "overheated") }, function () { opp.AffectStat(this, "attack", -1) }];
        }
        else
            return [function () { me.ChangeStatus(me, 3, "overheated") }];
    },
    OnEffect: function (me, opp) { return },
    OnAfterAttack: function (me, opp, mod) { return; },
    AfterAttack: function (me, opp, mod, sp) { return },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp) { return}
} 
var Counter =
{
    name: "Bulk Counter",
    description: customizeText("ON AFTER TAKING DAMAGE: ", "indianred") + " If you were attacked by a non-spell card, attack back with 150% of the total damage dealt to you, but take times 1.5 damage in return.",
    TYPE: customizeText("Terra", "sandybrown"),
    BGColor: "sandybrown",
    power: 0,
    spellpower: 0,
    Defensive: true,
    movePriority: 1,
    essenceRequired: 2,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "",
    potentiallyAggresive: true,
    locked: false,
    OnUse: function (me, opp, sp)
    {
        // Take Double Damage
        opp.attackMod *= 1.5;
        return [me.name + " readies himself for an attack!"];
    },
    OnEffect: function (me, opp) { return },
    OnAfterAttack: function (me, opp, mod) { return; },
    OnAfterTakeDmg: function (me, opp,mod)
    {
        let cardName = this.name;
        let repel = Math.floor(1.5 * mod);
        return [function () { me.DealSpellDamage(repel, opp, me.name + " repelled back with " + cardName + "!") }]
    },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp) { return }
}

// Pyro [15,29]
var WildFire =
{
    name: "Wildfire",
    description: customizeText("ON USE: ", "darkred") + "Deal 8 damage to your opponent. If your enemy has the " + customizeText("Overgrown", "green") + " status" + " deal " + customizeText("double damage.","darkred"),
    TYPE: customizeText("Pyro", "mediumvioletred"),
    BGColor: "indianred",
    power: 0,
    spellpower: 6,
    Defensive: false,
    movePriority: 0,
    essenceRequired: 1,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "",
    locked: false,
    OnUse: function (me, opp, sp){ return },
    OnEffect: function (me, opp) { return },
    OnAfterAttack: function (me, opp, mod) { return; },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp)
    {
        let spow = this.spellpower;
        if (opp.status == "overgrown") 
            spow *= 2;

        return spow;
    }
}
var YFApprentice =
{
    name: "Young Pyro Apprentice",
    description: customizeText("ON USE: ", "darkred") + " Grant yourself " + customizeText("Overheated", "orangered") + " status, for 2 turns.",
    TYPE: customizeText("Pyro", "mediumvioletred"),
    BGColor: "indianred",
    power: 0,
    spellpower: 0,
    Defensive: true,
    movePriority: 0,
    essenceRequired: 1,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "overheated",
    buffs: "",
    potentiallyAggresive: false,
    locked: false,
    ShouldUse: function (me, opp)
    {
        if (me.status == "none")
            return true;
        else
            return false;
    },
    OnUse: function (me, opp, sp)
    {
        return [function () { me.ChangeStatus(me, 3, "overheated") }]
    },
    OnEffect: function (me, opp) { return },
    OnAfterAttack: function (me, opp, mod) { return; },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp) { return }
}
var Cribbling =
{
    name: "Cribbling",
    description: customizeText("ON AFTER ATTACK: ", "red") + "With the world's most horrible pun ever, reduce your opponent's attack by 1 only if their attack is higher than it's default value.",
    TYPE: customizeText("Pyro", "mediumvioletred"),
    BGColor: "indianred",
    power: 1.5,
    spellpower: 0,
    Defensive: false,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 0,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "",
    WeakenStats: "attack",
    potentiallyAggresive: false,
    locked: false,
    OnUse: function (me, opp, sp) { return },
    OnEffect: function (me, opp) { return },
    OnAfterAttack: function (me, opp, mod)
    {
        if (opp.attack > opp.ogattack)
            return [function () { opp.AffectStat(this, "attack", -1) }]
    },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) {return},
    SpellCH: function (me, opp, sp) { return }
}
var Zerfallation =
{
    name: "Zerfallation",
    description: customizeText("ON USE:", "darkred") + " If you have used a card of type " + customizeText("Pyro", "mediumvioletred") + " then, remove all stat changes from the opponent, both positive and negative. If not, lower the opponent's attack && armor by one.",
    TYPE: customizeText("Pyro", "mediumvioletred"),
    BGColor: "indianred",
    power: 0,
    spellpower: 0,
    Defensive: true,
    movePriority: 0,
    essenceRequired: 3,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "a",
    WeakenStats: "armor & attack",
    potentiallyAggresive: false,
    locked: false,
    ShouldUse: function (me, opp)
    {
        if (me.usedPyro)
        {
            if (opp.attack > opp.ogattack && opp.armor > opp.ogarmor)
                return true;
            else
                return false;
        } else
        {
            if (opp.attack > 1 || opp.armor > opp.ogarmor)
                return true;
            else
                return false;
        }
    },
    OnBeforeUse: function (me, opp, sp) { if (me.usedPyro) { this.WeakenStats = "reset" } },
    OnUse: function (me, opp, sp)
    {
        if (me.usedPyro)
        {
            this.WeakenStats = "armor & attack";
            return [function () { opp.AffectStat(this, "resetall", 0) }]
        }
        else
            return [function () { opp.AffectStat(this, "attack", -1) }, function () { opp.AffectStat(this, "armor", -1) }]
    },
    OnEffect: function (me, opp) { return },
    OnAfterAttack: function (me, opp, mod){ return },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp) { return 2}
}
var ScorchedDesert =
{
    name: "Scorching Desert",
    description: customizeText("ON USE:", "darkred") + " Set the current field to a hot,cruel and scorching desert for 3 turns. As a result, all combatants take 5 damage each turn and if any of the combatants previous move is of type " + customizeText("Hydro", "blue") + " then they take double damage.",
    TYPE: customizeText("Pyro", "mediumvioletred"),
    BGColor: "indianred",
    power: 0,
    spellpower: 0,
    Defensive: false,
    movePriority: 0,
    essenceRequired: 4,
    OGcountdownSize: 4,
    countdownSize: 4,
    healing: false,
    takesSlot: true,
    ClearSlot: false,
    status: "none",
    buffs: "",
    potentiallyAggresive: true,
    locked: false,
    OnUse: function (me, opp, sp)
    {
        // If there isn't any spell active
        if (sp == null)
        {
            this.countdownSize = this.OGcountdownSize;
            return true;
        }
        else
            return false;
    },
    OnEffect: function (me, opp) { return },
    OnAfterAttack: function (me, opp, mod) { return },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp)
    {
        if (me.prevUsedMove == undefined && opp.prevUsedMove == undefined)
            return;

        // Do effects
        if (this.countdownSize > 0)
        {
            let CasterDmg = (me.prevUsedMove == undefined || me.prevUsedMove.TYPE != "Hydro") ? 5 : 10;
            let OppDmg = (opp.prevUsedMove == undefined || opp.prevUsedMove.TYPE != "Hydro" ) ? 5 : 10;


            return [function () { me.DealSpellDamage(CasterDmg, me, me.name + " was hurt by the extreme heat!") }, function () { opp.DealSpellDamage(OppDmg, opp, opp.name + " was hurt by the extreme heat!") }]
        } else
            return [" The extreme heat has faded."]
    },
    SpellCH: function (me, opp, sp) { return }
}
var BurningOil =
{
    name: "Burning Oil",
    description: customizeText("ON ATTACK: ", "darkred") + "Apply a 400" + "o".sup() + " C blade oil to your blade, boosting your damage by a little bit (1.2 times). If your opponent's previous card is NOT of type " + customizeText("Hydro", "blue") + ", then the boost is increased (1.5 times)",
    TYPE: customizeText("Pyro", "mediumvioletred"),
    BGColor: "orangered",
    power: 1.8,
    spellpower: 0,
    Defensive: false,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 1,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "",
    potentiallyAggresive: false,
    locked: false,
    OnUse: function (me, opp, sp) { return },
    OnEffect: function (me, opp)
    {
        if (opp.prevUsedMove.TYPE != "Hydro")
            me.attackMod *= 1.5;
        else
            me.attackMod *= 1.2;
    },
    OnAfterAttack: function (me, opp, mod) { return; },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) {return},
    SpellCH: function (me, opp, sp) { return }
}
var DragonsDesperation =
{
    name: "Dragon's Desperation",
    description: customizeText("ON ATTACK: ", "red") + "If your health is at 30% or less, deal twice the original damage but also take 45% of the damage you deal in return. If you have the status of " + customizeText("Overheated", "orangered") + " then you deal 20% more damage and ignore all stat changes.",
    TYPE: customizeText("Pyro", "mediumvioletred"),
    BGColor: "indianred",
    power: 3,
    spellpower: 0,
    Defensive: false,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 4,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "",
    potentiallyAggresive: false,
    locked: false,
    OnUse: function (me, opp, sp) { return },
    OnEffect: function (me, opp)
    {
        if (me.hp <= Math.floor(me.maxhp * .3))
            me.attackMod *= 2;

        if (me.status == "overheated")
        {
            this.IgnoreLoweredSt = true;
            me.attackMod *= 1.2;
        }
    },
    OnAfterAttack: function (me, opp, mod)
    {
        if (me.hp <= Math.floor(me.maxhp * .3))
        {
            this.IgnoreLoweredSt = false;
           return [function () { me.DealSpellDamage(mod * .45, me, me.name + " is overwhelmed by his ally dragon's desperation attack!") }]
        }
    },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) {return},
    SpellCH: function (me, opp, sp) { return }
}
var RuthlessPillage =
{
    name: "Ruthless Pillaging",
    description: customizeText("ON AFTER ATTACK: ", "red") + " After a succesfull raid on a small village near Vyrjan, it is time to pillage. Randomly gain +1 attack or +1 armor or heal 10% of your max health.",
    TYPE: customizeText("Pyro", "mediumvioletred"),
    BGColor: "orangered",
    power: 2,
    spellpower: 0,
    Defensive: false,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 2,
    countdownSize: 0,
    healing: true,
    takesSlot: false,
    status: "none",
    buffs: "attack & armor",
    potentiallyAggresive: false,
    locked: false,
    OnUse: function (me, opp, sp) { return },
    OnEffect: function (me, opp) { return },
    OnAfterAttack: function (me, opp, mod)
    {
        let num = Math.floor(Math.random() * 3);
        var card = this;
        // Which buff
        switch (num)
        {
            case 0: return [function () { me.AffectStat(card, "attack", 1) }]; break;
            case 1: return [function () { me.AffectStat(card, "armor", 1) }]; break;
            case 2: return [function () { me.Heal(me.maxhp * .10, me.name + " recovered HP by pillaging!") }]; break;
        }
    },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) {return},
    SpellCH: function (me, opp, sp) { return 2}
}
var EmberWay =
{
    name: "Elegant Ember's Way",
    description: customizeText("ON BEFORE USE: ", "burlywood") + "The teachings of Master Eldsberg teach you the elegance of the Elegant Ember. As a result, the power of this card is equal to your essence, which is also consumed.",
    TYPE: customizeText("Pyro", "mediumvioletred"),
    BGColor: "indianred",
    power: 1,
    spellpower: 0,
    Defensive: false,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 1,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "",
    potentiallyAggresive: false,
    locked: false,
    OnBeforeUse: function (me, opp, sp)
    {
        if (me.essence > 1)
        {
            this.essenceRequired = me.essence;
            this.power = me.essence;
        }
          return;
    },
    OnUse: function (me, opp, sp) { return },
    OnEffect: function (me, opp) { return },
    OnAfterAttack: function (me, opp, mod) { this.power = 1; this.essenceRequired = 1; return },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp) { return }
} 
var Menace =
{
    name: "Menace",
    description: customizeText("ON USE: ", "darkred") + "Intimidate your opponent, lowering their armor and attack. If your status is of type " + customizeText("Cleansed", "lightseagreen") + " then reduce their armor by 2, but not their attack.",
    TYPE: customizeText("Pyro", "mediumvioletred"),
    BGColor: "orangered",
    power: 0,
    spellpower: 0,
    Defensive: true,
    movePriority: 0,
    essenceRequired: 2,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "a",
    WeakenStats: "armor & attack",
    potentiallyAggresive: false,
    locked: false,
    ShouldUse: function (me, opp)
    {
        if (!me.usedPyro)
        {
            if (opp.attack > 1 || opp.armor > opp.ogarmor)
                return true;
            else
                return false;
        }
        else
            if (opp.armor > opp.ogarmor)
                return true;
            else
                return false;
    },
    OnBeforeUse: function (me, opp, sp)
    {
        if (me.status != "cleansed")
            this.WeakenStats = "armor"
        else
            this.WeakenStats = "armor & attack"
    },
    OnUse: function (me, opp, sp)
    {
        if (me.status != "cleansed")
            return [function () { opp.AffectStat(this, "armor", -1) }, function () { opp.AffectStat(this, "attack", -1) }]
        else
            return [function () { opp.AffectStat(this, "armor", -2) }]
    },
    OnEffect: function (me, opp) { return },
    OnAfterAttack: function (me, opp, mod) { return; },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp) { return 2 }
}
var WickedFacade =
{
    name: "Cowardly Facade",
    description: customizeText("ON USE: ", "darkred") + "Start acting so that your opponent's get intimidated, dropping their attack by 1. However if you take 12 or more damage from a non-spell card, then their attack gets boosted by 2, ignoring the initial debuff. Also this card moves almost always first (it's priority is higher than most cards.)",
    TYPE: customizeText("Pyro", "mediumvioletred"),
    BGColor: "indianred",
    power: 0,
    spellpower: 0,
    Defensive: true,
    movePriority: .9,
    essenceRequired: 2,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "a",
    WeakenStats: "attack",
    potentiallyAggresive: false,
    locked: false,
    ShouldUse: function (me, opp)
    {
        if (opp.attack > 1)
            return true;
        else
            return false;
    },
    OnUse: function (me, opp, sp) { return [function () { opp.AffectStat(this, "attack", -1) }] },
    OnEffect: function (me, opp) { return },
    OnAfterAttack: function (me, opp, mod) { return; },
    OnAfterTakeDmg: function (me, opp,mod)
    {
        if (mod >= 12)
            return [opp.name + " discovered the act! ", function () { opp.AffectStat(this, "attack", 3) }]
    },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp) { return }
}
var Ovenmints =
{
    name: "Oven Mints",
    description: "What's the best weapon to beat the living daylights out of someone? Why, oven mints, of course! - Random Bypasser",
    TYPE: customizeText("Pyro", "mediumvioletred"),
    BGColor: "orangered",
    power: 2,
    spellpower: 0,
    Defensive: false,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 0,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "",
    potentiallyAggresive: false,
    locked: false,
    OnUse: function (me, opp, sp) { return },
    OnEffect: function (me, opp) { return },
    OnAfterAttack: function (me, opp, mod) { return },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) {return},
    SpellCH: function (me, opp, sp) { return }
}
var PheonixBless =
{
    name: "Pheonix's Blessing",
    description: customizeText("ON USE ", "darkred") + "+" + customizeText(" COUNTDOWN: ", "lightblue") + "In 3 turns, receive the Elegant Pheonix's blessing. As a result, gain 3 armor and heal 35% of your max health at the end of the countdown. If you have the status of " + customizeText("Overheated", "orangered") + " then heal 45% of your max health.",
    TYPE: customizeText("Pyro", "mediumvioletred"),
    BGColor: "orangered",
    power: 0,
    spellpower: 0,
    Defensive: true,
    movePriority: 0,
    essenceRequired: 5,
    OGcountdownSize: 4,
    countdownSize: 4,
    healing: true,
    takesSlot: true,
    ClearSlot: false,
    status: "none",
    buffs: "armor",
    potentiallyAggresive: false,
    locked: false,
    OnUse: function (me, opp, sp)
    {
        // If there isn't any spell active
        if (sp == null)
        {
            this.countdownSize = this.OGcountdownSize;
            return true;
        }
        else
            return false;
    },
    OnEffect: function (me, opp) { return },
    OnAfterAttack: function (me, opp, mod) { return },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp)
    {
        // Do effects
        if (this.countdownSize > 0)
            return [this.name + " has " + this.countdownSize + " turns till it takes effect!"]
        else
        {
            let heal = me.maxhp * .35;
            if (me.status == "overheated")
                heal = me.maxhp * .45;

            heal = Math.floor(heal);
            return ["The Elegant Pheonix's blessing is upon you!", function () { me.Heal(heal) }, function () { me.AffectStat(this,"armor",3) }] // end
        }
    },
    SpellCH: function (me, opp, sp)
    {
        if (me.status != "overheated")
            return Math.floor(me.maxhp * .45);
        else
            return Math.floor(me.maxhp * .35);
    }
}
var FireMantisArmy =
{
    name: "Fire Mantis Army",
    description: customizeText("ON ATTACK: ", "red") + "The nation's most infamous enemy. The Fire Mantis. Incredibly brutal,savage,they take advantage of the defenses that humans set up and like to group in order to fight. Using them, deal damage which is boosted by the amount of armor your opponent has.",
    TYPE: customizeText("Pyro", "mediumvioletred"),
    BGColor: "indianred",
    power: 2,
    spellpower: 0,
    Defensive: false,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 1,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "",
    potentiallyAggresive: false,
    locked: false,
    OnUse: function (me, opp, sp) { return },
    OnEffect: function (me, opp)
    {
        if (opp.armor <= 0)
            return;

        let amount = ((opp.armor * 10) + 150) / 100;
        me.attackMod *= amount;
    },
    OnAfterAttack: function (me, opp, mod) { return },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) {return},
    SpellCH: function (me, opp, sp) { return }
}
var Dragur =    
{
    name: "Fallen Champion",
    description: customizeText("ON ATTACK: ", "darkred") + "If you have taken damage this turn and your health is less or equal than 20% of your max health, then deal double damage.",
    TYPE: customizeText("Pyro", "mediumvioletred"),
    BGColor: "indianred",
    power: 4,
    spellpower: 0,
    Defensive: false,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 3,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "",
    locked: false,
    OnUse: function (me, opp, sp){ return },
    OnEffect: function (me, opp)
    {
        if (me.DMGTakenThisRound > 0 && me.hp <= Math.floor(me.maxhp * .20))
            me.attackMod *= 2;
    },
    OnAfterAttack: function (me, opp, mod) { return; },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp) { return }
}

// Hydro [30,44]
var NewDawn =
{
    name: "New Dawn",
    description: customizeText("ON USE: ", "darkred") + "The rise of a new dawn in the Valley of Skylane cleanses your soul, granting you the " + customizeText("Cleansed","lightseagreen") + " status for 2 turns && heal 5% of your max health.",
    TYPE: customizeText("Hydro", "blue"),
    BGColor: "aquamarine",
    power: 0,
    spellpower: 0,
    Defensive: true,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 1,
    countdownSize: 0,
    healing: true,
    takesSlot: false,
    status: "cleansed",
    buffs: "",
    potentiallyAggresive: false,
    locked: false,
    OnUse: function (me, opp, sp) { return [function () { me.ChangeStatus(me, 3, "cleansed") }, function () { me.Heal(Math.floor(me.maxhp * 0.05)) }] },
    OnEffect: function (me, opp) { return },
    OnAfterAttack: function (me, opp, mod) { return },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) {return},
    SpellCH: function (me, opp, sp) { return Math.floor(me.maxhp * 0.05) }
}
var MonkClarity =
{
    name: "Monk's Assistance",
    description: "Gain assistance from a monk from the Valley of Skylane.",
    TYPE: customizeText("Hydro", "blue"),
    BGColor: "aquamarine",
    power: 2,
    spellpower: 0,
    Defensive: false,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 0,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "",
    potentiallyAggresive: false,
    locked: false,
    OnUse: function (me, opp, sp) { return },
    OnEffect: function (me, opp) { return },
    OnAfterAttack: function (me, opp, mod) { return },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) {return},
    SpellCH: function (me, opp, sp) { return }
}
var SpringWaterAtt =
{
    name: "Spring Water - Attack",
    description: "The spring water of the Valley of Skylane, harms creatures of negativity, while strengthening creatures of positivity. Conveniently, your opponent seems to be negative. If your opponent's status isn't of type " + customizeText("Cleansed","lightseagreen") + " then deal 1.5 more damage.",
    TYPE: customizeText("Hydro", "blue"),
    BGColor: "aquamarine",
    power: 1.5,
    spellpower: 0,
    Defensive: false,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 1,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "",
    potentiallyAggresive: false,
    locked: false,
    OnUse: function (me, opp, sp) { return },
    OnEffect: function (me, opp)
    {
        if (opp.status != "cleansed")
            me.attackMod *= 1.5;
    },
    OnAfterAttack: function (me, opp, mod) { return },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp) { return }
}
var SpringWaterDef =
{
    name: "Spring Water - Defend",
    description: "The spring water of the Valley of Skylane, harms creatures of negativity, while strengthening creatures of positivity. If your health is more than half of your max hp, then grant yourself +1 armor, if not heal 10% health and if your status is of type " + customizeText("Cleansed","lightseagreen") + " heal 15% instead.",
    TYPE: customizeText("Hydro", "blue"),
    BGColor: "aquamarine",
    power: 0,
    spellpower: 0,
    Defensive: true,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 1,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "armor",
    potentiallyAggresive: false,
    locked: false,
    ShouldUse: function (me, opp)
    {
        if (me.hp > Math.floor(me.maxhp * .5))
        {
            if (me.armor < me.maxarmor)
                return true;
            else
                return false;
        } else
            return true;
    },
    OnBeforeUse: function (me, opp, sp)
    {
        if (me.hp <= Math.floor(me.maxhp / 2))
        {
            this.buffs = "";
            this.healing = true;
        }
        else
        {
            this.buffs = "armor";
            this.healing = false;
        }
    },
    OnUse: function (me, opp, sp)
    {
        if (me.hp > Math.floor(me.maxhp * .5))
            return [function () { me.AffectStat(this, "armor", 1) }]
        else
        {
            let Heal = (me.status == "cleansed") ? Math.floor(me.maxhp * .15) : Math.floor(me.maxhp * .1);
            return [function () { me.Heal(Heal, "The refreshing spring water healed " + me.name + "!") }]
        }
    },
    OnEffect: function (me, opp) { return },
    OnAfterAttack: function (me, opp, mod) { return },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp) { return }
}
var WaterElemental =
{
    name: "Water Elemental",
    description: customizeText("ON USE ", "darkred") + "+" + customizeText(" COUNTDOWN: ", "lightblue") + "The Valley of Skylane harbors many interesting creatures. One of the rare ones are Water Elementals. After 3 turns, if your health is more than half of your max hp, then deal damage to your opponent equal to 30% of their max health. If not, then heal 30% of your max health.",
    TYPE: customizeText("Hydro", "blue"),
    BGColor: "deepskyblue",
    power: 0,
    spellpower: 0,
    Defensive: true,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 3,
    OGcountdownSize: 4,
    countdownSize: 4,
    healing: false,
    takesSlot: true,
    ClearSlot: false,
    status: "none",
    buffs: "",
    potentiallyAggresive: false,
    locked: false,
    OnBeforeUse: function (me, opp, sp)
    {
        if (me.hp > Math.floor(me.maxhp / 2))
            this.potentiallyAggresive = true;
        else
            this.healing = true;
    },
    OnUse: function (me, opp, sp)
    {
        // If there isn't any spell active
        if (sp == null)
        {
            this.countdownSize = this.OGcountdownSize;
            return true;
        }
        else
            return false;
    },
    OnEffect: function (me, opp){ return },
    OnAfterAttack: function (me, opp, mod) { return },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp)
    {
        if (this.countdownSize > 0)
            return [this.name + " has " + this.countdownSize + " turns till it awakens!"];
        else
        {
            if (me.hp > Math.floor(me.maxhp / 2))
            {
                this.potentiallyAggresive = false;
                this.healing = false;
                return [function () { me.DealSpellDamage(Math.floor(opp.maxhp * .3), opp, "The Water Elemental assists " + me.name + " in offense!") }]
            }
            else
            {
                this.potentiallyAggresive = false;
                this.healing = false;
                return [function () { me.Heal(Math.floor(me.maxhp * .3), "The Water Elemental heals " + me.name + "!") }]
            }
        }
    },
    SpellCH: function (me, opp, sp) { return }
}
var GloryWyvern =
{
    name: "Glorious Wyvern",
    description: customizeText("ON ATTACK: ", "darkred") + "One of the three famed Wyverns of the Valley, the Glorious Wyvern is especially friendly to those whose souls are pure. If you have the status of " + customizeText("Cleansed","lightseagreen") + " this card ignores all stat changes.",
    TYPE: customizeText("Hydro", "blue"),
    BGColor: "deepskyblue",
    power: 5,
    spellpower: 0,
    Defensive: false,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 3,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "",
    potentiallyAggresive: false,
    locked: false,
    OnBeforeUse: function (me, opp, sp)
    {
        if (me.status == "cleansed")
            this.IgnoreLoweredSt = true;
    },
    OnUse: function (me, opp, sp) { return },
    OnEffect: function (me, opp) { return; },
    OnAfterAttack: function (me, opp, mod) { this.IgnoreLoweredSt = false; return; },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp) { return }
}
var ResolveWyvern =
{
    name: "Resolve Wyvern",
    description: customizeText("ON ATTACK: ", "darkred") + "One of the three famed Wyverns of the Valley, the Resolve Wyvern is respectable towards true warriors. If you have used a card of type " + customizeText("Terra","sandybrown") + " and your armor is above or equal to 2 this card's damage output is boosted by 1.4.",
    TYPE: customizeText("Hydro", "blue"),
    BGColor: "deepskyblue",
    power: 4,
    spellpower: 0,
    Defensive: false,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 3,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "",
    potentiallyAggresive: false,
    locked: false,
    OnBeforeUse: function (me, opp, sp)
    {
        if (me.usedTerra && me.armor >= 2)
            this.IgnoreLoweredSt = true;
    },
    OnUse: function (me, opp, sp) { return },
    OnEffect: function (me, opp)
    {
        if (me.usedTerra && me.armor >= 2)
            me.attackMod *= 1.4;
    },
    OnAfterAttack: function (me, opp, mod) { return },
    OnAfterTakeDmg: function (me, opp) { this.IgnoreLoweredSt = false; return; },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp) { return }
}
var CourageWyvern =
{
    name: "Courage Wyvern",
    description: customizeText("ON USE: ", "darkred") + "One of the three famed Wyverns of the Valley, the Courage Wyvern is friendly towards souls that respect one another. If you have used cards of type " + customizeText("Terra", "sandybrown") + " and " + customizeText("Pyro", "mediumvioletred") + " and " + customizeText("Hydro","blue") + " , then gain +1 attack too.",
    TYPE: customizeText("Hydro", "blue"),
    BGColor: "aquamarine",
    power: 3.5,
    spellpower: 0,
    Defensive: false,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 3,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "",
    potentiallyAggresive: false,
    locked: false,
    OnBeforeUse: function (me, opp, sp)
    {
        if (me.usedTerra && me.usedPyro && me.usedHydro)
            this.buffs = "attack";
        else
            this.buffs = ""
    },
    OnUse: function (me, opp, sp)
    {
        if (me.usedTerra && me.usedPyro && me.usedHydro)
            return [function () { me.AffectStat(this,"attack",1) }]
    },
    OnEffect: function (me, opp) { return },
    OnAfterAttack: function (me, opp, mod) { return },
    OnAfterTakeDmg: function (me, opp) { this.IgnoreLoweredSt = false; return; },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp) { return }
}
var Reflect =
{
    name: "Crystal Reflection",
    description: customizeText("ON USE: ", "darkred") + "Turn the battlefield into an illusion representing the Crystal Cave, where people's attitudes become the exact opposite. Meaning that the user's speed is swapped with the opponent's for 4 turns, every turn.Which means one turn, X will be faster and on the next one Y will be faster and so it repeats.",
    TYPE: customizeText("Hydro", "blue"),
    BGColor: "deepskyblue",
    power: 0,
    spellpower: 0,
    Defensive: true,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 4,
    OGcountdownSize: 5,
    countdownSize: 5,
    healing: false,
    takesSlot: true,
    status: "none",
    buffs: "",
    potentiallyAggresive: true,
    locked: false,
    ShouldUse: function (me, opp) { return },
    OnUse: function (me, opp, sp)
    {
        // If there isn't any spell active
        if (sp == null)
        {
            this.countdownSize = this.OGcountdownSize;
            return true;
        }
        else
            return false;
    },
    OnEffect: function (me, opp) { return },
    OnAfterAttack: function (me, opp, mod) { return },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp)
    {
        // Do effects
        if (this.countdownSize > 0)
        {
            let Priority = me.priority;
            let Eriority = opp.priority;

            me.priority = Eriority;
            opp.priority = Priority;

            return [me.name + "'s and " + opp.name + "'s  speed stat was swapped!"];
        }
         else
            return ["The illusion faded away...", function ()
            {
                GenerateText("The stats of the combatants have return to normal!", function ()
                {
                    me.priority = me.ogpriority;
                    opp.priority = opp.ogpriority;
                    setTimeout(CombatLoop, 150);
                })
            }];
    },
    SpellCH: function (me, opp, sp) { return }
}
var Clearing =
{
    name: "Clearing",
    description: customizeText("ON USE: ", "darkred") + "This spell clears the active spell slot. All thanks to Master Shifu or something.",
    TYPE: customizeText("Hydro", "blue"),
    BGColor: "aquamarine",
    power: 0,
    spellpower: 0,
    Defensive: true,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 3,
    countdownSize: 0,
    healing: false,
    takesSlot: true,
    ClearSlot: true,
    status: "none",
    buffs: "",
    potentiallyAggresive: false,
    locked: false,
    OnUse: function (me, opp, sp)
    {
        var card = this;
        return [function () { me.RemoveSlot(card, opp) }]
    },
    OnEffect: function (me, opp) { return },
    OnAfterAttack: function (me, opp, mod) { return },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp) { return }
} 
var WaterSpout =
{
    name: "Water Spout",
    description: customizeText("ON USE: ", "darkred") + "Conjure up a water spout in order to obliterate your opponenent. If your health is less than 50% then deal 10 damage, else, deal 20 damage. Also if your previously used move is equal to Water Spout then the damage output of this card is halved and the previous boosts don't occur.",
    TYPE: customizeText("Hydro", "blue"),
    BGColor: "deepskyblue",
    power: 0,
    spellpower: 10,
    Defensive: false,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 2,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "",
    potentiallyAggresive: false,
    locked: false,
    OnUse: function (me, opp, sp) { return },
    OnEffect: function (me, opp) { return },
    OnAfterAttack: function (me, opp, mod) { return },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp)
    {
        if (me.prevUsedMove != null)
            if (me.prevUsedMove.name == "Water Spout")
                return this.spellpower / 2;

        if (me.hp < Math.floor(me.maxhp / 2))
            return this.spellpower;
        else
            return this.spellpower * 2;
    }
}
var Rain =
{
    name: "Rain",
    description: customizeText("ON USE: ", "darkred") + "If you have the card named 'Berry Supply' in your deck, this card boosts its healing by 1.5 permanently and this effect does not stack. If you're not in the possesion of the 'Berry Supply' card, then this card does absolutely nothing, but make you wet a bit.",
    TYPE: customizeText("Hydro", "blue"),
    BGColor: "deepskyblue",
    power: 0,
    spellpower: 0,
    Defensive: true,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 1,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "b",
    potentiallyAggresive: false,
    locked: false,
    ShouldUse: function (me, opp)
    {
        if (me.MovePool.includes(BerrySupply))
            return true;
        else
            return false;
    },
    OnUse: function (me, opp, sp)
    {
        if (me.MovePool.includes(BerrySupply))
        {

            var pos = me.MovePool.indexOf(BerrySupply);
            if (me.MovePool[pos].specificBoost == 1.5)
            {
                return [function () { GenerateText("But if failed! (Rain card has already been used.)", () => setTimeout(CombatLoop, WaitTime)) }]
            }

            return [function () { GenerateText("The rain helps with the berry production!!", function () { me.MovePool[pos].specificBoost = 1.5; setTimeout(CombatLoop, WaitTime) }) }]
        } else
            return ["The rain isn't much of help..."]
    },
    OnEffect: function (me, opp) { return },
    OnAfterAttack: function (me, opp, mod) { return },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp) { return; }
}
var Starlight =
{
    name: "Starlight Sword",
    description: customizeText("ON ATTACK: ", "darkred") + "Summon a starlight sword in order to help damage your opponent. The power from this card is boosted by 2.5 if you have taken 30 or more damage from non-spell cards and if you have the " + customizeText("Cleansed", "lightseagreen") + " status.",
    TYPE: customizeText("Hydro", "blue"),
    BGColor: "aquamarine",
    power: 2.5,
    spellpower: 0,
    Defensive: false,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 2,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "",
    potentiallyAggresive: false,
    locked: false,
    OnUse: function (me, opp, sp) { return },
    OnEffect: function (me, opp)
    {
        if (me.totaldmgtaken >= 30 && me.status == "cleansed")
            this.power += 2.5;
    },
    OnAfterAttack: function (me, opp, mod)
    {
        this.power = 2.5;
    },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp) { return }
}
var SeaAssistance =
{
    name: "The Sea's Assistance",
    description: customizeText("ON USE: ", "darkred") + "The sea houses lots of different species including plants and animals. With their assistance, if your previous move is of type " + customizeText("Terra", "sandybrown") + " gain the " + customizeText("Overgrown", "green") + " status for 2 turns. If your previous move is of type " + customizeText("Hydro", "blue") + " gain the " + customizeText("Cleansed", "lightseagreen") + " status for 2 turns.",
    TYPE: customizeText("Hydro", "blue"),
    BGColor: "deepskyblue",
    power: 1.5,
    spellpower: 0,
    Defensive: false,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 0,
    countdownSize: 0,
    healing: false,
    takesSlot: false,
    status: "none",
    buffs: "",
    potentiallyAggresive: false,
    locked: false,
    OnBeforeUse: function (me, opp, sp)
    {
        if (me.prevUsedMove == null)
            return;

        if (me.prevUsedMove.TYPE.search("Terra") != -1)
            this.status = "overgrown";
        else if (me.prevUsedMove.TYPE.search("Hydro") != -1)
            this.status = "cleansed";
    },
    OnUse: function (me, opp, sp)
    {
        if (me.prevUsedMove == null)
            return;

        if (me.prevUsedMove.TYPE.search("Terra") != -1)
            return [function () { me.ChangeStatus(me,3,"overgrown") }]
        else if (me.prevUsedMove.TYPE.search("Hydro") != -1)
            return [function () { me.ChangeStatus(me,3,"cleansed") }]
    },
    OnEffect: function (me, opp) { return },
    OnAfterAttack: function (me, opp, mod) { return },
    OnAfterTakeDmg: function (me, opp) { this.status = "" },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp) { return }
}
var Recovery =
{
    name: "Recovery",
    description: customizeText("ON USE: ", "darkred") + "Recover 15% of your max health. If your previously used move is this one, then the heal is reduced to 10%.",
    TYPE: customizeText("Hydro", "blue"),
    BGColor: "aquamarine",
    power: 0,
    spellpower: 0,
    Defensive: true,
    IgnoreLoweredSt: false,
    movePriority: 0,
    essenceRequired: 1,
    countdownSize: 0,
    healing: true,
    takesSlot: false,
    status: "none",
    buffs: "",
    potentiallyAggresive: false,
    locked: false,
    OnUse: function (me, opp, sp)
    {
        let heal = Math.floor(me.maxhp * .15)
        if (me.prevUsedMove != null)
            if (me.prevUsedMove.name == "Recovery")
                heal = Math.floor(me.maxhp * .1);

        return [function () { me.Heal(heal) }]
    },
    OnEffect: function (me, opp) { return },
    OnAfterAttack: function (me, opp, mod) { return },
    OnAfterTakeDmg: function (me, opp) { return },
    OnTurnEnd: function (me, opp, sp) { return },
    SpellCH: function (me, opp, sp)
    {
        if (me.prevUsedMove.name == "Recovery")
            return Math.floor(me.maxhp * .1);
        else
            return Math.floor(me.maxhp * .15);
    }
}

// Put them in (Terra) 
List.push(GSlam);
List.push(SolidRock);
List.push(NatureMadness);
List.push(PiercingSpear);
List.push(Foresting);
List.push(TribalStrength);
List.push(DwarvenUnit);
List.push(LastStand);
List.push(HeartOfStone);
List.push(Tavernkeep);
List.push(StewOftheLocals);
List.push(WillEnhance);
List.push(BerrySupply);
List.push(WeaponProduction);
List.push(Counter);

// Put them in (Pyro)
List.push(WildFire);
List.push(YFApprentice);
List.push(Cribbling);
List.push(Zerfallation);
List.push(ScorchedDesert);
List.push(BurningOil);
List.push(DragonsDesperation);
List.push(RuthlessPillage);
List.push(EmberWay);
List.push(Menace);
List.push(WickedFacade);
List.push(Ovenmints);
List.push(PheonixBless);
List.push(FireMantisArmy);
List.push(Dragur);

// Put them in (Hydro)
List.push(NewDawn)
List.push(MonkClarity)
List.push(SpringWaterAtt)
List.push(SpringWaterDef)
List.push(WaterElemental)
List.push(GloryWyvern)
List.push(ResolveWyvern)
List.push(CourageWyvern)
List.push(Reflect)
List.push(Clearing)
List.push(WaterSpout)
List.push(Rain)
List.push(Starlight)
List.push(SeaAssistance)
List.push(Recovery)