const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

const fieldState = {};

class Field {

    // constructor
    constructor(field) {
        this.field = field;
        this.currentX = 0;
        this.currentY = 0;
    }


    // generate field
    static generateField(fieldWidth, fieldHeight, percentHoles=0.10) {
        let fieldGrid = [];
        let holeCoordinates = [];
        for (let i=0; i<fieldHeight; i++) {
            let row = [];
            for (let j=0; j<fieldWidth; j++) {
                const obj = Math.floor(Math.random() * fieldWidth * fieldHeight);
                if (i === 0 && j === 0) {
                    row.push(pathCharacter);
                }
                else if (i === fieldHeight-1 && j === fieldWidth-1){
                    row.push(hat);
                }
                else {
                    if (obj < percentHoles * fieldWidth * fieldHeight) {
                        row.push(hole);
                        holeCoordinates.push(`(${j},${i})`);
                    }
                    else {
                        row.push(fieldCharacter);
                    }
                }
            }
            fieldGrid.push(row);
        }

        // initialize fieldState object
        fieldState.holeLocations = holeCoordinates;
        fieldState.hatLocation = `(${fieldWidth-1},${fieldHeight-1})`;
        fieldState.height = fieldHeight;
        fieldState.width = fieldWidth;
        fieldState.isGameOver = false;

        return fieldGrid;
    }


    // print field as string
    print() {
        this.field.forEach(row => console.log(row.join('')));
    }

    // asks for direction, returns updated location
    getLocation() {
        // prompt for direction to go
        const direction = prompt("Which way? (r, l, d, u) ");

        if (direction === 'r') {
            this.currentX += 1;
        }
        else if (direction === 'l') {
            this.currentX -= 1;
        }
        else if (direction === 'd') {
            this.currentY += 1;
        }
        else if (direction === 'u') {
            this.currentY -= 1;
        }
        else {
            // prompt("Invalid entry. Which way?");
            console.log("Invalid entry. Try again.");
        }
        return `(${this.currentX},${this.currentY})`;
    }

    // end game conditions
    playGame(currentLocation) {
        // win: find hat
        if (currentLocation === fieldState.hatLocation) {
            console.log("Congratulations! You won the game.");
            fieldState.isGameOver = true;
        }
        // lose: outside field
        else if (this.currentX < 0 || this.currentX > fieldState.width-1 || this.currentY < 0 || this.currentY > fieldState.height-1) {
            console.log("You went out of bounds. Game Over.");
            fieldState.isGameOver = true;
        }
        // lose: land in a hole
        else if (fieldState.holeLocations.includes(currentLocation)) {
            console.log("You fell into a hole. Game Over.");
            fieldState.isGameOver = true;
        }
        else {
            this.field[this.currentY][this.currentX] = pathCharacter;
            this.print();
        }
    }

    // game loop
    loop() {
        this.print();
        while (fieldState.isGameOver === false) {
            this.playGame(this.getLocation());
        }
        console.log("Thanks for playing!");
    }
}

function main() {
    console.log("Welcome. In this game, you will find a path to retrieve your hat (^) while avoiding falling into holes (O)!\n");

    const width = prompt("How wide do you want your playing field to be? ");
    const height = prompt("How tall do you want your playing field to be? ");
    const percentHoles = prompt("What percentage of the playing field do you want to be holes? (Please enter a decimal value). ");

    const field1 = Field.generateField(width, height, percentHoles);
    const myField = new Field(field1);

    myField.loop();
}

main();