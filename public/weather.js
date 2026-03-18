class Cloud extends PIXI.Container {
  constructor(x, y, options = {}) {
    // Default options with overrides
    super();
    this.options = {
      minRadius: 10,
      circleCount: 12,
      color: 0xf2f2f2,
      alpha: 1.0,
      spreadX: 120,
      spreadY: 60,
      thunder: false,
      originalTint: null,
      ...options
    };
    if (this.options.thunder) {
        this.thunderTimer = 0;
        this.thunderInterval = 3000 + Math.floor(1000*Math.random());
    }
    // Create the main container
    //this.container = new PIXI.Container();
    this.position.set(x, y);
    
    // Create cloud circles
    this.createCircles();
    
    // Add subtle movement
    this.speed = (Math.random() * 0.5 + 0.2) * (Math.random() > 0.5 ? 1 : -1);
    this.originalX = x;
    this.waveAmplitude = Math.random() * 5 + 2;
    this.waveSpeed = Math.random() * 0.01 + 0.005;
    this.time = Math.random() * Math.PI * 2;
    this.vel = Math.random()*0.6 -0.5;
  }

  createCircles() {
    this.circles = [];
    const { circleCount, minRadius, maxRadius, color, alpha, spreadX, spreadY, thunder, originalTint} = this.options;
    
    // Create main circles
    for (let i = 0; i < circleCount; i++) {
      const radius = Math.random() * (maxRadius - minRadius) + minRadius;
      
      // Position circles in a cloud-like formation
      let x, y;
      if (i < 3) {
        // Main central circles
        x = (Math.random() - 0.5) * spreadX * 0.3;
        y = (Math.random() - 0.5) * spreadY * 0.3;
      } else if (i < 6) {
        // Surrounding circles
        x = (Math.random() - 0.5) * spreadX * 0.7;
        y = (Math.random() - 0.5) * spreadY * 0.7;
      } else {
        // Outer fluff circles
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * spreadX * 0.8;
        x = Math.cos(angle) * distance * 0.5;
        y = Math.sin(angle) * distance * 0.3;
      }
      
      const circle = new PIXI.Graphics();

      // Create circle
      circle.beginFill(color, alpha);   
           
      // Add slight gradient or variation to alpha
      const circleAlpha = alpha * (0.7 + Math.random() * 0.3);
      circle.alpha = alpha;
      
      // Draw circle with subtle random distortion for organic look
      const segments = 16;
      for (let j = 0; j < segments; j++) {
        const angle = (j / segments) * Math.PI * 2;
        const nextAngle = ((j + 1) / segments) * Math.PI * 2;
        
        // Add slight randomness to radius for organic look
        const segmentRadius = radius * (0.9 + Math.random() * 0.2);
        const nextSegmentRadius = radius * (0.9 + Math.random() * 0.2);
        
        if (j === 0) {
          circle.moveTo(
            x + Math.cos(angle) * segmentRadius,
            y + Math.sin(angle) * segmentRadius
          );
        }
        
        circle.lineTo(
          x + Math.cos(nextAngle) * nextSegmentRadius,
          y + Math.sin(nextAngle) * nextSegmentRadius
        );
      }
      
      circle.endFill(); 
      if (thunder) {
         circle.tint = originalTint
       }
      this.addChild(circle);
      this.circles.push(circle);
      }
    }
    update(delta = 1) {
        this.x  += this.vel;
        if (this.x >= (window.innerWidth ) || this.x < -200) {
            this.bounce();
        }
        if (!this.options.thunder)  return;
        
        this.thunderTimer += delta;
        if (this.thunderTimer >= this.thunderInterval) {
            this.thunderTimer = 0;
            const circle = this.children[0]//circles[Math.floor(Math.random()*this.circles.length)];
            const original = this.options.originalTint;
            circle.tint = 0xfffcc4;
            setTimeout(()=> {circle.tint = original}, 100);
            setTimeout(()=> {circle.tint = 0xfffcc4}, 200);
            setTimeout(()=> {circle.tint = original}, 300);
          //setTimeout(() => {circle.tint = })
        }
     }
    
    bounce(){
        this.vel *= -1;
    }
    getContainer() {
        return this.container;
    }   
}

class Plane extends PIXI.Sprite{
    constructor(texture, pos, vel, scale){
        super(texture);
        this.vel = vel;
        this.x = pos.x;
        this.y = pos.y;
        this.originalScale = scale;
        this.scale.set(scale);
        this.anchor.set(0.5);
    }
    update () {
        this.x += this.vel;
        if (this.x > (window.innerWidth + 200) || this.x < -200){
            this.bounce();
        }
    }
    bounce(){
        this.vel *=-1;
        this.angle = (this.angle + 180) % 360;
        const newScale = Math.random()*0.7*this.originalScale+0.3*this.originalScale;
        this.scale.x = newScale;         
        this.scale.y = - Math.sign(this.scale.y)*newScale;
        this.y = Math.random()*0.3*window.innerHeight+0.1*window.innerHeight;
    }
}

