// Compiled by ClojureScript 0.0-3165 {}
goog.provide('cljs.repl');
goog.require('cljs.core');
cljs.repl.print_doc = (function cljs$repl$print_doc(m){
cljs.core.println.call(null,"-------------------------");

cljs.core.println.call(null,[cljs.core.str((function (){var temp__4126__auto__ = new cljs.core.Keyword(null,"ns","ns",441598760).cljs$core$IFn$_invoke$arity$1(m);
if(cljs.core.truth_(temp__4126__auto__)){
var ns = temp__4126__auto__;
return [cljs.core.str(ns),cljs.core.str("/")].join('');
} else {
return null;
}
})()),cljs.core.str(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(m))].join(''));

if(cljs.core.truth_(new cljs.core.Keyword(null,"protocol","protocol",652470118).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.call(null,"Protocol");
} else {
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"forms","forms",2045992350).cljs$core$IFn$_invoke$arity$1(m))){
var seq__12450_12462 = cljs.core.seq.call(null,new cljs.core.Keyword(null,"forms","forms",2045992350).cljs$core$IFn$_invoke$arity$1(m));
var chunk__12451_12463 = null;
var count__12452_12464 = (0);
var i__12453_12465 = (0);
while(true){
if((i__12453_12465 < count__12452_12464)){
var f_12466 = cljs.core._nth.call(null,chunk__12451_12463,i__12453_12465);
cljs.core.println.call(null,"  ",f_12466);

var G__12467 = seq__12450_12462;
var G__12468 = chunk__12451_12463;
var G__12469 = count__12452_12464;
var G__12470 = (i__12453_12465 + (1));
seq__12450_12462 = G__12467;
chunk__12451_12463 = G__12468;
count__12452_12464 = G__12469;
i__12453_12465 = G__12470;
continue;
} else {
var temp__4126__auto___12471 = cljs.core.seq.call(null,seq__12450_12462);
if(temp__4126__auto___12471){
var seq__12450_12472__$1 = temp__4126__auto___12471;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__12450_12472__$1)){
var c__4878__auto___12473 = cljs.core.chunk_first.call(null,seq__12450_12472__$1);
var G__12474 = cljs.core.chunk_rest.call(null,seq__12450_12472__$1);
var G__12475 = c__4878__auto___12473;
var G__12476 = cljs.core.count.call(null,c__4878__auto___12473);
var G__12477 = (0);
seq__12450_12462 = G__12474;
chunk__12451_12463 = G__12475;
count__12452_12464 = G__12476;
i__12453_12465 = G__12477;
continue;
} else {
var f_12478 = cljs.core.first.call(null,seq__12450_12472__$1);
cljs.core.println.call(null,"  ",f_12478);

var G__12479 = cljs.core.next.call(null,seq__12450_12472__$1);
var G__12480 = null;
var G__12481 = (0);
var G__12482 = (0);
seq__12450_12462 = G__12479;
chunk__12451_12463 = G__12480;
count__12452_12464 = G__12481;
i__12453_12465 = G__12482;
continue;
}
} else {
}
}
break;
}
} else {
if(cljs.core.truth_(new cljs.core.Keyword(null,"arglists","arglists",1661989754).cljs$core$IFn$_invoke$arity$1(m))){
if(cljs.core.truth_((function (){var or__4093__auto__ = new cljs.core.Keyword(null,"macro","macro",-867863404).cljs$core$IFn$_invoke$arity$1(m);
if(cljs.core.truth_(or__4093__auto__)){
return or__4093__auto__;
} else {
return new cljs.core.Keyword(null,"repl-special-function","repl-special-function",1262603725).cljs$core$IFn$_invoke$arity$1(m);
}
})())){
cljs.core.prn.call(null,new cljs.core.Keyword(null,"arglists","arglists",1661989754).cljs$core$IFn$_invoke$arity$1(m));
} else {
cljs.core.prn.call(null,cljs.core.second.call(null,new cljs.core.Keyword(null,"arglists","arglists",1661989754).cljs$core$IFn$_invoke$arity$1(m)));
}
} else {
}
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"special-form","special-form",-1326536374).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.call(null,"Special Form");

cljs.core.println.call(null," ",new cljs.core.Keyword(null,"doc","doc",1913296891).cljs$core$IFn$_invoke$arity$1(m));

