class Shoot{
    constructor(position, type, index){
        this.position = position;
        this.type = type;
        this.incrementRatio = 10000;
        this.increment = 0;
        this.index = index;
        this.height = 40;
        this.width = 15;
        this.image = new Image();
        this.image.src = "img/shoot.png";
        this.currentLoopIndex = 0;
        this.frameCount = 0;
    }

    Update(deltaTime){
        this.position.y -= this.increment * deltaTime;
        this.height += this.increment * deltaTime;
        this.increment = this.incrementRatio * deltaTime;
        //this.Step();
        if(this.position.y <= 70)
            this.Destroy();
    }

    Draw(ctx){
        //hacer resize con las imagenes para los disparos hacia cosas muy raras, asi que he preferido deja el disparo prefab
        //console.log(this.currentLoopIndex);
        //ctx.drawImage(this.image, this.width * this.currentLoopIndex, 0,this.width,480,this.position.x,this.position.y + 20,20 ,480);
        ctx.fillStyle = "grey";
        ctx.fillRect(this.position.x, this.position.y + 10, this.width, this.height);
    }

    Destroy(){
        shoots[this.index] = null;
    }

    Step() {
          this.frameCount++;
          if(this.frameCount > 10){
              this.frameCount = 0;
              this.currentLoopIndex++;
          }
          
          if (this.currentLoopIndex >= 5) {
              this.currentLoopIndex = 0;
          }
    }
}