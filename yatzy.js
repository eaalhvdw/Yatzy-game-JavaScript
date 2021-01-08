"use strict"

/**
 * Yatzy object
 * 1 <= values[i] <= 6 for i in [0..5]
 */
function YatzyDice() {

    /**
     * Face values of the 5 dice.
     */
    this.values = new Array(5);

    /**
     * Number of times the 5 dice have been thrown.
     * 0 <= throwCount <= 3.
     */
    this.faceCount = 6;
    this.throwCount = 0;

    /**
     * Returns the 5 face values of the dice.
     */
    this.getValues = function () {
        return this.values;
    };

    /**
     * Sets the 5 face values of the dice.
     * Pre: 1 <= values[i] <= 6 for i in [0..5].
     * Note: This method is only meant to be used in tests.
     */
    this.setValues = function (values) {
        this.values = values;
    };

    /**
     * Returns the number of times the 5 dice has been thrown.
     */
    this.getThrowCount = function () {
        return this.throwCount;
    };

    /**
     * Resets the throw count.
     */
    this.resetThrowcount = function () {
        this.throwCount = 0;
    };

    /**
     * Rolls the 5 dice. Only rolls dice that are not hold.
     * Note: holds[i] is true, if die no. i is hold.
     */
    this.throwDice = function (holds) {
        for (let i = 0; i < 5; i++) {
            if (holds[i] === false) {
                this.values[i] = Math.floor(Math.random() * this.faceCount) + 1
            }
        }
        this.throwCount++;
    };

    /**
     * Returns all results possible with the current face values.
     * The order of the results is the same as on the score board.
     * Note: This is an optional method. Comment this method out,
     * if you don't want use it.
     */
    this.getResults = function () {
        let results = [15];
        for (let i = 0; i <= 5; i++) {
            results[i] = this.sameValuePoints(i + 1);
        }
        results[6] = this.onePairPoints();
        results[7] = this.twoPairPoints();
        results[8] = this.threeSamePoints();
        results[9] = this.fourSamePoints();
        results[10] = this.fullHousePoints();
        results[11] = this.smallStraightPoints();
        results[12] = this.largeStraightPoints();
        results[13] = this.chancePoints();
        results[14] = this.yatzyPoints();

        return results;
    };

    /**
     * Returns an int[7] containing the frequency of face values.
     * Frequency at index v is the number of dice with the face value v, 1 <= v <= 6.
     * Index 0 is not used.
     * Note: This method can be used in several of the following methods.
     */
    this.frequency = function () {

        let frequency = new Array(7);
        for (let i = 0; i < frequency.length; i++) frequency[i] = 0;

        for (let v of this.values) {
            frequency[v]++;
        }
        return frequency;
    };

    /**
     * Returns same-value points for the given face value.
     * Returns 0, if no dice has the given face value.
     * Pre: 1 <= value <= 6;
     */
    this.sameValuePoints = function (value) {
        let f = this.frequency();

        let valuePoints = f[value] * value;

        return valuePoints;
    };

    /**
     * Returns points for one pair (for the face value giving highest points).
     * Returns 0, if there aren't 2 dice with the same face value.
     */
    this.onePairPoints = function () {
        let f = this.frequency();
        let max = 0;

        for (let i = 0; i < f.length; i++)
            if (f[i] >= 2) {
                max = i * 2;
            }
        return max;
    };

    /**
     * Returns points for two pairs
     * (for the 2 face values giving highest points).
     * Returns 0, if there aren't 2 dice with the same face value
     * and 2 other dice with the same but different face value.
     */
    this.twoPairPoints = function () {
        let f = this.frequency();
        let max1 = 0;
        let max2 = 0;
        let sum = 0;

        for (let i = 0; i < f.length; i++)
            if (f[i] >= 2) {
                max1 = 2 * i;
            }

        for (let i = 0; i < f.length; i++)
            if (f[i] >= 2 && 2 * i !== max1) {
                max2 = 2 * i;
            }
        if (max1 >= 2 && max2 >= 2) {
            sum = max1 + max2;
        }
        return sum;
    };

    /**
     * Returns points for 3 of a kind.
     * Returns 0, if there aren't 3 dice with the same face value.
     */
    this.threeSamePoints = function () {
        let f = this.frequency();
        let valuePoints = 0;

        for (let i = 0; i < f.length; i++) {
            if (f[i] >= 3) {
                valuePoints = 3 * i;
            }
        }
        return valuePoints;
    };

    /**
     * Returns points for 4 of a kind.
     * Returns 0, if there aren't 4 dice with the same face value.
     */
    this.fourSamePoints = function () {
        let f = this.frequency();
        let valuePoints = 0;

        for (let i = 0; i < f.length; i++) {
            if (f[i] >= 4) {
                valuePoints = 4 * i;
            }
        }
        return valuePoints;
    };

    /**
     * Returns points for full house.
     * Returns 0, if there aren't 3 dice with the same face value.
     * and 2 other dice with the same but different face value.
     */
    this.fullHousePoints = function () {
        let threeSame = 0;
        let pair = 0;
        const freqArray = this.frequency();

        for (let i = 6; i > 0; i--) {
            if (freqArray[i] >= 3 && threeSame === 0) {
                threeSame = 3 * i;
            } else if (freqArray[i] >= 2 && pair === 0) {
                pair = 2 * i;
            }
        }
        if (threeSame !== 0 && pair !== 0) {
            return pair + threeSame;
        }
        return 0;
    };


    /**
     * Returns points for small straight.
     * Returns 0, if the dice are not showing 1,2,3,4,5.
     */
    this.smallStraightPoints = function () {
        let f = this.frequency();
        let sum = 0;

        if (f[1] === 1 && f[2] === 1 && f[3] === 1 && f[4] === 1 && f[5] === 1) {
            sum = 15;
        }
        return sum;
    };

    /**
     * Returns points for large straight.
     * Returns 0, if the dice are not showing 2,3,4,5,6.
     */
    this.largeStraightPoints = function () {
        let f = this.frequency();
        let sum = 0;

        if (f[2] === 1 && f[3] === 1 && f[4] === 1 && f[5] === 1 && f[6] === 1 ) {
            sum = 20;
        }
        return sum;
    };

    /**
     * Returns points for chance (the sum of face values).
     */
    this.chancePoints = function () {
        let f = this.frequency();
        let sum = 0;
        for (let i = 1; i < f.length; i++) {
            sum += i * f[i];
        }
        return sum;
    };

    /**
     * Returns points for yatzy (50 points).
     * Returns 0, if there aren't 5 dice with the same face value.
     */
    this.yatzyPoints = function () {
        let f = this.frequency();
        let valuePoints = 0;

        for (let i = 0; i < f.length; i++)
            if (f[i] >= 5) {
                valuePoints = 50;
            }
        return valuePoints;
    };
}

