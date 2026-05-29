let playerId = null;

const payBtn =
document.getElementById("payBtn");

payBtn.addEventListener(
"click",
async () => {

    const name =
    document.getElementById(
        "playerName"
    ).value;

    if(!name){

        alert("Enter Name");

        return;
    }

    const res =
    await fetch(
        "http://localhost:5000/request-payment",
        {
            method:"POST",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:JSON.stringify({
                name
            })
        }
    );

    const data =
    await res.json();

    playerId = data.id;

    document.getElementById(
        "paymentSection"
    ).style.display="none";

    document.getElementById(
        "waitingSection"
    ).style.display="block";

    checkApproval();

});

function checkApproval(){

    const interval =
    setInterval(async ()=>{

        try{

            const res =
            await fetch(
            `http://localhost:5000/status/${playerId}`
            );

            const data =
            await res.json();

            if(data.approved){

                clearInterval(
                    interval
                );

                document.getElementById(
                    "waitingSection"
                ).style.display="none";

                startGame();

            }

        }catch(err){

            console.log(err);

        }

    },3000);

}

let score = 0;
let time = 10;

function startGame(){

    score = 0;
    time = 10;

    document.getElementById(
        "score"
    ).innerText = score;

    document.getElementById(
        "timer"
    ).innerText = time;

    document.getElementById(
        "gameSection"
    ).style.display="block";

    const gameInterval =
    setInterval(()=>{

        time--;

        document.getElementById(
            "timer"
        ).innerText = time;

        if(time <= 0){

            clearInterval(
                gameInterval
            );

            alert(
                "🎉 Game Over!\n\nScore: "
                + score
            );

            location.reload();

        }

    },1000);

}

document.getElementById(
"clickBtn"
).addEventListener(
"click",
()=>{

    score++;

    document.getElementById(
        "score"
    ).innerText = score;

});