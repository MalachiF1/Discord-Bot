class ConnectFour {
	constructor(player1, player2) {
		this.player1 = player1;
		this.player2 = player2;
		this.turn = Math.random() > 0.5 ? this.player1 : this.player2;
		this.state = [
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
		];
		this.lastMove;
	}

	drop(col) {
		let changed = false;
		for (let i = this.state.length - 1; i >= 0; i--) {
			const currentRow = this.state[i];
			if (currentRow[col] === 0) {
				if (this.turn.id === this.player1.id) currentRow[col] = 1;
				if (this.turn.id === this.player2.id) currentRow[col] = 2;
				changed = true;
				this.lastMove = [i, col, currentRow[col], this.turn];
				this.turn = this.turn.id === this.player1.id ? this.player2 : this.player1;
				break;
			}
		}

		return changed;
	}

	ended() {
		let [row, col, num] = this.lastMove;
		let counter = 0;

		if (this.state.every(row => row.indexOf(0) === -1)) return 'tie';

		for (let i = -3; i <= 3; i++) {
			if (this.state[row][col + i] === num) {
				counter++;
				if (counter === 4) return true;
			} else {
				counter = 0;
			}
		}
		counter = 0;

		for (let i = -3; i <= 3; i++) {
			if (this.state[row + i]) {
				if (this.state[row + i][col] === num) {
					counter++;
					if (counter === 4) return true;
				} else {
					counter = 0;
				}
			}
		}
		counter = 0;

		for (let i = -3; i <= 3; i++) {
			if (this.state[row - i]) {
				if (this.state[row - i][col + i] === num) {
					counter++;
					if (counter === 4) return true;
				} else {
					counter = 0;
				}
			}
		}
		counter = 0;

		for (let i = -3; i <= 3; i++) {
			if (this.state[row - i]) {
				if (this.state[row - i][col - i] === num) {
					counter++;
					if (counter === 4) return true;
				} else {
					counter = 0;
				}
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
						if (col === 1) return '🟥';
						if (col === 2) return '🟦';
					})
					.join('');
			})
			.join('\n');
		return `\`\`\`${table}\`\`\`\`\`\`1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣\`\`\``;
	}
}

module.exports = ConnectFour;
