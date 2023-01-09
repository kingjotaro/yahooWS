const pupt = require("puppeteer");

const url = "https://finance.yahoo.com/quote/";
const search = "PETR4.SA"; /* mudar para entrada dinamica */
const histr = "/history";
const urlcode = url+search+histr;
const dataPesquisa = "2001-03-14"; /* mudar para entrada dinamica yyyy/mm/dd */

(async() => { 
    /* await pupt.launch espera o navegador do puppeteer iniciar, headless false mostra o navegador */
    const browser = await pupt.launch({headless: false});

    /* abri uma nova aba */
    const page = await browser.newPage();

    /* log para saber se o navegador esta aberto */
    console.log('iniciou')

    await page.goto(urlcode);
    /* log para saber se o nevagor foi para a url correta */
    console.log(urlcode)

    /* espera os dados da pagina carregar */
    const datax = await page.waitForXPath('//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr[1]/td[1]/span');     
    const aberturax = await page.waitForXPath('//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr[1]/td[2]/span');
    const maximax = await page.waitForXPath('//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr[1]/td[3]/span')
    const minimax = await page.waitForXPath('//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr[1]/td[4]/span')
    const fechamentox = await page.waitForXPath('//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr[1]/td[5]/span')
    const volumex = await page.waitForXPath('//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr[1]/td[7]/span')

    /* obtem-se os dados da pagina após carregados como string */
    const dataAtual = await datax.evaluate((element) => element.textContent);
    const aberturaAtual =  await aberturax.evaluate((element) => element.textContent);
    const maximaAtual = await maximax.evaluate((element) => element.textContent);
    const minimaAtual = await minimax.evaluate((element) => element.textContent);
    const fechamentoAtual = await fechamentox.evaluate((element) => element.textContent);
    const volumeAtual = await volumex.evaluate((element) => element.textContent);
    console.log(dataAtual);
    console.log(aberturaAtual);
    console.log(maximaAtual);
    console.log(minimaAtual);
    console.log(fechamentoAtual);
    console.log(volumeAtual);

    /* fechar a propaganda de login */
    const propaganda = await page.waitForXPath('//*[@id="myLightboxContainer"]/section/button[1]');
    await propaganda.click();

 
    
    /* função que pega os dados publicados do ultimo dia e transforma para o modelo Date JS ***atualizar para deixar dinamico  */
    const dta = dataAtual
    function dataSplit(dataAtual) {
        let partes = dataAtual.split(`, `);
        let mesdia = partes[0].split(` `);
        let mes = mesdia[0];
            function mesSwitch(mes){ 
                switch (mes){
                    case 'Dec' : return "12" 
                    case 'Nov' : return "11"
                    case 'Oct' : return "10"
                    case 'Sep' : return "9"
                    case 'Aug' : return "8"
                    case 'Jul' : return "7"
                    case 'Jun' : return "6"
                    case 'May' : return "5"
                    case 'Apr' : return "4"
                    case 'Mar' : return "3"
                    case 'Feb' : return "2" 
                    case 'Jan' : return "1" 
                    default: return 'Mês inválido'
                }
            };
        let dia = mesdia[1];
        let ano = partes[1];
    
       return ano+'-'+mesSwitch(mes)+'-'+dia      
    };
    
    /* await para visualizar melhor apgar dps */
    await page.waitForTimeout(4000);

    /* função que pega o valor da ultima data disponivel e subtrai com a data do request*/
   /*  function Difdays(dataIni, dataPesquisada) {
        let dataFinal = new Date(dataSplit(dataIni));
        let dataInicial = new Date(dataPesquisada);
        let diferencaMili = dataFinal.getTime() - dataInicial.getTime();
        let diferencaDias = diferencaMili/86400000;
        return diferencaDias;
    } */

    console.log(Difdays(dataAtual, dataPesquisa));


    /* funçao que ajusta a diferença de data */
   /*  function Dayscorrection(funcDifdays){
        if (funcDifdays>30) {
            let days = (funcDifdays/30);
            let days1 = days*9;
            let days2 = funcDifdays-days1;
            return days2;
        } else {
        return funcDifdays;}
    }; */

     /*  clica no periodo para aumentar o range da pagina  */
    const periodo = await page.waitForXPath('//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[1]/div[1]/div[1]/div/div/div/span');                                        
    await periodo.click();

    /* clicar no botão de periodo maximo  */
    const maxperiod = await page.waitForXPath('//*[@id="dropdown-menu"]/div/ul[2]/li[4]/button');
    await maxperiod.click();
     /* aplicar o periodo maximo na tabela  */
    const buttonApply = await page.waitForXPath('//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[1]/div[1]/button');                                            
    await buttonApply.click();  

    /* presisonar N vezes pagedown para a paginar carregar mais dados */
     const NumberPageDown = Difdays(dataAtual, dataPesquisa)/12;
    for (let Acumulador = 0; Acumulador < NumberPageDown; Acumulador++) {
        await page.keyboard.press('PageDown');
        await page.waitForTimeout(85);
      } 

      
    /* cria o link e pega a data aproximada após ajustar a diferença entre datas ***atualizar para deixar dinamica o final das tabelas */
    const dataAfter = Math.round(Dayscorrection(Difdays(dta, dataPesquisa)));
    const datalink = await page.waitForXPath('//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr'+"["+dataAfter+']'+"/td[1]/span");                                             
    const dataTeste = await datalink.evaluate((element) => element.textContent);
    
    console.log(dataSplit(dataTeste));

    


    /*  export function dataRef(datas) {

    } */

    /* const linha = tr[dataRef]

    export function colunaRef(colunas) {
        switch (colunas) {
          case 'data'      : return 1
          case 'abertura'  : return 2
          case 'maxima'    : return 3
          case 'minima'    : return 4
          case 'fechamento': return 5
          case 'volume'    : return 7

          default: return 5             
        };
    } */

  /*   const coluna = /td[colunaRef]/span' * */


//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr[245]/td[1]/span
//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr[495]/td[1]/span
    
/* fazer paginar esperar algum tempo */    
    await page.waitForTimeout(5000);
/* fechar browser */   
    await browser.close();

})();



