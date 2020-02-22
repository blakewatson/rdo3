import axios from 'axios';

let isFetching = false;

function fillRandomNumers() {
    if (isFetching) {
        return;
    }

    isFetching = true;
    
    axios({
        method: 'post',
        url: 'https://api.random.org/json-rpc/2/invoke',
        data: JSON.stringify({
            'jsonrpc': '2.0',
            'method': 'generateIntegers',
            'params': {
                'apiKey': '1fe05506-8de5-43ec-a826-26857af2f994',
                'n': 50,
                'min': 1,
                'max': 6,
                'replacement': true,
                'base': 10
            },
            'id': 1
        }),
        headers: {'Content-Type': 'application/json'},
        responseType: 'json'
    }).then(response => {
        console.log(response);
        let numbers = [];
        const newNumbers = response.data.result.random.data;
        const numberStorage = localStorage.getItem('rdo3-numbers');

        if (numberStorage) {
            numbers = JSON.parse(numberStorage);
        }

        numbers = numbers.concat(newNumbers);

        localStorage.setItem('rdo3-numbers', JSON.stringify(numbers));
        isFetching = false;
    });
}

export default function rand() {
    const numberStorage = localStorage.getItem('rdo3-numbers');

    if (!numberStorage) {
        fillRandomNumers();
        return Math.floor(Math.random() * 6) + 1;
    }

    const numbers = JSON.parse(numberStorage);

    if (numbers.length === 0) {
        fillRandomNumers();
        return Math.floor(Math.random() * 6) + 1;
    }

    const num = numbers.shift();
    localStorage.setItem('rdo3-numbers', JSON.stringify(numbers));
    
    if (numbers.length < 10) {
        fillRandomNumers();
    }

    return num;
}
