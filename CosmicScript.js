
// Globals
var Transitioning = false;
var BeatLevelsCounter = 0;
var GameContainer = document.getElementById("Gameplay");
var PHPContainer = document.getElementById("PlayerHP");
var CardMaker = document.getElementById("CardMaker") // the real name is deck maker, idk why i wrote it as card maker lol
var CardListT = document.getElementById("cardlistTerra")
var CardListP = document.getElementById("cardlistPyro")
var CardListH = document.getElementById("cardlistHydro")
var InputField1 = document.getElementById("L1");
var InputField2 = document.getElementById("L2");
var InputField3 = document.getElementById("L3");
var DescriptionBox = document.getElementById("DB");
var TextBox = document.getElementById("RealGameplay");
var Deckmoves = document.getElementById("DeckMoves");
var AlertBox = document.getElementById("Alert")
var ChangeNameCont = document.getElementById("CName");
var TutPanel = document.getElementById("Tutorial");
var MoveIndex = -1;
var Alerting = false;
var isOperating = false;
var Randomized = false;
var LastClicked = false; // last pressed the active spell
var InCombat = false;
var OpenTut = false;

// Combat Gameplay 
var PlayerActionsText = []; // also functions
var EnemyActionsText = [];
var ActiveSpellText = [];
var WaitTime = 150;
var index = 0;
var Faster = 0; // 0 if player is faster, 1 if enemy is faster
var State;
var Advance = false;
var EndStuff = false;

// Info-Related
var IsOpen = false;
var InfoBox = document.getElementById("Info"); 
var BoxContainer1 = document.getElementById("I1"); // not zoom info
var BoxContainer2 = document.getElementById("I2"); // zoom info

// Gameplay Globals
var ActiveSpell = null;
var TookSpellSlot = "";
var MoveButtonsMenu = document.getElementById("Pmoves"); // player move select
var combatMenu = document.getElementById("M"); // Move Select menus
var confirmActionButt = document.getElementById("CONF"); // confirm actuonp
var bButton = document.getElementById("b"); // back button 

// Level Select
var Levels = [document.getElementById("1"), document.getElementById("2"), document.getElementById("3")]; // level select
var AccessLevel = 0;
var CurrentLevel = 0;
var ActionOpt = document.getElementById("Actions"); // all options for fighting, currently only one button named FIGHT
var StatBox = document.getElementById("Box 1"); // level select
var SelectBox = document.getElementById("S"); // Box with select level text/ level select
var BGPanel = document.getElementById("Screen");

// Clear Input fields && Add Card && Change Name && Alert
document.addEventListener("keyup", function (e)
{
    if (!Alerting)
        return;

    if (e.key == "Escape")
      Alert(true);
})
InputField1.addEventListener("change", () => ClearLists(1))
InputField2.addEventListener("change", () => ClearLists(2))
InputField3.addEventListener("change", () => ClearLists(3))
ChangeNameCont.children[1].children[0].addEventListener("change", function ()
{

    for (let i = 0; i < ChangeNameCont.children.length; i++)
    {
        ChangeNameCont.children[i].classList.remove("WOOIN");
        ChangeNameCont.children[i].classList.add("WOOUT");
    }

    player.name = ChangeNameCont.children[1].children[0].value;
    ChangeNameCont.children[1].children[0].value = ""
    SetStatsBox();
    setTimeout(() => EventEngage(true), 310);
})

function ClearLists(index)
{
    // Clear other contents from other input fields (in order to insert a card into player's deck)
    switch (index)
    {
        case 1:
        {
                InputField2.value = ""
                InputField3.value = ""
                SetDBox(index);
        }
        break;
        case 2:
            {
                InputField1.value = ""
                InputField3.value = ""
                SetDBox(index);
        }
            break;
        case 3:
        {
                InputField1.value = ""
                InputField2.value = ""
                SetDBox(index);
        }

        break;
    }
}
function SetDBox(index, playerMove = false)
{

    var Move;
    let Mname;
    if (!playerMove)
    {
      switch (index)
      {
        case 1: Mname = InputField1.value;
            if (InputField1.value == "")
                return;
            break;
        case 2: Mname = InputField2.value;
            if (InputField2.value == "")
                return;
            break;
        case 3: Mname = InputField3.value;
            if (InputField3.value == "")
                return;
            break;
      }

      let result = List.find(obj =>
      {
          return obj.name === Mname
      })

        if (result == undefined)
            Alert(false,"There's no card that goes by the name of: " + Mname);
       else
       {
           DescriptionBox.children[0].innerHTML = "Name: " + result.name;
           DescriptionBox.children[1].innerHTML = "Spell Power: " + result.spellpower;
           DescriptionBox.children[2].innerHTML = "Power: " + result.power;
           DescriptionBox.children[3].innerHTML = "Essence Required: " + result.essenceRequired;
           DescriptionBox.children[4].innerHTML = "Priority: " + result.movePriority;
           DescriptionBox.children[5].style.visibility = "visible"
           DescriptionBox.children[5].children[0].innerHTML = result.description
        }
    }
    else
    {
        if (player.MovePool[index] == undefined)
            return;

        MoveIndex = index;
        DescriptionBox.children[0].innerHTML = "Name: " + player.MovePool[index].name;
        DescriptionBox.children[1].innerHTML = "Spell Power: " + player.MovePool[index].spellpower;
        DescriptionBox.children[2].innerHTML = "Power: " + player.MovePool[index].power;
        DescriptionBox.children[3].innerHTML = "Essence Required: " + player.MovePool[index].essenceRequired;
        DescriptionBox.children[4].innerHTML = "Priority: " + player.MovePool[index].movePriority;
        DescriptionBox.children[5].style.visibility = "visible"
        DescriptionBox.children[5].children[0].innerHTML = player.MovePool[index].description
    }
}
function AddCard()
{
    MoveIndex = -1;
    let moveName;
    let Typing;
    let enter;
    let index;
    if (InputField1.value == "" && InputField2.value == "" && InputField3.value == "")
        return;

    if (InputField1.value != "")
    {
        moveName = InputField1.value
        InputField1.value = ""
        Typing = 0;
    }
    else if (InputField2.value != "")
    {
        moveName = InputField2.value
        InputField2.value = ""
        Typing = 1;
    }
    else
    {
        moveName = InputField3.value
        InputField3.value = ""
        Typing = 2;
    }

    switch (Typing)
    {
        // Terra
        case 0:
            for (let i = 0; i < 15; i++)
            {
                if (List[i].name == moveName)
                {
                    enter = true;
                    index = i;
                    break;
                }
            }

            break;
        // Pyro
        case 1:
            for (let i = 15; i < 30; i++)
            {
                if (List[i].name == moveName)
                {
                    enter = true;
                    index = i;
                    break;
                }
            }

            break;
        // Hydro
        case 2:
            for (let i = 30; i < 45; i++)
            {
                if (List[i].name == moveName)
                {
                    enter = true;
                    index = i;
                    break;
                }
            }
            break;
    }

    if (!enter)
        return;

    for (let i = 0; i < Deckmoves.children.length; i++)
    {
        if (moveName == Deckmoves.children[i].innerHTML)
            return;
    }

    for (let i = 0; i < player.MovePool.length; i++)
    {
        if (player.MovePool[i] != undefined)
            continue;

        player.MovePool[i] = List[index];
        Deckmoves.children[i].innerHTML = player.MovePool[i].name;
        return;
    }
}
function RemoveCard()
{
    if (MoveIndex == -1)
        return;

    player.MovePool[MoveIndex] = undefined;
    Deckmoves.children[MoveIndex].innerHTML = "None";
}
function Alert(Close = false,textToDisplay = "")
{
    if (Close)
    {
        AlertBox.classList.remove("WOOIN")
        AlertBox.classList.add("WOOUT")
        setTimeout(() => Alerting = false,300)
        return;
    }

    if (!Alerting)
    {
        AlertBox.classList.remove("WOOUT")
        AlertBox.classList.add("WOOIN")
        AlertBox.children[0].innerHTML = textToDisplay;
        setTimeout(() => Alerting = true,300)
    } else
        AlertBox.children[0].innerHTML = textToDisplay;
}
function ChangeName()
{

    EventEngage(false);
    ChangeNameCont.disabled = false;
    for (let i = 0; i < ChangeNameCont.children.length; i++)
    {
        ChangeNameCont.children[i].classList.remove("WOOUT");
        ChangeNameCont.children[i].classList.add("WOOIN");
    }
}
function TutorialPanel()
{
    TutPanel.style.visibility = "visible"

    if (OpenTut)
    {
        EventEngage(true);
        TutPanel.classList.remove("WOOIN")
        TutPanel.classList.add("WOOUT")
        OpenTut = false;
        return;
    }

    EventEngage(false);
    TutPanel.classList.remove("WOOUT")
    TutPanel.classList.add("WOOIN")
    OpenTut = true;
}

// Functions -> Gameplay/Loading/Everything
function SetStatsBox()
{
    document.getElementById("name").innerHTML = "Name: " + player.name;
    document.getElementById("hp").innerHTML = "HP: " + player.maxhp;
    document.getElementById("power").innerHTML = "Attack: " + player.attack;   
}
function DisLevelSelect(YayNay)
{

    var b = false;
    if (YayNay == "Yay")
        b = true;
    
    for (let i = 0; i < Levels.length; i++)
    {
        Levels[i].disabled = b;
        if(b)
            Levels[i].style.visibility = "hidden"
        else
            Levels[i].style.visibility = "visible"
    }

    StatBox.disabled = b;
    if (b)
        StatBox.children[2].style.visibility = "hidden";


    SelectBox.disabled = b;
}