if(cljs.core.contains_QMARK_.call(null,m,new cljs.core.Keyword(null,"url","url",276297046))){
if(cljs.core.truth_(new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(m))){
return cljs.core.println.call(null,[cljs.core.str("\n  Please see http://clojure.org/"),cljs.core.str(new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(m))].join(''));
} else {
return null;
}
} else {
return cljs.core.println.call(null,[cljs.core.str("\n  Please see http://clojure.org/special_forms#"),cljs.core.str(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(m))].join(''));
}
} else {
if(cljs.core.truth_(new cljs.core.Keyword(null,"macro","macro",-867863404).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.call(null,"Macro");
} else {
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"repl-special-function","repl-special-function",1262603725).cljs$core$IFn$_invoke$arity$1(m))){
cljs.core.println.call(null,"REPL Special Function");
} else {
}

cljs.core.println.call(null," ",new cljs.core.Keyword(null,"doc","doc",1913296891).cljs$core$IFn$_invoke$arity$1(m));

if(cljs.core.truth_(new cljs.core.Keyword(null,"protocol","protocol",652470118).cljs$core$IFn$_invoke$arity$1(m))){
var seq__12454 = cljs.core.seq.call(null,new cljs.core.Keyword(null,"methods","methods",453930866).cljs$core$IFn$_invoke$arity$1(m));
var chunk__12455 = null;
var count__12456 = (0);
var i__12457 = (0);
while(true){
if((i__12457 < count__12456)){
var vec__12458 = cljs.core._nth.call(null,chunk__12455,i__12457);
var name = cljs.core.nth.call(null,vec__12458,(0),null);
var map__12459 = cljs.core.nth.call(null,vec__12458,(1),null);
var map__12459__$1 = ((cljs.core.seq_QMARK_.call(null,map__12459))?cljs.core.apply.call(null,cljs.core.hash_map,map__12459):map__12459);
var arglists = cljs.core.get.call(null,map__12459__$1,new cljs.core.Keyword(null,"arglists","arglists",1661989754));
var doc = cljs.core.get.call(null,map__12459__$1,new cljs.core.Keyword(null,"doc","doc",1913296891));
cljs.core.println.call(null);

cljs.core.println.call(null," ",name);

cljs.core.println.call(null," ",arglists);

if(cljs.core.truth_(doc)){
cljs.core.println.call(null," ",doc);
} else {
}

var G__12483 = seq__12454;
var G__12484 = chunk__12455;
var G__12485 = count__12456;
var G__12486 = (i__12457 + (1));
seq__12454 = G__12483;
chunk__12455 = G__12484;
count__12456 = G__12485;
i__12457 = G__12486;
continue;
} else {
var temp__4126__auto__ = cljs.core.seq.call(null,seq__12454);
if(temp__4126__auto__){
var seq__12454__$1 = temp__4126__auto__;
if(cljs.core.chunked_seq_QMARK_.call(null,seq__12454__$1)){
var c__4878__auto__ = cljs.core.chunk_first.call(null,seq__12454__$1);
var G__12487 = cljs.core.chunk_rest.call(null,seq__12454__$1);
var G__12488 = c__4878__auto__;
var G__12489 = cljs.core.count.call(null,c__4878__auto__);
var G__12490 = (0);
seq__12454 = G__12487;
chunk__12455 = G__12488;
count__12456 = G__12489;
i__12457 = G__12490;
continue;
} else {
var vec__12460 = cljs.core.first.call(null,seq__12454__$1);
var name = cljs.core.nth.call(null,vec__12460,(0),null);
var map__12461 = cljs.core.nth.call(null,vec__12460,(1),null);
var map__12461__$1 = ((cljs.core.seq_QMARK_.call(null,map__12461))?cljs.core.apply.call(null,cljs.core.hash_map,map__12461):map__12461);
var arglists = cljs.core.get.call(null,map__12461__$1,new cljs.core.Keyword(null,"arglists","arglists",1661989754));
var doc = cljs.core.get.call(null,map__12461__$1,new cljs.core.Keyword(null,"doc","doc",1913296891));
cljs.core.println.call(null);

cljs.core.println.call(null," ",name);

cljs.core.println.call(null," ",arglists);

if(cljs.core.truth_(doc)){
cljs.core.println.call(null," ",doc);
} else {
}

var G__12491 = cljs.core.next.call(null,seq__12454__$1);
var G__12492 = null;
var G__12493 = (0);
var G__12494 = (0);
seq__12454 = G__12491;
chunk__12455 = G__12492;
count__12456 = G__12493;
i__12457 = G__12494;
continue;
}
} else {
return null;
}
}
break;
}
} else {
return null;
}
}
});
