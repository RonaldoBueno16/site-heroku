$(document).ready(function(){
	$("#enviar").submit(function(event){
        $("#send").attr('disabled', 'disabled');
    });
});

$("#enviar").on("click", () => {
    const esp_id = $("#espname")[0].value.replace(",",".");
    const umidade = $("#umidade")[0].value.replace(",",".");
    const temperatura = $("#temperatura")[0].value.replace(",",".");
    const pressao_atmosferica = $("#pressao_atmosferica")[0].value.replace(",",".");
    const latitude = $("#latitude")[0].value.replace(",",".");
    const longitude = $("#longitude")[0].value.replace(",",".");
    const esta_chovendo = $("#chovendo")[0].value.replace(",",".");
    
    if(esp_id == "")
        alert("Você precisa definir o nome do ESP");
    else if(umidade == "")
        alert("Você precisa definir a umidade");
    else if(temperatura == "")
        alert("Você precisa definir a temperatura");
    else if(pressao_atmosferica == "")
        alert("Você precisa definir a pressão atmosférica");
    else if(latitude == "")
        alert("Você precisa definir a latitude");
    else if(longitude == "")
        alert("Você precisa definir a longitude");
    else if(esta_chovendo == -1)
        alert("Você precisa dizer se está chovendo");

    $.ajax({
        method: 'POST',
        url: 'https://api-dados-climaticos.herokuapp.com/inserirdados',
        dataType: "application/JSON",
        data: {
            "esp_id": esp_id,
            "umidade": umidade,
            "esta_chovendo": esta_chovendo,
            "temperatura": temperatura,
            "pressao_atmosferica": pressao_atmosferica,
            "latitude": latitude,
            "longitude": longitude
        },

        error: (response) => {
            if(response.status == 200) {
                alert("Inserido com sucesso! Codigo do registro: " + response.responseText);   
            }
        },
    })
})
$("#searchone").on("click", () => {
    const esp_id = $("#espnameone")[0].value;
    if(esp_id == "") {
        alert("Você precisa definir qual ESP você deseja procurar");
    }
    else {
        $.ajax({
            method: "GET",
            url: "https://api-dados-climaticos.herokuapp.com/coletardados/"+esp_id,

            success: (data) => {
                montarTabela(data);
            },
            error: (err) => {
                console.log(err);
            }
        })
    }
})
$("#searchmax").on("click", () => {
    $.ajax({
        method: "GET",
        url: "https://api-dados-climaticos.herokuapp.com/coletardadosmax",

        success: (data) => {
            montarTabela(data);
        },
        error: (err) => {
            console.log(err);
        }
    })
})
$("#searchall").on("click", () => {
    $.ajax({
        method: "GET",
        url: "https://api-dados-climaticos.herokuapp.com/coletardadostodos",

        success: (data) => {
            montarTabela(data);
        },
        error: (err) => {
            console.log(err);
        }
    })
})

function montarTabela(dados) {
    const tabelaExistente = $("table > tbody > tr");
    tabelaExistente.each((index, element) => {
        console.log(element.remove());
    })
    
    const tabela = $("table > tbody")[0];
    let tr_element;
    let td;
    dados.forEach((index) => {
        console.log(index);

        tr_element = document.createElement("tr");
        tabela.appendChild(tr_element);

        //ID
        td = document.createElement("th");
        tr_element.appendChild(td);
        td.textContent = index.id;

        //Data
        td = document.createElement("td");
        tr_element.appendChild(td);

        var fullDate = new Date(index.datadoregistro);
        var twoDigitMonth = fullDate.getMonth() + "";
        if (twoDigitMonth.length == 1)
            twoDigitMonth = "0" + twoDigitMonth;
        var twoDigitDate = fullDate.getDate() + "";
        if (twoDigitDate.length == 1)
            twoDigitDate = "0" + twoDigitDate;

        var twoDigitHour = fullDate.getHours() + "";
        if (twoDigitHour.length == 1)
            twoDigitHour = "0" + twoDigitHour;
        var twoDigitMinute = fullDate.getMinutes() + "";
        if (twoDigitMinute.length == 1)
            twoDigitMinute = "0" + twoDigitMinute;
        var twoDigitSeconds = fullDate.getSeconds() + "";
        if (twoDigitSeconds.length == 1)
            twoDigitSeconds = "0" + twoDigitSeconds;
        var currentDate = twoDigitDate + "/" + twoDigitMonth + "/" + fullDate.getFullYear() + " " + twoDigitHour + ":" + twoDigitMinute + ":" + twoDigitSeconds;

        console.log(currentDate);
        
        td.textContent = currentDate;

        //Nome
        td = document.createElement("td");
        tr_element.appendChild(td);
        td.textContent = index.esp_id;

        //Umidade
        td = document.createElement("td");
        tr_element.appendChild(td);
        td.textContent = index.umidade+"g/Kg";

        //Temperatura
        td = document.createElement("td");
        tr_element.appendChild(td);
        td.textContent = index.temperatura+"ºC";

        //Pressão atmosférica
        td = document.createElement("td");
        tr_element.appendChild(td);
        td.textContent = index.pressao_atmosferica+"atm";

        //Latitude
        td = document.createElement("td");
        tr_element.appendChild(td);
        td.textContent = index.latitude+"°";

        //Longitude
        td = document.createElement("td");
        tr_element.appendChild(td);
        td.textContent = index.longitude+"°";
        
        //Está chovendo?
        td = document.createElement("td");
        tr_element.appendChild(td);
        td.textContent = index.esta_chovendo ? ("Sim") : ("Não");
    })
    

}