// Information Boxes && (AFTER EventEngage, Card Maker && Custom alert box && Change Name)
function PopUpInfo() 
{
    if (IsOpen)
    {
        IsOpen = false;
        InfoBox.classList.remove("Sin");
        InfoBox.classList.add("Sout");
        return;
    }

    InfoBox.classList.remove("Sout");
    InfoBox.classList.add("Sin");
    IsOpen = true;
}
function SetInfoBox()
{
    // Set UI
    InfoBox.children[0].innerHTML = "Name: " + SelectedMove.name;
    InfoBox.children[1].innerHTML = "Type: " + SelectedMove.TYPE;
    InfoBox.children[2].innerHTML = "Power: " + SelectedMove.power;
    InfoBox.children[3].innerHTML = "Essence Required: " + SelectedMove.essenceRequired;
    InfoBox.children[4].children[0].innerHTML = SelectedMove.description;

    // Zoom in UI
    BoxContainer2.children[0].children[1].innerHTML = SelectedMove.description;
}
function ZoomINfo(open)
{
    if (BoxContainer2.disabled)
        BoxContainer2.disabled = false;

    // Disable Clicks
    BGPanel.classList.remove("EnableClicks")

    // BGPanel... cool fade in effect
    if (open)
    {
        EventEngage(true);

        // WOO OUT THE BOX!
        for (let i = 0; i < BoxContainer2.children.length; i++)
        {
            BoxContainer2.children[i].classList.remove("WOOIN");
            BoxContainer2.children[i].classList.add("WOOUT");
        }
        setTimeout(() => BGPanel.classList.add("EnableClicks"), 350);
        return;
    }

    EventEngage(false);

    // WOO IN THE BOX! 
    for (let i = 0; i < BoxContainer2.children.length; i++)
    {
         BoxContainer2.children[0].classList.remove("WOOUT");
         BoxContainer2.children[0].classList.add("WOOIN");
    }


}
function EventEngage(yaynay)
{
    if (yaynay)
    {
        // Get the bg to fade out
        BGPanel.classList.remove("EventPopup");
        BGPanel.classList.add("EventLeave");
        setTimeout(() => BGPanel.classList.add("EnableClicks"), 350)
    } else
    {
        // Get the bg to come up
        BGPanel.classList.remove("EventLeave");
        BGPanel.classList.add("EventPopup");
        BGPanel.classList.remove("EnableClicks")
    }
}
function PullCardMaker(Close)
{
    if (Alerting)
    {
        Alert(true)
    }

    if (Close)
    {
        CardMaker.classList.remove("WOOIN")
        CardMaker.classList.add("WOOUT")
        EventEngage(true);
        InputField1.value = ""
        InputField2.value = ""
        InputField3.value = ""
        if (DescriptionBox.children[0].innerHTML != "")
        {
           DescriptionBox.children[0].innerHTML = "";
           DescriptionBox.children[1].innerHTML = "";
           DescriptionBox.children[2].innerHTML = "";
           DescriptionBox.children[3].innerHTML = "";
           DescriptionBox.children[4].innerHTML = "";
           DescriptionBox.children[5].style.visibility = "hidden"
        }

        return;
    }

    CardMaker.classList.remove("WOOUT")
    CardMaker.classList.add("WOOIN")
    CardMaker.style.visibility = "visible"
    EventEngage(false)
}


// Gameplay stuff + Disable UI
function WooButtons(Bunch)
{
    if (Bunch == "Levels")
    {
        // Level Select
        for (let i = 0; i < Levels.length; i++)
        {
            Levels[i].classList.remove("WOOIN");
            Levels[i].classList.add("WOOUT");
        }
        return;
    }

    if (Bunch == "ACT")
    {
        // fight, and other stuff
        for (let i = 0; i < ActionOpt.children.length; i++)
        {
            if (ActionOpt.children[i].classList.contains("WOOUT"))
                ActionOpt.children[i].classList.remove("WOOUT");

            ActionOpt.children[i].classList.add("WOOIN");
        }
    }
}
function WooOutButtons(Bunch)
{
    if (Bunch == "Levels")
    {
        // Level select
        for (let i = 0; i < Levels.length; i++)
        {
            Levels[i].classList.remove("WOOUT");
            Levels[i].classList.add("WOOIN");
        }
        return;
    } else if (Bunch == "ACT")
    {
        // fight, and other stuff
        for (let i = 0; i < ActionOpt.children.length; i++)
        {
            if (ActionOpt.children[i].classList.contains("WOOIN"))
                ActionOpt.children[i].classList.remove("WOOIN");

            ActionOpt.children[i].classList.add("WOOUT");
        }
    }


}
function ChooseMove(index)
{
    if (!IsOpen)
        PopUpInfo();

    LastClicked = false;
    SelectedMove = player.ActiveHand[index];
    confirmActionButt.classList.remove("SpinOut");
    confirmActionButt.classList.add("SpinIn");
    SetInfoBox();
}
function PullMovesMenu() 
{
    if (!Randomized)
    {
        player.GetHand();
        SetMoves();
        opponent.GetHand();
        Randomized = true;

        // Active Spell
        if (ActiveSpell != null)
            PHPContainer.children[1].children[0].innerHTML = ActiveSpell.name;
        else
            PHPContainer.children[1].children[0].innerHTML = "None";

        // Set Player stuff
        PHPContainer.children[0].children[0].innerHTML = player.name;
        PHPContainer.children[0].children[1].max = player.maxhp;
        PHPContainer.children[0].children[1].value = player.hp;
        PHPContainer.children[0].children[4].innerHTML = player.hp + "/" + player.maxhp;
        PHPContainer.children[0].children[2].innerHTML = player.essence;
        PHPContainer.children[0].children[3].innerHTML = player.armor;
    }
 
    // Info + CombatMenu + Player hp box enable
    if (BoxContainer1.disabled)
        BoxContainer1.disabled = false;

    if (combatMenu.disabled)
        combatMenu.disabled = false;

    if (PHPContainer.disabled)
        PHPContainer.disabled = false;

    PHPContainer.children[1].style.visibility = "visible";

    // WOOOOOOOOOO
    if (PHPContainer.children[0].classList.contains("WOOUT"))
        PHPContainer.children[0].classList.remove("WOOUT");

    PHPContainer.children[0].classList.add("WOOIN");

    if (PHPContainer.children[1].classList.contains("WOOUT"))
        PHPContainer.children[1].classList.remove("WOOUT");

    PHPContainer.children[1].classList.add("WOOIN");

    bButton.disabled = false;
    // if button still has the class to move out, remove it
    if (bButton.classList.contains("WOOUT"))
        bButton.classList.remove("WOOUT");

    bButton.classList.add("WOOIN");
    WooOutButtons("ACT"); // gtfo action buttons


    MoveButtonsMenu.classList.remove("WOOUT");
    MoveButtonsMenu.classList.add("WOOIN");
    Randomized = false;
}
function DisableMenuUI()
{ 
    // Get rid of menu, back button, pop up box && Confirm Action
    MoveButtonsMenu.classList.remove("WOOIN");
    MoveButtonsMenu.classList.add("WOOUT");


    // Disable back button, but fight button appearance waits
    bButton.classList.remove("WOOIN");
    bButton.classList.add("WOOUT");
    setTimeout(() => WooButtons("ACT"), 350);

    // Player HP
    if (PHPContainer.children[0].classList.contains("WOOIN"))
        PHPContainer.children[0].classList.remove("WOOIN");

    PHPContainer.children[0].classList.add("WOOUT");

    // Active Spell Button

    if (PHPContainer.children[1].classList.contains("WOOIN"))
        PHPContainer.children[1].classList.remove("WOOIN");

        PHPContainer.children[1].classList.add("WOOUT");


    if (IsOpen)
        PopUpInfo();

    if (confirmActionButt.classList.contains("SpinIn"))
    {
        confirmActionButt.classList.remove("SpinIn");
        confirmActionButt.classList.add("SpinOut");
    }
}
function GenerateText(text, F = () => { return }, First = false)
{
    if (Advance || First)
    {
        setTimeout(GenerateText, 350,text);
        return;
    }

    isOperating = true;
    Advance = false;
    let i = 0;
    setTimeout(function ()
    {
        TextBox.children[0].children[0].innerHTML = "";
        var l = setTimeout(function addText ()
        {
            TextBox.children[0].children[0].innerHTML += text[i];
            i++;

           if (i != text.length)
               setTimeout(addText, 15);
           else
           {
               isOperating = false;
               F();
           }
        },15)
    },100);
}
function SeeActiveSpell()
{
    if (ActiveSpell == null)
        return;

    LastClicked = true;
    if (!IsOpen)
        PopUpInfo();

    SelectedMove = ActiveSpell;
    SetInfoBox();
}
function CombatLoop()
{
    if (isOperating)
    {
        setTimeout(CombatLoop, 100);
        return;
    }

    // Who get's their text done first?
    State = (Faster > 0) ? 1 : 0;
    
    if (Faster == 1 && EnemyActionsText.length == 0)
        State = (Faster > 0) ? 0 : 1;
    else if (Faster == 0 && PlayerActionsText.length == 0)
        State = (Faster > 0) ? 0 : 1

    if (PlayerActionsText.length == 0)
    {
        State = (Faster > 0) ? 0 : 1;
        if (EnemyActionsText.length == 0)
        {
            State = 2;
            if (!EndStuff)
            {
               ActiveSPCH();
               // Different speeds = different turns
                if (Faster > 0)
                {
                    // Player's Faster
                    player.CheckTurnEndStatus();
                    opponent.CheckTurnEndStatus();
                } else
                {
                    // Enemy's faster
                    opponent.CheckTurnEndStatus();
                    player.CheckTurnEndStatus();
                }

                EndStuff = true;
            }
            if (ActiveSpellText.length == 0)
            {
                let b = false; // bool to check if we stop the game through the active spell ending
                // End Fight (plus essence + dmgtakenThisRound + remove spell if it is done)
                player.DMGTakenThisRound = 0;
                opponent.DMGTakenThisRound = 0;

                if (player.essence < 5)
                    player.essence++;

                if (opponent.essence < 5)
                    opponent.essence++;

                PHPContainer.children[0].children[2].innerHTML = player.essence;
                PHPContainer.children[0].children[3].innerHTML = player.armor;
                
                // Previously used moves
                player.prevUsedMove = SelectedMove;
                opponent.prevUsedMove = enemyMove;


                // Textbox leave && Menu come back ( bit of delay on it)
                if (ActiveSpell != null)
                {
                    if (ActiveSpell.countdownSize <= 0)
                    {
                        b = true
                        GenerateText("The active spell slot has been cleared up!", () => setTimeout(function ()
                        {
                            ActiveSpell = null;

                            TextBox.children[0].classList.remove("GOIN");
                            TextBox.children[0].classList.add("GOOUT")

                            setTimeout(function ()
                            {
                                TextBox.disabled = true;
                                Randomized = false;
                                DisableMenuUI();
                            }, 250)
                        }, 150))
                    }
                } 

                  if(!b)
                     setTimeout(function ()
                {
                    TextBox.children[0].classList.remove("GOIN");
                    TextBox.children[0].classList.add("GOOUT")

                    setTimeout(function ()
                    {
                        TextBox.disabled = true;
                        DisableMenuUI();
                    }, 250)
                },150)

                return;
            }
        }
    }

    // Print what you want
    switch (State)
    {
        case 0:
            // Check if we're going too far
            if (index >= PlayerActionsText.length)
            {
                PlayerActionsText.length = 0;
                index = 0;
                PHPContainer.children[0].children[2].innerHTML = player.essence;
                PHPContainer.children[0].children[3].innerHTML = player.armor;

                   // If someone has less than 0 hp, end game
                   if (player.hp > 0 && opponent.hp > 0) 
                       setTimeout(CombatLoop, WaitTime)
                   else
                   {
                       if (player.hp > 0)
                       {
                           // Win
                           if (CurrentLevel > AccessLevel)
                           {
                               AccessLevel++;
                               player.maxhp += 5;
                           }

                           GenerateText("YOU WON THE BATTLE!!!", function ()
                           {
                               setTimeout(function ()
                               {
                                   TextBox.children[0].classList.remove("GOIN");
                                   TextBox.children[0].classList.add("GOOUT")
                               }, 350);
                               InCombat = false;

                               // Return to selection
                               setTimeout(function ()
                               {
                                   TextBox.disabled = true
                                   BackToSelection();
                               }, 600)
                           })
                       }
                       else
                       {
                           if (opponent.hp > 0)
                               GenerateText("You lost the battle...", function ()
                               {
                                   setTimeout(function ()
                                   {
                                       TextBox.children[0].classList.remove("GOIN");
                                       TextBox.children[0].classList.add("GOOUT")
                                   }, 350);
                                   InCombat = false;

                                   // Return to selection
                                   setTimeout(function ()
                                   {
                                       TextBox.disabled = true;
                                       BackToSelection();
                                   }, 600)
                               })
                           else
                           GenerateText("It's a Draw!!", function ()
                           {
                               setTimeout(function ()
                               {
                                   TextBox.children[0].classList.remove("GOIN");
                                   TextBox.children[0].classList.add("GOOUT")
                               }, 350);
                               InCombat = false;

                               // Return to selection
                               setTimeout(function ()
                               {
                                   TextBox.disabled = true
                                   BackToSelection();
                               }, 600)
                           })
                       }
                   }
                     return;
            }

            // Print out
            if (typeof (PlayerActionsText[index]) != "string")
                PlayerActionsText[index](); // This is probably a function
            else
                GenerateText(PlayerActionsText[index], () => setTimeout(CombatLoop,WaitTime));

            index++;    
            break; // Player Turn
        case 1:
            // Check if we're going too far
            if (index >= EnemyActionsText.length)
            {
                   EnemyActionsText.length = 0;
                   index = 0;
                   // If someone has less than 0 hp, end game
                   if(player.hp > 0 && opponent.hp > 0) 
                       setTimeout(CombatLoop, WaitTime)
                   else
                   {
                       if (player.hp > 0)
                       {
                           // Win
                           if (CurrentLevel > AccessLevel)
                           {
                               AccessLevel++;
                               player.maxhp += 5;
                           }

                           GenerateText("YOU WON THE BATTLE!!!", function ()
                           {
                               setTimeout(function ()
                               {
                                   TextBox.children[0].classList.remove("GOIN");
                                   TextBox.children[0].classList.add("GOOUT")
                               }, 350);
                               InCombat = false;

                               // Return to selection
                               setTimeout(function ()
                               {
                                   TextBox.disabled = true
                                   BackToSelection()
                               }, 600)
                           })
                       }
                       else
                       {
                           if (opponent.hp > 0)
                               GenerateText("You lost the battle...", function ()
                               {
                                   setTimeout(function ()
                                   {
                                       TextBox.children[0].classList.remove("GOIN");
                                       TextBox.children[0].classList.add("GOOUT")
                                   }, 350);
                                   InCombat = false;

                                   // Return to selection
                                   setTimeout(function ()
                                   {
                                       TextBox.disabled = true;
                                       BackToSelection();
                                   }, 600)
                               })
                           else
                           GenerateText("It's a Draw!!", function ()
                           {
                               setTimeout(function ()
                               {
                                   TextBox.children[0].classList.remove("GOIN");
                                   TextBox.children[0].classList.add("GOOUT")
                               }, 350);
                               InCombat = false;

                               // Return to selection
                               setTimeout(function ()
                               {
                                   TextBox.disabled = true
                                   BackToSelection()
                               }, 600)
                           })
                       }
                   }
                return;
            }

            // Print out
            if (typeof (EnemyActionsText[index]) != "string")
                EnemyActionsText[index](); // This is probably a function
            else
                GenerateText(EnemyActionsText[index], () => setTimeout(CombatLoop, WaitTime));

            index++;
            break; // Enemy Turn
        case 2:
            // Check if we're going too far
            if (index >= ActiveSpellText.length)
            {
                ActiveSpellText.length = 0;
                index = 0;
                   // If someone has less than 0 hp, end game
                   if(player.hp > 0 && opponent.hp > 0)
                       setTimeout(CombatLoop, WaitTime)
                   else
                   {
                       if (player.hp > 0)
                       {
                           // Win
                           if (CurrentLevel > AccessLevel)
                           {
                               AccessLevel++;
                               player.maxhp += 5;
                           }

                           GenerateText("YOU WON THE BATTLE!!!", function ()
                           {
                               setTimeout(function ()
                               {
                                   TextBox.children[0].classList.remove("GOIN");
                                   TextBox.children[0].classList.add("GOOUT")
                               }, 350);
                               InCombat = false;

                               // Return to selection
                               setTimeout(function ()
                               {
                                   TextBox.disabled = true
                                   BackToSelection()
                               }, 600)
                           })
                       } else
                       {
                           if (opponent.hp > 0)
                               GenerateText("You lost the battle...", function ()
                               {
                                   setTimeout(function ()
                                   {
                                       TextBox.children[0].classList.remove("GOIN");
                                       TextBox.children[0].classList.add("GOOUT")
                                   }, 350);
                                   InCombat = false;

                                   // Return to selection
                                   setTimeout(function ()
                                   {
                                       TextBox.disabled = true;
                                       BackToSelection();
                                   }, 600)
                               })
                           else
                           GenerateText("It's a Draw!!", function ()
                           {
                               setTimeout(function ()
                               {
                                   TextBox.children[0].classList.remove("GOIN");
                                   TextBox.children[0].classList.add("GOOUT")
                               }, 350);
                               InCombat = false;

                               // Return to selection
                               setTimeout(function ()
                               {
                                   TextBox.disabled = true
                                   BackToSelection()
                               }, 600)
                           })
                       }
                   }
                return;
            }

            // Print out
            if (typeof (ActiveSpellText[index]) != "string")
                ActiveSpellText[index](); // This is probably a function
            else
                GenerateText(ActiveSpellText[index], () => setTimeout(CombatLoop, WaitTime));

            index++;
            break; // End of turn
    }
}