class Rain {
    constructor(options={}){
        this.options = {
            dropCount : 300,
            length : 10,
            thickness : 3,
            color : 0xddddff,
            alpha : 0.9,
            vel : 15,
            angle : 7,
            ...options
        };
        this.container = new PIXI.Container();
        this.container.position.set(0,0);
        this.createRain();
    };
    createRain(){
        this.drops = []
        const {dropCount, length, thickness, color, alpha, vel, angle} = this.options;
        for (let i = 0; i < dropCount; i++){
            const drop = new PIXI.Graphics();
            const rads = (Math.random()*(0.4*angle)+0.8*vel)*Math.PI/180;
            const dropVel = Math.random()*(0.4*vel)+(0.8*vel)
            const dropLenght = Math.random()*(0.6*length)+0.7*length;
            drop.vel = {x: -dropVel*Math.sin(rads), y: dropVel*Math.cos(rads)};
            const dropPoints = [0, 0,
                                thickness, thickness*Math.sin(rads),
                                thickness-length*Math.sin(rads), length+thickness*Math.sin(rads),
                                 -length*Math.sin(rads), length];
            drop.poly(dropPoints, true);
            drop.fill(color, alpha);
            drop.x = Math.floor(Math.random()*window.innerWidth*1.5);
            drop.y = Math.floor(Math.random()*(0+window.innerHeight)-window.innerHeight);
            drop.originalPos = {x: drop.x, y: drop.y}
            this.container.addChild(drop);
            this.drops.push(drop);
        }
    }

    update(delta = 1){
        this.drops.forEach((drop) => {
            drop.x += drop.vel.x;
            drop.y += drop.vel.y;
            if (drop.y >= window.innerHeight + 50){
                this.returnToTop(drop);
            }
        })
    }
    
    returnToTop(drop) {
        drop.x = drop.originalPos.x;
        drop.y = drop.originalPos.y;
    }

    getContainer(){
        return this.container;
    }
}

class Snow {
    constructor(options={}){
        this.options = {
            snowCount : 100,
            radius: 5,
            color: 0xffffff,
            alpha : 0.9,
            vel: 6,
            angle: 5,
            ...options
        };
        this.container = new PIXI.Container();
        this.container.position.set(0,0);
        this.createSnow();
    };
    createSnow(){
        this.flakes = [];
        const {snowCount, radius, color, alpha, vel, angle} = this.options;
        for (let i = 0; i < snowCount ; i++){
            const flake = new PIXI.Graphics();
            const rads = (Math.random()*(0.4*angle)+0.8*vel)*Math.PI/180;
            const flakeVel = Math.random()*(0.4*vel)+(0.8*vel);
            flake.vel = {x: -flakeVel*Math.sin(rads), y: flakeVel*Math.cos(rads)};
            flake.circle(0,0,Math.random()*0.4*radius+0.8*radius);
            flake.fill(color, alpha);
            flake.x = Math.floor(Math.random()*window.innerWidth*1.5);
            flake.y = Math.floor(Math.random()*(window.innerHeight)-window.innerHeight);
            flake.originalPos = {x: flake.x, y: flake.y};
            this.container.addChild(flake);
            this.flakes.push(flake);
        }
    }

    update(delta = 1){
        this.flakes.forEach((flake) => {
            flake.x += flake.vel.x;
            flake.y += flake.vel.y;
            if (flake.y >= window.innerHeight+50){
                this.returnToTop(flake);
            }
        })
    }
    returnToTop(drop) {
        drop.x = drop.originalPos.x;
        drop.y = drop.originalPos.y;
    }
}

class Sunbeam extends PIXI.Graphics {
    constructor(options = {}){
        super();
        this.options = {
            vertices: [],
            color: 0xffff00,
            alpha: 0.9,
            sunbeamChange: 0.002,
            ...options
        }
        this.poly(this.options.vertices, true)
        this.fill({color: this.options.color, alpha: this.options.alpha});
    }
}

