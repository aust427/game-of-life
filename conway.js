var scene, camera, renderer;
var geometry, material, cube;

var cellSize = 10;
var borderSize = 1; 

var nsquare = 20;

var nrows = 20;
var ncols = nrows; 

var conwayMatrix;
// var conwayPrevMatrix;
// or 
// var boardHistory; 

var face_keys = ['F', 'L', 'R', 'U', 'D', 'B']

var face_offsets = {
  'F': { 'x': cellSize * nsquare, 'y': cellSize * nsquare, 'start': 0, 'c': 'red' },
  'L': { 'x': 0, 'y': cellSize * nsquare, 'start': 1, 'c': 'orange' },
  'R': { 'x': 2 * cellSize * nsquare, 'y': cellSize * nsquare, 'start': 2, 'c': 'yellow' },
  'U': { 'x': cellSize * nsquare, 'y': 0, 'start': 3, 'c': 'green' },
  'D': { 'x': cellSize * nsquare, 'y': 2 * cellSize * nsquare, 'start': 4, 'c': 'blue' },
  'B': { 'x': 3 * cellSize * nsquare, 'y': cellSize * nsquare, 'start': 5, 'c': 'purple' }
};

var defaultInsert, insertPat;

var clearBoard = function(){
    
};

// reverts board by one action
var undoAction = function(){
    
};

// reverts board to future action 
var redoAction = function(){
    
};

// rotate the active area / placed item
var rotateActive = function(){
    
};

// mirror active area / placed item against horizontal axis
var mirrorHorActive = function(){
    
};

// mirror active area / placed item against vertical axis

var animate = function () {

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render( scene, camera );
    
  requestAnimationFrame( animate );

};

var prepareScene = function(){
  WIDTH = $('#canvas').width();
  HEIGHT = WIDTH;
    
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, WIDTH / HEIGHT, 0.1, 1000 );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( WIDTH, HEIGHT );
    
  container = document.getElementById('canvas');
  container.appendChild( renderer.domElement );
}

var genJSON = function(json, matrix, key) {
  for (var i = 0; i < matrix.length; i++){
    arr = Array(matrix[i].length);
    for (var j = 0; j < matrix[i].length; j++){ 
      arr[j] = {'x': face_offsets[key].x + j*cellSize + borderSize,
        'y': face_offsets[key].y + i*cellSize + borderSize,
        'id': {
          'i': face_offsets[key].y / cellSize + i,
          'j': face_offsets[key].x / cellSize + j
        },
        'c': 'white'
        }
    };
    json[face_offsets[key].start * nrows + i] = arr;
  }
return(json);
}

var genMatrix = function(x, y){
// declare the matrix
  var matrix = [];
    
  // fill each row of the matrix with the 0 array
  for (i = 0; i < x; i++){
    // first initalize an array with length y 
    var arr = new Array(y);
    // fill it with 0s
    for (j = 0; j < y; j++){
      arr[j] = 0;
    }
        
    matrix[i] = arr;
  }
    
  return matrix;
}

var initGeometry = function(){
  geometry = new THREE.BoxGeometry( 1, 1, 1 );
  material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  cube = new THREE.Mesh( geometry, material );
}

var initGrid = function(){
  conwayMatrix = genMatrix(nsquare, nsquare);

  conwayJSON = Array(conwayMatrix.length); 

  for (var i = 0; i < face_keys.length; i++) {
    conwayJSON = genJSON(conwayJSON, conwayMatrix, face_keys[i]);
  }

  conwayMatrix = genMatrix(nrows*3, nrows*4);
  initd3();
}

var initd3 = function(){
  var grid = d3.select('#D3_container')
    .append('svg')
    .attr('width', $('#D3_container').width())
    .attr('height', $('#D3_container').height());
    
  var rows = grid.selectAll('g')
    .data(conwayJSON)
    .enter()
    .append('g')
    .attr('class', 'row')
    
  var cells = rows.selectAll('rect')
    .data(function(d, i) { return(d); })
    .enter()
    .append('rect')
    .attr('class', 'cell-dead')
    .attr('width', cellSize)
    .attr('height', cellSize)
    .attr('x', function(d) { return d.x; })
    .attr('y', function(d) { return d.y; })
    .attr('id', function (d) { return d.id.i + '-' + d.id.j;})
    .attr('class', 'cell-dead')
    .on('click', function(d) { insertPattern(d.id); return; });
};