// Change colour on buttons (hover effect)
function MouseHoverEffect(e)
{
    let result;

    switch (e.style.backgroundColor)
    {
        case "green": result = "darkgreen"; break;
        case "sandybrown": result = "darkorange"; break;
        case "indianred": result = "mediumvioletred"; break;
        case "orangered": result = "darkred"; break;
        case "aquamarine": result = "mediumaquamarine"; break;
        case "deepskyblue": result = "dodgerblue"; break;
    }

    e.style.backgroundColor = result;
}
function MouseOutEffect(e)
{
    let result;

    switch (e.style.backgroundColor)
    {
        case "darkgreen": result = "green"; break;
        case "darkorange": result = "sandybrown"; break;
        case "mediumvioletred": result = "indianred"; break;
        case "darkred": result = "orangered"; break;
        case "mediumaquamarine": result = "aquamarine"; break;
        case "dodgerblue": result = "deepskyblue"; break;
    }

    e.style.backgroundColor = result;
}

// Big one
function StartFight(Pass = false)
{
    if (LastClicked)
        return;

    // Disable all UI
    WooOutButtons("ACT");
    MoveButtonsMenu.classList.remove("WOOIN");
    MoveButtonsMenu.classList.add("WOOUT");

    bButton.classList.remove("WOOIN");
    bButton.classList.add("WOOUT");
    PHPContainer.children[1].classList.remove("WOOIN");
    PHPContainer.children[1].classList.add("WOOUT");

    // Before Fight
    EndStuff = false;
    enemyMove = opponent.pickMove();
    TextBox.children[0].children[0].innerHTML = ""

    var PlayerMove = 1;

    if (!Pass)
    {
        PlayerMove = SelectedMove.movePriority;
    } else
        SelectedMove = undefined;

    // Fight
    let f = setTimeout(function ()
    {
        combatMenu.disabled = true;
        TextBox.disabled = false;
        TextBox.children[0].classList.remove("GOOUT")

        if (TextBox.children[0].classList.contains("GOIN"))
            TextBox.children[0].classList.remove("GOIN");

        TextBox.children[0].classList.add("GOIN");
        InCombat = true;

        // enemyMove Priority
        let EnemyPrio = 0;
        if (enemyMove != undefined)
            EnemyPrio = enemyMove.movePriority;

        if (player.priority >= opponent.priority)
        {
            // Continue player turn or enemy's turn?
            if (PlayerMove >= EnemyPrio)
            {
                Faster = 0;
                if (typeof SelectedMove != "undefined")
                    PTurn();
                else
                    PlayerActionsText.push(player.name + " passed this round.");

                // Enemy Turn 
                // If no cards are available
                if (typeof (enemyMove) != "undefined")
                    OTurn();
                else
                    EnemyActionsText.push(opponent.name + " passed this round.");
            }
            else
            {
                Faster = 1;
                if (typeof (enemyMove) != "undefined")
                    OTurn();
                else
                    EnemyActionsText.push(opponent.name + " passed this round.")

                if (typeof SelectedMove != "undefined")
                    PTurn();
                else
                    PlayerActionsText.push(player.name + " passed this round.");
            }
        }
        else
        {
            if (EnemyPrio >= PlayerMove)
            {
                Faster = 1;
                if (typeof (enemyMove) != "undefined")
                    OTurn();
                else
                    EnemyActionsText.push(opponent.name + " passed this round.")

                if (typeof SelectedMove != "undefined")
                    PTurn();
                else
                    PlayerActionsText.push(player.name + " passed this round.");
            }
            else
            {
                Faster = 0;
                if (typeof SelectedMove != "undefined")
                    PTurn();
                else
                    PlayerActionsText.push(player.name + " passed this round.");

                // Enemy Turn 
                // If no cards are available
                if (typeof (enemyMove) != "undefined")
                    OTurn();
                else
                    EnemyActionsText.push(opponent.name + " passed this round.");
            }
        }
        CombatLoop(); // Start Generating Text
    }, 500);

    if (!Pass)
    {
        PopUpInfo();
        confirmActionButt.classList.remove("SpinIn");
        confirmActionButt.classList.add("SpinOut");
    }
} 
function PassFight()
{
    if (!Randomized)
    {
       player.GetHand();
       opponent.GetHand();
    }
       if (PHPContainer.disabled)
            PHPContainer.disabled = false;

    PHPContainer.children[1].style.visibility = "hidden";

    // Disable Active Spell Box
    PHPContainer.children[0].children[0].innerHTML = player.name;
    PHPContainer.children[0].children[1].max = player.maxhp;
    PHPContainer.children[0].children[1].value = player.hp;
    PHPContainer.children[0].children[4].innerHTML = player.hp + "/" + player.maxhp;
    PHPContainer.children[0].children[2].innerHTML = player.essence;
    PHPContainer.children[0].children[3].innerHTML = player.armor;

    // WOOOOOOOOOO
    if (PHPContainer.children[0].classList.contains("WOOUT"))
        PHPContainer.children[0].classList.remove("WOOUT");

    PHPContainer.children[0].classList.add("WOOIN");

    if (PHPContainer.children[1].classList.contains("WOOUT"))
        PHPContainer.children[1].classList.remove("WOOUT");

    PHPContainer.children[1].classList.add("WOOIN");
    StartFight(true);
}

 
const Type =
{
    None: "None",
    Terra: "Terra",
    Pyro: "Pyro",
    Hydro: "Hydro"
}
class Warrior
{
    constructor(name, hp, attack, armor,priority = 0 , maxarmor = 5, MovePool = new Array(10), prevUsedMove, status = "none", stcounter = 0, attackMod = 1, maxhp = hp, totaldmgtaken = 0, usedHydro = false, usedTerra = false, usedPyro = false, essence = 0, ActiveHand = new Array(6), spamLimit = 0, ogattack, ogarmor, DMGTakenThisRound = 0,ogpriority)
    {
        this.name = name;
        this.hp = hp;
        this.attack = attack;
        this.armor = armor;
        this.priority = priority;
        this.maxarmor = maxarmor;
        this.MovePool = MovePool;
        this.prevUsedMove = prevUsedMove;
        this.status = status;
        this.stcounter = stcounter;
        this.attackMod = attackMod;
        this.maxhp = maxhp;
        this.totaldmgtaken = totaldmgtaken;
        this.usedTerra = usedTerra;
        this.usedPyro = usedPyro;
        this.usedHydro = usedHydro;
        this.essence = essence;
        this.ActiveHand = ActiveHand;
        this.spamLimit = spamLimit;
        this.ogattack = this.attack;
        this.ogarmor = this.armor;
        this.DMGTakenThisRound = DMGTakenThisRound;
        this.ogpriority = this.priority;
    }

