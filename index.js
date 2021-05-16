const cheerio = require('cheerio');
const request=require('request');
const express=require('express');
const { response } = require('express');
const app=express();



app.get('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.status(200).send("please check documentation");
  })

  
  app.get('/:pnr', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    const pnr=req.params.pnr;
    request(`https://www.railyatri.in/pnr-status/${pnr}`,(error,response,html)=>{
    const $ = cheerio.load(html);
    const status=200;
    const chart_prepared=$("#status-chart > div > div > div.col-xs-3 > p.chart-status-txt").text();
    const from=$("#homepage-main-container > div.row > div.container.no-pad > div.pnr-search-result-blk > div.pnr-search-result-info > div > div.train-route > div:nth-child(1) > p.pnr-bold-txt").text().replace(/\n/g, '').trim();
    const current_status=$("#status-chart > div > div > div:nth-child(2) > p.pnr-bold-txt").text().replace(/\n/g, '').trim();
    const boarding_time=$("#homepage-main-container > div.row > div.container.no-pad > div.pnr-search-result-blk > div.pnr-search-result-info > div > div.train-route > div:nth-child(1) > p:nth-child(3)").text().replace(/\n/g, '').trim();
    const to=$("#homepage-main-container > div.row > div.container.no-pad > div.pnr-search-result-blk > div.pnr-search-result-info > div > div.train-route > div:nth-child(2) > p.pnr-bold-txt").text().replace(/\n/g, '').trim();
    const arrival_time=$("#homepage-main-container > div.row > div.container.no-pad > div.pnr-search-result-blk > div.pnr-search-result-info > div > div.train-route > div:nth-child(2) > p:nth-child(3)").text().replace(/\n/g, '').trim();
    const hr=$("#homepage-main-container > div.row > div.container.no-pad > div.pnr-search-result-blk > div.pnr-search-result-info > div > div.train-route > div:nth-child(3) > span:nth-child(2)").text().replace(/\n/g, '').trim();
    const min=$("#homepage-main-container > div.row > div.container.no-pad > div.pnr-search-result-blk > div.pnr-search-result-info > div > div.train-route > div:nth-child(3) > span:nth-child(3)").text().replace(/\n/g, '').trim();
    const duration=hr + " : "+ min; 
    const day=$("#homepage-main-container > div.row > div.container.no-pad > div.pnr-search-result-blk > div.pnr-search-result-info > div > div.boarding-detls > div:nth-child(1) > p.pnr-bold-txt").text();
    // #status > div:nth-child(1)
    const number_of_passenger=$("#status").children().length;

    let count=1;
    let pass=[];
    for(let i=1;i<number_of_passenger-1;i++)
    {
      let book_status=$("#status > div:nth-child(2) > div:nth-child(1) > p").text().replace(/\n/g, '').trim();
      let curr_status=$("#status > div:nth-child(2) > div:nth-child(2) > p").text().replace(/\n/g, '').trim();
      let detail={passenger:"passenger"+count,booking_status:book_status,current_status:curr_status}
      pass.push(detail)
      count++
    }
    const data=[status,{pnr,current_status,chart_prepared,from,boarding_time,to,arrival_time,duration,day,total_pass:number_of_passenger-2,pass,count}]
    res.send(data)
  })
})

  app.listen(3000);