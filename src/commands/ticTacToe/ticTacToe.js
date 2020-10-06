class TicTacToe {
	constructor(player1, player2) {
		this.player1 = player1;
		this.player2 = player2;
		this.turn = player1;
		this.state = [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
		];
		this.lastMove;
	}

	play(position, player) {
		if (this.state[position[0]][position[1]] === 0) {
			this.state[position[0]][position[1]] = player === this.player1.id ? 1 : 2;
			this.lastMove = [position[0], position[1], this.state[position[0]][position[1]], this.turn];
			this.turn = player === this.player1.id ? this.player2 : this.player1;
			return true;
		}

		return false;
	}

	ended() {
		let [row, col, num] = this.lastMove;
		let counter = 0;

		this.state.forEach(row => {
			row.forEach(col => {
				if (col === 0) counter++;
			});
			if (count === 9) return 'tie';
		});
		counter = 0;

		for (let i = -2; i <= 2; i++) {
			this.state[row][col + i] === num ? counter++ : (counter = 0);
			if (counter === 3) return true;
		}
		counter = 0;

		for (let i = -2; i <= 2; i++) {
			if (this.state[row + i]) {
				this.state[row + i][col] === num ? counter++ : (counter = 0);
				if (counter === 3) return true;
			} else {
				counter = 0;
			}
		}
		counter = 0;

		for (let i = -2; i <= 2; i++) {
			if (this.state[row + i]) {
				this.state[row + i][col + i] === num ? counter++ : (counter = 0);
				if (counter === 3) return true;
			} else {
				counter = 0;
			}
		}
		counter = 0;

		for (let i = -2; i <= 2; i++) {
			if (this.state[row + i]) {
				this.state[row + i][col - i] === num ? counter++ : (counter = 0);
				if (counter === 3) return true;
			} else {
				counter = 0;
			}
		}
		counter = 0;

		return false;
	}

	toString() {
		let table = this.state
			.map(row => {
				return row
					.map(col => {
						if (col === 0) return '⬛';
						if (col === 1) return '✖️';
						if (col === 2) return '⭕';
					})
					.join('');
			})
			.join('\n');

		return `\`\`\`${table}\`\`\``;
	}
}

module.exports = TicTacToe;