    DealDamage(move,target,targMove)
    {
        var instance = this;
        move.OnEffect(instance, target);

        // Status boosts
        if (target.status != "")
        {
            // Depending on status, different effects happen
            switch (target.status)
            {
                case "overgrown":
                    if (move.TYPE.search(Type.Pyro) != -1)
                        this.attackMod *= 1.1
                    else if (move.TYPE.search(Type.Hydro) != -1)
                        this.attackMod *= .9;
                break;
                case "overheated":
                    if (move.TYPE.search(Type.Hydro) != -1)
                        this.attackMod *= 1.2;
                    break;
                case "cleansed": this.attackMod *= .85; break;
            }
        }

        // Special boost for pyro moves
        if ((move.TYPE.search(Type.Pyro) != -1 && this.status == "overheated") && target.status != "cleansed")
            this.attackMod *= 1.15;

        let AttackStat = (move.IgnoreLoweredSt == true) ? this.ogattack : this.attack 
        let TotalDamage = Math.round((Math.round((move.power * AttackStat) / 1.5) + 4)) * this.attackMod
        TotalDamage = Math.round(TotalDamage);
        this.attackMod = 1;  // Reset attackMod 


        target.hp -= TotalDamage;
        if (target.hp < 0)
            target.hp = 0;

        this.totaldmgtaken += TotalDamage;
        this.DMGTakenThisRound += TotalDamage;
        // Which HP bar to affect
        GenerateText(this.name + " attacked with " + move.name + "!", function ()
        {
           switch (target.name)
           {
             case player.name:
                // hp bar:  PHPContainer.children[0].children[1]; 
                // hp text:  PHPContainer.children[0].children[2];
                var t = setTimeout(function reduce()
                {
                    PHPContainer.children[0].children[1].value--;
                    PHPContainer.children[0].children[4].innerHTML = PHPContainer.children[0].children[1].value + "/" + target.maxhp;

                    // Continue or end
                    if (PHPContainer.children[0].children[1].value != target.hp)
                        setTimeout(reduce, 15);
                    else
                    {
                        PHPContainer.children[0].children[1].value--; // It's always one off so just do that


                          // After Attack (enemy attacked)
                        
                          let afterText = move.OnAfterAttack(instance, target, TotalDamage);
                          if (afterText != undefined)
                          {
                             for (let i = 0; i < afterText.length; i++)
                                EnemyActionsText.push(afterText[i]);
                          } 

                        // After Take Damage
                        if (targMove != undefined)
                        if (typeof targMove.OnAfterTakeDmg == "function" && target.hp > 0)
                        {
                           let DamageAfterText = targMove.OnAfterTakeDmg(target, instance, TotalDamage)
                           if (DamageAfterText != undefined)
                           {
                               for (let i = 0; i < DamageAfterText.length; i++)
                                   EnemyActionsText.push(DamageAfterText[i]);

                           }
                        } 


                        setTimeout(CombatLoop, WaitTime);
                        clearTimeout(t);
                    }
                },15)
             break;
             default:
                // hp bar: LevelXGroup.children[0].children[1]
                var t = setTimeout(function reduce2()
                {
                    LevelXGroup.children[0].children[1].value--;
                    if (LevelXGroup.children[0].children[1].value != target.hp)
                        setTimeout(reduce2, 15);
                    else
                    {
                        LevelXGroup.children[0].children[1].value--; // It's always one off so just do that

                        // After Attack (player attacked)
                        let afterText = move.OnAfterAttack(instance, target, TotalDamage);
                        if (afterText != undefined)
                        {
                            for (let i = 0; i < afterText.length; i++)
                                PlayerActionsText.push(afterText[i]);
                        } 

                        // After Take Damage
                        if (targMove != undefined)
                        if (typeof targMove.OnAfterTakeDmg == "function" && target.hp > 0)
                        {
                            let DamageAfterText = targMove.OnAfterTakeDmg(target, instance, TotalDamage)
                            if (DamageAfterText != undefined)
                            {
                                for (let i = 0; i < DamageAfterText.length; i++)
                                     PlayerActionsText.push(DamageAfterText[i]);

                            }
                        }

                        setTimeout(CombatLoop, WaitTime);
                        clearTimeout(t);
                    }
                }, 15)
              break;
           } 
        })
    }
    DealSpellDamage(dmg,target, specificText = "")
    {
        let CleansedDecr = 1;

        if (target.status == "cleansed")
            CleansedDecr = .85;


        let EndTotal = Math.floor(dmg * CleansedDecr);
        target.hp -= EndTotal;
         if (target.hp < 0)
             target.hp = 0

        

        if (specificText == "")
            specificText = this.name + " specially attacked " + target.name + "!";

        GenerateText(specificText, function ()
        {
           // Which HP bar to affect
           switch (target.name)
          {
              case player.name:
                // hp bar:  PHPContainer.children[0].children[1]; 
                // hp text:  PHPContainer.children[0].children[2];
                var t = setTimeout(function reduce()
                {
                    PHPContainer.children[0].children[1].value--;
                    PHPContainer.children[0].children[4].innerHTML = PHPContainer.children[0].children[1].value + "/" + target.maxhp;

                    if (PHPContainer.children[0].children[1].value == target.hp)
                    {
                        setTimeout(CombatLoop, WaitTime)
                        clearTimeout(t);
                    }
                     else
                        setTimeout(reduce, 15);
                },15)
              break;
              default:
                // hp bar: LevelXGroup.children[0].children[1]
                var t = setTimeout(function reduce2()
                {
                    LevelXGroup.children[0].children[1].value--;

                    if (LevelXGroup.children[0].children[1].value == target.hp)
                    {
                        setTimeout(CombatLoop, WaitTime)
                        clearTimeout(t);
                    }
                     else
                        setTimeout(reduce2, 15);
                }, 15)
                break;
          }
        })
    }
    Heal(amount, specificText = "")
    {
        var instance = this;
        if (instance.hp == instance.maxhp)
        {
            GenerateText(instance.name + " is already at full HP!", () => setTimeout(CombatLoop,WaitTime))
            return;
        }

        let Boost = 1;
        if (instance.status == "cleansed")
            Boost = 1.20;

        let realHeal = Math.round(amount * Boost)
        instance.hp += realHeal;
        if (instance.hp > instance.maxhp)
            instance.hp = instance.maxhp;

        if (specificText == "")
            specificText = instance.name + " recovered " + realHeal + " HP!";

        // Which HP bar to affect
        GenerateText(specificText, function ()
        {
           switch (instance.name)
           {
              case player.name:
                // hp bar:  PHPContainer.children[0].children[1]; 
                // hp text:  PHPContainer.children[0].children[2];
                var t = setTimeout(function plus()
                {
                    PHPContainer.children[0].children[1].value++;
                    PHPContainer.children[0].children[4].innerHTML = PHPContainer.children[0].children[1].value + "/" + instance.maxhp;

                    if (PHPContainer.children[0].children[1].value == instance.hp)
                    {
                        setTimeout(CombatLoop, WaitTime)
                        clearTimeout(t);
                    }
                    else
                    {
                        isOperating = false;
                        setTimeout(plus, 15);
                    }
                },15)
              break;
              default:
                // hp bar: LevelXGroup.children[0].children[1]
                var t = setTimeout(function plus()
                {
                    LevelXGroup.children[0].children[1].value++;

                    if (LevelXGroup.children[0].children[1].value == instance.hp)
                    {
                        setTimeout(CombatLoop, WaitTime)
                        clearTimeout(t);
                    }
                    else
                    {
                        isOperating = false;
                        setTimeout(plus, 15);
                    }
                }, 15)
              break;
           }
        });
    }
    AffectStat(move, stat, amount)
    {
        let PositiveOutcome = false;
        if (amount > 0)
            PositiveOutcome = true;

        var instance = this;

        // Increase/Decrease stat
        switch (stat)
        {
            case "armor":
                {
                    if (instance.armor == instance.maxarmor && PositiveOutcome)
                    {
                        GenerateText(instance.name + "'s armor cannot be raised anymore! ", () => setTimeout(CombatLoop,WaitTime));
                        return;
                    } else if (instance.armor == instance.ogarmor && !PositiveOutcome)
                    {
                        GenerateText(instance.name + "'s armor cannot fall anymore!", () => setTimeout(CombatLoop, WaitTime))
                        return;
                    }

                    if (PositiveOutcome)
                        GenerateText(instance.name + "'s armor raised by " + amount + "!", function ()
                        {
                            // If overgrown, armor + 1
                            if (instance.status == "overgrown")
                                amount += 1;

                            instance.armor += amount;
                            if (instance.armor > instance.maxarmor)
                                instance.armor = instance.maxarmor;

                            if (instance == player)
                                PHPContainer.children[0].children[3].innerHTML = player.armor;

                            setTimeout(CombatLoop,WaitTime);
                        });
                    else
                        GenerateText(instance.name + "'s armor fell " + -amount + "!", function ()
                        {
                            instance.armor += amount;
                            if (instance.armor < instance.ogarmor)
                                instance.armor = instance.ogarmor;

                            if (instance == player)
                                PHPContainer.children[0].children[3].innerHTML = player.armor;
                                setTimeout(CombatLoop,WaitTime); 
                        });  
            }
                break;
            case "attack":
                {
                    if (instance.attack == 10 && PositiveOutcome)
                    {
                        GenerateText(instance.name + "'s attack cannot be raised anymore! ", () => setTimeout(CombatLoop,WaitTime));
                        return;
                    } else if (instance.attack == 1 && !PositiveOutcome)
                    {
                        GenerateText(instance.name + "'s attack cannot fall anymore!", () => setTimeout(CombatLoop, WaitTime));
                        return;
                    }

                    if (PositiveOutcome)
                        GenerateText(instance.name + "'s attack raised by " + amount + "!", function ()
                        {
                            instance.attack += amount;
                            if (instance.attack > 10)
                                instance.attack = 10;

                            setTimeout(CombatLoop,WaitTime);
                        });
                    else
                        GenerateText(instance.name + "'s attack fell by " + -amount + "!", function ()
                        {
                            instance.attack += amount;
                            if (instance.attack > instance.maxattack)
                                instance.attack = instance.maxattack;

                             setTimeout(CombatLoop,WaitTime); 
                        });  
            }
            break;
            case "resetall":
            {
                let B1 = false;
                let B2 = false;

                // Attack Check
                if (instance.attack != instance.ogattack)
                    B1 = true;
                
                // Armor Check
                if (instance.armor != instance.ogarmor) 
                    B2 = true;

                    if (B1 && !B2)
                        GenerateText(instance.name + " attack reverted to normal!", function () { instance.attack = instance.ogattack; setTimeout(CombatLoop,WaitTime) })
                else if (!B1 && B2)
                    GenerateText(instance.name + " armor reverted to normal!", function ()
                    {
                        instance.armor = instance.ogarmor
                        if (instance == player)
                            PHPContainer.children[0].children[3].innerHTML = player.armor;

                        setTimeout(CombatLoop,WaitTime)
                    })
                else if (B1 && B2)
                    GenerateText(instance.name + " stats reverted to normal!!", function ()
                    {
                        instance.attack = instance.ogattack;
                        instance.armor = instance.armor;

                        if (instance == player)
                            PHPContainer.children[0].children[3].innerHTML = player.armor;

                        setTimeout(CombatLoop, WaitTime);
                    })
                else
                    GenerateText(instance.name + " stats were not changed.",() =>  setTimeout(CombatLoop,WaitTime)) // If legit nothing is affected
            }
            break;
        }
    }
    GetHand()
    {
        for (let i = 0; i < 6; i++)
        {
            let rand = Math.floor(Math.random() * 10);
            while (this.ActiveHand.includes(this.MovePool[rand]))
            {
                rand = Math.floor(Math.random() * 10);
                if (!this.ActiveHand.includes(this.MovePool[rand]))
                {
                    break;
                }
            }

            this.ActiveHand[i] = this.MovePool[rand];
        }
    }
    ChangeStatus(target, turns, STATUS = "none")
    {
        let AlreadyStatus = target.name + " already has the ";
        let GetStatus = target.name + " became ";

        // Cleansed
        if (STATUS == "cleansed")
        {
            // If already have
            if (this.status == "cleansed")
            {
                AlreadyStatus += "Cleansed status.";
                GenerateText(AlreadyStatus, () => setTimeout(CombatLoop,WaitTime));
                return
            }
            
            GetStatus += " Cleansed. The amount of total damage received is lowered by 10% and healing is increased by 20%!"
            GenerateText(GetStatus, function ()
            {
                target.status = STATUS;
                target.stcounter = turns;
                setTimeout(CombatLoop,WaitTime);
            });
        }

        // Normal Status
        if (target.status == "none")
        {
            switch (STATUS)
            {
                case "overgrown":
                    GetStatus += " Overgrown. Cards granting armor have their bonuses boosted by 50%. Pyro cards deal 10% more damage to you, while Hydro cards deal 10% less to you.";
                    GenerateText(GetStatus, function ()
                    {
                         target.status = STATUS;
                         target.stcounter = turns;
                         setTimeout(CombatLoop,WaitTime);
                    });
                    break;
                case "overheated":
                    GetStatus += " Overheated. Pyro-based damage that you deal is increased by 20%, and every single round 5 hp is lost.";
                    GenerateText(GetStatus, function ()
                    {
                        target.status = STATUS;
                        target.stcounter = turns;
                        setTimeout(CombatLoop,WaitTime);
                    });
                    break;
            }
        } else
        {
            GenerateText(target.name + " already has a status condition.", () => setTimeout(CombatLoop,WaitTime))
        }
    }
    CheckTurnEndStatus()
    {
        // ActiveSpellText is pretty much the same as turn end text
        if (this.status == "none")
            return;

        this.stcounter--;
        var instance = this;
        if (this.stcounter > 0)
        {
            // Only thing that does anything is Overheated status.
            if (this.status == "overheated")
                ActiveSpellText.push(function () { instance.DealSpellDamage(5, instance, instance.name + " is burnt by their intense heat!")})
        } else
        {
            ActiveSpellText.push(function () { instance.RemoveStatus(instance); })
        }
    }
    RemoveStatus(target)
    {
        GenerateText(target.name + "' status condition has been cleared up!", function ()
        {
            target.status = "none";
            setTimeout(CombatLoop, WaitTime);
        })
    }
    RemoveSlot(move,opp)
    {
        var instance = this;
        GenerateText(this.name + " clears the active spell slot with " + move.name + "!", function ()
        {
            ActiveSpell = null;
            instance.priority = instance.ogpriority;
            opp.priority = opp.ogpriority;
            setTimeout(CombatLoop, WaitTime);
        });
    }
    // Enemy specific

