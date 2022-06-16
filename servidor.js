const http = require('http')
const fs = require('fs')

const host = '127.0.0.1'
const puerto = 9000

const servidor = http.createServer((req, res) => {
    res.writeHead(200, {'content-Type': 'text/html'})
    fs.readFile('./dist/web3.html', (error, información) =>{
        if(error){
            res.writeHead(404)
            res.write("archivo no encontrado")
        } else {
            res.write(información)         
        }
        res.end()
    })
    fs.readFile('./src/web3.js', (error, información) =>{
        if(error){
            res.writeHead(404)
            res.write("archivo no encontrado")
        } else {
            res.write(información)
        }
        res.end()
    })
})

servidor.listen(puerto, host, () =>{
    console.log('Servidor esta funcionando en ', host, puerto)
})