/**
 * Created by zhouyuson on 17/2/13.
 */
define("./dist/cmd/c.js" ,["b.js"], function(require , exports , module){
    require("b.js");
    console.log("hello module c");

    console.log("c finished");
});

/**
 * Created by zhouyuson on 17/2/13.
 */
define("b.js" ,["a.js"], function(require , exports , module){
    var a = require("a.js");
    a.fn();
    console.log("hello module b")

    console.log("b finished")
});

/**
 * Created by zhouyuson on 17/2/13.
 */
define("a.js" ,[], function(require , exports , module){
    function fn(){
        console.log("hello module a");
    }
    exports.fn=fn;
});