class ParticleSwarm extends PIXI.Container {
  constructor(app, {
    count = 12,
    orbitRadius = 80,
    trailLength = 28,
    colors = [0xeeeeee, 0x555555, 0x999999, 0xbbbbbb, 0xdddddd],
    speed = 0.6,
  } = {}) {
    super();
    this.app = app;
    this.count = count;
    this.orbitRadius = orbitRadius;
    this.trailLength = trailLength;
    this.colors = colors;
    this.speed = speed;

    this.cx = app.screen.width / 2;
    this.cy = app.screen.height / 2;
    this._t = Math.random()*1000;
    this.particles = [];
    this.trails = [];

    for (let i = 0; i < count; i++) {
      const color = colors[i % colors.length];
      const angle = (i / count) * Math.PI * 2;
      const oscPhase = Math.random() * Math.PI * 2;
      const oscSpeed = 0.03 + Math.random() * 0.03;
      const oscAmp   = 8 + Math.random() * 18;
      const rotSpeed = (0.012 + Math.random() * 0.018) * (Math.random() < 0.5 ? 1 : -1);
      const orbitOff = (Math.random() - 0.5) * 30;

      // --- Trail (v8 API) ---
      const trail = new PIXI.Graphics();
      this.addChild(trail);
      this.trails.push({ gfx: trail, points: [], color });

      // --- Particle (v8 API) ---
      const g = new PIXI.Graphics();
      g.circle(0, 0, 4 + Math.random() * 3);
      g.fill({ color, alpha: 1 });
      this.addChild(g);

      this.particles.push({
        g, angle, rotSpeed, oscPhase, oscSpeed, oscAmp, orbitOff, color,
        x: this.cx, y: this.cy,
      });
    }

    this._tick = this._update.bind(this);
    app.ticker.add(this._tick);
  }

  _update(ticker) {
    // v8 passes a Ticker object, delta lives at ticker.deltaTime
    const delta = ticker.deltaTime ?? ticker ?? 1;
    const w = this.app.screen.width;
    const h = this.app.screen.height;
    const margin = 30;
    this._t += 0.004 * delta * this.speed;

    this.cx = (w / 2) + Math.sin(this._t * 1.0)           * (w / 2 - margin);
    this.cy = (h / 2) + Math.sin(this._t * 1.37 + 0.5)    * (h / 2 - margin);
    
    for (let i = 0; i < this.count; i++) {
      const p = this.particles[i];
      const t = this.trails[i];

      p.angle    += p.rotSpeed * delta * this.speed;
      p.oscPhase += p.oscSpeed * delta;

      const r  = this.orbitRadius + p.orbitOff + Math.sin(p.oscPhase) * p.oscAmp;
      const ox = Math.cos(p.angle) * r;
      const oy = Math.sin(p.angle) * r * 0.55;
      const noiseX = (Math.random() - 0.5) * 1.2;
      const noiseY = (Math.random() - 0.5) * 1.2;

      p.x += ((this.cx + ox + noiseX) - p.x) * 0.12 * delta;
      p.y += ((this.cy + oy + noiseY) - p.y) * 0.12 * delta;

      p.g.x = p.x;
      p.g.y = p.y;

      // Trail
      t.points.push({ x: p.x, y: p.y });
      if (t.points.length > this.trailLength) t.points.shift();

      // Draw trail (v8 API)
      t.gfx.clear();
      for (let j = 1; j < t.points.length; j++) {
        const alpha = (j / t.points.length) * 0.45;
        const width = (j / t.points.length) * 3.5;
        t.gfx.moveTo(t.points[j - 1].x, t.points[j - 1].y);
        t.gfx.lineTo(t.points[j].x,     t.points[j].y);
        t.gfx.stroke({ width, color: t.color, alpha });
      }
    }
  }

  destroy() {
    this.app.ticker.remove(this._tick);
    super.destroy({ children: true });
  }
}



const bgWait = async () => {
    let bgApp = new PIXI.Application();
    await bgApp.init({
        background : '#bbbbea',
        resizeTo: window,
        transparent: false
    })
    document.getElementById('bg-container').appendChild(bgApp.canvas);
    const swarm = new ParticleSwarm(bgApp, {
    count: 8,
    orbitRadius: 30,
    trailLength: 15,
    colors: [0x7777ee, 0x9999ee, 0xaaaaee, 0xbbbbee, 0xccccee, 0xddddff, 0xeeeeff],
    speed: 2.0,
    });
    bgApp.stage.addChild(swarm);
}

const fWait = async () => {
    let fApp = new PIXI.Application();
    await fApp.init({
        backgroundAlpha: 0,
        resizeTo: window,
        transparent: true
    });
    document.getElementById('front-container').appendChild(fApp.canvas);
    const swarm = new ParticleSwarm(fApp, {
    count: 15,
    orbitRadius: 100,
    trailLength: 15,
    colors: [0x7777ee, 0x9999ee, 0xaaaaee, 0xbbbbee, 0xccccee, 0xddddee, 0xeeeeff],
    speed: 0.5,
    });
    fApp.stage.addChild(swarm);

}

const wait = () => {
    bgWait();
    fWait();
}



