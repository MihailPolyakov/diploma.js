'use strict';
class Active{

}

class Vector{
	constructor(x = 0, y = 0){
		this.x = x;
		this.y = y;
	}

	plus(vector){
		if (vector instanceof Vector) {
			return new Vector(vector.x + this.x, vector.y + this.y);
		} else{
			throw new Error("Можно прибавлять к вектору только вектор типа Vector");
		}
	}

	times(multiplier){
		return new Vector(this.x*multiplier, this.y*multiplier);
	}
}

class Actor{
	constructor(pos = new Vector(0,0), size = new Vector(1, 1), speed = new Vector(0,0)){
		if (pos instanceof Vector && size instanceof Vector && speed instanceof Vector) {
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
	            return this.size.x + this.pos.x;
	          },
	          configurable: false
	        });	

	        Object.defineProperty (this, "bottom", {
	          get: function() {
	            return this.size.y + this.pos.y;
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
	}

	act(){}

	isIntersect(actor){
		if (actor instanceof Actor && actor != undefined) {
			if (actor == this || this.pos != actor.pos && this.size != actor.size) {
				return false;
			} else {
				return true;
			}
		} else{
			throw new Error("Можно прибавлять к вектору только вектор типа Vector");
		}
	}				
}

class Level{
	constructor(array = [], object = [new Actor()]){
		this.grid = array;
		this.actors = object;
		this.height = array.length;
		
		if (array.length == 0) {
			this.width = 0;
		} else {
			let countAllWidth = [];
			for (var i = 0; i < array.length; i++) {
				if (typeof(array[i]) == 'object') {
					countAllWidth.push(array[i].length);
				}
			}
			this.width = Math.max.apply(null, countAllWidth);
		}

		for (let value of this.actors) {
			if (value.type == 'player') {
				var player = value;
			}
		}
		this.player = player;
		this.status = null;
		this.finishDelay = 1;
	}

	isFinished(){
		if (this.status != undefined && this.finishDelay < 0) {
			return true;
		} else {
			return false;
		}
	}

	actorAt(actor){
		if (actor instanceof Actor) {
			for (let actorObject of this.actors){
				if (actorObject.pos.x == actor.pos.x && actorObject.pos.y == actor.pos.y) {
					return actorObject;
				}
			}
			return undefined;
		} else{
			throw new Error("Не является объектом класса Actor");
		}
	}

	obstacleAt(objectVector_1, objectVector_2){
		if (objectVector_1 instanceof Vector && objectVector_2 instanceof Vector) {
			if ( objectVector_1.y < 0 || objectVector_2.y < 0) {
				return 'lava';
			} else if(objectVector_1.x < 0 || objectVector_2.x < 0 || objectVector_1.x > this.width || objectVector_2.x > this.width || objectVector_1.y > this.height || objectVector_2.y > this.height){
				return 'wall';
			} else {

			}
		} else {
			throw new Error("Аргументы должны быть объектом класса Vector");
		}
	}

	removeActor(objectActor = null){
		if (objectActor != undefined) {
			delete this.actor[this.actor.indexOf(objectActor)];
		}
	}

	noMoreActors(typeObject){
		return function (typeObject){
			for (let value of this.actor){
				if (this.actor.type == typeObject) {
					return false;
				}
			}
			return true;
		}
	}

	playerTouched (type, objectActor = null){
		if (this.status == undefined) {
			if (type == 'lava' || type == 'fireball') {
				this.status = lost;
			} else if(type == 'coin' && objectActor.type == 'coin') {
				delete this.actors[this.actors.indexOf(objectActor)];
				let coin = 0;
				for (let value of this.actors){
					if (this.actors.type == 'coin') {
						coin = 'coin';
					}
				}
				if (!coin) {this.status = 'won'};
			}
		}
	}
}

const grid = [
  [undefined, undefined],
  ['wall', 'wall']
];

function MyCoin(title) {
  this.type = 'coin';
  this.title = title;
}
MyCoin.prototype = Object.create(Actor);
MyCoin.constructor = MyCoin;

const goldCoin = new MyCoin('Золото');
const bronzeCoin = new MyCoin('Бронза');
const player = new Actor();
const fireball = new Actor();

const level = new Level(grid, [ goldCoin, bronzeCoin, player, fireball ]);

level.playerTouched('coin', goldCoin);
level.playerTouched('coin', bronzeCoin);

if (level.noMoreActors('coin')) {
  console.log('Все монеты собраны');
  console.log(`Статус игры: ${level.status}`);
}

const obstacle = level.obstacleAt(new Vector(1, 1), player.size);
if (obstacle) {
  console.log(`На пути препятствие: ${obstacle}`);
}

const otherActor = level.actorAt(player);
if (otherActor === fireball) {
  console.log('Пользователь столкнулся с шаровой молнией');
}