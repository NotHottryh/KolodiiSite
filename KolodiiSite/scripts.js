
async function fetchMarket(coins) {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=' + coins.join(',') + '&order=market_cap_desc&per_page=100&page=1&sparkline=true');
    const data = await res.json();
    data.forEach(item => {
      const id = item.id;
      const priceEl = document.getElementById(id + '-price');
      const changeEl = document.getElementById(id + '-change');
      const canvasId = id + '-spark';
      if(priceEl) priceEl.innerText = item.symbol.toUpperCase() + ' — $' + Math.round(item.current_price).toLocaleString();
      if(changeEl) changeEl.innerText = (item.price_change_percentage_24h>0?'+':'') + item.price_change_percentage_24h.toFixed(2) + '% (24h)';
      if(item.sparkline_in_7d && item.sparkline_in_7d.price){
        drawSpark(canvasId, item.sparkline_in_7d.price.slice(-50));
      }
    });
  } catch(err){
    console.error('Market fetch error', err);
  }
}

function drawSpark(id, data){
  const c = document.getElementById(id);
  if(!c) return;
  const ctx = c.getContext('2d');
  const w = c.width, h = c.height;
  ctx.clearRect(0,0,w,h);
  const min = Math.min(...data);
  const max = Math.max(...data);
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#00eaff';
  ctx.moveTo(0, h - ( (data[0]-min)/(max-min) * h ));
  for(let i=1;i<data.length;i++){
    const x = i/(data.length-1) * w;
    const y = h - ( (data[i]-min)/(max-min) * h );
    ctx.lineTo(x,y);
  }
  ctx.stroke();
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fillStyle = 'rgba(0,234,255,0.06)';
  ctx.fill();
}

document.addEventListener('DOMContentLoaded', function(){
  const btn = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');
  if(btn && nav){
    btn.addEventListener('click', ()=> {
      nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
  }
  fetchMarket(['bitcoin','ethereum','solana']);
  setInterval(()=>fetchMarket(['bitcoin','ethereum','solana']), 60000);
});