    pickMove()
    {
        var instance = this;
        var KillingMoves = [];
        var GeneralMoves = []; // for attacks that don't kill
        var HealingMoves = [];
        var DefensiveMoves = [];
        var ActiveSlotMoves = [];
        var BestAttackingMove;

        // Get all available moves, store them into seperate arrays
        for (let i = 0; i < this.ActiveHand.length; i++)
        {
            if ("OnBeforeUse" in this.ActiveHand[i])
                this.ActiveHand[i].OnBeforeUse(this, player, ActiveSpell);

            // We can use this card!
            if (this.essence >= this.ActiveHand[i].essenceRequired)
            {
                // Attacking Moves
                if (this.ActiveHand[i].power > 0 || this.ActiveHand[i].spellpower > 0)
                {
                    // If it kills, push it into the KillingMoves arr, if not push into GeneralMoves arr
                    let spellorNo = (this.ActiveHand[i].spellpower > 0) ? true : false
                    if (this.Kills(this.ActiveHand[i], spellorNo, player))
                        KillingMoves.push(this.ActiveHand[i]);
                    else
                    {
                        // Define the best non-killing attacking move
                        GeneralMoves.push(this.ActiveHand[i]);

                        if (BestAttackingMove == undefined)
                        {
                            BestAttackingMove = this.ActiveHand[i]
                            continue;
                        } 

                        // Test Damage
                        let CurrSpellorNo = (this.ActiveHand[i].spellpower > 0) ? true : false;
                        let BestAttackSpellOrNo = (BestAttackingMove.spellpower > 0) ? true : false;

                        if (this.TestDamage(this.ActiveHand[i], CurrSpellorNo, player) > this.TestDamage(BestAttackingMove, BestAttackSpellOrNo, player))
                            BestAttackingMove = this.ActiveHand[i];
                    }

                    continue; // don't check other things
                }

                // Defensive Moves
                if (this.ActiveHand[i].Defensive && !this.ActiveHand[i].takesSlot)
                {
                    // Status 
                    if (this.ActiveHand[i].status != "none")
                    {
                        if (this.ActiveHand[i].ShouldUse(instance, player))
                        {
                            if (!this.ActiveHand[i].healing)
                               DefensiveMoves.push(this.ActiveHand[i]);
                            else
                               HealingMoves.push(this.ActiveHand[i]);

                            continue;
                        }
                        else
                            continue;
                    }

                    if (this.ActiveHand[i].buffs != "")
                    {
                          if (this.ActiveHand[i].ShouldUse(instance, player))
                          {
                             if (!this.ActiveHand[i].healing)
                                 DefensiveMoves.push(this.ActiveHand[i]);
                             else
                                 HealingMoves.push(this.ActiveHand[i]);
                          }
                        continue;
                    }

                    // Healing or not
                    if (!this.ActiveHand[i].healing)
                        DefensiveMoves.push(this.ActiveHand[i]);
                    else
                        HealingMoves.push(this.ActiveHand[i]);

                    continue; // don't check other things
                }

                // Active Slot Moves
                if (this.ActiveHand[i].takesSlot)
                {
                    // Clears slot
                    if (this.ActiveHand[i].ClearSlot && ActiveSpell != null)
                    {
                        ActiveSlotMoves.push(this.ActiveHand[i]);
                        continue;
                    }

                    // can take slot?
                    if (ActiveSpell == null)
                        ActiveSlotMoves.push(this.ActiveHand[i]);
                }
            }
        }

        // if moves that kill exist, choose one of them
        if (KillingMoves.length > 0)
        {
            if (KillingMoves.length == 1)
                return KillingMoves[0];


            let num = Math.floor(Math.random() * KillingMoves.length)
            return KillingMoves[num];
        }

        // Highest damaging moves.
        var HighestDamagingMoves = [];
        HighestDamagingMoves.push(BestAttackingMove)
        for (let i = 0; i < GeneralMoves.length; i++)
        {
            if (GeneralMoves[i].power > 0 || GeneralMoves[i].spellpower > 0)
            {
                let HS = (HighestDamagingMoves[0].spellpower > 0) ? true : false
                let spellorNo = (GeneralMoves[i].spellpower > 0) ? true : false
                if (this.TestDamage(HighestDamagingMoves[0], HS, player) == this.TestDamage(GeneralMoves[i], spellorNo, player))
                {
                    if (GeneralMoves[i].name != HighestDamagingMoves[0].name)
                       HighestDamagingMoves.push(GeneralMoves[i]);
                }

                // Remove Item, since it's pointless to exist now.
                GeneralMoves.splice(i, 1);
            }
        }

        // Pick best healing move
        var BestHealingMove;
        for (let i = 0; i < HealingMoves.length; i++)
        {
            if (BestHealingMove != undefined)
            {
                if (this.TestHeal(HealingMoves[i], player, instance) > this.TestHeal(BestHealingMove, player, instance))
                    BestHealingMove = HealingMoves[i];
            } else
                BestHealingMove = HealingMoves[i]
        }

        // ---------------- FINAL DECISION ----------------
        if (this.hp >= Math.floor(this.maxhp / 2))
        {
            let chance = Math.random();
            let AttackPercent = 65;
            let ActiveSlotPercent = 95;
            let DefendPercent = 5;

            // Mess with percentages
            if (ActiveSlotMoves.length == 0)
            {
                ActiveSlotPercent = 0;
                AttackPercent += 5; // This is actually 0.700000....1, it doesn't really matter...
                DefendPercent += 95;
            }

            let SecondPercent = (ActiveSlotPercent <= 0) ? ActiveSlotPercent : DefendPercent; // If ActiveSlot.length > 0, then SecondPercent = ActiveSlotPercent

            if (DefensiveMoves.length == 0)
            {
                DefendPercent = 0;
                if (ActiveSlotMoves.length == 0)
                    AttackPercent = 100;
                else
                    ActiveSlotPercent += 5;
            }

            AttackPercent /= 100;
            DefendPercent /= 100;
            ActiveSlotPercent /= 100;

            if (chance < AttackPercent)
            {
                if (HighestDamagingMoves.length == 1)
                    return HighestDamagingMoves[0];
                else
                {
                    let num = Math.floor(Math.random() * HighestDamagingMoves.length)
                    return HighestDamagingMoves[num];
                }
            }
            else if (chance < ActiveSlotPercent)
            {
                  if (ActiveSlotMoves.length == 1)
                      return ActiveSlotMoves[0];

                    // Pick the best slot move 
                    for (let i = 0; i < ActiveSlotMoves.length; i++)
                    {
                        if (ActiveSlotMoves[i].ClearSlot)
                        {
                            if (TookSpellSlot == "player")
                                return ActiveSlotMoves[i];
                        }

                        if (ActiveSlotMoves[i].potentiallyAggresive)
                            return ActiveSlotMoves[i];
                        else
                        {
                            if (i == ActiveSlotMoves.length - 1)
                                return ActiveSlotMoves[i];
                        }
                    }
                
            }
            else
            {
                for (let i = 0; i < DefensiveMoves.length; i++)
                {
                    if (DefensiveMoves[i].potentiallyAggresive)
                        return DefensiveMoves[i];
                    else if (i == DefensiveMoves.length - 1)
                        return DefensiveMoves[i];
                }
            }

        }
        else
        {
            // Less than player hp
            let chance = Math.random();
            let AttackPercent = 50;
            let ActiveSlotPercent = 80;
            let HealPercent = 95;
            let DefendPercent = 100;

            if (ActiveSlotMoves.length == 0 && HealingMoves.length == 0 && DefendPercent == 0)
                AttackPercent = 100;
            else
            {
                // cant take slot
                if (ActiveSlotMoves.length == 0)
                {
                    ActiveSlotPercent = 0;
                    AttackPercent += 10;
                    // 60% to attack, 35% to heal, 5% to defend
                } 

                // cant heal
                if (HealingMoves.length == 0)
                {
                    HealPercent = 0;
                    if (ActiveSlotPercent > 0)
                    {
                        AttackPercent += 5;
                        ActiveSlotPercent += 5; // 50% to attack, 30% to take slot, 15% to defend
                    }
                    else
                        AttackPercent += 20; // 80 attack, 20 defend.
                }

                // cant defend
                if (DefensiveMoves.length == 0)
                {
                    DefendPercent = 0;
                    if (ActiveSlotPercent == 0)
                    {
                        if (HealPercent == 0)
                            AttackPercent = 100;
                        else
                        {
                            AttackPercent = 50;
                            HealPercent = 100;
                        }
                    } else
                    {
                        // ActivePercent > 0, therefore, ATTACK PERCENT => 50
                        if (HealPercent == 0)
                        {
                            AttackPercent += 15; // 70
                            ActiveSlotPercent = 100; // 100 (100-70 = 30%)
                        } else
                            HealPercent += 5;
                    }
                }
            }

            AttackPercent /= 100;
            ActiveSlotPercent /= 100;
            HealPercent /= 100;
            DefendPercent /= 100;

            if (chance < AttackPercent)
            {
                if (HighestDamagingMoves.length == 1)
                    return HighestDamagingMoves[0];
                else
                {
                    let num = Math.floor(Math.random() * HighestDamagingMoves.length)
                    return HighestDamagingMoves[num];
                }
            }
            else if (chance < ActiveSlotPercent)
            {
                    if (ActiveSlotMoves.length == 1)
                        return ActiveSlotMoves[0];

                    // Pick the best slot move 
                    for (let i = 0; i < ActiveSlotMoves.length; i++)
                    {
                        if (ActiveSlotMoves[i].ClearSlot)
                        {
                            if (TookSpellSlot == "player" && ActiveSpell.potentiallyAggresive)
                                return ActiveSlotMoves[i];
                        }

                        if (i == ActiveSlotMoves.length - 1)
                        {
                            if (ActiveSlotMoves[i - 1].healing)
                                return ActiveSlotMoves[i - 1];
                            else
                                return ActiveSlotMoves[i];
                        }
                    }
            }
            else if (chance < HealPercent)
            {
                alert(BestHealingMove)
                return BestHealingMove;
            }
            else
            {

                 for (let i = 0; i < DefensiveMoves.length; i++)
                 {
                     if (DefensiveMoves[i].potentiallyAggresive)
                         return DefensiveMoves[i];
                     else if (i == DefensiveMoves.length - 1)
                         return DefensiveMoves[i];
                 }
              
            }
        }
    }
    Kills(move, spellNo = false, opp)
    {
        var damage = 0;
        if (!spellNo)
        {
            move.OnEffect(this, opp);
            damage = Math.round((Math.round((move.power * this.attack) / 1.5) + 4)) * this.attackMod;
            damage = Math.round(damage);

            this.attackMod = 1;
        } else
            damage = move.SpellCH(this, opp, ActiveSpell);

        if (opp.hp - damage <= 0)
            return true;
        else
            return false;
    }
    TestDamage(move, spellNo = false, opp)
    {
        var damage = 0;
        var PLAYERINSTANCE = opp;
        var instance = this;
        if (!spellNo)
        {
            move.OnEffect(instance, PLAYERINSTANCE);
            damage = Math.round((Math.round((move.power * instance.attack) / 1.5) + 4)) * instance.attackMod;
            damage = Math.round(damage);

            instance.attackMod = 1;
        } else
        {
            // Spell
            damage = move.SpellCH(instance, PLAYERINSTANCE, ActiveSpell);
        }
          return damage;
    }
    TestHeal(move,opp,me)
    {
        return move.SpellCH(me, opp, ActiveSpell);
    }
}

