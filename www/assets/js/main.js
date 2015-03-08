
function init(){

    var canvas = document.getElementById("testCanvas");
    var stage = new createjs.Stage(canvas);

    var alphabetArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    var wordList = ["apple", "orange", "dog", "hci", "xml", "html", "jquery", "php", "laravel"];
    var theWord = "";
    var guessWord = [];
    var newGuessWord = "";
    var numWrong = 0;
    var gameOver = false;
    var guessedLetters = [];
    var hangmanShape = new createjs.Shape();
    var theWordText = new createjs.Text("", "bold 35px Arial", "#000000");
    var theOutComeText = new createjs.Text("", "bold 50px Arial", "#FF0000");

    theOutComeText.x = 90;
    theOutComeText.y = 200;
    theWordText.x = 50;
    theWordText.y = 27;
    stage.addChild(theWordText, theOutComeText);
    stage.addChild(hangmanShape);
    createjs.Ticker.addEventListener("tick", handleTick);

    function handleTick(event) {
      stage.update()
    }


    function startGame() {//Star the Game
        hangmanShape.graphics.clear();
        createGuessWord();
        drawCanvas();
        theOutComeText.text = "";
        enableButtons();
        addKeyListener();
        
    }

    function createGuessWord() {//Random Palabra
        guessWord = new Array();
        var randomWord = Math.floor(Math.random() * wordList.length);
        theWord = wordList[randomWord];
        for (var i = 0; i < theWord.length; i++) {
            guessWord[i] = "?";
        }
        newGuessWord = guessWord.join("");
    }

    function drawGallows() {
        hangmanShape.graphics.moveTo(120, 305);
        hangmanShape.graphics.lineTo(280, 305);
        hangmanShape.graphics.moveTo(260, 305);
        hangmanShape.graphics.lineTo(260, 70);
        hangmanShape.graphics.lineTo(180, 70);
        hangmanShape.graphics.lineTo(180, 96);


    }

    function drawHead() {
        hangmanShape.graphics.arc(180, 120, 23, 0, Math.PI * 2, false);
        hangmanShape.graphics.closePath();

    }

    function drawBody() {
        hangmanShape.graphics.moveTo(180, 143);
        hangmanShape.graphics.lineTo(180, 248);

    }

    function drawArm1() {
        hangmanShape.graphics.moveTo(180, 175);
        hangmanShape.graphics.lineTo(142, 167);

    }

    function drawArm2() {
        hangmanShape.graphics.moveTo(180, 175);
        hangmanShape.graphics.lineTo(218, 167);

    }

    function drawLeg1() {
        hangmanShape.graphics.moveTo(180, 245);
        hangmanShape.graphics.lineTo(145, 270);

    }

    function drawLeg2() {
        hangmanShape.graphics.moveTo(180, 245);
        hangmanShape.graphics.lineTo(215, 270);

    }

    function drawHangman(drawNum) {
        hangmanShape.graphics.setStrokeStyle(1).beginStroke("rgba(0,0,0,1)");
        switch (drawNum) {
            case 0:
                drawGallows();// Dibujas la horca
                break;
            case 1:
                drawHead();// Manos
                break;
            case 2:
                drawBody();//Cuerpo
                break;
            case 3:
                drawArm1();//Mano
                break;
            case 4:
                drawArm2();
                break;
            case 5:
                drawLeg1();
                break;
            case 6:
                drawLeg2();
                break;
        }
    }

    function drawCanvas() {
       hangmanShape.graphics.clear();

        for (var i = 0; i <= numWrong; i++) {//Segun el numero de errores dibujar
            drawHangman(i);
        }

        if (gameOver) { //Si se ha perdido el Juego Reiniciar
            disableButtons();
            removeKeyListener();
            theOutComeText.text = "You Lose";
            theOutComeText.color = "#FF0000";
            theWordText.text = theWord;
            setTimeout(function(){ doGameOver() }, 3000);
        } else {
            theWordText.text = newGuessWord;
        }

    }

    for (var i = 0; i < alphabetArray.length; i++) {//Rellenar el Div de Botones con respectivo #id
        $('<button/>', {
            text: alphabetArray[i],
            id: 'btn_' + alphabetArray[i],
            width: "30px",
            click: function (event) {
                checkGuess(event, false);
            }
        }).appendTo("#buttondiv");
    }

    function disableButtons() {//Desabilitar los botones que han sido pulsados
        $("#buttondiv button").attr("disabled", "disabled");
    }
    disableButtons();

    function enableButtons() {
        $("#buttondiv button").removeAttr("disabled");
    }

    function addKeyListener() {//Listener al pulsar una tecla
        $(document).on("keyup", function (event) {
            checkGuess(event, true);

        });
    }

    function removeKeyListener() {
        $(document).off("keyup");
    }

    function checkGuess(event,isKeyPress){
    	var currentButton;
    	var theLetter;
		var RegEx = /[a-zA-Z]/;
        var correctGuess = false;

        if(isKeyPress){
    		currentButton = "btn_"+String.fromCharCode(event.keyCode);
    		theLetter = $("#"+currentButton).text().toLowerCase();
    		$("#"+currentButton).attr("disabled", "disabled");
    		if(!RegEx.test(theLetter)){
    			return;
    		}
    	}else{
    	   currentButton = $(event.target);
    	   $(currentButton).attr("disabled", "disabled");
    	   theLetter = $(currentButton).text().toLowerCase();
    	}
    	
    	if(guessedLetters.indexOf(theLetter) >=0){
    		return;
    	}else{
    		guessedLetters.push(theLetter);
    	}
    		
    		for(var i =0;i<theWord.length;i++){//Revisar si coincide la letra seleccionada con alguna de la oculta
    			if(theWord.charAt(i) == theLetter){
    				guessWord[i] = theLetter; //Desocultar
    				correctGuess = true;
    			}
    		}
    			newGuessWord = guessWord.join("");
    			
    		if(!correctGuess){//Error en coincidencia de letra un error mas
    			numWrong++
    		}
    		if(newGuessWord == theWord){//Si se han logrado completar la palabra
    		  disableButtons();
    		  removeKeyListener();
              theOutComeText.text = "YOU WIN";
              theOutComeText.color = "#00FF00";
              theWordText.text = theWord;
    		  setTimeout(function(){ doGameOver() },3000);
    		}
    		if(numWrong == 6){//Si se han agotado las oportunidades
    			gameOver = true;
    		}
    		drawCanvas();
        }

    	function doGameOver(){// Lost Game
        	numWrong = 0;
        	gameOver = false;
        	guessedLetters = new Array();
            startGame();
    	}
        
        startGame();
}
