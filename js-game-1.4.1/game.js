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
	constructor(pos = new Vector(), size = new Vector(1, 1), speed = new Vector()){
		if (pos instanceof Vector && size instanceof Vector && speed instanceof Vector) {
			this.pos = pos;
			this.size = size;
			this.speed = speed;
		} else{
			throw new Error("Параметр должен быть объектом класса Vector");
		}
	}
  get left(){
    return this.pos.x;
  }

  get top(){
    return this.pos.y;
  }

  get right(){
    return this.size.x + this.pos.x;
  }

  get bottom() {
    return this.size.y + this.pos.y;
  }

  get type(){
    return "actor";
  }

	act(){}
	isIntersect(otherActor) {
		if (!(otherActor instanceof Actor)) {
			throw new Error('Ошибка: Должен быть передан объект типа Actor.');
		}
		if (otherActor === this) {
			return false;
		}
		return this.right > otherActor.left && this.left < otherActor.right && this.top < otherActor.bottom && this.bottom > otherActor.top
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
		this.status = null;
		this.finishDelay = 1;
	}
	get player(){
		for (var i = 0; i < this.actors.length; i++) {
			if (this.actors[i].type == 'player') {
				return this.actors[i];
			}
		}
    }

	isFinished(){
		if (this.status != undefined && this.finishDelay < 0) {
			return true;
		} else {
			return false;
		}
	}
  
	actorAt(actor){    
		if (actor instanceof Actor || typeof(actor) != 'undefined' && this.actors.indexOf(actor) != -1) {
			for (var actorObject of this.actors){
		        if(actorObject.type == 'coin'){
		          continue;
		        }
		        
				if (this.actors.length > 1 && actorObject.pos.x == actor.pos.x && actorObject.pos.y == actor.pos.y) {
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
			} else if(objectVector_1.x < 0 || objectVector_2.x < 0 || objectVector_1.x > this.width || objectVector_2.x > this.width || objectVector_1.y > this.height && objectVector_2.y > this.height){
				return 'wall';
			} else {
        return this.grid[objectVector_1.x][objectVector_1.y];
			}
		} else {
			throw new Error("Аргументы должны быть объектом класса Vector");
		}
	}

	removeActor(objectActor = null){
		if (objectActor != undefined) {
			this.actors.splice(this.actors.indexOf(objectActor), 1);
		}
	}

	noMoreActors(typeObject){
			for (let value of this.actors){
				if (value.type == typeObject) {
					return false;
				}
			}
			return true;
	}

	playerTouched (type, objectActor = null){
		if (this.status == undefined) {
			if (type == 'lava' || type == 'fireball') {
				this.status = 'lost';
			} else if(type == 'coin') {
				this.actors.splice(this.actors.indexOf(objectActor),1);
				let coin = 0;
				for (let value of this.actors){
					if (value.type == 'coin') {
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
