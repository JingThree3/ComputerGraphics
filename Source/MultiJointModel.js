// MultiJointModel.js (c) 2012 matsuda and itami
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec2 vTexCoord;\n' +
  'varying vec2 fTexCoord;\n' +
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Normal;\n' +
  'uniform vec4 ambientProduct, diffuseProduct, specularProduct;\n' +
  'uniform float shininess; // 材料的光泽度\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'uniform vec3 u_LightPosition; // 太阳的位置\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
   //  '  vec3 lightDirection = normalize(vec3(0.0, 0.5, 0.7));\n' + // SunLight direction
  '  vec3 lightDirection = normalize(u_LightPosition - (u_MvpMatrix * a_Position).xyz);\n' + // L
  '  vec3 E = normalize(-gl_Position.xyz);\n' +
  '  vec3 H = normalize(lightDirection + E);\n' +
  '  vec3 normal = normalize((u_NormalMatrix * a_Normal).xyz);\n' + // N 转置
  '  vec4 ambient = ambientProduct;\n' + // 环境光
  '  float nDotL = max(dot(normal, lightDirection), 0.0);\n' +  // Lambert
  '  vec4 diffuse = nDotL * diffuseProduct;\n' + // 漫反射光照
  '  float phong = pow(max(dot(normal, H), 0.0), shininess);\n' + // Phong镜面反射
  '  vec4 specular = phong * specularProduct;\n' + // 镜面反射光照
  '  if (dot(normal, lightDirection) < 0.0) {\n' +
  '    specular = vec4(0.0, 0.0, 0.0, 1.0);\n' +
  '  }\n' +
    //'  v_Color = vec4(color.rgb * nDotL + vec3(0.1), color.a);\n' +
  '  v_Color = ambient + diffuse + specular;\n' +
  '  v_Color.a = 1.0;'+
  '  fTexCoord = vTexCoord;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'varying  vec2 fTexCoord;\n' +

  'uniform int u_TextureIndex;\n' +
  'uniform sampler2D texture;\n' +
  'uniform sampler2D texture1;\n' +
  'uniform sampler2D texture2;\n' +
  'uniform sampler2D texture3;\n' +
  'uniform sampler2D texture4;\n' +
  'uniform sampler2D texture5;\n' +
  'uniform sampler2D texture6;\n' +
  'uniform sampler2D texture7;\n' +
  'uniform sampler2D texture8;\n' +
  'uniform sampler2D texture9;\n' +
  'uniform sampler2D texture10;\n' +
  'void main() {\n' +
  ' if (u_TextureIndex == 0) {' +
  // 设置太阳的自发光颜色   纹理颜色与自发光颜色混合
  '    vec4 sunColor = vec4(0.3, 0.3, 0.0, 0.2); \n' +
  '    vec4 sunTextureColor = texture2D(texture, fTexCoord); \n' +
  '    gl_FragColor = sunTextureColor + sunColor * sunTextureColor.a; \n' +
  //其他天体以太阳为点光源
  '} else if (u_TextureIndex == 1) {' +
  ' gl_FragColor = v_Color * texture2D( texture1, fTexCoord );\n' +
  '} else if (u_TextureIndex == 2) {' +
  ' gl_FragColor = v_Color * texture2D( texture2, fTexCoord );\n' +
  '} else if (u_TextureIndex == 3) {' +
  ' gl_FragColor = v_Color * texture2D( texture3, fTexCoord );\n' +
  '} else if (u_TextureIndex == 4) {' +
  ' gl_FragColor = v_Color * texture2D( texture4, fTexCoord );\n' +
  '} else if (u_TextureIndex == 5) {' +
  ' gl_FragColor = v_Color * texture2D( texture5, fTexCoord );\n' +
  '} else if (u_TextureIndex == 6) {' +
  ' gl_FragColor = v_Color * texture2D( texture6, fTexCoord );\n' +
  '} else if (u_TextureIndex == 7) {' +
  ' gl_FragColor = v_Color * texture2D( texture7, fTexCoord );\n' +
  '} else if (u_TextureIndex == 8) {' +
  ' gl_FragColor = v_Color * texture2D( texture8, fTexCoord );\n' +
  '} else if (u_TextureIndex == 9) {' +
  ' gl_FragColor = v_Color * texture2D( texture9, fTexCoord );\n' +
  '} else if (u_TextureIndex == 10) {' +
  ' gl_FragColor =texture2D( texture10, fTexCoord );\n' +
  '} ' +

  '}\n';