// Enemy && Player Move
var SelectedMove = undefined;
var enemyMove = undefined;

// Initialize Enemies and player
var player = new Warrior("Random Guy", 80, 5, 0,1);
var opponent;
var boss1 = new Warrior("Gaion", 100, 5, 0);
var boss2 = new Warrior("Pairon", 100, 6, 0);
var boss3 = new Warrior("Stromron", 115, 5, 0);
SetStatsBox();

// Set Moves (player move assignment is completely temporary)
boss1.MovePool[0] = List[12];
boss1.MovePool[1] = List[1];
boss1.MovePool[2] = List[2];
boss1.MovePool[3] = List[14];
boss1.MovePool[4] = List[11];
boss1.MovePool[5] = List[5];
boss1.MovePool[6] = List[6];
boss1.MovePool[7] = List[7];
boss1.MovePool[8] = List[8];
boss1.MovePool[9] = List[9];

boss2.MovePool[0] = List[15];
boss2.MovePool[1] = List[4];
boss2.MovePool[2] = List[16];
boss2.MovePool[3] = List[18];
boss2.MovePool[4] = List[19];
boss2.MovePool[5] = List[21];
boss2.MovePool[6] = List[26];
boss2.MovePool[7] = List[25];
boss2.MovePool[8] = List[28];
boss2.MovePool[9] = List[20];