const bgSnow = async () => {
    let bgApp = new PIXI.Application();
    await bgApp.init({
        background: '#A1C9D1',
        resizeTo: window,
        transparent: false});
    document.getElementById('bg-container').appendChild(bgApp.canvas);
    const snowOptions = {
        snowCount : 50,
        alpha: 1.0
    };
    const snow = new Snow(snowOptions);
    bgApp.stage.addChild(snow.container);
     
    let clouds = [];
    let nClouds = 5;
    for (let i = 0; i < nClouds; i++){
        const x = Math.random() * window.innerWidth;
        const y = window.innerHeight;
        const cloudOptions = {
            minRadius: 50 + Math.random() * 10,
            maxRadius: 70 + Math.random() * 10,
            circleCount: 3,
            color: 0xffffff,
            alpha: 1,//0.5+ Math.random() * 0.3,
            spreadX: window.innerWidth,
            spreadY: 50 
        }
        const cloud = new Cloud( x, y, cloudOptions);
        cloud.circles.forEach((circle) => {
            circle.alpha = 1;
        })
        bgApp.stage.addChild(cloud);
        clouds.push(cloud);
    }

    bgApp.ticker.add((delta) => {
        snow.update(delta);
    })
}

const fSnow = async () => {
    let fApp = new PIXI.Application();
    await fApp.init({
        backgroundAlpha: 0,
        resizeTo: window,
        transparent: true
    });
    document.getElementById('front-container').appendChild(fApp.canvas);
    const snowOptions = {
        snowCount: 50,
        alpha: 0.9
    }
    const snow = new Snow(snowOptions);
    fApp.stage.addChild(snow.container);
    fApp.ticker.add((delta) => {
        snow.update(delta);
    })
}

const snow = async () => {
    bgSnow();
    fSnow();
}


const bgRain = async () => {
    let bgApp = new PIXI.Application();
    await bgApp.init({
        background: '#A1C9D1',
        resizeTo: window,
        transparent: true })
    document.getElementById('bg-container').appendChild(bgApp.canvas);
    const rainOptions = {
        dropCount : 70,
        };
    const rain = new Rain(rainOptions);
    bgApp.stage.addChild(rain.container);
    let clouds = [];
    let nClouds = 10;
    for (let i = 0; i < nClouds; i++){
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * 0.4 - 150;
        const cloudOptions = {
            minRadius: 30 + Math.random() * 10,
            maxRadius: 100 + Math.random() * 20,
            circleCount: 8 + Math.floor(Math.random() * 10),
            color: 0xdadada,
            alpha: 0.5+ Math.random() * 0.3,
            spreadX: 300 + Math.random() * 100,
            spreadY: 150 + Math.random() * 60
        }
        const cloud = new Cloud( x, y, cloudOptions);
        bgApp.stage.addChild(cloud);
        clouds.push(cloud);
    }
    bgApp.ticker.add((delta) => {
        rain.update(delta);
        clouds.forEach(cloud => {
            cloud.update(delta);
        })
    })
}

const fRain = async () => {
     let fApp = new PIXI.Application();
     await fApp.init({
        backgroundAlpha: 0,
        resizeTo: window,
        transparent: true })
    document.getElementById('front-container').appendChild(fApp.canvas);
    const rainOptions = {
        dropCount : 50,
        };
    const rain = new Rain(rainOptions);
    fApp.stage.addChild(rain.container);
    let clouds = [];
    let nClouds = 5;
    for (let i = 0; i < nClouds; i++){
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * 0.4 - 150;
        const cloudOptions = {
            minRadius: 30 + Math.random() * 10,
            maxRadius: 100 + Math.random() * 20,
            circleCount: 8 + Math.floor(Math.random() * 10),
            color: 0xdadada,
            alpha: 0.4+ Math.random() * 0.3,
            spreadX: 300 + Math.random() * 100,
            spreadY: 150 + Math.random() * 60
        }
        const cloud = new Cloud( x, y, cloudOptions);
        fApp.stage.addChild(cloud);
        clouds.push(cloud);
    }
    fApp.ticker.add((delta) => {
        rain.update(delta);
        clouds.forEach(cloud => {
            cloud.update(delta);
        })
    })

}

const rain = () => {
    bgRain();
    fRain();
}

const bgSRain = async () => {
    let bgApp = new PIXI.Application();
    await bgApp.init({
        background: '#AfCfDf',
        resizeTo: window,
        transparent: true })
    document.getElementById('bg-container').appendChild(bgApp.canvas);
    const rainOptions = {
        dropCount : 100,
        vel : 20
        };
    const rain = new Rain(rainOptions);
    bgApp.stage.addChild(rain.container);
    let clouds = [];
    let nClouds = 10;
    for (let i = 0; i < nClouds; i++){
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * 0.4 - 150;
        const cloudOptions = {
            minRadius: 30 + Math.random() * 10,
            maxRadius: 100 + Math.random() * 20,
            circleCount: 8 + Math.floor(Math.random() * 10),
            color: 0xd2d2d2,
            alpha: 0.5+ Math.random() * 0.3,
            spreadX: 300 + Math.random() * 100,
            spreadY: 150 + Math.random() * 60
        }
        const cloud = new Cloud( x, y, cloudOptions);
        bgApp.stage.addChild(cloud);
        clouds.push(cloud);
    }
    bgApp.ticker.add((delta) => {
        rain.update(delta);
        clouds.forEach(cloud => {
            cloud.update(delta);
        })
    })
}

