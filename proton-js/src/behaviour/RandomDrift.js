import Util from '../utils/Util';
import Vector2D from '../math/Vector2D';
import MathUtils from '../math/MathUtils';
import Behaviour from './Behaviour';

export default class RandomDrift extends Behaviour {

	/**
	 * @memberof! Proton#
	 * @augments Behaviour
	 * @constructor
	 * @alias RandomDrift
	 *
	 * @param {Number} driftX 				X value of the new Vector2D
	 * @param {Number} driftY  				Y value of the new Vector2D
	 * @param {Number} delay 				How much delay the drift should have
	 * @param {Number} [life=Infinity] 		this behaviour's life
	 * @param {String} [easing=easeLinear] 	this behaviour's easing
	 *
	 * @property {Number} time The time of the drift
	 * @property {String} name The Behaviour name
	 */
	constructor(driftX, driftY, delay, life, easing) {
		super(life, easing);

		this.reset(driftX, driftY, delay);
		this.time = 0;
		this.name = "RandomDrift";
	}

	/**
	 * Reset this behaviour's parameters
	 *
	 * @method reset
	 * @memberof Proton#RandomDrift
	 * @instance
	 *
	 * @param {Number} driftX 				X value of the new Vector2D
	 * @param {Number} driftY  				Y value of the new Vector2D
	 * @param {Number} delay 				How much delay the drift should have
	 * @param {Number} [life=Infinity] 		this behaviour's life
	 * @param {String} [easing=easeLinear] 	this behaviour's easing
	 */
	reset(driftX, driftY, delay, life, easing) {
		this.panFoce = new Vector2D(driftX, driftY);
		this.panFoce = this.normalizeForce(this.panFoce);
		this.delay = delay;

		life && super.reset(life, easing);
	}

	/**
	 * Apply this behaviour for all particles every time
	 *
	 * @method applyBehaviour
	 * @memberof Proton#RandomDrift
	 * @instance
	 *
	 * @param {Particle} particle
	 * @param {Number} 			time the integrate time 1/ms
	 * @param {Int} 			index the particle index
	 */
	applyBehaviour(particle, time, index) {
		this.calculate(particle, time, index);
		this.time += time;

		if (this.time >= this.delay) {
			particle.a.addXY(MathUtils.randomAToB(-this.panFoce.x, this.panFoce.x), MathUtils.randomAToB(-this.panFoce.y, this.panFoce.y));
			this.time = 0;
		};
	}
}
