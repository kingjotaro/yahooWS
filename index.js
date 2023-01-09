const pupt = require("puppeteer");

const url = "https://finance.yahoo.com/quote/";
const search = "PETR4.SA"; /* mudar para entrada dinamica */
const histr = "/history";
const urlcode = url+search+histr;
const dataPesquisa = "Mar 10, 1998"; /* input a ser dado dinamicamente */
const { TimeoutError } = require('puppeteer');
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
    const datax = await page.waitForXPath('//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr[2]/td[1]/span');     
    const aberturax = await page.waitForXPath('//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr[2]/td[2]/span');
    const maximax = await page.waitForXPath('//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr[2]/td[3]/span')
    const minimax = await page.waitForXPath('//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr[2]/td[4]/span')
    const fechamentox = await page.waitForXPath('//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr[2]/td[5]/span')
    const preçoAjstx = await page.waitForXPath('//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr[2]/td[6]/span') 
    const volumex = await page.waitForXPath('//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr[2]/td[7]/span') 

    /* obtem-se os dados da pagina após carregados como string */
    const dataAtual = await datax.evaluate((element) => element.textContent);
    const aberturaAtual =  await aberturax.evaluate((element) => element.textContent);
    const maximaAtual = await maximax.evaluate((element) => element.textContent);
    const minimaAtual = await minimax.evaluate((element) => element.textContent);
    const fechamentoAtual = await fechamentox.evaluate((element) => element.textContent);
    const preçoAjst = await preçoAjstx.evaluate((element) => element.textContent);
    const volumeAtual = await volumex.evaluate((element) => element.textContent);

    console.log(dataAtual);
    console.log(aberturaAtual);
    console.log(maximaAtual);
    console.log(minimaAtual);
    console.log(fechamentoAtual);
    console.log(preçoAjst);
    console.log(volumeAtual); 


    /* fechar a propaganda de login */
    const propaganda = await page.waitForXPath('//*[@id="myLightboxContainer"]/section/button[1]');
    await propaganda.click();


    function verificaData(data) {
      const date = require('date-and-time');
      const status = date.isValid(data, 'DD-MM-YYYY');
      return status;  
      }
      console.log(verificaData(dataTransform(dataPesquisa)));
      console.log(dataTransform(subTrans(dataPesquisa)));
      console.log(dataTransform(dataPesquisa));
            

    const rodar = verificaData(dataTransform(dataPesquisa));
      if (rodar) {
        procuraResposta(),
        await page.waitForTimeout(5000);
        const teste = await procuraResposta();
        console.log(teste);
        if (teste) {
          pegaResposta();
        } else {
          console.log('Data invalida');
        }
      } else {
        console.log('Data invalida');
        await browser.close();
      }
      


 
    /* essa função subtrai um dia da data e transforma o mes em numero do tipo string*/
    function subTrans(dateString) {
        let date;
        try {
          date = new Date(Date.parse(dateString));
        } 
        catch (error) {
          console.error("Data invalida", dateString);
          return "Data invalida";
        }
        date.setDate(date.getDate() - 1);
        const mes3char = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const mesAbrevtn = mes3char[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();

        return `${mesAbrevtn} ${day}, ${year}`;
        }

      /*  essa função transforma o mes extenso para numeral string  */
    function dataTransform(data) {
      let partes = data.split(`, `);
      let mesdia = partes[0].split(` `);
      let mes = mesdia[0];
          function mesSwitch(mes){ 
              switch (mes){
                  case 'Dec' : return "12" 
                  case 'Nov' : return "11"
                  case 'Oct' : return "10"
                  case 'Sep' : return "09"
                  case 'Aug' : return "08"
                  case 'Jul' : return "07"
                  case 'Jun' : return "06"
                  case 'May' : return "05"
                  case 'Apr' : return "04"
                  case 'Mar' : return "03"
                  case 'Feb' : return "02" 
                  case 'Jan' : return "01" 
                  default: return 'Mês inválido'
              }
          };
      let dia = mesdia[1];
          function diaSwitch(dia){
            switch (dia){
              case '1' : return '01'
              case '2' : return '02'
              case '3' : return '03'
              case '4' : return '04'
              case '5' : return '05'
              case '6' : return '06'
              case '7' : return '07'
              case '8' : return '08'
              case '9' : return '09'
              default : return dia
            }
          }
      let ano = partes[1];
  
     return diaSwitch(dia)+'-'+mesSwitch(mes)+'-'+ano      
    };

  async function procuraResposta(){
    try {
      /*  abre a janela de periodo  */
      const xpathPerido = '//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[1]/div[1]/div[1]/div/div/div[1]';
      const periodo = await page.waitForXPath(xpathPerido, { timeout: 10000 });                                     
      await periodo.click();

      /* insere a data de pesquisa inicial  */
      const xpathWindow = '//*[@id="dropdown-menu"]/div/div[1]/input';
      const windowTime1 = await page.waitForXPath(xpathWindow, { timeout: 10000 });
      await windowTime1.focus();
      await windowTime1.type(dataTransform(subTrans(dataPesquisa)));

      /* inse a data no campo de fim de pesquisa */
      const xpathWindow2 ='//*[@id="dropdown-menu"]/div/div[2]/input';
      const windowTime2 = await page.waitForXPath(xpathWindow2, { timeout: 10000 });
      await windowTime2.focus();
      await windowTime2.type(dataTransform(dataPesquisa));

      /* clica no botão done e aplicar */
      const xpathButton ='//*[@id="dropdown-menu"]/div/div[3]/button[1]';
      const buttonDone = await page.waitForXPath(xpathButton, { timeout: 10000});                                 
      await buttonDone.click(); 
      const buttonApply = await page.waitForXPath('//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[1]/div[1]/button');                                            
      await buttonApply.click();  
      return true; 
    } catch (error) {
      if (error instanceof TimeoutError) {
        return false; 
      } else {
        throw error; 
      }
    }
  }
  
  
  
  


  async function pegaResposta(){ 
    try {
      const xpathData = '//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr/td[1]/span';
      const dataRes = await page.waitForXPath(xpathData, { timeout: 10000 });
      const dataEvalresposta = await dataRes.evaluate((element) => element.textContent);
      console.log(dataEvalresposta);

      const xpathAbertura = '//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr/td[2]/span'
      const aberturaRes = await page.waitForXPath(xpathAbertura);
      const aberturaEvalresposta =  await aberturaRes.evaluate((element) => element.textContent);
      console.log(aberturaEvalresposta);

      const xpathMaxima = '//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr/td[3]/span'
      const maximaRes = await page.waitForXPath(xpathMaxima);
      const maximaEvalresposta = await maximaRes.evaluate((element) => element.textContent);
      console.log(maximaEvalresposta);

      const xpathMinima = '//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr/td[4]/span'
      const minimaRes = await page.waitForXPath(xpathMinima);
      const minimaEvalresposta = await minimaRes.evaluate((element) => element.textContent);
      console.log(minimaEvalresposta);

      const xpathFechamento = '//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr/td[5]/span'
      const fechamentoRes = await page.waitForXPath(xpathFechamento);
      const fechamentoEvalresposta = await fechamentoRes.evaluate((element) => element.textContent);
      console.log(fechamentoEvalresposta);

      const xpathPreço = '//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr/td[6]/span'
      const preçoAjtsRes = await page.waitForXPath(xpathPreço);
      const preçoAJtsEvalresposta = await preçoAjtsRes.evaluate((element) => element.textContent);
      console.log(preçoAJtsEvalresposta);

      const xpathVolume = '//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr/td[7]/span'
      const volumeRes = await page.waitForXPath(xpathVolume);
      const volumeEvalresposta = await volumeRes.evaluate((element) => element.textContent);
      console.log(volumeEvalresposta);
    } 
    catch (error) {console.error('Data não disponivel');};     
}  
 
    

/* fechar browser */   
await browser.close();

})();



