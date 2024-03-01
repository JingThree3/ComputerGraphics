
let sphereVertexBuffer;
let sphereIndexBuffer;

let spherenormalBuffer ;
let spheretexCoordBuffer;

function initSphereVertexBuffers(gl) {
  var latitudeBands = 30;
  var longitudeBands = 30;
  var radius = 2;

  var vertexData = [];
  var normalData = [];
  var texCoordData = []; 
  for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
    var theta = latNumber * Math.PI / latitudeBands- Math.PI / 2;
    var sinTheta = Math.sin(theta);
    var cosTheta = Math.cos(theta);

    for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
      var phi = longNumber * 2 * Math.PI / longitudeBands ;
      var sinPhi = Math.sin(phi);
      var cosPhi = Math.cos(phi);

      var x = cosPhi * cosTheta;
      var y = sinTheta;
      var z = sinPhi * cosTheta;
      var u =1-(longNumber / longitudeBands);  //纹理坐标
      var v =  (latNumber / latitudeBands);

      vertexData.push(radius * x);
      vertexData.push(radius * y);
      vertexData.push(radius * z);


      // 法线向量
      normalData.push(x);
      normalData.push(y);
      normalData.push(z);

      texCoordData.push(u);
      texCoordData.push(v);
    }
  }

  var indexData = [];
  for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
    for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
      var first = (latNumber * (longitudeBands + 1)) + longNumber;
      var second = first + longitudeBands + 1;
      indexData.push(first);
      indexData.push(second);
      indexData.push(first + 1);

      indexData.push(second);
      indexData.push(second + 1);
      indexData.push(first + 1);
    }
  }

  sphereVertexBuffer = initArrayBuffer(gl, 'a_Position', new Float32Array(vertexData), gl.FLOAT, 3);
  if (!sphereVertexBuffer) return -1;

  spherenormalBuffer = initArrayBuffer(gl, 'a_Normal', new Float32Array(normalData), gl.FLOAT, 3);
  if (!spherenormalBuffer) return -1;
  spheretexCoordBuffer = initArrayBuffer(gl, 'vTexCoord', new Float32Array(texCoordData), gl.FLOAT, 2);
  if (!spheretexCoordBuffer) return -1;

  // 创建球体索引缓冲区并绑定数据
  sphereIndexBuffer = gl.createBuffer();
  if (!sphereIndexBuffer) {
    console.log('Failed to create the buffer object for sphere indices');
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);

  return indexData.length;
}

let cubeVertexBuffer;
let cubeIndexBuffer;
let cubeNormalBuffer;
let cubetexCoordBuffer;

function initCubeVertexBuffers(gl) {
  // Coordinates（Cube which length of one side is 1 with the origin on the center of the bottom)
  var vertices = new Float32Array([
    0.5, 1.0, 0.5, -0.5, 1.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0, 0.5, // v0-v1-v2-v3 front
    0.5, 1.0, 0.5, 0.5, 0.0, 0.5, 0.5, 0.0, -0.5, 0.5, 1.0, -0.5, // v0-v3-v4-v5 right
    0.5, 1.0, 0.5, 0.5, 1.0, -0.5, -0.5, 1.0, -0.5, -0.5, 1.0, 0.5, // v0-v5-v6-v1 up
    -0.5, 1.0, 0.5, -0.5, 1.0, -0.5, -0.5, 0.0, -0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
    -0.5, 0.0, -0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
    0.5, 0.0, -0.5, -0.5, 0.0, -0.5, -0.5, 1.0, -0.5, 0.5, 1.0, -0.5  // v4-v7-v6-v5 back
  ]);

  // Normal
  var normals = new Float32Array([
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, // v0-v1-v2-v3 front
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, // v0-v3-v4-v5 right
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, // v0-v5-v6-v1 up
    -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
    0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, // v7-v4-v3-v2 down
    0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0  // v4-v7-v6-v5 back
  ]);

  var texCoords = new Float32Array([
    // v0-v1-v2-v3 front
  //  0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0,
    1.0, 1.0,  0.0, 1.0,   0.0, 0.0,   1.0, 0.0, 
    // v0-v3-v4-v5 right
  //  1.0, 1.0, 1.0, 0.0,  0.0, 0.0,0.0, 1.0, 
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    // v0-v5-v6-v1 up
    0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0,

    // v1-v6-v7-v2 left
    1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

    // v7-v4-v3-v2 down
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,

    // v4-v7-v6-v5 back
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0
]);
  // Indices of the vertices
  var indices = new Uint8Array([
    0, 1, 2, 0, 2, 3,    // front
    4, 5, 6, 4, 6, 7,    // right
    8, 9, 10, 8, 10, 11,    // up
    12, 13, 14, 12, 14, 15,    // left
    16, 17, 18, 16, 18, 19,    // down
    20, 21, 22, 20, 22, 23     // back
  ]);

  // 初始化顶点缓冲区
  cubeVertexBuffer = initArrayBuffer(gl, 'a_Position', vertices, gl.FLOAT, 3);
  if (!cubeVertexBuffer) return -1;

  // 初始化法线缓冲区
  cubeNormalBuffer = initArrayBuffer(gl, 'a_Normal', normals, gl.FLOAT, 3);
  if (!cubeNormalBuffer) return -1;

  // 初始化纹理坐标缓冲区
  cubetexCoordBuffer = initArrayBuffer(gl, 'vTexCoord', texCoords, gl.FLOAT, 2);
  if (!cubetexCoordBuffer) return -1;
  // Unbind the buffer object

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  cubeIndexBuffer = gl.createBuffer();
  if (!cubeIndexBuffer) {
    console.log('Failed to create the buffer object for cube indices');
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function initArrayBuffer(gl, attribute, data, type, num, buffer) {
  // Create a buffer object
  buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return buffer;
}
