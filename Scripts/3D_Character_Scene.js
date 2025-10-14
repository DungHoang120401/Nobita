/*
3D Character Figure Scene Generator
Creates a 3D character figure with round plastic base, box display, and computer showing Blender process

Usage:
- Can be integrated with other scripts in the Nobita repository
- Provides character modeling and scene setup functionality
- Includes realistic lighting and textures

Features:
- Interactive 3D character figure
- Round plastic base
- Box with character image
- Computer display showing Blender modeling process
- Indoor scene with proper lighting
- Realistic textures and materials

Author: Nobita Repository
*/

const CharacterSceneGenerator = {
    // Configuration options
    config: {
        characterHeight: 3.0,
        baseRadius: 1.2,
        boxSize: { width: 1.5, height: 2, depth: 0.3 },
        computerSize: { width: 2.5, height: 1.5, depth: 0.2 },
        lighting: {
            ambient: { color: 0x404040, intensity: 0.4 },
            main: { color: 0xffffff, intensity: 1.0 },
            fill: { color: 0x87ceeb, intensity: 0.3 }
        }
    },
    
    // Initialize the 3D scene
    init: function(containerId = 'character-scene-container') {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Container not found:', containerId);
            return false;
        }
        
        this.setupScene();
        this.setupRenderer();
        this.setupCamera();
        this.setupLights();
        this.createScene();
        this.startAnimation();
        
        return true;
    },
    
    // Setup Three.js scene
    setupScene: function() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x404040);
        this.scene.fog = new THREE.Fog(0x404040, 10, 50);
    },
    
    // Setup renderer with shadows and realistic lighting
    setupRenderer: function() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.physicallyCorrectLights = true;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        
        this.container.appendChild(this.renderer.domElement);
    },
    
    // Setup camera
    setupCamera: function() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(5, 3, 8);
        this.camera.lookAt(0, 1, 0);
    },
    
    // Create realistic lighting setup
    setupLights: function() {
        const config = this.config.lighting;
        
        // Ambient light
        const ambientLight = new THREE.AmbientLight(config.ambient.color, config.ambient.intensity);
        this.scene.add(ambientLight);
        
        // Main directional light (simulating window light)
        const mainLight = new THREE.DirectionalLight(config.main.color, config.main.intensity);
        mainLight.position.set(10, 10, 5);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        this.scene.add(mainLight);
        
        // Fill light
        const fillLight = new THREE.DirectionalLight(config.fill.color, config.fill.intensity);
        fillLight.position.set(-5, 5, -5);
        this.scene.add(fillLight);
        
        // Point light for accent
        const pointLight = new THREE.PointLight(0xffffff, 0.5, 10);
        pointLight.position.set(2, 4, 2);
        pointLight.castShadow = true;
        this.scene.add(pointLight);
    },
    
    // Create the complete scene
    createScene: function() {
        this.createEnvironment();
        this.createCharacterFigure();
        this.createRoundBase();
        this.createBoxWithImage();
        this.createComputerWithBlender();
    },
    
    // Create indoor environment
    createEnvironment: function() {
        // Floor
        const floorGeometry = new THREE.PlaneGeometry(20, 20);
        const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);
        
        // Walls
        const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xE6E6FA });
        
        const backWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 10), wallMaterial);
        backWall.position.set(0, 5, -10);
        this.scene.add(backWall);
        
        const sideWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 10), wallMaterial);
        sideWall.rotation.y = Math.PI / 2;
        sideWall.position.set(-10, 5, 0);
        this.scene.add(sideWall);
    },
    
    // Create 3D character figure
    createCharacterFigure: function() {
        const group = new THREE.Group();
        
        // Character parts with realistic materials
        const parts = [
            { geometry: new THREE.SphereGeometry(0.3, 32, 32), material: new THREE.MeshPhongMaterial({ color: 0xFFDBB0 }), position: [0, 2.3, 0] },
            { geometry: new THREE.CylinderGeometry(0.3, 0.4, 0.8, 8), material: new THREE.MeshPhongMaterial({ color: 0x4169E1 }), position: [0, 1.6, 0] }
        ];
        
        parts.forEach(part => {
            const mesh = new THREE.Mesh(part.geometry, part.material);
            mesh.position.set(...part.position);
            mesh.castShadow = true;
            group.add(mesh);
        });
        
        group.position.set(0, 0.5, 0);
        this.character = group;
        this.scene.add(group);
    },
    
    // Create round plastic base
    createRoundBase: function() {
        const baseGeometry = new THREE.CylinderGeometry(
            this.config.baseRadius, 
            this.config.baseRadius, 
            0.2, 
            32
        );
        const baseMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xC0C0C0,
            shininess: 100,
            transparent: true,
            opacity: 0.9
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 0.1;
        base.castShadow = true;
        base.receiveShadow = true;
        
        this.base = base;
        this.scene.add(base);
    },
    
    // Create box with printed image
    createBoxWithImage: function() {
        const group = new THREE.Group();
        const size = this.config.boxSize;
        
        // Main box
        const boxGeometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
        const boxMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.castShadow = true;
        box.receiveShadow = true;
        group.add(box);
        
        // Character image simulation
        const imageGeometry = new THREE.PlaneGeometry(size.width * 0.8, size.height * 0.8);
        const imageMaterial = new THREE.MeshPhongMaterial({ color: 0x87CEEB });
        const image = new THREE.Mesh(imageGeometry, imageMaterial);
        image.position.z = size.depth / 2 + 0.01;
        group.add(image);
        
        group.position.set(-3, 1, -2);
        this.box = group;
        this.scene.add(group);
    },
    
    // Create computer with Blender display
    createComputerWithBlender: function() {
        const group = new THREE.Group();
        const size = this.config.computerSize;
        
        // Monitor
        const monitorGeometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
        const monitorMaterial = new THREE.MeshPhongMaterial({ color: 0x2F2F2F });
        const monitor = new THREE.Mesh(monitorGeometry, monitorMaterial);
        monitor.position.y = 1.5;
        monitor.castShadow = true;
        group.add(monitor);
        
        // Screen displaying Blender interface
        const screenGeometry = new THREE.PlaneGeometry(size.width * 0.85, size.height * 0.75);
        const screenMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x1E1E1E,
            emissive: 0x0A0A0A
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(0, 1.5, size.depth / 2 + 0.01);
        group.add(screen);
        
        // Blender 3D viewport simulation
        const viewportGeometry = new THREE.PlaneGeometry(size.width * 0.7, size.height * 0.6);
        const viewportMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x3C3C3C,
            emissive: 0x1A1A1A
        });
        const viewport = new THREE.Mesh(viewportGeometry, viewportMaterial);
        viewport.position.set(0, 1.5, size.depth / 2 + 0.02);
        group.add(viewport);
        
        // 3D character in Blender (wireframe)
        const wireframeGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const wireframeMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFF6600,
            wireframe: true
        });
        const wireframeChar = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
        wireframeChar.position.set(0, 1.5, size.depth / 2 + 0.03);
        group.add(wireframeChar);
        
        // Monitor stand
        const standGeometry = new THREE.CylinderGeometry(0.15, 0.3, 0.3, 8);
        const standMaterial = new THREE.MeshPhongMaterial({ color: 0x2F2F2F });
        const stand = new THREE.Mesh(standGeometry, standMaterial);
        stand.position.y = 0.8;
        stand.castShadow = true;
        group.add(stand);
        
        group.position.set(3, 0, -1);
        this.computer = group;
        this.scene.add(group);
        
        // Animate Blender viewport
        this.animateBlenderDisplay(wireframeChar);
    },
    
    // Animate the Blender display
    animateBlenderDisplay: function(wireframeChar) {
        const animate = () => {
            wireframeChar.rotation.x += 0.01;
            wireframeChar.rotation.y += 0.02;
            requestAnimationFrame(animate);
        };
        animate();
    },
    
    // Start the animation loop
    startAnimation: function() {
        const animate = () => {
            requestAnimationFrame(animate);
            this.renderer.render(this.scene, this.camera);
        };
        animate();
    },
    
    // Utility methods
    updateLighting: function(intensity) {
        this.scene.traverse(child => {
            if (child instanceof THREE.DirectionalLight) {
                child.intensity = intensity;
            }
        });
    },
    
    // Export scene data (for integration with other scripts)
    exportSceneData: function() {
        return {
            characterPosition: this.character.position,
            basePosition: this.base.position,
            boxPosition: this.box.position,
            computerPosition: this.computer.position,
            lighting: this.config.lighting
        };
    }
};

// Make it available globally
if (typeof window !== 'undefined') {
    window.CharacterSceneGenerator = CharacterSceneGenerator;
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharacterSceneGenerator;
}