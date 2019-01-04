/**
 * Manages computer turn and chooses position based on difficulty
 */
computerTurn(Player, Difficulty, Board, NewBoard) :-
    valid_moves(Board, Player, ValidPlays),
    choosePlay(Player, Difficulty, NewX, NewY, Board, ValidPlays),
    move(Player, NewX, NewY, Board, NewBoard).

/**
 * Manages computer first turn as yuki and chooses position based on difficulty
 */
computerFirstTurn(yuki, Difficulty, Board, NewBoard) :-
    chooseFirstPlay(yuki, Difficulty, NewX, NewY, Board),
    eatTree(NewX, NewY, Board, NoTreeBoard),
    addPlayerPosition(1, NewX, NewY, NoTreeBoard, NewBoard).

/**
 * Manages computer first turn as mina and chooses position based on difficulty
 */
computerFirstTurn(mina, Difficulty, Board, NewBoard) :-
    chooseFirstPlay(mina, Difficulty, NewX, NewY, Board),
    addPlayerPosition(2, NewX, NewY, Board, NewBoard).

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
