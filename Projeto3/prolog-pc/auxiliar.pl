/**
 * Add element to a list cell
 */
addToListCell(Value, 1, [L1 | L], [NewL1 | L]) :-
    NewL1 is L1+Value.

/**
 * Decrease X until arriving to needed X value
 */
addToListCell(Value, X, [L1 | L], [L1 | NB]) :-
    X > 1,
    NewX is X-1,
    addToListCell(Value, NewX, L, NB).

/**
 * Add element to multi dimensional list cell
 */
addToMultListCell(Value, X, 1, [B1 | B], [NB | B]) :-
    addToListCell(Value, X, B1, NB).

/**
 * Decrease Y until arriving to needed Y value
 */
addToMultListCell(Value, X, Y, [B1 | B], [B1 | NB]) :-
    Y > 1,
    NewY is Y-1,
    addToMultListCell(Value, X, NewY, B, NB).

/**
 * Replace element in a list
 */
replaceList(Value, 1, [_L1 | L], [Value | L]).

/**
 * Decrease X until arriving to needed X value
 */
replaceList(Value, X, [L1 | L], [L1 | NB]) :-
    X > 1,
    NewX is X-1,
    replaceList(Value, NewX, L, NB).

/**
 * Replace list element value in a multi dimensional list cell
 */
replaceMultList(Value, X, 1, [B1 | B], [NB | B]) :-
    replaceList(Value, X, B1, NB).

/**
 * Decrease Y until arriving to needed Y value
 */
replaceMultList(Value, X, Y, [B1 | B], [B1 | NB]) :-
    Y > 1,
    NewY is Y-1,
    replaceMultList(Value, X, NewY, B, NB).

/**
 * Check if element exists in a list
 */
checkValueList(Value, X, List) :-
    nth1(X, List, Value).

/**
 * Verifies if determined value is on determined position
 */
value(Value, X, Y, Board) :-
    nth1(Y, Board, SubList),
    nth1(X, SubList, Value).

/**
 * Add all elements of list
 */
sumMultList(Sum, Sum, []).

sumMultList(Sum, Total, [B1 | B]) :-
    sumlist(B1, TotalList),
    NewSum is Sum+TotalList,
    sumMultList(NewSum, Total, B).

/**
 * Get Yuki position
 */
getYukiPosition(YukiX, YukiY, Board) :-
    value(1, YukiX, YukiY, Board).

/**
 * Get Mina (on empty spot) position
 */
getMinaPosition(MinaX, MinaY, Board) :-
    value(2, MinaX, MinaY, Board).

/**
 * Get Mina (on tree) position
 */
getMinaPosition(MinaX, MinaY, Board) :-
    value(5, MinaX, MinaY, Board).

/**
 * Removes player from the board
 */
removePlayerPosition(Player, X, Y, Board, NBoard) :-
    addToMultListCell(-Player, X, Y, Board, NBoard).

/**
 * Adds player to the board
 */
addPlayerPosition(Player, X, Y, Board, NBoard) :-
    addToMultListCell(Player, X, Y, Board, NBoard).

/**
 * Remove both Mina (on empty spot) and Yuki from the board
 */
removePlayersBoard(Board, NewBoard) :-
    value(1, YukiX, YukiY, Board),
    removePlayerPosition(1, YukiX, YukiY, Board, NoYukiBoard),
    value(2, MinaX, MinaY, NoYukiBoard),
    removePlayerPosition(2, MinaX, MinaY, NoYukiBoard, NewBoard).

/**
 * Remove both Mina (on tree) and Yuki from the board
 */
removePlayersBoard(Board, NewBoard) :-
    value(1, YukiX, YukiY, Board),
    removePlayerPosition(1, YukiX, YukiY, Board, NoYukiBoard),
    value(5, MinaX, MinaY, NoYukiBoard),
    removePlayerPosition(5, MinaX, MinaY, NoYukiBoard, NewBoard).

/**
 * Calculates the distances between points V to the point [X, Y]
 */
calcDistances([], _X, _Y, []).

calcDistances([V1 | V], X, Y, [D1 | D]) :-
    calcDistance(V1, X, Y, D1),
    calcDistances(V, X, Y, D).

calcDistance(V1, X2, Y2, D) :-
    checkValueList(X1, 1, V1),
    checkValueList(Y1, 2, V1),
    X is X2-X1,
    Y is Y2-Y1,
    XP2 is X**2,
    YP2 is exp(Y,2),
    X2Y2 is XP2+YP2,
    D is sqrt(X2Y2).

/**
 * Gets all indexes of element X from given list
 */
getIndexesOf(_X, _Index, [], []).

getIndexesOf(X, Index, [L1 | L], Indexes) :-
    L1 =\= X,
    NewIndex is Index+1,
    getIndexesOf(X, NewIndex, L, Indexes).

getIndexesOf(X, Index, [L1 | L], [I1 | I]) :-
    L1 == X,
    I1 is Index,
    NewIndex is Index+1,
    getIndexesOf(X, NewIndex, L, I).

/**
 * Gets opposite player
 */
getOppositePlayer('Mina', 'Yuki').

getOppositePlayer('Yuki', 'Mina').

/**
 * Gets next type (player or computer)
 */
getNextType('p', 1, 'p').

getNextType('p', 2, 'c').

getNextType('c', 2, 'p').

getNextType('c', 3, 'c').

/**
 * Gets JSON header. s is success and e is error.
 */
getJSONHeader(s, '"success":true,"data"').

getJSONHeader(e, '"success":false,"error"').
