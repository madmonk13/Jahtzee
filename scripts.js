var totalRolls = 0;
var scoreChoice = 0;
var yahtzeeBonus = 0;
var limitRolls = 3;
var score = 0;

const rollDice = new Audio('roll.mp3');

function resetGame(confirm){
    if ( confirm === true && score != 0 ){
        if ( window.confirm("Abandon current game?") === false ){
            return;
      }
    }
    totalRolls = 0;
    scoreChoice = 0;
    yahtzeeBonus = 0;
    score = 0;
    let dice = document.getElementById("current").getElementsByTagName("input");
    for (var i in dice ){
        dice[i].className = "die";
        dice[i].value = "";
    }
    let inputs = document.getElementById("scores").getElementsByTagName("input");
    for ( var i in inputs ){
        if ( inputs[i].type == "checkbox" ){
            inputs[i].checked = false;
            inputs[i].disabled = false;
        }
        else if ( inputs[i].type == "text" ){
            inputs[i].value = 0;
            if (
                inputs[i].id != "bonus_1" &&
                inputs[i].id != "total_1" &&
                inputs[i].id != "total_2" &&
                inputs[i].id != "total_3" &&
                inputs[i].id != "bonus_2" &&
                inputs[i].id != "grandTotal"
            ){
                inputs[i].removeAttribute("set");
            }
        }
    }                
    document.getElementById("roll").removeAttribute("disabled");
    document.getElementById("roll").innerHTML = "Roll ("+(limitRolls-totalRolls)+")";
    checkVals();
}
function isDone(){
    let inputs = document.getElementById("scores").getElementsByTagName("input");
    for ( var i in inputs ){
        if ( inputs[i].type == "text" ){
            if ( !inputs[i].getAttribute('set') || inputs[i].getAttribute('set') == "false" ){
                return;
            }
        }
    }
    alert( "Game Over\nScore: "+score );
    document.getElementById("roll").setAttribute("disabled","true");
}
function roll(){
    rollDice.play();
    if ( totalRolls == limitRolls ){
        return;
    }
    scoreChoice = 0;
    totalRolls++;
    let dice = document.getElementById("current").getElementsByTagName("input");
    for (var i in dice ){
        if ( dice[i].className && dice[i].className.indexOf("hold") == -1 ){
            if ( dice[i].type == "text" ){
                dice[i].classList.add("rolling");
            }
        }
    }
    setTimeout(()=>{
        let dice = document.getElementById("current").getElementsByTagName("input");
        for (var i in dice ){
            if ( dice[i].className && dice[i].className.indexOf("hold") == -1 ){
                if ( dice[i].type == "text" ){
                    let roll = Math.floor(Math.random()*6)+1;
                    dice[i].value = roll
                    dice[i].className = "die_"+roll;
                    dice[i].classList.add("rolling");
                }
            }
        }
        checkVals();
    },500);
    document.getElementById("roll").innerHTML = "Roll("+(limitRolls-totalRolls)+")";
    setTimeout(()=>{
        let dice = document.getElementById("current").getElementsByTagName("input");
        for (var i in dice ){
            if (dice[i].classList ){
                dice[i].classList.remove("rolling");
            }
        }
    },1000);
}
function clearRoll(){
    let dice = document.getElementById("current").getElementsByTagName("input");
    for (var i in dice ){
        dice[i].classList.remove("rolling");
    }
}
function toggle(die){
    if ( die.className.indexOf("hold") == -1 ){
        die.className += " hold";
    }
    else {
        die.classList.remove("hold");
    }
}
function currentDice(){
    let dice = document.getElementById('current').getElementsByTagName('input');
    let data = [];
    for (var i in dice ){
        if ( dice[i].value != undefined && !isNaN(dice[i].value) && dice[i].value != "" ){
            data.push(dice[i].value);
        }
    }
    return data;
}
function setScoreIfOpen(id,score){
    if ( document.getElementById(id).getAttribute("set") != "true" ){
        document.getElementById(id).value = score;
        if (score >= 1 ){
            document.getElementById(id).classList.add("scoreOption");
        }
        else {
            document.getElementById(id).classList.remove("scoreOption");
        }
    }
}
function checkVals(){
    let dice = currentDice();
    let vals = document.getElementById('scores').getElementsByTagName('input');
    for ( var x = 1; x <=6; x++ ){
        let score = 0;
        for ( var i in dice ){
            if ( dice[i] == x ){
                score += x;
            }
        }
        setScoreIfOpen("num_"+x,score);
    }
    setScoreIfOpen('kind_3',nOfAKind(3,dice));
    setScoreIfOpen('kind_4',nOfAKind(4,dice));
    setScoreIfOpen('kind_5',nOfAKind(5,dice));
    setScoreIfOpen('fullHouse',fullHouse(dice));
    setScoreIfOpen('chance',chance(dice));
    setScoreIfOpen('straightSm',straight(4,dice));
    setScoreIfOpen('straightLg',straight(5,dice));
    document.getElementById('bonus_1').value = checkUpperBonus();
    document.getElementById('total_1').value = totalFields(['num_1','num_2','num_3','num_4','num_5','num_6','bonus_1']);
    document.getElementById('total_3').value = totalFields(['kind_3','kind_4','fullHouse','straightSm','straightLg','kind_5','chance','bonus_2']);
    document.getElementById('grandTotal').value = totalFields(['total_1','total_3']);
    score = totalFields(['total_1','total_3']);
}
function checkUpperBonus(){
    let total = 0;
    let checkFields = ['num_1','num_2','num_3','num_4','num_5','num_6'];
    for ( var i in checkFields ){
        if ( document.getElementById(checkFields[i]).getAttribute('set') ){
            total += parseInt(document.getElementById(checkFields[i]).value);
        }
    }
    if ( total >= 63 ){
        return 35;
    }
    else return 0;
}
function totalFields(fields){
    let total = 0;
    for ( var i in fields ){
        if ( document.getElementById(fields[i]).getAttribute('set') ){
            total += parseInt(document.getElementById(fields[i]).value);
        }
    }
    return total;
}
function nOfAKind(n,dice){
    for ( var v = 1; v <= 6; v++ ){
        let count = 0;
        for ( var i in dice ){
            if ( v == dice[i] ){
                count++;
            }
            if ( count >= n ){
                if ( n == 5 ){
                    return 50;
                }
                return v*n;
            }
        }
    }
    return 0;
}
function chance(dice){
    let total = 0;
    for ( var i in dice ){
        if ( !isNaN(parseInt(dice[i]))){
            total += parseInt(dice[i]);
        }
    }
    if ( isNaN(total) ){
        return 0;
    }
    return total;
}
function getCounts(dice){
    dice.sort();
    let counts = [];
    for ( var d = 1; d <= 6; d++ ){
        counts[d] = 0;
        for ( var i in dice ){
            if ( dice[i] == d ){ counts[d]++; }
        }
    }
    return counts;
}
function fullHouse(dice){
    let check = getCounts(dice);
    if ( check.indexOf(2) != -1 && check.indexOf(3) != -1 ){
        return 25;
    }
    return 0;
}
function straight(type,dice){
    let seq = 1;
    let prev = 0;
    for ( var i in dice ){
        if ( 
            prev != 0 && 
            parseInt(prev)+1 == parseInt(dice[i]) 
        ){
        seq++;
        }
        prev = dice[i];
    }
    if ( seq >= type ){
        if ( type == 4 ){
            return 30;
        }
        else if (type == 5 ){
            return 40;
        }
    }
    return 0;
}
function lockField(box,id){
    if ( scoreChoice >= 1 ){
        box.checked=false;
        console.log(box);
        return;
    }
    if ( box.checked === true ){
        document.getElementById(id).classList.remove("scoreOption");
        document.getElementById(id).setAttribute("set",true);
        box.setAttribute("disabled",true);
        let dice = document.getElementById('current').getElementsByTagName('input');
        for ( var i in dice ){
            if ( dice[i].classList ){
                dice[i].classList.remove("hold");
            }
        }
        totalRolls = 0;
        document.getElementById("roll").innerHTML = "Roll ("+(3-totalRolls)+")";
        if ( 
            dice[0].value == dice[1].value &&
            dice[1].value == dice[2].value &&
            dice[2].value == dice[3].value &&
            dice[3].value == dice[4].value
        ){
            console.log("Yahtzee!",yahtzeeBonus);
            if ( yahtzeeBonus >= 1 ){
                document.getElementById('bonus_2').value = 100;
            }
            if ( id == "kind_5"){
                yahtzeeBonus++;
            }
        }
    }
    // else {
    //     document.getElementById(id).setAttribute("set",false);
    // }
    checkVals();
    isDone();
    scoreChoice++;
}
