

//ajouter attribut normale pour effet lumiere
var strVertexShaderSource =
    'attribute vec3 vertexPos;\n' +
    'attribute vec4 vertexColor;\n' +
    'attribute vec2 texelPos;\n' +
    'attribute vec3 vertexNormal;\n' +

    'uniform mat4 modelViewMatrix;\n' +
    'uniform mat4 projectionMatrix;\n' +

    'varying vec4 vColor;\n' +
    'varying vec2 vTexelPos;\n' +
    'varying vec3 vNormal;\n' +
    'varying vec3 vPosition;\n' +

    'void main(void) {\n' +
    '    vec4 pos = modelViewMatrix * vec4(vertexPos, 1.0);\n' +
    '    gl_Position = projectionMatrix * pos;\n' +
    '    vColor = vertexColor;\n' +
    '    vTexelPos = texelPos;\n' +
    '    vNormal = vertexNormal;\n' +
    '    vPosition = pos.xyz;\n' +
    '}\n';

    var strFragmentShaderSource =
        '    precision mediump float;\n' +
        '    uniform float uPcTexelColor;\n' +
		'    uniform sampler2D uSampler;\n' +
		'    uniform vec3 lightPosition;\n' +
        '    varying vec4 vColor;\n' +
		'    varying vec2 vTexelPos;\n' +
		'    varying vec3 vNormal;\n' +
        '    varying vec3 vPosition;\n' +
        '    void main(void) {\n' +
    	'    vec4 baseColor = mix(vColor, texture2D(uSampler, vTexelPos), uPcTexelColor);\n' +
    	'    vec3 normal = normalize(vNormal);\n' +
    	'    vec3 lightDir = normalize(lightPosition - vPosition);\n' +
    	'    float diffuse = max(dot(normal, lightDir), 0.0);\n' +
    	'    float ambient = 0.30;\n' +
    	'    vec3 finalColor = baseColor.rgb * (ambient + diffuse * 0.70);\n' +
    	'    gl_FragColor = vec4(finalColor, baseColor.a);\n' +
        '}\n';

     function creerShader(objgl, strSource, strType) {
        var objShader = null;
		
        if (strType == 'fragment') {
            objShader = objgl.createShader(objgl.FRAGMENT_SHADER);
        } else if (strType == 'vertex') {
            objShader = objgl.createShader(objgl.VERTEX_SHADER);
        } 
		
		if (!objShader) {
			alert('Impossible de créer le ' + strType + 'shader');
		}
		else {
			objgl.shaderSource(objShader, strSource);
			objgl.compileShader(objShader);
			if (!objgl.getShaderParameter(objShader, objgl.COMPILE_STATUS)) {
				alert('Impossible de compiler le ' + strType + ' shader');
			}
        }

        return objShader;
    }

	function initShaders(objgl) {
		var objProgShaders = null;

		// Créer les shaders à partir du code source
		//ajouter effet lumiere et ambiante
		
        var objFragmentShader = creerShader(objgl, strFragmentShaderSource, 'fragment');
        var objVertexShader = creerShader(objgl, strVertexShaderSource, 'vertex');
		
		if (objFragmentShader && objVertexShader) { 
		    // Créer le programme qui va exécuter les shaders
			objProgShaders = objgl.createProgram();
			objgl.attachShader(objProgShaders, objVertexShader);
			objgl.attachShader(objProgShaders, objFragmentShader);
			objgl.linkProgram(objProgShaders);
		
			if (!objgl.getProgramParameter(objProgShaders, objgl.LINK_STATUS)) {
				alert('Impossible de lier les shaders');
			}
			else {	
				objProgShaders.posVertex = objgl.getAttribLocation(objProgShaders, 'vertexPos');
				objgl.enableVertexAttribArray(objProgShaders.posVertex);

				objProgShaders.couleurVertex = objgl.getAttribLocation(objProgShaders, 'vertexColor');
				objgl.enableVertexAttribArray(objProgShaders.couleurVertex);
				
				objProgShaders.matProjection = objgl.getUniformLocation(objProgShaders, 'projectionMatrix');
				objProgShaders.matModeleVue = objgl.getUniformLocation(objProgShaders, 'modelViewMatrix');

				objProgShaders.normalVertex = objgl.getAttribLocation(objProgShaders, 'vertexNormal');
				objgl.enableVertexAttribArray(objProgShaders.normalVertex);
				objProgShaders.posTexel = objgl.getAttribLocation(objProgShaders, 'texelPos');
				objgl.enableVertexAttribArray(objProgShaders.posTexel);
				
				objProgShaders.noTexture = objgl.getUniformLocation(objProgShaders, 'uSampler');
				objProgShaders.pcCouleurTexel = objgl.getUniformLocation(objProgShaders, 'uPcTexelColor');
				

				objProgShaders.lightPosition = objgl.getUniformLocation(objProgShaders, 'lightPosition');
				objgl.useProgram(objProgShaders);
			}
		}
		
		return objProgShaders;
    }
