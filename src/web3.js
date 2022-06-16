const Web3 = require('web3');


window.onload = () => {
  // Variables
  let web3;
  let from;

  // Elements
  const connectButton = document.getElementById('connect');
  const content = document.getElementById('content');
  const account = document.getElementById('account');
  const historial = document.getElementById('historial');
  const modificar = document.getElementById('modificar');
  const cerrar_session = document.getElementById('cerrar_session');
  
  // Form
  const form = document.getElementById('send');
  const amountInput = document.getElementById('amount');
  const recipientInput = document.getElementById('recipient');



  // Functions
  const connect = async () => {

    if (window.ethereum) {
      web3 = new Web3(window.ethereum);

      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        historial.removeAttribute("hidden");
        modificar.removeAttribute("hidden");
        cerrar_session.removeAttribute("hidden");

        connectButton.style.display = 'none';
        content.style.display = 'initial';


        const accounts = await web3.eth.getAccounts();

        from = accounts[0];
        account.innerText = from;

        const valorether = web3.utils.fromWei('1', 'ether');
        const weis = await web3.eth.getBalance(from);
        const saldo = valorether * weis;
        localStorage.setItem("saldo", saldo);
        
        sessionStorage.setItem('conectado', 1);

        setInterval(() => {
         
          if (accounts[0] != null) {
            console.log(accounts)
            console.log(`[+]Actualmente estas conectado !`);
          } else {
            desconectar
          }
        }, 1000);
        
      } catch (err) {
        // alert('Ha ocurrido un error');
        console.log(`[-]Algo ocurre mal ${err}`)
      }
    } else {
      alert('Conexion fallida de tu metamask. Comprueba si tienes instalado metamask');
    }
  };


  const transact = async (event) => {

    event.preventDefault();
    const amount = amountInput.value;
    const recipient = recipientInput.value;
    const valorweis = web3.utils.toWei('1', 'ether');
    const valorfinal = amount * valorweis;
    console.log(amount);

    if (!web3.utils.isAddress(recipient)) {
      alert('Dirección inválida');
      return;
    }

    if (Number(amount) <= 0) {
      alert('Cantidad inválida');
      return;
    }

   
      
    

    web3.eth.net.getId(function (error, id) {
      if (error) {
        alert('Id no encontrada');
      } else {
        if (id == 4) {
          web3.eth.sendTransaction({
            from: from,
            to: recipient,
            value: valorfinal,
          }, function (error, hash) {
            if (error) {
              alert('Transaccion no realizada');
            } else {

              const informacion = {
                account: $('#account').val(),
                recipient: $('#recipient').val(),
                amount: $('#amount').val(),
                account: from
              };

              $.post('http://localhost/php/Proyecto/prueba/web3-intro-completed/php/conexion.php', informacion, function (respuesta) {
                console.log(respuesta);
              });


            }
          })
        } else {
          alert('Esta red no es posible realizar una transacción');
        }

      };
    })


  };
  const cache = window.onload = function (cache) {

    var conectado = sessionStorage.getItem('conectado');
    if (conectado == 1) {
      connect()
    }
  }
 
  cache()

  const desconectar = function () {
    sessionStorage.setItem('conectado', 2);
  }


  // Listeners
  connectButton.onclick = connect;
  form.onsubmit = transact;
  cerrar_session.onclick = desconectar;
}



