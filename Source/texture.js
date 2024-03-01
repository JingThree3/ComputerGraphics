
let textures = [];

function initTextures() {
  //太阳 0
  let texture_Sun = loadTexture(gl, 'texture/太阳_2K.jpg');
  textures.push(texture_Sun);
  // 水星 1
  let texture_Mercury = loadTexture(gl, 'texture/水星_2K.jpg');
  textures.push(texture_Mercury);

  // 金星 2
  let texture_Venus = loadTexture(gl, 'texture/金星_2K.jpg');
  textures.push(texture_Venus);

  // 地球3
  let texture_Earth = loadTexture(gl, 'texture/地球_2K.jpg');
  textures.push(texture_Earth);

  // 火星4
  let texture_Mars = loadTexture(gl, 'texture/火星_2K.jpg');
  textures.push(texture_Mars);

  // 木星5
  let texture_Jupiter = loadTexture(gl, 'texture/木星_2K.jpg');
  textures.push(texture_Jupiter);

  // 土星6
  let texture_Saturn = loadTexture(gl, 'texture/土星_2K.jpg');
  textures.push(texture_Saturn);

  // 土星环7
  let texture_SaturnRing = loadTexture(gl, 'texture/土星环_2K.jpg');
  textures.push(texture_SaturnRing);

  // 天王星8
  let texture_Uranus = loadTexture(gl, 'texture/天王星_2K.jpg');
  textures.push(texture_Uranus);

  // 海王星9
  let texture_Neptune = loadTexture(gl, 'texture/海王星_2K.jpg');
  textures.push(texture_Neptune);

  //天空盒10
  let texture_sky = loadTexture(gl, 'texture/星星+银河_2K.jpg');
  textures.push(texture_sky);

}

function loadTexture(gl, imageSource) {
  var texture = gl.createTexture();
  var image = new Image();

  image.onload = function () {
    configureTexture(gl, texture, image);
  };

  image.src = imageSource;

  return texture;
}

function configureTexture(gl, texture, image) {
  //texture = gl.createTexture();
  // gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
    gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);


  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // gl.uniform1i(gl.getUniformLocation(gl.program, "texture"), 0);
}
