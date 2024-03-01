//角度增长
function updateTimeBasedRotation(distance, rotationSpeed) {
    let Time = performance.now() / 500;
    let rotation = (Time * rotationSpeed) % 360;
    earthrotation=rotation;
    return calculateOrbitPosition(distance, rotation);
}
//计算坐标
function calculateOrbitPosition(distance, rotation) {
    var radian = rotation * Math.PI / 180; // 将角度转换为弧度
    var x = distance * Math.cos(radian);
    var y = distance * Math.sin(radian);
    return { x: x, y: y };
}


let earthPosition;
let earthrotation;
let mercuryPosition;
let venusPosition;
let marsPosition;
let jupiterPosition;
let saturnPosition;
let uranusPosition;
let neptunePosition;


function updatebyOrbit() {
    earthPosition = updateTimeBasedRotation(60.0, 2.0);
    // 水星
    mercuryPosition = updateTimeBasedRotation(30.0, 10.0);

    // 金星
    venusPosition = updateTimeBasedRotation(45.0, 5.0);

    // 木星
    marsPosition = updateTimeBasedRotation(70.0, 10.0);


    // 木星
    jupiterPosition = updateTimeBasedRotation(85.0, 8.0);

    // 土星
    saturnPosition = updateTimeBasedRotation(100.0, 1.0);

    // 天王星
    uranusPosition = updateTimeBasedRotation(110.0, 2.0);

    // 海王星
    neptunePosition = updateTimeBasedRotation(120.0, 4.0);
}