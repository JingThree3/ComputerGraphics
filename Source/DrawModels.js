
// Draw rectangular solid
function drawBox(gl, n, width, height, depth, viewProjMatrix, u_MvpMatrix,
  u_NormalMatrix, textureindex) {

  pushMatrix(g_modelMatrix);   // Save the model matrix
  // Scale a cube and draw
  g_modelMatrix.scale(width, height, depth);

  updateBuffer(cubeVertexBuffer, cubeNormalBuffer, cubetexCoordBuffer);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);



  setupTexture(gl, textures[textureindex], textureindex);

  setMatrixUniforms(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
  g_modelMatrix = popMatrix();   // Retrieve the model matrix
}

function drawSphere(gl, n, viewProjMatrix, u_MvpMatrix,
  u_NormalMatrix, textureindex) {
  pushMatrix(g_modelMatrix);

  updateBuffer(sphereVertexBuffer, spherenormalBuffer, spheretexCoordBuffer);
  // 绑定球体的索引缓冲区
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndexBuffer);

  setupTexture(gl, textures[textureindex], textureindex);

  // 绘制
  setMatrixUniforms(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
  g_modelMatrix = popMatrix();
}

function setMatrixUniforms(gl, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {

  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);

  g_normalMatrix.setInverseOf(g_modelMatrix);
  g_normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
}
/*
let cubeIndexBuffer;
let cubeNormalBuffer;
let cubetexCoordBuffer;
*/
function updateBuffer(VertexBuffer, NormalBuffer, texCoordBuffer) {

  gl.bindBuffer(gl.ARRAY_BUFFER, VertexBuffer);
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  gl.bindBuffer(gl.ARRAY_BUFFER, NormalBuffer);
  var a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return -1;
  }
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Normal);

  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  var a_TexCoord = gl.getAttribLocation(gl.program, 'vTexCoord');
  if (a_TexCoord < 0) {
    console.log('Failed to get the storage location of a_TexCoord');
    return -1;
  }
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_TexCoord);
}

function setupTexture(gl, texture, textureUnitIndex) {
  gl.activeTexture(gl.TEXTURE0 + textureUnitIndex);
  gl.bindTexture(gl.TEXTURE_2D, texture);


  if (textureUnitIndex === 0) {
    gl.uniform1i(gl.getUniformLocation(gl.program, "texture"), textureUnitIndex);
  } else if (textureUnitIndex === 1) {
    gl.uniform1i(gl.getUniformLocation(gl.program, "texture1"), textureUnitIndex);
  } else if (textureUnitIndex === 2) {
    gl.uniform1i(gl.getUniformLocation(gl.program, "texture2"), textureUnitIndex);
  } else if (textureUnitIndex === 3) {
    gl.uniform1i(gl.getUniformLocation(gl.program, "texture3"), textureUnitIndex);
  } else if (textureUnitIndex === 4) {
    gl.uniform1i(gl.getUniformLocation(gl.program, "texture4"), textureUnitIndex);
  } else if (textureUnitIndex === 5) {
    gl.uniform1i(gl.getUniformLocation(gl.program, "texture5"), textureUnitIndex);
  } else if (textureUnitIndex === 6) {
    gl.uniform1i(gl.getUniformLocation(gl.program, "texture6"), textureUnitIndex);
  } else if (textureUnitIndex === 7) {
    gl.uniform1i(gl.getUniformLocation(gl.program, "texture7"), textureUnitIndex);
  } else if (textureUnitIndex === 8) {
    gl.uniform1i(gl.getUniformLocation(gl.program, "texture8"), textureUnitIndex);
  } else if (textureUnitIndex === 9) {
    gl.uniform1i(gl.getUniformLocation(gl.program, "texture9"), textureUnitIndex);
  } else if (textureUnitIndex === 10) {
    gl.uniform1i(gl.getUniformLocation(gl.program, "texture10"), textureUnitIndex);
  }

  var u_TextureIndex = gl.getUniformLocation(gl.program, 'u_TextureIndex');
  gl.uniform1i(u_TextureIndex, textureUnitIndex);
}