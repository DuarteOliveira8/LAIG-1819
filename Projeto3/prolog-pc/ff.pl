:- consult('menu.pl').
:- consult('boardDisplay.pl').
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
 * Server inicialization predicate
 */
server.
