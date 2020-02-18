import scoring from './scoring-functions.js';

function main(args = process.argv) {
    if (args.length !== 3) {
        return;
    }

    const dice = args[2].split('').map(n => parseInt(n));
    let display = ``;

    Object.keys(scoring).forEach(key => {
        display += `${key}: ${scoring[key](dice)}\n`;
    })

    console.log(display);
}

main();