const fSRain = async () => {
     let fApp = new PIXI.Application();
     await fApp.init({
        backgroundAlpha: 0,
        resizeTo: window,
        transparent: true })
    document.getElementById('front-container').appendChild(fApp.canvas);
    const rainOptions = {
        dropCount : 100,
        vel: 20
        };
    const rain = new Rain(rainOptions);
    fApp.stage.addChild(rain.container);
    let clouds = [];
    let nClouds = 5;
    for (let i = 0; i < nClouds; i++){
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * 0.4 - 150;
        const cloudOptions = {
            minRadius: 30 + Math.random() * 10,
            maxRadius: 100 + Math.random() * 20,
            circleCount: 8 + Math.floor(Math.random() * 10),
            color: 0xdadada,
            alpha: 0.4+ Math.random() * 0.3,
            spreadX: 300 + Math.random() * 100,
            spreadY: 150 + Math.random() * 60
        }
        const cloud = new Cloud( x, y, cloudOptions);
        fApp.stage.addChild(cloud);
        clouds.push(cloud);
    }
    fApp.ticker.add((delta) => {
        rain.update(delta);
        clouds.forEach(cloud => {
            cloud.update(delta);
        })
    })

}

const srain = () => {
    bgSRain();
    fSRain();
}

const bgThunder = async  () => {
    let bgApp = new PIXI.Application();
    await bgApp.init(
        {background: '#8694aa',
        resizeTo: window,
        transparent: true});
    document.getElementById('bg-container').appendChild(bgApp.canvas);
    let clouds = [];
    let nClouds = 10;
    for (let i = 0; i < nClouds; i++){
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * 0.5;
        const cloudOptions = {
            minRadius: 30 + Math.random() * 10,
            maxRadius: 100 + Math.random() * 20,
            circleCount: 8 + Math.floor(Math.random() * 10),
            color: 0xffffff,
            alpha: 0.5+ Math.random() * 0.3,
            spreadX: 300 + Math.random() * 100,
            spreadY: 150 + Math.random() * 60,
            thunder: true,
            originalTint: 0x6d6d6d
        }
        const cloud = new Cloud( x, y, cloudOptions);
        bgApp.stage.addChild(cloud);
        clouds.push(cloud);
    }
    
    bgApp.ticker.add((delta)=>{
        clouds.forEach(cloud =>{
            cloud.update(delta.deltaMS);
        })
    });
};


const fThunder = async () => {
    let fApp = new PIXI.Application();
    await fApp.init(
        {backgroundAlpha: 0,
        resizeTo: window,
        transparent: true});
    document.getElementById('front-container').appendChild(fApp.canvas);
    let clouds = [];
    let nClouds = 3;
    for (let i = 0; i < nClouds; i++){
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * 0.5;
        const cloudOptions = {
            minRadius: 30 + Math.random() * 10,
            maxRadius: 100 + Math.random() * 20,
            circleCount: 8 + Math.floor(Math.random() * 10),
            color: 0xffffff,
            alpha: 0.5+ Math.random() * 0.1,
            spreadX: 300 + Math.random() * 100,
            spreadY: 150 + Math.random() * 60,
            thunder: true,
            originalTint: 0x6d6d6d
        }
        const cloud = new Cloud( x, y, cloudOptions);
        fApp.stage.addChild(cloud);
        clouds.push(cloud);
    }
    
    fApp.ticker.add((delta)=>{
        clouds.forEach(cloud =>{
            cloud.update(delta.deltaMS);
        })
    });
};

const thunder = () => {
    bgThunder();
    fThunder();
}


const bgClear = async () => {
    let bgApp = new PIXI.Application();
    await bgApp.init(
        {background: '#69E2FF',
        resizeTo: window,
        transparent: true});
    document.getElementById('bg-container').appendChild(bgApp.canvas);
}

