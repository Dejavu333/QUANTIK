    /**CLASSES**/
    class Player {

        //properties
        name;
        score = 0;
        turn;
        already = false;
        shapes = ["circle","cross","square","triangle"];

        //constructor
        constructor() {}
    }



    /**GLOBALS**/
    let _title = document.querySelector("#title");

    let _turnTimeLimit = 0;
    let _refreshIntervalId;

    let _playerOne = new Player();
    let _playerTwo = new Player();

    let _steps = 0;

    let _gameNumber = 1;

    let _boardArray = [
        ['0','1','2','3','4'],
        ['1','o','o','o','o'],
        ['2','o','o','o','o'],
        ['3','o','o','o','o'],
        ['4','o','o','o','o']
    ]

    let _selectTableAreaArray = ['O',
                                 'O']; 

    let _shapeDivArray =[ ['o','o','o','o'],
                             ['o','o','o','o'] ]; //every index is a div, which has an img child

    let _draggedElement = {
        value: "",
        cameFrom: "0 0"
    };
    let _elementUnderDraggedElement = null;
    let _placedElement = "";

    /**FUNCTIONS**/
    function showMenu() {

        document.body.innerHTML=document.body.innerHTML+
        `
            <p class="menuText" onclick="askName()">NEW GAME</p>
            <p class="menuText" onclick="showSavedGames()">SAVED GAMES</p>
        `;
    }

    let limit = false;
    function askName() {

        try{
        document.querySelector("table").remove();
        }
        catch{}
        if(limit==false) {
            document.body.innerHTML=document.body.innerHTML+
            `
                <input type="text" placeholder="p1 name" class="menuText names" ></input>
                <input type="text" placeholder="p2 name" class="menuText names" ></input>
                <input type="text" placeholder="turn(sec)" class="menuText names" id="turnTimeInput" ></input>
                <p class="menuText" onclick="chooseNames();setTurnLimit();gameStart()">PLAY</p>
            `;
            limit=true;
        }
    }

    function chooseNames() {

        let namesArray = document.querySelectorAll(".names");

        console.log("p1: "+namesArray[0].value,"p2: "+namesArray[1].value);
        _playerOne.name = namesArray[0].value;
        _playerTwo.name = namesArray[1].value;
    }

    function setTurnLimit() {

        let turnTimeInput = document.querySelector("#turnTimeInput");

        _turnTimeLimit = turnTimeInput.value;
    }

    function startTimer() {

        try{clearInterval( _refreshIntervalId) }
        catch{}

        let timer = document.querySelector("#timer");
        timer.innerText = _turnTimeLimit;

        if(Number(timer.innerText)>0) {

            _refreshIntervalId =  setInterval(function() {
                timer.innerText = Number(timer.innerText)-1;

                if(Number(timer.innerText)<4) {
                    
                    timer.style.color = "rgb(111, 32, 32)";
                }

                if(Number(timer.innerText)==0) {

                    if(_playerOne.turn==true) {winner=_playerTwo;_playerTwo.score++}
                    else if (_playerTwo.turn==true) {winner=_playerOne;_playerOne.score++}
                    var audio = new Audio(`./audio/time'sUp.wav`);
                    audio.play();
                    nextGame();
                }

            },1000);
        }     
    }

    function checkForWinner() {

        let winner = null;

        //horizontal
        for(i=1;i<=4;i++) {
            if(_boardArray[i][1].itsShape !== _boardArray[i][2].itsShape && _boardArray[i][1].itsShape !== _boardArray[i][3].itsShape && _boardArray[i][1].itsShape !== _boardArray[i][4].itsShape &&        
               _boardArray[i][2].itsShape !== _boardArray[i][3].itsShape && _boardArray[i][2].itsShape !== _boardArray[i][4].itsShape &&
               _boardArray[i][3].itsShape !== _boardArray[i][4].itsShape &&
               _boardArray[i][1].itsShape !=null && _boardArray[i][2].itsShape !=null && _boardArray[i][3].itsShape !=null && _boardArray[i][4].itsShape !=null
               ) 
            {
                if(_playerOne.turn==true) {winner=_playerOne;_playerOne.score++}
                else if (_playerTwo.turn==true) {winner=_playerTwo;_playerTwo.score++}
            }
        }

        //vertical
        for(i=1;i<=4;i++) {
            if(_boardArray[1][i].itsShape !== _boardArray[2][i].itsShape && _boardArray[1][i].itsShape !== _boardArray[3][i].itsShape && _boardArray[1][i].itsShape !== _boardArray[4][i].itsShape &&        
               _boardArray[2][i].itsShape !== _boardArray[3][i].itsShape && _boardArray[2][i].itsShape !== _boardArray[4][i].itsShape &&
               _boardArray[3][i].itsShape !== _boardArray[4][i].itsShape &&
               _boardArray[1][i].itsShape !=null && _boardArray[2][i].itsShape !=null && _boardArray[3][i].itsShape !=null && _boardArray[4][i].itsShape !=null
              ) 
            {
                if(_playerOne.turn==true) {winner=_playerOne;_playerOne.score++}
                else if (_playerTwo.turn==true) {winner=_playerTwo;_playerTwo.score++}
            }
        }

        //diagonal
        if(_boardArray[1][1].itsShape !== _boardArray[2][2].itsShape && _boardArray[1][1].itsShape !== _boardArray[3][3].itsShape && _boardArray[1][1].itsShape !== _boardArray[4][4].itsShape &&
           _boardArray[2][2].itsShape !== _boardArray[3][3].itsShape && _boardArray[2][2].itsShape !== _boardArray[4][4].itsShape &&
           _boardArray[3][3].itsShape !== _boardArray[4][4].itsShape &&
           _boardArray[1][1].itsShape !=null && _boardArray[2][2].itsShape !=null && _boardArray[3][3].itsShape !=null && _boardArray[4][4].itsShape !=null
          ) 
        {
            if(_playerOne.turn==true) {winner=_playerOne;_playerOne.score++}
            else if (_playerTwo.turn==true) {winner=_playerTwo;_playerTwo.score++}
        }
        else if(_boardArray[1][4].itsShape !== _boardArray[2][3].itsShape && _boardArray[1][4].itsShape !== _boardArray[3][2].itsShape && _boardArray[1][4].itsShape !== _boardArray[4][1].itsShape &&
                _boardArray[2][3].itsShape !== _boardArray[3][2].itsShape && _boardArray[2][3].itsShape !== _boardArray[4][1].itsShape &&
                _boardArray[3][2].itsShape !== _boardArray[4][1].itsShape &&
                _boardArray[1][4].itsShape !=null && _boardArray[2][3].itsShape !=null && _boardArray[3][2].itsShape !=null && _boardArray[4][1].itsShape !=null
               ) 
        {
            if(_playerOne.turn==true) {winner=_playerOne;_playerOne.score++}
            else if (_playerTwo.turn==true) {winner=_playerTwo;_playerTwo.score++}
        }

        if(winner!=null) {
           
            window.alert(winner.name+" won!!!");
            setTimeout(  function() { var audio = new Audio('./audio/coinSound.mp3');
            audio.play()},100)
        
            nextGame();
        }
        else if(winner===null && _steps===8) {
           
            window.alert("TIE");
            setTimeout(  function() { var audio = new Audio('./audio/tieSound.mp3');
            audio.play()},100)
       
            nextGame();
        }
    }

    function nextTurn(){    

            console.log(_playerOne.shapes);console.log(_playerTwo.shapes);
                
            let st1 = document.querySelector("#selectTable1");
            let arr1 = st1.querySelectorAll(".img");

            let st2 = document.querySelector("#selectTable2");
            let arr2 = st2.querySelectorAll(".img");
        
        if(_playerOne.turn==true) {
            _playerOne.turn=false;
            _playerTwo.turn=true;
            document.querySelector("#selectTable1").classList.remove("myTurn");
            document.querySelector("#selectTable2").classList.add("myTurn");

            for(i=0;i<arr1.length;i++) {
                arr1[i].setAttribute("draggable", "false");
            }
            for(i=0;i<arr2.length;i++) {
                arr2[i].setAttribute("draggable", "true");
            } 

        }
        else if(_playerTwo.turn==true) {
            _playerTwo.turn=false;
            _playerOne.turn=true;
            document.querySelector("#selectTable2").classList.remove("myTurn");
            document.querySelector("#selectTable1").classList.add("myTurn");

            for(i=0;i<arr1.length;i++) {
                arr1[i].setAttribute("draggable", "true");
            }
            for(i=0;i<arr2.length;i++) {
                arr2[i].setAttribute("draggable", "false");
            } 
        }
        _elementUnderDraggedElement = null;
        _placedElement = "";

        startTimer();
    }
    
    function gameStart() {

        //remove menu
        try{
        document.querySelector("#title").remove();document.querySelector(".menuText").remove();document.querySelector(".menuText").remove();document.querySelector(".names").remove();document.querySelector(".names").remove();document.querySelector("#turnTimeInput").remove();document.querySelector(".menuText").remove();
        document.querySelector("table").remove();    
        }
        catch{}

        //who goes first
        let random = Math.floor(Math.random() * 2);
        if(random==0) {_playerOne.turn=true;_playerTwo.turn=false;console.log(_playerOne.name + " goes first");}
        else if(random==1) {_playerTwo.turn=true;_playerOne.turn=false;console.log(_playerTwo.name + " goes first");}

        //game number
        (function setGameNumber() {

            let gameNumber = document.createElement("h1");
            gameNumber.innerText = "GAME 1";
            gameNumber.setAttribute("id","gameNumber");
            document.body.querySelector("#container").appendChild(gameNumber);

            gameNumber.innerText = `GAME ${_gameNumber}`;      
        })();

        //timer
        let timerP = document.createElement("p");
        timerP.setAttribute("id","timer");
        document.body.appendChild(timerP);
        startTimer();

        //saveButton
        const saveBtn = document.createElement("div");
        saveBtn.setAttribute("class","saveIcoDiv");
        
        saveBtn.innerHTML = 
        `
        <img id="saveIco" draggable="false" src="./pics/saveIco.png"></img>  
        `;
        saveBtn.addEventListener("click",inputField);
        document.body.appendChild(saveBtn);

        //board
        const board = document.querySelector("#board");
        for(i=1;i<5;i++) { 
            for(j=1;j<5;j++) {

                let h = innerHeight/6;
                let x = h * (i-1) * 1.2; 
                let y = h * (j-1) * 1.2;

                let spot = document.createElement("div");
                
                spot.style.width = "6rem";
                spot.style.height = "6rem";
                spot.style.position = "absolute";
                spot.style.display = "inline-block";
                spot.style.top =  `${x}px`;
                spot.style.left = `${y}px`;
                spot.style.backgroundColor = "wheat";
                spot.classList.add("spot");
                
                board.appendChild(spot);
                              
                //dragover on spot
                spot.addEventListener("dragover", dragover); 
                
                spot.addEventListener("dragleave",dragleave);

                //store globally
                spot.setAttribute("id",`${i},${j}`);
                let spotObject = 
                {
                    itsShape: null,
                    itsElement: spot
                }
                _boardArray[i][j] = spotObject;
            }
        }

        //1-1 selectTableArea
        const _selectTableArea = document.querySelector("#selectTableArea");
        for(i=0;i<2;i++) {
            
            let table = document.createElement("div");
            table.setAttribute("id",`selectTable${i+1}`);  
            _selectTableArea.appendChild(table);

            //store globally
            _selectTableAreaArray[i] = table;
            
            //4-4 shapeDiv
            for(j=0;j<4;j++) {

                let shapeDiv = document.createElement("div");
                shapeDiv.setAttribute("id",`p${i+1}Shape${j+1}Div`);
                shapeDiv.setAttribute("class","shapes");
                
                //pics inside the shapeDivs                      
                shapeDiv.innerHTML=
                `
                    <img class="shapes img imgH" draggable="false" src="./pics/${i+1} ${j+1}.jpg"></img>  
                `;

                //dragstart, dragend on images inside shapeDivs
                let img = shapeDiv.firstElementChild;
                if(_playerOne.turn==true) {i==0?img.setAttribute("draggable", "true"):img.setAttribute("draggable", "false");}      //if playerOne goes first, only his/her shapes are draggable
                else if(_playerTwo.turn==true) {i==1?img.setAttribute("draggable", "true"):img.setAttribute("draggable", "false");} //if playerOne goes first, only his/her shapes are draggable             

                img.addEventListener("dragstart", dragstart);

                img.addEventListener("dragend", dragend);

                //store globally
                _selectTableAreaArray[i].appendChild(shapeDiv);
                _shapeDivArray[i][j] = shapeDiv;
            }    
        }

        //myTurn
        _playerOne.turn==true ? _selectTableAreaArray[0].classList.add("myTurn") : _selectTableAreaArray[1].classList.add("myTurn");

        //names in select table area
        let p1 = document.createElement("p");
        let p2 = document.createElement("P");
            p1.innerText = `${_playerOne.name}   :${_playerOne.score} p`;
            p1.setAttribute("class","namesInSelectTableArea");
            p2.innerText = `${_playerTwo.name}   :${_playerTwo.score} p`;
            p2.setAttribute("class","namesInSelectTableArea");
                _selectTableAreaArray[0].appendChild(p1);
                _selectTableAreaArray[1].appendChild(p2);
    }

    function dragstart(event) {

        _elementUnderDraggedElement=null;
        let parent = event.target.parentElement

        if(_playerOne.turn==true && (parent.id=="p1Shape1Div"||parent.id=="p1Shape2Div"||parent.id=="p1Shape3Div"||parent.id=="p1Shape4Div")) {

            console.log(_playerOne.name + " grabbed from " + parent.id); 

            _draggedElement.value = event.target;
            _draggedElement.cameFrom = parent.id;
            _draggedElement.value.classList.add("dragging");
            setTimeout(function() {_draggedElement.value.style.display = "none";},0);
            //_playerOne.already=true;
        }
        else if(_playerTwo.turn==true && (parent.id=="p2Shape1Div"||parent.id=="p2Shape2Div"||parent.id=="p2Shape3Div"||parent.id=="p2Shape4Div")) {                  

            console.log(_playerTwo.name + " grabbed from " + parent.id); 

            _draggedElement.value = event.target;
            _draggedElement.cameFrom = parent.id;
            _draggedElement.value.classList.add("dragging");
            setTimeout(function() {_draggedElement.value.style.display = "none";},0);
            //_playerTwo.already=true;    
        }         
    }

    function dragend() {

        if(_playerOne.turn==true) {

            _draggedElement.value.classList.remove("dragging"); console.log("drag ended __________________")
            _draggedElement.value.style.display="inline-block";

            let index = Number(_draggedElement.cameFrom[7]-1);
            _draggedElement.value = "";                    
            _draggedElement.cameFrom = "";
                                                                                                    //_playerOne.already=false;  
            if(_elementUnderDraggedElement!==null) {
                var audio = new Audio('./audio/putSound.mp3');
                audio.play()
                _placedElement.style.display = "inline-block";
                _placedElement.classList.remove("imgH");
                _placedElement.setAttribute("draggable","false");
                _placedElement.parentElement.removeEventListener("dragover",dragover);
                _placedElement.parentElement.removeEventListener("dragleave",dragleave);
                _playerOne.shapes[index]=null;
                _steps++;
                
                checkForWinner();
                nextTurn();
            }
            else {var audio = new Audio('./audio/backInSelectTable.mp3');
            audio.play();}                  
        }

        else if(_playerTwo.turn==true) {

            _draggedElement.value.classList.remove("dragging"); console.log("drag ended __________________")
            _draggedElement.value.style.display="inline-block";

            let index = Number(_draggedElement.cameFrom[7]-1);
            _draggedElement.value = "";                    
            _draggedElement.cameFrom = "";
                                                                                                    //_playerTwo.already=false;                    
            if(_elementUnderDraggedElement!==null) {
                var audio = new Audio('./audio/putSound.mp3');
                audio.play()
                _placedElement.style.display = "inline-block";
                _placedElement.classList.remove("imgH");
                _placedElement.setAttribute("draggable","false");
                _placedElement.parentElement.removeEventListener("dragover",dragover);
                _placedElement.parentElement.removeEventListener("dragleave",dragleave);
                _playerTwo.shapes[index]=null;
                _steps++;
               
                checkForWinner();
                nextTurn();
            }
            else {var audio = new Audio('./audio/backInSelectTable.mp3');
            audio.play();}                                
        }    
    }

    function dragleave(event) {

        event.target.classList.remove("overMe");

        _placedElement = "";
            
        let removedShape = _elementUnderDraggedElement.removeChild(_elementUnderDraggedElement.firstElementChild);
        let whichPlayer = _draggedElement.cameFrom[1];              //the value of cameFrom is the ID of the shapeDiv (where the grabbed img came from) 
        let whichShape = _draggedElement.cameFrom[7];               //1 and 7 are the numbers in the ID, we need them as matrix indicies
  
        _shapeDivArray[whichPlayer-1][whichShape-1].appendChild(removedShape);          //indexing from zero
        
        rowInMatrix = event.target.id.split(',')[0];
        columnInMatrix = event.target.id.split(',')[1];
        _boardArray[rowInMatrix][columnInMatrix].itsShape = null;

        _elementUnderDraggedElement = null;
    }

    function dragover(event) {

        event.preventDefault();

        //player1 case
        if(_playerOne.turn==true) {

            console.log(_playerOne.name + " over me:" + event.target.id);
           
            event.target.setAttribute("class","overMe");

            //append
            event.target.appendChild(_draggedElement.value);

            //update boardArray state
            rowInMatrix = event.target.id.split(',')[0];    
            columnInMatrix = event.target.id.split(',')[1];
            let index = _draggedElement.cameFrom[7]-1;  console.log(_playerOne.shapes[index]);
            _boardArray[rowInMatrix][columnInMatrix].itsShape = _playerOne.shapes[index];

            //store globally
            _elementUnderDraggedElement = event.target;
            _placedElement = _elementUnderDraggedElement.firstChild;                      
        }

        //player2 case
        else if(_playerTwo.turn==true) {

            console.log(_playerTwo.name + " over me: " + event.target.id);

            event.target.setAttribute("class","overMe");

            //append
            event.target.appendChild(_draggedElement.value);

            //update boardArray state
            rowInMatrix = event.target.id.split(',')[0];    
            columnInMatrix = event.target.id.split(',')[1];
            let index = _draggedElement.cameFrom[7]-1;  console.log(_playerOne.shapes[index]);
            _boardArray[rowInMatrix][columnInMatrix].itsShape = _playerTwo.shapes[index];
          
            //store globally
            _elementUnderDraggedElement = event.target;
            _placedElement = _elementUnderDraggedElement.firstChild;
        }  
    }

    function updateScore() {
        let scores =  document.querySelectorAll(".namesInSelectTableArea");
        scores[0].innerText = `${_playerOne.name}   :${_playerOne.score} p`;
        scores[1].innerText = `${_playerTwo.name}   :${_playerTwo.score} p`;
    }

    function nextGame() {
        _gameNumber++;
        _steps = 0;
        document.body.innerHTML=`
        <div id="container">
            <h1 id="title">QUANTIK</h1>
            <div id="board"></div>
            <div id="selectTableArea"></div>
        </div>
        <script src="main.js"></script>`;
    
        gameStart();
        updateScore();
        reFillShapes();
    }

    function showSavedGames() {

        if(document.querySelector("table")==null) {
            let table =  document.createElement("table");
            let n = Object.keys(localStorage).length;       //returns an array with the keys only
            for(i=0;i<n;i++) {
                let tableRow = document.createElement("tr");
                tableRow.innerText = `${Object.keys(localStorage)[i]}`;
                let whichGame = `${Object.keys(localStorage)[i].split('_')[1]}`;
                tableRow.addEventListener("click", function() { loadGame(whichGame); });

                table.appendChild(tableRow);
            }
            document.body.appendChild(table);
        }
    }

    function saveGame(id) {
        
        let html = document.body.innerHTML;
        let file = {
            doc: html,
            gn : _gameNumber,
            p1 : _playerOne,
            p2 : _playerTwo,
            limit: _turnTimeLimit,
            boardStateJS: _boardArray,
            boardStateHTML: document.querySelector("#board").innerHTML,
            selectTableStateJS: _selectTableAreaArray,
            selectTableStateHTML: document.querySelector("#selectTableArea").innerHTML           
        };

        localStorage.setItem(`savedGame_${id}`,JSON.stringify(file));
    }

    function loadGame(id) {

        var file = JSON.parse(localStorage.getItem(`savedGame_${id}`));
  
        _gameNumber = file.gn;

        _turnTimeLimit = file.limit;
 
        _playerOne.name = file.p1.name;
        _playerOne.score = file.p1.score;

        _playerTwo.name = file.p2.name;
        _playerTwo.score = file.p2.score;

        document.body.innerHTML = file.doc;
        
        //reapply lost eventListeners
        let spotDivs = document.querySelectorAll(".spot")
        for(i=0;i<spotDivs.length;i++) {
            spotDivs[i].addEventListener("dragover", dragover);
            spotDivs[i].addEventListener("dragleave", dragleave);
        }
        let imgs = document.querySelectorAll(".img")
        for(i=0;i<imgs.length;i++) {
            imgs[i].addEventListener("dragstart", dragstart);
            imgs[i].addEventListener("dragend", dragend);
        }
        let saveBtn = document.querySelector(".saveIcoDiv");
        saveBtn.addEventListener("click",inputField);

        _playerOne.turn = file.p1.turn;
        _playerTwo.turn = file.p2.turn;
     
        _boardArray = file.boardStateJS;

        _selectTableAreaArray = file.selectTableStateJS;

    }

    function inputField() {
        let inputField = document.createElement("input");
        inputField.setAttribute("class","saveIcoDiv");
        inputField.addEventListener("keydown",function(e){
            if(e.key ==="Enter") {
                let value = inputField.value;
                inputField.remove();
                saveGame(`${value}`);
                var audio = new Audio('./audio/save.mp3');
                audio.play();
            }
            else if(e.key === "Escape") {
                inputField.remove();
            }

        });
        document.body.appendChild(inputField)
    }

    function reFillShapes() {
        _playerOne.shapes = ["circle","cross","square","triangle"];
        _playerTwo.shapes = ["circle","cross","square","triangle"];
    }


    /**INVOKE**/
        showMenu();
   
