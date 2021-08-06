const clone = require('clone');
const playConnectFour = require('../connectFour/playConnectFour');

class Battleship {
	constructor(player1, player2) {
		this.player1 = player1;
		this.player2 = player2;
		this.turn = Math.random() > 0.5 ? this.player1 : this.player2;
		// 0-nothing, 1-ship middle, 2-left edge, 3-right edge, 4-top edge, 5-bottom edge, 6-hit (board), 7-miss (enemymap), 8-hit (enemymap).
		this.board1 = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		];
		this.board2 = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		];
		this.enemyMap1 = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		];
		this.enemyMap2 = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		];
		this.shipLocations1 = [];
		this.shipLocations2 = [];
	}

	generate(board) {
		const testHorizontal = (board, n, row, col) => {
			let firstIndex = null;
			let counter = 0;
			for (let i = -(n - 1); i <= n - 1; i++) {
				if (board[row]) {
					if (board[row][col + i] === 0) {
						counter++;
						firstIndex = firstIndex ? firstIndex : col + i;
						if (counter === n) return [true, firstIndex];
					} else {
						counter = 0;
						firstIndex = null;
					}
				}
			}
			return [false, null];
		};

		const placeHorizontal = (board, row, firstIndex, n) => {
			for (let i = 0; i < n; i++) {
				if (i === 0) board[row][firstIndex + i] = 2;
				else if (i === n - 1) board[row][firstIndex + i] = 3;
				else board[row][firstIndex + i] = 1;
			}
		};

		const testVirtical = (board, n, row, col) => {
			let firstIndex = null;
			let counter = 0;
			for (let i = -(n - 1); i <= n - 1; i++) {
				if (board[row + i]) {
					if (board[row + i][col] === 0) {
						counter++;
						firstIndex = firstIndex ? firstIndex : row + i;
						if (counter === n) return [true, firstIndex];
					} else {
						counter = 0;
						firstIndex = null;
					}
				}
			}
			return [false, null];
		};

		const placeVirtical = (board, col, firstIndex, n) => {
			for (let i = 0; i < n; i++) {
				if (i === 0) board[firstIndex + i][col] = 4;
				else if (i === n - 1) board[firstIndex + i][col] = 5;
				else board[firstIndex + i][col] = 1;
			}
		};

		const placeShip = (board, n) => {
			const alignment = Math.random() < 0.5 ? 'horizontal' : 'vertical';
			if (alignment === 'horizontal') {
				let row = Math.floor(Math.random() * 10);
				let col = Math.floor(Math.random() * 10);
				while (!testHorizontal(board, n, row, col)[0]) {
					row = Math.floor(Math.random() * 10);
					col = Math.floor(Math.random() * 10);
				}
				const newCol = testHorizontal(board, n, row, col)[1];
				placeHorizontal(board, row, newCol, n);
				board === this.board1
					? this.shipLocations1.push(['horizontal', row, newCol, n])
					: this.shipLocations2.push(['horizontal', row, newCol, n]);
			}
			if (alignment === 'vertical') {
				let row = Math.floor(Math.random() * 10);
				let col = Math.floor(Math.random() * 10);
				while (!testVirtical(board, n, row, col)[0]) {
					row = Math.floor(Math.random() * 10);
					col = Math.floor(Math.random() * 10);
				}
				const newRow = testVirtical(board, n, row, col)[1];
				placeVirtical(board, col, newRow, n);
				board === this.board1
					? this.shipLocations1.push(['vertical', newRow, col, n])
					: this.shipLocations2.push(['vertical', newRow, col, n]);
			}
		};

		placeShip(this.board1, 5);
		placeShip(this.board1, 4);
		placeShip(this.board1, 3);
		placeShip(this.board1, 3);
		placeShip(this.board1, 2);

		placeShip(this.board2, 5);
		placeShip(this.board2, 4);
		placeShip(this.board2, 3);
		placeShip(this.board2, 3);
		placeShip(this.board2, 2);

		return;
	}

	toString(board) {
		let boardDisplay = clone(board);
		for (let i = 0; i < boardDisplay.length; i++) {
			if (i === 0) boardDisplay[i].unshift('🔟');
			else if (i === 1) boardDisplay[i].unshift('9️⃣');
			else if (i === 2) boardDisplay[i].unshift('8️⃣');
			else if (i === 3) boardDisplay[i].unshift('7️⃣');
			else if (i === 4) boardDisplay[i].unshift('6️⃣');
			else if (i === 5) boardDisplay[i].unshift('5️⃣');
			else if (i === 6) boardDisplay[i].unshift('4️⃣');
			else if (i === 7) boardDisplay[i].unshift('3️⃣');
			else if (i === 8) boardDisplay[i].unshift('2️⃣');
			else if (i === 9) boardDisplay[i].unshift('1️⃣');
		}

		boardDisplay = boardDisplay.map(row => {
			return row
				.map(col => {
					if (col === 0) return '⬛';
					else if (col === 1) return '⏹️';
					else if (col === 2) return '◀️';
					else if (col === 3) return '▶️';
					else if (col === 4) return '🔼';
					else if (col === 5) return '🔽';
					else if (col === 6) return '❌';
					else if (col === 7) return '⭕';
					else if (col === 8) return '✔️';
					else {
						return col;
					}
				})
				.join('');
		});

		boardDisplay.push('#️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣🔟');
		boardDisplay = boardDisplay.join('\n');

		return `\`\`\`${boardDisplay}\`\`\``;
	}

	shoot(row, col) {
		let board = this.turn === this.player1 ? this.board2 : this.board1;
		let enemyMap = this.turn === this.player1 ? this.enemyMap1 : this.enemyMap2;

		const sunk = () => {
			const shipLocations = this.turn === this.player1 ? this.shipLocations2 : this.shipLocations1;

			for (let i = 0; i < shipLocations.length; i++) {
				if (shipLocations[i][0] === 'horizontal') {
					let counter = 0;
					for (let j = 0; j < shipLocations[i][3]; j++) {
						if (board[shipLocations[i][1]][shipLocations[i][2] + j] === 6) counter++;
					}
					if (counter === shipLocations[i][3]) {
						shipLocations.splice(i, 1);
						return true;
					}
				}
				if (shipLocations[i][0] === 'vertical') {
					let counter = 0;
					for (let j = 0; j < shipLocations[i][3]; j++) {
						if (board[shipLocations[i][1] + j][shipLocations[i][2]] === 6) counter++;
					}
					if (counter === shipLocations[i][3]) {
						shipLocations.splice(i, 1);
						return true;
					}
				}
			}

			return false;
		};

		if (enemyMap[row][col] === 7 || enemyMap[row][col] === 8) {
			return [false, "You've already shot at that spot."];
		} else if (board[row][col] >= 1 && board[row][col] <= 5) {
			this.turn === this.player1 ? (this.enemyMap1[row][col] = 8) : (this.enemyMap2[row][col] = 8);
			this.turn === this.player1 ? (this.board2[row][col] = 6) : (this.board1[row][col] = 6);
			this.turn === this.player1 ? this.score1++ : this.score2++;
			const didSink = sunk();
			this.turn === this.player1 ? (this.turn = this.player2) : (this.turn = this.player1);
			if (didSink) {
				return [true, 'sunk!'];
			} else {
				return [true, 'Hit!'];
			}
		} else if (board[row][col] === 0) {
			this.turn === this.player1 ? (this.enemyMap1[row][col] = 7) : (this.enemyMap2[row][col] = 7);
			this.turn === this.player1 ? (this.turn = this.player2) : (this.turn = this.player1);
			return [true, 'miss!'];
		}
	}

	ended() {
		if (this.shipLocations1.length === 0) return this.player2;
		if (this.shipLocations2.length === 0) return this.player1;
		return false;
	}
}

module.exports = Battleship;
