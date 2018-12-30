/**
 * Manages computer turn and chooses position based on difficulty
 */
computerTurn(Player, Difficulty, Board, NewBoard) :-
    valid_moves(Board, Player, ValidPlays),
    choosePlay(Player, Difficulty, NewX, NewY, Board, ValidPlays),
    move(Player, NewX, NewY, Board, NewBoard).

/**
 * Move predicate for computer Yuki
 */
move(yuki, X, Y, Board, NewBoard) :-
    getYukiPosition(YukiX, YukiY, Board),
    removePlayerPosition(1, YukiX, YukiY, Board, NoYukiBoard),
    eatTree(X, Y, NoYukiBoard, NoTreeBoard),
    addPlayerPosition(1, X, Y, NoTreeBoard, NewBoard).

/**
 * Move predicate for computer Mina
 */
move(mina, X, Y, Board, NewBoard) :-
    getMinaPosition(MinaX, MinaY, Board),
    removePlayerPosition(2, MinaX, MinaY, Board, NoMinaBoard),
    addPlayerPosition(2, X, Y, NoMinaBoard, NewBoard).

/**
 * Modify board to remove tree from given position
 */
eatTree(X, Y, Board, NBoard) :-
    addToMultListCell(-3, X, Y, Board, NBoard).

/**
 * Player input is in the valid plays list
 */
checkValidPlayerInput([NewX, NewY], ValidX, ValidY, ValidPlays) :-
  member([NewX, NewY], ValidPlays),
  ValidX is NewX,
  ValidY is NewY.

/**
 * Player input is not on the valid plays list
 */
checkValidPlayerInput([NewX, NewY], ValidX, ValidY, ValidPlays) :-
  \+ member([NewX, NewY], ValidPlays),
  write('Invalid move!\n'),
  inputPosition(NewX2, NewY2),
  checkValidPlayerInput([NewX2, NewY2], ValidX, ValidY, ValidPlays).

/**
 * First Mina play is valid because it is not visible to Yuki and Yuki is not on that position
 */
isValidFirstPlay(MinaX, MinaY, ValidMinaX, ValidMinaY, YukiX, YukiY, Board) :-
  \+ isVisible(MinaX, MinaY, YukiX, YukiY, Board),
  \+ value(1, MinaX, MinaY, Board),
  ValidMinaX is MinaX,
  ValidMinaY is MinaY.

/**
 * First Mina play is invalid because Mina is visible to Yuki in that position
 */
isValidFirstPlay(MinaX, MinaY, ValidMinaX, ValidMinaY, YukiX, YukiY, Board) :-
  isVisible(MinaX, MinaY, YukiX, YukiY, Board),
  write('Invalid first coordinates! Try again:\n'),
  inputPosition(MinaX2, MinaY2),
  isValidFirstPlay(MinaX2, MinaY2, ValidMinaX, ValidMinaY, YukiX, YukiY, Board).

/**
 * First Mina play is invalid because Yuki is on that position
 */
isValidFirstPlay(MinaX, MinaY, ValidMinaX, ValidMinaY, YukiX, YukiY, Board) :-
  value(1, MinaX, MinaY, Board),
  write('Invalid first coordinates! Try again:\n'),
  inputPosition(MinaX2, MinaY2),
  isValidFirstPlay(MinaX2, MinaY2, ValidMinaX, ValidMinaY, YukiX, YukiY, Board).