var flipAlive = function(i, j, side){
  obj = $('#' + i + '-' + j);
  obj.addClass('cell-alive').removeClass('cell-dead');
}

var flipDead = function(i, j, side){
  obj = $('#' + i + '-' + j);
  obj.addClass('cell-dead').removeClass('cell-alive');
}

var insertPattern = function(id){    
  for (var i = id.i, pat_i = 0; i < id.i + insertPat.length; i++, pat_i++){
    for (var j = id.j, pat_j = 0; j < id.j + insertPat[0].length; j++, pat_j++){
      if (insertPat[pat_i][pat_j] == 1){
        flipAlive(i, j, id.side);
      } 
      else {
        flipDead(i, j, id.side);
      }
      console.log(i, j);
      conwayMatrix[i][j] = insertPat[pat_i][pat_j];
    }
  }
};


var countNeighbors = function(i_mid, j_mid, i_range, j_range){
  var count = 0;
    
  for (var i = Math.min(...i_range); i < Math.max(...i_range) + 1; i++){
    for (var j = Math.min(...j_range); j < Math.max(...j_range) + 1; j++){
      if (i == i_mid && j == j_mid){
      }
      else {
        count = count + conwayMatrix[i][j];
      }
    }
  }
  return(count);
}

var createNeighborhood = function (i_cen, j_cen) {
  var i_range = [i_cen - 1, i_cen, i_cen + 1];
  var j_range = [j_cen - 1, j_cen, j_cen + 1]; 

  var neighborhood = Array(3); 

  for (var i = 0; i < 3; i++) {
    var row = Array(3);
    for (var j = 0; j < 3; j++) {
      row[j] = [i_range[i], j_range[j]];
    }
    neighborhood[i] = row;
  }
  console.log(neighborhood);
}

var updateState = function(i, j){
  var cell_state = conwayMatrix[i][j];

  // need to check periodic boundary conditions
  var neighborhood = createNeighborhood(i, j); 
    
  var live_count = countNeighbors(i, j, neighborhood );
  if (cell_state) {
    if (live_count == 2 || live_count == 3){ 
      // cell lives
      cell_state = 1;
      flipAlive(i, j);
    }
    else {
      // cell dies
      cell_state = 0;
      flipDead(i, j);
    };
  }
  else {
    if (live_count == 3){
      // cell lives
      cell_state = 1; 
      flipAlive(i, j);
    }
  };
  return cell_state;
}



var matrixUpdate = function () {
  // deep copy original matrix 
  var nextGenMatrix = JSON.parse(JSON.stringify(conwayMatrix));
  for (var i = 0; i < conwayJSON.length; i++){
    for (var j = 0; j < conwayJSON[i].length; j++){
      nextGenMatrix[conwayJSON[i][j].id.i][conwayJSON[i][j].id.j] = updateState(conwayJSON[i][j].id.i, conwayJSON[i][j].id.j);
    }
  }
  conwayMatrix = nextGenMatrix; 
  return; 
}

var automata = function(){
  if (!loop) 
    return; 
  setTimeout(function() { 
    matrixUpdate();     
    automata();
  }, timer_ms);
}

var timer_ms = 300; 
var loop = true; 

var pause = function() {
  loop = !loop;
    
  if (loop)
    automata;
}

$(document).ready(function() {
  $("#button-next").click(function(){
    matrixUpdate();
  });
    
  $("#button-start").click(function(){
    loop = true; 
    automata();
  });
    
  $("#button-pause").click(function(){
    pause();
  });
    
  defaultInsert = LWSS;
  insertPat = default_pattern;
  initGeometry();
  prepareScene();
  initGrid();
  scene.add(cube);
  camera.position.z = 5;

  animate();
});