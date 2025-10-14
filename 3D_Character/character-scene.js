// 3D Character Figure Scene Implementation
class CharacterScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.character = null;
        this.base = null;
        this.box = null;
        this.computer = null;
        this.lights = [];
        this.animationId = null;
        this.wireframeMode = false;
        
        this.init();
    }
    
    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupControls();
        this.setupLights();
        this.createEnvironment();
        this.createCharacterFigure();
        this.createRoundBase();
        this.createBox();
        this.createComputer();
        this.setupEventListeners();
        this.animate();
        
        // Hide loading and show controls
        document.getElementById('loading').style.display = 'none';
        document.getElementById('controls').style.display = 'block';
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x404040);
        this.scene.fog = new THREE.Fog(0x404040, 10, 50);
    }
    
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(5, 3, 8);
        this.camera.lookAt(0, 1, 0);
    }
    
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.physicallyCorrectLights = true;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        
        document.getElementById('container').appendChild(this.renderer.domElement);
    }
    
    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 1.0;
    }
    
    setupLights() {
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        this.lights.push(ambientLight);
        
        // Main directional light (window light)
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
        mainLight.position.set(10, 10, 5);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 50;
        mainLight.shadow.camera.left = -10;
        mainLight.shadow.camera.right = 10;
        mainLight.shadow.camera.top = 10;
        mainLight.shadow.camera.bottom = -10;
        this.scene.add(mainLight);
        this.lights.push(mainLight);
        
        // Fill light
        const fillLight = new THREE.DirectionalLight(0x87ceeb, 0.3);
        fillLight.position.set(-5, 5, -5);
        this.scene.add(fillLight);
        this.lights.push(fillLight);
        
        // Point light for accent
        const pointLight = new THREE.PointLight(0xffffff, 0.5, 10);
        pointLight.position.set(2, 4, 2);
        pointLight.castShadow = true;
        this.scene.add(pointLight);
        this.lights.push(pointLight);
    }
    
    createEnvironment() {
        // Floor
        const floorGeometry = new THREE.PlaneGeometry(20, 20);
        const floorMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x8B4513,
            side: THREE.DoubleSide 
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);
        
        // Walls
        const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xE6E6FA });
        
        // Back wall
        const backWallGeometry = new THREE.PlaneGeometry(20, 10);
        const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
        backWall.position.set(0, 5, -10);
        this.scene.add(backWall);
        
        // Side wall
        const sideWallGeometry = new THREE.PlaneGeometry(20, 10);
        const sideWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
        sideWall.rotation.y = Math.PI / 2;
        sideWall.position.set(-10, 5, 0);
        this.scene.add(sideWall);
    }
    
    createCharacterFigure() {
        const group = new THREE.Group();
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const headMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xFFDBB0,
            shininess: 30
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2.3;
        head.castShadow = true;
        group.add(head);
        
        // Body
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.8, 8);
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x4169E1,
            shininess: 30
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.6;
        body.castShadow = true;
        group.add(body);
        
        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.6, 8);
        const armMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xFFDBB0,
            shininess: 30
        });
        
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.5, 1.7, 0);
        leftArm.rotation.z = Math.PI / 4;
        leftArm.castShadow = true;
        group.add(leftArm);
        
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.5, 1.7, 0);
        rightArm.rotation.z = -Math.PI / 4;
        rightArm.castShadow = true;
        group.add(rightArm);
        
        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.1, 0.12, 0.8, 8);
        const legMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x2F4F4F,
            shininess: 30
        });
        
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.2, 0.8, 0);
        leftLeg.castShadow = true;
        group.add(leftLeg);
        
        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.2, 0.8, 0);
        rightLeg.castShadow = true;
        group.add(rightLeg);
        
        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.1, 2.35, 0.25);
        group.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.1, 2.35, 0.25);
        group.add(rightEye);
        
        group.position.set(0, 0.5, 0);
        this.character = group;
        this.scene.add(group);
    }
    
    createRoundBase() {
        const baseGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32);
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
        
        // Add base label
        const labelGeometry = new THREE.RingGeometry(0.8, 1.1, 32);
        const labelMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x333333,
            side: THREE.DoubleSide
        });
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.rotation.x = -Math.PI / 2;
        label.position.y = 0.21;
        
        const group = new THREE.Group();
        group.add(base);
        group.add(label);
        
        this.base = group;
        this.scene.add(group);
    }
    
    createBox() {
        const group = new THREE.Group();
        
        // Main box
        const boxGeometry = new THREE.BoxGeometry(1.5, 2, 0.3);
        const boxMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xFFFFFF,
            shininess: 30
        });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.castShadow = true;
        box.receiveShadow = true;
        group.add(box);
        
        // Character image on box (simulated with colored plane)
        const imageGeometry = new THREE.PlaneGeometry(1.2, 1.6);
        const imageMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x87CEEB,
            shininess: 10
        });
        const image = new THREE.Mesh(imageGeometry, imageMaterial);
        image.position.z = 0.16;
        group.add(image);
        
        // Add some details to simulate printed image
        const detailGeometry = new THREE.PlaneGeometry(0.3, 0.3);
        const detailMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xFFDBB0
        });
        const detail = new THREE.Mesh(detailGeometry, detailMaterial);
        detail.position.set(0, 0.3, 0.17);
        group.add(detail);
        
        group.position.set(-3, 1, -2);
        this.box = group;
        this.scene.add(group);
    }
    
    createComputer() {
        const group = new THREE.Group();
        
        // Monitor
        const monitorGeometry = new THREE.BoxGeometry(2.5, 1.5, 0.2);
        const monitorMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x2F2F2F,
            shininess: 50
        });
        const monitor = new THREE.Mesh(monitorGeometry, monitorMaterial);
        monitor.position.y = 1.5;
        monitor.castShadow = true;
        group.add(monitor);
        
        // Screen showing Blender interface
        const screenGeometry = new THREE.PlaneGeometry(2.2, 1.2);
        const screenMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x1E1E1E,
            emissive: 0x0A0A0A
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(0, 1.5, 0.11);
        group.add(screen);
        
        // Blender viewport simulation
        const blenderViewGeometry = new THREE.PlaneGeometry(1.8, 0.9);
        const blenderViewMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x3C3C3C,
            emissive: 0x1A1A1A
        });
        const blenderView = new THREE.Mesh(blenderViewGeometry, blenderViewMaterial);
        blenderView.position.set(0, 1.5, 0.12);
        group.add(blenderView);
        
        // 3D viewport with wireframe character
        const wireframeGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const wireframeMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFF6600,
            wireframe: true
        });
        const wireframeChar = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
        wireframeChar.position.set(0, 1.5, 0.13);
        group.add(wireframeChar);
        
        // Stand
        const standGeometry = new THREE.CylinderGeometry(0.15, 0.3, 0.3, 8);
        const standMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x2F2F2F,
            shininess: 50
        });
        const stand = new THREE.Mesh(standGeometry, standMaterial);
        stand.position.y = 0.8;
        stand.castShadow = true;
        group.add(stand);
        
        // Base
        const baseGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 16);
        const baseMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x2F2F2F,
            shininess: 50
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 0.05;
        base.castShadow = true;
        base.receiveShadow = true;
        group.add(base);
        
        group.position.set(3, 0, -1);
        this.computer = group;
        this.scene.add(group);
        
        // Animate the wireframe character in Blender viewport
        this.animateBlenderViewport(wireframeChar);
    }
    
    animateBlenderViewport(wireframeChar) {
        const animate = () => {
            wireframeChar.rotation.x += 0.01;
            wireframeChar.rotation.y += 0.02;
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize(), false);
        
        // Lighting control
        document.getElementById('lightIntensity').addEventListener('input', (e) => {
            const intensity = parseFloat(e.target.value);
            this.lights.forEach((light, index) => {
                if (index > 0) { // Skip ambient light
                    light.intensity = intensity * (index === 1 ? 1 : 0.3);
                }
            });
        });
        
        // Auto-rotate control
        document.getElementById('autoRotate').addEventListener('input', (e) => {
            this.controls.autoRotate = e.target.value === '1';
        });
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    resetCamera() {
        this.camera.position.set(5, 3, 8);
        this.camera.lookAt(0, 1, 0);
        this.controls.reset();
    }
    
    toggleWireframe() {
        this.wireframeMode = !this.wireframeMode;
        
        this.scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
                child.material.wireframe = this.wireframeMode;
            }
        });
    }
}

// Global functions for controls
let characterScene;

function resetCamera() {
    if (characterScene) {
        characterScene.resetCamera();
    }
}

function toggleWireframe() {
    if (characterScene) {
        characterScene.toggleWireframe();
    }
}

// Initialize the scene when the page loads
window.addEventListener('load', () => {
    characterScene = new CharacterScene();
});