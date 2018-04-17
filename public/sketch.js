// main user interaction

let name = prompt("Name");
let world = prompt("World");

let socket = io.connect();

console.log(socket);

// // when we are sent a 'key' or a message to 'updateEnemy' we call these functions
// socket.on('key', freakOut);
// socket.on('updatePlayer', updateEnemy);
// socket.on('shoot', addBullet);

// //we also have to emit data
// let loc_data = {
//   expos: playerLoc.x,
//   eypos: playerLoc.y,
//   exv: playerVel.x,
//   eyv: playerVel.y
// }
// socket.emit('updatePlayer', loc_data);
// // note the names must match
