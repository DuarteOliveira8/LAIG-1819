/**
 * Chooses the best first play out of the valid ones for Mina
 */
chooseBestFirstMinaPlay(MinaX, MinaY, Board) :-
  value(1, YukiX, YukiY, Board),
  findall([X,Y], (between(1,10,X), between(1,10,Y), \+isVisible(X, Y, YukiX, YukiY, Board)), ValidPlays),
  calcDistances(ValidPlays, YukiX, YukiY, Distances),
  max_member(MaxD, Distances),
  getIndexesOf(MaxD, 1, Distances, Indexes),
  length(Indexes, ILength),
  Upper is ILength+1,
  random(1, Upper, Index),
  checkValueList(ValidPlayIndex, Index, Indexes),
  checkValueList(Position, ValidPlayIndex, ValidPlays),
  checkValueList(MinaX, 1, Position),
  checkValueList(MinaY, 2, Position).

/**
 * Chooses a random first play out of the valid ones for Mina
 */
chooseRandomFirstPlay('Mina', MinaX, MinaY, Board) :-
  value(1, YukiX, YukiY, Board),
  findall([X,Y], (between(1,10,X), between(1,10,Y), \+isVisible(X, Y, YukiX, YukiY, Board)), ValidPlays),
  length(ValidPlays, Length),
  Upper is Length+1,
  random(1, Upper, Index),
  checkValueList(Position, Index, ValidPlays),
  checkValueList(MinaX, 1, Position),
  checkValueList(MinaY, 2, Position).

/**
 * Chooses a random first play out of the valid ones for Yuki
 */
chooseRandomFirstPlay('Yuki', YukiX, YukiY, _Board) :-
  random(1, 11, YukiX),
  random(1, 11, YukiY).

/**
 * Chooses the first play predicate on easy difficulty of Player
 */
chooseFirstPlay(Player, 1, X, Y, Board) :-
  chooseRandomFirstPlay(Player, X, Y, Board).

/**
 * Chooses the best first play for Mina on hard difficulty
 */
chooseFirstPlay('Mina', 2, X, Y, Board) :-
  chooseBestFirstMinaPlay(X, Y, Board).

/**
 * Chooses a random first play for Yuki on hard difficulty
 */
chooseFirstPlay('Yuki', 2, X, Y, Board) :-
  chooseRandomFirstPlay('Yuki', X, Y, Board).

/**
 * Chooses the best play from the valid ones for Yuki (Mina with value 2 - on empty spot)
 */
chooseBestPlay('Yuki', YukiX, YukiY, Board, ValidPlays) :-
  value(2, MinaX, MinaY, Board),
  calcDistances(ValidPlays, MinaX, MinaY, Distances),
  min_member(MaxD, Distances),
  getIndexesOf(MaxD, 1, Distances, Indexes),
  length(Indexes, ILength),
  Upper is ILength+1,
  random(1, Upper, Index),
  checkValueList(ValidPlayIndex, Index, Indexes),
  checkValueList(Position, ValidPlayIndex, ValidPlays),
  checkValueList(YukiX, 1, Position),
  checkValueList(YukiY, 2, Position).

/**
 * Chooses the best play from the valid ones for Yuki (Mina with value 5 - on tree)
 */
chooseBestPlay('Yuki', YukiX, YukiY, Board, ValidPlays) :-
  value(5, MinaX, MinaY, Board),
  calcDistances(ValidPlays, MinaX, MinaY, Distances),
  min_member(MaxD, Distances),
  getIndexesOf(MaxD, 1, Distances, Indexes),
  length(Indexes, ILength),
  Upper is ILength+1,
  random(1, Upper, Index),
  checkValueList(ValidPlayIndex, Index, Indexes),
  checkValueList(Position, ValidPlayIndex, ValidPlays),
  checkValueList(YukiX, 1, Position),
  checkValueList(YukiY, 2, Position).

/**
 * Chooses the best play from the valid ones for Mina
 */
chooseBestPlay('Mina', MinaX, MinaY, Board, ValidPlays) :-
  value(1, YukiX, YukiY, Board),
  calcDistances(ValidPlays, YukiX, YukiY, Distances),
  max_member(MaxD, Distances),
  getIndexesOf(MaxD, 1, Distances, Indexes),
  length(Indexes, ILength),
  Upper is ILength+1,
  random(1, Upper, Index),
  checkValueList(ValidPlayIndex, Index, Indexes),
  checkValueList(Position, ValidPlayIndex, ValidPlays),
  checkValueList(MinaX, 1, Position),
  checkValueList(MinaY, 2, Position).

/**
 * Chooses a random play from the validplays list
 */
chooseRandomPlay(X, Y, ValidPlays) :-
  length(ValidPlays, Length),
  Upper is Length+1,
  random(1, Upper, Index),
  checkValueList(Position, Index, ValidPlays),
  checkValueList(X, 1, Position),
  checkValueList(Y, 2, Position).

/**
 * Chooses a random play for a player in easy difficulty
 */
choosePlay(_Player, 1, X, Y, _Board, ValidPlays) :-
  chooseRandomPlay(X, Y, ValidPlays).

/**
 * Chooses a random play for a player in hard difficulty
 */
choosePlay(Player, 2, X, Y, Board, ValidPlays) :-
  chooseBestPlay(Player, X, Y, Board, ValidPlays).

/**
 * Display loading message
 */
writeChoosingMessage :-
  write('Elon Musk\'s best AI is thinking'),
  sleep(0.5),
  write('.'),
  sleep(0.5),
  write('.'),
  sleep(0.5),
  write('.'),
  sleep(0.5),
  nl.
