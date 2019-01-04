:- use_module(library(system)).
:- use_module(library(lists)).
:- use_module(library(between)).
:- use_module(library(random)).
:- use_module(library(sockets)).
:- use_module(library(codesio)).

%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%
%                                              Server                                                   %
%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%

/**
 * Server port.
 */
port(8081).

/**
 * Server inicialization predicate.
 */
server :-
	port(Port),
	socket_server_open(Port, Socket),
	write('Opened Server'),nl,nl,
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl.

server_loop(Socket) :-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
		write('Accepted connection'), nl,

	    % Parse Request
		catch((
			read_request(Stream, Request),
			read_header(Stream)
		),_Exception,(
			write('Error parsing request.'),nl,
			close_stream(Stream),
			fail
		)),

		% Generate Response
		handle_request(Request, MyReply, Status),
		format('Request: ~q~n',[Request]),
		format('Reply: ~q~n', [MyReply]),

		% Output Response
		format(Stream, 'HTTP/1.0 ~p~n', [Status]),
		format(Stream, 'Access-Control-Allow-Origin: *~n', []),
		format(Stream, 'Content-Type: application/json~n~n', []),
		format(Stream, '~p', [MyReply]),

		write('Finnished Connection'),nl,nl,
		close_stream(Stream),
	(Request = quit), !.

close_stream(Stream) :- flush_output(Stream), close(Stream).

/**
 * Handles parsed HTTP requests
 * Returns 200 OK on successful aplication of parse_input on request
 * Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
 */
handle_request(Request, MyReply, '200 OK') :- catch(parse_input(Request, MyReply),error(_,_),fail), !.
handle_request(syntax_error, '{"success":false,"error":"Syntax Error"}', '400 Bad Request') :- !.
handle_request(_, '{"success":false,"error":"Bad Request"}', '400 Bad Request').

/**
 * Reads first Line of HTTP Header and parses request
 * Returns term parsed from Request-URI
 * Returns syntax_error in case of failure in parsing
 */
read_request(Stream, Request) :-
	read_line(Stream, LineCodes),
	print_header_line(LineCodes),

	% Parse Request
	atom_codes('GET /',Get),
	append(Get,RL,LineCodes),
	read_request_aux(RL,RL2),

	catch(read_from_codes(RL2, Request), error(syntax_error(_),_), fail), !.
read_request(_,syntax_error).

read_request_aux([32|_],[46]) :- !.
read_request_aux([C|Cs],[C|RCs]) :- read_request_aux(Cs, RCs).

/**
 * Reads and Ignores the rest of the lines of the HTTP Header.
 */
read_header(Stream) :-
	repeat,
		read_line(Stream, Line),
		print_header_line(Line),
	(Line = []; Line = end_of_file),!.

check_end_of_header([]) :- !, fail.
check_end_of_header(end_of_file) :- !,fail.
check_end_of_header(_).

/**
 * Function to Output Request Lines (uncomment the line bellow to see more information on received HTTP Requests)
 */
print_header_line(LineCodes) :- catch((atom_codes(Line,LineCodes),write(Line),nl),_,fail), !.
print_header_line(_).

%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%
%                                            Commands                                                   %
%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%-%

/**
 * File includes.
 */
:- consult('game.pl').
:- consult('logic.pl').
:- consult('ai.pl').
:- consult('auxiliar.pl').

/**
 * Test requests.
 */
parse_input(handshake, Res) :-
	getJSONHeader(s,Header),
	Res = {Header:'"handshake"'}.

parse_input(error, Res) :-
	getJSONHeader(e,Header),
	Res = {Header:'"This is an error"'}.

/**
 * Quit the server message.
 */
parse_input(quit, Res) :-
	getJSONHeader(s,Header),
	Res = {Header:'"goodbye"'}.

/**
 * Gets player's valid moves.
 */
parse_input(valid_first_moves(Board, Player), Res) :-
	valid_first_moves(Board, Player, ValidMoves),
	getJSONHeader(s,Header),
	Res = {Header:ValidMoves}.

parse_input(valid_first_moves(_Board, _Player), Res) :-
	getJSONHeader(e,Header),
	Res = {Header:'"Valid moves error"'}.

/**
 * Gets player's valid moves.
 */
parse_input(valid_moves(Board, Player), Res) :-
	valid_moves(Board, Player, ValidMoves),
	getJSONHeader(s,Header),
	Res = {Header:ValidMoves}.

parse_input(valid_moves(_Board, _Player), Res) :-
	getJSONHeader(e,Header),
	Res = {Header:'"Valid moves error"'}.

/**
 * Gets computer's play.
 */
parse_input(computerTurn(Player, Difficulty, Board), Res) :-
	computerTurn(Player, Difficulty, Board, NewBoard),
	getJSONHeader(s,Header),
	Res = {Header:NewBoard}.

parse_input(computerTurn(_Player, _Difficulty, _Board), Res) :-
	getJSONHeader(e,Header),
	Res = {Header:'"Computer play error"'}.
