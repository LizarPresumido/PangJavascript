
class Ball{
    
    constructor(position, type, index, direction = 1){
        this.index = index;
        this.type = type;
        this.radius = 50 / type;
        this.position = position;
        this.position.y -= this.radius;
        this.direction = direction;
        this.velocity = 100 ;
        this.impulse = 300 ;
        this.nowImpulse = 0;
    }

    Start(){

    }

    Update(deltatime){
        this.position.x = this.position.x + this.velocity * deltatime * this.direction;
        this.position.y = this.position.y - this.nowImpulse * deltatime - (-9.8 * deltatime * deltatime) / 2;
        this.nowImpulse = this.nowImpulse -  100 * deltatime;
        if(this.position.y + this.radius >= canvas.height - 10){
            this.nowImpulse = this.impulse;
            this.position.y = canvas.height - 27 - this.radius
        }else if(this.position.y - this.radius <= 90){
            this.nowImpulse *= -1;
            this.position.y =  this.radius + 90;
        }
        if(this.position.x + this.radius >= canvas.width - 15){
            this.direction *= -1;
            this.position.x = canvas.width - this.radius - 15;
        } else if(this.position.x - this.radius <= 17){
            this.direction *= -1;
            this.position.x = this.radius + 17;
        }
    }

    Draw(ctx){
        //console.log(this.type);
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(this.position.x,this.position.y,this.radius,0,PI2,false);
        ctx.closePath();
        ctx.fill();
    }

    Split(){
        puntuacion += 500 * this.type;
        balls[balls.length + 1] = new Ball({x:this.position.x,y:this.position.y}, this.type + 1, balls.length + 1, 1);
        balls[balls.length + 1] = new Ball({x:this.position.x,y:this.position.y}, this.type + 1, balls.length + 1, -1);
        ballNumber++;
        balls[this.index] = null;
    }

    Destroy(){
        puntuacion += 500 * this.type;
        balls[this.index] = null;
        ballNumber--;
    }
    Collision(){
        if((player.pos.x >= this.position.x - this.radius) && (player.pos.x <= this.position.x + this.radius) && (player.pos.y - player.height <= this.position.y + this.radius) && !player.invulnerability){
            player.invulnerability = true;

            Hit();
            if(vidas == 0){
               Deactivate(1);
            }
        }
        shoots.forEach(shoot => {
            if(shoot != null){
                if(this.position.y + this.radius >= shoot.position.y && (this.position.x + this.radius >= shoot.position.x && this.position.x +this.radius <= shoot.position.x + shoot.width)){
                    shoot.Destroy();
                    if(this.type < 3)
                        this.Split();
                    else
                        this.Destroy();
                }
            }
        });
    }
}