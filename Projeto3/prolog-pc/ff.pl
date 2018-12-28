:- consult('game.pl').
:- consult('logic.pl').
:- consult('ai.pl').
:- consult('auxiliar.pl').
:- use_module(library(system)).
:- use_module(library(lists)).
:- use_module(library(between)).
:- use_module(library(random)).
:-use_module(library(sockets)).
:-use_module(library(codesio)).

/**
 * Server port.
 */
port(8081).

/**
 * Server inicialization predicate.
 */
server :-
	port(Port),
	write('Opened Server'),nl,nl,
	socket_server_open(Port, Socket),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl.

server_loop(Socket) :-
  .
