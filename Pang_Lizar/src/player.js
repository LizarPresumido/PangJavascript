
var player = {
    src: "img/Spritesheet.png",
    image: null,
    pos: {x:0,y:0},
    velocity: 250,
    width: 31,
    height: 35,
    flip: false,
    invulnerability: false,
    iframes: 60,
    iframeCount: 0,
    moving: false,
    cycleLoop: [3,2,1,0],
    currentLoopIndex: 3,
    frameCount: 0,
    shooting: false,
    shootCooldown: 0.8,
    shootCDCount: 0,

    Start: function (){
        this.image = new Image();
        this.image.src = this.src;
        this.pos.x = canvas.width / 2 - this.width / 2;
        this.pos.y = canvas.height - this.height - 35;
    },
    Update: function(deltaTime){
        if(Input.IsKeyPressed(KEY_LEFT) && !this.shooting){
            this.pos.x -= this.velocity * deltaTime;
            this.flip = false;
            this.moving = true;
        }

        if(Input.IsKeyPressed(KEY_RIGHT) && !this.shooting){
            this.pos.x += this.velocity * deltaTime;
            this.flip = true;
            this.moving = true;
        }
        if(Input.IsKeyPressed(KEY_SPACE)){
            if(!this.shooting){
                this.shooting = true;
                this.currentLoopIndex = 4;
                this.Shoot();
            }
        }
        if(Input.IsKeyUp(KEY_LEFT) || Input.IsKeyUp(KEY_RIGHT)){
            this.moving = false;
            this.currentLoopIndex = 3;
            this.frameCount = 0;
        }
        if(this.invulnerability){
            this.iframeCount++;
            if(this.iframeCount > this.iframes){
                this.invulnerability = false;
                this.iframeCount = 0;
            }
        }

        if(this.shooting){
            this.shootCDCount += deltaTime;
            if(this.shootCDCount >= this.shootCooldown){
                this.shootCDCount = 0;
                this.shooting = false;
            }
        }


            if(this.pos.x < 0) //left cap
                this.pos.x = 0;
            else if((this.pos.x + this.width) > canvas.width - 30) //right cap
                this.pos.x = canvas.width - this.width - 30;

                this.Step();
    },
    Draw: function(ctx){
        if(this.shooting){
            ctx.drawImage(this.image, this.width * this.currentLoopIndex ,0,this.width,this.height,this.pos.x,this.pos.y,45,55);
        }
        else if(this.invulnerability){
            if(this.iframeCount % 2 != 0){
                if(this.flip)
                    this.FlipSpriteHorizontally(ctx);
                else
                    ctx.drawImage(this.image, this.width * this.currentLoopIndex ,0,this.width,this.height,this.pos.x,this.pos.y,45,55);
            }
        }else{
            if(this.flip)
                this.FlipSpriteHorizontally(ctx);
            else
                ctx.drawImage(this.image, this.width * this.currentLoopIndex ,0,this.width,this.height,this.pos.x,this.pos.y,45,55);
        }
    },
    FlipSpriteHorizontally: function(ctx){

        //se coloca el sprite para no despazarse con el giro
        ctx.translate(this.pos.x+this.width,this.pos.y);
      
        //se invierte
        ctx.scale(-1,1);
      
        //se pinta
        ctx.drawImage(this.image,
            this.width * this.currentLoopIndex ,0,this.width,this.height,0,0,45,55
                     );
      
        // se limpia el canvas para seguir pintando el resto
        ctx.setTransform(1,0,0,1,0,0);
      },
      Step: function() {
          //console.log(this.moving);
          if(this.moving){
            this.frameCount++;
            if(this.frameCount > 15){
                this.frameCount = 0;
                this.currentLoopIndex++;
            }
            
            if (this.currentLoopIndex >= this.cycleLoop.length) {
                this.currentLoopIndex = 0;
            }
        }else if(this.shooting){
            this.frameCount++;
            if(this.frameCount > 10){
                this.frameCount = 0;
                this.currentLoopIndex++;
            }
            
            if (this.currentLoopIndex >= 5) {
                this.shooting = false;
                this.currentLoopIndex = 3;
            }
        }
      },
      Shoot: function(){
            shoots[shoots.length + 1] = new Shoot({x:this.pos.x, y:this.pos.y}, 1, shoots.length + 1);
      }

}