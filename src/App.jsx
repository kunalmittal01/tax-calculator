import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [active, setActive] = useState("flex");
  const [state, setState] = useState({
    purchase: "",
    sale: "",
    expense: "",
    invType: "",
    taxRate: "0%",
    annInc: "0",
    capGain: "",
    longGain: "",
    netTax: "",
    payTax: ""
  })
  const taxRate = {
    "0": '0%',
    "18201": 'Nil + 19% of excss over $ 18,200',
    "45001": '$5,092 + 32.5% of excess over $ 45,000',
    "120001": '$29,467 + 37% of excess over $ 120,000',
    "180001": '$51,667 + 45% of excess over $ 180,000' 
  }
  const taxPer = {
    '0%': '0',
    'Nil + 19% of excss over $ 18,200': '19',
    '$5,092 + 32.5% of excess over $ 45,000': '32.5',
    '$29,467 + 37% of excess over $ 120,000': '37',
    '$51,667 + 45% of excess over $ 180,000': '45'
  }
  const handleInputChange = (e) => {
    if(e.target.name=='annInc') {
      setState({...state, taxRate: taxRate[e.target.value], annInc: e.target.value})
      return;
    }
    setState({...state, [e.target.name]: e.target.value })
  }

  const handleCalculations = () => {
    console.log(state.sale)
    console.log(state.purchase)
    console.log(state.expense)
    const cg = Number(state.sale) - Number(state.purchase - state.expense);
    let discount=0, ncg = Math.abs(cg-discount);
    if(cg > 0 && state.invType == 'long') {
      discount = 0.5 * cg;
      ncg = cg - discount;
    }
    const taxrate = Number(taxPer[taxRate[state.annInc]]) * 0.01;
    const tax = taxrate * ncg;
    console.log(cg,discount, taxRate)
    console.log(taxPer[taxRate[state.annInc]])
    setState({...state, capGain: cg, longGain: discount, netTax: ncg, payTax: tax})
  }

  const toggleInvType = (e) => {

    if(e.target.innerText.includes('Short')) {
      setState({...state, invType: "short"})
      setActive('none')
    }
    else {
      setState({...state, invType: "long"})
      setActive('flex');
    }
  }
  useEffect(()=>{
    if(state.purchase && state.sale && state.annInc && state.invType) {
      handleCalculations();
    }
  },[state.purchase,state.expense,state.sale,state.annInc,state.invType]);
  return (
    <>
      <div className="tax-cal rounded-md mx-auto shadow px-10 py-6 mt-10">
        <p className='text-center text-2xl font-semibold '>Free Crypto Tax Calculator Australia</p>
        <div className="row0 flex flex-col items-center gap-5  md:flex-row md:justify-between pb-5 my-8 border-b border-gray-300">
          <div className="year flex items-center gap-2">
            <p>Financial Year</p>
            <select className='bg-slate-300 px-2 py-1 rounded' name="year" id="">
              <option value="2023-24">FY 2023-24</option>
            </select>
          </div>
          <div className="country flex justify-start">
            <div className="wrap flex items-center gap-2">
              <p>Country</p>
              <select className='bg-slate-300 px-2 py-1 rounded' name="country" id="">
                <option value="Australia">Australia</option>
              </select>
            </div>
          </div>
        </div>
        <div className="row1 flex flex-col items-center gap-10 md:flex-row md:justify-between">
          <div className="price-pur">
            <p className='text-gray-800 mb-2'>Enter purchase price of crypto</p>
            <input onChange={handleInputChange} name='purchase' className='px-2 py-1 focus:outline-none bg-slate-300  rounded-md text-slate-700 border-gray-200' type="text" placeholder='purchase price'/>
          </div>
          <div className="price-sale">
            <p className='text-gray-800 mb-2'>Enter sale price of crypto</p>
            <input onChange={handleInputChange} name='sale' className='px-2 py-1 focus:outline-none bg-slate-300  rounded-md text-slate-700' type="text" placeholder='sale price'/>
          </div>
        </div>
        <div className="row2 flex flex-col md:flex-row items-center gap-10 md:justify-between my-10">
          <div className="exp">
            <p className='text-gray-800 mb-2'>Enter your Expenses</p>
            <input onChange={handleInputChange} name='expense' className='px-2 py-1 focus:outline-none bg-slate-300  rounded-md text-slate-700 border-gray-200' type="text" placeholder='expense'/>
          </div>
          <div className="invest">
            <p className='text-gray-800 mb-2'>Investment Type</p>
            <div className="invest-btn flex">
              <div className="shortterm">
                <button onClick={toggleInvType} className={`px-4 py-2 ${state.invType=='short'?"activebtn":""} rounded-md border border-slate-800`}>Short Term</button>
                <p>{"< 12 months"}</p>
              </div>
              <div className="longterm ml-2 flex flex-col items-end">
                <button onClick={toggleInvType} className={`px-4 ${state.invType=="long"?"activebtn":""} py-2 rounded-md border border-slate-800`}>Long Term</button>
                <p>{"> 12 months"}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row3 flex items-center gap-10 flex-col md:flex-row md:justify-between">
          <div className="income">
            <p className='mb-2'>Select Annual Income</p>
            <select onChange={handleInputChange} className='bg-slate-300 px-2 py-1 rounded' name="annInc" id="">
              <option value="0">$0 - $18,200</option>
              <option value="18201">$18,201 - $45,000</option>
              <option value="45001">$45,001 - $120,000</option>
              <option value="120001">$120,001 - $180,000</option>
              <option value="180001">$180,001+</option>
            </select>
          </div>
          <div className="tax-rate">
            <p className='mb-2'>Tax Rate</p>
            <p className=''>{state.taxRate}</p>
          </div>
        </div>
        <div className={`row4 ${active=="flex" ? "flex" : "hidden" } justify-between mt-10`}>
          <div className="cap-gains">
            <p className='mb-2'>Capital gains amount</p>
            <p className='px-2 py-1 h-8 bg-slate-300  rounded-md text-slate-700 border-gray-200' type="text" placeholder='long-term gains'>{state.capGain}</p>
          </div>
          <div className="long-gains">
            <p className='mb-2'>Discount long term gains</p>
            <p className='px-2 py-1 h-8 bg-slate-300  rounded-md text-slate-700 border-gray-200'>{state.longGain}</p>
          </div>
        </div>
        <div className="row5 mt-10 flex flex-col items-center md:flex-row gap-10 md:justify-between">
          <div className="net-tax bg-sky-100 px-3 py-2 flex flex-col items-center">
            <p className='mb-2'>Net Capital gains tax amount</p>
            <p>{state.netTax}</p>
          </div>
          <div className="tax-need flex flex-col items-center px-3 py-2 bg-sky-100">
            <p className='mb-2'>The tax you need to pay*</p>
            <p>{state.payTax}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
