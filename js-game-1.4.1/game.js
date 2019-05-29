'use strict';
class Active{

}



class Level{
	
}


class Vector{
	constructor(x = 0, y = 0){
		this.x = x;
		this.y = y;
	}

	plus(vector){
		try{
			if (vector instanceof Vector) {
				return new Vector(vector.x + this.x, vector.y + this.y);
			} else{
				throw new Error("Можно прибавлять к вектору только вектор типа Vector");
			}
		} catch(err){
			return err;
		}
	}

	times(multiplier){
		return new Vector(this.x*multiplier, this.y*multiplier);
	}
}

class Actor{
	constructor(pos = new Vector(0,0), size = new Vector(pos.x + 1,pos.y + 1), speed = new Vector(0,0)){
    try{
			if (pos instanceof Vector || size instanceof Vector || speed instanceof Vector) {
				this.pos = pos;
				this.size = size;
				this.speed = speed;
		        Object.defineProperty (this, "left", {
		          get: function() {
		            return this.pos.x;
		          },
		          configurable: false
		        });

		        Object.defineProperty (this, "top", {
		          get: function() {
		            return this.pos.y;
		          },
		          configurable: false
		        });	

		        Object.defineProperty (this, "right", {
		          get: function() {
		            return this.size.x;
		          },
		          configurable: false
		        });	

		        Object.defineProperty (this, "bottom", {
		          get: function() {
		            return this.size.y;
		          },
		          configurable: false
		        });

		        Object.defineProperty (this, "type", {
		          get: function() {
		            return "actor";
		          },
		          configurable: false
		        });

			} else{
				throw new Error("Параметр должен быть объектом класса Vector");
			}
		} catch(err){
			return err;
		}
	}

	act(){}
	
	isIntersect(actor){
		try{
			if (actor instanceof Actor || actor != undefined) {
				if (actor == this || this.pos != actor.pos && this.size != actor.size) {
					return false;
				} else {
					return true;
				}
			} else{
				throw new Error("Можно прибавлять к вектору только вектор типа Vector");
			}
		} catch(err){
			return err;
		}
	}				
}