const fClear = async () => {
    let fApp = new PIXI.Application();
    await fApp.init(
        {resizeTo: window,
        transparent: true,
        backgroundAlpha: 0});
    document.getElementById('front-container').appendChild(fApp.canvas);
    const width = window.innerWidth;
    const height = window.innerHeight;
    const sunbeam = new Sunbeam( {
        vertices: [ Math.floor(0.8*width), 0, 
                  Math.floor(0.95*width), 0, 
                  Math.floor(0.7*width) , height,
                  Math.floor(0.4*width), height ],
        color : 0xF4E99B,
        alpha : 0.6}
    );
    const ray1 = new Sunbeam( {
        vertices : [ Math.floor(0.78*width), 0, 
                   Math.floor(0.8*width), 0, 
                   Math.floor(0.37*width) , height,
                   Math.floor(0.32*width), height ],
        color: 0xFAEEBE,
        alpha: 0.6}
    );
    const ray2 = new Sunbeam( {
        vertices : [ Math.floor(0.95*width), 0, 
                     Math.floor(0.97*width), 0, 
                     Math.floor(0.77*width) , height,
                     Math.floor(0.73*width), height ],
        color : 0xFAEEBE,
        alpha: 0.6}
    );     
    fApp.stage.addChild(ray1);
    fApp.stage.addChild(ray2);
    fApp.stage.addChild(sunbeam);

    const texture = await PIXI.Assets.load('/images/plane1.png');
    const plane = new Plane(texture, {x: 100, y: 100}, 2, 0.15);
    fApp.stage.addChild(plane);
    fApp.ticker.add((delta)=>{
        plane.update();
    });
}

const clear = () => {
    bgClear();
    fClear();
}


const bgBClouds = async () => {
    let bgApp = new PIXI.Application();
    await bgApp.init(
        {background: '#D2F7FF',
        resizeTo: window,
        transparent: true});
    document.getElementById('bg-container').appendChild(bgApp.canvas);
    let clouds = [];
    let nClouds = 15;
    for (let i = 0; i < nClouds; i++){
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * 0.4 - 100;
        const cloudOptions = {
            minRadius: 30 + Math.random() * 10,
            maxRadius: 100 + Math.random() * 20,
            circleCount: 8 + Math.floor(Math.random() * 10),
            color: 0xd2d2d2,
            alpha: 0.5+ Math.random() * 0.3,
            spreadX: 300 + Math.random() * 100,
            spreadY: 150 + Math.random() * 60
        }
        const cloud = new Cloud( x, y, cloudOptions);
        bgApp.stage.addChild(cloud);
        clouds.push(cloud);
    }
    bgApp.ticker.add((delta)=>{
        clouds.forEach(cloud =>{
            cloud.update(delta);
        })
    });
}

const fBClouds =  async () => {
    let fApp = new PIXI.Application();
    await fApp.init(
        {resizeTo: window,
        transparent: true,
        backgroundAlpha: 0});
    document.getElementById('front-container').appendChild(fApp.canvas);
    const width = window.innerWidth;
    const height = window.innerHeight;
    let sunbeamAlpha = 0.5;
    let sunbeamChange = 0.001;
    const sunbeam = new Sunbeam( {
                vertices: [ Math.floor(0.8*width), 0, 
                            Math.floor(0.95*width), 0, 
                            Math.floor(0.7*width) , height,
                            Math.floor(0.4*width), height ],
                color: 0xFFFBE8,
                alpha: sunbeamAlpha})
    const ray1 = new Sunbeam({
                    vertices : [ Math.floor(0.78*width), 0, 
                                 Math.floor(0.8*width), 0, 
                                 Math.floor(0.37*width) , height,
                                 Math.floor(0.32*width), height ],
                    color: 0xFFFBE8,
                    alpha: sunbeamAlpha});
    const ray2 = new Sunbeam({
                    vertices:  [ Math.floor(0.95*width), 0, 
                             Math.floor(0.97*width), 0, 
                             Math.floor(0.77*width) , height,
                             Math.floor(0.73*width), height ],
                    color: 0xFFFBE8,
                    alpha: sunbeamAlpha });
    
    fApp.stage.addChild(sunbeam);
    fApp.stage.addChild(ray1);
    fApp.stage.addChild(ray2);

    let clouds = [];
    let nClouds = 10;
    for (let i = 0; i < nClouds; i++){
        const x = Math.random() * width;
        const y = Math.random() * height * 0.4 -100;
        const cloudOptions = {
            minRadius: 30 + Math.random() * 10,
            maxRadius: 100 + Math.random() * 20,
            circleCount: 8 + Math.floor(Math.random() * 10),
            color: 0xeaeaea,
            alpha: 0.3 + Math.random() * 0.3,
            spreadX: 300 + Math.random() * 100,
            spreadY: 150 + Math.random() * 60
        }
        const cloud = new Cloud( x, y, cloudOptions);
        fApp.stage.addChild(cloud);
        clouds.push(cloud)
    }
    
    fApp.ticker.add((delta)=>{
        sunbeamAlpha += sunbeamChange;
        if (sunbeamAlpha >= 0.6 || sunbeamAlpha <0.01 ){
            sunbeamChange *= -1;
        }
        sunbeam.alpha = sunbeamAlpha;
        ray1.alpha = 0.6 - sunbeamAlpha;
        ray2.alpha = 0.6 - sunbeamAlpha;

        clouds.forEach(cloud=>{
            cloud.update(delta);
        })
    })
}