boss3.MovePool[0] = List[9];
boss3.MovePool[1] = List[38];
boss3.MovePool[2] = List[31];
boss3.MovePool[3] = List[40];
boss3.MovePool[4] = List[29];
boss3.MovePool[5] = List[35];
boss3.MovePool[6] = List[36];
boss3.MovePool[7] = List[37];
boss3.MovePool[8] = List[39];
boss3.MovePool[9] = List[44];


// Set Moves + GAMEPLAY: Player Turn && Opponent Turn
function SetMoves()
{
    for (let i = 0; i < MoveButtonsMenu.children.length; i++) 
    {
        MoveButtonsMenu.children[i].innerHTML = player.ActiveHand[i].name;
        MoveButtonsMenu.children[i].style.backgroundColor = player.ActiveHand[i].BGColor;
    }
}
function PTurn()
{
    // Player Turn
    if (SelectedMove != "undefined")
    {
        PlayerActionsText.push(player.name + " decided to use " + SelectedMove.name + "!");
        var Bef;
        if ('OnBeforeUse' in SelectedMove)
           Bef = SelectedMove.OnBeforeUse(player, opponent, ActiveSpell);

         if (SelectedMove.essenceRequired <= player.essence)
         {
             if (Bef != undefined)
             {
                for (let i = 0; i < Bef.length; i++)
                    PlayerActionsText.push(Bef[i]);
             }

             // Subtract Essence
             player.essence -= SelectedMove.essenceRequired;
             PHPContainer.children[0].children[2].innerHTML = player.essence;

                    // Attacking Moves
                    if (SelectedMove.power > 0)
                    {
                        let effects = SelectedMove.OnUse(player, opponent, ActiveSpell)
                        if (effects != undefined)
                        {
                            for (let i = 0; i < effects.length; i++)
                            {
                                PlayerActionsText.push(effects[i])
                                if (i + 1 == effects.length)
                                    PlayerActionsText.push(() => player.DealDamage(SelectedMove, opponent, enemyMove));
                            }
                        } else
                            PlayerActionsText.push(() => player.DealDamage(SelectedMove, opponent, enemyMove))


                        // Register used move
                        if (SelectedMove.TYPE.search("Terra") != -1)
                            player.usedTerra = true;
                        else if (SelectedMove.TYPE.search("Pyro") != -1)
                            player.usedPyro = true;
                        else if (SelectedMove.TYPE.search("Hydro") != -1)
                            player.usedHydro = true;
                        return;          
                    }

                    // Spell Moves
                    if (SelectedMove.spellpower > 0)
                    {
                        let effects = SelectedMove.OnUse(player, opponent, ActiveSpell)
                        if (effects != undefined)
                        {
                            for (let i = 0; i < effects.length; i++)
                            {
                                PlayerActionsText.push(effects[i])
                                if (i + 1 == effects.length)
                                    PlayerActionsText.push(() => player.DealSpellDamage(SelectedMove.SpellCH(player, opponent, ActiveSpell), opponent));
                            }
                        } else
                            PlayerActionsText.push(() => player.DealSpellDamage(SelectedMove.SpellCH(player, opponent, ActiveSpell), opponent))

                        // Register used move
                        if (SelectedMove.TYPE.search("Terra") != -1)
                            player.usedTerra = true;
                        else if (SelectedMove.TYPE.search("Pyro") != -1)
                            player.usedPyro = true;
                        else if (SelectedMove.TYPE.search("Hydro") != -1)
                            player.usedHydro = true;

                        return;      
                    }

                    // Status Moves
                    if (SelectedMove.status != "" && !SelectedMove.Defensive && !SelectedMove.takesSlot)
                    {
                           let effects = SelectedMove.OnUse(player, opponent, ActiveSpell);
                           for (let i = 0; i < effects.length; i++)
                               PlayerActionsText.push(effects[i]);


                        // Register used move
                        if (SelectedMove.TYPE.search("Terra") != -1)
                            player.usedTerra = true;
                        else if (SelectedMove.TYPE.search("Pyro") != -1)
                            player.usedPyro = true;
                        else if (SelectedMove.TYPE.search("Hydro") != -1)
                            player.usedHydro = true;

                           return;
                    }

                    // "Take Active Spell Slot" Moves 
                    if (SelectedMove.takesSlot)
                    {
                        // If this move clears the slot then...
                        if (SelectedMove.ClearSlot)
                        {
                            if (ActiveSpell != null)
                            {
                                let actions = SelectedMove.OnUse(player, opponent, ActiveSpell);
                                for (let i = 0; i < actions.length; i++) 
                                    PlayerActionsText.push(actions[i]);
                            }
                            else
                                PlayerActionsText.push("The active spell slot is already empty!!")

                            // Register used move
                            if (SelectedMove.TYPE.search("Terra") != -1)
                                player.usedTerra = true;
                            else if (SelectedMove.TYPE.search("Pyro") != -1)
                                player.usedPyro = true;
                            else if (SelectedMove.TYPE.search("Hydro") != -1)
                                player.usedHydro = true;

                            return;
                        }

                       let CanBeAttributed = SelectedMove.OnUse(player, opponent, ActiveSpell); // can we even put our active spell to use
                       // Set text && active spell
                        let T = (CanBeAttributed == true) ? player.name + " took the active spell slot with " + SelectedMove.name + "!" : "The active spell slot isn't empty, so it cannot be taken!!"
                       if (CanBeAttributed)
                       {
                           TookSpellSlot = "player";
                           SelectedMove.countdownSize = SelectedMove.OGcountdownSize;
                           ActiveSpell = SelectedMove

                           // Register used move
                           if (SelectedMove.TYPE.search("Terra") != -1)
                               player.usedTerra = true;
                           else if (SelectedMove.TYPE.search("Pyro") != -1)
                               player.usedPyro = true;
                           else if (SelectedMove.TYPE.search("Hydro") != -1)
                               player.usedHydro = true;
                       }
                          PlayerActionsText.push(T);     


                        return;
                    }

                    // Defensive Moves
                    if (SelectedMove.Defensive)
                    {
                        let effects = SelectedMove.OnUse(player, opponent, ActiveSpell);
                        if (effects != undefined)
                        {
                            for (let i = 0; i < effects.length; i++)
                                PlayerActionsText.push(effects[i]);
                        }

                        // Register used move
                        if (SelectedMove.TYPE.search("Terra") != -1)
                            player.usedTerra = true;
                        else if (SelectedMove.TYPE.search("Pyro") != -1)
                            player.usedPyro = true;
                        else if (SelectedMove.TYPE.search("Hydro") != -1)
                            player.usedHydro = true;

                        return;
                    }
         }
         else
         {
             PlayerActionsText.push(player.name + " doesn't have enough essence to use " + SelectedMove.name + ".");
             SelectedMove = undefined;
             return;
         }
    }
}
function OTurn() 
{
    // Opponent Turn
    if (enemyMove != undefined)
    {
        EnemyActionsText.push(opponent.name + " decided to use " + enemyMove.name + "!");
        var Bef;
        if ('OnBeforeUse' in enemyMove)
            Bef = enemyMove.OnBeforeUse(opponent, player, ActiveSpell)

        if (enemyMove.essenceRequired <= opponent.essence)
        {
            // If we have effects for before the battle.
            if (Bef != undefined)
            {
                for (let i = 0; i < Bef.length; i++)
                    EnemyActionsText.push(Bef[i]);
            }

            // Subtract Essence
            opponent.essence -= enemyMove.essenceRequired;

                    // Attacking Moves
                    if (enemyMove.power > 0)
                    {
                        let effects = enemyMove.OnUse(opponent, player, ActiveSpell)
                        if (effects != undefined)
                        {
                            for (let i = 0; i < effects.length; i++)
                            {
                                EnemyActionsText.push(effects[i])
                                if (i + 1 == effects.length)
                                    EnemyActionsText.push(() => opponent.DealDamage(enemyMove, player, SelectedMove));
                            }
                        } else
                            EnemyActionsText.push(() => opponent.DealDamage(enemyMove, player, SelectedMove))

                        // Register used move
                        if (enemyMove.TYPE.search("Terra") != -1)
                            opponent.usedTerra = true;
                        else if (enemyMove.TYPE.search("Pyro") != -1)
                            opponent.usedPyro = true;
                        else if (enemyMove.TYPE.search("Hydro") != -1)
                            opponent.usedHydro = true;

                        return;          
                    }

                    // Spell Moves
                    if (enemyMove.spellpower > 0)
                    {
                        let effects = enemyMove.OnUse(opponent, player, ActiveSpell)
                        if (effects != undefined)
                        {
                            for (let i = 0; i < effects.length; i++)
                            {
                                EnemyActionsText.push(effects[i])
                                if (i + 1 == effects.length)
                                    EnemyActionsText.push(() => opponent.DealSpellDamage(enemyMove.SpellCH(opponent, player, ActiveSpell),player));
                            }
                        } else
                            EnemyActionsText.push(() => opponent.DealSpellDamage(enemyMove.SpellCH(opponent, player, ActiveSpell), player));

                        // Register used move
                        if (enemyMove.TYPE.search("Terra") != -1)
                            opponent.usedTerra = true;
                        else if (enemyMove.TYPE.search("Pyro") != -1)
                            opponent.usedPyro = true;
                        else if (enemyMove.TYPE.search("Hydro") != -1)
                            opponent.usedHydro = true;
                             return;      
                    }

                    // Status Moves
                    if (enemyMove.status != "" && !enemyMove.Defensive && !enemyMove.takesSlot)
                    {
                           let effects = enemyMove.OnUse(opponent, player, ActiveSpell);
                           for (let i = 0; i < effects.length; i++)
                               EnemyActionsText.push(effects[i]);

                        // Register used move
                        if (enemyMove.TYPE.search("Terra") != -1)
                            opponent.usedTerra = true;
                        else if (enemyMove.TYPE.search("Pyro") != -1)
                            opponent.usedPyro = true;
                        else if (enemyMove.TYPE.search("Hydro") != -1)
                            opponent.usedHydro = true;

                           return;
                    }

                    // "Take Active Spell Slot" Moves 
                    if (enemyMove.takesSlot)
                    {
                        if (enemyMove.ClearSlot)
                        {
                            if (ActiveSpell != null)
                            {
                                let actions = enemyMove.OnUse(opponent, player, ActiveSpell);
                                for (let i = 0; i < actions.length; i++)
                                    EnemyActionsText.push(actions[i]);
                            }
                            else
                                EnemyActionsText.push("The active spell slot is already empty!!")

                            // Register used move
                            if (enemyMove.TYPE.search("Terra") != -1)
                                opponent.usedTerra = true;
                            else if (enemyMove.TYPE.search("Pyro") != -1)
                                opponent.usedPyro = true;
                            else if (enemyMove.TYPE.search("Hydro") != -1)
                                opponent.usedHydro = true;

                            return;
                        }

                        // Set text && active spell
                        let CanBeAttributed = enemyMove.OnUse(opponent, player, ActiveSpell); // can we even put our active spell to use
                        let T = (CanBeAttributed == true) ? player.name + " took the active spell slot with " + enemyMove.name + "!" : "The active spell slot has already been taken by " + opponent.name + "!";

                       if (CanBeAttributed)
                       {
                           TookSpellSlot = "opp"
                           ActiveSpell = enemyMove
                           EnemyActionsText.push(T);        
                       }

                        // Register used move
                        if (enemyMove.TYPE.search("Terra") != -1)
                            opponent.usedTerra = true;
                        else if (enemyMove.TYPE.search("Pyro") != -1)
                            opponent.usedPyro = true;
                        else if (enemyMove.TYPE.search("Hydro") != -1)
                            opponent.usedHydro = true;

                        return;
                    }

                    // Defensive Moves
                    if (enemyMove.Defensive)
                    {
                        let effects = enemyMove.OnUse(opponent, player, ActiveSpell);
                        for (let i = 0; i < effects.length; i++)
                            EnemyActionsText.push(effects[i]);

                        // Register used move
                        if (enemyMove.TYPE.search("Terra") != -1)
                            opponent.usedTerra = true;
                        else if (enemyMove.TYPE.search("Pyro") != -1)
                            opponent.usedPyro = true;
                        else if (enemyMove.TYPE.search("Hydro") != -1)
                            opponent.usedHydro = true;

                        return;
                    }
        }
        else
        {
            EnemyActionsText.push(opponent.name + " doesn't have enough essence to use " + enemyMove.name + ".");
            enemyMove = undefined;
            return;
        }
    }
}
function ActiveSPCH()
{
    if (ActiveSpell == null)
        return;

    ActiveSpell.countdownSize--;
    let Me;
    let Opp;

    if (TookSpellSlot == "player")
    {
        Me = player;
        Opp = opponent;
    }
    else
    {
        Me = opponent;
        Opp = player;
    }

    let Actions = ActiveSpell.OnTurnEnd(Me, Opp);
    if (Actions != undefined)
    {
        for (let i = 0; i < Actions.length; i++)
            ActiveSpellText.push(Actions[i]);
    }

}

