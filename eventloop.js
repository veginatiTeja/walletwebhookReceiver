

// Basic Macro vs Micro
console.log("A");

Promise.resolve().then(() => {
    console.log("promise object C",)
});
setTimeout(() => {
    console.log("setTime out B")
},0);

console.log("D");



//async and await behaviour


async function test(params) {
    console.log("async function 1");
    await Promise.resolve();
    console.log("2");
}


console.log("3");
test();
console.log("4");


//process.nextTick priority


console.log("Start");

process.nextTick(() => {
    console.log("next tick");
});

Promise.resolve().then(() => {
    console.log("promises ")
});

setTimeout(() => {
   console.log("setTimeout")
},0);

console.log("end process nexttick exec");




//Nested Microtasks


console.log(" nested microstask A");

Promise.resolve().then(() => {
  console.log("nested microstask B");
  Promise.resolve().then(() => {
    console.log("nested microstask inner promise C");
  });
});

setTimeout(() => {
  console.log(" nested microstask setTimeout D");
}, 0);

console.log("nested microstask E");



//blocking code impact


console.log("bocking code impact start ");

setTimeout(() => {
  console.log("Timeout");
}, 0);

for (let i = 0; i < 4; i++) {
    console.log("for loop blocking ");
}

console.log("End");


console.log("1");

setTimeout(() => console.log("2"), 0);

setImmediate(() => console.log("3"),20);

Promise.resolve().then(() => console.log("4"));

process.nextTick(() => console.log("5"));

console.log("6");



/* What You Just Learned (Important)

1️⃣ All synchronous code runs first
2️⃣ process.nextTick runs before Promise microtasks
3️⃣ Promise microtasks run before timers
4️⃣ Microtasks can enqueue more microtasks
5️⃣ Blocking code stops everything

*/

