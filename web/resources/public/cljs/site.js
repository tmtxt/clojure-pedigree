// Compiled by ClojureScript 0.0-3165 {}
goog.provide('site');
goog.require('cljs.core');
goog.require('weasel.repl');
site.init = (function site$init(){
console.log("hello world");

if(weasel.repl.alive_QMARK_.call(null)){
return null;
} else {
return weasel.repl.connect.call(null,"ws://localhost:9253");
}
});
goog.exportSymbol('site.init', site.init);