// Level 1 Elements
var LevelXGroup = document.getElementById("LVX");

// Change Levels && Go Back to 
function BackToSelection()
{
    if (Transitioning)
        return;

    Transitioning = true;
    BGPanel.classList.remove("EnableClicks");

    setTimeout(function ()
    {
        BGPanel.classList.add("FadeI");
        SelectedMove = undefined;
    }, 350);

    SetStatsBox();

    setTimeout(function ()
    {
        BoxContainer1.disabled = true;
        BoxContainer2.disabled = true;
        PHPContainer.disabled = true;
        DisLevelSelect("Nay");
        BGPanel.classList.remove("FadeI");
        BGPanel.classList.remove("FadeO");
        BGPanel.classList.add("FadeO");
        ChangeNameCont.disabled = true;
        CurrentLevel = 0;

        if (Levels[0].classList.contains("WOOUT"))
        for (let i = 0; i < Levels.length; i++)
        {
            Levels[i].classList.remove("WOOUT");
        }

        switch (AccessLevel)
        {
            case 0: Levels[0].disabled = false;
                Levels[1].disabled = true;
                Levels[2].disabled = true;
                break;
            case 1: Levels[0].disabled = false;
             Levels[1].disabled = false;
             Levels[2].disabled = true;
                break;
            case 2: Levels[0].disabled = false;
                Levels[1].disabled = false; 
                Levels[2].disabled = false; 
                break;
                
        }

        LevelXGroup.disabled = true;
        GameContainer.disabled = true;
        TutPanel.style.visibility = "hidden";

        // Remove class, as to not fuck things over
        setTimeout(() => BGPanel.classList.remove("FadeO"), 1000);
    }, 1000);

    setTimeout(function ()
    {
        BGPanel.classList.add("EnableClicks");
        Transitioning = false;
    }, 2000);
}
function ChangeLevel(Level)
{

    for (let i = 0; i < player.MovePool.length; i++)
    {
        if (player.MovePool[i] == undefined)
        {
            Alert(false,"Your deck must be full of cards in order to enter a fight!")
            return;
        }
    }

    if (Alerting)
        Alert(true);


    if (Transitioning)
        return;

    WooButtons('Levels'); 

    Transitioning = true;
    BoxContainer1.disabled = false;
    BoxContainer2.disabled = false;
    BGPanel.disabled = false;
    BGPanel.classList.remove("EnableClicks");
    BGPanel.classList.remove("EventPopup")
    BGPanel.classList.remove("EventLeave")

    // Start Fade
    setTimeout(function ()
    {
        BGPanel.classList.remove("FadeI");
        BGPanel.classList.add("FadeI");

        // Set all necessary combat variables
        SelectedMove = undefined;
        ActiveSpell = null;
        PHPContainer.children[0].children[0].innerHTML = player.name;
        PHPContainer.children[0].children[1].max = player.maxhp;
        PHPContainer.children[0].children[1].value = player.hp;
        PHPContainer.children[0].children[2].innerHTML = player.hp + "/" + player.maxhp;
        PHPContainer.children[0].children[2].innerHTML = player.essence;
        PHPContainer.children[0].children[3].innerHTML = player.armor;
    }, 350);

    setTimeout(function ()
    {
        GameContainer.disabled = false;
        WooButtons("ACT")
        BoxContainer2.disabled = true;
        DisLevelSelect("Yay");
        BGPanel.classList.remove("FadeI");
        BGPanel.classList.add("FadeO");

        if (Levels[0].classList.contains("WOOUT"))
        for (let i = 0; i < Levels.length; i++)
        {
            Levels[i].classList.remove("WOOUT");
        }

        // set stats
        player.hp = player.maxhp;
        player.essence = 0;
        player.armor = 0;

        PHPContainer.children[0].children[1].value = player.maxhp;
        PHPContainer.children[0].children[2].innerHTML = player.essence;
        PHPContainer.children[0].children[3].innerHTML = player.armor;
        PHPContainer.children[0].children[4].innerHTML = player.hp + "/" + player.maxhp;
        PlayerActionsText.length = 0;
        EnemyActionsText.length = 0;
        ActiveSpellText.length = 0;
        Randomized = false;

        // Pick the specific level to show + end of fade
        switch (Level)
        {
            case 1: setTimeout(function ()
            {
                // Set stats
                boss1.hp = boss1.maxhp;
                boss1.essence = 0;
                boss1.armor = 0;

                opponent = boss1;
                CurrentLevel = 1;
                LevelXGroup.disabled = false;
                LevelXGroup.children[0].children[0].innerHTML = boss1.name;
                LevelXGroup.children[0].children[1].max = boss1.maxhp;
                LevelXGroup.children[0].children[1].value = boss1.hp;
            }, 300);
            break;
            case 2:
            {
                // Set stats
                boss2.hp = boss2.maxhp;
                boss2.essence = 0;
                boss2.armor = 0;

                opponent = boss2;
                CurrentLevel = 2;
                LevelXGroup.disabled = false;
                LevelXGroup.children[0].children[0].innerHTML = boss2.name;
                LevelXGroup.children[0].children[1].max = boss2.maxhp;
                LevelXGroup.children[0].children[1].value = boss2.hp;
            }
            break;
            case 3:
            {
                // Set stats
                boss3.hp = boss3.maxhp;
                boss3.essence = 0;
                boss3.armor = 0;

                opponent = boss3;
                CurrentLevel = 3;
                LevelXGroup.disabled = false;
                LevelXGroup.children[0].children[0].innerHTML = boss3.name;
                LevelXGroup.children[0].children[1].max = boss3.maxhp;
                LevelXGroup.children[0].children[1].value = boss3.hp;
            }
            break;
        }

        // Remove class, as to not fuck things over
        setTimeout(() => BGPanel.classList.remove("FadeO"), 1000);
    }, 1000);

    setTimeout(function ()
    {
        BGPanel.classList.add("EnableClicks");
        Transitioning = false;
        WooButtons("ACT")
    }, 2000);
}

// Stuff to do at program start
// Disable Game stuff
combatMenu.disabled = true;
BoxContainer1.disabled = true;
BoxContainer2.disabled = true;
PHPContainer.disabled = true;
TextBox.disabled = true;
GameContainer.disabled = true;

// Set CardList options the correct values/names
for (let i = 0; i < CardListT.options.length; i++)
{
    CardListT.options.item(i).value = List[i].name;
    CardListT.options.item(i).innerHTML = List[i].name;
}

for (let i = 0; i < CardListP.options.length; i++)
{
    CardListP.options.item(i).value = List[i + 15].name;
    CardListP.options.item(i).innerHTML = List[i + 15].name;
}

for (let i = 0; i < CardListH.options.length; i++)
{
    CardListH.options.item(i).value = List[i + 30].name;
    CardListH.options.item(i).innerHTML = List[i + 30].name;
}