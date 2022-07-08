const { minimumBet, maximumBet } = require("../config.json");
const dbFunctions = require("../database/dbFunctions.js");

module.exports = {
	/*
        Validates the user's bet
    */
	async validate_bet(bet, guildData, userData) {
		if (bet) {
			const balance = await dbFunctions.readBalance(guildData, userData);

			// User doesn't have enough funds
			if (bet > balance) {
				throw "Bet is greater than balance.";
			}
			// Exceeds bounds for min/max bet
			else if (bet < minimumBet || bet > maximumBet) {
				throw "The minimum/maximum bet is 50/500 respectively.";
			}
		}

		return 0;
	},
	/*
        Genereates a random number up to num
        Example: 2 -> numbers between 0 and 1
    */
	calculate_rng(num) {
		return Math.floor(Math.random() * num);
	},
	/*
        Determines if the user won
   */
	validate_win(guess, num) {
		let result = this.calculate_rng(num);

		if (guess === result) {
			return true;
		}

		return false;
	},
	/*
        Display results
    */
	async format_results(isWin, bet, guildData, userData) {
		let message = `
            > __**Results**__
            ${isWin ? `> You won!!! 🎉` : `> You lost... 😥`}`;

		// Bet Validation
		if (bet) {
			message += await this.calculate_payout(guildData, userData, isWin, bet);
		}

		return message;
	},
	/*
        Payout if win, otherwise deduct Morale
        Part of format_results to display bet results
   */
	async calculate_payout(guildData, userData, isWin, bet) {
		let amount = bet;

		const message = `\n> ${bet} Morale has been ${
			isWin ? `added to` : `deducted from`
		} your balance.`;

		if (!isWin) {
			amount = -bet;
		}

		await dbFunctions.updateBalance(guildData, userData, amount);

		return message;
	},
};
