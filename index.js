const http = require('http');
const fs = require('fs');
const axios = require('axios')


let pokemones = [];
let pokeArreglo = [];


async function pokemonesGet() {
    const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150')
    return data.results
}

async function getData(name) {
    const { data } = await
        axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
    return data
}

pokemonesGet().then((results) => {
    results.forEach((p) => {
        let pokemonName = p.name
        pokemones.push(getData(pokemonName))
    })

    Promise.all(pokemones).then((data) => {
        data.forEach((p) => {
            pokeArreglo.push({nombre: p.name, img: p.sprites.front_default});
        });
    });

});

http
    .createServer((req, res) => {

        if (req.url == '/') {
            res.writeHead(200, { 'Content-Type': 'text/html' })
            fs.readFile('index.html', 'utf8', (err, html) => {
                res.end(html);
            });
        };

        if (req.url == '/pokemones') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(pokeArreglo));
            res.end();
        };

    }).listen(3000, () => console.log('Servidor corriendo'));