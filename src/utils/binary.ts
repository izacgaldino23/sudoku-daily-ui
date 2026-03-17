export class Binary {
	val: number;

	constructor(val: number) {
		this.val = 1 <<val;
	}

	add(other: number) {
		this.val = this.val | (1 << other);
	}

	contains(other: number) {
		return (this.val & (1 << other)) !== 0;
	}
}