const bclouds = () => {
    bgBClouds();
    fBClouds();
}

const bgSClouds = async () => {
    let bgApp = new PIXI.Application();
    await bgApp.init(
        {background: '#D2F7FF',
        resizeTo: window,
        transparent: true});
    document.getElementById('bg-container').appendChild(bgApp.canvas);
    let clouds = [];
    let nClouds = 3;
    for (let i = 0; i < nClouds; i++){
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * 0.4 - 100;
        const cloudOptions = {
            minRadius: 30 + Math.random() * 10,
            maxRadius: 100 + Math.random() * 20,
            circleCount: 5 + Math.floor(Math.random() * 10),
            color: 0xf5f5f5,
            alpha: 0.5+ Math.random() * 0.3,
            spreadX: 300 + Math.random() * 100,
            spreadY: 150 + Math.random() * 60
        }
        const cloud = new Cloud( x, y, cloudOptions);
        bgApp.stage.addChild(cloud);
        clouds.push(cloud);
    }
    bgApp.ticker.add((delta)=>{
        clouds.forEach(cloud =>{
            cloud.update(delta);
        })
    });
}

const fSClouds =  async () => {
    let fApp = new PIXI.Application();
    await fApp.init(
        {resizeTo: window,
        transparent: true,
        backgroundAlpha: 0});
    document.getElementById('front-container').appendChild(fApp.canvas);
    const width = window.innerWidth;
    const height = window.innerHeight;
    let sunbeamAlpha = 0.6;
    let sunbeamChange = 0.002;
    const sunbeam = new Sunbeam( {
                vertices: [ Math.floor(0.8*width), 0, 
                            Math.floor(0.95*width), 0, 
                            Math.floor(0.7*width) , height,
                            Math.floor(0.4*width), height ],
                color: 0xFFFBE8,
                alpha: sunbeamAlpha})
    const ray1 = new Sunbeam({
                    vertices : [ Math.floor(0.78*width), 0, 
                                 Math.floor(0.8*width), 0, 
                                 Math.floor(0.37*width) , height,
                                 Math.floor(0.32*width), height ],
                    color: 0xFFFBE8,
                    alpha: sunbeamAlpha});
    const ray2 = new Sunbeam({
                    vertices:  [ Math.floor(0.95*width), 0, 
                             Math.floor(0.97*width), 0, 
                             Math.floor(0.77*width) , height,
                             Math.floor(0.73*width), height ],
                    color: 0xFFFBE8,
                    alpha: sunbeamAlpha });
    
    fApp.stage.addChild(sunbeam);
    fApp.stage.addChild(ray1);
    fApp.stage.addChild(ray2);

    let clouds = [];
    let nClouds = 3;
    for (let i = 0; i < nClouds; i++){
        const x = Math.random() * width;
        const y = Math.random() * height * 0.4 -100;
        const cloudOptions = {
            minRadius: 30 + Math.random() * 10,
            maxRadius: 100 + Math.random() * 20,
            circleCount: 5 + Math.floor(Math.random() * 10),
            color: 0xf5f5f5,
            alpha: 0.3 + Math.random() * 0.3,
            spreadX: 300 + Math.random() * 100,
            spreadY: 150 + Math.random() * 60
        }
        const cloud = new Cloud( x, y, cloudOptions);
        fApp.stage.addChild(cloud);
        clouds.push(cloud)
    }
    
    fApp.ticker.add((delta)=>{
        sunbeamAlpha += sunbeamChange;
        if (sunbeamAlpha >= 1 || sunbeamAlpha <0.01 ){
            sunbeamChange *= -1;
        }
        sunbeam.alpha = sunbeamAlpha;
        ray1.alpha = 1 - sunbeamAlpha;
        ray2.alpha = 1 - sunbeamAlpha;

        clouds.forEach(cloud=>{
            cloud.update(delta);
        })
    })
}

const sclouds = () => {
    bgSClouds();
    fSClouds();
}

const bgFClouds = async () => {
    let bgApp = new PIXI.Application();
    await bgApp.init(
        {background: '#69E2FF',
        resizeTo: window,
        transparent: true});
    document.getElementById('bg-container').appendChild(bgApp.canvas);
    let clouds = [];
    let nClouds = 1;
    for (let i = 0; i < nClouds; i++){
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * 0.4 -100;
        const cloudOptions = {
            minRadius: 40 ,
            maxRadius: 60 ,
            circleCount: 5 ,
            color: 0xfafafa,
            alpha: 0.7 ,
            spreadX: 300 + Math.random() * 100,
            spreadY: 150 + Math.random() * 60
        }
        const cloud = new Cloud( x, y, cloudOptions);
        bgApp.stage.addChild(cloud);
        clouds.push(cloud)
    }
    bgApp.ticker.add((delta) => {
        clouds.forEach((cloud) => {
            cloud.update();
        })
    })

}

