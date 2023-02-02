const pupt = require("puppeteer");

const url = "https://finance.yahoo.com/quote/";
const search = "PETR4.SA"; /* mudar para entrada dinamica */
const histr = "/history";
const urlcode = url+search+histr;
const inputDate = "Mar 10, 1998"; /* input a ser dado dinamicamente */
const { TimeoutError } = require('puppeteer');
(async() => { 
    /* await pupt.launch espera o navegador do puppeteer iniciar, headless false mostra o navegador */
    const browser = await pupt.launch();

    /* abri uma nova aba */
    const browser = await pupt.launch({ args: ['--no-sandbox'] });


    /* log para saber se o navegador esta aberto */
    console.log('iniciou')

    await page.goto(urlcode);
    /* log para saber se o nevagor foi para a url correta */
    console.log(urlcode)

    /* espera os dados da pagina carregar */
    const date = await page.waitForXPath('//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr[2]/td[1]/span');     
    const open = await page.waitForXPath('//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr[2]/td[2]/span');
    const max = await page.waitForXPath('//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr[2]/td[3]/span')
    const min = await page.waitForXPath('//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr[2]/td[4]/span')
    const close = await page.waitForXPath('//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr[2]/td[5]/span')
    const priceAjust = await page.waitForXPath('//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr[2]/td[6]/span') 
    const vol = await page.waitForXPath('//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr[2]/td[7]/span') 

    /* obtem-se os dados da pagina após carregados como string */
    const actualDate = await date.evaluate((element) => element.textContent);
    const actualOpen =  await open.evaluate((element) => element.textContent);
    const actualMax = await max.evaluate((element) => element.textContent);
    const actualMin = await min.evaluate((element) => element.textContent);
    const actualClose = await close.evaluate((element) => element.textContent);
    const actualPriceAjst = await priceAjust.evaluate((element) => element.textContent);
    const actualVol = await vol.evaluate((element) => element.textContent);

    console.log(actualDate);
    console.log(actualOpen);
    console.log(actualMax);
    console.log(actualMin);
    console.log(actualClose);
    console.log(actualPriceAjst);
    console.log(actualVol); 

    /* fechar a ads de login */
    const ads = await page.waitForXPath('//*[@id="myLightboxContainer"]/section/button[1]');
    await ads.click();

    function verifyDate(data) {
      const date = require('date-and-time');
      const status = date.isValid(data, 'DD-MM-YYYY');
      return status;  
      }
      console.log(verifyDate(rewriteDate(inputDate)));
      console.log(rewriteDate(subTrans(inputDate)));
      console.log(rewriteDate(inputDate));
            
    const run = verifyDate(rewriteDate(inputDate));
      if (run) {
        seachAnswer(),
        await page.waitForTimeout(5000);
        const teste = await seachAnswer();
        console.log(teste);
        if (teste) {
          reqAnswer();
        } else {
          console.log('Invalid Date');
        }
      } else {
        console.log('Invalid Date');
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
    function rewriteDate(data) {
      let splitDate = data.split(`, `);
      let monthDay = splitDate[0].split(` `);
      let mes = monthDay[0];
          function monthSwitch(mes){ 
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
      let dia = monthDay[1];
          function daySwitch(dia){
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
      let ano = splitDate[1];
  
     return daySwitch(dia)+'-'+monthSwitch(mes)+'-'+ano      
    };

  async function seachAnswer(){
    try {
      /*  abre a janela de period  */
      const xpathPeriod = '//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[1]/div[1]/div[1]/div/div/div[1]';
      const period = await page.waitForXPath(xpathPeriod, { timeout: 10000 });                                     
      await period.click();

      /* insere a data de pesquisa inicial  */
      const xpathWindow = '//*[@id="dropdown-menu"]/div/div[1]/input';
      const windowTime1 = await page.waitForXPath(xpathWindow, { timeout: 10000 });
      await windowTime1.focus();
      await windowTime1.type(rewriteDate(subTrans(inputDate)));

      /* inse a data no campo de fim de pesquisa */
      const xpathWindow2 ='//*[@id="dropdown-menu"]/div/div[2]/input';
      const windowTime2 = await page.waitForXPath(xpathWindow2, { timeout: 10000 });
      await windowTime2.focus();
      await windowTime2.type(rewriteDate(inputDate));

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

  async function reqAnswer(){ 
    try {
      const xpathData = '//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr/td[1]/span';
      const dataAnswer = await page.waitForXPath(xpathData, { timeout: 10000 });
      const dateEvalAnswer = await dataAnswer.evaluate((element) => element.textContent);
      console.log(dateEvalAnswer);

      const xpathAbertura = '//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr/td[2]/span'
      const openAnswer = await page.waitForXPath(xpathAbertura);
      const openEvalAnswer =  await openAnswer.evaluate((element) => element.textContent);
      console.log(openEvalAnswer);

      const xpathMaxima = '//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr/td[3]/span'
      const maxAnswer = await page.waitForXPath(xpathMaxima);
      const maxEvalAnswer = await maxAnswer.evaluate((element) => element.textContent);
      console.log(maxEvalAnswer);

      const xpathMinima = '//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr/td[4]/span'
      const minAnswer = await page.waitForXPath(xpathMinima);
      const minEvalAnswer = await minAnswer.evaluate((element) => element.textContent);
      console.log(minEvalAnswer);

      const xpathFechamento = '//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr/td[5]/span'
      const closeAnswer = await page.waitForXPath(xpathFechamento);
      const closeEvalAnswer = await closeAnswer.evaluate((element) => element.textContent);
      console.log(closeEvalAnswer);

      const xpathPreço = '//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr/td[6]/span'
      const priceAjstAnswer = await page.waitForXPath(xpathPreço);
      const priceAjstEvalAnswer = await priceAjstAnswer.evaluate((element) => element.textContent);
      console.log(priceAjstEvalAnswer);

      const xpathVolume = '//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr/td[7]/span'
      const volAnswer = await page.waitForXPath(xpathVolume);
      const volEvalAnswer = await volAnswer.evaluate((element) => element.textContent);
      console.log(volEvalAnswer);
    } 
    catch (error) {console.error('Date Error code 503 (Unavailable)');};     
}  
 
/* fechar browser */   
await browser.close();

})();