/**
 * Service object
 */
function Service() {
    const yatzyDice = new YatzyDice();
    const gui = new GUI(yatzyDice);
}

/**
 * Gui object
 */
function GUI(yatzyDice) {
    /**
     * TODO: Kommentar
     */
    this.updateThrowLabel = function () {
        const throws = 3 - yatzyDice.getThrowCount();
        document.getElementById("throwCount").innerText = throws + " throw" + (throws === 1 ? "" : "s") + " left";
    };

    /**
     * TODO: Kommentar
     */
    this.disableHolds = function () {
        for (let hold of diceHolds) {
            hold.disabled = true;
            hold.checked = false;
        }
    };

    /**
     * TODO: Kommentar
     */
    this.resultClick = (event) => {
        if (yatzyDice.getThrowCount() > 0) {
            event.target.disabled = true;
            event.target.style.border = "3px solid blue";
            yatzyDice.resetThrowcount();
            this.updateThrowLabel();
            this.disableHolds();
            rollButton.disabled = false;
            resultsClicked++;
            if (resultsClicked === 15) {

                rollButton.disabled = true;

                const resetDiv = document.getElementById("resetDiv");
                const button = document.createElement("button");
                button.type = "button";
                button.innerHTML = "Reset";
                button.onclick = this.resetGame;

                resetDiv.appendChild(button);
            }
        }
        this.handleResults();
    };

    /**
     * TODO: Kommentar
     */
    this.handleResults = function () {
        const results = yatzyDice.getResults();
        let sum = 0;
        let total = 0;
        let bonus = 0;

        for (let i = 0; i < results.length; i++) {
            if (resultFields[i].disabled) {
                if (i < 6) sum += parseInt(resultFields[i].value);
                total += parseInt(resultFields[i].value);
            } else resultFields[i].value = results[i];
        }
        if (sum >= 63) bonus = 50;
        total += bonus;
        sumFields[0].value = sum;
        sumFields[1].value = bonus;
        sumFields[2].value = total;
    };

    /**
     * TODO: Kommentar
     */
    this.roll = () => {
        const holdArray = new Array(5);
        for (let i = 0; i < 5; i++) {
            holdArray[i] = diceHolds[i]['checked'];
            diceHolds[i].disabled = false;
        }
        yatzyDice.throwDice(holdArray);
        const values = yatzyDice.getValues();
        for (let i = 0; i < values.length; i++) {
            diceImgs[i].src = "imgdices/dice" + values[i] + ".png";
        }
        this.handleResults();
        this.updateThrowLabel();
        if (yatzyDice.getThrowCount() === 3) rollButton.disabled = true;
    };

    /**
     * TODO: Kommentar
     */
    this.resetGame = () => {
        for (let resultField of resultFields) {
            resultField.disabled = false;
            resultField.style.border = null;
        }
        yatzyDice.setValues(new Array(5));
        this.handleResults();
        const resetDiv = document.getElementById("resetDiv");
        resetDiv.removeChild(resetDiv.querySelector('button'));
        rollButton.disabled = false;
        resultsClicked = 0;
    };

    /**
     * TODO: Kommentar
     */
    const diceGrid = document.querySelector("#play");
    const diceImgs = diceGrid.querySelectorAll("img");
    const diceHolds = diceGrid.querySelectorAll("input");

    const scoreGrid = document.querySelector("#points");
    const sumFields = [];
    const resultFields = [];

    let resultsClicked = 0;

    this.disableHolds();

    for (let i = 0, inputs = scoreGrid.querySelectorAll("input"); i < inputs.length; i++) {
        inputs[i].addEventListener("click", this.resultClick);
        if (i === 6 || i === 7 || i === 17) sumFields.push(inputs[i]);
        else resultFields.push(inputs[i]);
    }

    const rollButton = document.querySelector("button");
    rollButton.addEventListener("click", this.roll);
    this.updateThrowLabel();
    this.handleResults(); // Sets values to initial value 0
}
new Service();