const fFClouds = async () => {
    let fApp = new PIXI.Application();
    await fApp.init(
        {resizeTo: window,
        transparent: true,
        backgroundAlpha: 0,
        antialias: true});
    document.getElementById('front-container').appendChild(fApp.canvas);
    const width = window.innerWidth;
    const height = window.innerHeight;
    const sunbeam = new Sunbeam( {
        vertices: [ Math.floor(0.8*width), 0, 
                  Math.floor(0.95*width), 0, 
                  Math.floor(0.7*width) , height,
                  Math.floor(0.4*width), height ],
        color : 0xF4E99B,
        alpha : 0.6}
    );
    const ray1 = new Sunbeam( {
        vertices : [ Math.floor(0.78*width), 0, 
                   Math.floor(0.8*width), 0, 
                   Math.floor(0.37*width) , height,
                   Math.floor(0.32*width), height ],
        color: 0xFAEEBE,
        alpha: 0.6}
    );
    const ray2 = new Sunbeam( {
        vertices : [ Math.floor(0.95*width), 0, 
                     Math.floor(0.97*width), 0, 
                     Math.floor(0.77*width) , height,
                     Math.floor(0.73*width), height ],
        color : 0xFAEEBE,
        alpha: 0.6}
    );     
    fApp.stage.addChild(ray1);
    fApp.stage.addChild(ray2);
    fApp.stage.addChild(sunbeam);

    const texture = await PIXI.Assets.load('/images/plane1.png');
    const plane = new Plane(texture, {x: 100, y: 100}, 2, 0.15);
    fApp.stage.addChild(plane);

    let clouds = [];
    let nClouds = 2;
    for (let i = 0; i < nClouds; i++){
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * 0.4 -100;
        const cloudOptions = {
            minRadius: 40 ,
            maxRadius: 60 ,
            circleCount: 5 ,
            color: 0xfafafa,
            alpha: 0.7 ,
            spreadX: 300 + Math.random() * 100,
            spreadY: 150 + Math.random() * 60
        }
        const cloud = new Cloud( x, y, cloudOptions);
        fApp.stage.addChild(cloud);
        clouds.push(cloud)
    }

    fApp.ticker.add((delta)=>{
        plane.update();
        clouds.forEach((cloud) => {
            cloud.update();
        })
    });

}


const fclouds = () => {
    bgFClouds();
    fFClouds();
}



const bgMist = async () => {
    let bgApp = new PIXI.Application();
    await bgApp.init(
        {background: '#d2e6f0',
        resizeTo: window,
        transparent: true});
    document.getElementById('bg-container').appendChild(bgApp.canvas);
    let clouds = [];
    let nClouds = 2;
    for (let i = 0; i < nClouds; i++){
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const cloudOptions = {
            minRadius: 200 ,
            maxRadius: 400 ,
            circleCount: 5 ,
            color: 0xfafafa,
            alpha: 0.5 ,
            spreadX: 600 + Math.random() * 100,
            spreadY: 300 + Math.random() * 60
        }
        const cloud = new Cloud( x, y, cloudOptions);
        bgApp.stage.addChild(cloud);
        clouds.push(cloud)
    }
    bgApp.ticker.add((delta) => {
        clouds.forEach((cloud) => {
            cloud.update();
        })
    })

}

const fMist = async () => {
    let fApp = new PIXI.Application();
    await fApp.init(
        {resizeTo: window,
        transparent: true,
        backgroundAlpha: 0,
        antialias: true});
    document.getElementById('front-container').appendChild(fApp.canvas);
    const width = window.innerWidth;
    const height = window.innerHeight;
    let clouds = [];
    let nClouds = 2;
    for (let i = 0; i < nClouds; i++){
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const cloudOptions = {
            minRadius: 200 ,
            maxRadius: 400 ,
            circleCount: 5 ,
            color: 0xeaeaea,
            alpha: 0.3 ,
            spreadX: 600 + Math.random() * 100,
            spreadY: 300 + Math.random() * 60
        }
        const cloud = new Cloud( x, y, cloudOptions);
        fApp.stage.addChild(cloud);
        clouds.push(cloud)
    }

    fApp.ticker.add((delta)=>{
        clouds.forEach((cloud) => {
            cloud.update();
        })
    });

}

const mist = () => {
    bgMist();
    fMist();
}

export {thunder, rain, snow, clear, bclouds, sclouds, fclouds, srain, mist, wait};

