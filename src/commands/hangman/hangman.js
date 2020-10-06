class Hangman {
	constructor(phrase) {
		this.phrase = phrase;
		this.mistakeCounter = 0;
		this.guesses = [];
		this.phraseDisplay = [...phrase].map(char => (char === ' ' ? ' ' : null));
	}

	validate(guess) {
		if (!/^[a-z ]+$/.test(guess)) {
			return { valid: false, message: 'Guess should be lowercase letters only' };
		}

		if (this.guesses.indexOf(guess) !== -1 || this.phraseDisplay.indexOf(guess) !== -1) {
			return { valid: false, message: 'You have already guessed that letter' };
		}

		return { valid: true };
	}

	guess(guess) {
		if (guess.length === 1) {
			if (this.phrase.indexOf(guess) !== -1) {
				Array.prototype.forEach.call(
					this.phrase,
					(char, i) => char === guess && (this.phraseDisplay[i] = guess)
				);
			} else {
				this.guesses.push(guess);
				this.mistakeCounter++;
			}
		} else {
			if (this.phrase === guess) {
				Array.prototype.forEach.call(guess, (char, i) => (this.phraseDisplay[i] = char));
			} else {
				this.guesses.push(guess);
				this.mistakeCounter = 6;
			}
		}
	}

	status() {
		if (this.mistakeCounter === 6) return { ended: true, won: false };
		if (this.phraseDisplay.indexOf(null) === -1) return { ended: true, won: true };
		return { ended: false, won: null };
	}

	toString() {
		let head = this.mistakeCounter > 0 ? 'O' : ' ';
		let body = this.mistakeCounter > 1 ? '|' : ' ';
		let rArm = this.mistakeCounter > 2 ? '/' : ' ';
		let lArm = this.mistakeCounter > 3 ? '\\' : ' ';
		let rLeg = this.mistakeCounter > 4 ? '/' : ' ';
		let lLeg = this.mistakeCounter > 5 ? '\\' : ' ';

		let hangmanImage = `
         ___ 
        |   | 
        ${head}   | 
       ${rArm}${body}${lArm}  | 
       ${rLeg} ${lLeg}  | 
            |  
          __|__ `;

		let wordsAndGuesses = `Guesses: ${this.guesses.join(', ')}\nPhrase: ${this.phraseDisplay
			.map(char => (char ? char : '_'))
			.join(' ')}`;

		return `\`\`\`${hangmanImage}\`\`\`\`\`\`${wordsAndGuesses}\`\`\``;
	}
}

module.exports = Hangman;
