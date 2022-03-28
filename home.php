<?php
  session_start();
  if(!isset($_SESSION["userid"])){
    header('Location: index.html');
    exit();
  }
?>

<!DOCTYPE html>
<html lang = "en">
    <meta charset="UTF-8">
    <head id="gameHead">
      <link rel="stylesheet" href="css/style.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css">
      <script src="Scripts/index.js" /></script>
      <script src="Scripts/login.js" ></script>
      <title>Muldle - Multiplayer Wordle</title>
    </head>
    <body>
        <nav class="top-bar b-b-blue">
              <div class="nav-left" onclick="onNavClick()"> Nav </div>
              <h1 class="title"> Muldle </h1>
              <button onclick="onAccountClick()"><?php echo $_SESSION["useruid"]; ?>'s Account</button>
              <a href="includes/logout.php" class="button" > Logout </a>
        </nav>
        <div id="gamespace"> 
            <div id = "game-container">
            <div id="player1-container" class="board-container board-l">
              <div class="board-title"> Your Board </div>
              <div id="player1-board" class="board">
                <div class="game-row" id="gamerow1">
                  <div class="guess-box" id="row1box1"></div>
                  <div class="guess-box" id="row1box2"></div>
                  <div class="guess-box" id="row1box3"></div>
                  <div class="guess-box" id="row1box4"></div>
                  <div class="guess-box" id="row1box5"></div>
                </div>
                <div class="game-row" id="gamerow2">
                  <div class="guess-box" id="row2box1"></div>
                  <div class="guess-box" id="row2box2"></div>
                  <div class="guess-box" id="row2box3"></div>
                  <div class="guess-box" id="row2box4"></div>
                  <div class="guess-box" id="row2box5"></div>
                </div>
                <div class="game-row" id="gamerow3">
                  <div class="guess-box" id="row3box1"></div>
                  <div class="guess-box" id="row3box2"></div>
                  <div class="guess-box" id="row3box3"></div>
                  <div class="guess-box" id="row3box4"></div>
                  <div class="guess-box" id="row3box5"></div>
                </div>
                <div class="game-row" id="gamerow4">
                  <div class="guess-box" id="row4box1"></div>
                  <div class="guess-box" id="row4box2"></div>
                  <div class="guess-box" id="row4box3"></div>
                  <div class="guess-box" id="row4box4"></div>
                  <div class="guess-box" id="row4box5"></div>
                </div>
                <div class="game-row" id="gamerow5">
                  <div class="guess-box" id="row5box1"></div>
                  <div class="guess-box" id="row5box2"></div>
                  <div class="guess-box" id="row5box3"></div>
                  <div class="guess-box" id="row5box4"></div>
                  <div class="guess-box" id="row5box5"></div>
                </div>
                <div class="game-row" id="gamerow6">
                  <div class="guess-box" id="row6box1"></div>
                  <div class="guess-box" id="row6box2"></div>
                  <div class="guess-box" id="row6box3"></div>
                  <div class="guess-box" id="row6box4"></div>
                  <div class="guess-box" id="row6box5"></div>
                </div>
              </div>
              <div id = "keyboard">
                <div class="row">
                  <button value="q" id="q" class = "key" onclick="keyboard(this)">q</button>
                  <button value="w" id="w" class = "key" onclick="keyboard(this)">w</button>
                  <button value="e" id="e" class = "key" onclick="keyboard(this)">e</button>
                  <button value="r" id="r" class = "key" onclick="keyboard(this)">r</button>
                  <button value="t" id="t" class = "key" onclick="keyboard(this)">t</button>
                  <button value="y" id="y" class = "key" onclick="keyboard(this)">y</button>
                  <button value="u" id="u" class = "key" onclick="keyboard(this)">u</button>
                  <button value="i" id="i" class = "key" onclick="keyboard(this)">i</button>
                  <button value="o" id="o" class = "key" onclick="keyboard(this)">o</button>
                  <button value="p" id="p" class = "key" onclick="keyboard(this)">p</button>
                </div>
                <div class = "row">
                  <button value="a" id="a" class = "key" onclick="keyboard(this)">a</button>
                  <button value="s" id="s" class = "key" onclick="keyboard(this)">s</button>
                  <button value="d" id="d" class = "key" onclick="keyboard(this)">d</button>
                  <button value="f" id="f" class = "key" onclick="keyboard(this)">f</button>
                  <button value="g" id="g" class = "key" onclick="keyboard(this)">g</button>
                  <button value="h" id="h" class = "key" onclick="keyboard(this)">h</button>
                  <button value="j" id="j" class = "key" onclick="keyboard(this)">j</button>
                  <button value="k" id="k" class = "key" onclick="keyboard(this)">k</button>
                  <button value="l" id="l" class = "key" onclick="keyboard(this)">l</button>
                </div>
                <div class = "row">
                  <button value="Enter" class = "key" onclick="keyboard(this)">enter</button>
                  <button value="z" id="z" class = "key" onclick="keyboard(this)">z</button>
                  <button value="x" id="x" class = "key" onclick="keyboard(this)">x</button>
                  <button value="c" id="c" class = "key" onclick="keyboard(this)">c</button>
                  <button value="v" id="v" class = "key" onclick="keyboard(this)">v</button>
                  <button value="b" id="b" class = "key" onclick="keyboard(this)">b</button>
                  <button value="n" id="n" class = "key" onclick="keyboard(this)">n</button>
                  <button value="m" id="m" class = "key" onclick="keyboard(this)">m</button>
                  <button value="Backspace" class = "key" onclick="keyboard(this)">back</button>
                </div>
              </div>
            </div>
            <div id="player2-container" class="board-container board-r l-border">
              <div class="board-title"> Opponent Board </div>
              <div id="player2-board" class="board">
                <div class="game-row">
                  <div class="guest-box"></div>
                  <div class="guest-box"></div>
                  <div class="guest-box"></div>
                  <div class="guest-box"></div>
                  <div class="guest-box"></div>
                </div>
                <div class="game-row">
                  <div class="guest-box"></div>
                  <div class="guest-box"></div>
                  <div class="guest-box"></div>
                  <div class="guest-box"></div>
                  <div class="guest-box"></div>
                </div>
                <div class="game-row">
                  <div class="guest-box"></div>
                  <div class="guest-box"></div>
                  <div class="guest-box"></div>
                  <div class="guest-box"></div>
                  <div class="guest-box"></div>
                </div>
                <div class="game-row">
                  <div class="guest-box"></div>
                  <div class="guest-box"></div>
                  <div class="guest-box"></div>
                  <div class="guest-box"></div>
                  <div class="guest-box"></div>
                </div>
                <div class="game-row">
                  <div class="guest-box"></div>
                  <div class="guest-box"></div>
                  <div class="guest-box"></div>
                  <div class="guest-box"></div>
                  <div class="guest-box"></div>
                </div>
                <div class="game-row">
                  <div class="guest-box"></div>
                  <div class="guest-box"></div>
                  <div class="guest-box"></div>
                  <div class="guest-box"></div>
                  <div class="guest-box"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
    <div id="status" class="status_window">
      <div class="status_content">
        <span class="close" onclick="closeStatus()" >&times;</span>
        <p id="status_paragraph"></p>
      </div>
    </div>
</html>
</html>