let gl;
var canvas;


var lightAmbient = [0.5, 0.5, 0.5, 1.0]; // 环境光
var lightDiffuse = [1.0, 1.0, 1.0, 1.0]; // 漫反射光
var lightSpecular = [0.7, 0.7, 0.7, 1.0]; // 镜面反射

// 材质属性
var materialAmbient = [0.8, 0.7, 0.7, 1.0]; // 材质对环境光的反射
var materialDiffuse = [0.9, 0.9, 0.9, 1.0]; // 材质对漫反射光的反射
var materialSpecular = [0.3, 0.3, 0.3, 1.0]; // 材质对镜面反射光的反射
var materialShininess =100.0; 
function main() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Set the vertex information

  cuben = initCubeVertexBuffers(gl);
  if (cuben < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  spheren = initSphereVertexBuffers(gl);
  if (spheren < 0) {
    console.log('Failed to set the vertex information for the sphere');
    return;
  }


  // Set the clear color and enable the depth test
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage locations of uniform variables
  u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (!u_MvpMatrix || !u_NormalMatrix) {
    console.log('Failed to get the storage location');
    return;
  }

  var u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
  if (!u_LightPosition) {
    console.log('Failed to get the storage location of u_LightPosition');
    return;
  }
 // gl.uniform3f(u_LightPosition, 1000.0, 1000.0, 10000.0);
  gl.uniform3f(u_LightPosition, 0, 0, 0);
  //光照
  ambientProduct = mult(lightAmbient, materialAmbient); 
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  specularProduct = mult(lightSpecular, materialSpecular); 
  gl.uniform4fv(gl.getUniformLocation(gl.program, "ambientProduct"), flatten(ambientProduct)); // 环境光分量
  gl.uniform4fv(gl.getUniformLocation(gl.program, "diffuseProduct"), flatten(diffuseProduct)); // 漫反射光分量
  gl.uniform4fv(gl.getUniformLocation(gl.program, "specularProduct"), flatten(specularProduct)); // 镜面反射光分量
  gl.uniform1f(gl.getUniformLocation(gl.program, "shininess"), materialShininess); // 材料光泽度值
  // Calculate the view projection matrix

  perspectiveMatrix.setPerspective(50.0, canvas.width / canvas.height, 0.1, 6000.0);
  var viewMatrix = new Matrix4();
  viewMatrix.lookAt(100, g_CameraY, g_CameraZ, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
  viewProjMatrix = perspectiveMatrix.multiply(viewMatrix);

  initTextures();

  draw();

  // Register the event handler to be called on key press
  document.onkeydown = function (ev) { keydown(ev, viewProjMatrix); };

  canvas.addEventListener('wheel', function (ev) {
    var delta = Math.sign(event.deltaY); // 根据滚轮方向确定是增加还是减少
    var changeAmount = 10;
    cameradius += delta * changeAmount;
    cameradius = Math.max(cameradius, 1);

    updateCameraPosition();
    draw();
    //draw(gl, n, sphereN, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
  });
}
function mult(vec1, vec2) {
  return vec1.map((v, i) => v * vec2[i]);
}
function flatten(arr) {
  return arr.reduce((flat, toFlatten) => {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}
let cuben;
let spheren;
let u_MvpMatrix;
let u_NormalMatrix;
var viewProjMatrix = new Matrix4();
var perspectiveMatrix = new Matrix4();

var CAMERA_STEP = 10; //摄像机旋转角度
var g_CameraX = 0.0;
var g_CameraY = 200.0;
var g_CameraZ = 200.0;
var cameradius = 200;

function rotateCameraXZ(angleDelta) {
  var angleRadians = Math.atan2(g_CameraZ, g_CameraX) + angleDelta;
  angleRadians = normalizeAngle(angleRadians);
  g_CameraX = cameradius * Math.cos(angleRadians);
  g_CameraZ = cameradius * Math.sin(angleRadians);
}
function rotateCameraXY(angleDelta) {
  var angleRadians = Math.atan2(g_CameraY, g_CameraX) + angleDelta;
  angleRadians = normalizeAngle(angleRadians);
  g_CameraX = cameradius * Math.cos(angleRadians);
  g_CameraY = cameradius * Math.sin(angleRadians);
}
function rotateCameraYZ(angleDelta) {
  var angleRadians = Math.atan2(g_CameraY, g_CameraZ) + angleDelta;
  angleRadians = normalizeAngle(angleRadians);
  g_CameraY = cameradius * Math.sin(angleRadians);
  g_CameraZ = cameradius * Math.cos(angleRadians);
}
function updateCameraPosition() {
  var angleRadiansXZ = Math.atan2(g_CameraZ, g_CameraX);
  var angleRadiansXY = Math.atan2(g_CameraY, g_CameraX);

  g_CameraX = cameradius * Math.cos(angleRadiansXZ);
  g_CameraZ = cameradius * Math.sin(angleRadiansXZ);
  g_CameraY = cameradius * Math.sin(angleRadiansXY);
  updateCamera(viewProjMatrix);

}
//限制角度 0-360
function normalizeAngle(angleRadians) {
  var angleDegrees = angleRadians * 180 / Math.PI;
  angleDegrees = angleDegrees % 360;
  if (angleDegrees < 0) angleDegrees += 360;
  return angleDegrees * Math.PI / 180;
}

function keydown(ev, viewProjMatrix) {
  var rotationAngle = CAMERA_STEP * Math.PI / 180; //转换为弧度

  switch (ev.keyCode) {
    case 37: // 左键
      rotateCameraXZ(rotationAngle);
      break;
    case 39: // 右键
      //g_CameraX-=50;
      rotateCameraXZ(-rotationAngle);
      break;
    case 38: // 上键
      rotateCameraXY(rotationAngle);
      break;
    case 40: // 下键
      rotateCameraXY(-rotationAngle);
      break;
    case 88: // X arrow key 
      rotateCameraYZ(rotationAngle);
      break;
    case 90: // X arrow key 
      rotateCameraYZ(-rotationAngle);
  }

  updateCamera(viewProjMatrix);
  draw();
  //draw(gl, n, sphereN, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
}

function updateCamera(viewProjMatrix) {
  //console.log(g_CameraX);
  perspectiveMatrix.setPerspective(50.0, canvas.width / canvas.height, 0.1, 6000.0);
  var viewMatrix = new Matrix4();
  viewMatrix.lookAt(g_CameraX, g_CameraY, g_CameraZ, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
  viewProjMatrix = perspectiveMatrix.multiply(viewMatrix);

}

// Coordinate transformation matrix
var g_modelMatrix = new Matrix4(), g_mvpMatrix = new Matrix4();
function draw() {
  //function draw(gl,spheren, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {

  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //pushMatrix(g_modelMatrix);

  updatebyOrbit();

  //太阳
  g_modelMatrix.setTranslate(0.0, 0.0, 0.0); // 设置球体位置
  g_modelMatrix.scale(10.0, 10.0, 10.0); // 设置球体大小
  g_modelMatrix.rotate(-earthrotation, 0.0, 1.0, 0.0);
  drawSphere(gl, spheren, viewProjMatrix, u_MvpMatrix, u_NormalMatrix,
    0); // 绘制球体


  //水星
  pushMatrix(g_modelMatrix);
  g_modelMatrix.setTranslate(mercuryPosition.x, 0.0, mercuryPosition.y); // 设置球体位置
  g_modelMatrix.scale(1, 1, 1); // 设置球体大小
  drawSphere(gl, spheren, viewProjMatrix, u_MvpMatrix, u_NormalMatrix,
    1);
  g_modelMatrix = popMatrix();

  //金星
  pushMatrix(g_modelMatrix);
  g_modelMatrix.setTranslate(venusPosition.x, 0.0, venusPosition.y); // 设置球体位置
  g_modelMatrix.scale(2, 2, 2); // 设置球体大小
  drawSphere(gl, spheren, viewProjMatrix, u_MvpMatrix, u_NormalMatrix,
    2);
  g_modelMatrix = popMatrix();

  //地球
  pushMatrix(g_modelMatrix);
  g_modelMatrix.setTranslate(earthPosition.x, 0.0, earthPosition.y);
  g_modelMatrix.scale(2, 2, 2); // 地球的大小
  drawSphere(gl, spheren, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, 3);
  g_modelMatrix = popMatrix();

  // 火星
  pushMatrix(g_modelMatrix);
  g_modelMatrix.setTranslate(marsPosition.x, 0.0, marsPosition.y); // 设置球体位置
  g_modelMatrix.scale(1, 1, 1); // 设置球体大小
  drawSphere(gl, spheren, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, 4);
  g_modelMatrix = popMatrix();

  // 木星
  pushMatrix(g_modelMatrix);
  g_modelMatrix.setTranslate(jupiterPosition.x, 0.0, jupiterPosition.y); // 设置球体位置
  g_modelMatrix.scale(3, 3, 3); // 设置球体大小
  drawSphere(gl, spheren, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, 5);
  g_modelMatrix = popMatrix();

  // 土星
  pushMatrix(g_modelMatrix);
  let Saturnpos = [saturnPosition.x, 0.0, saturnPosition.y];
  g_modelMatrix.setTranslate(Saturnpos[0], Saturnpos[1], Saturnpos[2]); // 设置球体位置
  g_modelMatrix.scale(1.8, 1.8, 1.8); // 设置球体大小
  drawSphere(gl, spheren, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, 6);

  //土星环
  g_modelMatrix.setTranslate(Saturnpos[0], Saturnpos[1], Saturnpos[2]); // 设置球体位置
  g_modelMatrix.scale(3, 0.4, 3); // 设置球体大小
  drawSphere(gl, spheren, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, 7);
  g_modelMatrix = popMatrix();
  // 天王星
  pushMatrix(g_modelMatrix);
  g_modelMatrix.setTranslate(uranusPosition.x, 0.0, uranusPosition.y); // 设置球体位置
  g_modelMatrix.scale(1.2, 1.2, 1.2); // 设置球体大小
  drawSphere(gl, spheren, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, 8);
  g_modelMatrix = popMatrix();

  // 海王星
  pushMatrix(g_modelMatrix);
  g_modelMatrix.setTranslate(neptunePosition.x, 0.0, neptunePosition.y); // 设置球体位置
  g_modelMatrix.scale(1.3, 1.4, 1.4); // 设置球体大小
  drawSphere(gl, spheren, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, 9);
  g_modelMatrix = popMatrix();

  g_modelMatrix.setTranslate(0.0, -500.0, 0.0);
  drawBox(gl, cuben, 1000.0, 1000.0, 1000.0, viewProjMatrix, u_MvpMatrix, u_NormalMatrix, 10);

  requestAnimationFrame(draw);

}

var g_matrixStack = []; // Array for storing a matrix
function pushMatrix(m) { // Store the specified matrix to the array
  var m2 = new Matrix4(m);
  g_matrixStack.push(m2);
}

function popMatrix() { // Retrieve the matrix from the array
  return g_matrixStack.pop();
}

let g_normalMatrix = new Matrix4();  // Coordinate transformation matrix for normals
