/**
 * Created by zhouyuson on 17/1/19.
 */

// let命令
var a = [];
for (let i = 0; i< 10; i++) {
    a[i] = function () {
        console.log(i);
    }
}
a[6]();

// const 命令
const foo ={};
foo.prop = 123;
console.log(foo.prop)
